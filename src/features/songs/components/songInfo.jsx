import "../styles/songInfo.css";
import SongAvatar from "./songAvatar";

function SongInfo({ titulo, artista, tono, bpm, estado, cover }) {

    return (
        <div className="song-info-card">

            <div className="d-flex align-items-center">

                <div className="cover-container">
                    <SongAvatar
                        nombre={titulo}
                        imagen={cover}
                    />
                </div>

                <div className="flex-grow-1 ms-4">

                    <div className="d-flex justify-content-between align-items-start">

                        <div>
                            <h4 className="fw-bold mb-1">{titulo}</h4>
                            <p className="text-muted mb-2">{artista}</p>

                            <div className="song-meta">
                                <span>Tono original:</span>
                                <strong className="mx-2">{tono}</strong>
                                <span>BPM:</span>
                                <strong className="ms-2">{bpm}</strong>
                            </div>
                        </div>

                        <span className="badge">{estado}</span>


                    </div>

                </div>
            </div>

            <hr />

            <div>
                <p className="fw-semibold mb-2">Controles de transposición</p>

                <div className="d-flex gap-2 align-items-center">

                    <button className="btn btn-outline-secondary">+1</button>
                    <button className="btn btn-outline-secondary">-1</button>
                    <button className="btn btn-outline-secondary">+½</button>
                    <button className="btn btn-outline-secondary">-½</button>



                    <button className="btn btn-outline-secondary">
                        Restablecer
                    </button>

                </div>
            </div>

        </div>
    );
}

export default SongInfo;
