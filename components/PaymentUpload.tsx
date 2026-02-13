import React, { useState } from 'react';
import { Upload, CheckCircle, Smartphone } from 'lucide-react';
import { Booking } from '../types';
import { Button } from './Button';
import { COLORS } from '../constants';

interface PaymentUploadProps {
  booking: Partial<Booking>;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

export const PaymentUpload: React.FC<PaymentUploadProps> = ({ booking, onConfirm, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
      <div className="p-6 text-center text-white" style={{ backgroundColor: COLORS.primary }}>
        <h2 className="font-bold text-xl mb-1">Confirmar Reserva</h2>
        <p className="text-sm text-gray-300">Yapea el adelanto para asegurar tu cupo</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-8">
           <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group">
              {/* Placeholder for QR Code */}
              <img 
                src="https://picsum.photos/200/200?random=1" 
                alt="QR Yape" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold">
                QR YAPE
              </div>
           </div>
           <p className="font-bold text-2xl" style={{ color: COLORS.action }}>S/ {booking.prepaymentAmount?.toFixed(2)}</p>
           <p className="text-sm text-gray-500">A nombre de: TravelFast SAC</p>
        </div>

        <div className="space-y-4">
          <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: file ? COLORS.action : undefined }}>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            {file ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle className="h-10 w-10 mb-2" />
                <span className="font-medium text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs">Clic para cambiar</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="h-10 w-10 mb-2" />
                <span className="font-medium text-sm">Subir captura del Yape</span>
                <span className="text-xs text-gray-400">JPG o PNG</span>
              </div>
            )}
          </label>

          <Button 
            fullWidth 
            variant="primary"
            onClick={() => file && onConfirm(file)} 
            disabled={!file}
          >
            {file ? 'Enviar Comprobante' : 'Adjuntar Comprobante Primero'}
          </Button>

          <button 
            onClick={onCancel}
            className="w-full py-3 text-gray-500 text-sm font-medium hover:text-black"
          >
            Cancelar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};