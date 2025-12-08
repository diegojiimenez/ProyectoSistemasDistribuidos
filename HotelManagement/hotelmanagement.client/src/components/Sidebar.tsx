import { useLocation, Link } from "react-router-dom";
import "../styles/Sidebar.css";
import DashboardIcon from "../assets/icons/dashboard-2-svgrepo-com.svg";
import ReservasIcon from "../assets/icons/calendar-days-svgrepo-com.svg";
import ClientesIcon from "../assets/icons/user-svgrepo-com.svg";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Reservas", href: "/reservas", icon: ReservasIcon },
  { label: "Clientes", href: "/clientes", icon: ClientesIcon },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Panel de Control</h3>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
          >
            <div className="nav-icon">
              <img src={item.icon} alt={item.label} />
            </div>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
