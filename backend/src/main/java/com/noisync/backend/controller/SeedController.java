package com.noisync.backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
public class SeedController {

    private final JdbcTemplate jdbc;
    private final PasswordEncoder encoder;

    public SeedController(JdbcTemplate jdbc, PasswordEncoder encoder) {
        this.jdbc = jdbc;
        this.encoder = encoder;
    }

    @PostMapping("/seed-leader")
    public Map<String, Object> seedLeader() {

        String correo = "leader@noisync.com";
        String username = "leader1";
        String rawPassword = "1234";
        String passwordHash = encoder.encode(rawPassword);

        jdbc.update("DELETE FROM band_invitation");
        jdbc.update("DELETE FROM email_verification");
        jdbc.update("DELETE FROM password_reset");
        jdbc.update("DELETE FROM musician_instrument");
        jdbc.update("DELETE FROM song_section");
        jdbc.update("DELETE FROM song");
        jdbc.update("DELETE FROM instrument");
        jdbc.update("DELETE FROM app_user");
        jdbc.update("DELETE FROM band_social");
        jdbc.update("DELETE FROM band");
        jdbc.update("DELETE FROM person");

        // 1) Crear band
        jdbc.update("""
    INSERT INTO band (nombre, descripcion, genero_musical, leader_user_id)
    VALUES (?, ?, NULL, NULL)
""", "Noisync Band", "Banda de prueba");

        Long bandId = jdbc.queryForObject("SELECT MAX(band_id) FROM band", Long.class);

        // 2) Crear person
        jdbc.update("""
        INSERT INTO person (nombre_completo, telefono, correo, correo_verificado)
        VALUES (?, ?, ?, 1)
    """, "Leader Demo", "7770000000", correo);

        Long personId = jdbc.queryForObject("SELECT MAX(person_id) FROM person", Long.class);

        // 3) Crear app_user (LEADER)
        jdbc.update("""
        INSERT INTO app_user (
          person_id, band_id, rol, username, password_hash,
          estatus, primer_login, activo, failed_attempts, locked_until
        ) VALUES (?, ?, 'LEADER', ?, ?, 'ACTIVO', 0, 1, 0, NULL)
    """, personId, bandId, username, passwordHash);

        Long userId = jdbc.queryForObject("SELECT MAX(user_id) FROM app_user", Long.class);

        // 4) Vincular band.leader_user_id = userId
        jdbc.update("UPDATE band SET leader_user_id = ? WHERE band_id = ?", userId, bandId);

        return Map.of(
                "created", true,
                "bandId", bandId,
                "userId", userId,
                "username", username,
                "correo", correo,
                "password", rawPassword
        );
    }
}