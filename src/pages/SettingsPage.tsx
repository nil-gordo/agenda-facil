
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Configuración</h1>
            <p className="text-muted-foreground">
              Gestiona la configuración de tu cuenta y servicios.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ajustes de Cuenta</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Por ahora, puedes configurar tus servicios desde la sección de servicios
                y gestionar tus integraciones desde la sección de conexiones.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/services">Configurar Servicios</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/connect-services">Gestionar Conexiones</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
