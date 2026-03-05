package com.noisync.backend.controller;

import com.noisync.backend.dto.*;
import com.noisync.backend.service.AuthService;
import com.noisync.backend.service.PasswordResetService;
import com.noisync.backend.service.RegisterLeaderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RegisterLeaderService registerLeaderService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService,
                          RegisterLeaderService registerLeaderService,
                          PasswordResetService passwordResetService) {
        this.authService = authService;
        this.registerLeaderService = registerLeaderService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register-leader")
    public RegisterLeaderResponse registerLeader(
            @Valid @RequestBody RegisterLeaderRequest request) {
        // 1. Registra y hace commit de la transacción
        RegisterLeaderResponse response = registerLeaderService.register(request);
        // 2. Envía el correo FUERA de la transacción
        registerLeaderService.sendVerificationEmail(response.userId());
        return response;
    }

    @PostMapping("/change-password")
    public ApiMessageResponse changePassword(
            @RequestBody @Valid ChangePasswordRequest request,
            Authentication authentication) {
        authService.changePassword(authentication.getName(), request);
        return new ApiMessageResponse("Contraseña actualizada correctamente.");
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestBody TokenRequest request) {
        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/forgot-password")
    public ApiMessageResponse forgotPassword(
            @RequestBody @Valid ForgotPasswordRequest request) {
        passwordResetService.requestReset(request);
        return new ApiMessageResponse("Si el correo existe, recibirás instrucciones.");
    }

    @PostMapping("/reset-password")
    public ApiMessageResponse resetPassword(
            @RequestBody @Valid ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return new ApiMessageResponse("Contraseña actualizada correctamente.");
    }
}