import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, TrendingUp, Users, DollarSign, Eye, AlertCircle, CarFront, Calendar as CalendarIcon, ChevronDown, UserCheck } from 'lucide-react';
import { Booking, BookingStatus, Driver } from '../types';
import { getBookings, updateBookingStatus, assignDriverToBooking, getDailyTrips, MOCK_DRIVERS } from '../services/bookingService';
import { MOCK_STATS, COLORS } from '../constants';
import { Button } from './Button';

export const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Record<string, Booking[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'trips'>('verifications');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); 
    return () => clearInterval(interval);
  }, [filterDate]);

  const loadData = async () => {
    setLoading(true);
    const allBookings = await getBookings();
    setBookings(allBookings);
    
    const dailyTrips = await getDailyTrips(filterDate);
    setTrips(dailyTrips);
    setLoading(false);
  };

  const handleAction = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status);
    loadData(); 
  };

  const handleAssignDriver = async (bookingId: string, driverId: string) => {
    await assignDriverToBooking(bookingId, driverId);
    loadData();
  };

  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING_PAYMENT || b.status === BookingStatus.VERIFYING);

  // Helper to calculate trip capacity
  const getTripOccupancy = (bookings: Booking[]) => {
    return bookings.reduce((acc, curr) => acc + curr.seats, 0);
  };

  // Helper to get seat labels
  const getSeatLabels = (ids: number[]) => {
    if (!ids) return 'Todo el auto';
    const labels = {1: 'Copiloto', 2: 'Atrás Izq', 3: 'Atrás Cen', 4: 'Atrás Der', 5: '3ra Izq', 6: '3ra Der'};
    return ids.map(id => labels[id as keyof typeof labels]).join(', ');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Header & Date Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>Panel Administrativo</h2>
           <p className="text-sm text-gray-500">Gestión de flota y reservas</p>
        </div>
        
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
           <button 
             onClick={() => setActiveTab('verifications')}
             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'verifications' ? 'bg-[#161917] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Verificaciones ({pendingBookings.length})
           </button>
           <button 
             onClick={() => setActiveTab('trips')}
             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'trips' ? 'bg-[#161917] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Gestionar Viajes
           </button>
        </div>
      </div>

      {activeTab === 'verifications' ? (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Pending Verifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold" style={{ color: COLORS.primary }}>Validar Yape</h3>
            </div>
            <div className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                {pendingBookings.length === 0 ? (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                    <Check className="h-12 w-12 text-green-200 mb-4" />
                    <p className="font-medium">¡Todo al día!</p>
                    <p className="text-sm">No hay comprobantes pendientes de revisión.</p>
                </div>
                ) : (
                <div className="divide-y divide-gray-100">
                    {pendingBookings.map(booking => (
                    <div key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm" style={{ color: COLORS.primary }}>{booking.customerName}</span>
                            <span className={`text-[10px] text-white px-1.5 py-0.5 rounded font-bold ${booking.serviceType === 'PRIVATE' ? 'bg-black' : 'bg-red-600'}`}>
                              {booking.serviceType === 'PRIVATE' ? 'PRIVADO' : 'COMPARTIDO'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" /> {booking.date} • {booking.time}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Asientos: {booking.seats} ({getSeatLabels(booking.selectedSeatIds)})
                        </p>
                        <p className="text-sm font-bold mt-2" style={{ color: COLORS.action }}>
                            Yape: S/ {booking.prepaymentAmount.toFixed(2)}
                        </p>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-center">
                        {booking.paymentProofUrl ? (
                            <button 
                            onClick={() => setSelectedImage(booking.paymentProofUrl || null)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" 
                            title="Ver Foto"
                            >
                            <Eye className="h-5 w-5" />
                            </button>
                        ) : (
                            <div className="p-2 text-gray-300" title="Sin imagen">
                            <AlertCircle className="h-5 w-5" />
                            </div>
                        )}
                        
                        <button 
                            onClick={() => handleAction(booking.id, BookingStatus.CONFIRMED)}
                            className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 transition-colors font-medium text-xs" 
                        >
                            <Check className="h-4 w-4" /> Aprobar
                        </button>
                        <button 
                            onClick={() => handleAction(booking.id, BookingStatus.CANCELLED)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition-colors" 
                            title="Rechazar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold mb-4" style={{ color: COLORS.primary }}>Resumen Financiero Semanal</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_STATS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip 
                            cursor={{fill: '#f3f4f6'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="income" fill={COLORS.action} radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        /* TRIPS MANAGEMENT TAB */
        <div className="space-y-6">
           <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <span className="text-sm font-bold text-gray-600">Filtrar fecha:</span>
              <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
           </div>

           {Object.keys(trips).length === 0 ? (
             <div className="text-center py-12 text-gray-400">
                No hay viajes programados para esta fecha.
             </div>
           ) : (
             <div className="grid md:grid-cols-2 gap-6">
               {Object.entries(trips).map(([key, groupedBookings]) => {
                 const [time, type] = key.split('-');
                 const occupancy = getTripOccupancy(groupedBookings);
                 // Assuming all bookings in a group have same driver if assigned, picking first
                 const assignedDriverId = groupedBookings[0].driverId; 
                 const assignedDriver = MOCK_DRIVERS.find(d => d.id === assignedDriverId);

                 return (
                   <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                         <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded border border-gray-200">
                               <span className="font-bold text-lg" style={{ color: COLORS.primary }}>{time}</span>
                            </div>
                            <div>
                               <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${type === 'PRIVATE' ? 'bg-black' : 'bg-red-600'}`}>
                                 {type === 'PRIVATE' ? 'PRIVADO' : 'COMPARTIDO'}
                               </span>
                               <p className="text-xs text-gray-500 mt-0.5">Jauja → Huancayo</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className={`text-sm font-bold ${occupancy >= 6 ? 'text-red-600' : 'text-green-600'}`}>
                               {occupancy}/6 Asientos
                            </span>
                         </div>
                      </div>

                      {/* Driver Assignment */}
                      <div className="p-4 border-b border-gray-100 bg-white">
                         <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Conductor Asignado</label>
                         <div className="flex gap-2">
                             <select 
                               className="flex-1 text-sm border-gray-300 border rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
                               value={assignedDriverId || ''}
                               onChange={(e) => {
                                 // Assign driver to ALL bookings in this trip group
                                 groupedBookings.forEach(b => handleAssignDriver(b.id, e.target.value));
                               }}
                             >
                                <option value="">-- Sin Asignar --</option>
                                {MOCK_DRIVERS.map(d => (
                                  <option key={d.id} value={d.id}>{d.name} ({d.plate})</option>
                                ))}
                             </select>
                             {assignedDriver && (
                               <a href={`tel:${assignedDriver.phone}`} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
                                  <PhoneIcon className="h-5 w-5" />
                               </a>
                             )}
                         </div>
                      </div>

                      {/* Manifest */}
                      <div className="p-4">
                         <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Manifiesto de Pasajeros</h4>
                         <div className="space-y-3">
                            {groupedBookings.map(b => (
                              <div key={b.id} className="flex justify-between items-start text-sm pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                                 <div>
                                   <p className="font-bold text-gray-800">{b.customerName}</p>
                                   <p className="text-xs text-gray-500">
                                      {b.seats} pax: <span className="text-red-600">{getSeatLabels(b.selectedSeatIds)}</span>
                                   </p>
                                   <p className="text-xs text-gray-400">{b.pickupAddress}</p>
                                 </div>
                                 <div className="text-right">
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      {b.status === 'CONFIRMED' ? 'OK' : 'PEND'}
                                    </span>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div className="bg-white p-2 rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-2 border-b mb-2">
               <h3 className="font-bold text-gray-800">Comprobante de Pago</h3>
               <button onClick={() => setSelectedImage(null)} className="p-1 hover:bg-gray-100 rounded-full">
                 <X className="h-5 w-5 text-gray-500" />
               </button>
            </div>
            <img 
              src={selectedImage} 
              alt="Comprobante" 
              className="w-full h-auto object-contain max-h-[70vh] rounded bg-gray-50" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Phone Icon component locally to avoid import issues if not in Lucide package used
const PhoneIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
