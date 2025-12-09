import { useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { HuespedesTable } from "../components/Hotel/HuespedesTable";
import { AddHuespedesModal, type HuespedesFormData } from "../components/Hotel/AddHuespedesModal";
import { huespedesService } from "../services/huespedesService";
import { useAuth } from "../hooks/useAuth";
import "../styles/ClientesPage.css";

interface HuespedEdit extends HuespedesFormData {
  id: number;
}

export const ClientesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingHuesped, setEditingHuesped] = useState<HuespedEdit | null>(null);
  const { token } = useAuth();
  const tableRefresh = useRef<(() => void) | null>(null);

  const handleAddHuesped = async (data: HuespedesFormData) => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    setError(null);

    try {
      const response = await huespedesService.createHuesped(
        {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono,
          documentoIdentidad: data.documentoIdentidad,
          direccion: data.direccion,
        },
        token
      );

      if (response.exito) {
        console.log("Huésped creado exitosamente:", response.datos);
        setIsModalOpen(false);
        // Refrescar la tabla
        if (tableRefresh.current) {
          tableRefresh.current();
        }
      } else {
        setError(response.mensaje || "Error al crear el huésped");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al crear huésped:", err);
    }
  };

  const handleEditHuesped = async (data: HuespedesFormData) => {
    if (!token || !editingHuesped) {
      setError("No hay token de autenticación o huésped para editar");
      return;
    }

    setError(null);

    try {
      const response = await huespedesService.updateHuesped(
        editingHuesped.id,
        {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono,
          documentoIdentidad: data.documentoIdentidad,
          direccion: data.direccion,
        },
        token
      );

      if (response.exito) {
        console.log("Huésped actualizado exitosamente:", response.datos);
        setIsModalOpen(false);
        setEditingHuesped(null);
        // Refrescar la tabla
        if (tableRefresh.current) {
          tableRefresh.current();
        }
      } else {
        setError(response.mensaje || "Error al actualizar el huésped");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al actualizar huésped:", err);
    }
  };

  const handleOpenEditModal = async (huespedId: number) => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    setError(null);

    try {
      const response = await huespedesService.getHuespedById(huespedId, token);

      if (response.exito && response.datos) {
        const huesped = response.datos;
        const editData: HuespedEdit = {
          id: huesped.id,
          nombre: huesped.nombre,
          apellido: huesped.apellido,
          email: huesped.correoElectronico,
          telefono: huesped.telefono,
          documentoIdentidad: huesped.documentoIdentidad,
          direccion: huesped.direccion,
          estado: "Regular",
        };
        
        setEditingHuesped(editData);
        setIsModalOpen(true);
      } else {
        setError(response.mensaje || "Error al obtener los datos del huésped");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al obtener huésped:", err);
    }
  };

  const handleDeleteHuesped = async (huespedId: number) => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    setError(null);

    try {
      const response = await huespedesService.deleteHuesped(huespedId, token);

      if (response.exito) {
        console.log("Huésped eliminado exitosamente");
        // Refrescar la tabla
        if (tableRefresh.current) {
          tableRefresh.current();
        }
      } else {
        setError(response.mensaje || "Error al eliminar el huésped");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al eliminar huésped:", err);
    }
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
          <HuespedesTable 
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteHuesped}
            onRefreshRef={(refresh) => {
              tableRefresh.current = refresh;
            }}
          />
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="error-notification">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Modal de Añadir/Editar Huésped */}
      <AddHuespedesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHuesped(null);
        }}
        onSubmit={editingHuesped ? handleEditHuesped : handleAddHuesped}
        initialData={editingHuesped || undefined}
      />
    </div>
  );
};
