
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Calendar as GoogleIcon, AlertCircle, MessageSquare, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ConnectServices = () => {
  const navigate = useNavigate();
  const { user, connectGoogleCalendar, connectTwilio } = useAuth();
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioLoading, setTwilioLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleConnect = async () => {
    setGoogleLoading(true);
    // En un caso real, abriríamos una ventana para autenticación OAuth
    // Aquí lo simulamos con un timeout
    const success = await connectGoogleCalendar();
    setGoogleLoading(false);
  };

  const handleTwilioConnect = async () => {
    if (!twilioToken.trim()) {
      toast.error("Por favor, introduce un token de Twilio válido");
      return;
    }

    setTwilioLoading(true);
    const success = await connectTwilio(twilioToken);
    setTwilioLoading(false);
  };

  const handleContinue = () => {
    navigate("/services");
  };

  const isReadyToContinue = user?.googleCalendarConnected && user?.twilioTokenConnected;

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <header className="border-b bg-background">
        <div className="container py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">AgendaFácil</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Conecta tus servicios</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Para aprovechar al máximo AgendaFácil, conecta tu Google Calendar y configura WhatsApp
              para enviar notificaciones a tus clientes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GoogleIcon className="h-5 w-5 text-primary" />
                  Google Calendar
                </CardTitle>
                <CardDescription>
                  Conecta tu cuenta de Google Calendar para sincronizar tus citas automáticamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.googleCalendarConnected ? (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Conectado</AlertTitle>
                    <AlertDescription>
                      Tu cuenta de Google Calendar está conectada correctamente.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="text-sm text-muted-foreground mb-4">
                    Al conectar Google Calendar, podrás:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Ver todas tus citas en un solo lugar</li>
                      <li>Evitar conflictos de horarios</li>
                      <li>Sincronizar en tiempo real</li>
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {user?.googleCalendarConnected ? (
                  <Button variant="outline" disabled className="w-full">
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Conectado
                    </div>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleGoogleConnect} 
                    className="w-full"
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        Conectar Google Calendar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  WhatsApp API (Twilio)
                </CardTitle>
                <CardDescription>
                  Configura WhatsApp para enviar recordatorios y confirmaciones automáticas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.twilioTokenConnected ? (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Conectado</AlertTitle>
                    <AlertDescription>
                      Tu cuenta de Twilio para WhatsApp está conectada correctamente.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Introduce tu token de Twilio para habilitar las notificaciones por WhatsApp:
                    </div>
                    <Input
                      placeholder="Pega tu token de Twilio aquí"
                      value={twilioToken}
                      onChange={(e) => setTwilioToken(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      <p className="mb-2">¿No tienes un token de Twilio?</p>
                      <p>1. <a href="https://www.twilio.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Regístrate en Twilio</a></p>
                      <p>2. Activa WhatsApp Business API</p>
                      <p>3. Copia el token de autenticación</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {user?.twilioTokenConnected ? (
                  <Button variant="outline" disabled className="w-full">
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Conectado
                    </div>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleTwilioConnect} 
                    variant="default" 
                    className="w-full"
                    disabled={twilioLoading || !twilioToken.trim()}
                  >
                    {twilioLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        Conectar WhatsApp
                        <MessageSquare className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!isReadyToContinue}
              className="min-w-[200px]"
            >
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {!isReadyToContinue && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Conecta ambos servicios para continuar
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ConnectServices;
