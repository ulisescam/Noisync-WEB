package com.noisync.backend.dto;

public record MeResponse(
        Long userId,
        Long bandId,
        String role,
        String username,
        String nombreCompleto,
        String correo,
        String telefono,
        String estatus,
        Integer primerLogin,
        Integer activo,

        // info banda
        String bandNombre,
        String bandDescripcion
) {}