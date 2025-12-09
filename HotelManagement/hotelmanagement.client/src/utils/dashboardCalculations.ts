import type { ReservaResponse } from "../services/reservasService";
import { type CuartoResponse, TipoCuarto } from "../services/cuartosService";

export interface MonthlyReservationData {
  month: string;
  reservations: number;
}

export interface RoomTypeData {
  tipo: string;
  ocupadas: number;
  total: number;
}

export interface DashboardStats {
  activeReservations: number;
  guestsCheckedIn: number;
  currentOccupancy: number;
  availableRooms: number;
}

/**
 * Calcula las estadísticas del dashboard basadas en reservas y cuartos
 */
export const calculateDashboardStats = (
  reservas: ReservaResponse[],
  cuartos: CuartoResponse[]
): DashboardStats => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establecer a medianoche

  // Contar todas las reservas no canceladas (activas/futuras)
  const activeReservations = reservas.filter(
    (r) => r.estado !== "Cancelada"
  ).length;

  // Contar cuartos OCUPADOS ACTUALMENTE (reservas en curso ahora)
  const occupiedRoomsNow = reservas.filter((r) => {
    if (r.estado === "Cancelada") return false;
    
    const fechaEntrada = new Date(r.fechaEntrada);
    const fechaSalida = new Date(r.fechaSalida);
    
    // Normalizar fechas a medianoche
    fechaEntrada.setHours(0, 0, 0, 0);
    fechaSalida.setHours(0, 0, 0, 0);
    
    // Contar como ocupado si today está entre entrada y salida (exclusive en salida)
    return today >= fechaEntrada && today < fechaSalida;
  }).length;

  // Todos los huéspedes con reservas activas
  const guestsCheckedIn = activeReservations;

  // Cálculos basados en ocupación actual
  const totalRooms = cuartos.length;
  const currentOccupancy =
    totalRooms > 0 ? Math.round((occupiedRoomsNow / totalRooms) * 100) : 0;

  // Cuartos disponibles = total - ocupados ahora
  const availableRooms = totalRooms - occupiedRoomsNow;

  return {
    activeReservations,
    guestsCheckedIn,
    currentOccupancy,
    availableRooms,
  };
};

/**
 * Calcula las reservas por mes para los últimos 6 meses
 */
export const calculateMonthlyReservations = (
  reservas: ReservaResponse[]
): MonthlyReservationData[] => {
  const today = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthsData: MonthlyReservationData[] = [];

  // Obtener los últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Contar reservas que inician en este mes
    const reservasEnMes = reservas.filter((r) => {
      const fechaEntrada = new Date(r.fechaEntrada);
      return (
        fechaEntrada.getMonth() === monthIndex &&
        fechaEntrada.getFullYear() === year &&
        r.estado !== "Cancelada"
      );
    }).length;

    monthsData.push({
      month: months[monthIndex],
      reservations: reservasEnMes,
    });
  }

  return monthsData;
};

/**
 * Calcula las habitaciones ocupadas por tipo
 */
export const calculateRoomsByType = (
  reservas: ReservaResponse[],
  cuartos: CuartoResponse[]
): RoomTypeData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establecer a medianoche

  // Mapeo de tipos de cuartos
  const tipoMap: { [key: number]: string } = {
    [TipoCuarto.Individual]: "Individual",
    [TipoCuarto.Doble]: "Doble",
    [TipoCuarto.Suite]: "Suite",
    [TipoCuarto.Familiar]: "Familiar",
  };

  // Contar cuartos por tipo
  const cuartosPorTipo: { [key: string]: number } = {};
  cuartos.forEach((cuarto) => {
    const tipo = tipoMap[cuarto.tipo] || "Desconocido";
    cuartosPorTipo[tipo] = (cuartosPorTipo[tipo] || 0) + 1;
  });

  // Contar cuartos OCUPADOS AHORA por tipo (solo reservas en curso)
  const ocupadosPorTipo: { [key: string]: number } = {};
  reservas.forEach((reserva) => {
    if (reserva.estado === "Cancelada") return;

    const fechaEntrada = new Date(reserva.fechaEntrada);
    const fechaSalida = new Date(reserva.fechaSalida);
    
    // Normalizar fechas a medianoche
    fechaEntrada.setHours(0, 0, 0, 0);
    fechaSalida.setHours(0, 0, 0, 0);
    
    // Solo contar si la reserva está en curso ahora
    if (today < fechaEntrada || today >= fechaSalida) return;

    const cuarto = cuartos.find((c) => c.id === reserva.cuartoId);
    if (!cuarto) return;

    const tipo = tipoMap[cuarto.tipo] || "Desconocido";
    ocupadosPorTipo[tipo] = (ocupadosPorTipo[tipo] || 0) + 1;
  });

  // Generar datos para el gráfico
  const roomTypeData: RoomTypeData[] = [];
  Object.keys(cuartosPorTipo).forEach((tipo) => {
    roomTypeData.push({
      tipo,
      ocupadas: ocupadosPorTipo[tipo] || 0,
      total: cuartosPorTipo[tipo],
    });
  });

  return roomTypeData;
};
