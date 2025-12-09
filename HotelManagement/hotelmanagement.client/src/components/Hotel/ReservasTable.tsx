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
import { ReservasActionMenu } from "./ReservasActionMenu";
import { reservasService, type ReservaResponse } from "../../services/reservasService";
import { useAuth } from "../../hooks/useAuth";
import { formatearFecha } from "../../utils/dateUtils";
import "../../styles/ReservasTable.css";

// Search Icon Component
const SearchIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="reserva-search-icon-svg"
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
  { label: "Todas", key: "todas" },
  { label: "Confirmada", key: "confirmada" },
  { label: "Pendiente", key: "pendiente" },
  { label: "Cancelada", key: "cancelada" },
];

interface ReservasTableProps {
  onEdit: (reservaId: number) => void;
  onDelete: (reservaId: number) => void;
  refreshTrigger?: number;
}

export const ReservasTable = ({ onEdit, onDelete, refreshTrigger }: ReservasTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todas");
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Cargar reservas del backend
  useEffect(() => {
    const loadReservas = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await reservasService.getAllReservas(token);
        if (response.exito && response.datos) {
          setReservas(response.datos);
        }
      } catch (error) {
        setError("Error al cargar las reservas");
        console.error("Error loading reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReservas();
  }, [token, refreshTrigger]);

  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch =
      reserva.huespedNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.numeroCuarto.toString().includes(searchTerm) ||
      reserva.estado.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "todas") return matchesSearch;
    if (activeFilter === "confirmada" && reserva.estado === "Confirmada") return matchesSearch;
    if (activeFilter === "pendiente" && reserva.estado === "Pendiente") return matchesSearch;
    if (activeFilter === "cancelada" && reserva.estado === "Cancelada") return matchesSearch;

    return false;
  });

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case "Confirmada":
        return { label: "Confirmada", className: "reserva-badge-confirmada" };
      case "Pendiente":
        return { label: "Pendiente", className: "reserva-badge-pendiente" };
      case "Cancelada":
        return { label: "Cancelada", className: "reserva-badge-cancelada" };
      default:
        return { label: estado, className: "reserva-badge-confirmada" };
    }
  };

  return (
    <VStack>
      {/* Search and Filter Section */}
      <div className="reserva-controls-container">
        <div className="reserva-search-wrapper">
          <SearchIcon />
          <input
            type="text"
            className="reserva-search-input"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Buttons - Segmented Control Style */}
        <div className="reserva-filter-buttons">
          {filterOptions.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`reserva-filter-btn ${activeFilter === filter.key ? "active" : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Box className="reserva-table-container">
          <div className="reserva-empty-state-content">
            <p className="reserva-empty-state-text">Cargando reservas...</p>
          </div>
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box className="reserva-table-container">
          <div className="reserva-empty-state-content">
            <p className="reserva-empty-state-text">Error: {error}</p>
          </div>
        </Box>
      )}

      {/* Table */}
      <Box 
        className="reserva-table-container" 
        bg="#E8DCC8" 
        borderRadius="md" 
        overflow="auto"
        sx={{
          '@media (max-width: 768px)': {
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }
        }}
      >
        <Table 
          variant="unstyled"
          sx={{
            '@media (max-width: 768px)': {
              minWidth: '600px',
            }
          }}
        >
          <Thead bg="#E8DCC8">
            <Tr>
              <Th 
                color="#1F2937" 
                fontSize="0.85rem" 
                fontWeight="600" 
                textTransform="uppercase" 
                letterSpacing="0.5px" 
                py={4} 
                px={5} 
                borderBottom="2px solid #D7CCC8"
              >
                Huésped
              </Th>
              <Th 
                color="#1F2937" 
                fontSize="0.85rem" 
                fontWeight="600" 
                textTransform="uppercase" 
                letterSpacing="0.5px" 
                py={4} 
                px={5} 
                borderBottom="2px solid #D7CCC8"
                display={{ base: 'none', md: 'table-cell' }}
              >
                Cuarto
              </Th>
              <Th 
                color="#1F2937" 
                fontSize="0.85rem" 
                fontWeight="600" 
                textTransform="uppercase" 
                letterSpacing="0.5px" 
                py={4} 
                px={5} 
                borderBottom="2px solid #D7CCC8"
                display={{ base: 'none', lg: 'table-cell' }}
              >
                Entrada
              </Th>
              <Th 
                color="#1F2937" 
                fontSize="0.85rem" 
                fontWeight="600" 
                textTransform="uppercase" 
                letterSpacing="0.5px" 
                py={4} 
                px={5} 
                borderBottom="2px solid #D7CCC8"
                display={{ base: 'none', lg: 'table-cell' }}
              >
                Salida
              </Th>
              <Th 
                color="#1F2937" 
                fontSize="0.85rem" 
                fontWeight="600" 
                textTransform="uppercase" 
                letterSpacing="0.5px" 
                py={4} 
                px={5} 
                borderBottom="2px solid #D7CCC8"
                display={{ base: 'none', md: 'table-cell' }}
              >
                Precio Total
              </Th>
              <Th 
                color="#1F2937" 
                fontSize="0.85rem" 
                fontWeight="600" 
                textTransform="uppercase" 
                letterSpacing="0.5px" 
                py={4} 
                px={5} 
                borderBottom="2px solid #D7CCC8"
              >
                Estado
              </Th>
              <Th 
                borderBottom="2px solid #D7CCC8"
                py={4} 
                px={5}
                textAlign="center"
              >
                Acciones
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredReservas.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="reserva-empty-state">
                  <div className="reserva-empty-state-content">
                    <p className="reserva-empty-state-text">Sin datos</p>
                  </div>
                </Td>
              </Tr>
            ) : (
              filteredReservas.map((reserva) => {
                const config = getEstadoConfig(reserva.estado);
                return (
                  <Tr 
                    key={reserva.id} 
                    bg="#FAFAFA" 
                    borderBottom="1px solid #D7CCC8" 
                    _hover={{ bg: "#F5F5F5" }}
                  >
                    <Td 
                      color="#6F4E37" 
                      fontSize="0.95rem" 
                      fontWeight="500" 
                      py={4} 
                      px={5}
                    >
                      {reserva.huespedNombre}
                    </Td>
                    <Td 
                      color="#6F4E37" 
                      fontSize="0.95rem" 
                      py={4} 
                      px={5}
                      display={{ base: 'none', md: 'table-cell' }}
                    >
                      Cuarto {reserva.numeroCuarto}
                    </Td>
                    <Td 
                      color="#6F4E37" 
                      fontSize="0.95rem" 
                      py={4} 
                      px={5}
                      display={{ base: 'none', lg: 'table-cell' }}
                    >
                      {formatearFecha(reserva.fechaEntrada)}
                    </Td>
                    <Td 
                      color="#6F4E37" 
                      fontSize="0.95rem" 
                      py={4} 
                      px={5}
                      display={{ base: 'none', lg: 'table-cell' }}
                    >
                      {formatearFecha(reserva.fechaSalida)}
                    </Td>
                    <Td 
                      color="#6F4E37" 
                      fontSize="0.95rem" 
                      py={4} 
                      px={5}
                      display={{ base: 'none', md: 'table-cell' }}
                    >
                      ${reserva.precioTotal.toFixed(2)}
                    </Td>
                    <Td py={4} px={5}>
                      <span className={`reserva-badge ${config.className}`}>
                        {config.label}
                      </span>
                    </Td>
                    <Td 
                      py={4} 
                      px={5}
                      display={{ base: 'flex', md: 'table-cell' }}
                      justifyContent={{ base: 'center', md: 'auto' }}
                      textAlign="center"
                    >
                      <ReservasActionMenu
                        reservaId={reserva.id}
                        reservaNombre={`Reserva #${reserva.id}`}
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
      <div className="reserva-pagination">
        <p className="reserva-info-text">
          Mostrando 1 a {filteredReservas.length} de {reservas.length} reservas
        </p>
        <div className="reserva-pagination-buttons">
          <button
            className="reserva-pagination-btn"
            disabled
          >
            ←
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`reserva-pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <span className="reserva-pagination-ellipsis">...</span>
          <button
            className="reserva-pagination-btn"
          >
            12
          </button>
          <button
            className="reserva-pagination-btn"
          >
            →
          </button>
        </div>
      </div>
    </VStack>
  );
};
