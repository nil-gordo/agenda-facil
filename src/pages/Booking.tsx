
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/services/api";
import { Service, TimeSlot } from "@/types";
import { CalendarDays, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Booking = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadBusinessData();
  }, [businessId]);

  useEffect(() => {
    if (businessId && selectedDate) {
      loadTimeSlots();
    }
  }, [businessId, selectedDate, selectedService]);

  const loadBusinessData = async () => {
    if (!businessId) {
      setError("ID de negocio no proporcionado");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("Looking for user with ID:", businessId);
      
      // Obtener usuarios para verificar si existe
      const users = localStorage.getItem("users");
      const parsedUsers = users ? JSON.parse(users) : [];
      const currentUser = parsedUsers.find((user: any) => user.id === businessId);
      
      if (!currentUser) {
        console.error("No se encontró el usuario con ID:", businessId);
        setError("No se encontraron usuarios en el sistema");
        setLoading(false);
        return;
      }
      
      // Establecer el nombre del negocio
      setBusinessName(currentUser.businessName || "Negocio");
      
      // Cargar servicios
      const response = await api.getServices(businessId);
      if (response.success && response.data) {
        if (response.data.length === 0) {
          setError("Este negocio aún no ha configurado sus servicios");
        } else {
          setServices(response.data);
          // Preseleccionar el primer servicio
          setSelectedService(response.data[0].id);
        }
      } else {
        setError("Error al cargar los servicios");
      }
    } catch (error) {
      console.error("Error loading business data:", error);
      setError("Error al cargar los datos del negocio");
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    if (!businessId || !selectedDate) return;

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await api.getAvailableSlots(businessId, formattedDate);
      
      if (response.success && response.data) {
        setTimeSlots(response.data);
      } else {
        toast.error("Error al cargar horarios disponibles");
      }
    } catch (error) {
      console.error("Error loading time slots:", error);
      toast.error("Error al cargar horarios disponibles");
    }
  };

  const handleSubmit = async () => {
    if (!businessId || !selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setSubmitting(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      const booking = {
        userId: businessId,
        serviceId: selectedService,
        date: formattedDate,
        time: selectedTime,
        clientName,
        clientPhone
      };
      
      const response = await api.createBooking(booking);
      
      if (response.success) {
        setSubmitted(true);
        toast.success("¡Reserva confirmada!");
      } else {
        toast.error(response.error || "Error al crear la reserva");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error al crear la reserva");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error
            </CardTitle>
            <CardDescription>
              No se pudo cargar la página de reservas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Lo sentimos</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full">
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="bg-green-50 text-green-800">
              <CardTitle className="text-center">¡Reserva Confirmada!</CardTitle>
              <CardDescription className="text-center text-green-700">
                Tu reserva ha sido registrada exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Detalles de la reserva:</h3>
                  <p className="font-medium">{services.find(s => s.id === selectedService)?.name}</p>
                  <p className="text-muted-foreground">{businessName}</p>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha</h3>
                    <p className="font-medium">
                      {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Hora</h3>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg text-sm text-center">
                  <p>Te enviaremos un recordatorio antes de tu cita.</p>
                  <p className="mt-1">¡Gracias por reservar con nosotros!</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button 
                onClick={() => window.location.href = "/"} 
                variant="outline" 
                className="w-full max-w-xs"
              >
                Volver al inicio
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle>{businessName}</CardTitle>
            <CardDescription>Reserva tu cita</CardDescription>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <Tabs defaultValue="service" className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="service" className="flex-1">Servicio</TabsTrigger>
                  <TabsTrigger value="datetime" className="flex-1">Fecha y Hora</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Tus Datos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="service" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Selecciona un servicio</h3>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex justify-between items-center gap-4">
                              <span>{service.name}</span>
                              <span className="text-muted-foreground">{service.price}€</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedService && (
                      <div className="mt-4 p-4 bg-background rounded-lg border">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {services.find(s => s.id === selectedService)?.name}
                          </span>
                          <span>
                            {services.find(s => s.id === selectedService)?.price}€
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Duración: {services.find(s => s.id === selectedService)?.duration} min
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="datetime" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Selecciona una fecha
                    </h3>
                    <div className="border rounded-md">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={{ before: new Date() }}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Selecciona una hora
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            className={`${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      placeholder="Tu nombre completo"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      placeholder="Tu número de teléfono"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone || submitting}
                      className="w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Confirmar Reserva"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay servicios disponibles</h3>
                <p className="text-muted-foreground mb-4">
                  Este negocio aún no ha configurado sus servicios.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Booking;
