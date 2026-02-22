import { useParams } from "react-router-dom";
import SongInfo from "../components/songInfo";
import AuthHeader from "../../auth/components/AuthHeader";

function VistaPublicaCancion() {

    const { id } = useParams();
    const idNumero = parseInt(id);

    const cancionesMock = [
        { id: "1", titulo: "Noche estrellada", artista: "Luna Gris", tono: "C", bpm: 120, estado: "Pública" },
        { id: "2", titulo: "Ecos del silencio", artista: "Eco Sonoro", tono: "D", bpm: 98, estado: "Pública" },
        { id: "3", titulo: "Melodía perdida", artista: "Viento Norte", tono: "Am", bpm: 105, estado: "Pública" },
        { id: "4", titulo: "Ritmo urbano", artista: "Ciudad Beats", tono: "F", bpm: 110, estado: "Pública" },
        { id: "5", titulo: "Sueños de cristal", artista: "Luna Gris", tono: "G", bpm: 95, estado: "Pública" },
        { id: "6", titulo: "Amanecer digital", artista: "Eco Sonoro", tono: "Em", bpm: 128, estado: "Pública" },
        { id: "7", titulo: "Viento del sur", artista: "Viento Norte", tono: "Dm", bpm: 102, estado: "Pública" },
        { id: "8", titulo: "Lluvia nocturna", artista: "Ciudad Beats", tono: "Bm", bpm: 118, estado: "Pública" },
        { id: "9", titulo: "Sombras del ayer", artista: "Nebula Sound", tono: "C#", bpm: 90, estado: "Pública" },
        { id: "10", titulo: "Horizonte infinito", artista: "Solar Echo", tono: "A", bpm: 130, estado: "Pública" },
        { id: "11", titulo: "Frecuencia azul", artista: "Waveform", tono: "E", bpm: 112, estado: "Pública" },
        { id: "12", titulo: "Latidos eléctricos", artista: "Pulse Factory", tono: "F#", bpm: 124, estado: "Pública" }
    ];


    const cancion = cancionesMock.find(c => c.id.toString() === id);

    if (!cancion) {
        return (
            <div className="container mt-4">
                <h4>Canción no encontrada</h4>
            </div>
        );
    }

    return (
        <>
            <AuthHeader />

            <main className="container mt-4">
                <SongInfo
                    titulo={cancion.titulo}
                    artista={cancion.artista}
                    tono={cancion.tono}
                    bpm={cancion.bpm}
                    estado={cancion.estado}
                />
            </main>
        </>
    );
}

export default VistaPublicaCancion;
