import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { HuespedesActionMenu } from "./HuespedesActionMenu";
import { huespedesService, type HuespedResponse } from "../../services/huespedesService";
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
  refreshTrigger?: number;
}

export const HuespedesTable = ({ onEdit, onDelete, refreshTrigger }: HuespedesTableProps) => {
  const ITEMS_PER_PAGE = 7;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [huespedes, setHuespedes] = useState<HuespedResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Cargar huéspedes del backend
  useEffect(() => {
    const loadHuespedes = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await huespedesService.getAllHuespedes(token);
        if (response.exito && response.datos) {
          setHuespedes(response.datos);
        }
      } catch (error) {
        setError("Error al cargar los huéspedes");
        console.error("Error loading huéspedes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHuespedes();
  }, [token, refreshTrigger]);

  const filteredHuespedes = huespedes.filter((huesped) => {
    const matchesSearch =
      huesped.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "todos") return matchesSearch;
    if (activeFilter === "frecuente" && huesped.numeroReservas >= 3) return matchesSearch;
    if (activeFilter === "vip" && huesped.numeroReservas >= 5) return matchesSearch;
    if (activeFilter === "bloqueado") return matchesSearch; // Sin estado bloqueado en los datos reales

    return false;
  });

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredHuespedes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHuespedes = filteredHuespedes.slice(startIndex, endIndex);

  // Reset a página 1 cuando cambia el filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const getEstadoFromHuesped = (huesped: HuespedResponse) => {
    if (huesped.numeroReservas >= 5) return "VIP";
    if (huesped.numeroReservas >= 3) return "Frecuente";
    return "Regular";
  };

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case "VIP":
        return { label: "VIP", className: "huesped-badge-vip" };
      case "Frecuente":
        return { label: "Huésped Frecuente", className: "huesped-badge-frecuente" };
      case "Bloqueado":
        return { label: "Bloqueado", className: "huesped-badge-bloqueado" };
      default:
        return { label: "Regular", className: "huesped-badge-regular" };
    }
  };

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
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`huesped-filter-btn ${activeFilter === filter.key ? "active" : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Box className="huesped-table-container">
          <div className="huesped-empty-state-content">
            <p className="huesped-empty-state-text">Cargando huéspedes...</p>
          </div>
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box className="huesped-table-container">
          <div className="huesped-empty-state-content">
            <p className="huesped-empty-state-text">Error: {error}</p>
          </div>
        </Box>
      )}

      {/* Table */}
      <Box className="huesped-table-container" bg="#E8DCC8" borderRadius="md" overflow="visible">
        <Table variant="unstyled">
          <Thead bg="#E8DCC8">
            <Tr>
              <Th color="#4B2F20" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Nombre Completo</Th>
              <Th color="#4B2F20" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Email</Th>
              <Th color="#4B2F20" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Teléfono</Th>
              <Th color="#4B2F20" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">DNI</Th>
              <Th color="#4B2F20" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Fecha Registro</Th>
              <Th color="#4B2F20" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedHuespedes.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="huesped-empty-state">
                  <div className="huesped-empty-state-content">
                    <p className="huesped-empty-state-text">Sin datos</p>
                  </div>
                </Td>
              </Tr>
            ) : (
              paginatedHuespedes.map((huesped) => {
                const estado = getEstadoFromHuesped(huesped);
                const config = getEstadoConfig(estado);
                return (
                  <Tr key={huesped.id} bg="#FAFAFA" borderBottom="1px solid #D7CCC8" _hover={{ bg: "#F5F5F5" }}>
                    <Td color="#6F4E37" fontSize="0.95rem" fontWeight="500" py={4} px={5}>
                      {huesped.nombre} {huesped.apellido}
                    </Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.correoElectronico}</Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.telefono}</Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.documentoIdentidad}</Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{formatearFecha(huesped.fechaRegistro)}</Td>
                    <Td py={4} px={5}>
                      <span className={`huesped-badge ${config.className}`}>
                        {config.label}
                      </span>
                    </Td>
                    <Td py={4} px={5}>
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

      {/* Pagination and Info Footer */}
      <div className="huesped-pagination">
        <p className="huesped-info-text">
          Mostrando {filteredHuespedes.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, filteredHuespedes.length)} de {filteredHuespedes.length} huéspedes
        </p>
        <div className="huesped-pagination-buttons">
          <button
            className="huesped-pagination-btn"
            disabled={currentPage === 1 || totalPages <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`huesped-pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
              disabled={totalPages <= 1}
            >
              {page}
            </button>
          ))}
          <button
            className="huesped-pagination-btn"
            disabled={currentPage === totalPages || totalPages <= 1}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            →
          </button>
        </div>
      </div>
    </VStack>
  );
};
