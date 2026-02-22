import "../styles/songcard.css";
import SongAvatar from "./songAvatar";
import { useNavigate } from "react-router-dom";

function SongCard({ id, cover, titulo, artista, estado }) {

    const navigate = useNavigate();

    return (
        <div className="col-md-3 mb-4">
            <div className="card shadow-sm h-100 d-flex flex-column">

                <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "180px" }}
                >
                    <SongAvatar
                        nombre={titulo}
                        imagen={cover}
                    />
                </div>

                <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold mb-1">{titulo}</h6>
                    <small className="text-muted d-block">{artista}</small>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="badge">{estado}</span>
                    </div>
                    <br />
                    <button
                        className="btn btn-outline-secondary btn-sm w-100 mt-auto"
                        onClick={() => navigate(`/vista-cancion-publica/${id}`)}
                    >
                        Abrir
                    </button>

                </div>
            </div>
        </div>
    );
}

export default SongCard;
