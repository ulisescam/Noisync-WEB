import Navbar from "../components/navbar";
import SongCard from "../components/SongCard";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

function Home() {

    const canciones = [
        { titulo: "Noche estrellada", artista: "Luna Gris", estado: "Pública" },
        { titulo: "Ecos del silencio", artista: "Eco Sonoro",estado: "Pública" },
        { titulo: "Melodía perdida", artista: "Viento Norte",  estado: "Pública" },
        { titulo: "Ritmo urbano", artista: "Ciudad Beats", estado: "Pública" },
        { titulo: "Sueños de cristal", artista: "Luna Gris", estado: "Pública" },
        { titulo: "Amanecer digital", artista: "Eco Sonoro",estado: "Pública" },
        { titulo: "Viento del sur", artista: "Viento Norte", estado: "Pública" },
        { titulo: "Lluvia nocturna", artista: "Ciudad Beats",  estado: "Pública" }
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
