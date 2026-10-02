/* Datos de la demo — menú idéntico al seed real del backend (menu.service.ts)
   campos iguales a MenuItemData del sistema: name/description/price/category/
   station/dietaryTags/imageUrl/modifiers/stock/active
   img vacío → la tarjeta muestra el logo del restaurante (como el sistema real
   cuando un producto no tiene foto); desde Admin → Carta se puede subir una. */

/* Mesa donde aterriza el escaneo simulado — la 02, como en las capturas reales */
const MESA_DEMO = 2;

const MENU_DEMO = [
  { id: 1, nombre: 'Provoleta', descripcion: 'Provoleta a la parrilla con orégano y tomate.', precio: 6800, categoria: 'Entradas', estacion: 'Parrilla', dietarios: ['Vegetariano'], stock: -1, activo: true, img: '' },
  { id: 2, nombre: 'Empanadas de carne (x3)', descripcion: 'Empanadas de carne cortada a cuchillo.', precio: 5400, categoria: 'Entradas', estacion: 'Cocina', stock: -1, activo: true, img: '' },
  { id: 3, nombre: 'Tabla de fiambres', descripcion: 'Jamón crudo, quesos, aceitunas y pan.', precio: 12500, categoria: 'Entradas', estacion: 'Barra', dietarios: ['Sin TACC'], stock: 8, activo: true, img: '' },
  {
    id: 4, nombre: 'Ojo de bife', descripcion: 'Ojo de bife 400g con guarnición a elección.', precio: 18900, categoria: 'Platos Fuertes', estacion: 'Parrilla', stock: -1, activo: true, img: '',
    modificadores: [
      { nombre: 'Término', requerido: true, opciones: [{ label: 'Jugoso', delta: 0 }, { label: 'A punto', delta: 0 }, { label: 'Bien cocido', delta: 0 }] },
      { nombre: 'Agregados', opciones: [{ label: 'Extra queso', delta: 800 }, { label: 'Huevo frito', delta: 600 }] },
    ],
  },
  { id: 5, nombre: 'Milanesa napolitana', descripcion: 'Milanesa con salsa, jamón y mozzarella, con papas.', precio: 14200, categoria: 'Platos Fuertes', estacion: 'Cocina', stock: -1, activo: true, img: '' },
  { id: 6, nombre: 'Salmón grillado', descripcion: 'Salmón con vegetales de estación.', precio: 21500, categoria: 'Platos Fuertes', estacion: 'Parrilla', dietarios: ['Sin TACC'], stock: 6, activo: true, img: '' },
  { id: 7, nombre: 'Ravioles de ricota', descripcion: 'Ravioles caseros con salsa fileto.', precio: 11800, categoria: 'Platos Fuertes', estacion: 'Cocina', dietarios: ['Vegetariano'], stock: -1, activo: true, img: '' },
  { id: 8, nombre: 'Flan casero', descripcion: 'Flan con dulce de leche y crema.', precio: 4800, categoria: 'Postres', estacion: 'Cocina', stock: 12, activo: true, img: '' },
  { id: 9, nombre: 'Volcán de chocolate', descripcion: 'Volcán con corazón de chocolate y helado.', precio: 6500, categoria: 'Postres', estacion: 'Cocina', stock: 4, activo: true, img: '' },
  { id: 10, nombre: 'Agua mineral', descripcion: 'Agua con o sin gas 500ml.', precio: 2400, categoria: 'Bebidas', estacion: 'Barra', stock: -1, activo: true, img: '' },
  { id: 11, nombre: 'Gaseosa', descripcion: 'Línea Coca-Cola 500ml.', precio: 2900, categoria: 'Bebidas', estacion: 'Barra', stock: -1, activo: true, img: '' },
  { id: 12, nombre: 'Cerveza artesanal', descripcion: 'Pinta de cerveza artesanal.', precio: 4500, categoria: 'Bebidas', estacion: 'Barra', stock: -1, activo: true, img: '' },
  { id: 13, nombre: 'Fernet con cola', descripcion: 'Fernet Branca con Coca-Cola.', precio: 6800, categoria: 'Tragos', estacion: 'Barra', stock: -1, activo: true, img: '' },
  { id: 14, nombre: 'Gin tonic', descripcion: 'Gin, tónica y limón.', precio: 7200, categoria: 'Tragos', estacion: 'Barra', stock: -1, activo: true, img: '' },
  { id: 15, nombre: 'Vino tinto (copa)', descripcion: 'Malbec de la casa.', precio: 4200, categoria: 'Tragos', estacion: 'Barra', stock: -1, activo: true, img: '' },
];

/* Las 10 paletas de fábrica — idénticas a PRESET_PALETTES del backend real
   (backend-api/src/modules/settings/settings.service.ts) */
