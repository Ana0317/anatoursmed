# Ana María · Exotic Fruit Tasting — Landing page

Sitio estático (en inglés, para turistas angloparlantes) centrado en **Ana María**
y su experiencia de degustación de frutas exóticas en la Plaza Minorista de Medellín.
Diseño terracota + arena, interactivo y responsivo. Contacto por WhatsApp al
**+57 319 7333300**.

## Qué se sube al repositorio (sitio)

- `index.html` — estructura y contenido.
- `styles.css` — sistema visual (responsive, animaciones).
- `script.js` — galería con lightbox, contadores, explorador de sabores con foto,
  ruta interactiva con foto, filtros de reseñas, menú móvil y formulario de WhatsApp.
- 22 fotos `.jpg` reales optimizadas (en la misma carpeta que `index.html`, ~5 MB). Cada sección tiene fotos.
- `vercel.json` — configuración mínima (URLs limpias).
- `.gitignore` — excluye archivos de trabajo pesados.

> Las carpetas `_originales/` y `_deploy/` y los `.zip` NO se suben (están en `.gitignore`).
> Son solo respaldos locales de las fotos originales sin optimizar.

## Publicar con GitHub + Vercel (paso a paso)

1. **Crea el repositorio en GitHub**
   - Abre GitHub Desktop → *File → Add local repository* → elige esta carpeta
     (`Ana Airbnb`). Si te pide inicializar, acepta *Create a repository*.
   - Escribe un resumen (ej. "Landing Ana María") → *Commit to main*.
   - Botón *Publish repository* (puedes dejarlo privado o público).

2. **Despliega en Vercel**
   - Entra a vercel.com → *Add New… → Project*.
   - *Import* el repositorio que acabas de publicar.
   - Framework Preset: **Other** (es un sitio estático, sin build).
   - Build Command: *(vacío)* · Output Directory: *(vacío / raíz)*.
   - Pulsa **Deploy**. En ~30 s tendrás un enlace tipo
     `https://ana-airbnb.vercel.app` que abres en el celular y compartes.

3. **(Opcional) Nombre y dominio**
   - En Vercel → *Settings → Domains* puedes cambiar el subdominio o conectar
     un dominio propio (ej. `frutasconanamaria.com`).

4. **Actualizar en el futuro**
   - Cambia cualquier archivo, haz *Commit* y *Push* en GitHub Desktop.
   - Vercel redepliega automáticamente. El enlace se mantiene.

## Cambiar o añadir fotos

Las fotos `.jpg` están junto a `index.html`. Para reemplazar una, sobrescribe el
archivo con el mismo nombre. La galería, el explorador de sabores y la ruta definen
sus imágenes en el arreglo correspondiente al inicio de `script.js`.

## Contacto

Todos los botones y el formulario abren WhatsApp al número `+57 319 7333300`.
