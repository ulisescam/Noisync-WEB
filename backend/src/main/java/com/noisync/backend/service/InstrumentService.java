package com.noisync.backend.service;

import com.noisync.backend.dto.InstrumentRequest;
import com.noisync.backend.dto.InstrumentResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InstrumentService {

    private final JdbcTemplate jdbc;

    public InstrumentService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<InstrumentResponse> mapper = (rs, rn) -> new InstrumentResponse(
            rs.getLong("instrument_id"),
            rs.getLong("band_id"),
            rs.getString("nombre"),
            rs.getInt("activo")
    );

    public List<InstrumentResponse> list(Long bandId) {
        return jdbc.query("""
            SELECT instrument_id, band_id, nombre, activo
            FROM instrument
            WHERE band_id = ?
              AND activo = 1
            ORDER BY nombre ASC
        """, mapper, bandId);
    }

    @Transactional
    public InstrumentResponse create(Long bandId, Long userId, InstrumentRequest req) {

        // nombre unico por banda (ya lo tienes como uq)
        Integer count = jdbc.queryForObject("""
            SELECT COUNT(*) FROM instrument
            WHERE band_id = ? AND LOWER(nombre) = LOWER(?)
        """, Integer.class, bandId, req.nombre());

        if (count != null && count > 0) throw new IllegalArgumentException("Ese instrumento ya existe");

        jdbc.update("""
            INSERT INTO instrument (band_id, nombre, activo, created_by)
            VALUES (?, ?, 1, ?)
        """, bandId, req.nombre(), userId);

        Long id = jdbc.queryForObject("""
            SELECT MAX(instrument_id) FROM instrument WHERE band_id = ?
        """, Long.class, bandId);

        return jdbc.queryForObject("""
            SELECT instrument_id, band_id, nombre, activo
            FROM instrument
            WHERE instrument_id = ? AND band_id = ?
        """, mapper, id, bandId);
    }

    @Transactional
    public InstrumentResponse update(Long bandId, Long instrumentId, InstrumentRequest req) {

        int updated = jdbc.update("""
            UPDATE instrument
            SET nombre = ?
            WHERE instrument_id = ?
              AND band_id = ?
              AND activo = 1
        """, req.nombre(), instrumentId, bandId);

        if (updated == 0) throw new IllegalArgumentException("Instrumento no encontrado");

        return jdbc.queryForObject("""
            SELECT instrument_id, band_id, nombre, activo
            FROM instrument
            WHERE instrument_id = ? AND band_id = ?
        """, mapper, instrumentId, bandId);
    }

    // soft delete
    @Transactional
    public void delete(Long bandId, Long instrumentId) {

        // primero elimina relaciones
        jdbc.update("""
            DELETE FROM musician_instrument
            WHERE instrument_id = ?
        """, instrumentId);

        int updated = jdbc.update("""
            UPDATE instrument
            SET activo = 0
            WHERE instrument_id = ?
              AND band_id = ?
              AND activo = 1
        """, instrumentId, bandId);

        if (updated == 0) throw new IllegalArgumentException("Instrumento no encontrado");
    }
}