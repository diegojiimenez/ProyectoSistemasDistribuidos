import { useState, useEffect } from "react";
import { reservasService } from "../services/reservasService";
import { useAuth } from "../hooks/useAuth";
import { ReservasTable } from "../components/Hotel/ReservasTable";
import { AddReservasModal } from "../components/Hotel/AddReservasModal";
import "../styles/ReservasPage.css";

type ReservasFormData = {
  huespedId: number;
  cuartoId: number;
  fechaEntrada: string;
  fechaSalida: string;
  precioTotal: number;
  notas?: string;
};

interface ReservaEdit extends ReservasFormData {
  id: number;
}

export const ReservasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingReserva, setEditingReserva] = useState<ReservaEdit | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
      setEditingReserva(null);
    };

    window.addEventListener("openReservaModal", handleOpenModal);
    return () => window.removeEventListener("openReservaModal", handleOpenModal);
  }, []);

  const handleAddReserva = async (data: ReservasFormData) => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    setError(null);

    try {
      const response = await reservasService.createReserva(
        {
          huespedId: data.huespedId,
          cuartoId: data.cuartoId,
          fechaEntrada: data.fechaEntrada,
          fechaSalida: data.fechaSalida,
          precioTotal: data.precioTotal,
          notas: data.notas,
        },
        token
      );

      if (response.exito) {
        console.log("Reserva creada exitosamente:", response.datos);
        setIsModalOpen(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        setError(response.mensaje || "Error al crear la reserva");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al crear reserva:", err);
    }
  };

  const handleEditReserva = async (data: ReservasFormData) => {
    if (!token || !editingReserva) {
      setError("No hay token de autenticación o reserva para editar");
      return;
    }

    setError(null);

    try {
      const response = await reservasService.updateReserva(
        editingReserva.id,
        {
          huespedId: data.huespedId,
          cuartoId: data.cuartoId,
          fechaEntrada: data.fechaEntrada,
          fechaSalida: data.fechaSalida,
          precioTotal: data.precioTotal,
          notas: data.notas,
        },
        token
      );

      if (response.exito) {
        console.log("Reserva actualizada exitosamente:", response.datos);
        setIsModalOpen(false);
        setEditingReserva(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        setError(response.mensaje || "Error al actualizar la reserva");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al actualizar reserva:", err);
    }
  };

  const handleOpenEditModal = async (reservaId: number) => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    try {
      const response = await reservasService.getReservaById(reservaId, token);
      if (response.exito && response.datos) {
        const reserva = response.datos;
        const editData: any = {
          id: reserva.id,
          huespedId: parseInt(String(reserva.huespedId)),
          cuartoId: parseInt(String(reserva.cuartoId)),
          fechaEntrada: reserva.fechaEntrada,
          fechaSalida: reserva.fechaSalida,
          precioTotal: parseFloat(String(reserva.precioTotal)),
          notas: reserva.notas,
        };
        setEditingReserva(editData);
        setIsModalOpen(true);
      } else {
        setError(response.mensaje || "Error al cargar la reserva");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al cargar reserva:", err);
    }
  };

  const handleDeleteReserva = async (reservaId: number) => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    setError(null);

    try {
      const response = await reservasService.deleteReserva(reservaId, token);

      if (response.exito) {
        console.log("Reserva eliminada exitosamente");
        setRefreshTrigger(prev => prev + 1);
      } else {
        setError(response.mensaje || "Error al eliminar la reserva");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al eliminar reserva:", err);
    }
  };

  return (
    <div className="reservas-container">
      {/* Main Layout */}
      <div className="reservas-layout">
        {/* Left Side - Banner */}
        <div className="reservas-banner">
          <img src="/src/assets/images/imagenReservas.jpg" alt="Reservas Banner" className="banner-image" />
        </div>

        {/* Right Side - Table Content */}
        <div className="reservas-content">
          {/* Tabla de Reservas */}
          <ReservasTable 
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteReserva}
            refreshTrigger={refreshTrigger}
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

      {/* Modal de Añadir/Editar Reserva */}
      <AddReservasModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReserva(null);
        }}
        onSubmit={editingReserva ? handleEditReserva : handleAddReserva}
        initialData={editingReserva || undefined}
      />
    </div>
  );
};
