/* ============================================================
   DEMO MORFI — réplica funcional del sistema real, sin backend.
   La carta del comensal y los paneles (KDS/POS/Alertas/Admin)
   leen y escriben sobre el mismo estado compartido.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const h = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const fmt$ = (n) => '$' + Number(n).toLocaleString('es-UY');
const fmtHora = (ts) => new Date(ts).toLocaleTimeString('es-UY', { hour12: false });

/* Iconos: paths de Lucide (los mismos que usa el sistema real) */
const ICONS = {
  'menu': '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  'receipt': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'banknote': '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'trash': '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  'check-circle': '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  'circle': '<circle cx="12" cy="12" r="10"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'utensils': '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>',
  'x-circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  'camera-off': '<line x1="2" x2="22" y1="2" y2="22"/><path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"/><path d="M9.5 4h5L17 7h1a2 2 0 0 1 2 2v7.5"/><path d="M14.5 16a3 3 0 0 1-4.37-2.66"/>',
  'keyboard': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M6 12h.01"/><path d="M10 12h.01"/><path d="M14 12h.01"/><path d="M18 12h.01"/><path d="M7 16h10"/>',
  'droplets': '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  'ice-cream': '<path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/><path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/>',
  'chef-hat': '<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  'palette': '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  'store': '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  'settings-2': '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  'qr': '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H4"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  'copy': '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'pencil': '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'refresh-cw': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  'image-plus': '<path d="M16 5h6"/><path d="M19 2v6"/><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'key-round': '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  'printer': '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  'timer': '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'pin': '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1Z"/>',
  'panel-left': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const ic = (n, s = 14) =>
  `<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* Toasts: avisos breves dentro de cada pantalla (3s o click para cerrar).
   Se usan para acciones ok y para aclarar lo que en una demo no se puede
   replicar de verdad (cámara, impresora, etc.). */
function toast(msg, donde = 'panel', icono = 'check-circle') {
  const host = donde === 'carta' ? $('#phone-screen') : $('#panel-body');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'mft';
  el.innerHTML = `${ic(icono, 13)}<span></span>`;
  el.querySelector('span').textContent = msg;
  el.onclick = () => el.remove();
  host.appendChild(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3000);
}
const toastCarta = (m, i) => toast(m, 'carta', i);

/* ---------------- Estado ---------------- */

function estadoInicial() {
  const ahora = Date.now();
  const min = 60000;
  // Mesas 2..16 en Salón Principal (como el salón real de las capturas)
  const ocupadas = { 5: 22, 8: 9, 12: 14, 13: 30 };
  return {
    menu: MENU_DEMO.map((m) => ({ ...m })),
    mesas: Array.from({ length: 15 }, (_, i) => {
      const n = i + 2;
      const oc = ocupadas[n];
      return {
        id: n,
        numero: n,
        sector: 'Salón Principal',
        estado: n === 13 ? 'WAITING' : oc ? 'OCCUPIED' : 'FREE',
        desde: oc ? ahora - oc * min : null,
      };
    }),
    pedidos: [
      {
        id: 115, numero: 115, mesaId: 5, mesa: 5,
        items: [
          { id: 1, nombre: 'Milanesa napolitana', cantidad: 1, precio: 14200, mods: [], nota: '', estacion: 'Cocina' },
          { id: 2, nombre: 'Gaseosa', cantidad: 2, precio: 2900, mods: [], nota: '', estacion: 'Barra' },
        ],
        subtotal: 20000, propinaPct: 10, propina: 2000, total: 22000,
        pago: 'CARD', estado: 'READY', creado: ahora - 12 * min, motivo: '',
      },
      {
        id: 116, numero: 116, mesaId: 12, mesa: 12,
        items: [
          { id: 3, nombre: 'Provoleta', cantidad: 1, precio: 6800, mods: [], nota: '', estacion: 'Parrilla' },
          { id: 4, nombre: 'Ojo de bife', cantidad: 2, precio: 18900, mods: [{ nombre: 'Término', label: 'A punto', delta: 0 }], nota: 'Uno sin sal', estacion: 'Parrilla' },
        ],
        subtotal: 44600, propinaPct: 0, propina: 0, total: 44600,
        pago: 'CASH', estado: 'PREPARING', creado: ahora - 4 * min, motivo: '',
      },
      {
        id: 117, numero: 117, mesaId: 8, mesa: 8,
        items: [
          { id: 5, nombre: 'Agua mineral', cantidad: 1, precio: 2400, mods: [], nota: '', estacion: 'Barra' },
          { id: 6, nombre: 'Cerveza artesanal', cantidad: 1, precio: 4500, mods: [], nota: '', estacion: 'Barra' },
          { id: 7, nombre: 'Gaseosa', cantidad: 1, precio: 2900, mods: [], nota: '', estacion: 'Barra' },
        ],
        subtotal: 9800, propinaPct: 0, propina: 0, total: 9800,
        pago: 'CARD', estado: 'RECEIVED', creado: ahora - 2 * min, motivo: '',
      },
      {
        id: 114, numero: 114, mesaId: 13, mesa: 13,
        items: [
          { id: 8, nombre: 'Ravioles de ricota', cantidad: 2, precio: 11800, mods: [], nota: '', estacion: 'Cocina' },
          { id: 9, nombre: 'Vino tinto (copa)', cantidad: 2, precio: 4200, mods: [], nota: '', estacion: 'Barra' },
        ],
        subtotal: 32000, propinaPct: 0, propina: 0, total: 32000,
        pago: 'CARD', estado: 'DELIVERED', creado: ahora - 20 * min, motivo: '',
      },
    ],
    llamados: [{ id: 1, mesaId: 13, mesa: 13, tipo: 'CUTLERY', mensaje: '', creado: ahora - 2 * min, oculto: false }],
    alertas: [
      { id: 1, type: 'info', source: 'system', message: 'Sistema MORFI iniciado', ts: ahora - 30 * min, ack: false },
      { id: 2, type: 'success', source: 'kds', message: 'Nueva comanda #117 — Mesa 8.', ts: ahora - 2 * min, ack: false },
      { id: 3, type: 'warning', source: 'waiter', message: 'Mesa 13 pide cubiertos.', ts: ahora - 2 * min, ack: false },
      { id: 4, type: 'warning', source: 'pos', message: 'Mesa 13 pide la cuenta.', ts: ahora - 90 * 1000, ack: false },
    ],
    paletas: PALETAS_DEMO.map((p) => ({ ...p, colors: { ...p.colors } })),
    // mismos defaults que las capturas del sistema real
    temas: { kds: 'Oscuro Bosque', pos: 'Claro Clasico', admin: 'Oscuro Violeta', carta: 'Claro Calido' },
    branding: { nameText: 'agridulce', logoUrl: '', nameImg: '', nameMode: 'text' },
    pin: '1111',
    qrSeed: 1,
    nextPedido: 118,
    nextItem: 10,
    nextLlamado: 2,
    nextAlerta: 5,
    nextMesa: 17,
  };
}

const D = {
  s: null,
  carta: {
    screen: 'scan', sesion: false, mesaId: MESA_DEMO, code: '', scanErr: '',
    cart: [], itemSel: null, picked: {}, qty: 1, notaTmp: '',
    search: '', categoria: 'all', dietario: null,
    tip: 10, pago: 'CASH', lastOrderId: null,
    mozoSel: null, mozoSent: false, cooldownHasta: 0, exitConfirm: false,
  },
  view: 'kds',
  pinned: localStorage.getItem('morfi_pinned_panel') || null,
  showAll: false,
  kdsEst: 'Todos',
  mesaSel: null,
  confirmRelease: false,
  printing: false,
  ticket: false,
  ticketLast: false,
  pinOk: false,
  pinModal: null, // {label, cb}
  cancelTarget: null, // {pedidoId, motivo}
  admin: {
    sec: 'tables', msg: '', bulk: false, newNum: '', newSector: 'Salón Principal', customSector: '',
    bulkFrom: '', bulkTo: '', editMesa: null, editNum: '', editSector: '', mesaCopied: null, qrVer: null,
    qrList: [], qrCopied: null, rotateOpen: false, rotatePin: '', rotateErr: '', rotateOk: false,
    menuSearch: '', menuCat: 'all', form: null, renameFrom: '', renameTo: '',
    temaPanel: 'carta', palNew: false, palName: '', palDark: false, palColors: null,
    marcaName: 'agridulce', marcaMode: 'text', logoTmp: '', nameImgTmp: '',
    pinActual: '', pinNuevo: '', pinMsg: '',
  },
};

function alerta(type, source, message) {
  D.s.alertas.unshift({ id: D.s.nextAlerta++, type, source, message, ts: Date.now(), ack: false });
}

/* ---------------- PIN de administrador ---------------- */

function pinGuard(label, cb) {
  if (D.pinOk) return cb();
  D.pinModal = { label, cb };
  renderPanel();
  setTimeout(() => $('#pin-in')?.focus(), 30);
}

function pinCancel() {
  D.pinModal = null;
  renderPanel();
}

function pinCheck() {
  const v = ($('#pin-in')?.value || '').trim();
  if (v === D.s.pin) {
    const cb = D.pinModal.cb;
    D.pinModal = null;
    D.pinOk = true;
    cb();
  } else {
    const e = $('#pin-err');
    if (e) e.textContent = 'PIN incorrecto — en la demo es 1111';
    const inp = $('#pin-in');
    if (inp) inp.value = '';
    const ok = $('#pin-ok');
    if (ok) ok.disabled = true;
  }
}

function pinModalHtml() {
  if (!D.pinModal) return '';
  return `
    <div class="mf-modal-bg" onclick="pinCancel()">
      <div class="mf-modal mf-pinbox" onclick="event.stopPropagation()">
        <div class="mf-pinlock"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div>
        <p class="mf-modal-t">PIN de administrador</p>
        <p class="mf-hint mb-2">${h(D.pinModal.label)} (demo: 1111)</p>
        <input id="pin-in" class="mf-in mf-pin-in" type="password" inputmode="numeric" maxlength="8"
               placeholder="PIN" autocomplete="off"
               oninput="this.value=this.value.replace(/\\D/g,'');document.getElementById('pin-ok').disabled=this.value.length<4"
               onkeydown="if(event.key==='Enter'&&!document.getElementById('pin-ok').disabled)pinCheck()">
        <p id="pin-err" class="mf-err"></p>
        <button id="pin-ok" class="mf-btn mf-btn-blue w-100" disabled onclick="pinCheck()">Confirmar</button>
        <button class="mf-btn mf-btn-ghost w-100 mt-2" onclick="pinCancel()">Cancelar</button>
      </div>
    </div>`;
}

/* ---------------- Acciones compartidas ---------------- */

function setEstadoPedido(id, estado, motivo) {
  const p = D.s.pedidos.find((o) => o.id === id);
  if (!p) return;
  p.estado = estado;
  p.motivo = motivo || '';
  const tipo = estado === 'CANCELLED' ? 'warning' : estado === 'DELIVERED' ? 'success' : 'info';
  alerta(tipo, 'kds', `Comanda #${p.numero} → ${ESTADO_LABELS[estado]} (Mesa ${p.mesa}).`);
  renderTodo();
}

/* Cancelación con motivo — igual que CancelModal del sistema real:
   el motivo elegido le llega al comensal en su pantalla. */
function cancelarPedido(id) {
  D.cancelTarget = { pedidoId: id, motivo: '' };
  renderPanel();
}
function cancelarConfirm() {
  const t = D.cancelTarget;
  if (!t || !t.motivo) return;
  const p = D.s.pedidos.find((o) => o.id === t.pedidoId);
  D.cancelTarget = null;
  if (p) {
    setEstadoPedido(p.id, 'CANCELLED', t.motivo);
    alerta('warning', 'kds', `Comanda #${p.numero} cancelada: ${t.motivo}.`);
  }
  renderTodo();
}
function cancelModalHtml() {
  const t = D.cancelTarget;
  if (!t) return '';
  const p = D.s.pedidos.find((o) => o.id === t.pedidoId);
  if (!p) return '';
  return `
    <div class="mf-modal-bg" onclick="D.cancelTarget=null;renderPanel()">
      <div class="mf-modal" style="max-width:330px" onclick="event.stopPropagation()">
        <div class="mf-row mb-2" style="gap:8px;flex-wrap:nowrap">
          <span class="cancel-ico">${ic('x-circle', 18)}</span>
          <p class="mf-modal-t">Cancelar comanda #${p.numero}</p>
        </div>
        <p class="mf-hint mb-3">Elegí el motivo — el comensal lo verá en su pantalla.</p>
        <div class="cancel-list">
          ${CANCEL_REASONS_DEMO.map(
            (r) => `<button class="cancel-r ${t.motivo === r ? 'on' : ''}" onclick="D.cancelTarget.motivo='${h(r)}';renderPanel()">${r}</button>`,
          ).join('')}
        </div>
        <div class="mf-row mt-3">
          <button class="mf-btn mf-btn-ghost" style="flex:1" onclick="D.cancelTarget=null;renderPanel()">Volver</button>
          <button class="mf-btn mf-btn-red" style="flex:1" ${t.motivo ? '' : 'disabled'} onclick="cancelarConfirm()">Confirmar cancelación</button>
        </div>
      </div>
    </div>`;
}

