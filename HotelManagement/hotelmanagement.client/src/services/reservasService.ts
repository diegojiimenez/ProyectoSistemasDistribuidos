import { apiClient } from "./apiClient";

export interface ReservaCreateRequest {
  huespedId: number;
  cuartoId: number;
  fechaEntrada: string;
  fechaSalida: string;
  numeroPersonas: number;
  precioTotal: number;
  notas?: string;
}

export interface ReservaResponse {
  id: number;
  huespedId: number;
  huespedNombre: string;
  cuartoId: number;
  numeroCuarto: number;
  fechaEntrada: string;
  fechaSalida: string;
  estado: string;
  precioTotal: number;
  notas?: string;
  fechaCreacion: string;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  errores?: string[];
}

export const reservasService = {
  /**
   * Obtiene todas las reservas
   */
  async getAllReservas(token: string): Promise<ApiResponse<ReservaResponse[]>> {
    return apiClient.get<ApiResponse<ReservaResponse[]>>("/reservas", token);
  },

  /**
   * Obtiene una reserva por ID
   */
  async getReservaById(id: number, token: string): Promise<ApiResponse<ReservaResponse>> {
    return apiClient.get<ApiResponse<ReservaResponse>>(`/reservas/${id}`, token);
  },

  /**
   * Crea una nueva reserva
   */
  async createReserva(
    reserva: ReservaCreateRequest,
    token: string
  ): Promise<ApiResponse<ReservaResponse>> {
    const dtoBody = {
      huespedId: reserva.huespedId,
      cuartoId: reserva.cuartoId,
      fechaEntrada: reserva.fechaEntrada,
      fechaSalida: reserva.fechaSalida,
      numeroPersonas: reserva.numeroPersonas,
      precioTotal: reserva.precioTotal,
      observaciones: reserva.notas || "",
    };

    return apiClient.post<ApiResponse<ReservaResponse>>("/reservas", dtoBody, token);
  },

  /**
   * Actualiza una reserva existente
   */
  async updateReserva(
    id: number,
    reserva: ReservaCreateRequest,
    token: string
  ): Promise<ApiResponse<ReservaResponse>> {
    const dtoBody = {
      huespedId: reserva.huespedId,
      cuartoId: reserva.cuartoId,
      fechaEntrada: reserva.fechaEntrada,
      fechaSalida: reserva.fechaSalida,
      numeroPersonas: reserva.numeroPersonas,
      precioTotal: reserva.precioTotal,
      observaciones: reserva.notas || "",
    };

    return apiClient.put<ApiResponse<ReservaResponse>>(`/reservas/${id}`, dtoBody, token);
  },

  /**
   * Elimina una reserva
   */
  async deleteReserva(id: number, token: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/reservas/${id}`, token);
  },
};