const PALETAS_DEMO = [
  {
    id: 1, nombre: 'Claro Clasico', builtin: true, dark: false,
    colors: { bg: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A', muted: '#64748B', primary: '#2563EB', primaryText: '#FFFFFF', accent: '#16A34A', danger: '#DC2626', border: '#E2E8F0' },
  },
  {
    id: 2, nombre: 'Claro Calido', builtin: true, dark: false,
    colors: { bg: '#FFFBEB', surface: '#FFFFFF', text: '#1C1917', muted: '#78716C', primary: '#D97706', primaryText: '#FFFFFF', accent: '#059669', danger: '#DC2626', border: '#E7E5E4' },
  },
  {
    id: 3, nombre: 'Claro Menta', builtin: true, dark: false,
    colors: { bg: '#ECFDF5', surface: '#FFFFFF', text: '#064E3B', muted: '#6B7280', primary: '#059669', primaryText: '#FFFFFF', accent: '#0284C7', danger: '#DC2626', border: '#D1FAE5' },
  },
  {
    id: 4, nombre: 'Claro Minimal', builtin: true, dark: false,
    colors: { bg: '#FFFFFF', surface: '#F9FAFB', text: '#111827', muted: '#9CA3AF', primary: '#111827', primaryText: '#FFFFFF', accent: '#3B82F6', danger: '#EF4444', border: '#E5E7EB' },
  },
  {
    id: 5, nombre: 'Claro Rosa', builtin: true, dark: false,
    colors: { bg: '#FFF1F2', surface: '#FFFFFF', text: '#4C0519', muted: '#9F1239', primary: '#E11D48', primaryText: '#FFFFFF', accent: '#7C3AED', danger: '#B91C1C', border: '#FECDD3' },
  },
  {
    id: 6, nombre: 'Oscuro Medianoche', builtin: true, dark: true,
    colors: { bg: '#0F172A', surface: '#1E293B', text: '#F8FAFC', muted: '#94A3B8', primary: '#3B82F6', primaryText: '#FFFFFF', accent: '#22C55E', danger: '#EF4444', border: '#334155' },
  },
  {
    id: 7, nombre: 'Oscuro Carbon', builtin: true, dark: true,
    colors: { bg: '#18181B', surface: '#27272A', text: '#FAFAFA', muted: '#A1A1AA', primary: '#EAB308', primaryText: '#18181B', accent: '#84CC16', danger: '#F87171', border: '#3F3F46' },
  },
  {
    id: 8, nombre: 'Oscuro Azul', builtin: true, dark: true,
    colors: { bg: '#0C1222', surface: '#16203A', text: '#E2E8F0', muted: '#7C8DB0', primary: '#60A5FA', primaryText: '#0C1222', accent: '#34D399', danger: '#F87171', border: '#243050' },
  },
  {
    id: 9, nombre: 'Oscuro Bosque', builtin: true, dark: true,
    colors: { bg: '#0A1F1A', surface: '#10312A', text: '#ECFDF5', muted: '#6EE7B7', primary: '#10B981', primaryText: '#04211A', accent: '#FBBF24', danger: '#F87171', border: '#1E4D40' },
  },
  {
    id: 10, nombre: 'Oscuro Violeta', builtin: true, dark: true,
    colors: { bg: '#1A0B2E', surface: '#241044', text: '#F5F3FF', muted: '#A78BFA', primary: '#8B5CF6', primaryText: '#FFFFFF', accent: '#22D3EE', danger: '#FB7185', border: '#3B2370' },
  },
];

/* Motivos de cancelación — mismos que CANCEL_REASONS del admin real
   (frontend-admin/src/components/CancelModal.tsx). El elegido le llega
   al comensal en la pantalla de "Pedido cancelado". */
const CANCEL_REASONS_DEMO = [
  'Sin stock de un ingrediente',
  'Error en el pedido',
  'El cliente se retiró',
  'Demora excesiva',
  'Solicitado por el cliente',
  'Otro motivo',
];

const LLAMADO_LABELS = {
  BILL: 'Pide la cuenta',
  NAPKINS: 'Pide servilletas',
  CUTLERY: 'Pide cubiertos',
  ICE: 'Pide hielo',
  OTHER: 'Llama al mozo',
};

const ESTADO_LABELS = {
  RECEIVED: 'Recibido',
  PREPARING: 'En preparación',
  READY: 'Listo',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const MESA_LABELS = {
  FREE: 'Libre',
  OCCUPIED: 'Ocupada',
  WAITING: 'Pidiendo cuenta',
  CLOSING: 'Cerrando',
};

const PAGO_LABELS = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta (POS)',
  TRANSFER: 'Transferencia',
};

const ALERT_SOURCES = {
  kds: 'Cocina',
  pos: 'Caja',
  waiter: 'Mozo',
  menu: 'Carta',
  tables: 'Mesas',
  system: 'Sistema',
};
