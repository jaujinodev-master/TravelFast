import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ServiceSelector } from './components/ServiceSelector';
import { BookingForm } from './components/BookingForm';
import { PaymentUpload } from './components/PaymentUpload';
import { AdminDashboard } from './components/AdminDashboard';
import { DriverView } from './components/DriverView';
import { ServiceType, Booking, BookingStatus } from './types';
import { createBooking } from './services/bookingService';
import { CheckCircle } from 'lucide-react';
import { Button } from './components/Button';

// Mock Router states: 'home' | 'booking' | 'payment' | 'success' | 'admin' | 'driver'

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [tempBooking, setTempBooking] = useState<Partial<Booking> | null>(null);

  const handleServiceSelect = (type: ServiceType) => {
    setSelectedService(type);
    setCurrentView('booking');
  };

  const handleBookingSubmit = (data: Partial<Booking>) => {
    setTempBooking(data);
    setCurrentView('payment');
  };

  const handlePaymentConfirm = async (file: File) => {
    if (tempBooking) {
      // Create object URL for demo purposes (in real app, upload to S3/Cloudinary)
      const fakeUrl = URL.createObjectURL(file);
      const finalBooking = { ...tempBooking, paymentProofUrl: fakeUrl } as Booking;
      
      await createBooking(finalBooking);
      setCurrentView('success');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <ServiceSelector onSelect={handleServiceSelect} />;
      
      case 'booking':
        if (!selectedService) return <ServiceSelector onSelect={handleServiceSelect} />;
        return (
          <BookingForm 
            serviceType={selectedService} 
            onBack={() => setCurrentView('home')}
            onSubmit={handleBookingSubmit}
          />
        );

      case 'payment':
        if (!tempBooking) return <ServiceSelector onSelect={handleServiceSelect} />;
        return (
          <PaymentUpload 
            booking={tempBooking}
            onConfirm={handlePaymentConfirm}
            onCancel={() => {
              setTempBooking(null);
              setCurrentView('home');
            }}
          />
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-white rounded-2xl shadow-xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D1B2A] mb-2">¡Reserva Enviada!</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              Hemos recibido tu comprobante. Tu reserva está en proceso de verificación. Te enviaremos la confirmación a tu WhatsApp.
            </p>
            <Button onClick={() => setCurrentView('home')}>
              Volver al Inicio
            </Button>
          </div>
        );

      case 'admin':
        return <AdminDashboard />;
      
      case 'driver':
        return <DriverView />;

      default:
        return <ServiceSelector onSelect={handleServiceSelect} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;