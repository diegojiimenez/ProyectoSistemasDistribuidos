import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import logoNavbar from "../assets/logos/logoNavbar.png";
import DashboardIcon from "../assets/icons/dashboard-2-svgrepo-com.svg";
import ReservasIcon from "../assets/icons/calendar-days-svgrepo-com.svg";
import ClientesIcon from "../assets/icons/user-svgrepo-com.svg";
import "../styles/Navbar.css";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Reservas", href: "/reservas", icon: ReservasIcon },
  { label: "Clientes", href: "/clientes", icon: ClientesIcon },
];

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddCliente = () => {
    // Dispatchear un evento o usar context para abrir el modal
    const event = new CustomEvent("openClienteModal");
    window.dispatchEvent(event);
  };

  const handleAddReserva = () => {
    // Dispatchear un evento para abrir el modal de reservas
    const event = new CustomEvent("openReservaModal");
    window.dispatchEvent(event);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo-section">
          <img src={logoNavbar} alt="Hotel ERP Logo" className="navbar-logo" />
        </div>
        <nav className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`nav-link-btn ${location.pathname === item.href ? 'active' : ''}`}
              title={item.label}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="navbar-actions">
          {location.pathname === "/clientes" && (
            <button className="btn-add-cliente" onClick={handleAddCliente}>
              + Añadir Nuevo Huésped
            </button>
          )}
          {location.pathname === "/reservas" && (
            <button className="btn-add-cliente" onClick={handleAddReserva}>
              + Añadir Nueva Reserva
            </button>
          )}
          <button className="action-btn" title="Notificaciones">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button onClick={handleLogout} className="action-btn" title="Cerrar sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
