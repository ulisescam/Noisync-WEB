package com.noisync.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record InstrumentRequest(
        @NotBlank String nombre
) {}