
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Service } from "@/types";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Link as LinkIcon, Copy, ArrowRight } from "lucide-react";

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "El nombre del servicio debe tener al menos 2 caracteres.",
  }),
  duration: z.coerce.number().min(5, {
    message: "La duración debe ser al menos 5 minutos.",
  }),
  price: z.coerce.number().min(0, {
    message: "El precio no puede ser negativo.",
  }),
  enablePayment: z.boolean().default(false),
});

const ServiceSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [reminderWeeks, setReminderWeeks] = useState<number>(6);

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      duration: 30,
      price: 0,
      enablePayment: false,
    },
  });

  useEffect(() => {
    if (user?.id) {
      loadServices();
      loadPublicUrl();
    }
  }, [user?.id]);

  const loadServices = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await api.getServices(user.id);
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Error al cargar los servicios");
    } finally {
      setLoading(false);
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

  const handleEditService = (service: Service) => {
    setEditingService(service);
    form.reset({
      id: service.id,
      name: service.name,
      duration: service.duration,
      price: service.price,
      enablePayment: service.enablePayment,
    });
    setOpenDialog(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    form.reset({
      name: "",
      duration: 30,
      price: 0,
      enablePayment: false,
    });
    setOpenDialog(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!user?.id) return;
    
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      try {
        const response = await api.deleteService(user.id, serviceId);
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
    }
  };

  const onSubmit = async (values: z.infer<typeof serviceSchema>) => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const response = await api.saveService(user.id, values);
      if (response.success) {
        toast.success("Servicio guardado correctamente");
        loadServices();
        setOpenDialog(false);
      } else {
        toast.error(response.error || "Error al guardar servicio");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Error al guardar servicio");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${publicUrl}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success("URL copiada al portapapeles");
    });
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Configuración de Servicios</h1>
            <p className="text-muted-foreground">
              Configura los servicios que ofreces a tus clientes.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Panel de enlace público */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  Tu enlace para reservas
                </CardTitle>
                <CardDescription>
                  Comparte este enlace con tus clientes para que puedan reservar citas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="bg-background border rounded-md px-4 py-2 flex-1 text-muted-foreground overflow-hidden text-ellipsis">
                    <span id="public-url">{window.location.origin}{publicUrl}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Panel de recordatorios recurrentes */}
            <Card>
              <CardHeader>
                <CardTitle>Recordatorios recurrentes</CardTitle>
                <CardDescription>
                  Configura cada cuánto tiempo se envía un recordatorio a tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <Label htmlFor="reminder-weeks">Intervalo en semanas</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="reminder-weeks"
                        type="number"
                        min="1"
                        max="52"
                        value={reminderWeeks}
                        onChange={(e) => setReminderWeeks(Number(e.target.value))}
                        className="max-w-[100px]"
                      />
                      <span className="text-muted-foreground">semanas</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground max-w-xs">
                    Envía recordatorios automáticos a tus clientes después de cada cita
                    para fidelizarlos y aumentar las reservas recurrentes.
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Por ejemplo, si eliges 6 semanas para una peluquería, tus clientes recibirán
                  un mensaje 6 semanas después de su corte.
                </div>
              </CardFooter>
            </Card>

            {/* Listado de Servicios */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Tus Servicios</CardTitle>
                  <CardDescription>
                    Añade y configura los servicios que ofreces
                  </CardDescription>
                </div>
                <Button onClick={handleAddService}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Servicio
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : services.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No tienes servicios configurados todavía
                    </p>
                    <Button onClick={handleAddService}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir tu primer servicio
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div 
                        key={service.id} 
                        className="border rounded-lg p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <span>{service.duration} min</span>
                            <span className="mx-2">•</span>
                            <span>{service.price}€</span>
                            {service.enablePayment && (
                              <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                Pago habilitado
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleContinue} disabled={services.length === 0}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Diálogo para añadir/editar servicios */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Editar servicio" : "Añadir nuevo servicio"}
                </DialogTitle>
                <DialogDescription>
                  Configura los detalles del servicio que ofreces a tus clientes.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del servicio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Corte de pelo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duración (minutos)</FormLabel>
                          <FormControl>
                            <Input type="number" min="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio (€)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="enablePayment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Habilitar pago online
                          </FormLabel>
                          <FormDescription>
                            Permite a tus clientes pagar al momento de reservar.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar servicio"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceSettings;
