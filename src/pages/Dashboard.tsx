
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ServiceCard from "@/components/ServiceCard";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  GanttChartSquare,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const services = [
  { id: "1", name: "Corte de pelo", duration: 30, price: 20 },
  { id: "2", name: "Tinte", duration: 90, price: 45 },
  { id: "3", name: "Peinado", duration: 45, price: 30 },
  { id: "4", name: "Manicura", duration: 60, price: 25 },
];

const appointments = [
  {
    id: "1",
    client: "María García",
    service: "Corte de pelo",
    date: "Hoy, 10:30",
    status: "confirmed",
  },
  {
    id: "2",
    client: "Carlos Rodríguez",
    service: "Tinte",
    date: "Hoy, 14:00",
    status: "confirmed",
  },
  {
    id: "3",
    client: "Ana Martínez",
    service: "Peinado",
    date: "Mañana, 11:15",
    status: "pending",
  },
  {
    id: "4",
    client: "Laura Sánchez",
    service: "Manicura",
    date: "20 Mayo, 16:30",
    status: "confirmed",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleCreateService = () => {
    toast.success("Funcionalidad en desarrollo", {
      description: "Esta característica estará disponible próximamente",
    });
  };

  const handleEditService = (id: string) => {
    toast.info(`Editando servicio ${id}`);
  };

  const handleDeleteService = (id: string) => {
    toast.info(`Eliminando servicio ${id}`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
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
              Menu
            </h3>
            <div className="space-y-1">
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <GanttChartSquare className="mr-2 h-4 w-4" />
                Panel
              </Button>
              <Button
                variant={activeTab === "calendar" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("calendar")}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendario
              </Button>
              <Button
                variant={activeTab === "services" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("services")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Servicios
              </Button>
              <Button
                variant={activeTab === "clients" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("clients")}
              >
                <Users className="mr-2 h-4 w-4" />
                Clientes
              </Button>
              <Button
                variant={activeTab === "messages" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("messages")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Mensajes
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">
              Configuración
            </h3>
            <div className="space-y-1">
              <Button
                variant={activeTab === "settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Ajustes
              </Button>
              <Button
                variant={activeTab === "notifications" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </Button>
            </div>
          </div>
        </nav>
        <div className="border-t px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">Ana Pérez</span>
              <span className="text-xs text-muted-foreground">
                Peluquería Ana
              </span>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => toast.info("Menú móvil (en desarrollo)")}
        >
          <GanttChartSquare className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-medium">AgendaFácil</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col lg:pl-64">
        <div className="px-4 py-6 md:px-6 lg:py-8">
          <Tabs defaultValue="dashboard" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="dashboard" className="hidden lg:inline-flex">
                  Panel
                </TabsTrigger>
                <TabsTrigger value="servicios" className="hidden lg:inline-flex">
                  Servicios
                </TabsTrigger>
                <TabsTrigger value="clientes" className="hidden lg:inline-flex">
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="mensajes" className="hidden lg:inline-flex">
                  Configuración
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <User className="mr-2 h-3.5 w-3.5" />
                  <span className="hidden sm:inline-block">Mi perfil</span>
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => toast.info("Esta característica estará disponible próximamente")}
                >
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  <span className="hidden sm:inline-block">Nuevo servicio</span>
                </Button>
              </div>
            </div>

            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Citas Totales
                      </CardTitle>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        +8% respecto al mes anterior
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Ingresos
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">560€</div>
                      <p className="text-xs text-muted-foreground">
                        +12% respecto al mes anterior
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Clientes Recurrentes
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">16</div>
                      <p className="text-xs text-muted-foreground">
                        +4% respecto al mes anterior
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Tasa de Asistencia
                      </CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">
                        +5% con recordatorios WhatsApp
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Upcoming Appointments */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-4"
                >
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-1">
                        <CardTitle>Próximas Citas</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Gestiona las citas programadas para los próximos días.
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto gap-1">
                        <span className="hidden sm:inline-block">Ver todas</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {appointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between space-x-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="rounded-full p-1.5 bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-none mb-1">
                                  {appointment.client}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground gap-1">
                                  <span>{appointment.service}</span>
                                  <span>•</span>
                                  <span>{appointment.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  appointment.status === "confirmed"
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toast.info("Ver detalles (en desarrollo)")}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Services Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="col-span-3"
                >
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-1">
                        <CardTitle>Tus Servicios</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Configura los servicios que ofreces a tus clientes.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto"
                        onClick={handleCreateService}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Añadir
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {services.slice(0, 3).map((service) => (
                          <ServiceCard
                            key={service.id}
                            id={service.id}
                            name={service.name}
                            duration={service.duration}
                            price={service.price}
                            isEditable={true}
                            onEdit={handleEditService}
                            onDelete={handleDeleteService}
                          />
                        ))}
                        <Button 
                          variant="ghost" 
                          className="w-full mt-2 text-primary"
                          onClick={() => setActiveTab("services")}
                        >
                          Ver todos los servicios
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* WhatsApp Integration Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-primary/20 rounded-full filter blur-2xl opacity-70 pointer-events-none" />
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                      <Smartphone className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        Integración con WhatsApp
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Optimiza tu comunicación con los clientes enviando confirmaciones 
                        y recordatorios automáticos por WhatsApp. Reduce cancelaciones hasta un 30%.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mr-3"
                        onClick={() => toast.info("Esta característica estará disponible próximamente")}
                      >
                        Configurar
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-primary"
                        onClick={() => toast.info("En el plan Premium")}
                      >
                        Ver plan Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
