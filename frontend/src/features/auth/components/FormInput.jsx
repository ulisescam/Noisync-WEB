import { useState } from "react";
import "./styles/frominput.css";

function FormInput({
    name,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    error,
    forceValidate = false,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);

    const isPassword = type === "password";
    const showValidation = forceValidate || touched;

    const inputClass = `form-control custom-input ${showValidation
            ? error
                ? "is-invalid"
                : "is-valid"
            : ""
        }`;

    return (
        <div className="mb-3">
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            <div className={`input-group ${showValidation && error ? "has-validation" : ""}`}>
                <input
                    name={name}
                    type={isPassword && showPassword ? "text" : type}
                    className={inputClass}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={() => setTouched(true)}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="input-group-text password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                )}

                {showValidation && error && (
                    <div className="invalid-feedback">{error}</div>
                )}
            </div>
        </div>
    );
}

export default FormInput;