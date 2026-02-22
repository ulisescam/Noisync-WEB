package com.noisync.backend.controller;

import com.noisync.backend.dto.*;
import com.noisync.backend.service.AuthService;
import com.noisync.backend.service.RegisterLeaderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RegisterLeaderService registerLeaderService;

    public AuthController(AuthService authService, RegisterLeaderService registerLeaderService) {
        this.authService = authService;
        this.registerLeaderService = registerLeaderService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register-leader")
    public RegisterLeaderResponse registerLeader(@Valid @RequestBody RegisterLeaderRequest request) {
        return registerLeaderService.register(request);
    }
}