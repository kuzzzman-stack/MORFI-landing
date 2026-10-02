# -*- coding: utf-8 -*-
# Genera assets/contrato-morfi.pdf — contrato con plantilla MORFI, sin dependencias.
# Uso unico para crear el archivo estatico; no es parte del sitio.

import textwrap

PAGE_W, PAGE_H = 612, 792  # carta (points)
ML, MR = 56, 56
CW = PAGE_W - ML - MR       # ancho de contenido (500)
TOP_Y = PAGE_H - 150
BOTTOM_Y = 86

INK = (0.169, 0.118, 0.243)      # #2B1E3E
VIOLET = (0.416, 0.298, 0.576)   # #6A4C93
AMBER = (0.851, 0.557, 0.196)    # #D98E32
IVORY = (0.984, 0.969, 0.933)    # #FBF7EE
LILAC = (0.82, 0.76, 0.90)       # lila claro
GRAY = (0.42, 0.40, 0.47)
LINE = (0.85, 0.81, 0.75)
CREAM = (0.965, 0.945, 0.90)


def esc(s: str) -> bytes:
    s = (s.replace('—', '-').replace('–', '-')
         .replace('“', '"').replace('”', '"')
         .replace('’', "'").replace('‘', "'"))
    return (s.encode('latin-1')
             .replace(b'\\', b'\\\\').replace(b'(', b'\\(').replace(b')', b'\\)'))


# nota: los ops se emiten como latin-1 (WinAnsiEncoding) para soportar tildes


class Page:
    def __init__(self):
        self.ops = []

    def raw(self, s: str):
        self.ops.append(s.encode('latin-1'))

    def fill(self, c):
        self.raw(f'{c[0]} {c[1]} {c[2]} rg')

    def stroke(self, c):
        self.raw(f'{c[0]} {c[1]} {c[2]} RG')

    def rect(self, x, y, w, h, c):
        self.fill(c)
        self.raw(f'{x} {y} {w} {h} re f')

    def line(self, x1, y1, x2, y2, w, c):
        self.stroke(c)
        self.raw(f'{w} w {x1} {y1} m {x2} {y2} l S')

    def text(self, x, y, size, font, s, c):
        self.fill(c)
        self.raw(f'BT /{font} {size} Tf 1 0 0 1 {x} {y} Tm (' + esc(s).decode('latin-1') + ') Tj ET')

    def text_c(self, cx, y, size, font, s, c):
        w = len(s) * size * (0.55 if font == 'F2' else 0.50)
        self.text(cx - w / 2, y, size, font, s, c)

    def text_r(self, xr, y, size, font, s, c):
        w = len(s) * size * (0.55 if font == 'F2' else 0.50)
        self.text(xr - w, y, size, font, s, c)

    def circle(self, cx, cy, r, c):
        k = 0.5523 * r
        self.fill(c)
        self.raw(f'{cx + r} {cy} m')
        self.raw(f'{cx + r} {cy + k} {cx + k} {cy + r} {cx} {cy + r} c')
        self.raw(f'{cx - k} {cy + r} {cx - r} {cy + k} {cx - r} {cy} c')
        self.raw(f'{cx - r} {cy - k} {cx - k} {cy - r} {cx} {cy - r} c')
        self.raw(f'{cx + k} {cy - r} {cx + r} {cy - k} {cx + r} {cy} c f')

    def cloche(self, cx, cy, r):
        """Logo vectorial: campana de servicio (cupula violeta, perilla ambar, bandeja oscura)."""
        k = 0.5523 * r
        # cupula
        self.fill(VIOLET)
        self.raw(f'{cx - r} {cy} m')
        self.raw(f'{cx - r} {cy + k} {cx - k} {cy + r} {cx} {cy + r} c')
        self.raw(f'{cx + k} {cy + r} {cx + r} {cy + k} {cx + r} {cy} c h f')
        # base de la cupula (rect que cierra el arco)
        self.rect(cx - r, cy - r * 0.12, 2 * r, r * 0.12, VIOLET)
        # brillo en la cupula
        self.fill(LILAC)
        self.raw(f'{cx - r * 0.55} {cy + r * 0.30} m')
        self.raw(f'{cx - r * 0.55} {cy + r * 0.60} {cx - r * 0.35} {cy + r * 0.85} {cx - r * 0.10} {cy + r * 0.92} c')
        self.raw(f'{cx - r * 0.30} {cy + r * 0.68} {cx - r * 0.42} {cy + r * 0.50} {cx - r * 0.42} {cy + r * 0.30} c h f')
        # perilla
        self.rect(cx - 1.3, cy + r - 1, 2.6, r * 0.22, AMBER)
        self.circle(cx, cy + r + r * 0.20, r * 0.16, AMBER)
        # bandeja
        self.rect(cx - r * 1.28, cy - r * 0.32, 2.56 * r, r * 0.20, INK)

    def wordmark(self, x, y, size, c):
        """'MORFI' con la R espejada (matriz de texto con escala -1)."""
        w = {'M': 0.889, 'O': 0.778, 'R': 0.722, 'F': 0.611, 'I': 0.278}
        self.fill(c)
        mo = (w['M'] + w['O']) * size
        rr = w['R'] * size
        self.raw(f'BT /F2 {size} Tf 1 0 0 1 {x} {y} Tm (MO) Tj ET')
        self.raw(f'BT /F2 {size} Tf -1 0 0 1 {x + mo + rr:.2f} {y} Tm (R) Tj ET')
        self.raw(f'BT /F2 {size} Tf 1 0 0 1 {x + mo + rr:.2f} {y} Tm (FI) Tj ET')


