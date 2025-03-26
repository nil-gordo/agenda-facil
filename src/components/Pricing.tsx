
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  const plans = [
    {
      name: "Básico",
      description: "Perfecto para autónomos y negocios pequeños",
      price: isAnnual ? "12" : "15",
      features: [
        "Enlace de reserva personalizado",
        "Hasta 2 servicios configurables",
        "Confirmaciones por WhatsApp",
        "Recordatorios 24h antes",
        "Integración con Google Calendar",
        "Estadísticas básicas",
        "Hasta 100 citas mensuales"
      ],
      popular: false,
      buttonText: "Empezar ahora",
      buttonVariant: "outline"
    },
    {
      name: "Premium",
      description: "Ideal para negocios en crecimiento",
      price: isAnnual ? "20" : "25",
      features: [
        "Todo lo del plan Básico",
        "Servicios ilimitados",
        "Integración de pagos (Stripe/PayPal)",
        "Recordatorios recurrentes",
        "Personalización de mensajes",
        "Integración con Bizum",
        "Citas ilimitadas",
        "Soporte prioritario"
      ],
      popular: true,
      buttonText: "Probar 14 días gratis",
      buttonVariant: "default"
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Precios sencillos y transparentes
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Sin sorpresas ni costes ocultos. Elige el plan que mejor se adapte a tu negocio.
          </motion.p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${!isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isAnnual ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Anual <span className="text-xs text-primary font-medium">(20% dto.)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-xl bg-white border ${
                plan.popular
                  ? "border-primary shadow-lg relative"
                  : "border-border shadow-sm"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-medium py-1.5 px-3 rounded-full">
                    Más popular
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-1.5">{plan.description}</p>
                
                <div className="mt-5 mb-6">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground ml-1">
                    /mes {isAnnual && "(facturado anualmente)"}
                  </span>
                </div>
                
                <Link to="/register">
                  <Button 
                    variant={plan.buttonVariant as "default" | "outline"} 
                    className="w-full mb-6"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
