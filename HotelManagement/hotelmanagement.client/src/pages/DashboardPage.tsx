import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import "./DashboardPage.css";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <h2 className="sidebar-title">Menú</h2>
            <ul className="nav-list">
              <li><a href="#dashboard" className="nav-link active">Dashboard</a></li>
              <li><a href="#clientes" className="nav-link">Clientes</a></li>
              <li><a href="#cuartos" className="nav-link">Cuartos</a></li>
              <li><a href="#reservas" className="nav-link">Reservas</a></li>
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <section className="dashboard-content">
          <div className="welcome-card">
            <h2>Bienvenido, {user?.nombreUsuario}!</h2>
            <p>Este es tu panel de control. Aquí podrás gestionar:</p>
            <ul className="features-list">
              <li>👥 Clientes y huéspedes</li>
              <li>🛏️ Cuartos del hotel</li>
              <li>📅 Reservas y disponibilidad</li>
            </ul>
          </div>

          {/* Cards de estadísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Clientes</h3>
              <p className="stat-number">--</p>
            </div>
            <div className="stat-card">
              <h3>Cuartos Disponibles</h3>
              <p className="stat-number">--</p>
            </div>
            <div className="stat-card">
              <h3>Reservas Activas</h3>
              <p className="stat-number">--</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
