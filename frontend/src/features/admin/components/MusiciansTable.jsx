import MusicianRow from "./MusicianRow";

function MusiciansTable({ musicians, isLeader, onEdit, onDelete }) {

    return (
        <>
            <div className="table-responsive">
                <table className="table">

                    <thead>
                        <tr>
                            <th className="text-secondary">NOMBRE</th>
                            <th className="text-secondary">CORREO</th>
                            <th className="text-secondary">INSTRUMENTO</th>
                            <th className="text-secondary">ROL</th>
                            <th className="text-secondary">ESTATUS</th>
                            {isLeader && (
                                <th className="text-secondary">ACCIONES</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>

                        {musicians.map((musician) => (
                            <MusicianRow
                                key={musician.userId}
                                musician={musician}
                                isLeader={isLeader}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}

                    </tbody>

                </table>
            </div>
        </>
    );
}

export default MusiciansTable;