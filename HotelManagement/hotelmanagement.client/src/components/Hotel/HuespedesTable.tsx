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

// Icon simple usando caracteres Unicode
const MoreVerticalIcon = () => <span className="huesped-action-btn-icon">⋯</span>;

interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  pais: string;
  ultimaEstancia: string;
  estado: "VIP" | "Frecuente" | "Regular" | "Bloqueado";
}

const mockHuespedes: Huesped[] = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "García",
    email: "ana.garcia@email.com",
    telefono: "+34 600 123 456",
    pais: "España",
    ultimaEstancia: "15/06/2024",
    estado: "VIP",
  },
  {
    id: 2,
    nombre: "John",
    apellido: "Smith",
    email: "j.smith@email.com",
    telefono: "+44 20 7946 0958",
    pais: "Reino Unido",
    ultimaEstancia: "12/06/2024",
    estado: "Frecuente",
  },
  {
    id: 3,
    nombre: "Maria",
    apellido: "Rossi",
    email: "maria.ross@email.com",
    telefono: "+39 06 6982",
    pais: "Italia",
    ultimaEstancia: "10/08/2024",
    estado: "Regular",
  },
  {
    id: 4,
    nombre: "Hans",
    apellido: "Müller",
    email: "hans.muller@email.com",
    telefono: "+49 30 206580",
    pais: "Alemania",
    ultimaEstancia: "28/05/2024",
    estado: "Frecuente",
  },
  {
    id: 5,
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "c.rodriguez@email.com",
    telefono: "+52 55 5093 3000",
    pais: "México",
    ultimaEstancia: "10/05/2024",
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

export const HuespedesTable = () => {
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
            placeholder="Buscar por nombre, email o DNI..."
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

      {/* Table */}
      <Box className="huesped-table-container">
        <Table>
          <Thead className="huesped-table-head">
            <Tr className="huesped-table-header">
              <Th className="huesped-table-header-cell">Nombre Completo</Th>
              <Th className="huesped-table-header-cell">Email</Th>
              <Th className="huesped-table-header-cell">Teléfono</Th>
              <Th className="huesped-table-header-cell">País</Th>
              <Th className="huesped-table-header-cell">Última Estancia</Th>
              <Th className="huesped-table-header-cell">Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredHuespedes.map((huesped) => {
              const config = getEstadoConfig(huesped.estado);
              return (
                <Tr key={huesped.id} className="huesped-table-row">
                  <Td className="huesped-table-cell huesped-table-cell-name">
                    {huesped.nombre} {huesped.apellido}
                  </Td>
                  <Td className="huesped-table-cell">{huesped.email}</Td>
                  <Td className="huesped-table-cell">{huesped.telefono}</Td>
                  <Td className="huesped-table-cell">{huesped.pais}</Td>
                  <Td className="huesped-table-cell">{huesped.ultimaEstancia}</Td>
                  <Td>
                    <span className={`huesped-badge ${config.className}`}>
                      {config.label}
                    </span>
                  </Td>
                  <Td className="huesped-table-cell-actions">
                    <button className="huesped-action-btn">
                      <MoreVerticalIcon />
                    </button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

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
