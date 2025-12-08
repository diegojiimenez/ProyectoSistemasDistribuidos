import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";

export interface User {
  nombreUsuario: string;
  rol: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (nombreUsuario: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al cargar la app
  useEffect(() => {
    const savedToken = authService.getToken();
    if (savedToken && !authService.isTokenExpired(savedToken)) {
      setToken(savedToken);
      // Aquí podrías validar el token con el backend si lo necesitas
    } else if (savedToken) {
      authService.removeToken();
    }
    setIsLoading(false);
  }, []);

  const login = async (nombreUsuario: string, password: string) => {
    const response = await authService.login({ nombreUsuario, password });
    authService.saveToken(response.token);
    setToken(response.token);
    setUser({
      nombreUsuario: response.nombreUsuario,
      rol: response.rol,
    });
  };

  const logout = () => {
    authService.removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
