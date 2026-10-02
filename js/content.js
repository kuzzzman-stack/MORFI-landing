/* ============================================================
   CONTENIDO EDITABLE DE LA WEB
   Cambiar aquí: contacto, precios (USD/UYU), textos.
   ============================================================ */

const CONTENT = {
  nombre: 'MORFI',
  slogan: 'Pedir nunca fue tan simple',
  descripcion:
    'Tu comensal escanea el QR de la mesa y pide desde su celular. La cocina lo ve al instante. Caja cobra e imprime el ticket. Sin apps, sin internet, sin comisiones: todo funciona en tu salón.',
  demoNota:
    'Demo interactiva del sistema real: pedí algo en la carta y mirá cómo aparece en cocina, alertas y caja.',

  contacto: {
    email: 'guzman.fdez.j@proton.me',
    asunto: 'Consulta por servicio del sistema',
    cuerpo:
      'Hola, quiero consultar por el servicio del sistema MORFI.\n\n' +
      'Nombre del negocio: \n' +
      'Ubicación: \n' +
      'Teléfono de contacto: \n\n' +
      'Dame más detalles si lo necesitas: ',
  },

  /* ---- MONEDA Y PRECIOS (editable) ----
     equipo: costo del hardware — PAGO ÚNICO.
     mensual: suscripción mensual por plan. */
  moneda: {
    inicial: 'USD', // 'USD' o 'UYU'
    simbolos: { USD: 'USD', UYU: '$U' },
    equipo: { USD: 325, UYU: 13600 },
    planes: [
      {
        id: 'basico',
        nombre: 'Básico',
        mensual: { USD: 100, UYU: 4000 },
        equipo: false,
        descripcion: 'El software completo sobre tu propio equipo.',
        puntos: ['Todos los paneles', 'Instalación guiada', 'Soporte por correo'],
      },
      {
        id: 'master',
        nombre: 'Master',
        mensual: { USD: 80, UYU: 3200 },
        equipo: true,
        descripcion: 'Equipo dedicado incluido, puesta en marcha básica.',
        puntos: ['Todos los paneles', 'Equipo dedicado incluido', 'Soporte por correo'],
      },
      {
        id: 'alivio',
        nombre: 'Alivio',
        mensual: { USD: 100, UYU: 4010 },
        equipo: true,
        destacado: true,
        descripcion: 'Equipo incluido y acompañamiento en la salida.',
        puntos: [
          'Todos los paneles',
          'Equipo dedicado incluido',
          'Puesta en marcha asistida',
          'Soporte prioritario',
        ],
      },
      {
        id: 'equilibrio',
        nombre: 'Equilibrio',
        mensual: { USD: 130, UYU: 5220 },
        equipo: true,
        descripcion: 'Equipo incluido con acompañamiento continuo.',
        puntos: [
          'Todos los paneles',
          'Equipo dedicado incluido',
          'Puesta en marcha asistida',
          'Soporte prioritario',
          'Ajustes y mejoras incluidos',
        ],
      },
    ],
    nota: 'El equipo se paga una sola vez (PAGO ÚNICO). La mensualidad cubre software y soporte.',
  },

  /* ---- Pasos: cómo funciona ---- */
  pasos: [
    {
      titulo: 'El comensal escanea',
      texto:
        'Cada mesa tiene su QR impreso. El cliente lo escanea con la cámara y entra a la carta, sin instalar nada.',
    },
    {
      titulo: 'Pide desde la carta',
      texto:
        'Carta digital con fotos, búsqueda, filtros dietarios, modificadores y notas. Confirma con método de pago y propina.',
    },
    {
      titulo: 'La cocina lo ve al instante',
      texto:
        'La comanda llega en vivo al KDS, ordenada por estación (parrilla, cocina, barra), con cronómetro y prioridad por tiempo.',
    },
    {
      titulo: 'Caja cierra la mesa',
      texto:
        'El POS muestra el mapa de mesas y el detalle de cada cuenta, imprime el ticket en la térmica y libera la mesa.',
    },
  ],

  incluye: [
    'Carta digital QR para comensales',
    'Monitor de cocina (KDS) por estaciones con cronómetro',
    'POS con mapa de mesas y cierre de cuenta',
    'Impresión térmica de tickets (ESC/POS)',
    'Llamador de mozo desde la mesa',
    'Panel de administración: menú, mesas, marca y temas',
  ],

  beneficios: [
    'Funciona sin internet: todo corre en la red local del restaurante',
    'Sin comisiones ni costo por pedido',
    'El comensal no instala ninguna app',
    'Los datos quedan en tu equipo, no en la nube de un tercero',
    'QR firmados con rotación de claves: nadie entra sin un código válido',
    'Actualizaciones en vivo: menú, marca y estado en todos los paneles',
  ],

  /* ---- Modelos de teléfono para la demo (nombre, viewport CSS px) ----
     Ordenados de más chato a más alto/angosto para que el cambio se note. */
  telefonos: [
    { nombre: 'iPhone SE', w: 375, h: 667, cam: 'muesca' },
    { nombre: 'Galaxy S24', w: 360, h: 780, cam: 'punto' },
    { nombre: 'iPhone 12 mini', w: 375, h: 812, cam: 'muesca' },
    { nombre: 'iPhone 14', w: 390, h: 844, cam: 'isla' },
    { nombre: 'Xiaomi Redmi Note 13', w: 393, h: 873, cam: 'punto' },
    { nombre: 'iPhone 16 Pro', w: 402, h: 874, cam: 'isla' },
    { nombre: 'Galaxy S24 Ultra', w: 412, h: 915, cam: 'punto' },
    { nombre: 'Motorola Edge', w: 412, h: 919, cam: 'punto' },
    { nombre: 'iPhone 16 Pro Max', w: 440, h: 956, cam: 'isla' },
    { nombre: 'Pixel 9 Pro XL', w: 448, h: 998, cam: 'punto' },
  ],

  /* ---- Iconos de comida que rotan dentro de la campana del logo ---- */
  comidas: [
    'assets/food/torta.png',
    'assets/food/pollo.png',
    'assets/food/sushi.png',
    'assets/food/fideos.png',
    'assets/food/sopa.png',
  ],

  /* ---- Redes sociales (carrusel del footer) ----
     red: 'github' | 'instagram' | 'tiktok' (ícono SVG automático).
     url: enlace al perfil — si queda vacío ('') se muestra el nombre
     sin link hasta que la cuenta exista. Agregar más líneas igual. */
  social: [
    { red: 'github', nombre: 'GitHub', url: 'https://github.com/kuzzzman-stack' },
    { red: 'instagram', nombre: 'Instagram', url: 'https://www.instagram.com/kzmn.exr/' },
    { red: 'tiktok', nombre: 'TikTok', url: '' }, // ← pegar acá el enlace de TikTok
  ],
};