pages = [Page()]
y = TOP_Y


def new_page():
    global y
    pages.append(Page())
    y = PAGE_H - 70


def ensure(h):
    if y - h < BOTTOM_Y:
        new_page()


def cur():
    return pages[-1]


def heading(num, title):
    global y
    ensure(48)
    p = cur()
    p.rect(ML, y - 1.5, 8, 8, AMBER)
    p.text(ML + 14, y, 10.5, 'F2', f'{num}. {title}', VIOLET)
    y -= 18


def para(text, indent=0):
    global y
    for ln in textwrap.wrap(text, 100):
        ensure(16)
        cur().text(ML + indent, y, 9.5, 'F1', ln, INK)
        y -= 13.5


def bullet(text):
    global y
    ensure(16)
    p = cur()
    p.circle(ML + 8, y + 3, 2.2, AMBER)
    for i, ln in enumerate(textwrap.wrap(text, 94)):
        p.text(ML + 18, y, 9.5, 'F1', ln, INK)
        y -= 13.5


def gap(h=10):
    global y
    y -= h


def field(x, y, label, w):
    p = cur()
    p.text(x, y, 9.5, 'F2', label, INK)
    lx = x + len(label) * 5.4 + 8
    p.rect(lx, y - 2, max(20, x + w - lx), 0.8, LINE)


# ===================== ENCABEZADO (pagina 1) =====================
p0 = pages[0]
p0.rect(0, PAGE_H - 96, PAGE_W, 96, INK)
p0.rect(0, PAGE_H - 99, PAGE_W, 3, AMBER)
p0.cloche(78, PAGE_H - 62, 15)
p0.wordmark(112, PAGE_H - 64, 23, IVORY)
p0.text(112, PAGE_H - 80, 8.5, 'F1', 'Sistema de gestion para restaurantes', LILAC)
p0.text_r(PAGE_W - MR, PAGE_H - 58, 8, 'F1', 'Contrato de servicio', LILAC)
p0.text_r(PAGE_W - MR, PAGE_H - 70, 8, 'F1', 'Documento legal', LILAC)

# ===================== TITULO =====================
p0.text_c(PAGE_W / 2, y, 16, 'F2', 'CONTRATO DE PRESTACION DE SERVICIO', INK)
y -= 16
p0.text_c(PAGE_W / 2, y, 9.5, 'F1', 'Servicio del sistema de gestion MORFI - modalidad local (on-premise)', GRAY)
y -= 10
p0.rect(PAGE_W / 2 - 40, y, 80, 1.2, AMBER)
y -= 26

