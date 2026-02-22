package com.noisync.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InviteMusicianRequest(
        @NotBlank String nombreCompleto,
        String telefono,
        @NotBlank @Email String correo,
        @NotBlank String username
) {}