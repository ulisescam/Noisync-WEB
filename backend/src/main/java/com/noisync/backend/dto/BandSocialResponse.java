package com.noisync.backend.dto;

public record BandSocialResponse(
        Long bandSocialId,
        Long bandId,
        String plataforma,
        String url
) {}