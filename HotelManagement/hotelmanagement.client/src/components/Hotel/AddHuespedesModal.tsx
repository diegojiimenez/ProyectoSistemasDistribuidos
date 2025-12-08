import { useState, useEffect } from "react";
import { calcularEstadoHuesped, type EstadoHuesped } from "../../utils/huespedesUtils";
import "../../styles/AddHuespedesModal.css";

interface AddHuespedesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HuespedesFormData) => void;
  initialData?: HuespedesFormData & { id?: number };
}

export interface HuespedesFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documentoIdentidad: string;
  direccion: string;
  estado: EstadoHuesped;
}

export const AddHuespedesModal = ({ isOpen, onClose, onSubmit, initialData }: AddHuespedesModalProps) => {
  const isEditMode = !!initialData?.id;

  const [formData, setFormData] = useState<HuespedesFormData>(
    initialData
      ? {
          nombre: initialData.nombre,
          apellido: initialData.apellido,
          email: initialData.email,
          telefono: initialData.telefono,
          documentoIdentidad: initialData.documentoIdentidad,
          direccion: initialData.direccion,
          estado: initialData.estado,
        }
      : {
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          documentoIdentidad: "",
          direccion: "",
          estado: "Regular",
        }
  );

  const [errors, setErrors] = useState<Partial<HuespedesFormData>>({});

  // Resetear datos cuando se abre el modal o cambia initialData
  useEffect(() => {
    if (isOpen) {
      if (initialData?.id) {
        // Modo edición
        setFormData({
          nombre: initialData.nombre,
          apellido: initialData.apellido,
          email: initialData.email,
          telefono: initialData.telefono,
          documentoIdentidad: initialData.documentoIdentidad,
          direccion: initialData.direccion,
          estado: initialData.estado,
        });
      } else {
        // Modo creación
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          documentoIdentidad: "",
          direccion: "",
          estado: "Regular",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

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
    if (!formData.documentoIdentidad.trim()) {
      newErrors.documentoIdentidad = "El documento de identidad es requerido";
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Calcular el estado automáticamente (nuevo huésped siempre es Regular o basado en historial)
      const estadoCalculado = calcularEstadoHuesped({
        totalReservas: 0,
        montoTotal: 0,
        esBloqueado: false,
      });

      const dataWithEstado = {
        ...formData,
        estado: estadoCalculado,
      };

      onSubmit(dataWithEstado);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        documentoIdentidad: "",
        direccion: "",
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
          <h2 className="modal-title">{isEditMode ? "Editar Huésped" : "Crear Huésped"}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="modal-subtitle">
          {isEditMode
            ? "Edite los campos necesarios para actualizar la información del huésped."
            : "Rellene los siguientes campos para añadir un nuevo huésped."}
        </p>

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
              <label htmlFor="apellido">Apellidos *</label>
              <input
                id="apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej: García López"
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
                placeholder="ejemplo@email.com"
                className={`form-input ${errors.email ? "error" : ""}`}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+1-XXX-XXX-XXXX"
                className={`form-input ${errors.telefono ? "error" : ""}`}
              />
              {errors.telefono && <span className="error-message">{errors.telefono}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="documentoIdentidad">Documento de Identidad *</label>
              <input
                id="documentoIdentidad"
                type="text"
                name="documentoIdentidad"
                value={formData.documentoIdentidad}
                onChange={handleChange}
                placeholder="DNI/Pasaporte"
                className={`form-input ${errors.documentoIdentidad ? "error" : ""}`}
              />
              {errors.documentoIdentidad && <span className="error-message">{errors.documentoIdentidad}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group-full">
              <label htmlFor="direccion">Dirección *</label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle, Número, Ciudad"
                className={`form-input ${errors.direccion ? "error" : ""}`}
              />
              {errors.direccion && <span className="error-message">{errors.direccion}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditMode ? "Guardar Cambios" : "Crear Huésped"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
