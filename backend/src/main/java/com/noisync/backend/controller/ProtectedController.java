package com.noisync.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ProtectedController {

    @GetMapping("/api/protected")
    public Map<String, Object> protectedEndpoint(Authentication auth) {
        return Map.of(
                "ok", true,
                "principal", auth.getPrincipal(),
                "authorities", auth.getAuthorities().toString()
        );
    }
}