package com.noisync.backend.dto;

public record MusicianResponse(
        Long userId,
        Long bandId,
        String nombreCompleto,
        String correo,
        String username,
        String estatus
) {}