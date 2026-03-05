package com.noisync.backend.controller;

import com.noisync.backend.dto.AcceptInviteRequest;
import com.noisync.backend.dto.InviteMusicianRequest;
import com.noisync.backend.dto.InviteMusicianResponse;
import com.noisync.backend.service.BandInviteService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class InviteController {

    private final BandInviteService inviteService;

    public InviteController(BandInviteService inviteService) {
        this.inviteService = inviteService;
    }

    // Solo leader
    @PostMapping("/band/invite")
    public InviteMusicianResponse invite(@Valid @RequestBody InviteMusicianRequest req, Authentication auth) {
        boolean isLeader = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_LEADER"));
        if (!isLeader) throw new IllegalArgumentException("Solo un lider puede invitar musicos");

        @SuppressWarnings("unchecked")
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        Long bandId = ((Number) details.get("bandId")).longValue();

        // 1. Transacción hace commit
        InviteMusicianResponse response = inviteService.inviteMusician(bandId, req);

        // 2. Correos fuera de la transacción
        inviteService.sendInvitationEmails(response.musicianUserId(), req.correo(), response.tempPassword());

        // 3. Devolver response sin exponer la contraseña temporal
        return new InviteMusicianResponse(response.invited(), response.musicianUserId(), response.correo(), response.username(), null, null);
    }
}