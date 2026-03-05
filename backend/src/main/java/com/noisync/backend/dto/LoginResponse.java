package com.noisync.backend.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        Long bandId,
        String role,
        boolean mustChangePassword
) {}