
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import ConnectServices from "./pages/ConnectServices";
import ServiceSettings from "./pages/ServiceSettings";
import AppointmentList from "./pages/AppointmentList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/connect-services" 
                element={
                  <RequireAuth>
                    <ConnectServices />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <RequireAuth>
                    <ServiceSettings />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/appointments" 
                element={
                  <RequireAuth>
                    <AppointmentList />
                  </RequireAuth>
                } 
              />
              <Route path="/booking/:businessId" element={<Booking />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
