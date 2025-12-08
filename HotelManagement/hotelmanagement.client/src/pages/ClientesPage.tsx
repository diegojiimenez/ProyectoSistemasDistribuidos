import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { HuespedesTable } from "../components/Hotel/HuespedesTable";
import { AddHuespedesModal } from "../components/Hotel/AddHuespedesModal";
import type { HuespedesFormData } from "../components/Hotel/AddHuespedesModal";
import "../styles/ClientesPage.css";

export const ClientesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddHuesped = (data: HuespedesFormData) => {
    console.log("Nuevo huésped:", data);
    // Aquí se enviaría la solicitud al servidor para guardar el huésped
  };

  return (
    <div className="clientes-container">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="clientes-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="clientes-content">
          {/* Header con Título y Botones */}
          <div className="clientes-header">
            <div className="clientes-title-section">
              <h1 className="clientes-title">Listado de Huéspedes</h1>
              <p className="clientes-subtitle">Gestiona toda la información de los huéspedes registrados.</p>
            </div>
            <div className="clientes-actions">
              <button className="btn-export">
                Exportar
              </button>
              <button className="btn-add-huesped" onClick={() => setIsModalOpen(true)}>
                Añadir Huésped
              </button>
            </div>
          </div>

          {/* Tabla de Huéspedes */}
          <HuespedesTable />
        </div>
      </div>

      {/* Modal de Añadir Huésped */}
      <AddHuespedesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddHuesped}
      />
    </div>
  );
};
