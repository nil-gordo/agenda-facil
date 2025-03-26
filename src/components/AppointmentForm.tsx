
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight, Calendar, Check, Smartphone } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre es obligatorio" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(9, { message: "Número de teléfono inválido" }),
  notes: z.string().optional(),
  whatsappNotifications: z.boolean().default(true),
});

interface AppointmentFormProps {
  serviceName: string;
  price: number;
  selectedDate: string;
  selectedTime: string;
  onSubmit: () => void;
}

const AppointmentForm = ({
  serviceName,
  price,
  selectedDate,
  selectedTime,
  onSubmit,
}: AppointmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
      whatsappNotifications: true,
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log(values);
      toast.success("Cita reservada con éxito", {
        description: "Recibirás un mensaje de confirmación en tu WhatsApp",
      });
      setIsSubmitting(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-3">Resumen de la reserva</h3>
        <div className="flex items-start gap-3 mb-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">{serviceName}</p>
            <p className="text-sm text-muted-foreground">
              {selectedDate} - {selectedTime}
            </p>
            <p className="text-sm font-medium mt-1">{price}€</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono móvil</FormLabel>
                <FormControl>
                  <Input placeholder="612 345 678" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas adicionales (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Información adicional para tu cita"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsappNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-primary" />
                    Recordatorios por WhatsApp
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Recibirás confirmación y recordatorio de tu cita
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              "Reservando..."
            ) : (
              <>
                Confirmar reserva <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Check className="h-4 w-4 text-primary" />
        <span>Pago seguro con Stripe, PayPal y Bizum</span>
      </div>
    </div>
  );
};

export default AppointmentForm;
