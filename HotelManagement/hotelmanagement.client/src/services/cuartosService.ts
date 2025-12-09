import { apiClient } from "./apiClient";

export const TipoCuarto = {
  Individual: 0,
  Doble: 1,
  Suite: 2,
  Familiar: 3,
} as const;

export const EstadoCuarto = {
  Disponible: 0,
  Ocupado: 1,
  Mantenimiento: 2,
  Limpieza: 3,
} as const;

export interface CuartoResponse {
  id: number;
  numero: string;
  tipo: number;
  descripcion: string;
  precioPorNoche: number;
  capacidad: number;
  estado: number;
}

export interface CuartoCreateRequest {
  numero: string;
  tipo: number;
  descripcion: string;
  precioPorNoche: number;
  capacidad: number;
}

export interface CuartoUpdateRequest {
  numero?: string;
  tipo?: number;
  descripcion?: string;
  precioPorNoche?: number;
  capacidad?: number;
  estado?: number;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  errores?: string[];
}

export const cuartosService = {
  /**
   * Obtiene todos los cuartos
   */
  async getAllCuartos(token: string): Promise<ApiResponse<CuartoResponse[]>> {
    return apiClient.get<ApiResponse<CuartoResponse[]>>("/cuartos", token);
  },

  /**
   * Obtiene un cuarto por ID
   */
  async getCuartoById(id: number, token: string): Promise<ApiResponse<CuartoResponse>> {
    return apiClient.get<ApiResponse<CuartoResponse>>(`/cuartos/${id}`, token);
  },

  /**
   * Obtiene solo los cuartos disponibles
   */
  async getCuartosDisponibles(token: string): Promise<ApiResponse<CuartoResponse[]>> {
    return apiClient.get<ApiResponse<CuartoResponse[]>>("/cuartos/disponibles", token);
  },

  /**
   * Crea un nuevo cuarto
   */
  async createCuarto(
    dto: CuartoCreateRequest,
    token: string
  ): Promise<ApiResponse<CuartoResponse>> {
    return apiClient.post<ApiResponse<CuartoResponse>>("/cuartos", dto, token);
  },

  /**
   * Actualiza un cuarto
   */
  async updateCuarto(
    id: number,
    dto: CuartoUpdateRequest,
    token: string
  ): Promise<ApiResponse<CuartoResponse>> {
    return apiClient.put<ApiResponse<CuartoResponse>>(`/cuartos/${id}`, dto, token);
  },

  /**
   * Elimina un cuarto
   */
  async deleteCuarto(id: number, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/cuartos/${id}`, token);
  },
};
