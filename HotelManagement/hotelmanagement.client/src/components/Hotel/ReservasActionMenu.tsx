import { useState, useRef, useEffect } from "react";
import "../../styles/ReservasActionMenu.css";

interface ReservasActionMenuProps {
  reservaId: number;
  reservaNombre: string;
  onEdit: (reservaId: number) => void;
  onDelete: (reservaId: number) => void;
}

export const ReservasActionMenu = ({ 
  reservaId, 
  reservaNombre, 
  onEdit, 
  onDelete 
}: ReservasActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 100, // Encima del botón
        left: rect.left - 60, // Ajustado para centrar el menú
      });
    }
  }, [isOpen]);

  const handleEdit = () => {
    onEdit(reservaId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${reservaNombre}?`)) {
      onDelete(reservaId);
      setIsOpen(false);
    }
  };

  return (
    <div className="action-menu-container">
      <button
        ref={buttonRef}
        className="action-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Más opciones"
      >
        ⋯
      </button>

      {isOpen && position && (
        <div
          className="action-menu-dropdown"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <button className="action-menu-item action-menu-edit" onClick={handleEdit}>
            Editar
          </button>
          <button className="action-menu-item action-menu-delete" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};
