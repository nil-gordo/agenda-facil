
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  BarChart, 
  BellRing, 
  Smartphone, 
  RefreshCw,
  Globe
} from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "Agenda Online",
    description: "Permite a tus clientes reservar citas 24/7 desde cualquier dispositivo."
  },
  {
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    title: "Notificaciones WhatsApp",
    description: "Envía confirmaciones y recordatorios automáticos por WhatsApp para reducir ausencias."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Pagos Integrados",
    description: "Cobra por adelantado con Stripe, PayPal o Bizum para asegurar las reservas."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Ahorro de Tiempo",
    description: "Automatiza la gestión de citas y reduce llamadas telefónicas innecesarias."
  },
  {
    icon: <BellRing className="h-6 w-6 text-primary" />,
    title: "Recordatorios Recurrentes",
    description: "Configura recordatorios personalizados para fidelizar a tus clientes."
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-primary" />,
    title: "Sincronización Calendar",
    description: "Mantén tu Google Calendar actualizado automáticamente con cada cita."
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Enlace Personalizado",
    description: "Comparte un enlace único para tu negocio en redes sociales o WhatsApp."
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: "Estadísticas Sencillas",
    description: "Visualiza la ocupación, ingresos y tasa de asistencia de forma clara."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Todo lo que necesitas para gestionar tus citas
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            AgendaFácil está diseñado específicamente para las necesidades de los pequeños negocios en España.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-border hover-scale"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
