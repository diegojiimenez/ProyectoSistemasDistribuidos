import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { reservasService, type ReservaResponse } from "../services/reservasService";
import { cuartosService, type CuartoResponse } from "../services/cuartosService";
import { useAuth } from "../hooks/useAuth";
import {
  calculateMonthlyReservations,
  calculateRoomsByType,
} from "../utils/dashboardCalculations";
import "../styles/ReservationsChart.css";

export const ReservationsChart = () => {
  const { token } = useAuth();
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [cuartos, setCuartos] = useState<CuartoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; reservations: number }[]
  >([]);
  const [roomTypeData, setRoomTypeData] = useState<
    { tipo: string; ocupadas: number }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const [reservasResponse, cuartosResponse] = await Promise.all([
          reservasService.getAllReservas(token),
          cuartosService.getAllCuartos(token),
        ]);

        if (reservasResponse.exito && reservasResponse.datos) {
          setReservas(reservasResponse.datos);
        }

        if (cuartosResponse.exito && cuartosResponse.datos) {
          setCuartos(cuartosResponse.datos);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Calcular datos cuando cambian las reservas o cuartos
  useEffect(() => {
    if (reservas.length > 0 || cuartos.length > 0) {
      const monthly = calculateMonthlyReservations(reservas);
      const roomTypes = calculateRoomsByType(reservas, cuartos);

      console.log("📊 Dashboard Data Debug:");
      console.log("Reservas cargadas:", reservas);
      console.log("Cuartos cargados:", cuartos);
      console.log("Datos mensuales calculados:", monthly);
      console.log("Datos por tipo de cuarto:", roomTypes);

      setMonthlyData(monthly);
      setRoomTypeData(
        roomTypes.map((rt) => ({
          tipo: rt.tipo,
          ocupadas: rt.ocupadas,
        }))
      );
    }
  }, [reservas, cuartos]);

  if (loading) {
    return (
      <div className="charts-wrapper">
        <div className="chart-container">
          <h2 className="chart-title">Reservations Trend</h2>
          <p>Cargando datos...</p>
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Rooms by Type</h2>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <h2 className="chart-title">Reservations Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4C4B0" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#8B6F47"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis stroke="#8B6F47" style={{ fontSize: "0.875rem" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #D4C4B0",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#8B6F47" }}
            />
            <Line
              type="monotone"
              dataKey="reservations"
              stroke="#8B6F47"
              strokeWidth={3}
              dot={{ fill: "#8B6F47", r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Rooms by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roomTypeData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4C4B0" vertical={false} />
            <XAxis
              dataKey="tipo"
              stroke="#8B6F47"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis stroke="#8B6F47" style={{ fontSize: "0.875rem" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #D4C4B0",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#8B6F47" }}
              formatter={(value) => `${value} rooms`}
            />
            <Bar
              dataKey="ocupadas"
              fill="#8B6F47"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
