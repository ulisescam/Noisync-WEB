package com.noisync.backend.service;

import com.noisync.backend.dto.PageResponse;
import com.noisync.backend.dto.SongCreateRequest;
import com.noisync.backend.dto.SongResponse;
import com.noisync.backend.dto.SongUpdateRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
public class SongService {

    private final JdbcTemplate jdbc;

    public SongService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<SongResponse> songMapper = (rs, rowNum) -> new SongResponse(
            rs.getLong("song_id"),
            rs.getLong("band_id"),
            rs.getString("titulo"),
            rs.getString("artista_autor"),
            rs.getInt("bpm"),
            rs.getString("tono_original"),
            rs.getString("escala_base"),
            rs.getString("visibilidad"),
            rs.getString("estatus"),
            rs.getString("cover_url"),
            toInstant(rs.getTimestamp("fecha_creacion")),
            toInstant(rs.getTimestamp("fecha_actualizacion"))
    );

    private Instant toInstant(Timestamp ts) {
        return ts == null ? null : ts.toInstant();
    }

    private void validate(SongCreateRequest req) {
        if (req.bpm() == null || req.bpm() <= 0) {
            throw new IllegalArgumentException("El BPM debe ser mayor a 0");
        }
        if (!req.visibilidad().equalsIgnoreCase("PUBLIC") && !req.visibilidad().equalsIgnoreCase("PRIVATE")) {
            throw new IllegalArgumentException("Visibilidad invalida (PUBLIC/PRIVATE)");
        }
        if (req.escalaBase() == null || req.escalaBase().isBlank()) {
            throw new IllegalArgumentException("escalaBase es obligatoria");
        }
    }

    private void validate(SongUpdateRequest req) {
        if (req.bpm() == null || req.bpm() <= 0) {
            throw new IllegalArgumentException("El BPM debe ser mayor a 0");
        }
        if (!req.visibilidad().equalsIgnoreCase("PUBLIC") && !req.visibilidad().equalsIgnoreCase("PRIVATE")) {
            throw new IllegalArgumentException("Visibilidad invalida (PUBLIC/PRIVATE)");
        }
        if (req.escalaBase() == null || req.escalaBase().isBlank()) {
            throw new IllegalArgumentException("escalaBase es obligatoria");
        }
    }

    public PageResponse<SongResponse> list(Long bandId, String q, int page, int size) {
        int offset = page * size;
        String baseWhere = q == null || q.isBlank() ? "" :
                " AND (LOWER(titulo) LIKE ? OR LOWER(artista_autor) LIKE ?)";

        // Query paginada
        String sql = """
        SELECT song_id, band_id, titulo, artista_autor, bpm, tono_original, escala_base,
               visibilidad, estatus, cover_url, fecha_creacion, fecha_actualizacion
        FROM song
        WHERE band_id = ?
          AND estatus = 'ACTIVO'
        """ + baseWhere + """
        ORDER BY fecha_creacion DESC
        OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    """;

        // Query para total
        String countSql = """
        SELECT COUNT(*) FROM song
        WHERE band_id = ? AND estatus = 'ACTIVO'
        """ + baseWhere;

        List<SongResponse> content;
        Long total;

        if (q == null || q.isBlank()) {
            content = jdbc.query(sql, songMapper, bandId, offset, size);
            total = jdbc.queryForObject(countSql, Long.class, bandId);
        } else {
            String like = "%" + q.trim().toLowerCase() + "%";
            content = jdbc.query(sql, songMapper, bandId, like, like, offset, size);
            total = jdbc.queryForObject(countSql, Long.class, bandId, like, like);
        }

        int totalPages = (int) Math.ceil((double) total / size);

        return new PageResponse<>(
                content,
                page,
                size,
                total,
                totalPages,
                page >= totalPages - 1
        );
    }

    // GET (por banda)
    public SongResponse get(Long bandId, Long songId) {
        List<SongResponse> res = jdbc.query("""
            SELECT song_id, band_id, titulo, artista_autor, bpm, tono_original, escala_base,
                   visibilidad, estatus, cover_url, fecha_creacion, fecha_actualizacion
            FROM song
            WHERE band_id = ?
              AND song_id = ?
        """, songMapper, bandId, songId);

        if (res.isEmpty()) throw new IllegalArgumentException("Cancion no encontrada");
        return res.get(0);
    }

    // CREATE (leader)
    @Transactional
    public SongResponse create(Long bandId, Long userId, SongCreateRequest req) {
        validate(req);

        jdbc.update("""
            INSERT INTO song (
              band_id, titulo, artista_autor, bpm, tono_original, escala_base,
              visibilidad, estatus, cover_url,
              created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVO', ?, ?, ?)
        """,
                bandId,
                req.titulo(),
                req.artistaAutor(),
                req.bpm(),
                req.tonoOriginal(),
                req.escalaBase(),
                req.visibilidad().toUpperCase(),
                req.coverUrl(),
                userId,
                userId
        );

        // obtener el último insert de esa banda/usuario (suficiente para dev)
        Long songId = jdbc.queryForObject("""
            SELECT MAX(song_id)
            FROM song
            WHERE band_id = ? AND created_by = ?
        """, Long.class, bandId, userId);

        return get(bandId, songId);
    }

    // UPDATE (leader)
    @Transactional
    public SongResponse update(Long bandId, Long userId, Long songId, SongUpdateRequest req) {
        validate(req);

        int updated = jdbc.update("""
            UPDATE song
            SET titulo = ?,
                artista_autor = ?,
                bpm = ?,
                tono_original = ?,
                escala_base = ?,
                visibilidad = ?,
                cover_url = ?,
                updated_by = ?
            WHERE band_id = ?
              AND song_id = ?
              AND estatus = 'ACTIVO'
        """,
                req.titulo(),
                req.artistaAutor(),
                req.bpm(),
                req.tonoOriginal(),
                req.escalaBase(),
                req.visibilidad().toUpperCase(),
                req.coverUrl(),
                userId,
                bandId,
                songId
        );

        if (updated == 0) throw new IllegalArgumentException("Cancion no encontrada o ya eliminada");
        return get(bandId, songId);
    }

    // SOFT DELETE (leader)
    @Transactional
    public void delete(Long bandId, Long userId, Long songId) {
        int updated = jdbc.update("""
            UPDATE song
            SET estatus = 'ELIMINADO',
                updated_by = ?
            WHERE band_id = ?
              AND song_id = ?
              AND estatus = 'ACTIVO'
        """, userId, bandId, songId);

        if (updated == 0) throw new IllegalArgumentException("Cancion no encontrada o ya eliminada");
    }
}