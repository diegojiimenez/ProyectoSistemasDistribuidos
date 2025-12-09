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
import { useState } from "react";
import { HuespedesActionMenu } from "./HuespedesActionMenu";
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

const mockHuespedes: Huesped[] = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "García",
    email: "ana.garcia@email.com",
    telefono: "+34 600 123 456",
    documentoIdentidad: "12345678A",
    fechaRegistro: "2024-06-15",
    estado: "VIP",
  },
  {
    id: 2,
    nombre: "John",
    apellido: "Smith",
    email: "j.smith@email.com",
    telefono: "+44 20 7946 0958",
    documentoIdentidad: "87654321B",
    fechaRegistro: "2024-06-12",
    estado: "Frecuente",
  },
  {
    id: 3,
    nombre: "Maria",
    apellido: "Rossi",
    email: "maria.ross@email.com",
    telefono: "+39 06 6982",
    documentoIdentidad: "11111111C",
    fechaRegistro: "2024-08-10",
    estado: "Regular",
  },
  {
    id: 4,
    nombre: "Hans",
    apellido: "Müller",
    email: "hans.muller@email.com",
    telefono: "+49 30 206580",
    documentoIdentidad: "22222222D",
    fechaRegistro: "2024-05-28",
    estado: "Frecuente",
  },
  {
    id: 5,
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "c.rodriguez@email.com",
    telefono: "+52 55 5093 3000",
    documentoIdentidad: "33333333E",
    fechaRegistro: "2024-05-10",
    estado: "Bloqueado",
  },
];

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
}

export const HuespedesTable = ({ onEdit, onDelete }: HuespedesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [huespedes] = useState<Huesped[]>(mockHuespedes);
  const [currentPage, setCurrentPage] = useState(1);

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

      {/* Table */}
      <Box className="huesped-table-container" bg="#E8DCC8" borderRadius="md" overflow="hidden">
        <Table variant="unstyled">
          <Thead bg="#E8DCC8">
            <Tr>
              <Th color="#1F2937" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Nombre Completo</Th>
              <Th color="#1F2937" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Email</Th>
              <Th color="#1F2937" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Teléfono</Th>
              <Th color="#1F2937" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">DNI</Th>
              <Th color="#1F2937" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Fecha Registro</Th>
              <Th color="#1F2937" fontSize="0.85rem" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" py={4} px={5} borderBottom="2px solid #D7CCC8">Estado</Th>
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
                  <Tr key={huesped.id} bg="#FAFAFA" borderBottom="1px solid #D7CCC8" _hover={{ bg: "#F5F5F5" }}>
                    <Td color="#6F4E37" fontSize="0.95rem" fontWeight="500" py={4} px={5}>
                      {huesped.nombre} {huesped.apellido}
                    </Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.email}</Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.telefono}</Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.documentoIdentidad}</Td>
                    <Td color="#6F4E37" fontSize="0.95rem" py={4} px={5}>{huesped.fechaRegistro}</Td>
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
          Mostrando 1 a {filteredHuespedes.length} de 123 huéspedes
        </p>
        <div className="huesped-pagination-buttons">
          <button
            className="huesped-pagination-btn"
            disabled
          >
            ←
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`huesped-pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <span className="huesped-pagination-ellipsis">...</span>
          <button
            className="huesped-pagination-btn"
          >
            12
          </button>
          <button
            className="huesped-pagination-btn"
          >
            →
          </button>
        </div>
      </div>
    </VStack>
  );
};
