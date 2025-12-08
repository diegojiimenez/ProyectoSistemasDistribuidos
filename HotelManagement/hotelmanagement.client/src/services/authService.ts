import { apiClient } from "./apiClient";

export interface LoginRequest {
  nombreUsuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  nombreUsuario: string;
  rol: string;
}

export interface RegistroRequest {
  nombreUsuario: string;
  password: string;
  rol?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", data);
  },

  async registro(data: RegistroRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/registro", data);
  },

  saveToken(token: string): void {
    localStorage.setItem("auth_token", token);
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  removeToken(): void {
    localStorage.removeItem("auth_token");
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};
