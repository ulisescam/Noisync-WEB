package com.noisync.backend.controller;

import com.noisync.backend.dto.ChangePasswordRequest;
import com.noisync.backend.dto.MeResponse;
import com.noisync.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    private Long userId(Authentication auth) {
        return Long.parseLong(auth.getPrincipal().toString());
    }

    @GetMapping
    public MeResponse me(Authentication auth) {
        return service.me(userId(auth));
    }

    @PutMapping("/password")
    public Map<String, Object> changePassword(@Valid @RequestBody ChangePasswordRequest req, Authentication auth) {
        service.changePassword(userId(auth), req);
        return Map.of("ok", true, "message", "Contrasena actualizada");
    }
}