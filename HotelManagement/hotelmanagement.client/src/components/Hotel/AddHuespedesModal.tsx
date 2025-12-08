import { useState } from "react";
import "../../styles/AddHuespedesModal.css";

interface AddHuespedesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HuespedesFormData) => void;
}

export interface HuespedesFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  pais: string;
  estado: "VIP" | "Frecuente" | "Regular" | "Bloqueado";
}

export const AddHuespedesModal = ({ isOpen, onClose, onSubmit }: AddHuespedesModalProps) => {
  const [formData, setFormData] = useState<HuespedesFormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    estado: "Regular",
  });

  const [errors, setErrors] = useState<Partial<HuespedesFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<HuespedesFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    }
    if (!formData.pais.trim()) {
      newErrors.pais = "El país es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        pais: "",
        estado: "Regular",
      });
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof HuespedesFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Añadir Nuevo Huésped</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan"
                className={`form-input ${errors.nombre ? "error" : ""}`}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                id="apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej: García"
                className={`form-input ${errors.apellido ? "error" : ""}`}
              />
              {errors.apellido && <span className="error-message">{errors.apellido}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: juan@ejemplo.com"
                className={`form-input ${errors.email ? "error" : ""}`}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +34 600 123 456"
                className={`form-input ${errors.telefono ? "error" : ""}`}
              />
              {errors.telefono && <span className="error-message">{errors.telefono}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pais">País *</label>
              <input
                id="pais"
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                placeholder="Ej: España"
                className={`form-input ${errors.pais ? "error" : ""}`}
              />
              {errors.pais && <span className="error-message">{errors.pais}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Regular">Regular</option>
                <option value="Frecuente">Frecuente</option>
                <option value="VIP">VIP</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Guardar Huésped
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
