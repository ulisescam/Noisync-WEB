package com.noisync.backend.controller;

import com.noisync.backend.service.EmailVerificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class VerificationController {

    private final EmailVerificationService verificationService;

    public VerificationController(
            EmailVerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/verify-email")
    public String verify(@RequestParam String token) {

        verificationService.verify(token);
        return "Correo verificado correctamente.";
    }
}