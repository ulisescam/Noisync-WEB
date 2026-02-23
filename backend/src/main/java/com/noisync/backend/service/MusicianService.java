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
    public void softRemoveMusician(Long bandId, Long musicianId, boolean removeInstrumentAssignments) {

        // Validar que sea músico de la banda
        Integer ok = jdbc.queryForObject("""
            SELECT COUNT(*) FROM app_user
            WHERE user_id = ? AND band_id = ? AND rol = 'MUSICIAN'
        """, Integer.class, musicianId, bandId);

        if (ok == null || ok == 0) {
            throw new IllegalArgumentException("Musico no encontrado");
        }

        // Marcar como bloqueado/inactivo
        int updated = jdbc.update("""
            UPDATE app_user
            SET activo = 0,
                estatus = 'BLOQUEADO',
                locked_until = NULL,
                failed_attempts = 0
            WHERE user_id = ?
        """, musicianId);

        if (updated == 0) throw new IllegalArgumentException("Musico no encontrado");

        // Opcional: quitar instrumentos asignados
        if (removeInstrumentAssignments) {
            jdbc.update("DELETE FROM musician_instrument WHERE user_id = ?", musicianId);
        }
    }
    @Transactional
    public void activateMusician(Long bandId, Long musicianId, boolean forcePasswordChange) {

        Integer ok = jdbc.queryForObject("""
        SELECT COUNT(*) FROM app_user
        WHERE user_id = ? AND band_id = ? AND rol = 'MUSICIAN'
    """, Integer.class, musicianId, bandId);

        if (ok == null || ok == 0) {
            throw new IllegalArgumentException("Musico no encontrado");
        }

        int updated = jdbc.update("""
        UPDATE app_user
        SET activo = 1,
            estatus = 'ACTIVO',
            failed_attempts = 0,
            locked_until = NULL,
            primer_login = CASE WHEN ? = 1 THEN 1 ELSE primer_login END
        WHERE user_id = ?
    """, forcePasswordChange ? 1 : 0, musicianId);

        if (updated == 0) throw new IllegalArgumentException("Musico no encontrado");
    }
}