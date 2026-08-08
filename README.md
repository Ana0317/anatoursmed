# Ana María · Frutas Exóticas — Landing page

Landing page estática que gira en torno a **Ana María** y su experiencia
"Degustación de frutas exóticas colombianas" en la Plaza Minorista de Medellín.
Diseño delicado (paleta terracota + arena), interactivo y responsivo. Contacto
directo por WhatsApp al **+57 319 7333300**.

## Archivos

- `index.html`: estructura y contenido.
- `styles.css`: sistema visual (paleta terracota/arena, responsive, animaciones).
- `script.js`: galería con lightbox, contadores animados, explorador de sabores,
  timeline, filtros de reseñas, menú móvil, barra de progreso y formulario de WhatsApp.
- `assets/ana-maria.png`: foto principal de Ana María (protagonista, en el hero).

## Interacciones

- Barra de progreso de scroll y header que se compacta.
- Contadores animados (5.0 · 27 reseñas · 2 h).
- Retrato flotante de Ana María con "chips" informativos.
- Explorador de sabores (tropical / cítrico / cremoso / aromático).
- Galería en mosaico con lightbox (teclado: ← → Esc).
- Timeline interactiva de la ruta.
- Reseñas filtrables (todas / familias / conocimiento / ve con hambre).
- Botón flotante de WhatsApp + formulario que arma el mensaje.

## Fotos

- **Hero**: foto de Ana María suministrada (`./assets/ana-maria.png`).
- **Sección anfitriona y galería**: 7 fotos reales de la experiencia de Ana María,
  tomadas del Airbnb (exp. 4054609), servidas desde el CDN de Airbnb. Sin repetir.
- Para cambiarlas, edita el arreglo `GALLERY` en `script.js` (cada entrada usa el
  `id` de la imagen del CDN) y el `src` de la sección anfitriona en `index.html`.

## Despliegue en Vercel

1. Sube estos archivos a un repositorio de GitHub.
2. En Vercel, crea un nuevo proyecto desde ese repositorio.
3. Sin build command. La salida pública es la raíz del proyecto.

## Fuentes de imágenes

- Foto principal de Ana María (hero): suministrada por el usuario.
- Resto de fotos: experiencia de Ana María en Airbnb (exp. 4054609). Son las fotos
  originales de la publicación. Al ser una web promocional de la misma experiencia,
  se usan las imágenes reales del recorrido.

## Contacto

Todos los botones y el formulario abren WhatsApp al número `+57 319 7333300`.
