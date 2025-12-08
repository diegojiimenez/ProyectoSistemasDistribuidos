import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/ProtectedRoute.css";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 🚀 MODO DESARROLLO: Comentar esta sección para acceso directo a rutas
  // Descomenta este bloque cuando necesites autenticación real
  /*
  if (isLoading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  */

  // En desarrollo, permitir acceso directo a todas las rutas
  return <>{children}</>;
};
