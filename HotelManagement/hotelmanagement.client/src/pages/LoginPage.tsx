import { useState } from "react";
import logo from "../assets/logos/logoRemoveBG.png";
import "../styles/login.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log({ email, password, rememberMe });
    setTimeout(() => setIsLoading(false), 1000);
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
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-control">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
