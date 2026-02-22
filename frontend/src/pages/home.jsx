import Navbar from "../components/navbar";
import SongCard from "../components/SongCard";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

function Home() {

    const canciones = [
        { titulo: "Noche estrellada", artista: "Luna Gris", genero: "Rock", estado: "Pública" },
        { titulo: "Ecos del silencio", artista: "Eco Sonoro", genero: "Jazz", estado: "Pública" },
        { titulo: "Melodía perdida", artista: "Viento Norte", genero: "Pop", estado: "Pública" },
        { titulo: "Ritmo urbano", artista: "Ciudad Beats", genero: "Hip Hop", estado: "Pública" },
        { titulo: "Sueños de cristal", artista: "Luna Gris", genero: "Rock", estado: "Pública" },
        { titulo: "Amanecer digital", artista: "Eco Sonoro", genero: "Indie", estado: "Pública" },
        { titulo: "Viento del sur", artista: "Viento Norte", genero: "Folk", estado: "Pública" },
        { titulo: "Lluvia nocturna", artista: "Ciudad Beats", genero: "Ambient", estado: "Pública" }
    ];

    return (
        <main>

            <Navbar />

            <div className="container mt-4">

                <h4 className="fw-bold">Explorar canciones públicas</h4>

                <SearchBar />

                <Filters />

                <div className="row">
                    {canciones.map((cancion, index) => (
                        <SongCard
                            key={index}
                            titulo={cancion.titulo}
                            artista={cancion.artista}
                            genero={cancion.genero}
                            estado={cancion.estado}
                        />
                    ))}
                </div>

                <Pagination />

            </div>
        </main>
    );
}

export default Home;
