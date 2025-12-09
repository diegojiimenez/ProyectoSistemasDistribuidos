import { useAuth } from "../hooks/useAuth";
import { ReservationsChart } from "../components/ReservationsChart";
import dashboardImage from "../assets/images/imagenDashboard.jpg";
import "../styles/DashboardPage.css";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Main Layout */}
      <div className="dashboard-layout">
        {/* Main Content */}
        <div className="dashboard-content">
          {/* Welcome Banner */}
          <div className="welcome-banner" style={{ backgroundImage: `url(${dashboardImage})` }}>
            <div className="welcome-overlay"></div>
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back, {user ? user.nombreUsuario : 'Manager'}!
              </h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Active Reservations</p>
              <p className="stat-value">125</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Guests Checked-In</p>
              <p className="stat-value">88</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Current Occupancy</p>
              <p className="stat-value">85%</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Available Rooms</p>
              <p className="stat-value">22</p>
            </div>
          </div>

          {/* Reservations Chart */}
          <ReservationsChart />

          {/* Contenido del Dashboard aquí */}
        </div>
      </div>
    </div>
  );
};
