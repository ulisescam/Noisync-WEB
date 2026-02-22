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
        // validar rol leader
        boolean isLeader = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_LEADER"));
        if (!isLeader) throw new IllegalArgumentException("Solo un lider puede invitar musicos");

        @SuppressWarnings("unchecked")
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        Long bandId = ((Number) details.get("bandId")).longValue();

        return inviteService.inviteMusician(bandId, req);
    }

    // Publico: aceptar invitacion
    @PostMapping("/auth/accept-invite")
    public Map<String, Object> accept(@Valid @RequestBody AcceptInviteRequest req) {
        String msg = inviteService.acceptInvite(req);
        return Map.of("ok", true, "message", msg);
    }
}