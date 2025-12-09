import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
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

  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
      setEditingHuesped(null);
    };

    window.addEventListener("openClienteModal", handleOpenModal);
    return () => window.removeEventListener("openClienteModal", handleOpenModal);
  }, []);

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
        // Aquí podrías hacer que la tabla se recargue o actualizar el estado
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
      } else {
        setError(response.mensaje || "Error al actualizar el huésped");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al actualizar huésped:", err);
    }
  };

  const handleOpenEditModal = (huespedId: number) => {
    // TODO: Obtener los datos del huésped por ID desde la API
    // Por ahora, simplemente abrimos el modal en modo edición
    setEditingHuesped({
      id: huespedId,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      documentoIdentidad: "",
      direccion: "",
      estado: "Regular",
    });
    setIsModalOpen(true);
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
        // Aquí podrías hacer que la tabla se recargue o actualizar el estado
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
        {/* Left Side - Banner */}
        <div className="clientes-banner">
          <img src="/src/assets/images/imagenClientes.jpg" alt="Clientes Banner" className="banner-image" />
        </div>

        {/* Right Side - Table Content */}
        <div className="clientes-content">
          {/* Tabla de Huéspedes */}
          <HuespedesTable 
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteHuesped}
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
