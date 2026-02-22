package com.noisync.backend.controller;

import com.noisync.backend.dto.InstrumentResponse;
import com.noisync.backend.dto.MusicianResponse;
import com.noisync.backend.service.MusicianInstrumentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/musicians")
public class MusicianController {

    private final MusicianInstrumentService service;

    public MusicianController(MusicianInstrumentService service) {
        this.service = service;
    }

    private Long bandId(Authentication auth) {
        @SuppressWarnings("unchecked")
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        return ((Number) details.get("bandId")).longValue();
    }

    private Long userId(Authentication auth) {
        return Long.parseLong(auth.getPrincipal().toString());
    }

    private boolean isLeader(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_LEADER"));
    }

    // solo leader
    @GetMapping
    public List<MusicianResponse> list(Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede ver la lista de musicos");
        return service.listMusicians(bandId(auth));
    }

    // leader o el mismo musico
    @GetMapping("/{musicianId}/instruments")
    public List<InstrumentResponse> listInstruments(@PathVariable Long musicianId, Authentication auth) {
        boolean allowed = isLeader(auth) || userId(auth).equals(musicianId);
        if (!allowed) throw new IllegalArgumentException("No autorizado");
        return service.listMusicianInstruments(bandId(auth), musicianId);
    }

    // solo leader
    @PostMapping("/{musicianId}/instruments/{instrumentId}")
    public Map<String, Object> assign(@PathVariable Long musicianId, @PathVariable Long instrumentId, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede asignar instrumentos");
        service.assign(bandId(auth), musicianId, instrumentId);
        return Map.of("ok", true, "message", "Instrumento asignado");
    }

    // solo leader
    @DeleteMapping("/{musicianId}/instruments/{instrumentId}")
    public Map<String, Object> unassign(@PathVariable Long musicianId, @PathVariable Long instrumentId, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede quitar instrumentos");
        service.unassign(bandId(auth), musicianId, instrumentId);
        return Map.of("ok", true, "message", "Instrumento removido");
    }
}