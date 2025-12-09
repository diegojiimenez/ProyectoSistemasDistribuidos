import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Input,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { huespedesService } from "../../services/huespedesService";
import type { CuartoResponse } from "../../services/cuartosService";
import { cuartosService } from "../../services/cuartosService";
import { DatePicker } from "../DatePicker";
import "../../styles/AddReservasModal.css";

export interface ReservasFormData {
  huespedId: number;
  cuartoId: number;
  fechaEntrada: string;
  fechaSalida: string;
  numeroPersonas: number;
  precioTotal: number;
  notas?: string;
}

interface AddReservasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservasFormData) => Promise<void>;
  initialData?: Partial<ReservasFormData>;
}

export const AddReservasModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddReservasModalProps) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [huespedes, setHuespedes] = useState<Array<{ id: number; nombre: string; apellido: string }>>([]);
  const [cuartos, setCuartos] = useState<CuartoResponse[]>([]);
  const [cuartosPorId, setCuartosPorId] = useState<Record<number, CuartoResponse>>({});

  const [formData, setFormData] = useState<ReservasFormData>({
    huespedId: initialData?.huespedId || 0,
    cuartoId: initialData?.cuartoId || 0,
    fechaEntrada: initialData?.fechaEntrada || "",
    fechaSalida: initialData?.fechaSalida || "",
    numeroPersonas: initialData?.numeroPersonas || 1,
    precioTotal: initialData?.precioTotal || 0,
    notas: initialData?.notas || "",
  });

  useEffect(() => {
    if (isOpen && token) {
      loadHuespedesAndCuartos();
    }
  }, [isOpen, token]);

  // Recalcular precio total cuando cambie cuarto, fecha entrada o fecha salida
  useEffect(() => {
    if (formData.cuartoId && formData.fechaEntrada && formData.fechaSalida) {
      const nuevoTotal = calculatePrecioTotal(
        formData.cuartoId,
        formData.fechaEntrada,
        formData.fechaSalida
      );
      setFormData((prev) => ({
        ...prev,
        precioTotal: nuevoTotal,
      }));
    }
  }, [formData.cuartoId, formData.fechaEntrada, formData.fechaSalida, cuartosPorId]);

  const loadHuespedesAndCuartos = async () => {
    try {
      const huespedesRes = await huespedesService.getAllHuespedes(token!);

      if (huespedesRes.exito && huespedesRes.datos) {
        setHuespedes(
          huespedesRes.datos.map((h: any) => ({
            id: h.id,
            nombre: h.nombre,
            apellido: h.apellido,
          }))
        );
      }

      // Cargar cuartos desde la API
      const cuartosRes = await cuartosService.getAllCuartos(token!);
      if (cuartosRes.exito && cuartosRes.datos) {
        setCuartos(cuartosRes.datos);
        // Crear un mapa de cuartos por ID para acceso rápido
        const cuartosMap: Record<number, CuartoResponse> = {};
        cuartosRes.datos.forEach((cuarto) => {
          cuartosMap[cuarto.id] = cuarto;
        });
        setCuartosPorId(cuartosMap);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar datos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.huespedId || !formData.cuartoId || !formData.fechaEntrada || !formData.fechaSalida) {
      setError("Por favor complete todos los campos requeridos");
      return;
    }

    if (new Date(formData.fechaSalida) <= new Date(formData.fechaEntrada)) {
      setError("La fecha de salida debe ser posterior a la de entrada");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      huespedId: 0,
      cuartoId: 0,
      fechaEntrada: "",
      fechaSalida: "",
      numeroPersonas: 1,
      precioTotal: 0,
      notas: "",
    });
    setError(null);
    onClose();
  };

  // Calcular el precio total automáticamente
  const calculatePrecioTotal = (
    cuartoId: number,
    fechaEntrada: string,
    fechaSalida: string
  ): number => {
    if (!cuartoId || !fechaEntrada || !fechaSalida) {
      return 0;
    }

    const cuarto = cuartosPorId[cuartoId];
    if (!cuarto) {
      return 0;
    }

    const inicio = new Date(fechaEntrada);
    const fin = new Date(fechaSalida);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

    if (dias <= 0) {
      return 0;
    }

    return cuarto.precioPorNoche * dias;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cuartoId" || name === "huespedId") {
      const numValue = Number(value);
      setFormData({
        ...formData,
        [name]: numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="700px" maxH="90vh" overflowY="auto">
        <ModalHeader fontSize="lg" pb={2}>{initialData?.huespedId ? "Editar Reserva" : "Crear Reserva"}</ModalHeader>
        <ModalCloseButton />
        <Text className="modal-subtitle" px={6} pb={3} fontSize="sm">
          Rellene los siguientes campos para añadir una nueva reserva.
        </Text>
        <form onSubmit={handleSubmit}>
          <ModalBody py={3}>
            <VStack spacing={3}>
              {error && (
                <Box p={2} bg="red.100" borderRadius="md" width="100%">
                  <Text color="red.700" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Huésped</FormLabel>
                <Select
                  name="huespedId"
                  value={formData.huespedId}
                  onChange={handleInputChange}
                  size="sm"
                >
                  <option value="">Seleccionar huésped...</option>
                  {huespedes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nombre} {h.apellido}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Cuarto</FormLabel>
                <Select
                  name="cuartoId"
                  value={formData.cuartoId}
                  onChange={handleInputChange}
                  size="sm"
                >
                  <option value="">Seleccionar cuarto...</option>
                  {cuartos.map((c) => {
                    const tipoLabel = c.tipo === 0 ? "Individual" : c.tipo === 1 ? "Doble" : c.tipo === 2 ? "Suite" : "Familiar";
                    const estadoLabel = c.estado === 0 ? "Disponible" : c.estado === 1 ? "Ocupado" : c.estado === 2 ? "Mantenimiento" : "Limpieza";
                    return (
                      <option key={c.id} value={c.id}>
                        Cuarto {c.numero} ({tipoLabel}) - ${c.precioPorNoche}/noche - {estadoLabel}
                      </option>
                    );
                  })}
                </Select>
                {formData.cuartoId > 0 && cuartosPorId[formData.cuartoId] && (
                  <Box mt={1} p={1.5} bg="blue.50" borderRadius="md" borderLeft="3px solid blue">
                    <Text fontSize="xs" color="blue.800">
                      <strong>Capacidad:</strong> {cuartosPorId[formData.cuartoId].capacidad} personas
                    </Text>
                  </Box>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Número de Personas</FormLabel>
                <Input
                  type="number"
                  name="numeroPersonas"
                  value={formData.numeroPersonas}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  size="sm"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Fecha de Entrada</FormLabel>
                <DatePicker
                  value={formData.fechaEntrada}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      fechaEntrada: value,
                    })
                  }
                  placeholder="Seleccionar fecha de entrada..."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Fecha de Salida</FormLabel>
                <DatePicker
                  value={formData.fechaSalida}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      fechaSalida: value,
                    })
                  }
                  placeholder="Seleccionar fecha de salida..."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" mb={1}>Precio Total</FormLabel>
                <Box
                  p={2}
                  bg="gray.100"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.300"
                  fontSize="sm"
                  fontWeight="500"
                >
                  ${formData.precioTotal.toFixed(2)}
                </Box>
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Se calcula automáticamente según el cuarto y los días de estadía
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" mb={1}>Notas</FormLabel>
                <Textarea
                  name="notas"
                  value={formData.notas || ""}
                  onChange={handleInputChange}
                  placeholder="Notas adicionales..."
                  size="sm"
                  rows={2}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={2} pt={3}>
            <Button variant="ghost" onClick={handleClose} size="sm">
              Cancelar
            </Button>
            <Button type="submit" colorScheme="orange" isLoading={isLoading} size="sm">
              {initialData?.huespedId ? "Actualizar" : "Crear"} Reserva
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
