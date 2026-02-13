// Brand Colors - Official Palette
// color1: #b9030f (Rojo Brillante/Acción)
// color2: #9e0004 (Rojo Oscuro/Hover)
// color3: #70160e (Marrón Rojizo/Bordes/Detalles)
// color4: #161917 (Negro/Texto/Header)
// color5: #e1e3db (Beige/Fondo)

export const COLORS = {
  primary: '#161917', // color4: Negro (Header, Textos principales)
  secondary: '#70160e', // color3: Marrón Rojizo (Subtítulos, bordes tenues)
  action: '#b9030f', // color1: Rojo Principal (Botones, Iconos destacados)
  actionHover: '#9e0004', // color2: Rojo Oscuro (Hover states)
  background: '#e1e3db', // color5: Beige (Fondo general)
  white: '#FFFFFF',
  text: '#161917', // color4
  textLight: '#e1e3db'
};

// Business Logic Constants
export const PRICING = {
  PRIVATE_BASE: 70.00,
  PRIVATE_AIRPORT: 80.00,
  SHARED_SEAT: 9.00,
  MIN_SHARED_SEATS: 4,
  PRIVATE_PREPAY_PERCENT: 0.50,
  SHARED_PREPAY_PERCENT: 0.40,
  DRIVER_COMMISSION_PERCENT: 0.30
};

export const KNOWN_POINTS_JAUJA = [
  'Plaza de Armas Jauja',
  'Aeropuerto de Jauja',
  'Terminal Terrestre',
  'Laguna de Paca',
  'Ovalo Jauja'
];

export const DESTINATION_HUANCAYO = 'Calle Real y Calixto, Huancayo';

// Mock Data for Admin Dashboard
export const MOCK_STATS = [
  { name: 'Lun', income: 240 },
  { name: 'Mar', income: 180 },
  { name: 'Mie', income: 320 },
  { name: 'Jue', income: 290 },
  { name: 'Vie', income: 450 },
  { name: 'Sab', income: 580 },
  { name: 'Dom', income: 510 },
];