import { useState } from "react";
import "./styles/frominput.css";

function FormInput({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false
}) {

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <div className="mb-3">

            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            <div className="position-relative">

                <input
                    type={isPassword && showPassword ? "text" : type}
                    className="form-control custom-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />

                {isPassword && (
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        {showPassword ? "Ocultar" : "Ver"}
                    </span>
                )}

            </div>

        </div>
    );
}

export default FormInput;
