package com.noisync.backend.controller;

import com.noisync.backend.dto.InstrumentRequest;
import com.noisync.backend.dto.InstrumentResponse;
import com.noisync.backend.service.InstrumentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instruments")
public class InstrumentController {

    private final InstrumentService service;

    public InstrumentController(InstrumentService service) {
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

    @GetMapping
    public List<InstrumentResponse> list(Authentication auth) {
        return service.list(bandId(auth));
    }

    @PostMapping
    public InstrumentResponse create(@Valid @RequestBody InstrumentRequest req, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede crear instrumentos");
        return service.create(bandId(auth), userId(auth), req);
    }

    @PutMapping("/{id}")
    public InstrumentResponse update(@PathVariable Long id, @Valid @RequestBody InstrumentRequest req, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede editar instrumentos");
        return service.update(bandId(auth), id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id, Authentication auth) {
        if (!isLeader(auth)) throw new IllegalArgumentException("Solo un lider puede eliminar instrumentos");
        service.delete(bandId(auth), id);
        return Map.of("ok", true, "message", "Instrumento eliminado");
    }
}