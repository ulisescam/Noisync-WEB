package com.noisync.backend.dto;

public record RegisterLeaderResponse(
        boolean created,
        Long bandId,
        Long userId,
        String message
) {}