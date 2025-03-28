
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
import ClientList from "./pages/ClientList";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

// Initialize localStorage with demo data if not exists
if (!localStorage.getItem("users")) {
  // Create a demo user that will always exist
  const demoUser = {
    id: "user_demo",
    email: "demo@example.com",
    businessName: "Demo Business",
    fullName: "Demo User",
    googleCalendarConnected: false,
    twilioTokenConnected: false
  };
  
  localStorage.setItem("users", JSON.stringify([demoUser]));
  
  // Also initialize empty services for the demo user
  localStorage.setItem("services", JSON.stringify({
    "user_demo": [{
      id: "service_demo",
      name: "Demo Service",
      duration: 60,
      price: 50,
      enablePayment: false
    }]
  }));
}

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
              {/* Important: Always place the booking route before protected routes */}
              <Route path="/booking/:businessId" element={<Booking />} />
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
              <Route 
                path="/clients" 
                element={
                  <RequireAuth>
                    <ClientList />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <RequireAuth>
                    <MessagesPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <SettingsPage />
                  </RequireAuth>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
