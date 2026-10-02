# MORFI — Landing

Sitio estático de presentación de MORFI v2: pitch del producto, demo
interactiva (simulación de Carta / KDS / POS / Alertas / Admin), planes y
contacto. Sin build, sin dependencias: HTML + CSS + JS puro.

## Estructura

```
index.html            # la página entera
css/styles.css        # estilos (paleta marfil + violeta + ámbar)
js/content.js         # CONTENIDO EDITABLE: contacto, precios USD/UYU, textos
js/data.js            # datos de la demo (menú, etiquetas)
js/demo.js            # lógica de la demo (estado compartido entre paneles)
js/main.js            # nav, teléfonos, moneda, contacto
assets/               # logo completo + logo-top/bottom (animación) + contrato PDF
assets/food/          # PNGs de comida que rotan dentro de la campana del logo
make-contrato.py      # regenera assets/contrato-morfi.pdf (uso único, opcional)
```

## Correr local

```bash
python -m http.server 8080
# http://localhost:8080
```

(o abrir `index.html` directo en el navegador)

## GitHub Pages

Subir la carpeta a un repo y activar Pages en Settings → Pages → rama main /
raíz. Para dominio propio: agregar el archivo `CNAME` con el dominio
(ej: `morfi.com.uy`) y apuntar el DNS a GitHub Pages.

## Editar

Todo el copy editable está en `js/content.js`: email de contacto, precios en
USD y UYU (equipo = pago único), planes, pasos, beneficios y modelos de
teléfono de la demo.
