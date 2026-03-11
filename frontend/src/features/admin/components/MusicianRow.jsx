function MusicianRow({ musician, isLeader, onEdit, onDelete }) {

    console.log("isLeader:", isLeader);

    return (

        <tr>

            <td>{musician.nombreCompleto}</td>

            <td className="text-muted">
                {musician.correo}
            </td>

            <td>
                {musician.instrumento || "—"}

            </td>

            <td>{musician.username}</td>

            <td>
                <span className="badge bg-success-subtle text-success">
                    {musician.estatus}
                </span>
            </td>

            <td>

                {isLeader && (
                    <>
                        <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => onEdit(musician)}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(musician.userId)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </>
                )}

            </td>

        </tr>

    );
}

export default MusicianRow;