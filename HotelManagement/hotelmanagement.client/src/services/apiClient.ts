// Detectar si estamos en Docker o desarrollo local
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5069/api";

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export const apiClient = {
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    return response.json();
  },

  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    return response.json();
  },

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    return response.json();
  },
};
