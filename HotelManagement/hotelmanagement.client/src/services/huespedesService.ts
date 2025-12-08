import { apiClient } from "./apiClient";

export interface HuespedCreateRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documentoIdentidad: string;
  direccion: string;
}

export interface HuespedResponse {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  telefono: string;
  documentoIdentidad: string;
  direccion: string;
  fechaRegistro: string;
  numeroReservas: number;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  errores?: string[];
}

export const huespedesService = {
  /**
   * Obtiene todos los huéspedes
   */
  async getAllHuespedes(token: string): Promise<ApiResponse<HuespedResponse[]>> {
    return apiClient.get<ApiResponse<HuespedResponse[]>>("/huespedes", token);
  },

  /**
   * Obtiene un huésped por ID
   */
  async getHuespedById(id: number, token: string): Promise<ApiResponse<HuespedResponse>> {
    return apiClient.get<ApiResponse<HuespedResponse>>(`/huespedes/${id}`, token);
  },

  /**
   * Crea un nuevo huésped
   * Nota: El DTO del backend espera "CorreoElectronico" pero nosotros enviamos "email"
   * Se mapea automáticamente aquí
   */
  async createHuesped(
    huesped: HuespedCreateRequest,
    token: string
  ): Promise<ApiResponse<HuespedResponse>> {
    // Mapear "email" a "correoElectronico" para coincidir con el DTO del backend
    const dtoBody = {
      nombre: huesped.nombre,
      apellido: huesped.apellido,
      correoElectronico: huesped.email,
      telefono: huesped.telefono,
      documentoIdentidad: huesped.documentoIdentidad,
      direccion: huesped.direccion,
    };

    return apiClient.post<ApiResponse<HuespedResponse>>("/huespedes", dtoBody, token);
  },

  /**
   * Actualiza un huésped existente
   */
  async updateHuesped(
    id: number,
    huesped: HuespedCreateRequest,
    token: string
  ): Promise<ApiResponse<HuespedResponse>> {
    const dtoBody = {
      nombre: huesped.nombre,
      apellido: huesped.apellido,
      correoElectronico: huesped.email,
      telefono: huesped.telefono,
      documentoIdentidad: huesped.documentoIdentidad,
      direccion: huesped.direccion,
    };

    return apiClient.put<ApiResponse<HuespedResponse>>(`/huespedes/${id}`, dtoBody, token);
  },

  /**
   * Elimina un huésped
   */
  async deleteHuesped(id: number, token: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<ApiResponse<boolean>>(`/huespedes/${id}`, token);
  },
};
