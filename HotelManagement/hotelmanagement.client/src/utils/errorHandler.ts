/**
 * Traduce y formatea los mensajes de error del backend a mensajes más amigables
 */
export const formatErrorMessage = (error: any): string => {
  // Si es un string simple
  if (typeof error === "string") {
    return formatBackendErrorMessage(error);
  }

  // Si es un objeto con mensaje
  if (error?.message) {
    return formatBackendErrorMessage(error.message);
  }

  // Si es un objeto con errores (array)
  if (error?.errores && Array.isArray(error.errores) && error.errores.length > 0) {
    const formattedErrors = error.errores.map((e: string) => formatBackendErrorMessage(e));
    return formattedErrors.join(" ");
  }

  // Por defecto
  return "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
};

/**
 * Traduce mensajes específicos del backend a mensajes amigables
 */
const formatBackendErrorMessage = (message: string): string => {
  if (!message) {
    return "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
  }

  // Errores de validación
  if (message.includes("exito") || message.includes("false")) {
    return "Ocurrió un error al procesar tu solicitud. Por favor, verifica los datos.";
  }

  if (message.includes("fecha") || message.includes("date")) {
    return "Por favor, verifica las fechas. La fecha de entrada debe ser anterior a la de salida.";
  }

  if (message.includes("email") || message.includes("correo")) {
    return "Por favor, verifica que el correo electrónico sea válido.";
  }

  if (message.includes("teléfono") || message.includes("telefono") || message.includes("phone")) {
    return "Por favor, verifica que el número de teléfono sea válido.";
  }

  if (message.includes("documento") || message.includes("identity") || message.includes("DNI")) {
    return "Por favor, verifica que el documento de identidad sea válido.";
  }

  if (message.includes("nombre") || message.includes("name")) {
    return "Por favor, verifica que el nombre sea válido.";
  }

  if (message.includes("precio") || message.includes("price") || message.includes("total")) {
    return "Por favor, verifica el precio ingresado.";
  }

  if (message.includes("cuarto") || message.includes("room") || message.includes("habitación")) {
    return "Por favor, selecciona un cuarto válido.";
  }

  if (message.includes("huésped") || message.includes("guest") || message.includes("cliente")) {
    return "Por favor, selecciona un huésped válido.";
  }

  if (message.includes("Duplicate") || message.includes("duplicado") || message.includes("ya existe")) {
    return "Esta información ya existe en el sistema. Por favor, verifica los datos.";
  }

  if (message.includes("No se encontró") || message.includes("not found") || message.includes("no existe")) {
    return "El registro que buscas no existe. Por favor, actualiza la página.";
  }

  if (message.includes("No hay token") || message.includes("Unauthorized") || message.includes("401")) {
    return "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.";
  }

  if (message.includes("Forbidden") || message.includes("no tienes permiso") || message.includes("403")) {
    return "No tienes permisos para realizar esta acción.";
  }

  if (message.includes("Bad Request") || message.includes("400")) {
    return "Los datos enviados no son válidos. Por favor, verifica y intenta de nuevo.";
  }

  if (message.includes("Internal Server") || message.includes("500")) {
    return "Error del servidor. Por favor, intenta más tarde.";
  }

  if (message.includes("Connection") || message.includes("network") || message.includes("Cannot fetch")) {
    return "Error de conexión. Por favor, verifica tu conexión a internet.";
  }

  // Si no coincide con ningún patrón, devolver el mensaje original más amigable
  return message.length > 100
    ? "Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo."
    : message;
};

/**
 * Extrae solo el mensaje de error de un objeto de error complejo
 */
export const extractErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data?.mensaje) {
    return error.response.data.mensaje;
  }

  if (error?.mensaje) {
    return error.mensaje;
  }

  if (error?.message) {
    return error.message;
  }

  return "Error desconocido";
};

/**
 * Procesa el error completo y retorna un mensaje amigable
 */
export const processErrorMessage = (error: any): string => {
  const extractedMessage = extractErrorMessage(error);
  return formatErrorMessage(extractedMessage);
};
