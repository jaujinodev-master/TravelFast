import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Navigation, User, Clock } from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { getBookings, updateBookingStatus } from '../services/bookingService';
import { Button } from './Button';
import { COLORS } from '../constants';

export const DriverView: React.FC = () => {
  const [todaysTrips, setTodaysTrips] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const all = await getBookings();
      // Filter for confirmed today (simplified for demo)
      setTodaysTrips(all.filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED));
    };
    fetchTrips();
    
    // Poll for new trips
    const interval = setInterval(fetchTrips, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFinishTrip = async (id: string) => {
    if (confirm("¿Finalizar viaje y calcular comisión?")) {
      await updateBookingStatus(id, BookingStatus.COMPLETED);
      // Force refresh of local state
      const all = await getBookings();
      setTodaysTrips(all.filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6 text-white shadow-lg" style={{ backgroundColor: COLORS.primary }}>
        <h2 className="text-xl font-bold mb-1">Hola, Conductor</h2>
        <p className="text-gray-400 text-sm">Ruta Jauja → Huancayo</p>
        <div className="mt-4 flex gap-4">
           <div>
             <span className="block text-2xl font-bold" style={{ color: COLORS.action }}>03</span>
             <span className="text-xs text-gray-400">Viajes Hoy</span>
           </div>
           <div>
             <span className="block text-2xl font-bold text-green-400">S/ 135</span>
             <span className="text-xs text-gray-400">Tu Comisión (30%)</span>
           </div>
        </div>
      </div>

      <h3 className="font-bold ml-1" style={{ color: COLORS.primary }}>Próximos Pasajeros</h3>

      <div className="space-y-4">
        {todaysTrips.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl text-gray-500 shadow-sm">
            <p>No tienes viajes asignados y confirmados por ahora.</p>
            <p className="text-xs mt-2 text-gray-400">Espera a que Administración apruebe las reservas.</p>
          </div>
        ) : (
          todaysTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-bold text-gray-800">{trip.time}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-bold text-white`} style={{ backgroundColor: trip.serviceType === 'PRIVATE' ? COLORS.primary : COLORS.action }}>
                    {trip.serviceType === 'PRIVATE' ? 'PRIVADO' : 'COMPARTIDO'}
                  </span>
               </div>
               
               <div className="p-4">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="font-bold text-lg" style={{ color: COLORS.primary }}>{trip.customerName}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <User className="h-3 w-3" />
                        <span>{trip.seats} Pasajero(s)</span>
                      </div>
                   </div>
                   <a 
                     href={`https://wa.me/51${trip.customerPhone}`} 
                     target="_blank" 
                     rel="noreferrer"
                     className="bg-green-100 p-2 rounded-full text-green-600 hover:bg-green-200 transition-colors"
                   >
                     <Phone className="h-5 w-5" />
                   </a>
                 </div>

                 <div className="bg-gray-100 p-3 rounded-lg mb-4 border border-gray-200">
                    <div className="flex items-start gap-2">
                       <MapPin className="h-4 w-4 mt-1" style={{ color: COLORS.action }} />
                       <div>
                         <span className="text-xs text-gray-500 font-bold uppercase">Recojo</span>
                         <p className="text-sm font-medium text-gray-800">{trip.pickupAddress}</p>
                       </div>
                    </div>
                 </div>

                 {trip.status !== BookingStatus.COMPLETED && (
                   <Button 
                    fullWidth 
                    variant="primary" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleFinishTrip(trip.id)}
                   >
                      <Navigation className="h-4 w-4" /> Finalizar Viaje
                   </Button>
                 )}
                 {trip.status === BookingStatus.COMPLETED && (
                    <div className="text-center text-green-600 font-bold text-sm bg-green-50 py-2 rounded border border-green-100">
                      Viaje Completado
                    </div>
                 )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};