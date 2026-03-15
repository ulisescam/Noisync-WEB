package com.noisync.backend.service;

import com.noisync.backend.dto.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SongSectionService {

    private final JdbcTemplate jdbc;

    public SongSectionService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<SectionResponse> mapper = (rs, rowNum) -> new SectionResponse(
            rs.getLong("section_id"),
            rs.getLong("song_id"),
            rs.getInt("orden_seccion"),
            rs.getString("etiqueta"),
            rs.getString("contenido")
    );

    // --- helper: valida que la song pertenece a la banda ---
    private void assertSongBelongsToBand(Long bandId, Long songId) {
        Integer count = jdbc.queryForObject("""
            SELECT COUNT(*)
            FROM song
            WHERE song_id = ?
              AND band_id = ?
        """, Integer.class, songId, bandId);

        if (count == null || count == 0) {
            throw new IllegalArgumentException("Cancion no encontrada");
        }
    }

    // --- helper: valida que la section pertenece a una song de esa banda ---
    private Long getSongIdForSection(Long bandId, Long sectionId) {
        List<Long> res = jdbc.query("""
            SELECT s.song_id
            FROM song_section s
            JOIN song so ON so.song_id = s.song_id
            WHERE s.section_id = ?
              AND so.band_id = ?
        """, (rs, rn) -> rs.getLong(1), sectionId, bandId);

        if (res.isEmpty()) throw new IllegalArgumentException("Seccion no encontrada");
        return res.get(0);
    }

    // LIST (leader y musician)
    public List<SectionResponse> list(Long bandId, Long songId) {
        assertSongBelongsToBand(bandId, songId);

        return jdbc.query("""
            SELECT section_id, song_id, orden_seccion, etiqueta, contenido
            FROM song_section
            WHERE song_id = ?
            ORDER BY orden_seccion ASC
        """, mapper, songId);
    }

    // CREATE (solo leader) -> al final
    @Transactional
    public SectionResponse create(Long bandId, Long songId, SectionCreateRequest req) {
        assertSongBelongsToBand(bandId, songId);

        Integer nextOrder = jdbc.queryForObject("""
            SELECT NVL(MAX(orden_seccion), 0) + 1
            FROM song_section
            WHERE song_id = ?
        """, Integer.class, songId);

        jdbc.update("""
            INSERT INTO song_section (song_id, orden_seccion, etiqueta, contenido)
            VALUES (?, ?, ?, ?)
        """, songId, nextOrder, req.etiqueta(), req.contenido());

        Long sectionId = jdbc.queryForObject("""
            SELECT MAX(section_id) FROM song_section WHERE song_id = ?
        """, Long.class, songId);

        return jdbc.queryForObject("""
            SELECT section_id, song_id, orden_seccion, etiqueta, contenido
            FROM song_section
            WHERE section_id = ?
        """, mapper, sectionId);
    }

    // UPDATE (solo leader)
    @Transactional
    public SectionResponse update(Long bandId, Long sectionId, SectionUpdateRequest req) {
        Long songId = getSongIdForSection(bandId, sectionId);

        int updated = jdbc.update("""
            UPDATE song_section
            SET etiqueta = ?, contenido = ?
            WHERE section_id = ?
        """, req.etiqueta(), req.contenido(), sectionId);

        if (updated == 0) throw new IllegalArgumentException("Seccion no encontrada");

        return jdbc.queryForObject("""
            SELECT section_id, song_id, orden_seccion, etiqueta, contenido
            FROM song_section
            WHERE section_id = ?
        """, mapper, sectionId);
    }

    // DELETE (solo leader) + compactar orden
    @Transactional
    public void delete(Long bandId, Long sectionId) {
        Long songId = getSongIdForSection(bandId, sectionId);

        // obtener orden actual
        Integer oldOrder = jdbc.queryForObject("""
            SELECT orden_seccion FROM song_section WHERE section_id = ?
        """, Integer.class, sectionId);

        jdbc.update("DELETE FROM song_section WHERE section_id = ?", sectionId);

        // compactar: decrementa los que estaban después
        jdbc.update("""
            UPDATE song_section
            SET orden_seccion = orden_seccion - 1
            WHERE song_id = ?
              AND orden_seccion > ?
        """, songId, oldOrder);
    }

    // REORDER (solo leader): recibe lista final de ids
    @Transactional
    public void reorder(Long bandId, Long songId, ReorderSectionsRequest req) {
        assertSongBelongsToBand(bandId, songId);

        List<Long> ids = req.orderedSectionIds();

        // Validar que los ids pertenezcan a ese song y que coincida la cantidad
        Integer countDb = jdbc.queryForObject("""
            SELECT COUNT(*) FROM song_section WHERE song_id = ?
        """, Integer.class, songId);

        if (countDb == null) countDb = 0;

        if (ids.size() != countDb) {
            throw new IllegalArgumentException("La lista de secciones no coincide con la cantidad real");
        }

        Integer countMatch = jdbc.queryForObject("""
            SELECT COUNT(*)
            FROM song_section
            WHERE song_id = ?
              AND section_id IN (%s)
        """.formatted(ids.stream().map(x -> "?").reduce((a,b)->a+","+b).orElse("?")),
                Integer.class,
                mergeParams(songId, ids)
        );

        if (countMatch == null || countMatch != countDb) {
            throw new IllegalArgumentException("Hay secciones invalidas en la lista");
        }

        // Para no romper uq(song_id, orden_seccion), hacemos 2 pasos:
        // 1) mover a negativos
        int i = 1;
        for (Long id : ids) {
            jdbc.update("""
                UPDATE song_section
                SET orden_seccion = ?
                WHERE section_id = ? AND song_id = ?
            """, -i, id, songId);
            i++;
        }

        // 2) poner orden final positivo
        i = 1;
        for (Long id : ids) {
            jdbc.update("""
                UPDATE song_section
                SET orden_seccion = ?
                WHERE section_id = ? AND song_id = ?
            """, i, id, songId);
            i++;
        }
    }

    // helper para query IN con JdbcTemplate
    private Object[] mergeParams(Long songId, List<Long> ids) {
        Object[] params = new Object[1 + ids.size()];
        params[0] = songId;
        for (int i = 0; i < ids.size(); i++) params[i + 1] = ids.get(i);
        return params;
    }

    public List<SectionResponse> listPublic(Long songId) {
    return jdbc.query("""
        SELECT s.section_id, s.song_id, s.orden_seccion, s.etiqueta, s.contenido
        FROM song_section s
        JOIN song so ON so.song_id = s.song_id
        WHERE s.song_id = ?
          AND so.visibilidad = 'PUBLIC'
          AND so.estatus = 'ACTIVO'
        ORDER BY s.orden_seccion ASC
    """, mapper, songId);
}
}