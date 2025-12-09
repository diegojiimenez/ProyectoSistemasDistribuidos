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
  // Contar todas las reservas no canceladas
  const activeReservations = reservas.filter(
    (r) => r.estado !== "Cancelada"
  ).length;

  // Contar todos los huéspedes en reservas no canceladas
  const guestsCheckedIn = reservas.filter(
    (r) => r.estado !== "Cancelada"
  ).length;

  // Ocupación basada en todas las reservas activas (no canceladas)
  const totalRooms = cuartos.length;
  const occupiedRooms = reservas.filter(
    (r) => r.estado !== "Cancelada"
  ).length;

  const currentOccupancy =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Cuartos disponibles
  const availableRooms = totalRooms - occupiedRooms;

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

  // Contar cuartos ocupados por tipo (todas las reservas no canceladas)
  const ocupadosPorTipo: { [key: string]: number } = {};
  reservas.forEach((reserva) => {
    if (reserva.estado === "Cancelada") return;

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
