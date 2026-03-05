package com.noisync.backend.service;

import com.noisync.backend.domain.AppUser;
import com.noisync.backend.dto.ChangePasswordRequest;
import com.noisync.backend.dto.LoginRequest;
import com.noisync.backend.dto.LoginResponse;
import com.noisync.backend.repository.AppUserRepository;
import com.noisync.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    public AuthService(AppUserRepository userRepo,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService,
                       EmailService emailService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.emailService = emailService;
    }

    public LoginResponse login(LoginRequest req) {

        String identifier = req.identifier().trim();

        AppUser user = identifier.contains("@")
                ? userRepo.findByCorreoIgnoreCase(identifier)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"))
                : userRepo.findByUsernameIgnoreCase(identifier)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (user.getLockedUntil() != null &&
                user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Cuenta bloqueada temporalmente. Intenta más tarde.");
        }

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {

            int attempts = (user.getFailedAttempts() == null ? 0 : user.getFailedAttempts()) + 1;
            user.setFailedAttempts(attempts);

            if (attempts >= 3) {
                user.setLockedUntil(LocalDateTime.now().plus(10, ChronoUnit.MINUTES));
            }

            userRepo.save(user);
            throw new RuntimeException("Credenciales inválidas");
        }
        if (!"ACTIVO".equalsIgnoreCase(user.getEstatus())) {
            throw new RuntimeException("Debes verificar tu correo antes de iniciar sesión.");
        }

        // Login correcto
        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        userRepo.save(user);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createForUser(user);

        boolean mustChangePassword = "MUSICIAN".equalsIgnoreCase(user.getRol())
                && user.getPrimerLogin() == 1;

        return new LoginResponse(
                accessToken,
                refreshToken,
                user.getUserId(),
                user.getBandId(),
                user.getRol(),
                mustChangePassword
        );
    }

    public LoginResponse refresh(String rawToken) {

        var current = refreshTokenService.validateRaw(rawToken);
        String newRefresh = refreshTokenService.rotate(rawToken);

        AppUser user = current.getUser();
        String newAccess = jwtService.generateToken(user);

        return new LoginResponse(
                newAccess,
                newRefresh,
                user.getUserId(),
                user.getBandId(),
                user.getRol(),
                false);
    }

    public void changePassword(String userIdStr, ChangePasswordRequest req) {

        Long userId = Long.valueOf(userIdStr); // ← el "username" es realmente el userId

        AppUser user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Contraseña actual incorrecta.");
        }

        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden.");
        }

        validateStrongPassword(req.newPassword());

        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        user.setPrimerLogin(0);
        userRepo.save(user);
    }

    public void forgotPassword(String correo) {

        AppUser user = userRepo.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new RuntimeException("Correo no registrado"));

        String tempPassword = "Tmp" +
                UUID.randomUUID().toString().substring(0, 8) + "1A";

        user.setPasswordHash(passwordEncoder.encode(tempPassword));
        user.setPrimerLogin(1);
        user.setFailedAttempts(0);
        user.setLockedUntil(null);

        userRepo.save(user);

        emailService.send(
                correo,
                "Noisync - Recuperación de Contraseña",
                "Tu contraseña temporal es: " + tempPassword +
                        "\nPor favor, cámbiala al iniciar sesión."
        );
    }
    private void validateStrongPassword(String pass) {

        boolean hasUpper = pass.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = pass.chars().anyMatch(Character::isDigit);

        if (pass.length() < 8 || !hasUpper || !hasDigit) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener mínimo 8 caracteres, " +
                            "una mayúscula y un número."
            );
        }
    }
}