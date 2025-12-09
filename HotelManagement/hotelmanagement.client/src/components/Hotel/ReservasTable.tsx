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



interface ReservasTableProps {
  onEdit: (reservaId: number) => void;
  onDelete: (reservaId: number) => void;
  refreshTrigger?: number;
}

export const ReservasTable = ({ onEdit, onDelete, refreshTrigger }: ReservasTableProps) => {
  const ITEMS_PER_PAGE = 7;
  const [searchTerm, setSearchTerm] = useState("");
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
    return (
      reserva.huespedNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reserva.cuartoNumero && reserva.cuartoNumero.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reserva.estado && reserva.estado.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredReservas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReservas = filteredReservas.slice(startIndex, endIndex);

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        overflow="visible"
      >
        <Table 
          variant="unstyled"
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
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedReservas.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="reserva-empty-state">
                  <div className="reserva-empty-state-content">
                    <p className="reserva-empty-state-text">Sin datos</p>
                  </div>
                </Td>
              </Tr>
            ) : (
              paginatedReservas.map((reserva) => {
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
                      {reserva.cuartoNumero || '-'}
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
          Mostrando {filteredReservas.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, filteredReservas.length)} de {filteredReservas.length} reservas
        </p>
        <div className="reserva-pagination-buttons">
          <button
            className="reserva-pagination-btn"
            disabled={currentPage === 1 || totalPages <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`reserva-pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
              disabled={totalPages <= 1}
            >
              {page}
            </button>
          ))}
          <button
            className="reserva-pagination-btn"
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
