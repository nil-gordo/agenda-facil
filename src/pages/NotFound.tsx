
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container py-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">AgendaFácil</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 relative">
            <div className="text-9xl font-bold text-primary/10">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3">Página no encontrada</h1>
          <p className="text-muted-foreground mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Volver a inicio
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