# ===================== CLAUSULAS =====================
heading('PRIMERA', 'REUNIDOS')
para('De una parte, MORFI, en adelante EL PROVEEDOR, titular y desarrollador del sistema de '
     'gestion para restaurantes MORFI. De la otra parte, la persona fisica o juridica cuyos '
     'datos se consignan a continuacion, en adelante EL CLIENTE, titular del establecimiento '
     'gastronomico donde se implementara el servicio. Ambas partes se reconocen capacidad '
     'legal para contratar y declaran celebrar el presente contrato conforme a las clausulas '
     'siguientes.')
gap(8)
field(ML, y, 'Razon social / Nombre:', 300)
field(ML + 310, y, 'RUT / Documento:', 190)
y -= 22
field(ML, y, 'Direccion del local:', 300)
field(ML + 310, y, 'Telefono:', 190)
y -= 22
field(ML, y, 'Correo electronico:', 300)
field(ML + 310, y, 'Ciudad / Departamento:', 190)
y -= 14
gap(8)

heading('SEGUNDA', 'OBJETO DEL CONTRATO')
para('EL PROVEEDOR prestara a EL CLIENTE el servicio del sistema MORFI, compuesto por los '
     'siguientes modulos:')
gap(2)
bullet('Carta digital con acceso por codigo QR desde la mesa (sin instalacion de aplicaciones).')
bullet('Monitor de cocina (KDS) con comandas ordenadas por estacion y cronometro.')
bullet('Punto de venta y caja (POS) con mapa de mesas, cierre de cuenta e impresion termica.')
bullet('Llamador de mozo con panel de alertas en tiempo real.')
bullet('Panel de administracion: menu, mesas, marca, temas y codigos QR.')
gap(6)

heading('TERCERA', 'MODALIDAD DE FUNCIONAMIENTO')
para('El sistema opera integramente dentro de la red local del establecimiento de EL CLIENTE. '
     'No requiere conexion a internet para su funcionamiento habitual en el salon, ni implica '
     'comisiones por pedido. La informacion operativa (menu, pedidos, mesas y ventas) reside '
     'en el equipo local y no en servidores de terceros.')
gap(8)

heading('CUARTA', 'PLANES Y COSTOS')
para('EL CLIENTE contrata el plan seleccionado al pie. El costo del equipo, cuando aplica, '
     'constituye un PAGO UNICO y es independiente de la mensualidad del servicio.')
gap(4)
# --- tabla de planes ---
tbl_x = ML
cols = [110, 170, 110, 110]  # suma 500
rows = [
    ('Plan', 'Equipo (PAGO UNICO)', 'Mensualidad', 'Soporte'),
    ('Basico', 'No incluye', 'USD 100 / mes', 'Correo'),
    ('Master', 'USD 325', 'USD 80 / mes', 'Correo'),
    ('Alivio', 'USD 325', 'USD 100 / mes', 'Prioritario'),
    ('Equilibrio', 'USD 325', 'USD 130 / mes', 'Prioritario + ajustes'),
]
ROW_H = 20
ensure(ROW_H * len(rows) + 10)
for ri, row in enumerate(rows):
    ry = y - ROW_H
    if ri == 0:
        cur().rect(tbl_x, ry, sum(cols), ROW_H, VIOLET)
    elif ri % 2 == 0:
        cur().rect(tbl_x, ry, sum(cols), ROW_H, CREAM)
    cur().rect(tbl_x, ry, sum(cols), 0.6, LINE)
    cx = tbl_x
    for ci, cell in enumerate(row):
        f = 'F2' if ri == 0 else 'F1'
        c = IVORY if ri == 0 else INK
        cur().text(cx + 8, ry + 6.5, 8.5, f, cell, c)
        cx += cols[ci]
    y = ry
