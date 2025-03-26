
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Booking, Service } from "@/types";
import { toast } from "sonner";
import ServiceCard from "@/components/ServiceCard";
import DashboardLayout from "@/components/DashboardLayout";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Plus,
  Smartphone,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadServices();
      loadBookings();
      loadPublicUrl();
    }
  }, [user?.id]);

  const loadServices = async () => {
    if (!user?.id) return;
    
    setLoadingServices(true);
    try {
      const response = await api.getServices(user.id);
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadBookings = async () => {
    if (!user?.id) return;
    
    setLoadingBookings(true);
    try {
      const response = await api.getBookings(user.id);
      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadPublicUrl = async () => {
    if (!user?.id) return;
    
    try {
      const response = await api.getPublicUrl(user.id);
      if (response.success && response.data) {
        setPublicUrl(response.data);
      }
    } catch (error) {
      console.error("Error loading public URL:", error);
    }
  };

  const handleEditService = (id: string) => {
    navigate("/services");
  };

  const handleDeleteService = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const response = await api.deleteService(user.id, id);
      if (response.success) {
        toast.success("Servicio eliminado correctamente");
        loadServices();
      } else {
        toast.error(response.error || "Error al eliminar servicio");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Error al eliminar servicio");
    }
  };

  // Filtrar sólo citas confirmadas para mostrar en el panel
  const upcomingBookings = bookings
    .filter(booking => booking.status === "confirmed")
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
    .slice(0, 4);

  // Calcular estadísticas
  const totalBookings = bookings.length;
  const totalConfirmed = bookings.filter(booking => booking.status === "confirmed").length;
  const totalRevenue = bookings
    .filter(booking => booking.status === "confirmed")
    .reduce((sum, booking) => {
      const service = services.find(s => s.id === booking.serviceId);
      return sum + (service?.price || 0);
    }, 0);
  const totalClients = [...new Set(bookings.map(booking => booking.clientPhone))].length;

  return (
    <DashboardLayout>
      <div className="px-4 py-6 md:px-6 lg:py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Panel</h1>
              <p className="text-muted-foreground">
                Bienvenido, {user?.fullName}. Aquí tienes el resumen de tu negocio.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => window.open(window.location.origin + publicUrl, '_blank')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Probar enlace de reservas</span>
              </Button>
              <Button 
                size="sm" 
                className="h-9"
                onClick={() => navigate("/services")}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Nuevo servicio</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Citas Totales
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalConfirmed} confirmadas
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
                  <div className="text-2xl font-bold">{totalRevenue}€</div>
                  <p className="text-xs text-muted-foreground">
                    De las citas confirmadas
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
                    Clientes
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalClients}</div>
                  <p className="text-xs text-muted-foreground">
                    Clientes únicos
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
                  <div className="text-2xl font-bold">
                    {totalBookings > 0 
                      ? Math.round((totalConfirmed / totalBookings) * 100) 
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recordatorios por WhatsApp activos
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto gap-1"
                    onClick={() => navigate("/appointments")}
                  >
                    <span className="hidden sm:inline-block">Ver todas</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingBookings ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-medium mb-1">No hay citas próximas</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comparte tu enlace de reservas con tus clientes para empezar a recibir citas.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(window.location.origin + publicUrl, '_blank')}
                      >
                        Ver página de reservas
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingBookings.map((appointment) => (
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
                                {appointment.clientName}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground gap-1">
                                <span>{appointment.serviceName}</span>
                                <span>•</span>
                                <span>{appointment.date}, {appointment.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate("/appointments")}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    onClick={() => navigate("/services")}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Añadir
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingServices ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-medium mb-1">No hay servicios configurados</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Añade los servicios que ofreces para que tus clientes puedan reservarlos.
                      </p>
                      <Button onClick={() => navigate("/services")}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Añadir Servicio
                      </Button>
                    </div>
                  ) : (
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
                      {services.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="w-full mt-2 text-primary"
                          onClick={() => navigate("/services")}
                        >
                          Ver todos los servicios
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* WhatsApp Integration Card */}
          {user?.twilioTokenConnected && (
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
                      WhatsApp conectado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tus clientes recibirán confirmaciones y recordatorios automáticos por WhatsApp.
                      Los recordatorios recurrentes están configurados para enviarse cada 6 semanas.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mr-3"
                      onClick={() => navigate("/connect-services")}
                    >
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
