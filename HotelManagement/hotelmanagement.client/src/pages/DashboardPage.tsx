import { useAuth } from "../hooks/useAuth";

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido, {user?.nombreUsuario}</h1>
      <p>Rol: {user?.rol}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
