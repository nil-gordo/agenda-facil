
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-medium">AgendaFácil</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              La forma más sencilla de gestionar citas para PYMEs en España.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AgendaFácil. <br />
              Todos los derechos reservados.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Producto</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Guías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Trabaja con nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
