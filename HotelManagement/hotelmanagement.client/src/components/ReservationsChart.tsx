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
import "../styles/ReservationsChart.css";

const data = [
  { month: "Jan", reservations: 65 },
  { month: "Feb", reservations: 90 },
  { month: "Mar", reservations: 87 },
  { month: "Apr", reservations: 88 },
  { month: "May", reservations: 75 },
  { month: "Jun", reservations: 92 },
];

const roomTypesData = [
  { tipo: "Simple", ocupadas: 12 },
  { tipo: "Doble", ocupadas: 18 },
  { tipo: "Deluxe", ocupadas: 8 },
  { tipo: "Suite", ocupadas: 5 },
];

export const ReservationsChart = () => {
  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <h2 className="chart-title">Reservations Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
          <BarChart data={roomTypesData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
