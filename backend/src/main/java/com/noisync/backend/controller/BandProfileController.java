package com.noisync.backend.controller;

import com.noisync.backend.dto.*;
import com.noisync.backend.service.BandProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/band")
public class BandProfileController {

    private final BandProfileService service;

    public BandProfileController(BandProfileService service) {
        this.service = service;
    }

    private Long bandId(Authentication auth) {
        @SuppressWarnings("unchecked")
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        return ((Number) details.get("bandId")).longValue();
    }

    private boolean isLeader(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_LEADER"));
    }

    // GET /api/band
    @GetMapping
    public BandResponse get(Authentication auth) {
        return service.getBand(bandId(auth));
    }

    // PUT /api/band (solo leader)
    @PutMapping
    public BandResponse update(@Valid @RequestBody BandUpdateRequest req, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede editar la banda");
        return service.updateBand(bandId(auth), req);
    }

    // GET /api/band/socials
    @GetMapping("/socials")
    public List<BandSocialResponse> socials(Authentication auth) {
        return service.listSocials(bandId(auth));
    }

    // POST /api/band/socials (solo leader)
    @PostMapping("/socials")
    public BandSocialResponse addSocial(@Valid @RequestBody BandSocialRequest req, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede editar redes");
        return service.addSocial(bandId(auth), req);
    }

    // DELETE /api/band/socials/{id} (solo leader)
    @DeleteMapping("/socials/{id}")
    public Map<String, Object> deleteSocial(@PathVariable Long id, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede editar redes");
        service.deleteSocial(bandId(auth), id);
        return Map.of("ok", true, "message", "Red eliminada");
    }
}