function llamarMozo(tipo, mensaje) {
  const mesa = D.s.mesas.find((m) => m.id === D.carta.mesaId);
  D.s.llamados.unshift({ id: D.s.nextLlamado++, mesaId: mesa.id, mesa: mesa.numero, tipo, mensaje: mensaje || '', creado: Date.now(), oculto: false });
  alerta('warning', 'waiter', `Mesa ${mesa.numero}: ${LLAMADO_LABELS[tipo].toLowerCase()}${mensaje ? ` — "${mensaje}"` : ''}.`);
  if (tipo === 'BILL') {
    mesa.estado = 'WAITING';
    alerta('warning', 'pos', `Mesa ${mesa.numero} pide la cuenta.`);
  }
  renderTodo();
}

function resolverLlamado(id) {
  const c = D.s.llamados.find((x) => x.id === id);
  D.s.llamados = D.s.llamados.filter((x) => x.id !== id);
  if (c) alerta('success', 'waiter', `Llamado de Mesa ${c.mesa} atendido.`);
  renderTodo();
}

function ocultarLlamado(id) {
  const c = D.s.llamados.find((x) => x.id === id);
  if (c) c.oculto = true;
  renderPanel();
}

function liberarMesa(mesaId) {
  const mesa = D.s.mesas.find((m) => m.id === mesaId);
  if (!mesa) return;
  mesa.estado = 'FREE';
  mesa.desde = null;
  D.s.llamados = D.s.llamados.filter((c) => c.mesaId !== mesaId);
  alerta('info', 'pos', `Mesa ${mesa.numero} liberada — la sesión del comensal se cerró.`);
  if (D.carta.mesaId === mesaId) {
    Object.assign(D.carta, {
      sesion: false, screen: 'scan', cart: [], lastOrderId: null,
      mozoSent: false, exitConfirm: false, itemSel: null,
    });
  }
  renderTodo();
}

/* "Salir de mesa" del comensal: cierra su sesión pero la mesa sigue
   ocupada hasta que la caja la libere (como en el sistema real). */
function cartaSalirMesa() {
  const mesa = D.s.mesas.find((m) => m.id === D.carta.mesaId);
  Object.assign(D.carta, {
    sesion: false, screen: 'scan', code: '', scanErr: '', cart: [],
    itemSel: null, lastOrderId: null, mozoSel: null, mozoSent: false,
    cooldownHasta: 0, exitConfirm: false,
  });
  if (mesa) alerta('info', 'menu', `Mesa ${mesa.numero}: el comensal salió de su sesión.`);
  renderTodo();
}

function sentarMesa(mesaId) {
  const mesa = D.s.mesas.find((m) => m.id === mesaId) || D.s.mesas[0];
  D.carta.mesaId = mesa.id;
  if (mesa.estado === 'FREE') {
    mesa.estado = 'OCCUPIED';
    mesa.desde = Date.now();
  }
  D.carta.sesion = true;
  alerta('info', 'menu', `Mesa ${mesa.numero} abrió la carta digital.`);
  renderTodo();
}

function resetDemo() {
  D.s = estadoInicial();
  Object.assign(D.carta, { screen: 'scan', sesion: false, mesaId: MESA_DEMO, code: '', scanErr: '', cart: [], itemSel: null, lastOrderId: null, mozoSel: null, mozoSent: false, cooldownHasta: 0, exitConfirm: false, search: '', categoria: 'all', dietario: null, tip: 10, pago: 'CASH' });
  Object.assign(D, { mesaSel: null, confirmRelease: false, printing: false, ticket: false, ticketLast: false, pinOk: false, pinModal: null, cancelTarget: null });
  D.admin.palColors = null;
  renderTodo();
}

/* ---------------- Tema aplicado (--pv-*) ---------------- */

function pv(view) {
  const p = D.s.paletas.find((x) => x.nombre === D.s.temas[view]);
  if (!p) return '';
  const c = p.colors;
  return `--pv-bg:${c.bg};--pv-surface:${c.surface};--pv-text:${c.text};--pv-muted:${c.muted};--pv-primary:${c.primary};--pv-primaryText:${c.primaryText};--pv-accent:${c.accent};--pv-danger:${c.danger};--pv-border:${c.border}`;
}

/* ============================================================
   CARTA — réplica de frontend-client
   ============================================================ */

function renderCarta() {
  const el = $('#carta-screen');
  if (!el) return;
  const c = D.carta;
  if (!c.sesion) c.screen = 'scan';
  const mesa = D.s.mesas.find((m) => m.id === c.mesaId);
  const screens = { scan: renderScan, welcome: renderBienvenida, menu: renderMenu, summary: renderResumen, confirmation: renderConfirmacion, waiter: renderMozo };
  el.innerHTML = (screens[c.screen] || renderScan)(mesa);
}

function cartaGo(screen) {
  D.carta.screen = screen;
  renderCarta();
}

/* ---- Scan: QR o código manual — réplica de ScanScreen.tsx ---- */
function renderScan() {
  const c = D.carta;
  const ok = /^\d{1,3}-[0-9A-F]{6}$/.test(c.code.trim());
  return `
  <div class="ct-light ct-col ct-scan" style="${pv('carta')}">
    <div class="ct-scan-in">
      <div class="ct-scan-brand">
        <img src="assets/logo.png" alt="MORFI">
        <p>Carta Digital</p>
      </div>
      <button class="ct-cam" onclick="cartaScanSim()" title="En la demo, tocar simula el escaneo">
        ${ic('camera-off', 30)}
        <span class="ct-cam-off">Cámara no disponible</span>
        <span class="ct-cam-sim">tocar = escanear QR (demo)</span>
      </button>
      <p class="ct-cam-note">Apunte la cámara al código QR de su mesa</p>
      <p class="ct-code-label">${ic('keyboard', 12)} O INGRESE EL CODIGO DE LA MESA</p>
      <input class="ct-code-in" placeholder="Ej: 5-A1B2C3" value="${h(c.code)}" maxlength="9"
             oninput="D.carta.code=this.value.toUpperCase().replace(/[^0-9A-F-]/g,''); this.value=D.carta.code"
             onkeydown="if(event.key==='Enter')cartaScanCode()">
      <button class="ct-btn ct-btn-primary" ${ok ? '' : 'disabled'} onclick="cartaScanCode()">Ingresar a la mesa</button>
      ${c.scanErr ? `<p class="ct-error">${h(c.scanErr)}</p>` : ''}
      <p class="ct-scan-hint">Demo: toque el visor negro para simular el escaneo del QR, o escriba <b>2-A1B2C3</b>.</p>
    </div>
  </div>`;
}

function cartaScanSim() {
  D.carta.scanErr = '';
  sentarMesa(MESA_DEMO);
  toastCarta('QR escaneado (simulado)', 'qr');
  cartaGo('welcome');
}

function cartaScanCode() {
  const code = D.carta.code.trim().toUpperCase();
  if (!/^\d{1,3}-[0-9A-F]{6}$/.test(code)) {
    D.carta.scanErr = 'Formato: NUMERO-CODIGO (ej: 5-A1B2C3). Lo encuentra junto al QR de su mesa.';
    renderCarta();
    return;
  }
  const n = parseInt(code.split('-')[0], 10);
  const mesa = D.s.mesas.find((m) => m.numero === n);
  if (!mesa) {
    D.carta.scanErr = 'Código inválido — esa mesa no existe.';
    renderCarta();
    return;
  }
  D.carta.scanErr = '';
  sentarMesa(mesa.id);
  cartaGo('welcome');
}

