
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon } from "lucide-react";
import { api } from "@/services/api";
import { Service, TimeSlot, User } from "@/types";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  clientName: z.string().min(2, {
    message: "Por favor, introduce tu nombre (mínimo 2 caracteres).",
  }),
  clientPhone: z.string().min(9, {
    message: "Por favor, introduce un número de teléfono válido.",
  }),
  serviceId: z.string({
    required_error: "Por favor, selecciona un servicio.",
  }),
  date: z.date({
    required_error: "Por favor, selecciona una fecha.",
  }),
  time: z.string({
    required_error: "Por favor, selecciona una hora.",
  }),
});

const Booking = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      serviceId: "",
      time: "",
    },
  });
  
  // Observar cambios en el campo de fecha
  const selectedDateValue = form.watch("date");

  useEffect(() => {
    if (businessId) {
      loadBusinessData();
    }
  }, [businessId]);

  useEffect(() => {
    if (selectedDateValue && businessId) {
      loadTimeSlots(format(selectedDateValue, 'yyyy-MM-dd'));
    }
  }, [selectedDateValue, businessId]);

  const loadBusinessData = async () => {
    setLoading(true);
    try {
      // En una implementación real, cargaríamos los datos del negocio
      // Aquí simulamos obtenerlos del localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentBusiness = users.find((u: User) => u.id === businessId);
      
      if (currentBusiness) {
        setBusiness(currentBusiness);
        
        // Cargamos los servicios
        const response = await api.getServices(businessId);
        if (response.success && response.data) {
          setServices(response.data);
        }
      } else {
        toast.error("Negocio no encontrado");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading business data:", error);
      toast.error("Error al cargar datos del negocio");
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async (dateString: string) => {
    if (!businessId) return;
    
    try {
      const response = await api.getAvailableSlots(businessId, dateString);
      if (response.success && response.data) {
        setTimeSlots(response.data);
        
        // Si hay un horario seleccionado y ya no está disponible, lo reseteamos
        const currentTime = form.getValues("time");
        if (currentTime) {
          const isCurrentTimeAvailable = response.data.some(
            slot => slot.time === currentTime && slot.available
          );
          if (!isCurrentTimeAvailable) {
            form.setValue("time", "");
          }
        }
      }
    } catch (error) {
      console.error("Error loading time slots:", error);
      toast.error("Error al cargar horarios disponibles");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!businessId) return;
    
    setSubmitting(true);
    try {
      // Preparamos los datos para la reserva
      const booking = {
        userId: businessId,
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        serviceId: values.serviceId,
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time
      };
      
      // Enviamos la reserva
      const response = await api.createBooking(booking);
      
      if (response.success) {
        setBookingSuccess(true);
        toast.success("Reserva confirmada", {
          description: "Te llegará un mensaje de confirmación por WhatsApp."
        });
        
        // Reseteamos el formulario
        form.reset();
        setSelectedDate(null);
      } else {
        toast.error(response.error || "Error al realizar la reserva");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error al realizar la reserva");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", date);
      form.setValue("time", "");
      setSelectedDate(date);
    }
  };

  // Determinar si el día está deshabilitado (fines de semana o fechas pasadas)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Buscar el servicio seleccionado
  const selectedService = services.find(s => s.id === form.getValues("serviceId"));

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <header className="border-b bg-background">
        <div className="container py-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">AgendaFácil</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl py-12 px-4">
        {loading ? (
          <div className="flex items-center justify-center h-full py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : bookingSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Reserva Completada!</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tu cita ha sido confirmada. Recibirás un mensaje de WhatsApp con los detalles de tu reserva.
            </p>
            <div className="space-x-3">
              <Button onClick={() => setBookingSuccess(false)}>
                Hacer otra reserva
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Volver al inicio
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">
                Reserva tu cita en {business?.businessName}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Elige un servicio, fecha y hora para tu cita. Recibirás confirmación por WhatsApp.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono (WhatsApp)</FormLabel>
                          <FormControl>
                            <Input placeholder="655555555" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Servicio</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name} - {service.duration} min. ({service.price}€)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Selecciona una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                              <CalendarComp
                                mode="single"
                                selected={field.value}
                                onSelect={handleDateSelect}
                                disabled={isDateDisabled}
                                locale={es}
                                className={cn("border-none pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedDate && (
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora</FormLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1.5">
                              {timeSlots.map((slot, i) => (
                                <Button
                                  key={i}
                                  type="button"
                                  variant={field.value === slot.time ? "default" : "outline"}
                                  className={cn(
                                    "py-1.5",
                                    !slot.available && "opacity-50 cursor-not-allowed"
                                  )}
                                  disabled={!slot.available || submitting}
                                  onClick={() => field.onChange(slot.time)}
                                >
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={submitting || !selectedService}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2" />
                          Reservando...
                        </>
                      ) : (
                        `Reservar ${selectedService ? `(${selectedService.price}€)` : ``}`
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="order-first md:order-last">
                <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-20">
                  <h2 className="text-xl font-semibold mb-4">Servicios disponibles</h2>
                  
                  {services.length === 0 ? (
                    <p className="text-muted-foreground">
                      No hay servicios disponibles en este momento.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div 
                          key={service.id}
                          className={cn(
                            "p-4 rounded-lg border transition-colors",
                            form.getValues("serviceId") === service.id 
                              ? "border-primary bg-primary/5" 
                              : "hover:bg-muted/50 cursor-pointer"
                          )}
                          onClick={() => form.setValue("serviceId", service.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{service.name}</h3>
                            <span className="font-medium">{service.price}€</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Duración: {service.duration} minutos
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t">
                    <h3 className="font-medium mb-2">Información de contacto</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {business?.businessName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Confirmación por WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AgendaFácil</p>
        </div>
      </footer>
    </div>
  );
};

export default Booking;
