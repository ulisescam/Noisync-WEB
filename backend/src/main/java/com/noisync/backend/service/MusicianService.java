package com.noisync.backend.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MusicianService {

    private final JdbcTemplate jdbc;

    public MusicianService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public void hardRemoveMusician(Long bandId, Long musicianId) {

        // 1. Validar que sea músico activo de la banda
        Integer ok = jdbc.queryForObject("""
            SELECT COUNT(*) FROM app_user
            WHERE user_id = ? AND band_id = ? AND rol = 'MUSICIAN'
        """, Integer.class, musicianId, bandId);

        if (ok == null || ok == 0) {
            throw new IllegalArgumentException("Músico no encontrado en esta banda");
        }

        // 2. Obtener el person_id antes de borrar app_user
        Long personId = jdbc.queryForObject(
                "SELECT person_id FROM app_user WHERE user_id = ?",
                Long.class, musicianId
        );

        // 3. Borrar en orden respetando FK

        // Email verification tokens (FK → app_user)
        jdbc.update("DELETE FROM email_verification_token WHERE user_id = ?", musicianId);

        // Refresh tokens (FK → app_user)
        jdbc.update("DELETE FROM refresh_token WHERE user_id = ?", musicianId);

        // Invitaciones de banda (FK → app_user)
        jdbc.update("DELETE FROM band_invitation WHERE user_id = ?", musicianId);

        // Instrumentos asignados (FK → app_user)
        jdbc.update("DELETE FROM musician_instrument WHERE user_id = ?", musicianId);

        // App user
        jdbc.update("DELETE FROM app_user WHERE user_id = ?", musicianId);

        // Person (datos personales — solo si no tiene otros usuarios asociados)
        Integer otrosUsuarios = jdbc.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE person_id = ?",
                Integer.class, personId
        );
        if (otrosUsuarios != null && otrosUsuarios == 0) {
            jdbc.update("DELETE FROM person WHERE person_id = ?", personId);
        }
    }
}
