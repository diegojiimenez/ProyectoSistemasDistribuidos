import { useAuth } from "../hooks/useAuth";
import { ReservationsChart } from "../components/ReservationsChart";
import { reservasService } from "../services/reservasService";
import { cuartosService } from "../services/cuartosService";
import { calculateDashboardStats } from "../utils/dashboardCalculations";
import dashboardImage from "../assets/images/imagenDashboard.jpg";
import { useState, useEffect } from "react";
import "../styles/DashboardPage.css";

export const DashboardPage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    activeReservations: 0,
    guestsCheckedIn: 0,
    currentOccupancy: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const [reservasResponse, cuartosResponse] = await Promise.all([
          reservasService.getAllReservas(token),
          cuartosService.getAllCuartos(token),
        ]);

        if (
          reservasResponse.exito &&
          reservasResponse.datos &&
          cuartosResponse.exito &&
          cuartosResponse.datos
        ) {
          const calculatedStats = calculateDashboardStats(
            reservasResponse.datos,
            cuartosResponse.datos
          );
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

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
              <p className="stat-value">
                {loading ? "-" : stats.activeReservations}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Guests Checked-In</p>
              <p className="stat-value">
                {loading ? "-" : stats.guestsCheckedIn}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Current Occupancy</p>
              <p className="stat-value">
                {loading ? "-" : `${stats.currentOccupancy}%`}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Available Rooms</p>
              <p className="stat-value">
                {loading ? "-" : stats.availableRooms}
              </p>
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
