package com.noisync.backend.security;

import com.noisync.backend.domain.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-minutes}") long expMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expMinutes * 60_000L;
    }

    public String generateToken(AppUser user) {

        long now = System.currentTimeMillis();
        Date issuedAt = new Date(now);
        Date exp = new Date(now + expirationMillis);

        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .issuedAt(issuedAt)
                .expiration(exp)
                .claims(Map.of(
                        "bandId", user.getBandId(),
                        "role", user.getRol(),
                        "primerLogin", user.getPrimerLogin()
                ))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}