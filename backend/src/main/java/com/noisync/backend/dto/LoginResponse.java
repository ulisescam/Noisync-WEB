package com.noisync.backend.dto;

public record LoginResponse(
        String token,
        Long userId,
        Long bandId,
        String role
) {}