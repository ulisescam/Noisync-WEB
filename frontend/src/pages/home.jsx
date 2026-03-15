import { useState, useEffect } from "react";

import Navbar from "../features/shared/components/navbar";
import Pagination from "../features/shared/components/Pagination";
import SongCard from "../features/songs/components/SongCard";
import { getPublicSongs } from "../api/songService";


function Home() {
    const [canciones, setCanciones] = useState([]);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [paginaActual, setPaginaActual] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    const load = async (page = 0, q = "") => {
        try {
            setLoading(true);
            const data = await getPublicSongs(page, 8, q);
            setCanciones(data.content);
            setTotalPaginas(data.totalPages);
        } catch (e) {
            console.error("Error cargando canciones públicas:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(paginaActual, busqueda);
    }, [paginaActual, busqueda]);

    return (
        <main>
            <header>
                <Navbar />
            </header>
            <div className="container mt-4">
                <h4 className="fw-bold">Explorar canciones públicas</h4>

                <div className="input-group mb-4">
                    <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Buscar canción..."
                        value={busqueda}
                        onChange={e => { setBusqueda(e.target.value); setPaginaActual(0); }}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Cargando canciones...
                    </div>
                ) : canciones.length === 0 ? (
                    <div className="text-center py-5 text-muted">No hay canciones públicas disponibles.</div>
                ) : (
                    <div className="row">
                        {canciones.map(c => (
                            <SongCard
                                key={c.songId}
                                id={c.songId}
                                cover={c.coverUrl}
                                titulo={c.titulo}
                                artista={c.artistaAutor}
                                estado={c.visibilidad === "PUBLIC" ? "Pública" : "Privada"}
                                nombreBanda={c.nombreBanda}
                            />
                        ))}
                    </div>
                )}

                <Pagination
                    totalPaginas={totalPaginas}
                    paginaActual={paginaActual + 1}
                    setPaginaActual={(p) => setPaginaActual(p - 1)}
                />
            </div>
        </main>
    );
}

export default Home;