/* ---- Welcome — réplica de WelcomeScreen.tsx ---- */
function renderBienvenida(mesa) {
  const b = D.s.branding;
  const nombre = b.nameText || 'MORFI';
  const p = D.s.pedidos.find((o) => o.id === D.carta.lastOrderId);
  const enCurso = p && p.estado !== 'DELIVERED' && p.estado !== 'CANCELLED';
  const exit = D.carta.exitConfirm;
  return `
  <div class="ct-light ct-col-between ct-welcome" style="${pv('carta')}">
    <div class="ct-brand">
      <div class="ct-logo"><img src="${b.logoUrl || 'assets/logo.png'}" alt="Logo"></div>
      <p class="ct-caption">RESTAURANTE</p>
      ${b.nameMode === 'image' && b.nameImg ? `<img class="ct-nameimg" src="${b.nameImg}" alt="${h(nombre)}">` : `<p class="ct-name">${h(nombre)}</p>`}
    </div>
    <div class="ct-mid">
      <div class="ct-mesa-card">
        <p class="ct-mesa-label">SU MESA</p>
        <p class="ct-mesa-num">#${String(mesa.numero).padStart(2, '0')}</p>
      </div>
      <p class="ct-hola">Hola</p>
      <p class="ct-sub2">Bienvenido a tu mesa</p>
      <p class="ct-p">Explorá la carta, pedí y seguí el estado de tu orden en vivo.</p>
    </div>
    <div class="ct-actions">
      <button class="ct-btn ct-btn-primary" onclick="cartaGo('menu')">${ic('menu', 16)} Explorar Carta Digital</button>
      ${enCurso ? `<button class="ct-btn ct-btn-accent2" onclick="cartaGo('confirmation')">${ic('receipt', 16)} Ver mi pedido #${p.numero} en curso</button>` : ''}
      <button class="ct-btn ct-btn-outline2" onclick="cartaGo('waiter')">${ic('bell', 16)} Llamar al Mozo</button>
      ${
        exit
          ? `<div class="ct-exitbox">
               <p>¿Cerrar la sesión de la mesa?<br><span>Para volver a pedir habrá que escanear el QR de nuevo.</span></p>
               <div class="ct-row2">
                 <button class="ct-btn ct-btn-danger" onclick="cartaSalirMesa()">Sí, salir de la mesa</button>
                 <button class="ct-btn ct-btn-ghost2" onclick="D.carta.exitConfirm=false;renderCarta()">Quedarme</button>
               </div>
             </div>`
          : `<button class="ct-exit" onclick="D.carta.exitConfirm=true;renderCarta()">${ic('log-out', 14)} Salir de mesa</button>`
      }
    </div>
  </div>`;
}

/* ---- Menú: grilla 2 col con imágenes ---- */
function cartaItems() {
  const c = D.carta;
  return D.s.menu.filter(
    (m) =>
      m.activo &&
      (c.categoria === 'all' || m.categoria === c.categoria) &&
      (!c.dietario || (m.dietarios || []).some((t) => t.includes(c.dietario))) &&
      (!c.search ||
        m.nombre.toLowerCase().includes(c.search.toLowerCase()) ||
        m.descripcion.toLowerCase().includes(c.search.toLowerCase())),
  );
}

function renderMenu(mesa) {
  const c = D.carta;
  const cats = [...new Set(D.s.menu.filter((m) => m.activo).map((m) => m.categoria))];
  const items = cartaItems();
  const cartCount = c.cart.reduce((s, i) => s + i.cantidad, 0);
  const cartTotal = c.cart.reduce((s, i) => s + i.precio * i.cantidad, 0);

  return `
  <div class="ct-light ct-col" style="${pv('carta')}">
    <div class="ct-menu-head">
      <div class="ct-search-row">
        <button class="ct-back" onclick="cartaGo('welcome')">${ic('arrow-left', 15)}</button>
        <div class="ct-search-wrap">
          ${ic('search', 13)}
          <input class="ct-search" placeholder="Buscar en la carta..." value="${h(c.search)}"
                 oninput="D.carta.search=this.value; renderMenuList()">
        </div>
        <span class="ct-mesa-badge">Mesa ${String(mesa.numero).padStart(2, '0')}</span>
      </div>
      <div class="ct-chips">
        ${['all', ...cats]
          .map(
            (k) =>
              `<button class="ct-chip ${c.categoria === k ? 'on' : ''}" onclick="cartaCat('${h(k)}')">${k === 'all' ? 'Todo' : h(k)}</button>`,
          )
          .join('')}
      </div>
      <div class="ct-chips">
        ${['Sin TACC', 'Vegano', 'Vegetariano']
          .map(
            (d) =>
              `<button class="ct-chip ct-chip-diet ${c.dietario === d ? 'on' : ''}" onclick="cartaDiet('${d}')">${d}</button>`,
          )
          .join('')}
      </div>
    </div>
    <div class="ct-grid" id="carta-list">${menuListHtml(items)}</div>
    ${
      cartCount > 0
        ? `<div class="ct-cartwrap"><button class="ct-cartbar2" onclick="cartaGo('summary')">${ic('shopping-bag', 15)}<span>Ver mi pedido (${cartCount})</span><b>${fmt$(cartTotal)}</b></button></div>`
        : ''
    }
    <div id="carta-modal"></div>
  </div>`;
}

function prodCard(m) {
  return `
    <button class="ct-prod" ${m.stock === 0 ? 'disabled' : ''} onclick="cartaAbrir(${m.id})">
      <div class="ct-prod-img">
        <img src="${m.img ? h(m.img) : 'assets/logo.png'}" alt="${h(m.nombre)}" loading="lazy"
             class="${m.img ? '' : 'ct-prod-logo'}"
             onerror="if(this.dataset.f!=='1'){this.dataset.f='1';this.src='assets/logo.png';this.classList.add('ct-prod-logo')}">
      </div>
      <div class="ct-prod-body">
        <p class="ct-prod-name">${h(m.nombre)}</p>
        <div class="ct-prod-tags">${(m.dietarios || []).map((t) => `<span>${h(t)}</span>`).join('')}</div>
        <div class="ct-prod-foot">
          <b>${fmt$(m.precio)}</b>
          <span class="ct-plus">${ic('plus', 15)}</span>
        </div>
        ${m.stock === 0 ? '<p class="ct-agotado">Agotado</p>' : ''}
      </div>
    </button>`;
}

/* Con el filtro "Todo" se muestran las categorías una debajo de la otra,
   como en la carta real; con un filtro elegido, grilla plana. */
function menuListHtml(items) {
  if (!items.length) return `<p class="ct-empty">Sin resultados</p>`;
  if (D.carta.categoria !== 'all') return `<div class="ct-cat-grid">${items.map(prodCard).join('')}</div>`;
  return [...new Set(items.map((m) => m.categoria))]
    .map(
      (cat) => `
      <div class="ct-cat-group">
        <p class="ct-cat-h">${h(cat)}</p>
        <div class="ct-cat-grid">${items.filter((m) => m.categoria === cat).map(prodCard).join('')}</div>
      </div>`,
    )
    .join('');
}

function renderMenuList() {
  const el = $('#carta-list');
  if (el) el.innerHTML = menuListHtml(cartaItems());
}

function cartaCat(k) {
  D.carta.categoria = k;
  renderCarta();
}
function cartaDiet(d) {
  D.carta.dietario = D.carta.dietario === d ? null : d;
  renderCarta();
}

/* ---- Modal de producto (bottom sheet) ---- */
function cartaAbrir(id) {
  D.carta.itemSel = id;
  D.carta.picked = {};
  D.carta.qty = 1;
  D.carta.notaTmp = '';
  renderModal();
}

function renderModal() {
  const wrap = $('#carta-modal');
  if (!wrap) return;
  const item = D.s.menu.find((m) => m.id === D.carta.itemSel);
  if (!item) {
    wrap.innerHTML = '';
    return;
  }
  const mods = item.modificadores || [];
  const elegidos = Object.values(D.carta.picked).flat();
  const unit = item.precio + elegidos.reduce((s, m) => s + m.delta, 0);
  const faltaReq = mods.filter((g) => g.requerido && !(D.carta.picked[g.nombre] || []).length).length > 0;

  wrap.innerHTML = `
    <div class="ct-modal-bg" onclick="cartaCerrar()">
      <div class="ct-sheet" onclick="event.stopPropagation()">
        <div class="ct-sheet-img">
          <img src="${item.img ? h(item.img) : 'assets/logo.png'}" alt="${h(item.nombre)}"
               class="${item.img ? '' : 'ct-prod-logo'}"
               onerror="if(this.dataset.f!=='1'){this.dataset.f='1';this.src='assets/logo.png';this.classList.add('ct-prod-logo')}">
          <button class="ct-sheet-x" onclick="cartaCerrar()">${ic('x', 16)}</button>
        </div>
        <div class="ct-sheet-body">
          <p class="ct-sheet-name">${h(item.nombre)}</p>
          <p class="ct-item-desc">${h(item.descripcion)}</p>
          ${mods
            .map(
              (g) => `
            <div class="ct-sheet-group">
              <p class="ct-group">${h(g.nombre)}${g.requerido ? ' <span class="ct-req">*</span>' : ''}</p>
              ${g.opciones
                .map((o) => {
                  const on = (D.carta.picked[g.nombre] || []).some((x) => x.label === o.label);
                  return `<button class="ct-opt ${on ? 'on' : ''}" onclick="cartaPick('${h(g.nombre)}','${h(o.label)}',${o.delta},${g.requerido ? 1 : 0})">
                    <span>${h(o.label)}</span>${o.delta ? `<span class="ct-opt-d">+${fmt$(o.delta)}</span>` : ''}
                  </button>`;
                })
                .join('')}
            </div>`,
            )
            .join('')}
          <p class="ct-group">Notas a la cocina</p>
          <textarea class="ct-note2" rows="2" placeholder="Ej: sin sal, sin cebolla..."
                    oninput="D.carta.notaTmp=this.value">${h(D.carta.notaTmp)}</textarea>
          <div class="ct-sheet-foot">
            <div class="ct-qty">
              <button onclick="cartaQty(-1)">${ic('minus', 14)}</button>
              <b>${D.carta.qty}</b>
              <button onclick="cartaQty(1)">${ic('plus', 14)}</button>
            </div>
          </div>
          <button class="ct-btn ct-btn-primary" ${faltaReq ? 'disabled' : ''} onclick="cartaAdd()">Agregar al pedido — ${fmt$(unit * D.carta.qty)}</button>
          ${faltaReq ? '<p class="ct-error">Seleccione las opciones obligatorias marcadas con *</p>' : ''}
        </div>
      </div>
    </div>`;
}

function cartaCerrar() {
  D.carta.itemSel = null;
  renderModal();
}
function cartaQty(d) {
  const item = D.s.menu.find((m) => m.id === D.carta.itemSel);
  const max = item && item.stock >= 0 ? Math.max(1, item.stock) : 20;
  D.carta.qty = Math.min(max, Math.max(1, D.carta.qty + d));
  renderModal();
}
function cartaPick(grupo, label, delta, requerido) {
  const cur = D.carta.picked[grupo] || [];
  if (requerido) {
    D.carta.picked[grupo] = [{ nombre: grupo, label, delta }];
  } else {
    D.carta.picked[grupo] = cur.some((x) => x.label === label)
      ? cur.filter((x) => x.label !== label)
      : [...cur, { nombre: grupo, label, delta }];
  }
  renderModal();
}
function cartaAdd() {
  const item = D.s.menu.find((m) => m.id === D.carta.itemSel);
  const falta = (item.modificadores || []).filter((g) => g.requerido && !(D.carta.picked[g.nombre] || []).length);
  if (falta.length) return;
  const nota = (D.carta.notaTmp || '').trim();
  const mods = Object.values(D.carta.picked).flat();
  const precio = item.precio + mods.reduce((s, m) => s + m.delta, 0);
  D.carta.cart.push({ menuItemId: item.id, nombre: item.nombre, cantidad: D.carta.qty, precio, mods, nota });
  D.carta.itemSel = null;
  renderCarta();
  toastCarta('Guardado con éxito');
}

/* ---- Resumen ---- */
function cartaRm(i) {
  D.carta.cart.splice(i, 1);
  renderCarta();
}
function cartaTip(t) {
  D.carta.tip = t;
  renderCarta();
}
function cartaPago(p) {
  D.carta.pago = p;
  renderCarta();
}
function cartaConfirm() {
  const c = D.carta;
  if (!c.cart.length) return;
  const sinStock = c.cart.filter((i) => {
    const m = D.s.menu.find((x) => x.id === i.menuItemId);
    return m && m.stock >= 0 && m.stock < i.cantidad;
  });
  if (sinStock.length) {
    alerta('error', 'menu', `Sin stock: ${sinStock.map((i) => i.nombre).join(', ')}.`);
    renderTodo();
    return;
  }
  c.cart.forEach((i) => {
    const m = D.s.menu.find((x) => x.id === i.menuItemId);
    if (m && m.stock > 0) m.stock = Math.max(0, m.stock - i.cantidad);
  });
  const mesa = D.s.mesas.find((m) => m.id === c.mesaId);
  const items = c.cart.map((it, i) => {
    const mi = D.s.menu.find((m) => m.id === it.menuItemId);
    return { id: D.s.nextItem + i, nombre: it.nombre, cantidad: it.cantidad, precio: it.precio, mods: it.mods, nota: it.nota, estacion: mi ? mi.estacion : 'Cocina' };
  });
  D.s.nextItem += items.length;
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const propina = Math.round((subtotal * c.tip) / 100);
  const pedido = {
    id: D.s.nextPedido, numero: D.s.nextPedido++, mesaId: mesa.id, mesa: mesa.numero,
    items, subtotal, propinaPct: c.tip, propina, total: subtotal + propina,
    pago: c.pago, estado: 'RECEIVED', creado: Date.now(),
  };
  D.s.pedidos.unshift(pedido);
  c.lastOrderId = pedido.id;
  c.cart = [];
  c.screen = 'confirmation';
  alerta('success', 'kds', `Nueva comanda #${pedido.numero} — Mesa ${mesa.numero}.`);
  renderTodo();
}

function renderResumen() {
  const c = D.carta;
  const sub = c.cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const propina = Math.round((sub * c.tip) / 100);
  const PAYS = [['CASH', 'Efectivo', 'banknote'], ['CARD', 'Tarjeta (POS)', 'credit-card'], ['TRANSFER', 'Transferencia', 'send']];
  return `
  <div class="ct-light ct-col ct-sum" style="${pv('carta')}">
    <div class="ct-subhead">
      <button class="ct-back" onclick="cartaGo('menu')">${ic('arrow-left', 15)}</button>
      <p class="ct-subhead-t">Resumen del pedido</p>
    </div>
    <div class="ct-scroll">
      <div class="ct-card">
        ${c.cart
          .map(
            (i, idx) => `
          <div class="ct-line">
            <div class="ct-line-info">
              <p>${i.cantidad}x ${h(i.nombre)}</p>
              ${i.mods.map((m) => `<span>+ ${h(m.label)}</span>`).join('')}
              ${i.nota ? `<span class="ct-note-line">Nota: ${h(i.nota)}</span>` : ''}
            </div>
            <div class="ct-line-side">
              <b>${fmt$(i.precio * i.cantidad)}</b>
              <button class="ct-trash" onclick="cartaRm(${idx})">${ic('trash', 14)}</button>
            </div>
          </div>`,
          )
          .join('') || '<p class="ct-empty">El pedido está vacío</p>'}
      </div>
      <div class="ct-card">
        <p class="ct-card-t">Propina sugerida</p>
        <div class="ct-chips">
          ${[0, 10, 15]
            .map((t) => `<button class="ct-chip ct-flex1 ${c.tip === t ? 'on' : ''}" onclick="cartaTip(${t})">${t}%</button>`)
            .join('')}
        </div>
      </div>
      <div class="ct-card">
        <p class="ct-card-t">Método de pago</p>
        <div class="ct-pays">
          ${PAYS
            .map(([k, l, icn]) => `<button class="ct-pay ${c.pago === k ? 'on' : ''}" onclick="cartaPago('${k}')">${ic(icn, 15)}<span>${l}</span></button>`)
            .join('')}
        </div>
      </div>
      <div class="ct-card ct-totals">
        <div><span>Subtotal</span><span>${fmt$(sub)}</span></div>
        <div><span>Propina (${c.tip}%)</span><span>${fmt$(propina)}</span></div>
        <div class="ct-total"><span>Total</span><span>${fmt$(sub + propina)}</span></div>
      </div>
      <button class="ct-btn ct-btn-primary ct-flex1" ${c.cart.length ? '' : 'disabled'} onclick="cartaConfirm()">Confirmar Pedido</button>
    </div>
  </div>`;
}

/* ---- Confirmación con seguimiento en vivo — ConfirmationScreen.tsx ---- */
function renderConfirmacion(mesa) {
  const p = D.s.pedidos.find((o) => o.id === D.carta.lastOrderId);

  /* Pedido cancelado desde KDS/POS: el motivo elegido se muestra acá */
  if (p && p.estado === 'CANCELLED') {
    return `
    <div class="ct-light ct-col ct-conf" style="${pv('carta')}">
      <div class="ct-scroll ct-conf-in">
        <div class="ct-ok ct-ok-x">${ic('x-circle', 44)}</div>
        <p class="ct-h2">Pedido cancelado</p>
        <p class="ct-p">Orden <b>#${p.numero}</b></p>
        <div class="ct-card ct-cancelbox">
          <p class="ct-card-t">Motivo</p>
          <p>${h(p.motivo || 'Sin motivo especificado')}</p>
        </div>
        <div class="ct-card ct-totals">
          <div><span>Total</span><b>${fmt$(p.total)}</b></div>
        </div>
        <button class="ct-btn ct-btn-primary ct-flex1" onclick="cartaGo('menu')">${ic('utensils', 15)} Realizar un nuevo pedido</button>
        <button class="ct-btn ct-btn-ghost2 ct-flex1" onclick="cartaSalirMesa()">${ic('log-out', 15)} Salir de la mesa</button>
      </div>
    </div>`;
  }

  const STEPS = [
    ['RECEIVED', 'Recibido'],
    ['PREPARING', 'En Cocina'],
    ['READY', 'Listo'],
    ['DELIVERED', 'Entregado'],
  ];
  const idx = p ? STEPS.findIndex((s) => s[0] === p.estado) : -1;
  const entregado = idx === 3;
  return `
  <div class="ct-light ct-col ct-conf" style="${pv('carta')}">
    <div class="ct-scroll ct-conf-in">
      <div class="ct-ok">${ic('check-circle', 44)}</div>
      <p class="ct-h2">Pedido confirmado</p>
      <p class="ct-p">Orden <b>#${p ? p.numero : '—'}</b></p>
      <div class="ct-card ct-steps">
        <p class="ct-steps-t">Estado del pedido</p>
        ${STEPS.map(
          ([k, l], i) => `
          <div class="ct-step ${i <= idx ? 'done' : ''}">
            <span class="ct-step-dot">${i <= idx ? ic('check-circle', 16) : ic('circle', 16)}</span><span>${l}</span>
          </div>`,
        ).join('')}
      </div>
      <p class="ct-p ct-small">${ic('clock', 12)} Estimado: 15-20 minutos</p>
      <div class="ct-card ct-totals">
        <div><span>Total</span><b>${p ? fmt$(p.total) : '—'}</b></div>
        <div><span>Pago</span><span>${p ? PAGO_LABELS[p.pago] : '—'}</span></div>
      </div>
      <p class="ct-p ct-xsmall">Por seguridad, para hacer un nuevo pedido deberá escanear nuevamente el código QR de su mesa.</p>
      ${entregado
        ? `<button class="ct-btn ct-btn-primary ct-flex1" onclick="pedirCuenta()">${ic('banknote', 15)} Pedir la cuenta</button>`
        : `<button class="ct-btn ct-btn-primary ct-flex1" onclick="cartaGo('menu')">${ic('utensils', 15)} Seguir pidiendo</button>`}
      <button class="ct-btn ct-btn-ghost2 ct-flex1" onclick="cartaGo('welcome')">${ic('home', 15)} Volver al inicio de mi mesa</button>
    </div>
  </div>`;
}

