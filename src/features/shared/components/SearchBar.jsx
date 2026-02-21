function SearchBar() {
    return (
        <div className="my-3">
            <input
                type="text"
                className="form-control"
                placeholder="Buscar por título, artista o género..."
            />
        </div>
    );
}

export default SearchBar;
