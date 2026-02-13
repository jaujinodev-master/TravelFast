import React from 'react';
import { Users, Briefcase, Star, Clock, MapPin } from 'lucide-react';
import { ServiceType } from '../types';
import { Button } from './Button';
import { COLORS } from '../constants';

interface ServiceSelectorProps {
  onSelect: (type: ServiceType) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center mb-6 mt-4">
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>¿Cómo deseas viajar hoy?</h2>
        <p className="font-medium" style={{ color: COLORS.secondary }}>Ruta exclusiva Jauja ↔ Huancayo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Private Service Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 flex flex-col transition-all relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1" style={{ borderColor: 'transparent' }}>
          <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ backgroundColor: COLORS.primary }}>
            PREMIUM
          </div>
          
          <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
            <Briefcase className="h-6 w-6" style={{ color: COLORS.primary }} />
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.primary }}>Servicio Privado</h3>
          <p className="text-gray-500 text-sm mb-4">Vehículo exclusivo para ti o tu grupo. Máxima comodidad y privacidad.</p>
          
          <ul className="space-y-3 mb-6 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Auto completo (1-6 pax)</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" style={{ color: COLORS.secondary }} /> Recojo a domicilio exacto</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" style={{ color: COLORS.secondary }} /> Horario a tu elección</li>
          </ul>

          <div className="mt-auto">
             <p className="text-2xl font-bold mb-4" style={{ color: COLORS.primary }}>S/ 70.00 <span className="text-sm font-normal text-gray-500">/ viaje</span></p>
             <Button fullWidth onClick={() => onSelect(ServiceType.PRIVATE)} variant="secondary">
               Reservar Privado
             </Button>
          </div>
        </div>

        {/* Shared Service Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 flex flex-col transition-all relative overflow-hidden hover:shadow-2xl hover:-translate-y-1" style={{ borderColor: COLORS.action }}>
           <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ backgroundColor: COLORS.action }}>
            POPULAR
          </div>

          <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
            <Users className="h-6 w-6" style={{ color: COLORS.action }} />
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.primary }}>Servicio Compartido</h3>
          <p className="text-gray-500 text-sm mb-4">Viaja cómodo pagando solo por tu asiento. Ideal para traslados diarios.</p>
          
          <ul className="space-y-3 mb-6 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Users className="h-4 w-4" style={{ color: COLORS.action }} /> Pago por asiento</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" style={{ color: COLORS.secondary }} /> Puntos de encuentro Jauja</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" style={{ color: COLORS.secondary }} /> Salida confirmada (min 4)</li>
          </ul>

          <div className="mt-auto">
             <p className="text-2xl font-bold mb-4" style={{ color: COLORS.action }}>S/ 9.00 <span className="text-sm font-normal text-gray-500">/ asiento</span></p>
             <Button variant="primary" fullWidth onClick={() => onSelect(ServiceType.SHARED)}>
               Reservar Asiento
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};