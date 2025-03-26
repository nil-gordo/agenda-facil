import { User, Service, Booking, TimeSlot, ApiResponse, Client } from "@/types";

// Simulación de localStorage para persistencia de datos
const getLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return null;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Simulación de API para conectar con n8n
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      console.log("Login attempt with:", email);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificamos si el usuario existe en localStorage
      const users = getLocalStorage<User[]>("users") || [];
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return { success: false, error: "Usuario no encontrado" };
      }
      
      // En un caso real, verificaríamos la contraseña con hash
      // Simulamos que guardamos el usuario actual en el localStorage
      setLocalStorage("currentUser", user);
      
      return { success: true, data: user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error al iniciar sesión" };
    }
  },
  
  register: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      console.log("Register attempt with:", userData);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificamos si el usuario ya existe
      const users = getLocalStorage<User[]>("users") || [];
      if (users.some(u => u.email === userData.email)) {
        return { success: false, error: "El email ya está en uso" };
      }
      
      // Creamos un nuevo usuario
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email || "",
        businessName: userData.businessName || "",
        fullName: userData.fullName || "",
        googleCalendarConnected: false,
        twilioTokenConnected: false,
      };
      
      // Guardamos el usuario
      users.push(newUser);
      setLocalStorage("users", users);
      setLocalStorage("currentUser", newUser);
      
      return { success: true, data: newUser };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Error al registrar usuario" };
    }
  },
  
  logout: async (): Promise<ApiResponse<null>> => {
    localStorage.removeItem("currentUser");
    return { success: true };
  },
  
  // Conexión con Google Calendar (simulado)
  connectGoogleCalendar: async (): Promise<ApiResponse<User>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizamos el usuario actual
      const currentUser = getLocalStorage<User>("currentUser");
      if (!currentUser) {
        return { success: false, error: "Usuario no encontrado" };
      }
      
      const updatedUser = { ...currentUser, googleCalendarConnected: true };
      
      // Actualizamos el localStorage
      setLocalStorage("currentUser", updatedUser);
      
      // También actualizamos en la lista de usuarios
      const users = getLocalStorage<User[]>("users") || [];
      const updatedUsers = users.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      );
      setLocalStorage("users", updatedUsers);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("Connect Google Calendar error:", error);
      return { success: false, error: "Error al conectar con Google Calendar" };
    }
  },
  
  // Conexión con Twilio (simulado)
  connectTwilio: async (token: string): Promise<ApiResponse<User>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validamos el token (simulado)
      if (!token || token.length < 10) {
        return { success: false, error: "Token de Twilio inválido" };
      }
      
      // Actualizamos el usuario actual
      const currentUser = getLocalStorage<User>("currentUser");
      if (!currentUser) {
        return { success: false, error: "Usuario no encontrado" };
      }
      
      const updatedUser = { 
        ...currentUser, 
        twilioTokenConnected: true,
        twilioToken: token
      };
      
      // Actualizamos el localStorage
      setLocalStorage("currentUser", updatedUser);
      
      // También actualizamos en la lista de usuarios
      const users = getLocalStorage<User[]>("users") || [];
      const updatedUsers = users.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      );
      setLocalStorage("users", updatedUsers);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("Connect Twilio error:", error);
      return { success: false, error: "Error al conectar con Twilio" };
    }
  },
  
  // Servicios
  getServices: async (userId: string): Promise<ApiResponse<Service[]>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtenemos los servicios del usuario
      const allServices = getLocalStorage<Record<string, Service[]>>("services") || {};
      const userServices = allServices[userId] || [];
      
      return { success: true, data: userServices };
    } catch (error) {
      console.error("Get services error:", error);
      return { success: false, error: "Error al obtener servicios" };
    }
  },
  
  saveService: async (userId: string, service: Partial<Service>): Promise<ApiResponse<Service>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Obtenemos los servicios existentes
      const allServices = getLocalStorage<Record<string, Service[]>>("services") || {};
      const userServices = allServices[userId] || [];
      
      // Creamos o actualizamos el servicio
      let updatedService: Service;
      
      if (service.id) {
        // Actualizar servicio existente
        updatedService = {
          ...userServices.find(s => s.id === service.id) as Service,
          ...service
        } as Service;
        
        // Actualizamos la lista de servicios
        const updatedServices = userServices.map(s => 
          s.id === service.id ? updatedService : s
        );
        
        allServices[userId] = updatedServices;
      } else {
        // Crear nuevo servicio
        updatedService = {
          id: `service_${Date.now()}`,
          name: service.name || "",
          duration: service.duration || 30,
          price: service.price || 0,
          enablePayment: service.enablePayment || false
        };
        
        allServices[userId] = [...userServices, updatedService];
      }
      
      // Guardamos en localStorage
      setLocalStorage("services", allServices);
      
      // Simulamos envío a n8n
      console.log("POST to http://tun8n.com/webhook/config", {
        userId,
        services: allServices[userId],
        reminderWeeks: 6 // Valor por defecto
      });
      
      return { success: true, data: updatedService };
    } catch (error) {
      console.error("Save service error:", error);
      return { success: false, error: "Error al guardar servicio" };
    }
  },
  
  deleteService: async (userId: string, serviceId: string): Promise<ApiResponse<boolean>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtenemos los servicios existentes
      const allServices = getLocalStorage<Record<string, Service[]>>("services") || {};
      const userServices = allServices[userId] || [];
      
      // Filtramos el servicio a eliminar
      allServices[userId] = userServices.filter(s => s.id !== serviceId);
      
      // Guardamos en localStorage
      setLocalStorage("services", allServices);
      
      // Simulamos envío a n8n
      console.log("POST to http://tun8n.com/webhook/config", {
        userId,
        services: allServices[userId],
        reminderWeeks: 6 // Valor por defecto
      });
      
      return { success: true, data: true };
    } catch (error) {
      console.error("Delete service error:", error);
      return { success: false, error: "Error al eliminar servicio" };
    }
  },
  
  // Reservas
  getBookings: async (userId: string): Promise<ApiResponse<Booking[]>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos obtener las reservas del usuario
      console.log("GET from http://tun8n.com/webhook/bookings/" + userId);
      
      // Obtenemos las reservas del localStorage
      const allBookings = getLocalStorage<Record<string, Booking[]>>("bookings") || {};
      const userBookings = allBookings[userId] || [];
      
      return { success: true, data: userBookings };
    } catch (error) {
      console.error("Get bookings error:", error);
      return { success: false, error: "Error al obtener reservas" };
    }
  },
  
  createBooking: async (booking: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!booking.userId || !booking.clientName || !booking.serviceId || !booking.date || !booking.time) {
        return { success: false, error: "Faltan datos requeridos para la reserva" };
      }
      
      // Obtenemos el servicio para añadir el nombre
      const allServices = getLocalStorage<Record<string, Service[]>>("services") || {};
      const userServices = allServices[booking.userId] || [];
      const service = userServices.find(s => s.id === booking.serviceId);
      
      if (!service) {
        return { success: false, error: "Servicio no encontrado" };
      }
      
      // Creamos la nueva reserva
      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone || "",
        serviceId: booking.serviceId,
        serviceName: service.name,
        date: booking.date,
        time: booking.time,
        status: "confirmed",
        userId: booking.userId
      };
      
      // Guardamos la reserva en localStorage
      const allBookings = getLocalStorage<Record<string, Booking[]>>("bookings") || {};
      const userBookings = allBookings[booking.userId] || [];
      allBookings[booking.userId] = [...userBookings, newBooking];
      setLocalStorage("bookings", allBookings);
      
      // También actualizamos o creamos el cliente
      const allClients = getLocalStorage<Record<string, Client[]>>("clients") || {};
      const userClients = allClients[booking.userId] || [];
      
      // Verificamos si el cliente ya existe
      const existingClientIndex = userClients.findIndex(c => c.phone === booking.clientPhone);
      
      if (existingClientIndex >= 0) {
        // Actualizamos cliente existente
        userClients[existingClientIndex].totalBookings += 1;
        userClients[existingClientIndex].lastVisit = booking.date;
      } else {
        // Creamos nuevo cliente
        userClients.push({
          id: `client_${Date.now()}`,
          name: booking.clientName,
          phone: booking.clientPhone || "",
          totalBookings: 1,
          lastVisit: booking.date,
          userId: booking.userId
        });
      }
      
      allClients[booking.userId] = userClients;
      setLocalStorage("clients", allClients);
      
      // Simulamos envío a n8n
      console.log("POST to http://tun8n.com/webhook/reserve", {
        userId: booking.userId,
        clientName: booking.clientName,
        phone: booking.clientPhone,
        service: service.name,
        time: `${booking.date} ${booking.time}`
      });
      
      return { success: true, data: newBooking };
    } catch (error) {
      console.error("Create booking error:", error);
      return { success: false, error: "Error al crear reserva" };
    }
  },
  
  cancelBooking: async (userId: string, bookingId: string): Promise<ApiResponse<boolean>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Obtenemos las reservas
      const allBookings = getLocalStorage<Record<string, Booking[]>>("bookings") || {};
      const userBookings = allBookings[userId] || [];
      
      // Actualizamos el estado de la reserva
      const updatedBookings = userBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" as const } 
          : booking
      );
      
      allBookings[userId] = updatedBookings;
      setLocalStorage("bookings", allBookings);
      
      // Simulamos envío a n8n
      console.log("POST to http://tun8n.com/webhook/cancel", {
        userId,
        bookingId
      });
      
      return { success: true, data: true };
    } catch (error) {
      console.error("Cancel booking error:", error);
      return { success: false, error: "Error al cancelar reserva" };
    }
  },
  
  // Slots disponibles
  getAvailableSlots: async (userId: string, date: string): Promise<ApiResponse<TimeSlot[]>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulamos obtener slots de n8n
      console.log(`GET from http://tun8n.com/webhook/slots/${userId}?date=${date}`);
      
      // Generamos slots aleatorios
      const slots: TimeSlot[] = [];
      const startHour = 9;
      const endHour = 19;
      
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minutes of [0, 30]) {
          const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          slots.push({
            time,
            available: Math.random() > 0.3 // 70% disponible
          });
        }
      }
      
      return { success: true, data: slots };
    } catch (error) {
      console.error("Get available slots error:", error);
      return { success: false, error: "Error al obtener horarios disponibles" };
    }
  },
  
  // Obtener URL pública
  getPublicUrl: async (userId: string): Promise<ApiResponse<string>> => {
    try {
      // Obtenemos el usuario
      const users = getLocalStorage<User[]>("users") || [];
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        return { success: false, error: "Usuario no encontrado" };
      }
      
      // Creamos una URL amigable basada en el nombre del negocio
      const businessSlug = user.businessName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      return { 
        success: true, 
        data: `/booking/${userId}` 
      };
    } catch (error) {
      console.error("Get public URL error:", error);
      return { success: false, error: "Error al generar URL pública" };
    }
  },
  
  // Clientes
  getClients: async (userId: string): Promise<ApiResponse<Client[]>> => {
    try {
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtenemos los clientes del localStorage
      const allClients = getLocalStorage<Record<string, Client[]>>("clients") || {};
      const userClients = allClients[userId] || [];
      
      return { success: true, data: userClients };
    } catch (error) {
      console.error("Get clients error:", error);
      return { success: false, error: "Error al obtener clientes" };
    }
  }
};

