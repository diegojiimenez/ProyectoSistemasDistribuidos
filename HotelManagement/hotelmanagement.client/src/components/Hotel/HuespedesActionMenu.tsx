import { useState } from "react";
import "../../styles/HuespedesActionMenu.css";

interface HuespedesActionMenuProps {
  huespedId: number;
  huespedNombre: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const HuespedesActionMenu = ({
  huespedId,
  huespedNombre,
  onEdit,
  onDelete,
}: HuespedesActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    onEdit(huespedId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${huespedNombre}?`)) {
      onDelete(huespedId);
      setIsOpen(false);
    }
  };

  return (
    <div className="action-menu-container">
      <button
        className="action-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Más opciones"
      >
        ⋯
      </button>

      {isOpen && (
        <div className="action-menu-dropdown">
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
