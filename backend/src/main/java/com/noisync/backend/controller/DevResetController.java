package com.noisync.backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
public class DevResetController {

    private final JdbcTemplate jdbc;

    public DevResetController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @DeleteMapping("/reset")
    public Map<String, Object> reset() {

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

        return Map.of("ok", true, "message", "DB limpia");
    }

    @DeleteMapping("/reset-musicians")
    public Map<String, Object> resetMusicians() {

        // 1) borrar invitaciones de usuarios músicos
        jdbc.update("""
        DELETE FROM band_invitation
        WHERE user_id IN (SELECT user_id FROM app_user WHERE rol = 'MUSICIAN')
    """);

        // 2) borrar musician_instrument de músicos
        jdbc.update("""
        DELETE FROM musician_instrument
        WHERE user_id IN (SELECT user_id FROM app_user WHERE rol = 'MUSICIAN')
    """);

        // 3) borrar app_user músicos
        jdbc.update("DELETE FROM app_user WHERE rol = 'MUSICIAN'");

        // 4) borrar persons que ya no estén ligados a ningún app_user
        jdbc.update("""
        DELETE FROM person p
        WHERE NOT EXISTS (
            SELECT 1 FROM app_user u WHERE u.person_id = p.person_id
        )
    """);

        return Map.of("ok", true, "message", "Musicos reiniciados");
    }
}