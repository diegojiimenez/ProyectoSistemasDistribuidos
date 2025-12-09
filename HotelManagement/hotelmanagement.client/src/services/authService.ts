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
    console.log("🔵 authService.login called with:", data);
    const url = "/auth/login";
    console.log("🔵 Fetching from:", url);
    try {
      const response = await apiClient.post<LoginResponse>(url, data);
      console.log("🟢 Login response:", response);
      return response;
    } catch (error) {
      console.error("🔴 Login error in authService:", error);
      throw error;
    }
  },

  async registro(data: RegistroRequest): Promise<{ message: string }> {
    console.log("🔵 authService.registro called with:", data);
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
