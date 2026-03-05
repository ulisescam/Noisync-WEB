package com.noisync.backend.service;

import com.noisync.backend.dto.ForgotPasswordRequest;
import com.noisync.backend.dto.ResetPasswordRequest;
import com.noisync.backend.domain.AppUser;
import com.noisync.backend.repository.AppUserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final JdbcTemplate jdbc;
    private final AppUserRepository userRepo;
    private final PasswordEncoder encoder;
    private final EmailService emailService;

    public PasswordResetService(
            JdbcTemplate jdbc,
            AppUserRepository userRepo,
            PasswordEncoder encoder,
            EmailService emailService
    ) {
        this.jdbc = jdbc;
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    // ===== SOLICITAR RESET =====
    @Transactional
    public void requestReset(ForgotPasswordRequest req) {

        AppUser user = userRepo
                .findByCorreoIgnoreCase(req.correo())
                .orElseThrow(() ->
                        new RuntimeException("Si el correo existe, recibirás instrucciones.")
                );

        String token = UUID.randomUUID().toString().replace("-", "");
        String tokenHash = sha256Hex(token);

        jdbc.update("""
            INSERT INTO password_reset_token (
              user_id,
              token_hash,
              fecha_expiracion,
              estatus
            )
            VALUES (?, ?, SYSTIMESTAMP + NUMTODSINTERVAL(1,'HOUR'), 'PENDIENTE')
        """, user.getUserId(), tokenHash);

        String link = "http://localhost:5173/reset-password?token=" + token;

        emailService.send(
                user.getCorreo(),
                "Noisync - Recuperación de contraseña",
                "Haz clic en el siguiente enlace:\n\n" + link +
                        "\n\nEste enlace expira en 1 hora."
        );
    }

    // ===== CONFIRMAR RESET =====
    @Transactional
    public void resetPassword(ResetPasswordRequest req) {

        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }

        validateStrongPassword(req.newPassword());

        String tokenHash = sha256Hex(req.token());

        Long resetId = jdbc.queryForObject("""
            SELECT reset_id
            FROM password_reset_token
            WHERE token_hash = ?
              AND estatus = 'PENDIENTE'
              AND fecha_expiracion > SYSTIMESTAMP
        """, Long.class, tokenHash);

        if (resetId == null) {
            throw new IllegalArgumentException("Token inválido o expirado.");
        }

        Long userId = jdbc.queryForObject("""
            SELECT user_id
            FROM password_reset_token
            WHERE reset_id = ?
        """, Long.class, resetId);

        AppUser user = userRepo.findById(userId).orElseThrow();

        user.setPasswordHash(encoder.encode(req.newPassword()));
        user.setPrimerLogin(0);
        userRepo.save(user);

        jdbc.update("""
            UPDATE password_reset_token
            SET estatus = 'USADO',
                fecha_uso = SYSTIMESTAMP
            WHERE reset_id = ?
        """, resetId);
    }

    // ===== Helpers =====

    private static String sha256Hex(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo generar hash");
        }
    }

    private static void validateStrongPassword(String pass) {

        boolean hasUpper = pass.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = pass.chars().anyMatch(Character::isDigit);

        if (pass.length() < 8 || !hasUpper || !hasDigit) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número."
            );
        }
    }
}