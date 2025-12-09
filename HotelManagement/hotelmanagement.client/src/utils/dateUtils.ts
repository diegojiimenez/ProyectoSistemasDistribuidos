/**
 * Formatea una fecha ISO a formato legible
 * @param isoDate Fecha en formato ISO (ej: 2025-12-09T00:51:15.782734)
 * @returns Fecha formateada (ej: 09/12/2025)
 */
export const formatearFecha = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  } catch {
    return isoDate; // Si falla, devuelve la fecha original
  }
};

/**
 * Formatea una fecha ISO a formato con hora
 * @param isoDate Fecha en formato ISO
 * @returns Fecha y hora formateadas (ej: 09/12/2025 00:51)
 */
export const formatearFechaConHora = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  } catch {
    return isoDate;
  }
};

/**
 * Formatea una fecha ISO a formato largo
 * @param isoDate Fecha en formato ISO
 * @returns Fecha larga formateada (ej: 9 de diciembre de 2025)
 */
export const formatearFechaLarga = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    const opciones: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-ES", opciones);
  } catch {
    return isoDate;
  }
};
