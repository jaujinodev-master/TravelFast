import { ServiceType, Booking, BookingStatus, Driver } from '../types';
import { PRICING } from '../constants';

// --- MOCK DRIVERS DATA (For Admin) ---
export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Carlos Rojas', plate: 'W4T-123', phone: '987654321' },
  { id: 'd2', name: 'Miguel Angel', plate: 'A1B-456', phone: '912345678' },
  { id: 'd3', name: 'Jose Quispe', plate: 'X9Z-789', phone: '998877665' },
];

// --- PRICING LOGIC ---
export const calculatePrice = (
  serviceType: ServiceType,
  seats: number,
  isAirport: boolean
): { total: number; prepayment: number; unitPrice: number } => {
  let total = 0;
  let prepayment = 0;
  let unitPrice = 0;

  if (serviceType === ServiceType.PRIVATE) {
    total = isAirport ? PRICING.PRIVATE_AIRPORT : PRICING.PRIVATE_BASE;
    prepayment = total * PRICING.PRIVATE_PREPAY_PERCENT;
    unitPrice = total;
  } else {
    // New Logic: 11 soles for 1-3 seats, 9 soles for 4+ seats
    // Note: The prompt says "Recojo a domicilio o punto conocido" implies the 11 soles covers the pickup cost better
    unitPrice = seats >= 4 ? 9.00 : 11.00;
    total = seats * unitPrice;
    prepayment = total * PRICING.SHARED_PREPAY_PERCENT;
  }

  return { total, prepayment, unitPrice };
};

// --- LOCAL STORAGE PERSISTENCE ---
const STORAGE_KEY = 'travelfast_bookings';

const loadBookings = (): Booking[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const getBookings = async (): Promise<Booking[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadBookings());
    }, 400);
  });
};

export const createBooking = async (booking: Booking): Promise<Booking> => {
  return new Promise((resolve) => {
    const current = loadBookings();
    // Add fake ID
    const newBooking = { ...booking, id: `bk-${Date.now()}` };
    current.push(newBooking);
    saveBookings(current);
    setTimeout(() => resolve(newBooking), 600);
  });
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<void> => {
  const current = loadBookings();
  const index = current.findIndex(b => b.id === id);
  if (index !== -1) {
    current[index].status = status;
    saveBookings(current);
  }
};

export const assignDriverToBooking = async (bookingId: string, driverId: string): Promise<void> => {
  const current = loadBookings();
  const index = current.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    current[index].driverId = driverId;
    saveBookings(current);
  }
};

// Helper to group bookings into trips (Mock logic based on time slots)
export const getDailyTrips = async (date: string) => {
  const bookings = await getBookings();
  const daysBookings = bookings.filter(b => b.date === date && b.status !== BookingStatus.CANCELLED);
  
  // Group by Time + Service Type
  const trips: Record<string, Booking[]> = {};
  
  daysBookings.forEach(b => {
    const key = `${b.time}-${b.serviceType}`;
    if (!trips[key]) trips[key] = [];
    trips[key].push(b);
  });

  return trips;
};