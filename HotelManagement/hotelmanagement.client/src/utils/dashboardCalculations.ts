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
  today.setHours(0, 0, 0, 0);

  // Reservas activas (aquellas cuya fecha de entrada ya pasó pero no la de salida)
  const activeReservations = reservas.filter((r) => {
    const fechaEntrada = new Date(r.fechaEntrada);
    const fechaSalida = new Date(r.fechaSalida);
    fechaEntrada.setHours(0, 0, 0, 0);
    fechaSalida.setHours(0, 0, 0, 0);
    return fechaEntrada <= today && fechaSalida >= today;
  }).length;

  // Huéspedes registrados/con check-in
  const guestsCheckedIn = reservas.filter((r) => {
    const fechaEntrada = new Date(r.fechaEntrada);
    fechaEntrada.setHours(0, 0, 0, 0);
    return fechaEntrada <= today && r.estado !== "Cancelada";
  }).length;

  // Ocupación actual
  const totalRooms = cuartos.length;
  const occupiedRooms = reservas.filter((r) => {
    const fechaEntrada = new Date(r.fechaEntrada);
    const fechaSalida = new Date(r.fechaSalida);
    fechaEntrada.setHours(0, 0, 0, 0);
    fechaSalida.setHours(0, 0, 0, 0);
    return fechaEntrada <= today && fechaSalida >= today && r.estado !== "Cancelada";
  }).length;

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
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
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
  today.setHours(0, 0, 0, 0);

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

  // Contar cuartos ocupados por tipo
  const ocupadosPorTipo: { [key: string]: number } = {};
  reservas.forEach((reserva) => {
    const cuarto = cuartos.find((c) => c.id === reserva.cuartoId);
    if (!cuarto) return;

    const fechaEntrada = new Date(reserva.fechaEntrada);
    const fechaSalida = new Date(reserva.fechaSalida);
    fechaEntrada.setHours(0, 0, 0, 0);
    fechaSalida.setHours(0, 0, 0, 0);

    if (
      fechaEntrada <= today &&
      fechaSalida >= today &&
      reserva.estado !== "Cancelada"
    ) {
      const tipo = tipoMap[cuarto.tipo] || "Desconocido";
      ocupadosPorTipo[tipo] = (ocupadosPorTipo[tipo] || 0) + 1;
    }
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
