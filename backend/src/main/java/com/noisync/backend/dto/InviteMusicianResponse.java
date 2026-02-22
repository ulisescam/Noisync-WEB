package com.noisync.backend.dto;

public record InviteMusicianResponse(
        boolean invited,
        Long musicianUserId,
        String correo,
        String username,
        String tempPassword,
        String inviteToken
) {}    