y -= 6
para('Valores expresados en dolares estadounidenses. El equivalente en pesos uruguayos se '
     'determina al tipo de cambio del dia de facturacion. El plan elegido se marca al pie '
     'de este documento.')
gap(8)

heading('QUINTA', 'FORMA DE PAGO')
para('El pago del equipo, cuando corresponda, se abona al momento de la instalacion. La '
     'mensualidad se factura por adelantado y se abona dentro de los primeros cinco (5) dias '
     'habiles de cada mes. El atraso superior a quince (15) dias faculta a EL PROVEEDOR a '
     'suspender el soporte hasta la regularizacion, sin que ello afecte el funcionamiento '
     'local del sistema.')
gap(8)

heading('SEXTA', 'INSTALACION Y PUESTA EN MARCHA')
para('EL PROVEEDOR realizara la instalacion y configuracion inicial del sistema conforme al '
     'plan contratado, incluyendo la carga del menu, la generacion de los codigos QR de las '
     'mesas y la configuracion de la impresora termica cuando aplique. EL CLIENTE debera '
     'proveer red local operativa, suministro electrico y el espacio fisico para el equipo.')
gap(8)

heading('SEPTIMA', 'SOPORTE Y MANTENIMIENTO')
para('EL PROVEEDOR brindara soporte por correo electronico dentro de los alcances del plan '
     'contratado, con tiempos de respuesta razonables en dias y horarios habiles. Las '
     'actualizaciones del software estan incluidas en la mensualidad. El soporte no cubre '
     'danos fisicos del hardware, fallas de la red local o de energia del establecimiento, '
     'ni inconvenientes derivados del uso indebido del sistema.')
gap(8)

heading('OCTAVA', 'DATOS, PRIVACIDAD Y CONFIDENCIALIDAD')
para('Toda la informacion generada por el uso del sistema (menu, pedidos, mesas, ventas y '
     'demas registros) pertenece a EL CLIENTE y permanece almacenada en su propio equipo. '
     'EL PROVEEDOR no accede a dichos datos salvo para tareas de soporte expresamente '
     'solicitadas por EL CLIENTE. Ambas partes se obligan a mantener confidencialidad sobre '
     'la informacion a la que accedan con motivo de este contrato.')
gap(8)

heading('NOVENA', 'LICENCIA DE USO Y PROPIEDAD INTELECTUAL')
para('EL PROVEEDOR concede a EL CLIENTE una licencia de uso del software MORFI, de caracter '
     'no exclusivo e intransferible, vigente mientras el servicio se encuentre al dia. Queda '
     'prohibida la copia, reventa, sublicenciamiento o ingenieria inversa del software. El '
     'equipo fisico adquirido mediante el PAGO UNICO es propiedad de EL CLIENTE; el software '
     'permanece siendo titularidad de EL PROVEEDOR.')
gap(8)

heading('DECIMA', 'PLAZO, RENOVACION Y RESCISION')
para('El contrato tiene plazo mensual y se renueva automaticamente. Cualquiera de las partes '
     'podra rescindirlo mediante aviso escrito -el correo electronico es medio valido- con '
     'una anticipacion minima de treinta (30) dias. Abonada la mensualidad del mes en curso, '
     'EL CLIENTE conserva el equipo adquirido; el servicio y el soporte cesan al finalizar '
     'el periodo facturado.')
gap(8)

heading('DECIMA PRIMERA', 'LIMITACION DE RESPONSABILIDAD')
para('EL PROVEEDOR no respondera por lucro cesante, perdida de datos causada por fallas '
     'electricas o de la red local, ni por danos derivados del uso indebido del sistema. En '
     'todo caso, la responsabilidad maxima de EL PROVEEDOR quedara limitada al equivalente '
     'de tres (3) mensualidades del plan contratado.')
gap(8)

