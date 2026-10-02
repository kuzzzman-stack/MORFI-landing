/* Landing MORFI — interacción fuera de la demo:
   nav mobile (logo-tapa), selector de teléfono, moneda USD/UYU,
   expander de correo. */

let MONEDA = CONTENT.moneda.inicial;

function fmtMoneda(v) {
  return MONEDA === 'USD' ? `USD ${Number(v).toLocaleString('es-UY')}` : `$U ${Number(v).toLocaleString('es-UY')}`;
}

/* ---------------- NAV mobile: logo-tapa ---------------- */
function navToggle() {
  const nav = document.getElementById('nav');
  nav.classList.toggle('open');
  document.body.classList.toggle('nav-open');
}
function navClose() {
  document.getElementById('nav').classList.remove('open');
  document.body.classList.remove('nav-open');
}

/* ---------------- Selector de teléfono ----------------
   Cada modelo varía tanto en alto como en ancho visible, para que
   el cambio entre dispositivos sea notorio (SE compacto → XL alto). */
const ALTO_MIN = 520;
const ALTO_MAX = 660;

function renderTelefonos() {
  const wrap = document.getElementById('telefonos');
  wrap.innerHTML =
    `<label class="tel-label" for="tel-sel">Modelo de teléfono</label>` +
    `<select class="tel-select" id="tel-sel" onchange="elegirTelefono(this.selectedIndex)">` +
    CONTENT.telefonos
      .map((t) => `<option value="${t.nombre}">${t.nombre} — ${t.w}×${t.h} px</option>`)
      .join('') +
    `</select>`;
}

let telActual = 0;
function elegirTelefono(i) {
  telActual = i;
  const t = CONTENT.telefonos[i];
  const screen = document.getElementById('phone-screen');
  const hs = CONTENT.telefonos.map((x) => x.h);
  const minH = Math.min(...hs);
  const maxH = Math.max(...hs);
  const alto = Math.round(ALTO_MIN + ((ALTO_MAX - ALTO_MIN) * (t.h - minH)) / (maxH - minH || 1));
  const escala = alto / t.h;
  const anchoMax = Math.max(230, window.innerWidth - 84); // nunca desborda la pantalla
  screen.style.width = Math.min(Math.round(t.w * escala), anchoMax) + 'px';
  screen.style.height = alto + 'px';
  const cam = document.getElementById('phone-cam');
  cam.className = 'phone-cam cam-' + t.cam;
  document.getElementById('tel-info').textContent = `Viewport ${t.w}×${t.h} px`;
}

/* ---------------- Moneda + planes ---------------- */
function setMoneda(m) {
  MONEDA = m;
  document.getElementById('sw-usd').classList.toggle('on', m === 'USD');
  document.getElementById('sw-uyu').classList.toggle('on', m === 'UYU');
  document.getElementById('sw-knob').classList.toggle('uyu', m === 'UYU');
  renderPlanes();
}

function renderPlanes() {
  const m = CONTENT.moneda;
  const wrap = document.getElementById('plans-grid');
  wrap.innerHTML = m.planes
    .map((p) => {
      const setup = p.equipo
        ? `<p class="plan-setup">${fmtMoneda(m.equipo[MONEDA])} de equipo <em>PAGO ÚNICO</em></p>`
        : `<p class="plan-setup">Sin equipo incluido</p>`;
      return `
      <div class="plan ${p.destacado ? 'on' : ''}">
        <h3>${p.nombre}</h3>
        <p class="plan-desc">${p.descripcion}</p>
        ${setup}
        <p class="plan-price">${fmtMoneda(p.mensual[MONEDA])}<span>/mes</span></p>
        <ul>${p.puntos.map((f) => `<li>${f}</li>`).join('')}</ul>
      </div>`;
    })
    .join('');
}

/* ---------------- Contacto: expander de correo ---------------- */
function toggleMail() {
  document.getElementById('mail-box').classList.toggle('open');
}

function mailUrls() {
  const { email, asunto, cuerpo } = CONTENT.contacto;
  const su = encodeURIComponent(asunto);
  const body = encodeURIComponent(cuerpo);
  return {
    app: `mailto:${email}?subject=${su}&body=${body}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${su}&body=${body}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${su}&body=${body}`,
    yahoo: `https://compose.mail.yahoo.com/?to=${email}&subj=${su}&body=${body}`,
    proton: `https://account.proton.me/mail`,
  };
}

function renderContacto() {
  const c = CONTENT.contacto;
  const u = mailUrls();
  document.getElementById('mail-box').innerHTML = `
    <p class="mail-to">Para: <b>${c.email}</b></p>
    <p class="mail-note">El mensaje ya lleva asunto y campos para tu nombre de negocio, ubicación y contacto.</p>
    <div class="mail-opts">
      <a href="${u.app}" class="mail-opt">Abrir mi app de correo</a>
      <a href="${u.gmail}" target="_blank" rel="noreferrer" class="mail-opt">Gmail</a>
      <a href="${u.outlook}" target="_blank" rel="noreferrer" class="mail-opt">Outlook</a>
      <a href="${u.yahoo}" target="_blank" rel="noreferrer" class="mail-opt">Yahoo Mail</a>
      <a href="${u.proton}" target="_blank" rel="noreferrer" class="mail-opt">Proton Mail</a>
    </div>`;
}

/* ---------------- Comidas rotando dentro de la campana ---------------- */
let foodIdx = 0;
function rotarComida() {
  const f = document.getElementById('logo-food');
  if (!f || !CONTENT.comidas?.length) return;
  foodIdx = (foodIdx + 1) % CONTENT.comidas.length;
  f.src = CONTENT.comidas[foodIdx];
}

