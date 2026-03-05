package com.noisync.backend.service;

import com.noisync.backend.domain.AppUser;
import com.noisync.backend.domain.EmailVerificationToken;
import com.noisync.backend.repository.AppUserRepository;
import com.noisync.backend.repository.EmailVerificationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepo;
    private final AppUserRepository appUserRepo;
    private final EmailService emailService;
    private final TokenInvalidationService tokenInvalidationService;
    private final String verifyUrlBase;

    public EmailVerificationService(
            EmailVerificationTokenRepository tokenRepo,
            AppUserRepository appUserRepo,
            EmailService emailService,
            TokenInvalidationService tokenInvalidationService,
            @Value("${app.frontend.verify-url}") String verifyUrlBase
    ) {
        this.tokenRepo = tokenRepo;
        this.appUserRepo = appUserRepo;
        this.emailService = emailService;
        this.tokenInvalidationService = tokenInvalidationService;
        this.verifyUrlBase = verifyUrlBase;
    }

    @Transactional
    public void sendVerification(AppUser user) {
        tokenInvalidationService.invalidateActiveTokens(user.getUserId());

        EmailVerificationToken t = new EmailVerificationToken();
        t.setUser(user);
        t.setToken(UUID.randomUUID().toString());
        t.setExpiresAt(LocalDateTime.now().plusHours(24));
        t.setUsed(0);

        tokenRepo.save(t);

        String link = verifyUrlBase + t.getToken();

        emailService.send(
                user.getCorreo(),
                "Noisync - Verifica tu correo",
                "Activa tu cuenta con este enlace:\n" + link +
                        "\n\nExpira en 24 horas."
        );
    }

    @Transactional
    public void verify(String token) {
        EmailVerificationToken t = tokenRepo.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Código inválido."));

        if (t.getUsed() == 1) {
            throw new IllegalArgumentException("Código ya utilizado.");
        }

        if (t.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Código expirado.");
        }

        AppUser user = t.getUser();
        user.setActivo(1);
        user.setEstatus("ACTIVO");

        appUserRepo.save(user);

        t.setUsed(1);
        tokenRepo.save(t);
    }
}