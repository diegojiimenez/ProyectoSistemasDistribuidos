import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/logoRemoveBG.png";
import { authService } from "../services/authService";
import "../styles/login.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({
        nombreUsuario,
        password,
      });

      // Guardar token en localStorage
      authService.saveToken(response.token);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
      console.error("Error al iniciar sesión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo */}
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Bienvenido de Nuevo</h1>
          <p className="login-subtitle">Inicia sesión para acceder a tu cuenta.</p>
        </div>

        {/* Form */}
        <div className="login-form-box">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="form-control">
              <label htmlFor="username" className="form-label">
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="usuario@ejemplo.com"
                className="form-input"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Recuérdame</label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="login-footer">
          © 2025 Vesta. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};
