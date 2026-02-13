import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, User, Phone, CreditCard, Armchair, Info } from 'lucide-react';
import { ServiceType, Booking, PickupLocationType, BookingStatus, Seat } from '../types';
import { KNOWN_POINTS_JAUJA, DESTINATION_HUANCAYO, COLORS } from '../constants';
import { calculatePrice } from '../services/bookingService';
import { Button } from './Button';

interface BookingFormProps {
  serviceType: ServiceType;
  onBack: () => void;
  onSubmit: (bookingData: Partial<Booking>) => void;
}

// Mock Seat Layout
const CAR_LAYOUT: Seat[] = [
  { id: 1, label: 'Copiloto', type: 'FRONT', isAvailable: true },
  { id: 2, label: 'Atrás Izq', type: 'WINDOW', isAvailable: true },
  { id: 3, label: 'Atrás Centro', type: 'MIDDLE', isAvailable: true },
  { id: 4, label: 'Atrás Der', type: 'WINDOW', isAvailable: true },
  { id: 5, label: '3ra Fila Izq', type: 'WINDOW', isAvailable: true },
  { id: 6, label: '3ra Fila Der', type: 'WINDOW', isAvailable: true },
];

export const BookingForm: React.FC<BookingFormProps> = ({ serviceType, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    pickupType: serviceType === ServiceType.PRIVATE ? PickupLocationType.EXACT_ADDRESS : PickupLocationType.KNOWN_POINT,
    pickupAddress: serviceType === ServiceType.PRIVATE ? '' : KNOWN_POINTS_JAUJA[0],
    isAirport: false
  });

  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>(serviceType === ServiceType.PRIVATE ? [1,2,3,4,5,6] : []);
  const [price, setPrice] = useState({ total: 0, prepayment: 0, unitPrice: 0 });

  useEffect(() => {
    const isAirport = formData.pickupAddress.toLowerCase().includes('aeropuerto') || formData.isAirport;
    // For shared, seats is based on selection. For private, it's fixed full car
    const seatCount = serviceType === ServiceType.PRIVATE ? 6 : Math.max(1, selectedSeatIds.length);
    
    const calc = calculatePrice(serviceType, seatCount, isAirport);
    setPrice(calc);
  }, [selectedSeatIds, formData.pickupAddress, formData.isAirport, serviceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSeat = (seatId: number) => {
    if (serviceType === ServiceType.PRIVATE) return; // Private takes all
    
    setSelectedSeatIds(prev => {
      if (prev.includes(seatId)) return prev.filter(id => id !== seatId);
      return [...prev, seatId];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dni.length !== 8) {
      alert("El DNI debe tener 8 dígitos");
      return;
    }
    if (serviceType === ServiceType.SHARED && selectedSeatIds.length === 0) {
      alert("Debes seleccionar al menos un asiento");
      return;
    }
    
    onSubmit({
      serviceType,
      customerName: formData.name,
      customerDni: formData.dni,
      customerPhone: formData.phone,
      date: formData.date,
      time: formData.time,
      seats: serviceType === ServiceType.PRIVATE ? 6 : selectedSeatIds.length,
      selectedSeatIds: selectedSeatIds,
      pickupType: formData.pickupType,
      pickupAddress: formData.pickupAddress,
      totalPrice: price.total,
      prepaymentAmount: price.prepayment,
      status: BookingStatus.PENDING_PAYMENT,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 text-white flex items-center gap-3" style={{ backgroundColor: COLORS.primary }}>
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="font-bold text-lg">
          {serviceType === ServiceType.PRIVATE ? 'Reserva Privada' : 'Reserva Compartida'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Date & Time First */}
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="date" name="date" required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                  value={formData.date} onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora Salida</label>
              <input 
                type="time" name="time" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                value={formData.time} onChange={handleChange}
              />
            </div>
        </div>

        {/* SEAT SELECTION UI */}
        {serviceType === ServiceType.SHARED && (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
             <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: COLORS.primary }}>
               <Armchair className="h-4 w-4" /> Elige tu(s) asiento(s)
             </h3>
             
             {/* Simple Car Visual */}
             <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                {/* Front */}
                <div className="flex gap-2 mb-2">
                   <div className="w-1/2 p-2 bg-gray-300 rounded text-center text-xs font-bold text-gray-500">Chofer</div>
                   <button 
                     type="button"
                     onClick={() => toggleSeat(1)}
                     className={`w-1/2 p-2 rounded text-center text-xs font-bold transition-colors border ${selectedSeatIds.includes(1) ? 'text-white' : 'bg-white text-gray-600'}`}
                     style={{ backgroundColor: selectedSeatIds.includes(1) ? COLORS.action : undefined, borderColor: selectedSeatIds.includes(1) ? COLORS.action : '#e5e7eb' }}
                   >
                     Copiloto
                   </button>
                </div>
                {/* Middle */}
                <div className="flex gap-2">
                   <button type="button" onClick={() => toggleSeat(2)} className={`w-1/3 p-3 rounded text-center text-xs font-bold border ${selectedSeatIds.includes(2) ? 'text-white' : 'bg-white'}`} style={{ backgroundColor: selectedSeatIds.includes(2) ? COLORS.action : undefined }}>Izq</button>
                   <button type="button" onClick={() => toggleSeat(3)} className={`w-1/3 p-3 rounded text-center text-xs font-bold border ${selectedSeatIds.includes(3) ? 'text-white' : 'bg-white'}`} style={{ backgroundColor: selectedSeatIds.includes(3) ? COLORS.action : undefined }}>Cen</button>
                   <button type="button" onClick={() => toggleSeat(4)} className={`w-1/3 p-3 rounded text-center text-xs font-bold border ${selectedSeatIds.includes(4) ? 'text-white' : 'bg-white'}`} style={{ backgroundColor: selectedSeatIds.includes(4) ? COLORS.action : undefined }}>Der</button>
                </div>
                {/* Back */}
                <div className="flex gap-2">
                   <button type="button" onClick={() => toggleSeat(5)} className={`w-1/2 p-3 rounded text-center text-xs font-bold border ${selectedSeatIds.includes(5) ? 'text-white' : 'bg-white'}`} style={{ backgroundColor: selectedSeatIds.includes(5) ? COLORS.action : undefined }}>3ra Izq</button>
                   <button type="button" onClick={() => toggleSeat(6)} className={`w-1/2 p-3 rounded text-center text-xs font-bold border ${selectedSeatIds.includes(6) ? 'text-white' : 'bg-white'}`} style={{ backgroundColor: selectedSeatIds.includes(6) ? COLORS.action : undefined }}>3ra Der</button>
                </div>
             </div>
             
             <div className="mt-3 text-center text-xs text-gray-500">
                {selectedSeatIds.length} asiento(s) seleccionados
             </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: COLORS.secondary }}>Datos Personales</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" name="name" required
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                placeholder="Ej. Juan Pérez"
                value={formData.name} onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <input 
                type="text" name="dni" required maxLength={8} pattern="\d{8}"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                placeholder="8 dígitos"
                value={formData.dni} onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="tel" name="phone" required
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                  placeholder="999..."
                  value={formData.phone} onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Punto de Recojo (Jauja)</label>
             <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {serviceType === ServiceType.PRIVATE ? (
                  <input 
                    type="text" name="pickupAddress" required
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                    placeholder="Dirección exacta o referencia"
                    value={formData.pickupAddress} onChange={handleChange}
                  />
                ) : (
                  <select 
                    name="pickupAddress" required
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 appearance-none"
                    style={{ '--tw-ring-color': COLORS.action } as React.CSSProperties}
                    value={formData.pickupAddress} onChange={handleChange}
                  >
                    {KNOWN_POINTS_JAUJA.map(point => (
                      <option key={point} value={point}>{point}</option>
                    ))}
                  </select>
                )}
             </div>
        </div>

        {/* Pricing Summary */}
        <div className="text-white p-4 rounded-xl" style={{ backgroundColor: COLORS.primary }}>
           
           {serviceType === ServiceType.SHARED && (
             <div className="mb-3 bg-white/10 p-2 rounded flex gap-2 items-start text-xs">
                <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: COLORS.action }} />
                <p>
                   {selectedSeatIds.length >= 4 
                     ? "¡Genial! Aplicando tarifa reducida de S/ 9.00 por comprar 4+ asientos." 
                     : "Tarifa estándar S/ 11.00 (Incluye recojo). Compra 4+ asientos para bajar a S/ 9.00."}
                </p>
             </div>
           )}

           <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Total ({serviceType === 'PRIVATE' ? 'Auto' : `${selectedSeatIds.length} pax`})</span>
              <span className="font-bold text-lg">S/ {price.total.toFixed(2)}</span>
           </div>
           <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="font-medium flex items-center gap-2" style={{ color: COLORS.action }}>
                <CreditCard className="h-4 w-4" /> Adelanto Requerido
              </span>
              <span className="font-bold text-xl" style={{ color: COLORS.action }}>S/ {price.prepayment.toFixed(2)}</span>
           </div>
        </div>

        <Button type="submit" fullWidth variant="primary">
           Continuar al Pago
        </Button>
      </form>
    </div>
  );
};