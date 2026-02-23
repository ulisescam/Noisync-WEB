package com.noisync.backend.service;

import com.noisync.backend.dto.ChangePasswordRequest;
import com.noisync.backend.dto.MeResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final JdbcTemplate jdbc;
    private final PasswordEncoder encoder;

    public ProfileService(JdbcTemplate jdbc, PasswordEncoder encoder) {
        this.jdbc = jdbc;
        this.encoder = encoder;
    }

    public MeResponse me(Long userId) {
        return jdbc.queryForObject("""
            SELECT 
              u.user_id,
              u.band_id,
              u.rol,
              u.username,
              u.estatus,
              u.primer_login,
              u.activo,
              p.nombre_completo,
              p.correo,
              p.telefono,
              b.nombre AS band_nombre,
              b.descripcion AS band_descripcion
            FROM app_user u
            JOIN person p ON p.person_id = u.person_id
            JOIN band b ON b.band_id = u.band_id
            WHERE u.user_id = ?
        """, (rs, rn) -> new MeResponse(
                rs.getLong("user_id"),
                rs.getLong("band_id"),
                rs.getString("rol"),
                rs.getString("username"),
                rs.getString("nombre_completo"),
                rs.getString("correo"),
                rs.getString("telefono"),
                rs.getString("estatus"),
                rs.getInt("primer_login"),
                rs.getInt("activo"),
                rs.getString("band_nombre"),
                rs.getString("band_descripcion")
        ), userId);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest req) {

        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new IllegalArgumentException("Las contrasenas no coinciden");
        }

        validateStrongPassword(req.newPassword());

        String currentHash = jdbc.queryForObject("""
            SELECT password_hash FROM app_user WHERE user_id = ?
        """, String.class, userId);

        if (currentHash == null || !encoder.matches(req.currentPassword(), currentHash)) {
            throw new IllegalArgumentException("Contrasena actual incorrecta");
        }

        String newHash = encoder.encode(req.newPassword());

        jdbc.update("""
            UPDATE app_user
            SET password_hash = ?, primer_login = 0
            WHERE user_id = ?
        """, newHash, userId);
    }

    private static void validateStrongPassword(String pass) {
        boolean hasUpper = pass.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = pass.chars().anyMatch(Character::isDigit);

        if (pass.length() < 8 || !hasUpper || !hasDigit) {
            throw new IllegalArgumentException("La contrasena debe tener minimo 8 caracteres, una mayuscula y un numero");
        }
    }
}