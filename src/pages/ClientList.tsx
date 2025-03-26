
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Booking, Client } from "@/types";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  Search,
  Phone,
  User as UserIcon,
  MessageSquare,
  Loader2,
} from "lucide-react";

const ClientList = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Cargar las reservas
      const bookingsResponse = await api.getBookings(user.id);
      if (bookingsResponse.success && bookingsResponse.data) {
        setBookings(bookingsResponse.data);
        
        // Generar lista de clientes únicos basados en las reservas
        const uniqueClients: Record<string, Client> = {};
        
        bookingsResponse.data.forEach(booking => {
          if (!uniqueClients[booking.clientPhone]) {
            uniqueClients[booking.clientPhone] = {
              id: `client_${Date.now()}_${Math.round(Math.random() * 1000)}`,
              name: booking.clientName,
              phone: booking.clientPhone,
              totalBookings: 1,
              lastVisit: booking.date,
              userId: user.id
            };
          } else {
            uniqueClients[booking.clientPhone].totalBookings += 1;
            
            // Actualizar última visita si es más reciente
            const currentLastVisit = uniqueClients[booking.clientPhone].lastVisit || "";
            if (booking.date > currentLastVisit) {
              uniqueClients[booking.clientPhone].lastVisit = booking.date;
            }
          }
        });
        
        setClients(Object.values(uniqueClients));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const sendMessage = (phone: string) => {
    // Aquí se implementaría la función para enviar un mensaje directo
    // En un MVP, simplemente abrimos WhatsApp con el número
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Abriendo WhatsApp");
  };

  return (
    <DashboardLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Clientes</h1>
              <p className="text-muted-foreground">
                Gestiona tu base de clientes y comunícate directamente con ellos.
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar clientes por nombre o teléfono..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">
                    {searchTerm ? "No se encontraron clientes" : "Aún no tienes clientes"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm 
                      ? "Intenta con otro término de búsqueda" 
                      : "Tus clientes aparecerán aquí cuando realicen reservas"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{client.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-4">
                          <div className="text-sm font-medium">{client.totalBookings} citas</div>
                          {client.lastVisit && (
                            <div className="text-xs text-muted-foreground">
                              Última: {client.lastVisit}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-green-600"
                          onClick={() => sendMessage(client.phone)}
                          title="Enviar mensaje"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ClientList;
