package com.noisync.backend.service;

import com.noisync.backend.dto.InstrumentResponse;
import com.noisync.backend.dto.MusicianResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MusicianInstrumentService {

    private final JdbcTemplate jdbc;

    public MusicianInstrumentService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

private final RowMapper<MusicianResponse> musicianMapper = (rs, rn) -> new MusicianResponse(
        rs.getLong("user_id"),
        rs.getLong("band_id"),
        rs.getString("nombre_completo"),
        rs.getString("correo"),
        rs.getString("username"),
        rs.getString("estatus"),
        rs.getString("instrumento")
);

    private final RowMapper<InstrumentResponse> instrumentMapper = (rs, rn) -> new InstrumentResponse(
            rs.getLong("instrument_id"),
            rs.getLong("band_id"),
            rs.getString("nombre"),
            rs.getInt("activo")
    );

public List<MusicianResponse> listMusicians(Long bandId) {
    return jdbc.query("""
        SELECT 
            u.user_id,
            u.band_id,
            p.nombre_completo,
            p.correo,
            u.username,
            u.estatus,
            i.nombre AS instrumento
        FROM app_user u
        JOIN person p ON p.person_id = u.person_id
        LEFT JOIN musician_instrument mi ON mi.user_id = u.user_id
        LEFT JOIN instrument i ON i.instrument_id = mi.instrument_id
        WHERE u.band_id = ?
          AND u.rol = 'MUSICIAN'
          AND u.activo = 1
        ORDER BY p.nombre_completo ASC
    """, musicianMapper, bandId);
}

    public List<InstrumentResponse> listMusicianInstruments(Long bandId, Long musicianId) {
        // valida que el musico sea de la banda
        Integer ok = jdbc.queryForObject("""
            SELECT COUNT(*) FROM app_user
            WHERE user_id = ? AND band_id = ? AND rol = 'MUSICIAN'
        """, Integer.class, musicianId, bandId);

        if (ok == null || ok == 0) throw new IllegalArgumentException("Musico no encontrado");

        return jdbc.query("""
            SELECT i.instrument_id, i.band_id, i.nombre, i.activo
            FROM musician_instrument mi
            JOIN instrument i ON i.instrument_id = mi.instrument_id
            WHERE mi.user_id = ?
              AND i.band_id = ?
              AND i.activo = 1
            ORDER BY i.nombre ASC
        """, instrumentMapper, musicianId, bandId);
    }

    @Transactional
    public void assign(Long bandId, Long musicianId, Long instrumentId) {
        // valida musico
        Integer okM = jdbc.queryForObject("""
            SELECT COUNT(*) FROM app_user
            WHERE user_id = ? AND band_id = ? AND rol = 'MUSICIAN'
        """, Integer.class, musicianId, bandId);

        if (okM == null || okM == 0) throw new IllegalArgumentException("Musico no encontrado");

        // valida instrumento
        Integer okI = jdbc.queryForObject("""
            SELECT COUNT(*) FROM instrument
            WHERE instrument_id = ? AND band_id = ? AND activo = 1
        """, Integer.class, instrumentId, bandId);

        if (okI == null || okI == 0) throw new IllegalArgumentException("Instrumento no encontrado");

        // insertar relacion (pk compuesta evita duplicado)
        jdbc.update("""
            INSERT INTO musician_instrument (user_id, instrument_id)
            VALUES (?, ?)
        """, musicianId, instrumentId);
    }

    @Transactional
    public void unassign(Long bandId, Long musicianId, Long instrumentId) {
        // validar instrumento pertenece a la banda
        Integer okI = jdbc.queryForObject("""
            SELECT COUNT(*) FROM instrument
            WHERE instrument_id = ? AND band_id = ?
        """, Integer.class, instrumentId, bandId);

        if (okI == null || okI == 0) throw new IllegalArgumentException("Instrumento no encontrado");

        jdbc.update("""
            DELETE FROM musician_instrument
            WHERE user_id = ? AND instrument_id = ?
        """, musicianId, instrumentId);
    }
}