function pedirCuenta() {
  llamarMozo('BILL');
  toastCarta('Se avisó a caja: querés la cuenta', 'banknote');
  cartaGo('welcome');
}

/* ---- Mozo — WaiterScreen.tsx ---- */
const QUICK_CALLS = [
  ['BILL', 'Pedir la cuenta', 'banknote'],
  ['NAPKINS', 'Servilletas', 'droplets'],
  ['CUTLERY', 'Cubiertos', 'utensils'],
  ['ICE', 'Más hielo', 'ice-cream'],
];

function renderMozo() {
  const c = D.carta;
  const mesa = D.s.mesas.find((m) => m.id === c.mesaId);
  const cd = Math.max(0, Math.ceil((c.cooldownHasta - Date.now()) / 1000));
  return `
  <div class="ct-light ct-col ct-sum" style="${pv('carta')}">
    <div class="ct-subhead">
      <button class="ct-back" onclick="cartaGo('welcome')">${ic('arrow-left', 15)}</button>
      <p class="ct-subhead-t">Llamar al Mozo</p>
    </div>
    <div class="ct-scroll">
      ${
        c.mozoSent
          ? `
        <div class="ct-sentbox">
          <span class="ct-sent-ico">${ic('check-circle', 34)}</span>
          <p><b>Mozo notificado</b><br>en camino a la Mesa ${String(mesa.numero).padStart(2, '0')}</p>
          ${cd > 0
            ? `<span class="ct-cd">Podés volver a llamar en <b data-cd="${c.cooldownHasta}">${cd}s</b></span>`
            : `<button class="ct-btn ct-btn-outline2 ct-flex1" onclick="D.carta.mozoSent=false;renderCarta()">Enviar otra solicitud</button>`}
          <button class="ct-btn ct-btn-primary ct-flex1" onclick="cartaGo('menu')">Volver a la carta</button>
        </div>`
          : `
        <div class="ct-quick">
          ${QUICK_CALLS
            .map(
              ([k, l, icn]) =>
                `<button class="ct-quick-btn ${c.mozoSel === k ? 'on' : ''}" onclick="D.carta.mozoSel='${k}';renderCarta()">${ic(icn, 22)}<span>${l}</span></button>`,
            )
            .join('')}
        </div>
        <textarea id="mozo-msg" class="ct-note2" rows="2" placeholder="Mensaje opcional..."></textarea>
        <button class="ct-btn ct-btn-primary ct-flex1" ${!c.mozoSel || cd > 0 ? 'disabled' : ''} onclick="cartaMozoSend()">
          ${cd > 0 ? `Esperar <span data-cd="${c.cooldownHasta}">${cd}</span>s` : `${ic('send', 14)} Enviar Solicitud`}
        </button>`
      }
    </div>
  </div>`;
}

function cartaMozoSend() {
  if (!D.carta.mozoSel) return;
  const msg = ($('#mozo-msg')?.value || '').trim();
  llamarMozo(D.carta.mozoSel, msg);
  D.carta.mozoSent = true;
  D.carta.cooldownHasta = Date.now() + 120000;
  D.carta.mozoSel = null;
  renderCarta();
}

/* ============================================================
   PANELES — réplica de frontend-admin
   ============================================================ */

function urgencia(creado) {
  const m = (Date.now() - creado) / 60000;
  return m > 20 ? 'urg-3' : m > 10 ? 'urg-2' : 'urg-1';
}

function elapsedTxt(creado) {
  const t = Math.max(0, (Date.now() - creado) / 60000);
  return `${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * 60)).padStart(2, '0')}`;
}

function fmtDur(desde) {
  if (!desde) return '';
  const m = Math.floor((Date.now() - desde) / 60000);
  if (m < 1) return '<1m';
  if (m < 60) return m + 'm';
  return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
}

/* ---- KDS ---- */
function renderKds() {
  const cols = [
    ['RECEIVED', 'Recibidos'],
    ['PREPARING', 'En preparación'],
    ['READY', 'Listos'],
  ];
  const activos = D.s.pedidos.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.estado));
  const visibles =
    D.kdsEst === 'Todos' ? activos : activos.filter((o) => o.items.some((i) => i.estacion === D.kdsEst));

  return `
    <div class="kds" style="${pv('kds')}">
      <div class="kds-head">
        <div class="kds-stations">
          ${['Todos', 'Parrilla', 'Cocina', 'Barra']
            .map((s) => `<button class="kds-chip ${D.kdsEst === s ? 'on' : ''}" onclick="kdsEstacion('${s}')">${s}</button>`)
            .join('')}
        </div>
        <p class="kds-clock" id="kds-clock">${fmtHora(Date.now())}</p>
      </div>
      <div class="kds-cols">
        ${cols
          .map(([key, label]) => {
            const list = visibles.filter((o) => o.estado === key);
            return `
          <div class="kds-col">
            <h4>${label} <span>(${list.length})</span></h4>
            <div class="kds-col-list">
            ${list
              .map(
                (o) => `
              <div class="kds-card ${urgencia(o.creado)}">
                <div class="kds-card-head">
                  <div><b>Mesa ${o.mesa}</b> <span class="kds-num">· #${o.numero}</span></div>
                  <span class="kds-time" data-elapsed="${o.creado}">${elapsedTxt(o.creado)}</span>
                </div>
                <ul>
                  ${o.items
                    .filter((i) => D.kdsEst === 'Todos' || i.estacion === D.kdsEst)
                    .map(
                      (i) => `
                    <li>
                      <b>${i.cantidad}x ${h(i.nombre)}</b> <em>${h(i.estacion)}</em>
                      ${i.mods.map((m) => `<span class="kds-mod">+ ${h(m.label)}</span>`).join('')}
                      ${i.nota ? `<span class="kds-nota">NOTA: ${h(i.nota)}</span>` : ''}
                    </li>`,
                    )
                    .join('')}
                </ul>
                <div class="kds-actions">
                  ${
                    o.estado === 'READY'
                      ? `<button class="kds-btn kds-go" onclick="setEstadoPedido(${o.id},'DELIVERED')">${ic('check', 14)} Entregar / Archivar</button>`
                      : `<button class="kds-btn kds-blue" onclick="setEstadoPedido(${o.id},'${o.estado === 'RECEIVED' ? 'PREPARING' : 'READY'}')">${o.estado === 'RECEIVED' ? 'Iniciar preparación' : 'Marcar listo'}</button>`
                  }
                  <button class="kds-cancel" title="Cancelar comanda" onclick="cancelarPedido(${o.id})">${ic('x-circle', 15)}</button>
                </div>
              </div>`,
              )
              .join('') || '<div class="kds-empty">Sin comandas</div>'}
            </div>
          </div>`;
          })
          .join('')}
      </div>
    </div>`;
}

function kdsEstacion(s) {
  D.kdsEst = s;
  renderPanel();
}

/* ---- POS ---- */
function renderPos() {
  const sel = D.mesaSel ? D.s.mesas.find((m) => m.id === D.mesaSel) : null;
  const pedidos = sel ? D.s.pedidos.filter((o) => o.mesaId === sel.id).sort((a, b) => b.creado - a.creado) : [];
  const total = pedidos.filter((o) => o.estado !== 'CANCELLED').reduce((s, o) => s + o.total, 0);

  return `
  <div class="posv" style="${pv('pos')}">
    <div class="pos">
      <div class="pos-map mf-card">
        <h4 class="mf-card-t">Mapa de mesas</h4>
        <div class="pos-grid">
          ${D.s.mesas
            .map(
              (t) => `
            <button class="pos-mesa st-${t.estado} ${sel && sel.id === t.id ? 'sel' : ''}" onclick="posSel(${t.id})">
              <b>${t.numero}</b><span>${MESA_LABELS[t.estado]}</span>
              ${t.desde && t.estado !== 'FREE' ? `<em>${fmtDur(t.desde)}</em>` : ''}
            </button>`,
            )
            .join('')}
          ${!D.s.mesas.length ? '<p class="mf-hint">Sin mesas. Créelas desde el panel Admin.</p>' : ''}
        </div>
        <div class="pos-leyenda">
          ${Object.entries(MESA_LABELS).map(([k, l]) => `<span><i class="dot st-${k}"></i>${l}</span>`).join('')}
        </div>
      </div>
      <div class="pos-detail mf-card">
        ${
          !sel
            ? '<p class="pos-hint">Seleccione una mesa para ver el detalle</p>'
            : `
          <div class="pos-detail-head">
            <h4 class="mf-card-t" style="margin:0">Mesa ${sel.numero}</h4>
            <span class="pos-badge st-${sel.estado}">${MESA_LABELS[sel.estado]}</span>
          </div>
          ${sel.desde && sel.estado !== 'FREE' ? `<p class="mf-hint">${ic('timer', 11)} Ocupada hace ${fmtDur(sel.desde)}</p>` : ''}
          <div class="pos-orders">
            ${
              pedidos
                .map(
                  (o) => `
              <div class="pos-order ${o.estado === 'CANCELLED' ? 'off' : ''}">
                <div class="pos-order-head"><b>#${o.numero}</b><b>${fmt$(o.total)}</b></div>
                <p class="pos-order-meta">${fmtHora(o.creado)} — ${ESTADO_LABELS[o.estado]}${o.estado === 'CANCELLED' && o.motivo ? ` · ${h(o.motivo)}` : ''}</p>
                <ul>${o.items.map((i) => `<li>${i.cantidad}x ${h(i.nombre)}</li>`).join('')}</ul>
                ${!['DELIVERED', 'CANCELLED'].includes(o.estado) ? `<button class="pos-cancel" onclick="cancelarPedido(${o.id})">${ic('x-circle', 12)} Cancelar pedido</button>` : ''}
              </div>`,
                )
                .join('') || '<p class="pos-hint2">Sin pedidos</p>'
            }
          </div>
          <div class="pos-total"><span>Total</span><b>${fmt$(total)}</b></div>
          ${
            pedidos.length
              ? `<div class="mf-row mb-2">
                   <button class="mf-btn mf-btn-slate" style="flex:2" onclick="posPrint()" ${D.printing ? 'disabled' : ''}>${ic('printer', 14)} ${D.printing ? 'Imprimiendo...' : 'Imprimir cuenta'}</button>
                   <button class="mf-btn mf-btn-ghost" style="flex:1" title="Solo el último pedido" onclick="posPrintLast()" ${D.printing ? 'disabled' : ''}>Última</button>
                 </div>`
              : ''
          }
          ${
            sel.estado !== 'FREE' && !D.confirmRelease
              ? `<button class="mf-btn mf-btn-red w-100" onclick="D.confirmRelease=true;renderPanel()">Liberar Mesa</button>`
              : ''
          }
          ${
            D.confirmRelease
              ? `<div class="pos-confirm">
                  <p>¿Liberar Mesa ${sel.numero}? Se cerrará la sesión del comensal.</p>
                  <div class="mf-row">
                    <button class="mf-btn mf-btn-red" onclick="D.mesaSel=null;D.confirmRelease=false;liberarMesa(${sel.id})">Confirmar</button>
                    <button class="mf-btn mf-btn-ghost" onclick="D.confirmRelease=false;renderPanel()">Cancelar</button>
                  </div>
                </div>`
              : ''
          }`
        }
      </div>
    </div>
    ${bubblesHtml()}

  </div>`;
}

function bubblesHtml() {
  const calls = D.s.llamados.filter((c) => !c.oculto);
  if (!calls.length) return '';
  return `
    <div class="callbubbles">
      ${calls
        .slice(0, 5)
        .map(
          (c) => `
        <div class="cb">
          <div class="cb-ico">${ic('bell', 16)}</div>
          <div class="cb-body">
            <b>Mesa ${c.mesa}</b>
            <p>${LLAMADO_LABELS[c.tipo]}${c.mensaje ? ` — "${h(c.mensaje)}"` : ''}</p>
            <div class="mf-row">
              <button class="cb-ok" onclick="resolverLlamado(${c.id})">Confirmar</button>
              <button class="cb-x" title="Ocultar (sin resolver)" onclick="ocultarLlamado(${c.id})">${ic('x', 13)}</button>
            </div>
          </div>
        </div>`,
        )
        .join('')}
      ${calls.length > 5 ? `<p class="cb-more">+${calls.length - 5} llamados mas</p>` : ''}
    </div>`;
}

/* Igual que el POS real: "Imprimir cuenta" cierra la cuenta completa del
   turno y "Última" imprime solo el último pedido (pos:print:last). */
