import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { HuespedesActionMenu } from "./HuespedesActionMenu";
import { huespedesService } from "../../services/huespedesService";
import { useAuth } from "../../hooks/useAuth";
import { formatearFecha } from "../../utils/dateUtils";
import "../../styles/HuespedesTable.css";

// Search Icon Component
const SearchIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="huesped-search-icon-svg"
  >
    <path 
      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Paleta de colores con personalidad rústica
interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documentoIdentidad: string;
  fechaRegistro: string;
  estado: "VIP" | "Frecuente" | "Regular" | "Bloqueado";
}

// Paleta de colores con personalidad rústica
const getEstadoConfig = (estado: string) => {
  switch (estado) {
    case "VIP":
      return { className: "huesped-badge-vip", label: "VIP" };
    case "Frecuente":
      return { className: "huesped-badge-frecuente", label: "FRECUENTE" };
    case "Regular":
      return { className: "huesped-badge-regular", label: "REGULAR" };
    case "Bloqueado":
      return { className: "huesped-badge-bloqueado", label: "BLOQUEADO" };
    default:
      return { className: "huesped-badge-regular", label: "REGULAR" };
  }
};

interface FilterButton {
  label: string;
  key: string;
}

const filterOptions: FilterButton[] = [
  { label: "Todos", key: "todos" },
  { label: "Huésped Frecuente", key: "frecuente" },
  { label: "VIP", key: "vip" },
  { label: "Bloqueado", key: "bloqueado" },
];

interface HuespedesTableProps {
  onEdit: (huespedId: number) => void;
  onDelete: (huespedId: number) => void;
  onRefreshRef?: (refresh: () => void) => void;
}

export const HuespedesTable = ({ onEdit, onDelete, onRefreshRef }: HuespedesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [huespedes, setHuespedes] = useState<Huesped[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  // Función para cargar huéspedes
  const loadHuespedes = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await huespedesService.getAllHuespedes(token);
      
      if (response.exito && response.datos) {
        // Mapear datos del backend a la interfaz local
        const huespedesMapeados: Huesped[] = response.datos.map((h: any) => ({
          id: h.id,
          nombre: h.nombre,
          apellido: h.apellido,
          email: h.correoElectronico,
          telefono: h.telefono,
          documentoIdentidad: h.documentoIdentidad,
          fechaRegistro: h.fechaRegistro,
          estado: "Regular", // Por defecto, luego se puede calcular
        }));
        setHuespedes(huespedesMapeados);
        setError(null);
      } else {
        setError(response.mensaje || "Error al cargar huéspedes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar huéspedes");
      console.error("Error loading huespedes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar huéspedes cuando el componente monta o cambia el token
  useEffect(() => {
    loadHuespedes();
  }, [token]);

  // Exponer función de recarga al componente padre
  useEffect(() => {
    if (onRefreshRef) {
      onRefreshRef(loadHuespedes);
    }
  }, [onRefreshRef, loadHuespedes]);

  const filteredHuespedes = huespedes.filter((huesped) => {
    const matchesSearch =
      huesped.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "todos") return matchesSearch;
    if (activeFilter === "frecuente" && huesped.estado === "Frecuente") return matchesSearch;
    if (activeFilter === "vip" && huesped.estado === "VIP") return matchesSearch;
    if (activeFilter === "bloqueado" && huesped.estado === "Bloqueado") return matchesSearch;

    return false;
  });

  return (
    <VStack>
      {/* Search and Filter Section */}
      <div className="huesped-controls-container">
        <div className="huesped-search-wrapper">
          <SearchIcon />
          <input
            type="text"
            className="huesped-search-input"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Buttons - Segmented Control Style */}
        <div className="huesped-filter-buttons">
          {filterOptions.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`huesped-filter-btn ${activeFilter === filter.key ? "active" : ""}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Box className="huesped-table-container">
          <div className="huesped-empty-state-content">
            <p className="huesped-empty-state-text">Cargando huéspedes...</p>
          </div>
        </Box>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Box className="huesped-table-container">
          <div className="huesped-empty-state-content">
            <p className="huesped-empty-state-text">Error: {error}</p>
          </div>
        </Box>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <Box className="huesped-table-container">
          <Table>
            <Thead className="huesped-table-head">
              <Tr className="huesped-table-header">
                <Th className="huesped-table-header-cell">Nombre Completo</Th>
                <Th className="huesped-table-header-cell">Email</Th>
                <Th className="huesped-table-header-cell">Teléfono</Th>
                <Th className="huesped-table-header-cell">DNI</Th>
                <Th className="huesped-table-header-cell">Fecha Registro</Th>
                <Th className="huesped-table-header-cell">Estado</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredHuespedes.length === 0 ? (
                <Tr>
                  <Td colSpan={7} className="huesped-empty-state">
                    <div className="huesped-empty-state-content">
                      <p className="huesped-empty-state-text">Sin datos</p>
                    </div>
                  </Td>
                </Tr>
              ) : (
                filteredHuespedes.map((huesped) => {
                  const config = getEstadoConfig(huesped.estado);
                  return (
                    <Tr key={huesped.id} className="huesped-table-row">
                      <Td className="huesped-table-cell huesped-table-cell-name">
                        {huesped.nombre} {huesped.apellido}
                      </Td>
                      <Td className="huesped-table-cell">{huesped.email}</Td>
                      <Td className="huesped-table-cell">{huesped.telefono}</Td>
                      <Td className="huesped-table-cell">{huesped.documentoIdentidad}</Td>
                      <Td className="huesped-table-cell">{formatearFecha(huesped.fechaRegistro)}</Td>
                      <Td>
                        <span className={`huesped-badge ${config.className}`}>
                          {config.label}
                        </span>
                      </Td>
                      <Td className="huesped-table-cell-actions">
                        <HuespedesActionMenu
                          huespedId={huesped.id}
                          huespedNombre={`${huesped.nombre} ${huesped.apellido}`}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Pagination and Info Footer */}
      <div className="huesped-pagination">
        <p className="huesped-info-text">
          Mostrando 1 a {filteredHuespedes.length} de 123 huéspedes
        </p>
        <div className="huesped-pagination-buttons">
          <Button
            className="huesped-pagination-btn"
            disabled
            as="button"
          >
            ←
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              className={`huesped-pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
              as="button"
            >
              {page}
            </Button>
          ))}
          <span className="huesped-pagination-ellipsis">...</span>
          <Button
            className="huesped-pagination-btn"
            as="button"
          >
            12
          </Button>
          <Button
            className="huesped-pagination-btn"
            as="button"
          >
            →
          </Button>
        </div>
      </div>
    </VStack>
  );
};
