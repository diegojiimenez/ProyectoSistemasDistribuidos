import {
  LineChart,
  Line,
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

export const ReservationsChart = () => {
  return (
    <div className="chart-container">
      <h2 className="chart-title">Reservations Trend</h2>
      <ResponsiveContainer width="100%" height={400}>
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
  );
};
