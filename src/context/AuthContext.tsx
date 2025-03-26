
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  connectGoogleCalendar: () => Promise<boolean>;
  connectTwilio: (token: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Verificar si hay un usuario en localStorage al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Inicio de sesión exitoso");
        return true;
      } else {
        toast.error(response.error || "Error al iniciar sesión");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const response = await api.register(userData);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Cuenta creada con éxito");
        return true;
      } else {
        toast.error(response.error || "Error al registrarse");
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Error al registrarse");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
      navigate("/login");
      toast.success("Sesión cerrada con éxito");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  const connectGoogleCalendar = async () => {
    setLoading(true);
    try {
      // Simulamos la autenticación con Google
      toast.info("Conectando con Google Calendar...");
      const response = await api.connectGoogleCalendar();
      
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Conectado a Google Calendar con éxito");
        return true;
      } else {
        toast.error(response.error || "Error al conectar con Google Calendar");
        return false;
      }
    } catch (error) {
      console.error("Connect Google Calendar error:", error);
      toast.error("Error al conectar con Google Calendar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const connectTwilio = async (token: string) => {
    setLoading(true);
    try {
      const response = await api.connectTwilio(token);
      
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Token de Twilio conectado con éxito");
        return true;
      } else {
        toast.error(response.error || "Error al conectar token de Twilio");
        return false;
      }
    } catch (error) {
      console.error("Connect Twilio error:", error);
      toast.error("Error al conectar token de Twilio");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        connectGoogleCalendar,
        connectTwilio,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
