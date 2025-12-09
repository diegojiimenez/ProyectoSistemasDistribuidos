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
  Input,
  Textarea,
  Select,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { huespedesService } from "../../services/huespedesService";

export interface ReservasFormData {
  huespedId: number;
  cuartoId: number;
  fechaEntrada: string;
  fechaSalida: string;
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
  const [cuartos, setCuartos] = useState<Array<{ id: number; numeroCuarto: number }>>([]);

  const [formData, setFormData] = useState<ReservasFormData>({
    huespedId: initialData?.huespedId || 0,
    cuartoId: initialData?.cuartoId || 0,
    fechaEntrada: initialData?.fechaEntrada || "",
    fechaSalida: initialData?.fechaSalida || "",
    precioTotal: initialData?.precioTotal || 0,
    notas: initialData?.notas || "",
  });

  useEffect(() => {
    if (isOpen && token) {
      loadHuespedesAndCuartos();
    }
  }, [isOpen, token]);

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

      // Cuartos hardcodeados por ahora
      setCuartos([
        { id: 1, numeroCuarto: 101 },
        { id: 2, numeroCuarto: 102 },
        { id: 3, numeroCuarto: 103 },
        { id: 4, numeroCuarto: 104 },
        { id: 5, numeroCuarto: 105 },
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar huéspedes");
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
      precioTotal: 0,
      notas: "",
    });
    setError(null);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precioTotal" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="500px">
        <ModalHeader>{initialData?.huespedId ? "Editar Reserva" : "Nueva Reserva"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Box p={3} bg="red.100" borderRadius="md" width="100%">
                  <Text color="red.700" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel>Huésped</FormLabel>
                <Select
                  name="huespedId"
                  value={formData.huespedId}
                  onChange={handleInputChange}
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
                <FormLabel>Cuarto</FormLabel>
                <Select
                  name="cuartoId"
                  value={formData.cuartoId}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar cuarto...</option>
                  {cuartos.map((c) => (
                    <option key={c.id} value={c.id}>
                      Cuarto {c.numeroCuarto}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fecha de Entrada</FormLabel>
                <Input
                  type="datetime-local"
                  name="fechaEntrada"
                  value={formData.fechaEntrada}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fecha de Salida</FormLabel>
                <Input
                  type="datetime-local"
                  name="fechaSalida"
                  value={formData.fechaSalida}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Precio Total</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  name="precioTotal"
                  value={formData.precioTotal}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notas</FormLabel>
                <Textarea
                  name="notas"
                  value={formData.notas || ""}
                  onChange={handleInputChange}
                  placeholder="Notas adicionales..."
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" colorScheme="orange" isLoading={isLoading}>
              {initialData?.huespedId ? "Actualizar" : "Crear"} Reserva
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