function posPrint() {
  D.ticketLast = false;
  D.printing = true;
  renderPanel();
  setTimeout(() => {
    D.printing = false;
    D.ticket = true;
    alerta('info', 'pos', 'Ticket impreso en la térmica ESC/POS.');
    renderPanel();
  }, 900);
}

function posPrintLast() {
  D.ticketLast = true;
  D.printing = true;
  renderPanel();
  setTimeout(() => {
    D.printing = false;
    D.ticket = true;
    alerta('info', 'pos', 'Último ticket impreso en la térmica ESC/POS.');
    renderPanel();
  }, 900);
}

function ticketOverlayHtml() {
  const sel = D.s.mesas.find((m) => m.id === D.mesaSel);
  if (!D.ticket || !sel) return '';
  let pedidos = D.s.pedidos.filter((o) => o.mesaId === sel.id && o.estado !== 'CANCELLED');
  if (D.ticketLast) pedidos = pedidos.slice(0, 1);
  return ticketHtml(sel, pedidos);
}

function ticketHtml(mesa, pedidos) {
  const txt = ticketTxt(mesa, pedidos);
  return `
    <div class="pos-ticket-bg" onclick="D.ticket=false;renderPanel()">
      <div class="pos-ticket" onclick="event.stopPropagation()">
        <div class="pos-ticket-head">
          <span>${ic('printer', 12)} Ticket térmico — impresora ESC/POS</span>
          <button onclick="D.ticket=false;renderPanel()">${ic('x', 13)}</button>
        </div>
        <pre>${h(txt)}</pre>
        <button class="mf-btn mf-btn-ghost w-100 mt-2" onclick="ticketDescargar()">${ic('download', 13)} Descargar PDF</button>
        <p class="pos-ticket-note">En el restaurante esto sale por la impresora térmica.</p>
      </div>
    </div>`;
}

function posSel(id) {
  D.mesaSel = id;
  D.confirmRelease = false;
  D.ticket = false;
  renderPanel();
}

/* ---- Alertas — AlertsScreen.tsx ---- */
const AL_ICONS = { info: 'info', warning: 'alert-triangle', error: 'x-circle', success: 'check-circle' };

function renderAlertas() {
  const st = {
    info: 'al-t-info', warning: 'al-t-warn', error: 'al-t-err', success: 'al-t-ok',
  };
  return `
  <div class="alv" style="${pv('admin')}">
    <div class="mf-card">
      <div class="al-head">
        <h4 class="mf-card-t" style="margin:0">${ic('bell', 16)} Alertas del sistema</h4>
        <div class="mf-row">
          ${D.s.alertas.length ? `<button class="mf-link" onclick="descargarCsv()">${ic('download', 12)} Descargar CSV</button>` : ''}
          ${D.s.alertas.length ? `<button class="mf-link mf-link-red" onclick="D.s.alertas=[];renderPanel()">${ic('trash', 12)} Limpiar vista</button>` : ''}
        </div>
      </div>
      <p class="mf-hint mb-3">Alertas desde el último arranque del sistema. "Limpiar vista" solo limpia este panel; el CSV siempre contiene el historial completo.</p>
      ${
        !D.s.alertas.length
          ? '<p class="pos-hint">No hay alertas</p>'
          : D.s.alertas
              .map(
                (a) => `
          <div class="al-item ${st[a.type]} ${a.ack ? 'ack' : ''}">
            <span class="al-ico">${ic(AL_ICONS[a.type] || 'info', 15)}</span>
            <div class="al-info">
              <div class="al-meta"><b>${ALERT_SOURCES[a.source] || a.source}</b><em>${fmtHora(a.ts)}</em></div>
              <p>${h(a.message)}</p>
            </div>
            <div class="al-acts">
              ${!a.ack ? `<button class="al-ok-btn" onclick="ackAlerta(${a.id})">OK</button>` : ''}
              <button class="al-x" onclick="quitarAlerta(${a.id})">${ic('x', 13)}</button>
            </div>
          </div>`,
              )
              .join('')
      }
    </div>
  </div>`;
}

