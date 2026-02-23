package com.noisync.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record BandSocialRequest(
        @NotBlank String plataforma,
        @NotBlank String url
) {}