heading('DECIMA SEGUNDA', 'LEGISLACION Y JURISDICCION')
para('El presente contrato se rige por las leyes de la Republica Oriental del Uruguay. Para '
     'cualquier controversia derivada de su interpretacion o cumplimiento, las partes se '
     'someten a los tribunales competentes de la ciudad de Montevideo, con renuncia a '
     'cualquier otro fuero que pudiera corresponder.')
gap(14)

# ===================== PLAN ELEGIDO + FIRMAS =====================
ensure(150)
heading('DECIMA TERCERA', 'ACEPTACION Y FIRMAS')
para('En prueba de conformidad, las partes firman el presente documento. Plan contratado:')
gap(4)
# casillas de plan
chk_x = ML
for name in ['Basico', 'Master', 'Alivio', 'Equilibrio']:
    cur().rect(chk_x, y, 9, 9, (1, 1, 1))
    cur().raw(f'{LINE[0]} {LINE[1]} {LINE[2]} RG 0.8 w {chk_x} {y} 9 9 re S')
    cur().text(chk_x + 14, y + 1, 9.5, 'F1', name, INK)
    chk_x += 14 + len(name) * 5 + 22
y -= 26

# cajas de firma
BOX_W, BOX_H = 235, 108
ensure(BOX_H + 20)
for i, titulo in enumerate(['EL PROVEEDOR', 'EL CLIENTE']):
    bx = ML + i * (BOX_W + 30)
    by = y - BOX_H
    cur().raw(f'{LINE[0]} {LINE[1]} {LINE[2]} RG 0.9 w {bx} {by} {BOX_W} {BOX_H} re S')
    cur().text_c(bx + BOX_W / 2, by + BOX_H - 18, 9.5, 'F2', titulo, VIOLET)
    for j, lbl in enumerate(['Firma:', 'Nombre:', 'Documento:', 'Fecha:']):
        ly = by + BOX_H - 42 - j * 19
        cur().text(bx + 14, ly, 8.5, 'F1', lbl, GRAY)
        cur().rect(bx + 66, ly - 2, BOX_W - 86, 0.7, LINE)
y -= BOX_H + 8
para('Fecha de inicio del servicio: ____ / ____ / ______', 0)

# ===================== PIES DE PAGINA =====================
n = len(pages)
for i, pg in enumerate(pages, 1):
    pg.rect(ML, 60, CW, 0.7, LINE)
    pg.text(ML, 48, 7.5, 'F1', 'MORFI - Sistema de gestion para restaurantes - kuzzzman@proton.me', GRAY)
    pg.text_r(PAGE_W - MR, 48, 7.5, 'F1', f'Pagina {i} de {n}', GRAY)


# ===================== ENSAMBLADO DEL PDF =====================
def pdf(objects):
    head = b'%PDF-1.4\n'
    body = b''
    offsets = []
    for i, o in enumerate(objects, 1):
        offsets.append(len(head) + len(body))
        body += f'{i} 0 obj\n'.encode() + o + b'\nendobj\n'
    xref_pos = len(head) + len(body)
    xref = f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode()
    for off in offsets:
        xref += f'{off:010d} 00000 n \n'.encode()
    trailer = (
        f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n'
        f'startxref\n{xref_pos}\n%%EOF\n'
    ).encode()
    return head + body + xref + trailer


objs = [
    b'<< /Type /Catalog /Pages 2 0 R >>',
    None,  # pages (se completa abajo)
    b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
]
# pares (pagina, contenido): objetos 5..N
kids = []
for pg in pages:
    stream = b'\n'.join(pg.ops)
    page_id = len(objs) + 1
    kids.append(page_id)
    objs.append(
        f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] '
        f'/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {page_id + 1} 0 R >>'
        .encode())
    objs.append(b'<< /Length ' + str(len(stream)).encode() + b' >>\nstream\n' + stream + b'\nendstream')
objs[1] = f'<< /Type /Pages /Kids [{" ".join(f"{k} 0 R" for k in kids)}] /Count {len(kids)} >>'.encode()

with open('assets/contrato-morfi.pdf', 'wb') as f:
    f.write(pdf(objs))
print('OK assets/contrato-morfi.pdf')
