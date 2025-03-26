
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Sparkles, Smartphone } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-24 md:pt-32 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-70" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary-foreground bg-primary rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Diseñado para PYMEs españolas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Simplifica la gestión de citas para tu negocio
            </h1>
            <p className="text-lg text-muted-foreground mb-8 md:text-xl max-w-xl mx-auto lg:mx-0">
              AgendaFácil permite a las PYMEs gestionar citas automáticamente, enviar confirmaciones y recordatorios por WhatsApp, y ahorrar tiempo valioso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Empieza gratis
                </Button>
              </Link>
              <Link to="/#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Conoce más
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Calendar Preview */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              {/* Calendar UI */}
              <div className="glass-morphism rounded-2xl overflow-hidden shadow-xl">
                {/* Calendar Header */}
                <div className="bg-primary px-6 py-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <h3 className="font-medium">Peluquería Ana</h3>
                    </div>
                    <p className="text-sm">Mayo 2025</p>
                  </div>
                </div>

                {/* Calendar Body */}
                <div className="bg-white p-6">
                  {/* Weekdays */}
                  <div className="grid grid-cols-7 mb-4">
                    {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
                      <div key={i} className="text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isAvailable = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29].includes(day);
                      const isSelected = day === 15;
                      return (
                        <div
                          key={i}
                          className={`rounded-full h-10 w-10 flex items-center justify-center text-sm
                            ${isSelected ? "bg-primary text-white" : isAvailable ? "cursor-pointer hover:bg-muted" : "text-muted-foreground/50"}`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium mb-3">Horarios disponibles - 15 Mayo</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["9:00", "10:30", "12:00", "16:00", "17:30", "19:00"].map((time, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-2 text-center text-sm border ${
                            i === 1 ? "bg-primary text-white border-primary" : "border-muted hover:border-primary cursor-pointer"
                          }`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Notification Preview */}
              <div className="absolute -bottom-10 -right-8 glass-morphism p-4 rounded-xl max-w-[220px] shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-[#25D366] p-2 rounded-full">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Confirmación WhatsApp</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tu cita está confirmada para el 15 de mayo a las 10:30.
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Saved Indicator */}
              <div className="absolute -top-5 -left-5 glass-morphism p-3 rounded-xl shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="bg-accent/20 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-xs font-medium">Ahorra 5h/semana</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
