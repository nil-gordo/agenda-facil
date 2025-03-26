
export interface User {
  id: string;
  email: string;
  businessName: string;
  fullName: string;
  googleCalendarConnected: boolean;
  twilioTokenConnected: boolean;
  twilioToken?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  enablePayment: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  userId: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit?: string;
  totalBookings: number;
  userId: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