/* ---------------- Redes sociales (footer) ---------------- */
const SOCIAL_ICONS = {
  github:
    '<svg viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .31.21.66.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.4" cy="6.6" r="1.4" fill="currentColor" stroke="none"/></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24"><path d="M16.6 3c.4 2.15 2 3.8 4.15 4.15v3.1a7.2 7.2 0 0 1-4.15-1.33v6.32A6.02 6.02 0 1 1 10.6 9.2c.35 0 .68.03 1 .08v3.35a2.72 2.72 0 1 0 1.9 2.6V3z"/></svg>',
};

function renderSocial() {
  const track = document.getElementById('social-track');
  if (!track || !CONTENT.social) return;
  const item = (s, dup) => {
    const inner = `${SOCIAL_ICONS[s.red] || ''}<span>${s.nombre}</span>`;
    const hid = dup ? ' aria-hidden="true" tabindex="-1"' : '';
    return s.url
      ? `<a class="social-item${dup ? ' dup' : ''}" href="${s.url}" target="_blank" rel="noopener"${hid}>${inner}</a>`
      : `<span class="social-item${dup ? ' dup' : ''}"${dup ? ' aria-hidden="true"' : ''}>${inner}</span>`;
  };
  // el track lleva la serie dos veces: el loop -50% queda perfecto
  track.innerHTML =
    CONTENT.social.map((s) => item(s, false)).join('') +
    CONTENT.social.map((s) => item(s, true)).join('');
}

/* ---------------- Init ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderTelefonos();
  document.getElementById('tel-sel').selectedIndex = 3; // iPhone 14 por defecto
  elegirTelefono(3);
  setMoneda(MONEDA);
  renderContacto();
  renderSocial();
  // la comida rota solo cuando la tapa está cerrada (inicio de cada ciclo)
  const lid = document.querySelector('.logo-anim .lid');
  if (lid) lid.addEventListener('animationiteration', rotarComida);

  // atajos de prueba: #demo-menu entra a la carta; #demo-item abre un producto; #demo-pin abre el modal de PIN
  if (location.hash === '#demo-menu' || location.hash === '#demo-item') {
    sentarMesa(typeof MESA_DEMO !== 'undefined' ? MESA_DEMO : 7);
    D.carta.screen = 'menu';
    renderTodo();
    if (location.hash === '#demo-item') cartaAbrir(1);
  }
  if (location.hash === '#demo-pin') {
    panelGo('admin');
    pinGuard('Eliminar mesa', () => {});
  }
  if (location.hash === '#demo-qr') {
    panelGo('admin');
    admSec('qr');
    qrGenerar();
    D.admin.qrVer = D.s.mesas[0].id;
    renderPanel();
  }
  if (location.hash === '#demo-ticket') {
    panelGo('pos');
    posSel(5);
    D.ticket = true;
    renderPanel();
  }

  // si cambia el viewport (rotación, barra del navegador), re-encuadra el teléfono
  window.addEventListener('resize', () => elegirTelefono(telActual));

  // Emulación táctil estilo DevTools dentro de la pantalla del teléfono:
  // el mouse actúa como un dedo — arrastrar = scroll (sin seleccionar),
  // click corto = tap. Se ve el "dedo" y un ripple al tocar.
  const pScreen = document.getElementById('phone-screen');
  if (pScreen) {
    const tcur = document.createElement('div');
    tcur.className = 'touch-cursor';
    pScreen.appendChild(tcur);

    let drag = null; // {x,y,el,sT,sL,moved}
    const scrollerOf = (el) => {
      for (let p = el; p && p !== pScreen; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 4) return { el: p, axis: 'y' };
        if (/(auto|scroll)/.test(s.overflowX) && p.scrollWidth > p.clientWidth + 4) return { el: p, axis: 'x' };
      }
      return null;
    };

    pScreen.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') {
        tcur.style.opacity = 0;
        return;
      }
      const r = pScreen.getBoundingClientRect();
      tcur.style.left = e.clientX - r.left + 'px';
      tcur.style.top = e.clientY - r.top + 'px';
      tcur.style.opacity = 1;
    });
    pScreen.addEventListener('pointerleave', () => {
      tcur.style.opacity = 0;
      tcur.classList.remove('down');
    });

    pScreen.addEventListener('pointerdown', (e) => {
      tcur.classList.add('down');
      const r = pScreen.getBoundingClientRect();
      const dot = document.createElement('div');
      dot.className = 'touch-dot';
      dot.style.left = e.clientX - r.left + 'px';
      dot.style.top = e.clientY - r.top + 'px';
      pScreen.appendChild(dot);
      setTimeout(() => dot.remove(), 460);
      if (e.pointerType !== 'mouse') return;
      const inField = e.target.closest('input,textarea,select');
      const sc = inField ? null : scrollerOf(e.target);
      drag = { x: e.clientX, y: e.clientY, el: sc && sc.el, axis: sc && sc.axis, sT: sc ? sc.el.scrollTop : 0, sL: sc ? sc.el.scrollLeft : 0, moved: false };
    });
    // el drag-scroll vive en window: sin pointer capture el click llega al botón real
    window.addEventListener('pointermove', (e) => {
      if (!drag || !drag.el || e.pointerType !== 'mouse') return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      if (drag.axis === 'y') drag.el.scrollTop = drag.sT - dy;
      else drag.el.scrollLeft = drag.sL - dx;
    });
    const endDrag = () => {
      tcur.classList.remove('down');
      // si arrastró, el próximo click es espurio (el "dedo" levantó del scroll)
      if (drag && drag.moved) {
        const kill = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          pScreen.removeEventListener('click', kill, true);
        };
        pScreen.addEventListener('click', kill, true);
        setTimeout(() => pScreen.removeEventListener('click', kill, true), 60);
      }
      drag = null;
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  }
});
