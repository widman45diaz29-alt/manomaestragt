# manomaestraGT para el Hogar

Sitio empresarial responsive en React + Vite, con cotización por WhatsApp, acceso social y panel CMS opcional mediante Firebase. Todos los datos comerciales provisionales están centralizados.

## Inicio rápido (Windows PowerShell)
```powershell
cd ruta\manomaestragt
npm.cmd install
npm.cmd run dev
```
Compilar y revisar:
```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```
La salida de producción es `dist`.

## Configuración obligatoria
1. Edita `src/config/siteConfig.js`: teléfono, WhatsApp solo dígitos en formato `502XXXXXXXX`, correo, horarios y cobertura.
2. Reemplaza `https://example.com` en `index.html`, `public/robots.txt` y `public/sitemap.xml`.
3. Sustituye imágenes de demostración en `public/assets`.
4. Actualiza la política de privacidad con la identidad legal real.

## Acceso Google/Facebook y panel administrativo
La web pública funciona sin Firebase. Para acceso social y edición desde la aplicación:
1. Crea un proyecto Firebase y una aplicación web.
2. Activa Authentication: Google y, si se requiere, Facebook. Facebook exige configurar una app de Meta y su OAuth redirect URI.
3. Crea Firestore y habilita Storage para cargar imágenes desde el panel.
4. Copia `.env.example` como `.env` y agrega los valores públicos de configuración. No publiques `.env`.
5. Define `VITE_ADMIN_EMAILS` con correos administrativos separados por comas.
6. Reglas mínimas sugeridas de Firestore:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/public {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email in ['administrador@tuempresa.com'];
    }
  }
}
```
La autorización real debe repetirse en las reglas; la variable del frontend solo controla la interfaz.

## Publicar en Cloudflare Pages
- Conecta el repositorio de GitHub.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Agrega las variables `VITE_*` en Settings > Environment variables si usas Firebase.
- Publica. `_redirects` conserva las rutas hash y `_headers` agrega cabeceras de seguridad.

## SEO local
- Verifica el dominio en Google Search Console y envía `/sitemap.xml`.
- Crea un Perfil de Empresa en Google solo si el negocio cumple los requisitos; configura área de servicio sin publicar una dirección residencial.
- No se incluyó JSON-LD LocalBusiness porque faltan teléfono, URL, horarios y datos legales reales. Agrégalo cuando sean confirmados.

## Git
```powershell
git init
git add .
git commit -m "Sitio inicial Mano Maestra GT"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

## Qué depende de proveedor externo
- Google/Facebook Login y CMS: Firebase Authentication + Firestore.
- Envío directo por correo/almacenamiento de formularios: no incluido. Puede añadirse con Cloudflare Pages Functions, Formspree o Firebase Functions después de revisar privacidad y límites.
- WhatsApp: abre un mensaje prellenado; el visitante decide enviarlo.

### Regla orientativa de Storage
```
rules_version = '2';
service firebase.storage { match /b/{bucket}/o { match /site/services/{file} { allow read: if true; allow write: if request.auth != null && request.auth.token.email in ['administrador@tuempresa.com']; } } }
```
