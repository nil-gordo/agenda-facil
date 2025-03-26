
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  GanttChartSquare,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Rutas del dashboard
  const routes = [
    { path: "/dashboard", label: "Panel", icon: GanttChartSquare },
    { path: "/services", label: "Servicios", icon: BarChart3 },
    { path: "/appointments", label: "Citas", icon: CalendarDays },
    { path: "/clients", label: "Clientes", icon: Users },
    { path: "/messages", label: "Mensajes", icon: MessageSquare },
  ];

  // Función para obtener iniciales del nombre
  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar para pantallas grandes */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background lg:flex flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-medium">AgendaFácil</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">
              Menú
            </h3>
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.path}
                  variant={location.pathname === route.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate(route.path)}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">
              Configuración
            </h3>
            <div className="space-y-1">
              <Button
                variant={location.pathname === "/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Ajustes
              </Button>
              <Button
                variant={location.pathname === "/connect-services" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate("/connect-services")}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Conexiones
              </Button>
              <Button
                variant={location.pathname === "/help" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate("/help")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Ayuda
              </Button>
            </div>
          </div>
        </nav>
        <div className="border-t px-3 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center gap-3 rounded-lg">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col text-left">
                    <span className="text-sm font-medium">{user?.fullName}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {user?.businessName || "Mi Negocio"}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ajustes</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notificaciones</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Header para móvil */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b h-14 flex items-center px-4">
              <SheetTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-primary rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-medium">AgendaFácil</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-1 overflow-auto py-4">
              <div className="px-3 py-2">
                <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">
                  Menú
                </h3>
                <div className="space-y-1">
                  {routes.map((route) => (
                    <Button
                      key={route.path}
                      variant={location.pathname === route.path ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(route.path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="px-3 py-2">
                <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">
                  Configuración
                </h3>
                <div className="space-y-1">
                  <Button
                    variant={location.pathname === "/settings" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Ajustes
                  </Button>
                  <Button
                    variant={location.pathname === "/connect-services" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/connect-services");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Conexiones
                  </Button>
                </div>
              </div>
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">{user?.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.businessName || "Mi Negocio"}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-medium">AgendaFácil</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ajustes</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex flex-1 flex-col lg:pl-64")}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
