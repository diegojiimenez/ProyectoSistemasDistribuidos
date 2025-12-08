const API_BASE_URL = "http://localhost:5000/api";

interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
}

export const apiClient = {
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },
};
