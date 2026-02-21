const getInitials = (text) => {
    if (!text) return "";
    const words = text.split(" ");

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
};

const stringToColor = (str) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;

    return `hsl(${hue}, 60%, 55%)`;
};

function SongAvatar({ nombre, imagen }) {

    if (imagen) {
        return (
            <img
                src={imagen}
                alt={nombre}
                className="w-100 h-100 object-fit-cover rounded-top"
            />
        );
    }

    const initials = getInitials(nombre);
    const bgColor = stringToColor(nombre);

    return (
        <div
            className="w-100 h-100 d-flex align-items-center justify-content-center rounded-top text-white fw-bold"
            style={{
                backgroundColor: bgColor,
                fontSize: "2rem"
            }}
        >
            {initials}
        </div>
    );
}

export default SongAvatar;
