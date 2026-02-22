package com.noisync.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterLeaderRequest(
        @NotBlank String nombreCompleto,
        @NotBlank String username,
        @NotBlank @Email String correo,
        @NotBlank String password,
        @NotBlank String confirmPassword,
        @NotBlank String nombreBanda
) {}