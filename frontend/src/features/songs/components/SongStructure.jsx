import { useEffect, useState } from "react";
import ChromaticScale from "./ChromaticScale";
import SongBlock from "./SongBlock";
import "../styles/songStructure.css";

function SongStructure({ onSave, onCancel, buttonText = "Guardar canción", loading = false, initialBlocks = [] }) {
    const [blocks, setBlocks] = useState(initialBlocks);

    useEffect(() => {
        if (initialBlocks.length > 0) setBlocks(initialBlocks);
    }, [initialBlocks]);



    const addBlock = () => {
        setBlocks([
            ...blocks,
            {
                id: Date.now(),
                name: "",
                content: ""
            }
        ]);
    };

    const updateBlock = (id, field, value) => {
        setBlocks(
            blocks.map(block =>
                block.id === id ? { ...block, [field]: value } : block
            )
        );
    };

    const deleteBlock = (id) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(blocks);
        }
    };

    return (
        <div className="card shadow-sm mt-4">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">
                        Estructura de la canción
                    </h5>

                    <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={addBlock}
                    >
                        <i className="bi bi-plus"></i> Agregar bloque
                    </button>
                </div>

                <p className="text-muted small">
                    Organiza tu canción en bloques (Verso, Coro, Puente, etc).
                </p>

                {/* ESCALA */}
                <ChromaticScale />

                {/* BLOQUES */}
                {blocks.map((block) => (
                    <SongBlock
                        key={block.id}
                        block={block}
                        updateBlock={updateBlock}
                        deleteBlock={deleteBlock}
                    />
                ))}

            </div>

            {/* FOOTER */}
            <div className="song-structure-footer">

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onCancel}
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleSave}
                >
                    {buttonText}
                </button>

            </div>

        </div>
    );
}

export default SongStructure;