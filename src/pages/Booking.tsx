
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ServiceCard from "@/components/ServiceCard";
import CalendarView from "@/components/CalendarView";
import AppointmentForm from "@/components/AppointmentForm";
import { ArrowLeft, Calendar, Check, Clock, MapPin, Star } from "lucide-react";

// Mock data
const businessData = {
  id: "peluqueria-ana",
  name: "Peluquería Ana",
  rating: 4.8,
  address: "Calle Gran Vía 25, Madrid",
  image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  description: "Peluquería especializada en cortes modernos, tintes y peinados para toda la familia. Ofrecemos servicios profesionales con más de 10 años de experiencia.",
};

const services = [
  { id: "1", name: "Corte de pelo", duration: 30, price: 20 },
  { id: "2", name: "Tinte", duration: 90, price: 45 },
  { id: "3", name: "Peinado", duration: 45, price: 30 },
  { id: "4", name: "Manicura", duration: 60, price: 25 },
];

const Booking = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<null | {
    id: string;
    name: string;
    duration: number;
    price: number;
  }>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Mock data transformation
  const business = businessData.id === businessId ? businessData : businessData;
  
  const today = new Date();
  const formattedDate = format(today, "d 'de' MMMM", { locale: es });

  const handleSelectService = (service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  }) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleSelectDateTime = () => {
    // In a real app, we would get these from the CalendarView component
    setSelectedDate(formattedDate);
    setSelectedTime("10:30");
    setStep(3);
  };

  const handleAppointmentSubmit = () => {
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium hidden sm:inline-block">AgendaFácil</span>
            </Link>
          </div>
          
          {/* Stepper */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className={`flex items-center justify-center h-6 w-6 text-xs rounded-full ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className={`h-0.5 w-6 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center h-6 w-6 text-xs rounded-full ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className={`h-0.5 w-6 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center h-6 w-6 text-xs rounded-full ${
                step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>
          
          <div className="text-sm">
            <Badge variant="outline" className="hidden sm:inline-flex">
              {business.name}
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6 px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Business Info */}
                <div className="mb-8">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h1 className="text-2xl font-bold mb-1">{business.name}</h1>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm">{business.rating}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {business.address}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{business.description}</p>
                </div>

                <h2 className="text-xl font-semibold mb-4">Selecciona un servicio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.id} onClick={() => handleSelectService(service)}>
                      <ServiceCard
                        id={service.id}
                        name={service.name}
                        duration={service.duration}
                        price={service.price}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && selectedService && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Selecciona fecha y hora</h2>
                
                <div className="mb-6">
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedService.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground gap-1">
                            <span>{selectedService.duration} min</span>
                            <span>•</span>
                            <span>{selectedService.price}€</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-auto md:flex-1">
                    <CalendarView />
                  </div>
                  
                  <div className="w-full md:w-auto mt-6 md:mt-0">
                    <Button className="w-full" onClick={handleSelectDateTime}>
                      Continuar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && selectedService && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Completa tus datos</h2>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <AppointmentForm
                      serviceName={selectedService.name}
                      price={selectedService.price}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSubmit={handleAppointmentSubmit}
                    />
                  </div>
                  
                  <div className="w-full md:w-1/2 mt-8 md:mt-0">
                    <div className="sticky top-24">
                      <h3 className="text-lg font-medium mb-4">Información del negocio</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={business.image}
                                alt={business.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{business.name}</h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {business.address}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Confirmación por WhatsApp</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Recordatorio 24h antes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Cancelación gratuita hasta 2h antes</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto text-center py-12"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Reserva confirmada!</h2>
              <p className="text-muted-foreground mb-8">
                Hemos enviado un mensaje de confirmación a tu WhatsApp con los detalles de tu cita.
              </p>
              
              <div className="bg-muted/40 rounded-lg p-6 mb-8">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Servicio</p>
                    <p className="font-medium">{selectedService?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha y hora</p>
                    <p className="font-medium">{selectedDate} a las {selectedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Negocio</p>
                    <p className="font-medium">{business.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline">Volver a inicio</Button>
                </Link>
                <Button onClick={() => window.location.reload()}>
                  Reservar otro servicio
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Booking;
