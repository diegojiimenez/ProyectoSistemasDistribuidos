import { useState, useRef, useEffect } from "react";

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    onEdit(reservaId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`¿Está seguro de que desea eliminar ${reservaNombre}?`)) {
      onDelete(reservaId);
      setIsOpen(false);
    }
  };

  return (
    <div className="reserva-action-menu" ref={menuRef}>
      <button
        className="reserva-action-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú de acciones"
      >
        ⋮
      </button>

      {isOpen && (
        <div className="reserva-action-menu-content">
          <button
            className="reserva-action-menu-item edit"
            onClick={handleEdit}
          >
            ✏️ Editar
          </button>
          <button
            className="reserva-action-menu-item delete"
            onClick={handleDelete}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
};
