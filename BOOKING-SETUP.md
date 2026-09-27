# Reservas online — Guía de instalación (Google Sheets)

El sitio ya tiene la sección **Tours** y **Book / Agenda**, y el panel privado **/admin**.
Mientras no conectes Google, todo funciona en **modo demo** (las reservas se guardan
solo en el navegador de cada persona). Sigue estos pasos para que sea **real y compartido**.

## 1. Crear la hoja de Google
1. Entra a **sheets.new** (crea una hoja nueva). Ponle nombre, p. ej. "Reservas Ana María".

## 2. Pegar el script
1. En la hoja: menú **Extensiones → Apps Script**.
2. Borra el código que aparezca y **pega TODO** el contenido de `google-apps-script.gs`.
3. Cambia la línea `const ADMIN_PASSCODE = 'CAMBIA_ESTA_CLAVE';` por la **contraseña
   privada de Ana** (la que usará para entrar a /admin). Guarda (💾).

## 3. Publicar el script como Web App
1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. En "Tipo", elige **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta).
   - **Quién tiene acceso:** **Cualquier usuario**.
4. **Implementar** → autoriza los permisos (elige tu cuenta → "Permitir").
5. Copia la **URL de la aplicación web** (termina en `/exec`).

## 4. Conectar el sitio
1. Abre `booking-config.js`.
2. Pega la URL entre las comillas:
   ```js
   GAS_URL: "https://script.google.com/macros/s/....../exec",
   ```
3. Guarda.

## 5. Subir a tu repo / Vercel
Sube (o vuelve a subir) estos archivos junto al sitio:
`index.html`, `styles.css`, `script.js`, `booking-config.js`, `booking.js`, `admin.html`
(y las fotos). Vercel redepliega solo. Listo:
- Visitantes: **tusitio.vercel.app** → sección **Book**.
- Ana María: **tusitio.vercel.app/admin.html** → contraseña → tablero.

## Cómo funciona
- Cada reserva se guarda como una fila en la pestaña **Bookings** de tu hoja.
- Los visitantes ven **cuántos cupos hay ocupados** en cada horario (máx. 7) y qué
  tours ya están agendados — **sin ver datos personales de otros**.
- Al reservar pueden marcar **alergias/intolerancias**.
- Ana ve en **/admin** (con contraseña): todas las agendas, personas, contacto y
  alergias resaltadas. Los datos personales solo se entregan con la contraseña correcta.

## Notas
- Capacidad por horario: **7 personas** (cambiable en `google-apps-script.gs` y
  `booking-config.js`, deben coincidir).
- Si cambias el script después, usa **Implementar → Gestionar implementaciones →
  editar (lápiz) → Nueva versión** para que los cambios salgan en la misma URL.
- Si ves un error de CORS/permiso, revisa que "Quién tiene acceso" sea **Cualquier usuario**.
