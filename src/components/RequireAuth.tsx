
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login, pero guardar la ubicación actual para
    // redirigir después del login exitoso
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
