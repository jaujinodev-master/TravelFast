import React from 'react';
import { Car, Menu } from 'lucide-react';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <header className="sticky top-0 z-50 text-white shadow-md" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <Car className="h-6 w-6" style={{ color: COLORS.action }} />
            <h1 className="text-xl font-bold tracking-tight">TravelFast</h1>
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#b9030f] transition-colors">Reservar</button>
            <button onClick={() => setCurrentView('driver')} className="hover:text-[#b9030f] transition-colors">Soy Conductor</button>
            <button onClick={() => setCurrentView('admin')} className="hover:text-[#b9030f] transition-colors">Administración</button>
          </nav>
          
          <div className="md:hidden">
             <Menu className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-gray-400 py-8 text-center text-sm" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Car className="h-5 w-5" style={{ color: COLORS.action }} />
            <span className="font-bold text-white">TravelFast</span>
          </div>
          <p className="mb-4 text-gray-500">Transporte seguro y puntual Jauja ↔ Huancayo</p>
          <div className="border-t border-gray-800 pt-4 flex justify-center gap-6 text-xs font-medium">
             <button onClick={() => setCurrentView('home')} className={currentView === 'home' ? 'text-[#b9030f]' : 'hover:text-white'}>Cliente</button>
             <button onClick={() => setCurrentView('driver')} className={currentView === 'driver' ? 'text-[#b9030f]' : 'hover:text-white'}>Conductor</button>
             <button onClick={() => setCurrentView('admin')} className={currentView === 'admin' ? 'text-[#b9030f]' : 'hover:text-white'}>Admin</button>
          </div>
          <p className="mt-4 text-xs text-gray-600">© 2024 TravelFast. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};