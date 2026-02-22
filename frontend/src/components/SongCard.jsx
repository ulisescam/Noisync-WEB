function SongCard({ titulo, artista, genero, estado }) {
    return (
        <div className="col-md-3 mb-4">
            <div className="card shadow-sm h-100">

                {/* Cover */}
                <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "180px" }}
                >
                    <span className="text-muted fs-4">Cover</span>
                </div>

                <div className="card-body">
                    <h6 className="fw-bold mb-1">{titulo}</h6>
                    <small className="text-muted d-block">{artista}</small>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="badge bg-success">{estado}</span>
                        <small className="text-muted">{genero}</small>
                    </div>

                    <button className="btn btn-outline-secondary btn-sm w-100 mt-3">
                        Abrir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SongCard;
