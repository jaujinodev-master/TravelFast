export enum ServiceType {
  PRIVATE = 'PRIVATE',
  SHARED = 'SHARED'
}

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  VERIFYING = 'VERIFYING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PickupLocationType {
  KNOWN_POINT = 'KNOWN_POINT',
  EXACT_ADDRESS = 'EXACT_ADDRESS'
}

// Seat Definition
export interface Seat {
  id: number;
  label: string; // "Copiloto", "Atrás Izq", etc.
  type: 'FRONT' | 'WINDOW' | 'MIDDLE';
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  dni: string;
  phone: string;
  role: 'admin' | 'driver' | 'customer';
}

export interface Driver {
  id: string;
  name: string;
  plate: string;
  phone: string;
}

export interface Booking {
  id: string;
  serviceType: ServiceType;
  customerName: string;
  customerDni: string;
  customerPhone: string;
  date: string;
  time: string;
  seats: number; // Total seats requested
  selectedSeatIds: number[]; // Specific seat IDs
  pickupType: PickupLocationType;
  pickupAddress: string;
  totalPrice: number;
  prepaymentAmount: number;
  status: BookingStatus;
  paymentProofUrl?: string;
  driverId?: string; // Assigned Driver
  createdAt: string;
}

export interface DailyStats {
  date: string;
  totalIncome: number;
  driverCommission: number;
  netProfit: number;
  tripsCount: number;
}