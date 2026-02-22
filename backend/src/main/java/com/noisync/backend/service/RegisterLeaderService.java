package com.noisync.backend.service;

import com.noisync.backend.dto.RegisterLeaderRequest;
import com.noisync.backend.dto.RegisterLeaderResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegisterLeaderService {

    private final JdbcTemplate jdbc;
    private final PasswordEncoder encoder;

    public RegisterLeaderService(JdbcTemplate jdbc, PasswordEncoder encoder) {
        this.jdbc = jdbc;
        this.encoder = encoder;
    }

    @Transactional
    public RegisterLeaderResponse register(RegisterLeaderRequest req) {

        // 1) Validaciones basicas
        if (!req.password().equals(req.confirmPassword())) {
            throw new IllegalArgumentException("Las contrasenas no coinciden");
        }

        String pass = req.password();
        boolean hasUpper = pass.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = pass.chars().anyMatch(Character::isDigit);

        if (pass.length() < 8 || !hasUpper || !hasDigit) {
            throw new IllegalArgumentException("La contrasena debe tener minimo 8 caracteres, una mayuscula y un numero");
        }

        // Username único
        Integer usernameCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE LOWER(username) = LOWER(?)",
                Integer.class, req.username()
        );
        if (usernameCount != null && usernameCount > 0) {
            throw new IllegalArgumentException("Ese username ya esta registrado");
        }

        // Correo único
        Integer correoCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM person WHERE LOWER(correo) = LOWER(?)",
                Integer.class, req.correo()
        );
        if (correoCount != null && correoCount > 0) {
            throw new IllegalArgumentException("Ese correo ya esta registrado");
        }

        // 2) Crear band (leader_user_id NULL por ahora, genero NULL)
        jdbc.update("""
            INSERT INTO band (nombre, descripcion, genero_musical, leader_user_id)
            VALUES (?, NULL, NULL, NULL)
        """, req.nombreBanda());

        Long bandId = jdbc.queryForObject("SELECT MAX(band_id) FROM band", Long.class);

        // 3) Crear person (correo_verificado = 0 al inicio)
        jdbc.update("""
            INSERT INTO person (nombre_completo, telefono, correo, correo_verificado)
            VALUES (?, NULL, ?, 0)
        """, req.nombreCompleto(), req.correo());

        Long personId = jdbc.queryForObject("SELECT MAX(person_id) FROM person", Long.class);

        // 4) Crear app_user LEADER (estatus PENDIENTE porque falta verificación)
        String passwordHash = encoder.encode(req.password());

        jdbc.update("""
          INSERT INTO app_user (
          person_id, band_id, rol, username, password_hash,
          estatus, primer_login, activo, failed_attempts, locked_until
          ) VALUES (?, ?, 'LEADER', ?, ?, 'ACTIVO', 0, 1, 0, NULL)
          """, personId, bandId, req.username(), passwordHash);

        Long userId = jdbc.queryForObject("SELECT MAX(user_id) FROM app_user", Long.class);

        // 5) Vincular band.leader_user_id
        jdbc.update("UPDATE band SET leader_user_id = ? WHERE band_id = ?", userId, bandId);

        return new RegisterLeaderResponse(true, bandId, userId, "Cuenta creada correctamente.");
    }
}