import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockIcon, AlertCircleIcon } from "../components/Icons";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        if (!usuario.trim() || !password.trim()) {
            setError("Por favor, ingrese todos los campos.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            if (usuario === "admin" && password === "1234") {
                navigate("/home");
            } else {
                setError("Usuario o contraseña incorrectos.");
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Grupo Cordillera</h2>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "25px", fontSize: "0.88rem" }}>
                    Plataforma de Monitoreo Organizacional
                </p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                            Usuario
                        </label>
                        <div className="input-container">
                            <UserIcon className="input-icon" />
                            <input
                                type="text"
                                placeholder="Ingresa tu usuario (admin)"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "5px" }}>
                        <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                            Contraseña
                        </label>
                        <div className="input-container">
                            <LockIcon className="input-icon" />
                            <input
                                type="password"
                                placeholder="Contraseña (1234)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircleIcon className="alert-icon" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;