
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const MessagesPage = () => {
  return (
    <DashboardLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mensajes</h1>
            <p className="text-muted-foreground">
              Gestiona la comunicación con tus clientes por WhatsApp.
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Próximamente</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              La función de mensajería directa estará disponible en la próxima actualización. 
              Por ahora, puedes enviar mensajes a tus clientes desde la sección de clientes.
            </p>
            <Button asChild>
              <Link to="/clients">Ver clientes</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
