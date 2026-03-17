function resolverAcorde(grado, tonica, escala, transposicion = 0) {
    const NOTAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    // Mapeo de bemoles a sus equivalentes con sostenido
    const BEMOLES = { "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#", "Cb": "B" };

    const GRADOS_MAYOR = [0, 2, 4, 5, 7, 9, 11];
    const GRADOS_MENOR = [0, 2, 3, 5, 7, 8, 10];
    const TIPOS_MAYOR = ["", "m", "m", "", "", "m", "dim"];
    const TIPOS_MENOR = ["m", "dim", "", "m", "m", "", ""];

    // Normalizar la tónica (convertir bemol a sostenido equivalente)
    const tonicaNorm = BEMOLES[tonica] || tonica;
    const tonicaIdx = NOTAS.indexOf(tonicaNorm);
    if (tonicaIdx === -1 || grado < 1 || grado > 7) return `$${grado}`;

    const grados = escala === "Menor" ? GRADOS_MENOR : GRADOS_MAYOR;
    const tipos = escala === "Menor" ? TIPOS_MENOR : TIPOS_MAYOR;

    // El módulo con +120 asegura que siempre sea positivo antes de aplicar %12
    const idx = ((tonicaIdx + grados[grado - 1] + transposicion) % 12 + 12) % 12;
    return NOTAS[idx] + tipos[grado - 1];
}

function renderizarLinea(linea, tonica, escala, transposicion) {
    // Divide la línea en tokens: [$N, texto, $N, texto, ...]
    const tokens = linea.split(/(\$\d)/);

    // Construye pares: { acorde, texto }
    const pares = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];
        if (/^\$\d$/.test(token)) {
            const acorde = resolverAcorde(parseInt(token[1]), tonica, escala, transposicion);
            const texto = tokens[i + 1] || "";
            pares.push({ acorde, texto });
            i += 2;
        } else {
            if (token.trim()) pares.push({ acorde: "", texto: token });
            i++;
        }
    }

    if (pares.length === 0) return null;

    // Renderiza acordes arriba, letra abajo
    return (
        <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
            {/* Línea de acordes */}
            <div className="text-success fw-semibold">
                {pares.map((par, idx) => {
                    const espacioTexto = par.texto.length;
                    const espacioAcorde = par.acorde.length;
                    const padding = Math.max(espacioTexto, espacioAcorde + 1);
                    return (
                        <span key={idx} style={{ display: "inline-block", minWidth: `${padding}ch` }}>
                            {par.acorde}
                        </span>
                    );
                })}
            </div>
            {/* Línea de letra */}
            <div>
                {pares.map((par, idx) => (
                    <span key={idx}>{par.texto}</span>
                ))}
            </div>
        </div>
    );
}

function SongStructureView({ blocks, tono = "C", escala = "Mayor", transposicion = 0 }) {
    return (
        <div className="mt-3">
            {blocks.map((block) => (
                <div key={block.sectionId || block.id} className="card shadow-sm mb-3">
                    <div className="card-body">
                        <span className="badge bg-success-subtle text-success mb-3">
                            {block.etiqueta || block.name}
                        </span>
                        <div>
                            {(block.contenido || block.content || "").split("\n").map((linea, i) => (
                                <div key={i} className="mb-2">
                                    {renderizarLinea(linea, tono, escala, transposicion)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SongStructureView;