import "../styles/pagination.css";

function Pagination({ totalPaginas, paginaActual, setPaginaActual }) {
    return (
        <nav className="mt-4">
            <ul className="pagination justify-content-center">

                <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                        Previous
                    </button>
                </li>

                {[...Array(totalPaginas)].map((_, index) => (
                    <li
                        key={index}
                        className={`page-item ${paginaActual === index + 1 ? "active" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => setPaginaActual(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                        Next
                    </button>
                </li>

            </ul>
        </nav>
    );
}


export default Pagination;
