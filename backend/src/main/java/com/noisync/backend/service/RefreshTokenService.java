package com.noisync.backend.service;

import com.noisync.backend.domain.AppUser;
import com.noisync.backend.domain.RefreshToken;
import com.noisync.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final long refreshDays;
    private final SecureRandom random = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository repo,
                               @Value("${app.jwt.refresh-token-days}") long refreshDays) {
        this.repo = repo;
        this.refreshDays = refreshDays;
    }

    public String createForUser(AppUser user) {
        String raw = generateRawToken();
        String hash = sha256Base64Url(raw);

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(hash);
        rt.setExpiresAt(LocalDateTime.now().plusDays(refreshDays));
        rt.setRevoked(0);

        repo.save(rt);
        return raw;
    }

    public RefreshToken validateRaw(String rawToken) {
        String hash = sha256Base64Url(rawToken);
        RefreshToken rt = repo.findByTokenHash(hash)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));

        if (rt.getRevoked() != null && rt.getRevoked() == 1) {
            throw new IllegalArgumentException("Refresh token revocado");
        }
        if (rt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expirado");
        }
        return rt;
    }

    public String rotate(String rawToken) {
        RefreshToken current = validateRaw(rawToken);
        current.setRevoked(1);
        repo.save(current);
        return createForUser(current.getUser());
    }

    public void revoke(String rawToken) {
        String hash = sha256Base64Url(rawToken);
        repo.findByTokenHash(hash).ifPresent(rt -> {
            rt.setRevoked(1);
            repo.save(rt);
        });
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String sha256Base64Url(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo hashear el token", e);
        }
    }
}