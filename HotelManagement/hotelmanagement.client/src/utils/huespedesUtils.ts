/**
 * Calcula el estado del huésped basándose en su historial de reservas
 * VIP: Más de 5 reservas o monto total > $5000
 * Frecuente: Entre 3-5 reservas o monto total entre $1000-$5000
 * Regular: 1-2 reservas o monto total < $1000
 * Bloqueado: Estado manual (debe ser establecido explícitamente)
 */

export type EstadoHuesped = "VIP" | "Frecuente" | "Regular" | "Bloqueado";

export interface HuespedesHistorial {
  totalReservas?: number;
  montoTotal?: number;
  esBloqueado?: boolean;
}

export const calcularEstadoHuesped = (historial: HuespedesHistorial): EstadoHuesped => {
  // Si está explícitamente bloqueado, retorna Bloqueado
  if (historial.esBloqueado) {
    return "Bloqueado";
  }

  const totalReservas = historial.totalReservas || 0;
  const montoTotal = historial.montoTotal || 0;

  // VIP: Más de 5 reservas o monto total > $5000
  if (totalReservas > 5 || montoTotal > 5000) {
    return "VIP";
  }

  // Frecuente: Entre 3-5 reservas o monto total entre $1000-$5000
  if ((totalReservas >= 3 && totalReservas <= 5) || (montoTotal >= 1000 && montoTotal <= 5000)) {
    return "Frecuente";
  }

  // Regular: 1-2 reservas o monto total < $1000
  if (totalReservas >= 1 || montoTotal > 0) {
    return "Regular";
  }

  // Por defecto, nuevo huésped es Regular
  return "Regular";
};

/**
 * Obtiene la clase CSS correspondiente al estado del huésped
 */
export const getEstadoClaseName = (estado: EstadoHuesped): string => {
  switch (estado) {
    case "VIP":
      return "huesped-badge-vip";
    case "Frecuente":
      return "huesped-badge-frecuente";
    case "Regular":
      return "huesped-badge-regular";
    case "Bloqueado":
      return "huesped-badge-bloqueado";
    default:
      return "huesped-badge-regular";
  }
};

/**
 * Obtiene el label displayable del estado
 */
export const getEstadoLabel = (estado: EstadoHuesped): string => {
  switch (estado) {
    case "VIP":
      return "VIP";
    case "Frecuente":
      return "FRECUENTE";
    case "Regular":
      return "REGULAR";
    case "Bloqueado":
      return "BLOQUEADO";
    default:
      return "REGULAR";
  }
};