function ackAlerta(id) {
  const a = D.s.alertas.find((x) => x.id === id);
  if (a) a.ack = true;
  renderPanel();
}
function quitarAlerta(id) {
  D.s.alertas = D.s.alertas.filter((x) => x.id !== id);
  renderPanel();
}
function descargarCsv() {
  const rows = [
    ['tipo', 'origen', 'mensaje', 'hora'],
    ...D.s.alertas.map((a) => [a.type, a.source, a.message.replace(/,/g, ';'), new Date(a.ts).toLocaleTimeString('es-UY')]),
  ];
  const csv = rows.map((r) => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'morfi-alertas.csv';
  a.click();
}

/* ---- Descargas: mini PDF builder + PNG de QR ---- */
// Documentos de muestra generados en el navegador (sin servidor), como haría el backend real.
const pdfEsc = (s) => String(s).replace(/[\\()]/g, (c) => '\\' + c);
const pdfT = (x, y, s, sz = 12, f = 'F1') => `BT /${f} ${sz} Tf ${x} ${y} Td (${pdfEsc(s)}) Tj ET`;
const pdfR = (x, y, w, h, g = 0) => `${g} g ${x} ${y} ${w} ${h} re f`;

// streams: array de strings con operadores PDF, uno por página (A4 595x842)
function pdfCrear(nombre, streams) {
  let id = 5;
  const parts = streams.map((s) => ({ p: id++, c: id++, s }));
  const objs = {
    1: '<< /Type /Catalog /Pages 2 0 R >>',
    2: `<< /Type /Pages /Kids [${parts.map((x) => x.p + ' 0 R').join(' ')}] /Count ${parts.length} >>`,
    3: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    4: '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  };
  parts.forEach(({ p, c, s }) => {
    objs[p] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${c} 0 R >>`;
    objs[c] = `<< /Length ${s.length} >>\nstream\n${s}\nendstream`;
  });
  let pdf = '%PDF-1.4\n';
  const offs = [];
  for (let i = 1; i < id; i++) {
    offs[i] = pdf.length;
    pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xr = pdf.length;
  pdf += `xref\n0 ${id}\n0000000000 65535 f \n`;
  for (let i = 1; i < id; i++) pdf += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
  pdf += `trailer\n<< /Size ${id} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`;
  const bytes = Uint8Array.from(pdf, (ch) => ch.charCodeAt(0) & 0xff);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function qrUrlMesa(t) {
  return `http://localhost:3001/?t=${t.numero}-TK${D.s.qrSeed}${t.numero}X9`;
}
function qrCodigoMesa(t) {
  return `${t.numero}-${('A1B2C3D4E5F6' + t.numero).slice(-6)}`;
}

function qrDescargarPdf() {
  const nombre = D.s.branding.nameText || 'MORFI';
  const streams = D.s.mesas.map((m) => {
    const cells = qrMatrix(m.numero * 7919 + D.s.qrSeed);
    const s = [pdfR(0, 802, 595, 40, 0.96), pdfT(48, 815, `${nombre} — QR de mesa`, 16)];
    const cell = 9.5;
    const ox = (595 - 21 * cell) / 2;
    const oy = 470;
    cells.forEach((fill, i) => {
      if (fill) s.push(pdfR(ox + (i % 21) * cell, oy + (20 - ((i / 21) | 0)) * cell, cell, cell));
    });
    s.push(pdfT(48, 425, `Mesa ${String(m.numero).padStart(2, '0')}`, 24));
    s.push(pdfT(48, 400, `Sector: ${m.sector}`, 11));
    s.push(pdfT(48, 378, `Codigo manual: ${qrCodigoMesa(m)}`, 12, 'F2'));
    s.push(pdfT(48, 356, qrUrlMesa(m), 8, 'F2'));
    s.push(pdfT(48, 60, 'Escanea con la camara del telefono para abrir la carta digital.', 9));
    return s.join('\n');
  });
  pdfCrear('morfi-qr-mesas.pdf', streams);
  alerta('success', 'tables', `PDF de QRs descargado — ${D.s.mesas.length} mesas.`);
  renderPanel();
}

function qrDescargarPng(id) {
  const t = D.s.mesas.find((m) => m.id === id);
  if (!t) return;
  const cells = qrMatrix(t.numero * 7919 + D.s.qrSeed);
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 600;
  const c = cv.getContext('2d');
  c.fillStyle = '#ffffff';
  c.fillRect(0, 0, 512, 600);
  const cell = 20;
  const ox = (512 - 21 * cell) / 2;
  const oy = 46;
  c.fillStyle = '#0f172a';
  cells.forEach((fill, i) => {
    if (fill) c.fillRect(ox + (i % 21) * cell, oy + ((i / 21) | 0) * cell, cell, cell);
  });
  c.textAlign = 'center';
  c.fillStyle = '#0f172a';
  c.font = 'bold 34px Arial';
  c.fillText(`Mesa ${String(t.numero).padStart(2, '0')}`, 256, 530);
  c.font = '15px Arial';
  c.fillStyle = '#64748b';
  c.fillText(`${t.sector}  ·  ${qrCodigoMesa(t)}`, 256, 558);
  const a = document.createElement('a');
  a.href = cv.toDataURL('image/png');
  a.download = `mesa-${String(t.numero).padStart(2, '0')}-qr.png`;
  a.click();
}

function ticketTxt(mesa, pedidos) {
  const line = '-'.repeat(32);
  const total = pedidos.reduce((s, o) => s + o.total, 0);
  const filas = pedidos
    .flatMap((o) => o.items)
    .map((i) => `${`${i.cantidad}x ${i.nombre}`.padEnd(22, ' ').slice(0, 22)}${fmt$(i.precio * i.cantidad).padStart(10, ' ')}`)
    .join('\n');
  return `        ${D.s.branding.nameText || 'MORFI'}\n${line}\nCUENTA - MESA ${String(mesa.numero).padStart(2, '0')}\n${new Date().toLocaleString('es-UY')}\n${line}\n${filas}\n${line}\n${'TOTAL'.padEnd(22, ' ')}${fmt$(total).padStart(10, ' ')}\n${line}\n     Gracias por su visita`;
}

function ticketDescargar() {
  const mesa = D.s.mesas.find((m) => m.id === D.mesaSel);
  if (!mesa) return;
  const pedidos = D.s.pedidos.filter((o) => o.mesaId === mesa.id && o.estado !== 'CANCELLED');
  const lines = ticketTxt(mesa, pedidos).split('\n');
  const s = [pdfR(180, 60, 235, 722, 0.97)];
  lines.forEach((l, i) => s.push(pdfT(196, 756 - i * 15, l || ' ', 9.5, 'F2')));
  pdfCrear(`ticket-mesa-${String(mesa.numero).padStart(2, '0')}.pdf`, [s.join('\n')]);
  alerta('info', 'pos', `Ticket de mesa ${mesa.numero} descargado (PDF de muestra).`);
  renderPanel();
}

/* ---- Admin ---- */
function admSec(k) {
  D.admin.sec = k;
  renderPanel();
}

function renderAdmin() {
  const secs = [
    ['tables', 'Mesas', 'layout-grid'],
    ['qr', 'QR', 'qr'],
    ['menu', 'Carta', 'utensils'],
    ['themes', 'Temas', 'palette'],
    ['branding', 'Marca', 'store'],
    ['system', 'Sistema', 'settings-2'],
  ];
  return `
  <div class="adm2" style="${pv('admin')}">
    <div class="adm2-nav">
      ${secs.map(([k, l, icn]) => `<button class="adm2-tab ${D.admin.sec === k ? 'on' : ''}" onclick="admSec('${k}')">${ic(icn, 14)} ${l}</button>`).join('')}
    </div>
    ${{
      tables: admMesas,
      qr: admQr,
      menu: admMenu,
      themes: admTemas,
      branding: admMarca,
      system: admSistema,
    }[D.admin.sec]()}
  </div>`;
}

/* -- Admin: Mesas -- */
function admMesas() {
  const a = D.admin;
  const sectores = [...new Set(['Salón Principal', 'Terraza', 'Barra', ...D.s.mesas.map((t) => t.sector)])];
  return `
  <div class="mf-card">
    <div class="al-head">
      <h4 class="mf-card-t" style="margin:0">Mesas</h4>
      <button class="mf-link" onclick="D.admin.bulk=!D.admin.bulk;renderPanel()">${a.bulk ? 'Alta individual' : 'Crear por rango'}</button>
    </div>
    ${
      !a.bulk
        ? `
      <div class="mf-row mb-2">
        <input class="mf-in w-70" type="number" placeholder="N°" value="${h(a.newNum)}" oninput="D.admin.newNum=this.value">
        <select class="mf-in" onchange="D.admin.newSector=this.value;renderPanel()">
          ${sectores.map((s) => `<option ${a.newSector === s ? 'selected' : ''}>${s}</option>`).join('')}
          <option value="__custom" ${a.newSector === '__custom' ? 'selected' : ''}>Nuevo sector...</option>
        </select>
        ${a.newSector === '__custom' ? `<input class="mf-in" placeholder="Nombre del sector" value="${h(a.customSector)}" oninput="D.admin.customSector=this.value">` : ''}
        <button class="mf-btn mf-btn-blue" onclick="mesaCrear()">+ Agregar</button>
      </div>`
        : `
      <div class="mf-row mb-2 items-end">
        <div><label class="mf-lab">Desde</label><input class="mf-in w-70" type="number" value="${h(a.bulkFrom)}" oninput="D.admin.bulkFrom=this.value"></div>
        <div><label class="mf-lab">Hasta</label><input class="mf-in w-70" type="number" value="${h(a.bulkTo)}" oninput="D.admin.bulkTo=this.value"></div>
        <select class="mf-in" onchange="D.admin.newSector=this.value;renderPanel()">
          ${sectores.map((s) => `<option ${a.newSector === s ? 'selected' : ''}>${s}</option>`).join('')}
          <option value="__custom" ${a.newSector === '__custom' ? 'selected' : ''}>Nuevo sector...</option>
        </select>
        <button class="mf-btn mf-btn-blue" onclick="mesaBulk()">Crear rango</button>
      </div>`
    }
    ${a.msg ? `<p class="mf-ok">${h(a.msg)}</p>` : ''}
    <div class="adm-mesas">
      ${D.s.mesas
        .map(
          (t) => `
        <div class="adm-mesa2">
          ${
            a.editMesa === t.id
              ? `
            <div class="mf-row">
              <input class="mf-in w-70" type="number" value="${h(a.editNum)}" oninput="D.admin.editNum=this.value">
              <input class="mf-in" value="${h(a.editSector)}" oninput="D.admin.editSector=this.value">
              <button class="mf-ico ok" onclick="mesaGuardar(${t.id})">${ic('check', 14)}</button>
              <button class="mf-ico" onclick="D.admin.editMesa=null;renderPanel()">${ic('x', 14)}</button>
            </div>`
              : `
            <div class="adm-mesa-row">
              <div>
                <b>Mesa ${t.numero}</b>
                <span class="adm-sec">${h(t.sector)}</span>
                <span class="adm-state st-${t.estado}">${MESA_LABELS[t.estado]}</span>
              </div>
              <div class="mf-row">
                <button class="mf-ico" title="Descargar QR (PNG)" onclick="qrDescargarPng(${t.id})">${ic('qr', 15)}</button>
                <button class="mf-ico ${a.mesaCopied === t.id ? 'ok' : ''}" title="Copiar URL" onclick="mesaCopiarUrl(${t.id})">${ic(a.mesaCopied === t.id ? 'check' : 'copy', 14)}</button>
                <button class="mf-ico" title="Editar" onclick="mesaEditar(${t.id})">${ic('pencil', 14)}</button>
                <button class="mf-ico red" title="Eliminar" onclick="mesaBorrar(${t.id})">${ic('trash', 14)}</button>
              </div>
            </div>`
          }
        </div>`,
        )
        .join('')}
    </div>
  </div>`;
}

function sectorElegido() {
  return D.admin.newSector === '__custom' ? D.admin.customSector.trim() || 'Salón Principal' : D.admin.newSector;
}
function mesaCrear() {
  pinGuard('Crear mesa', () => {
    const n = parseInt(D.admin.newNum, 10);
    if (Number.isNaN(n) || n < 1) return;
    if (D.s.mesas.some((m) => m.numero === n)) {
      D.admin.msg = `La mesa ${n} ya existe`;
      return renderPanel();
    }
    D.s.mesas.push({ id: D.s.nextMesa++, numero: n, sector: sectorElegido(), estado: 'FREE', desde: null });
    D.s.mesas.sort((x, y) => x.numero - y.numero);
    D.admin.newNum = '';
    D.admin.msg = `Mesa ${n} creada`;
    alerta('success', 'tables', `Mesa ${n} creada.`);
    renderTodo();
  });
}
function mesaBulk() {
  pinGuard('Crear mesas por rango', () => {
    const f = parseInt(D.admin.bulkFrom, 10);
    const t = parseInt(D.admin.bulkTo, 10);
    if (Number.isNaN(f) || Number.isNaN(t) || f > t) return;
    let creadas = 0;
    let saltadas = 0;
    for (let n = f; n <= t; n++) {
      if (D.s.mesas.some((m) => m.numero === n)) saltadas++;
      else {
        D.s.mesas.push({ id: D.s.nextMesa++, numero: n, sector: sectorElegido(), estado: 'FREE', desde: null });
        creadas++;
      }
    }
    D.s.mesas.sort((x, y) => x.numero - y.numero);
    D.admin.bulk = false;
    D.admin.bulkFrom = D.admin.bulkTo = '';
    D.admin.msg = `${creadas} mesas creadas${saltadas ? ` (${saltadas} ya existían)` : ''}`;
    alerta('success', 'tables', `${creadas} mesas creadas por rango.`);
    renderTodo();
  });
}
function mesaEditar(id) {
  const t = D.s.mesas.find((m) => m.id === id);
  D.admin.editMesa = id;
  D.admin.editNum = String(t.numero);
  D.admin.editSector = t.sector;
  renderPanel();
}
function mesaGuardar(id) {
  pinGuard('Editar mesa', () => {
    const t = D.s.mesas.find((m) => m.id === id);
    t.numero = parseInt(D.admin.editNum, 10) || t.numero;
    t.sector = D.admin.editSector;
    D.admin.editMesa = null;
    alerta('info', 'tables', `Mesa ${t.numero} actualizada.`);
    renderTodo();
  });
}
function mesaBorrar(id) {
  pinGuard('Eliminar mesa', () => {
    const t = D.s.mesas.find((m) => m.id === id);
    if (!confirm(`¿Eliminar la mesa ${t.numero}?`)) return;
    D.s.mesas = D.s.mesas.filter((m) => m.id !== id);
    if (D.mesaSel === id) D.mesaSel = null;
    alerta('warning', 'tables', `Mesa ${t.numero} eliminada.`);
    renderTodo();
  });
}
function mesaCopiarUrl(id) {
  const t = D.s.mesas.find((m) => m.id === id);
  navigator.clipboard?.writeText(qrUrlMesa(t)).catch(() => {});
  D.admin.mesaCopied = id;
  toast(`URL de Mesa ${t.numero} copiada`, 'panel', 'copy');
  renderPanel();
  setTimeout(() => {
    D.admin.mesaCopied = null;
    if (D.admin.sec === 'tables') renderPanel();
  }, 1500);
}

/* -- QR pseudo-render (simulado, determinístico por mesa) -- */
// matriz determinística 21x21 — misma fuente para HTML, PDF y PNG
function qrMatrix(seed) {
  let s = seed * 2654435761;
  const rnd = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
  const cells = [];
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (corner) {
        const lx = x < 7 ? x : x - 14;
        const ly = y < 7 ? y : y - 14;
        cells.push(lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4));
      } else {
        cells.push(rnd() > 0.52);
      }
    }
  return cells;
}

/* -- Admin: QR -- */
function admQr() {
  const a = D.admin;
  return `
  <div class="adm2-grid">
    <div class="mf-card">
      <h4 class="mf-card-t">Códigos QR de mesas</h4>
      <div class="mf-row mb-2">
        <button class="mf-btn mf-btn-blue" onclick="qrGenerar()">${ic('copy', 13)} Generar URLs</button>
        <button class="mf-btn mf-btn-green" onclick="qrDescargarPdf()">${ic('file-text', 13)} Descargar PDF</button>
      </div>
      <p class="mf-hint mb-2">El PDF trae una página por mesa con el QR grande y el código manual de respaldo.</p>
      <div class="adm-qrlist">
        ${
          a.qrList.length
            ? a.qrList
                .map(
                  (q) => `
            <button class="adm-qrrow" onclick="qrCopiar(${q.n})">
              <div class="adm-qrtop"><b>Mesa ${q.n}</b><span>${a.qrCopied === q.n ? `${ic('check', 12)} Copiada` : `${ic('copy', 12)} Copiar`}</span></div>
              <p>${q.url}</p>
              <p class="mf-mono">Código manual: <b>${q.code}</b></p>
            </button>`,
                )
                .join('')
            : '<p class="mf-hint">Genere las URLs o descargue el PDF imprimible</p>'
        }
      </div>
    </div>
    <div class="mf-card">
      <h4 class="mf-card-t">Seguridad</h4>
      <p class="mf-hint mb-3">Al rotar las claves HMAC, todos los QR impresos y códigos de mesa quedan invalidados inmediatamente. Requiere PIN de administrador.</p>
      ${
        a.rotateOk
          ? `<div class="mf-note-ok">Claves rotadas. Deberá reimprimir los QR de las mesas.</div>`
          : ''
      }
      ${
        !a.rotateOpen
          ? `<button class="mf-btn mf-btn-red w-100" onclick="D.admin.rotateOpen=true;renderPanel()">${ic('refresh-cw', 13)} Rotar Claves HMAC</button>`
          : `
        <div class="mf-note-err">
          <p>Esta acción invalida todos los códigos QR impresos.</p>
          <input class="mf-in mf-pin-in" type="password" inputmode="numeric" placeholder="PIN de administrador"
                 value="${h(a.rotatePin)}" oninput="D.admin.rotatePin=this.value.replace(/\\D/g,'')"
                 onkeydown="if(event.key==='Enter')qrRotar()">
          ${a.rotateErr ? `<p class="mf-err">${a.rotateErr}</p>` : ''}
          <div class="mf-row mt-2">
            <button class="mf-btn mf-btn-red" ${a.rotatePin.length < 4 ? 'disabled' : ''} onclick="qrRotar()">Rotar claves</button>
            <button class="mf-btn mf-btn-ghost" onclick="Object.assign(D.admin,{rotateOpen:false,rotatePin:'',rotateErr:''});renderPanel()">Cancelar</button>
          </div>
        </div>`
      }
    </div>
  </div>`;
}

function qrGenerar() {
  D.admin.qrList = D.s.mesas.map((t) => ({ n: t.numero, url: qrUrlMesa(t), code: qrCodigoMesa(t) }));
  renderPanel();
}
function qrCopiar(n) {
  const q = D.admin.qrList.find((x) => x.n === n);
  navigator.clipboard?.writeText(q.url).catch(() => {});
  D.admin.qrCopied = n;
  toast(`URL de Mesa ${q.n} copiada`, 'panel', 'copy');
  renderPanel();
  setTimeout(() => {
    D.admin.qrCopied = null;
    if (D.admin.sec === 'qr') renderPanel();
  }, 1500);
}
function qrRotar() {
  if (D.admin.rotatePin !== D.s.pin) {
    D.admin.rotateErr = 'PIN incorrecto';
    return renderPanel();
  }
  D.s.qrSeed++;
  Object.assign(D.admin, { rotateOpen: false, rotatePin: '', rotateErr: '', rotateOk: true, qrList: [] });
  alerta('error', 'system', 'Claves HMAC rotadas — todos los QR anteriores quedaron invalidados.');
  renderPanel();
  setTimeout(() => {
    D.admin.rotateOk = false;
    if (D.admin.sec === 'qr') renderPanel();
  }, 5000);
}

/* -- Admin: Carta (productos) -- */
function admMenu() {
  const a = D.admin;
  const cats = [...new Set(D.s.menu.map((m) => m.categoria))];
  const items = D.s.menu.filter(
    (m) =>
      (a.menuCat === 'all' || m.categoria === a.menuCat) &&
      (!a.menuSearch || m.nombre.toLowerCase().includes(a.menuSearch.toLowerCase())),
  );
  return `
  <div class="mf-card">
    <div class="al-head">
      <h4 class="mf-card-t" style="margin:0">${ic('utensils', 15)} Carta / Productos</h4>
      <button class="mf-btn mf-btn-blue" onclick="menuForm(null)">${ic('plus', 13)} Nuevo producto</button>
    </div>
    <div class="mf-row mb-2">
      <div class="mf-search">${ic('search', 13)}<input class="mf-in" placeholder="Buscar producto..." value="${h(a.menuSearch)}" oninput="D.admin.menuSearch=this.value;renderAdminList()"></div>
      <select class="mf-in w-120" onchange="D.admin.menuCat=this.value;renderPanel()">
        <option value="all">Todas</option>
        ${cats.map((c) => `<option ${a.menuCat === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="mf-rename">
      <span>Renombrar categoría:</span>
      <select class="mf-in" onchange="D.admin.renameFrom=this.value">
        <option value="">Elegir...</option>
        ${cats.map((c) => `<option ${a.renameFrom === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
      <input class="mf-in" placeholder="Nuevo nombre" value="${h(a.renameTo)}" oninput="D.admin.renameTo=this.value">
      <button class="mf-btn mf-btn-dark" ${!a.renameFrom || !a.renameTo.trim() ? 'disabled' : ''} onclick="menuRenombrar()">Aplicar</button>
    </div>
    ${a.msg ? `<p class="mf-ok">${h(a.msg)}</p>` : ''}
    <div class="adm-items" id="adm-items">${admItemsHtml(items)}</div>
  </div>`;
}

function admItemsHtml(items) {
  if (!items.length) return '<p class="pos-hint2">Sin productos</p>';
  return items
    .map(
      (m) => `
    <div class="adm-item2 ${m.activo ? '' : 'off'}">
      <div class="adm-thumb"><img src="${m.img ? h(m.img) : 'assets/logo.png'}" class="${m.img ? '' : 'is-logo'}"></div>
      <div class="adm-item-info">
        <b>${h(m.nombre)}</b>
        <p>${h(m.categoria)} · ${h(m.estacion)} · ${fmt$(m.precio)}
          ${m.stock === 0 ? '<span class="mf-red"> AGOTADO</span>' : m.stock > 0 ? `<span class="mf-hint"> stock ${m.stock}</span>` : ''}</p>
      </div>
      <label class="mf-ico" title="Cambiar imagen">${ic('image-plus', 14)}<input type="file" accept="image/*" hidden onchange="menuImgQuick(this,${m.id})"></label>
      <button class="adm-state2 ${m.activo ? 'on' : ''}" onclick="menuToggle(${m.id})">${m.activo ? 'ACTIVO' : 'BAJA'}</button>
      <button class="mf-ico" title="Editar" onclick="menuForm(${m.id})">${ic('pencil', 14)}</button>
      <button class="mf-ico red" title="Eliminar" onclick="menuBorrar(${m.id})">${ic('trash', 14)}</button>
    </div>`,
    )
    .join('');
}

/* Subir foto directo desde la lista (icono ImagePlus del MenuPanel real) */
function menuImgQuick(input, id) {
  const file = input.files && input.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  input.value = '';
  pinGuard('Cambiar imagen del producto', () => {
    const rd = new FileReader();
    rd.onload = () => {
      const m = D.s.menu.find((x) => x.id === id);
      if (m) {
        m.img = rd.result;
        alerta('success', 'menu', `Imagen de "${m.nombre}" actualizada — ya se ve en la carta.`);
      }
      renderTodo();
    };
    rd.readAsDataURL(file);
  });
}

function renderAdminList() {
  const a = D.admin;
  const items = D.s.menu.filter(
    (m) =>
      (a.menuCat === 'all' || m.categoria === a.menuCat) &&
      (!a.menuSearch || m.nombre.toLowerCase().includes(a.menuSearch.toLowerCase())),
  );
  const el = $('#adm-items');
  if (el) el.innerHTML = admItemsHtml(items);
}

function menuToggle(id) {
  pinGuard('Cambiar estado del producto', () => {
    const m = D.s.menu.find((x) => x.id === id);
    m.activo = !m.activo;
    alerta('warning', 'menu', `${m.nombre}: ${m.activo ? 'activado' : 'dado de baja'} — se actualizó la carta en vivo.`);
    renderTodo();
  });
}
function menuBorrar(id) {
  pinGuard('Eliminar producto', () => {
    const m = D.s.menu.find((x) => x.id === id);
    if (!confirm(`¿Dar de baja "${m.nombre}"?`)) return;
    D.s.menu = D.s.menu.filter((x) => x.id !== id);
    alerta('warning', 'menu', `${m.nombre} eliminado de la carta.`);
    renderTodo();
  });
}
function menuRenombrar() {
  pinGuard('Renombrar categoría', () => {
    const a = D.admin;
    const n = D.s.menu.filter((m) => m.categoria === a.renameFrom);
    n.forEach((m) => (m.categoria = a.renameTo.trim()));
    a.msg = `Categoría renombrada (${n.length} productos)`;
    a.renameFrom = a.renameTo = '';
    renderTodo();
  });
}

/* Modal de producto (alta/edición) */
function menuForm(id) {
  const a = D.admin;
  if (id === null) {
    a.form = { id: null, nombre: '', descripcion: '', precio: '', stock: '-1', categoria: 'Entradas', estacion: 'Cocina', dietarios: [], activo: true, modificadores: [], img: '' };
  } else {
    const m = D.s.menu.find((x) => x.id === id);
    a.form = {
      id: m.id, nombre: m.nombre, descripcion: m.descripcion, precio: String(m.precio),
      stock: String(m.stock), categoria: m.categoria, estacion: m.estacion,
      dietarios: [...(m.dietarios || [])], activo: m.activo, img: m.img || '',
      modificadores: (m.modificadores || []).map((g) => ({ ...g, opciones: g.opciones.map((o) => ({ ...o })) })),
    };
  }
  renderPanel();
}

function formSet(k, v) {
  D.admin.form[k] = v;
}
function formImg(input) {
  const file = input.files && input.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const rd = new FileReader();
  rd.onload = () => {
    D.admin.form.img = rd.result;
    renderPanel();
  };
  rd.readAsDataURL(file);
}
function formTag(t) {
  const f = D.admin.form;
  f.dietarios = f.dietarios.includes(t) ? f.dietarios.filter((x) => x !== t) : [...f.dietarios, t];
  renderPanel();
}
function formModAdd() {
  D.admin.form.modificadores.push({ nombre: '', requerido: false, opciones: [{ label: '', delta: 0 }] });
  renderPanel();
}
function formModRm(gi) {
  D.admin.form.modificadores.splice(gi, 1);
  renderPanel();
}
function formModSet(gi, k, v) {
  D.admin.form.modificadores[gi][k] = v;
}
function formOptAdd(gi) {
  D.admin.form.modificadores[gi].opciones.push({ label: '', delta: 0 });
  renderPanel();
}
function formOptRm(gi, oi) {
  D.admin.form.modificadores[gi].opciones.splice(oi, 1);
  renderPanel();
}
function formOptSet(gi, oi, k, v) {
  const o = D.admin.form.modificadores[gi].opciones[oi];
  o[k] = k === 'delta' ? parseFloat(v) || 0 : v;
}
function menuGuardar() {
  const f = D.admin.form;
  if (!f.nombre.trim()) return;
  pinGuard(f.id ? 'Editar producto' : 'Crear producto', () => {
    const data = {
      nombre: f.nombre.trim(), descripcion: f.descripcion, precio: parseFloat(f.precio) || 0,
      categoria: f.categoria || 'General', estacion: f.estacion, dietarios: f.dietarios,
      stock: parseInt(f.stock, 10), activo: f.activo, img: f.img || '',
      modificadores: f.modificadores.filter((g) => g.nombre.trim() && g.opciones.some((o) => o.label.trim()))
        .map((g) => ({ nombre: g.nombre.trim(), requerido: g.requerido, opciones: g.opciones.filter((o) => o.label.trim()) })),
    };
    if (f.id) {
      const m = D.s.menu.find((x) => x.id === f.id);
      Object.assign(m, data);
      D.admin.msg = 'Producto actualizado';
    } else {
      D.s.menu.push({ id: (D.s.menu.length ? Math.max(...D.s.menu.map((x) => x.id)) : 0) + 1, img: '', ...data });
      D.admin.msg = 'Producto creado';
    }
    D.admin.form = null;
    alerta('success', 'menu', `${data.nombre} ${f.id ? 'actualizado' : 'creado'} — ya se ve en la carta.`);
    renderTodo();
  });
}

function menuFormHtml() {
  const f = D.admin.form;
  if (!f) return '';
  const cats = [...new Set(D.s.menu.map((m) => m.categoria))];
  return `
    <div class="mf-modal-bg" onclick="D.admin.form=null;renderPanel()">
      <div class="mf-modal" onclick="event.stopPropagation()">
        <div class="al-head"><p class="mf-modal-t">${f.id ? 'Editar producto' : 'Nuevo producto'}</p>
          <button class="mf-ico" onclick="D.admin.form=null;renderPanel()">×</button></div>
        <div class="mf-form">
          <input class="mf-in" placeholder="Nombre del producto *" value="${h(f.nombre)}" oninput="formSet('nombre',this.value)">
          <textarea class="mf-in" rows="2" placeholder="Descripción" oninput="formSet('descripcion',this.value)">${h(f.descripcion)}</textarea>
          <div class="mf-row">
            <input class="mf-in" type="number" placeholder="Precio *" value="${h(f.precio)}" oninput="formSet('precio',this.value)">
            <input class="mf-in" type="number" title="-1 = ilimitado, 0 = agotado" placeholder="Stock (-1 = ilimitado)" value="${h(f.stock)}" oninput="formSet('stock',this.value)">
            <select class="mf-in" onchange="formSet('estacion',this.value)">
              ${['Cocina', 'Parrilla', 'Barra'].map((s) => `<option ${f.estacion === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <input class="mf-in" placeholder="Categoría *" list="cats-demo" value="${h(f.categoria)}" oninput="formSet('categoria',this.value)">
          <datalist id="cats-demo">${cats.map((c) => `<option value="${h(c)}">`).join('')}</datalist>
          <div class="mf-row items-end">
            <div class="mf-menuimg">${f.img ? `<img src="${f.img}" alt="">` : '<span>Sin foto</span>'}</div>
            <div style="flex:1;min-width:0">
              <label class="mf-lab">Imagen del producto</label>
              <label class="mf-btn mf-btn-ghost mf-filebtn">Elegir archivo<input type="file" accept="image/*" hidden onchange="formImg(this)"></label>
              ${f.img ? `<button class="mf-link mf-link-red" onclick="formSet('img','');renderPanel()">Quitar imagen</button>` : ''}
            </div>
          </div>
          <p class="mf-lab">Tags dietéticos</p>
          <div class="mf-row">
            ${['Sin TACC', 'Vegano', 'Vegetariano', 'Sin lactosa', 'Picante']
              .map((t) => `<button class="mf-tag ${f.dietarios.includes(t) ? 'on' : ''}" onclick="formTag('${t}')">${t}</button>`)
              .join('')}
          </div>
          <div class="al-head" style="margin-top:6px"><p class="mf-lab" style="margin:0">Modificadores</p>
            <button class="mf-link" onclick="formModAdd()">+ Grupo</button></div>
          ${f.modificadores
            .map(
              (g, gi) => `
            <div class="mf-modgroup">
              <div class="mf-row">
                <input class="mf-in" placeholder="Ej: Término, Agregados" value="${h(g.nombre)}" oninput="formModSet(${gi},'nombre',this.value)">
                <label class="mf-lab"><input type="checkbox" ${g.requerido ? 'checked' : ''} onchange="formModSet(${gi},'requerido',this.checked)"> Obligatorio</label>
                <button class="mf-ico red" onclick="formModRm(${gi})">×</button>
              </div>
              ${g.opciones
                .map(
                  (o, oi) => `
                <div class="mf-row">
                  <input class="mf-in" placeholder="Opción (ej: A punto)" value="${h(o.label)}" oninput="formOptSet(${gi},${oi},'label',this.value)">
                  <input class="mf-in w-70" type="number" placeholder="+$" value="${o.delta}" oninput="formOptSet(${gi},${oi},'delta',this.value)">
                  <button class="mf-ico red" onclick="formOptRm(${gi},${oi})">×</button>
                </div>`,
                )
                .join('')}
              <button class="mf-link" onclick="formOptAdd(${gi})">+ Opción</button>
            </div>`,
            )
            .join('')}
          <label class="mf-lab"><input type="checkbox" ${f.activo ? 'checked' : ''} onchange="formSet('activo',this.checked)"> Activo (visible en la carta)</label>
          <div class="mf-row mt-2">
            <button class="mf-btn mf-btn-blue" ${!f.nombre.trim() ? 'disabled' : ''} onclick="menuGuardar()">Guardar</button>
            <button class="mf-btn mf-btn-ghost" onclick="D.admin.form=null;renderPanel()">Cancelar</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* -- Admin: Temas — ThemesPanel.tsx -- */
const PAL_FIELDS = [
  ['bg', 'Fondo'], ['surface', 'Tarjetas'], ['text', 'Texto'], ['muted', 'Texto suave'],
  ['primary', 'Primario'], ['primaryText', 'Texto en primario'], ['accent', 'Acento'],
  ['danger', 'Peligro'], ['border', 'Bordes'],
];

function admTemas() {
  const a = D.admin;
  const PANELS = [
    ['kds', 'Cocina (KDS)'],
    ['pos', 'Caja (POS)'],
    ['admin', 'Admin'],
    ['carta', 'Carta Digital'],
  ];
  const asignada = D.s.temas[a.temaPanel];
  const card = (p) => `
    <button class="pal ${asignada === p.nombre ? 'on' : ''}" style="background:${p.colors.bg};border-color:${p.colors.border}"
            onclick="temaAsignar('${h(p.nombre)}')">
      <div class="pal-head"><span style="color:${p.colors.text}">${h(p.nombre)}</span>${asignada === p.nombre ? `<b style="color:${p.colors.primary}">${ic('check', 14)}</b>` : ''}</div>
      <div class="pal-card" style="background:${p.colors.surface};border-color:${p.colors.border}">
        <i style="background:${p.colors.text};width:70%"></i><i style="background:${p.colors.muted};width:45%"></i>
      </div>
      <div class="pal-dots">
        ${[p.colors.primary, p.colors.accent, p.colors.danger].map((c) => `<i style="background:${c}"></i>`).join('')}
        ${!p.builtin ? `<b class="pal-del" onclick="event.stopPropagation();temaBorrar(${p.id})">${ic('trash', 12)}</b>` : ''}
      </div>
    </button>`;
  const claras = D.s.paletas.filter((p) => !p.dark);
  const oscuras = D.s.paletas.filter((p) => p.dark);
  const nc = a.palColors || PALETAS_DEMO[0].colors;
  return `
  <div class="mf-card">
    <h4 class="mf-card-t">${ic('palette', 16)} Apariencia de los paneles</h4>
    <div class="mf-row mb-3">
      ${PANELS.map(([k, l]) => `<button class="kds-chip2 ${a.temaPanel === k ? 'on' : ''}" onclick="D.admin.temaPanel='${k}';renderPanel()">${l}</button>`).join('')}
    </div>
    ${a.msg ? `<p class="mf-ok">${h(a.msg)}</p>` : ''}
    <p class="mf-lab">Claras</p>
    <div class="pal-grid">${claras.map(card).join('')}</div>
    <p class="mf-lab">Oscuras</p>
    <div class="pal-grid">${oscuras.map(card).join('')}</div>
    ${
      !a.palNew
        ? `<button class="mf-dashed" onclick="palAbrir()">${ic('plus', 14)} Crear paleta personalizada</button>`
        : `
      <div class="mf-palnew">
        <div class="mf-row mb-3">
          <input class="mf-in" placeholder="Nombre de la paleta *" value="${h(a.palName)}" oninput="D.admin.palName=this.value">
          <label class="mf-lab"><input type="checkbox" ${a.palDark ? 'checked' : ''} onchange="palDarkToggle(this.checked)"> Oscura</label>
        </div>
        <div class="pal-colors">
          ${PAL_FIELDS
            .map(
              ([k, l]) => `
            <label class="pal-color">
              <input type="color" value="${nc[k]}" oninput="palSetColor('${k}',this.value)">
              <span>${l}</span>
            </label>`,
            )
            .join('')}
        </div>
        <div class="palnew-prev" id="palnew-prev" style="${PAL_FIELDS.map(([k]) => `--nw-${k}:${nc[k]}`).join(';')}">
          <div class="palnew-card">
            <b>Vista previa</b>
            <span>Así se verán las tarjetas</span>
            <em>Botón primario</em>
          </div>
        </div>
        <div class="mf-row mt-2">
          <button class="mf-btn mf-btn-blue" ${!a.palName.trim() ? 'disabled' : ''} onclick="temaCrear()">Guardar paleta</button>
          <button class="mf-btn mf-btn-ghost" onclick="D.admin.palNew=false;renderPanel()">Cancelar</button>
        </div>
      </div>`
    }
    <p class="mf-hint mt-3">Al asignar una paleta, el panel correspondiente de esta demo cambia de colores en el acto.</p>
  </div>`;
}

function palAbrir() {
  const a = D.admin;
  const base = a.palDark
    ? PALETAS_DEMO.find((p) => p.dark).colors
    : PALETAS_DEMO[0].colors;
  a.palColors = { ...base };
  a.palNew = true;
  renderPanel();
}
function palDarkToggle(v) {
  const a = D.admin;
  a.palDark = v;
  const base = v ? PALETAS_DEMO.find((p) => p.dark).colors : PALETAS_DEMO[0].colors;
  a.palColors = { ...base };
  renderPanel();
}
function palSetColor(k, v) {
  D.admin.palColors[k] = v;
  const prev = document.getElementById('palnew-prev');
  if (prev) prev.style.setProperty(`--nw-${k}`, v);
}

function temaAsignar(nombre) {
  pinGuard('Asignar paleta', () => {
    D.s.temas[D.admin.temaPanel] = nombre;
    D.admin.msg = `Paleta "${nombre}" asignada`;
    alerta('info', 'system', `Paleta "${nombre}" asignada a ${D.admin.temaPanel.toUpperCase()}.`);
    renderTodo();
  });
}
function temaCrear() {
  pinGuard('Crear paleta', () => {
    const a = D.admin;
    D.s.paletas.push({ id: Date.now(), nombre: a.palName.trim(), builtin: false, dark: a.palDark, colors: { ...a.palColors } });
    a.palNew = false;
    a.palName = '';
    a.palColors = null;
    a.msg = 'Paleta creada';
    renderPanel();
  });
}
function temaBorrar(id) {
  pinGuard('Eliminar paleta', () => {
    D.s.paletas = D.s.paletas.filter((p) => p.id !== id);
    renderPanel();
  });
}

/* -- Admin: Marca -- */
function admMarca() {
  const a = D.admin;
  return `
  <div class="mf-card">
    <h4 class="mf-card-t">${ic('store', 16)} Identidad del restaurante</h4>
    <div class="adm2-grid">
      <div class="mf-subcard">
        <p class="mf-lab">Logo (carta digital)</p>
        <div class="mf-row">
          <div class="marca-logo"><img src="${a.logoTmp || D.s.branding.logoUrl || 'assets/logo.png'}"></div>
          <label class="mf-btn mf-btn-ghost mf-filebtn">Cambiar logo<input type="file" accept="image/*" hidden onchange="marcaImg(this,'logoTmp')"></label>
          ${a.logoTmp ? `<button class="mf-link mf-link-red" onclick="D.admin.logoTmp='';renderPanel()">×</button>` : ''}
        </div>
        <p class="mf-hint mt-2">Sin logo propio, se muestra el de MORFI. Se aplica al guardar.</p>
      </div>
      <div class="mf-subcard">
        <p class="mf-lab">Nombre del restaurante</p>
        <div class="mf-row mb-2">
          <button class="mf-tag ${a.marcaMode === 'text' ? 'on-blue' : ''}" onclick="D.admin.marcaMode='text';renderPanel()">Texto</button>
          <button class="mf-tag ${a.marcaMode === 'image' ? 'on-blue' : ''}" onclick="D.admin.marcaMode='image';renderPanel()">Imagen PNG</button>
        </div>
        ${
          a.marcaMode === 'text'
            ? `<input class="mf-in mb-2" placeholder="Nombre del restaurante" value="${h(a.marcaName)}" oninput="D.admin.marcaName=this.value">`
            : `
          <div class="mf-row mb-2">
            <div class="marca-nameimg">${a.nameImgTmp || D.s.branding.nameImg ? `<img src="${a.nameImgTmp || D.s.branding.nameImg}">` : '<span>Sin imagen</span>'}</div>
            <label class="mf-btn mf-btn-ghost mf-filebtn">Subir PNG<input type="file" accept="image/*" hidden onchange="marcaImg(this,'nameImgTmp')"></label>
          </div>`
        }
        <button class="mf-btn mf-btn-blue w-100" onclick="marcaGuardar()">Guardar</button>
      </div>
    </div>
    <div class="marca-prev">
      <p>Vista previa — Carta Digital</p>
      <div class="marca-logo"><img src="${D.s.branding.logoUrl || 'assets/logo.png'}"></div>
      ${
        D.s.branding.nameMode === 'image' && D.s.branding.nameImg
          ? `<img class="marca-nameimg-big" src="${D.s.branding.nameImg}">`
          : `<b>${h(D.s.branding.nameText)}</b>`
      }
    </div>
    ${a.msg ? `<p class="mf-ok mt-2">${h(a.msg)}</p>` : ''}
  </div>`;
}

function marcaImg(input, key) {
  const file = input.files && input.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const rd = new FileReader();
  rd.onload = () => {
    D.admin[key] = rd.result;
    renderPanel();
  };
  rd.readAsDataURL(file);
}

function marcaGuardar() {
  pinGuard('Guardar identidad', () => {
    const a = D.admin;
    const b = D.s.branding;
    if (a.marcaMode === 'text' && a.marcaName.trim()) {
      b.nameText = a.marcaName.trim();
      b.nameMode = 'text';
    } else if (a.marcaMode === 'image' && (a.nameImgTmp || b.nameImg)) {
      if (a.nameImgTmp) b.nameImg = a.nameImgTmp;
      b.nameMode = 'image';
    }
    if (a.logoTmp) b.logoUrl = a.logoTmp;
    a.logoTmp = a.nameImgTmp = '';
    a.msg = 'Identidad guardada — se ve en la pantalla de bienvenida de la carta';
    alerta('success', 'menu', `Identidad del restaurante actualizada: "${b.nameText}".`);
    renderTodo();
  });
}

/* -- Admin: Sistema -- */
function admSistema() {
  const a = D.admin;
  return `
  <div class="adm2-grid">
    <div class="mf-card">
      <h4 class="mf-card-t">${ic('key-round', 15)} PIN de administrador</h4>
      <p class="mf-hint mb-2">El PIN protege las acciones sensibles (editar carta/mesas, rotar claves, configuración). Por defecto es 1111.</p>
      <input class="mf-in mf-pin-in mb-2" type="password" inputmode="numeric" placeholder="PIN actual"
             value="${h(a.pinActual)}" oninput="D.admin.pinActual=this.value.replace(/\\D/g,'')">
      <input class="mf-in mf-pin-in mb-2" type="password" inputmode="numeric" placeholder="Nuevo PIN (4-8 dígitos)"
             value="${h(a.pinNuevo)}" oninput="D.admin.pinNuevo=this.value.replace(/\\D/g,'')">
      <button class="mf-btn mf-btn-dark w-100" ${a.pinActual.length < 4 || a.pinNuevo.length < 4 ? 'disabled' : ''} onclick="pinCambiar()">Cambiar PIN</button>
      ${a.pinMsg ? `<p class="mf-ok mt-2">${h(a.pinMsg)}</p>` : ''}
    </div>
    <div class="mf-card">
      <h4 class="mf-card-t">${ic('info', 15)} Sistema</h4>
      <p class="mf-info"><b>API:</b> http://localhost:3000</p>
      <p class="mf-info"><b>Carta pública:</b> http://localhost:3001</p>
      <p class="mf-info"><b>Paneles:</b> http://localhost:3002</p>
      <p class="mf-hint mt-3">Los QR apuntan a la carta pública. Descargue el PDF desde la sección QR o el PNG individual desde el panel Mesas.</p>
    </div>
  </div>`;
}

function pinCambiar() {
  const a = D.admin;
  if (a.pinActual !== D.s.pin) {
    a.pinMsg = '';
    return alerta('error', 'system', 'Intento de cambio de PIN con PIN actual incorrecto.'), renderPanel();
  }
  D.s.pin = a.pinNuevo;
  a.pinActual = a.pinNuevo = '';
  a.pinMsg = 'PIN actualizado correctamente';
  alerta('info', 'system', 'PIN de administrador actualizado.');
  renderPanel();
}

/* ============================================================
   SHELL del panel (réplica del App.tsx: nav + barra de estado)
   ============================================================ */

function renderPanel() {
  const el = $('#panel-body');
  if (!el) return;
  const views = { kds: renderKds, pos: renderPos, admin: renderAdmin, alerts: renderAlertas };
  const tabs = [
    ['kds', 'KDS Cocina', 'chef-hat'],
    ['pos', 'POS Caja', 'credit-card'],
    ['admin', 'Admin', 'settings'],
    ['alerts', 'Alertas', 'bell'],
  ];
  if (D.pinned && !D.showAll) D.view = D.pinned;
  const visibles = D.pinned && !D.showAll ? tabs.filter(([k]) => k === D.pinned) : tabs;
  const sinAck = D.s.alertas.filter((a) => !a.ack).length;
  el.innerHTML = `
    <div class="mf" style="${pv('admin')}">
      <div class="mf-nav">
        <div class="mf-nav-brand"><img src="assets/logo.png"><b>MORFI</b></div>
        <div class="mf-nav-tabs">
          ${
            D.pinned
              ? `<button class="mf-tab mf-tab-wide" title="Mostrar todos los paneles" onclick="D.showAll=!D.showAll;renderPanel()">${ic('panel-left', 14)}</button>`
              : ''
          }
          ${visibles
            .map(
              ([k, l, icn]) => `
            <button class="mf-tab ${D.view === k ? 'on' : ''}" onclick="panelGo('${k}')">
              ${ic(icn, 14)}<span>${l}</span>${k === 'alerts' && sinAck ? `<span class="mf-badge">${sinAck}</span>` : ''}
              <i class="mf-pin ${D.pinned === k ? 'on' : ''}" title="${D.pinned === k ? 'Desfijar panel' : 'Fijar este panel'}"
                 onclick="event.stopPropagation();panelPin('${k}')">${ic('pin', 10)}</i>
            </button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="mf-status"><i></i> Tiempo real conectado</div>
      <div class="mf-view">${views[D.view]()}</div>
      ${pinModalHtml()}${menuFormHtml()}${cancelModalHtml()}${ticketOverlayHtml()}
    </div>`;
}

function panelGo(p) {
  D.view = p;
  renderPanel();
}

/* Fijar un panel — persiste en localStorage como el sistema real */
function panelPin(k) {
  D.pinned = D.pinned === k ? null : k;
  D.showAll = false;
  if (D.pinned) localStorage.setItem('morfi_pinned_panel', D.pinned);
  else localStorage.removeItem('morfi_pinned_panel');
  renderPanel();
}

function renderTodo() {
  renderCarta();
  renderPanel();
}

/* Reloj, cronómetros del KDS y cooldown del llamador sin re-render */
setInterval(() => {
  const clock = $('#kds-clock');
  if (clock) clock.textContent = fmtHora(Date.now());
  document.querySelectorAll('[data-elapsed]').forEach((el) => {
    el.textContent = elapsedTxt(Number(el.dataset.elapsed));
  });
  document.querySelectorAll('[data-cd]').forEach((el) => {
    el.textContent = Math.max(0, Math.ceil((Number(el.dataset.cd) - Date.now()) / 1000));
  });
  if (D.carta.screen === 'waiter' && D.carta.cooldownHasta && Date.now() > D.carta.cooldownHasta) {
    D.carta.cooldownHasta = 0;
    renderCarta();
  }
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
  D.s = estadoInicial();
  renderTodo();
  /* Deep-links de la demo: #pos / #kds / #admin / #alerts abren ese panel;
     #carta-menu / #carta-scan saltan la carta a esa pantalla. */
  const go = location.hash.slice(1);
  if (['kds', 'pos', 'admin', 'alerts'].includes(go)) panelGo(go);
  if (go === 'carta-menu') { sentarMesa(MESA_DEMO); cartaGo('menu'); }
  if (go === 'carta-welcome') sentarMesa(MESA_DEMO);
  if (go) $('#demo') && $('#demo').scrollIntoView();
});
