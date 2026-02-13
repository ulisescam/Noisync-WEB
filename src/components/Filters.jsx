function Filters() {
    return (
        <div className="d-flex align-items-center gap-2 mb-3">
            <small className="text-muted">Filtros:</small>

            <button className="btn btn-dark btn-sm">Todos</button>
            <button className="btn btn-outline-secondary btn-sm">Recientes</button>

            <select className="form-select form-select-sm w-auto">
                <option>Todas las categorías</option>
                <option>Rock</option>
                <option>Pop</option>
                <option>Hip Hop</option>
            </select>
        </div>
    );
}

export default Filters;
