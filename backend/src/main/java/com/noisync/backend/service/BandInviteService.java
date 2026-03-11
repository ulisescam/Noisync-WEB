package com.noisync.backend.service;

import com.noisync.backend.domain.AppUser;
import com.noisync.backend.dto.AcceptInviteRequest;
import com.noisync.backend.dto.InviteMusicianRequest;
import com.noisync.backend.dto.InviteMusicianResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.noisync.backend.repository.AppUserRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class BandInviteService {

    private final JdbcTemplate jdbc;
    private final PasswordEncoder encoder;
    private final AppUserRepository appUserRepository;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    public BandInviteService(
            JdbcTemplate jdbc,
            PasswordEncoder encoder,
            AppUserRepository appUserRepository,
            EmailVerificationService emailVerificationService,
            EmailService emailService
    ) {
        this.jdbc = jdbc;
        this.encoder = encoder;
        this.appUserRepository = appUserRepository;
        this.emailVerificationService = emailVerificationService;
        this.emailService = emailService;
    }


    // ====== INVITE MUSICIAN (leader) ======
    @Transactional
    public InviteMusicianResponse inviteMusician(
            Long bandId,
            InviteMusicianRequest req
    ) {

        // ===== GENERAR USERNAME SI VIENE VACÍO =====
        String username = req.username();

        if (username == null || username.isBlank()) {
            username = req.nombreCompleto()
                    .toLowerCase()
                    .replaceAll("\\s+", "")
                    .replaceAll("[^a-z0-9]", "");
        }

        // ===== VALIDAR USERNAME ÚNICO =====
        Integer usernameCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE LOWER(username) = LOWER(?)",
                Integer.class,
                username
        );

        if (usernameCount != null && usernameCount > 0) {
            throw new IllegalArgumentException("Ese username ya está registrado");
        }

        // ===== VALIDAR CORREO ÚNICO =====
        Integer correoCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE LOWER(email) = LOWER(?)",
                Integer.class,
                req.correo()
        );

        if (correoCount != null && correoCount > 0) {
            throw new IllegalArgumentException("Ese correo ya está registrado");
        }

        // ===== PASSWORD TEMPORAL SEGURA =====
        String tempPassword =
                "Tmp" + UUID.randomUUID().toString()
                        .replace("-", "")
                        .substring(0, 8) + "1A";

        String passwordHash = encoder.encode(tempPassword);

        // ===== CREAR PERSON =====
        jdbc.update("""
            INSERT INTO person (nombre_completo, telefono, correo, correo_verificado)
            VALUES (?, ?, ?, 0)
        """, req.nombreCompleto(), req.telefono(), req.correo());

        Long personId = jdbc.queryForObject(
                "SELECT MAX(person_id) FROM person",
                Long.class
        );

        // ===== CREAR APP_USER =====
        jdbc.update("""
        INSERT INTO app_user (
            person_id,
            band_id,
            rol,
            username,
            password_hash,
            email,
            estatus,
            primer_login,
            activo,
            failed_attempts,
            locked_until
        ) VALUES (?, ?, 'MUSICIAN', ?, ?, ?, 'PENDIENTE', 1, 1, 0, NULL)
        """,
                personId,
                bandId,
                username,
                passwordHash,
                req.correo()
        );

        Long userId = jdbc.queryForObject(
                "SELECT MAX(user_id) FROM app_user",
                Long.class
        );

        return new InviteMusicianResponse(
                true,
                userId,
                req.correo(),
                username,
                tempPassword,
                null
        );
    }


    // ====== ENVIAR CORREO DE INVITACIÓN ======
    public void sendInvitationEmails(Long userId, String correo, String tempPassword) {

        AppUser musician = appUserRepository.findById(userId).orElseThrow();

        emailVerificationService.sendVerification(musician);

        emailService.send(
                correo,
                "Noisync - Invitación a la banda",
                "Has sido invitado a una banda en Noisync.\n\n" +
                        "Usuario: " + musician.getUsername() + "\n" +
                        "Contraseña temporal: " + tempPassword + "\n\n" +
                        "Primero verifica tu correo para poder iniciar sesión."
        );
    }


    // ====== ACCEPT INVITE (musician) ======
    @Transactional
    public String acceptInvite(AcceptInviteRequest req) {

        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        validateStrongPassword(req.newPassword());

        String tokenHash = sha256Hex(req.token());

        Long invitationId = jdbc.queryForObject("""
            SELECT invitation_id
            FROM band_invitation
            WHERE token_hash = ?
              AND estatus = 'PENDIENTE'
              AND fecha_expiracion > SYSTIMESTAMP
        """, Long.class, tokenHash);

        if (invitationId == null) {
            throw new IllegalArgumentException("Token inválido o expirado");
        }

        Long userId = jdbc.queryForObject("""
            SELECT user_id
            FROM band_invitation
            WHERE invitation_id = ?
        """, Long.class, invitationId);

        String newHash = encoder.encode(req.newPassword());

        jdbc.update("""
            UPDATE app_user
            SET password_hash = ?, estatus = 'ACTIVO', primer_login = 0
            WHERE user_id = ?
        """, newHash, userId);

        jdbc.update("""
            UPDATE band_invitation
            SET estatus = 'ACEPTADA', fecha_aceptacion = SYSTIMESTAMP
            WHERE invitation_id = ?
        """, invitationId);

        return "Invitación aceptada. Ya puedes iniciar sesión.";
    }


    // ===== helpers =====
    private static void validateStrongPassword(String pass) {

        boolean hasUpper = pass.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = pass.chars().anyMatch(Character::isDigit);

        if (pass.length() < 8 || !hasUpper || !hasDigit) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número"
            );
        }
    }

    private static String sha256Hex(String raw) {

        try {

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(digest);

        } catch (Exception e) {

            throw new RuntimeException("No se pudo generar hash");

        }
    }
}