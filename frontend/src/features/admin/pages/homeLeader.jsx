import Pagination from "../../shared/components/Pagination";
import SongCard from "../../songs/components/SongCard";
import "../components/styles/homeLeader.css";
import { Link } from "react-router-dom";
import { useSongs } from "../../hooks/useSongs";


function HomeLeader() {
    const {
        canciones, totalPaginas, paginaActual, setPaginaActual,
        busqueda, setBusqueda, filtro, setFiltro, loading
    } = useSongs();

    return (
        <>
            <h3 className="mb-0">Canciones</h3>
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
                <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 w-100 w-lg-auto">
                    <div style={{ minWidth: "220px" }} className="flex-grow-1">
                        <div className="input-group">
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
                    </div>
                    <div className="custom-segment">
                        <input type="radio" id="todas" name="filter" checked={filtro === "todas"} onChange={() => setFiltro("todas")} />
                        <label htmlFor="todas">Todas</label>
                        <input type="radio" id="publicas" name="filter" checked={filtro === "publicas"} onChange={() => setFiltro("publicas")} />
                        <label htmlFor="publicas">Públicas</label>
                        <input type="radio" id="privadas" name="filter" checked={filtro === "privadas"} onChange={() => setFiltro("privadas")} />
                        <label htmlFor="privadas">Privadas</label>
                    </div>
                </div>
                <Link to="/record-song" className="btn btn-dark px-4 py-2 align-self-start align-self-lg-auto" style={{ whiteSpace: "nowrap" }}>
                    + Registrar canción
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Cargando canciones...
                </div>
            ) : canciones.length === 0 ? (
                <div className="text-center py-5 text-muted">No hay canciones registradas.</div>
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
        </>
    );
}

export default HomeLeader;