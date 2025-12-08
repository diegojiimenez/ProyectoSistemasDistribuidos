import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./DashboardPage.css";

// Datos inventados de clientes por mes
const clientesData = [
  { mes: "Ene", clientes: 45 },
  { mes: "Feb", clientes: 52 },
  { mes: "Mar", clientes: 48 },
  { mes: "Abr", clientes: 67 },
  { mes: "May", clientes: 58 },
  { mes: "Jun", clientes: 71 },
  { mes: "Jul", clientes: 82 },
];

export const DashboardPage = () => {

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Dashboard Title */}
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">Dashboard</h1>
          </div>

          {/* Mission & Vision Grid */}
          <div className="mission-vision-grid">
            <div className="mission-card">
              <h3> MISIÓN – RÚSTICO</h3>
              <p>
                Brindar una experiencia de hospedaje cálida y auténtica en medio de la montaña,
                combinando el confort moderno con la esencia rústica de la naturaleza.
                En RÚSTICO buscamos que cada huésped se sienta parte del paisaje: acogido por la
                madera, la tranquilidad y el fuego del hogar. Nuestro compromiso es ofrecer descanso
                genuino, servicio cercano y espacios diseñados para reconectar con uno mismo y con la
                belleza del entorno natural.
              </p>
            </div>

            <div className="vision-card">
              <h3> VISIÓN – RÚSTICO</h3>
              <p>
                Convertirnos en el refugio montañoso más reconocido por su armonía entre diseño,
                naturaleza y bienestar, siendo un referente de hotelería sostenible y de alto estándar
                en la región.
                Queremos que RÚSTICO sea sinónimo de calma, calidad y autenticidad: un destino donde
                viajeros de todo el mundo encuentren inspiración, paz y experiencias memorables en un
                ambiente rústico-elegante.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-label">Ingresos Totales</div>
              <p className="stat-card-value">$125,830</p>
              <div className="stat-card-change stat-change-positive">↑ +5.2%</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">Reservas Totales</div>
              <p className="stat-card-value">1,450</p>
              <div className="stat-card-change stat-change-negative">↓ -1.5%</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">Tasa de Ocupación</div>
              <p className="stat-card-value">85%</p>
              <div className="stat-card-change stat-change-positive">↑ +2.0%</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">Nuevos Clientes</div>
              <p className="stat-card-value">210</p>
              <div className="stat-card-change stat-change-positive">↑ +0.5%</div>
            </div>
          </div>

          {/* Charts Area */}
          <div className="charts-section">
            <div className="chart-container">
              <h3 className="chart-title">Clientes por Mes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientesData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                    formatter={(value) => `${value} clientes`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clientes" 
                    stroke="#1f2937" 
                    strokeWidth={2}
                    dot={{ fill: "#1f2937", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
