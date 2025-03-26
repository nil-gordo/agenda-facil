
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Booking } from "@/types";
import { api } from "@/services/api";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarDays, ChevronRight, Clock, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const AppointmentList = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user?.id) {
      loadBookings();
      
      // Configurar polling para actualizar las citas cada 30 segundos
      const intervalId = setInterval(loadBookings, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [user?.id]);

  const loadBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await api.getBookings(user.id);
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        toast.error(response.error || "Error al cargar las citas");
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!user?.id || !cancelBookingId) return;
    
    setIsCancelling(true);
    try {
      const response = await api.cancelBooking(user.id, cancelBookingId);
      if (response.success) {
        toast.success("Cita cancelada correctamente");
        loadBookings();
      } else {
        toast.error(response.error || "Error al cancelar la cita");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error al cancelar la cita");
    } finally {
      setIsCancelling(false);
      setCancelBookingId(null);
    }
  };

  // Filtrar citas según el término de búsqueda
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "confirmed") return matchesSearch && booking.status === "confirmed";
    if (activeTab === "pending") return matchesSearch && booking.status === "pending";
    if (activeTab === "cancelled") return matchesSearch && booking.status === "cancelled";
    
    return matchesSearch;
  });

  // Agrupar citas por fecha
  const groupedBookings: { [key: string]: Booking[] } = {};
  filteredBookings.forEach(booking => {
    if (!groupedBookings[booking.date]) {
      groupedBookings[booking.date] = [];
    }
    groupedBookings[booking.date].push(booking);
  });

  // Ordenar fechas (más recientes primero)
  const sortedDates = Object.keys(groupedBookings).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gestión de Citas</h1>
            <p className="text-muted-foreground">
              Visualiza y gestiona todas las citas reservadas por tus clientes.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Citas</CardTitle>
                  <CardDescription>
                    Todas las citas de tu negocio
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar citas..."
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" onClick={loadBookings}>
                    Actualizar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
                  <TabsTrigger value="pending">Pendientes</TabsTrigger>
                  <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {loading ? (
                    <div className="py-12 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Cargando citas...</span>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <CalendarDays className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No hay citas</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchTerm 
                          ? "No se encontraron citas que coincidan con tu búsqueda"
                          : activeTab !== "all"
                            ? `No tienes citas ${activeTab === "confirmed" ? "confirmadas" : activeTab === "pending" ? "pendientes" : "canceladas"}`
                            : "No tienes citas programadas todavía"
                        }
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchTerm("")}
                        >
                          Limpiar búsqueda
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sortedDates.map(date => (
                        <div key={date} className="space-y-3">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {formatDate(date)}
                          </h3>
                          <div className="space-y-2">
                            {groupedBookings[date].map(booking => (
                              <div 
                                key={booking.id}
                                className={`flex items-center justify-between space-x-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors ${
                                  booking.status === "cancelled" ? "opacity-60" : ""
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="rounded-full p-1.5 bg-primary/10">
                                    <Clock className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium leading-none">
                                        {booking.clientName}
                                      </p>
                                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeClass(booking.status)}`}>
                                        {getStatusText(booking.status)}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                                      <span>{booking.serviceName}</span>
                                      <span>•</span>
                                      <span>{booking.time}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {booking.status !== "cancelled" && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <ChevronRight className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                              onSelect={(e) => {
                                                e.preventDefault();
                                                setCancelBookingId(booking.id);
                                              }}
                                              className="text-destructive focus:text-destructive"
                                            >
                                              Cancelar cita
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                ¿Cancelar esta cita?
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Esta acción no se puede deshacer. La cita será cancelada
                                                y se notificará al cliente.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={handleCancelBooking}
                                                disabled={isCancelling}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                              >
                                                {isCancelling ? (
                                                  <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Cancelando...
                                                  </>
                                                ) : (
                                                  "Confirmar"
                                                )}
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentList;
