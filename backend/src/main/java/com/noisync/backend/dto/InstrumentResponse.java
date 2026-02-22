package com.noisync.backend.dto;

public record InstrumentResponse(
        Long instrumentId,
        Long bandId,
        String nombre,
        Integer activo
) {}