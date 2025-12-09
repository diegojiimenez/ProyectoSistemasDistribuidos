import { useState, useEffect } from "react";
import type { CuartoResponse } from "../../services/cuartosService";
import { cuartosService } from "../../services/cuartosService";
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

  // Cargar cuartos
  useEffect(() => {
    if (isOpen && token) {
      loadCuartos();
    }
  }, [isOpen, token]);

  const loadCuartos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cuartosService.getAllCuartos(token!);
      if (response.exito && response.datos) {
        setCuartos(response.datos);
      }
    } catch (err) {
      setError("Error al cargar las habitaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      await loadCuartos();
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
        await loadCuartos();
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
              {cuartos.map((cuarto) => (
                <div key={cuarto.id} className="habitacion-card">
                  {/* Estado Indicator */}
                  <div
                    className="habitacion-estado-indicator"
                    style={{ backgroundColor: estadoColors[cuarto.estado].color }}
                    title={estadoColors[cuarto.estado].label}
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
                      <span className="value">{estadoColors[cuarto.estado].label}</span>
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
              ))}
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
