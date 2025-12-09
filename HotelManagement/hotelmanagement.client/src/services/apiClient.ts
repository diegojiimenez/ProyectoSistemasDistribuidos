const API_BASE_URL = "http://localhost:5069/api";

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
      credentials: "include",
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔵 [API POST] ${url}`, { data, headers });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      console.log(`🔵 [API POST Response] Status: ${response.status}`, response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🔴 API Error [${response.status}]:`, errorText);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      console.log(`🟢 [API POST Success]`, result);
      return result;
    } catch (error) {
      console.error(`🔴 [API POST Catch]`, error);
      throw error;
    }
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
      credentials: "include",
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
      credentials: "include",
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },
};
