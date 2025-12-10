import { useState, useEffect } from "react";
import type { CuartoResponse } from "../../services/cuartosService";
import { cuartosService } from "../../services/cuartosService";
import { reservasService, type ReservaResponse } from "../../services/reservasService";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/HabitacionesModal.css";

interface HabitacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const estadoColors: Record<number, { color: string; label: string }> = {
  0: { color: "#4CAF50", label: "Disponible" },
  1: { color: "#FF9800", label: "Ocupado" },
  2: { color: "#F44336", label: "Mantenimiento" },
  3: { color: "#2196F3", label: "Limpieza" },
};

const tipoLabels: Record<number, string> = {
  0: "Individual",
  1: "Doble",
  2: "Suite",
  3: "Familiar",
};

export const HabitacionesModal = ({ isOpen, onClose }: HabitacionesModalProps) => {
  const [cuartos, setCuartos] = useState<CuartoResponse[]>([]);
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    tipo: 0,
    descripcion: "",
    precioPorNoche: 0,
    capacidad: 1,
    estado: 0,
  });
  const { token } = useAuth();

  // Cargar cuartos y reservas
  useEffect(() => {
    if (isOpen && token) {
      loadData();
    }
  }, [isOpen, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cuartosResponse, reservasResponse] = await Promise.all([
        cuartosService.getAllCuartos(token!),
        reservasService.getAllReservas(token!),
      ]);
      
      if (cuartosResponse.exito && cuartosResponse.datos) {
        setCuartos(cuartosResponse.datos);
      }
      
      if (reservasResponse.exito && reservasResponse.datos) {
        setReservas(reservasResponse.datos);
      }
    } catch (err) {
      setError("Error al cargar las habitaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula el estado actual de un cuarto basándose en sus reservas
   * Si tiene una reserva activa hoy, muestra "Ocupado"
   * Si está en mantenimiento o limpieza, mantiene ese estado
   * Si no, muestra "Disponible"
   */
  const getActualEstadoCuarto = (cuarto: CuartoResponse): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Si el cuarto está en mantenimiento o limpieza, mantener ese estado
    if (cuarto.estado === 2 || cuarto.estado === 3) {
      return cuarto.estado;
    }

    // Buscar si hay una reserva activa (en curso) para este cuarto
    const reservaActiva = reservas.find((reserva) => {
      if (reserva.estado === "Cancelada") return false;
      if (reserva.cuartoId !== cuarto.id) return false;

      const fechaEntrada = new Date(reserva.fechaEntrada);
      const fechaSalida = new Date(reserva.fechaSalida);
      
      fechaEntrada.setHours(0, 0, 0, 0);
      fechaSalida.setHours(0, 0, 0, 0);

      // Está ocupado si hoy está entre entrada y salida (exclusive en salida)
      return today >= fechaEntrada && today < fechaSalida;
    });

    if (reservaActiva) {
      return 1; // Ocupado
    }

    return 0; // Disponible
  };

  const handleEditClick = (cuarto: CuartoResponse) => {
    setEditingId(cuarto.id);
    setFormData({
      numero: cuarto.numero,
      tipo: cuarto.tipo as number,
      descripcion: cuarto.descripcion,
      precioPorNoche: cuarto.precioPorNoche,
      capacidad: cuarto.capacidad,
      estado: cuarto.estado as number,
    });
    setShowForm(true);
  };

  const handleNewClick = () => {
    setEditingId(null);
    setFormData({
      numero: "",
      tipo: 0,
      descripcion: "",
      precioPorNoche: 0,
      capacidad: 1,
      estado: 0,
    });
    setShowForm(true);
  };

  const handleStateChange = (e: React.MouseEvent<HTMLDivElement>, estado: number) => {
    e.stopPropagation();
    setFormData({ ...formData, estado });
  };

  const handleSave = async () => {
    try {
      if (!formData.numero) {
        alert("El número de cuarto es obligatorio");
        return;
      }

      if (editingId) {
        await cuartosService.updateCuarto(editingId, formData, token!);
      } else {
        await cuartosService.createCuarto(formData, token!);
      }

      await loadData();
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError("Error al guardar la habitación");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habitación?")) {
      try {
        await cuartosService.deleteCuarto(id, token!);
        await loadData();
      } catch (err) {
        setError("Error al eliminar la habitación");
        console.error(err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="habitaciones-modal-overlay" onClick={onClose}>
      <div className="habitaciones-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="habitaciones-modal-header">
          <h2>Gestión de Habitaciones</h2>
          <button className="habitaciones-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="habitaciones-error-message">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="habitaciones-loading">
            <p>Cargando habitaciones...</p>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="habitaciones-form-section">
            <h3>{editingId ? "Editar Habitación" : "Nueva Habitación"}</h3>

            <div className="habitaciones-form-grid">
              <div className="form-group">
                <label>Número de Cuarto</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="Ej: 101"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: Number(e.target.value) })}
                >
                  <option value={0}>Individual</option>
                  <option value={1}>Doble</option>
                  <option value={2}>Suite</option>
                  <option value={3}>Familiar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidad</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Precio por Noche</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioPorNoche}
                  onChange={(e) => setFormData({ ...formData, precioPorNoche: Number(e.target.value) })}
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de la habitación"
                  rows={3}
                />
              </div>

              <div className="form-group full-width">
                <label>Estado</label>
                <div className="estado-selector">
                  {Object.entries(estadoColors).map(([estado, { color, label }]) => (
                    <div
                      key={estado}
                      className={`estado-circle ${formData.estado === Number(estado) ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={(e) => handleStateChange(e, Number(estado))}
                      title={label}
                    >
                      {formData.estado === Number(estado) && <span className="checkmark">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="habitaciones-form-actions">
              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                {editingId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {!showForm && !loading && (
          <div className="habitaciones-container">
            <div className="habitaciones-grid">
              {cuartos.map((cuarto) => {
                const estadoActual = getActualEstadoCuarto(cuarto);
                return (
                <div key={cuarto.id} className="habitacion-card">
                  {/* Estado Indicator */}
                  <div
                    className="habitacion-estado-indicator"
                    style={{ backgroundColor: estadoColors[estadoActual].color }}
                    title={estadoColors[estadoActual].label}
                  />

                  {/* Room Number */}
                  <div className="habitacion-numero">{cuarto.numero}</div>

                  {/* Room Info */}
                  <div className="habitacion-info">
                    <div className="info-row">
                      <span className="label">Tipo:</span>
                      <span className="value">{tipoLabels[cuarto.tipo]}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Capacidad:</span>
                      <span className="value">{cuarto.capacidad} pers.</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Precio:</span>
                      <span className="value">${cuarto.precioPorNoche}/noche</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Estado:</span>
                      <span className="value">{estadoColors[estadoActual].label}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {cuarto.descripcion && (
                    <div className="habitacion-descripcion">
                      {cuarto.descripcion}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="habitacion-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(cuarto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(cuarto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                );
              })}
            </div>

            {cuartos.length === 0 && !loading && (
              <div className="habitaciones-empty">
                <p>No hay habitaciones registradas</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!showForm && (
          <div className="habitaciones-modal-footer">
            <button className="btn-new" onClick={handleNewClick}>
              + Nueva Habitación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
