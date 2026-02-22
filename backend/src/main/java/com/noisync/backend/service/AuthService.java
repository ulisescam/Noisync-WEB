package com.noisync.backend.service;

import com.noisync.backend.domain.AppUser;
import com.noisync.backend.dto.LoginRequest;
import com.noisync.backend.dto.LoginResponse;
import com.noisync.backend.repository.AppUserRepository;
import com.noisync.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest req) {
        String identifier = req.identifier().trim();

        AppUser user = identifier.contains("@")
                ? userRepo.findByCorreoIgnoreCase(identifier).orElseThrow(() -> new RuntimeException("Credenciales invalidas"))
                : userRepo.findByUsernameIgnoreCase(identifier).orElseThrow(() -> new RuntimeException("Credenciales invalidas"));

        if (!"ACTIVO".equalsIgnoreCase(user.getEstatus()) || user.getActivo() == 0) {
            throw new RuntimeException("Usuario no activo");
        }

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new RuntimeException("Credenciales invalidas");
        }

        String token = jwtService.generateToken(user.getUserId(), user.getBandId(), user.getRol());

        return new LoginResponse(token, user.getUserId(), user.getBandId(), user.getRol());
    }
}