# 🎯 Instrucciones Visuales - Fase 1

## 🚀 Pasos para Probar

### 1️⃣ Abrir Terminal
```bash
npm run dev
```

Verás algo como:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in 2.5s
```

---

### 2️⃣ Abrir Navegador

Navega a:
```
http://localhost:3000/test-random
```

---

### 3️⃣ Qué Verás

```
╔═══════════════════════════════════════════════════╗
║  🎲 Test: Anime Random                            ║
║  Prueba de la Fase 1 - Jikan API                  ║
╠═══════════════════════════════════════════════════╣
║                                                    ║
║  ┌───────────────────────────────────────────┐   ║
║  │  [IMAGEN]  │  Cowboy Bebop                │   ║
║  │            │  カウボーイビバップ           │   ║
║  │   Anime    │                               │   ║
║  │   Cover    │  ⭐ 8.76  📅 1998  📺 26 eps │   ║
║  │            │                               │   ║
║  │            │  R - 17+                      │   ║
║  │            │                               │   ║
║  │            │  In the year 2071...          │   ║
║  │            │                               │   ║
║  │            │  Ver en MyAnimeList →         │   ║
║  └────────────┴───────────────────────────────┘   ║
║                                                    ║
║  [ 🎲 Obtener otro anime random ]                 ║
║                                                    ║
╠═══════════════════════════════════════════════════╣
║  📋 Información Técnica                           ║
║  • Endpoint: anime.random.getOne()                ║
║  • API: Jikan v4 (MyAnimeList)                    ║
║  • Retry: 2 reintentos con backoff               ║
║  • Timeout: 10 segundos                           ║
╚═══════════════════════════════════════════════════╝
```

---

### 4️⃣ Interacciones

**Click en el botón "🎲 Obtener otro anime random":**
- ⏳ Muestra spinner de carga
- 📡 Hace request a Jikan API
- 🔄 Retry automático si falla
- ✅ Muestra nuevo anime

**Si hay error:**
```
╔═══════════════════════════════════════╗
║  ⚠️ Error                            ║
║  Jikan API is experiencing issues    ║
║                                       ║
║  [ Reintentar ]                      ║
╚═══════════════════════════════════════╝
```

**Durante carga:**
```
╔═══════════════════════════════════════╗
║        ⏳                             ║
║  Buscando anime random...            ║
╚═══════════════════════════════════════╝
```

---

## 🎨 Personalización Rápida

### Cambiar colores del botón
En `src/app/_components/random-anime.tsx`, línea ~121:

```tsx
// Azul (actual)
className="rounded bg-blue-600 px-6 py-3 ... hover:bg-blue-700"

// Verde
className="rounded bg-green-600 px-6 py-3 ... hover:bg-green-700"

// Morado
className="rounded bg-purple-600 px-6 py-3 ... hover:bg-purple-700"

// Rojo
className="rounded bg-red-600 px-6 py-3 ... hover:bg-red-700"
```

### Cambiar tamaño de imagen
En `src/app/_components/random-anime.tsx`, línea ~58:

```tsx
// Actual (192x256)
<Image ... width={192} height={256} className="h-64 w-48" />

// Más grande (256x384)
<Image ... width={256} height={384} className="h-96 w-64" />

// Más pequeño (128x192)
<Image ... width={128} height={192} className="h-48 w-32" />
```

---

## 📱 Responsive

El componente funciona en:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

---

## 🔍 Verificar Logs

En la consola del servidor (donde ejecutaste `npm run dev`):

```
[TRPC] anime.random.getOne took 1234ms to execute
```

Esto muestra el tiempo de ejecución del endpoint.

---

## 🧪 Probar Error Handling

### Simular Timeout
1. Desconecta internet
2. Click en "Obtener otro anime"
3. Verás el error de timeout después de 10 segundos

### Simular Error de API
1. Espera a que Jikan esté lento/caído
2. El retry automático se activará
3. Verás hasta 3 intentos antes de fallar

---

## ✅ Checklist de Funcionalidad

Verifica que todo funcione:

- [ ] Página carga correctamente en `/test-random`
- [ ] Se muestra un anime al cargar
- [ ] La imagen se ve correctamente
- [ ] El título en inglés/japonés se muestra
- [ ] El score y metadata son visibles
- [ ] La sinopsis se lee completa
- [ ] El botón "Obtener otro anime" funciona
- [ ] El loading state aparece al refrescar
- [ ] Los errores se manejan bien
- [ ] El enlace a MyAnimeList funciona
- [ ] No hay errores en la consola del navegador

---

## 🎉 Si Todo Funciona...

**¡FASE 1 COMPLETA!** 🎊

Puedes:
1. Integrar el componente en tu página principal
2. Personalizar los estilos
3. Usar el hook `useRandomAnime()` en otros componentes
4. Esperar el comando **CONTINUA** para la Fase 2

---

## 📞 Troubleshooting Visual

### ❌ Imagen no carga
**Síntoma:** Cuadro gris en lugar de imagen

**Solución:** Verifica `next.config.js` tiene:
```js
images: {
  remotePatterns: [
    { hostname: "cdn.myanimelist.net" }
  ]
}
```

### ❌ Error 500 en consola
**Síntoma:** "Failed to fetch" en red

**Solución:** Verifica que Jikan API esté disponible en:
https://api.jikan.moe/v4/random/anime

### ❌ Página no existe (404)
**Síntoma:** "404 This page could not be found"

**Solución:** Verifica que el archivo existe:
`src/app/test-random/page.tsx`

### ❌ Error de tipos
**Síntoma:** TypeScript se queja

**Solución:** Ejecuta:
```bash
npm run build
```

---

## 🎯 Siguiente Paso

**Cuando estés listo para Fase 2, escribe:**
```
CONTINUA
```

La Fase 2 implementará:
- Recomendación según estado de ánimo
- API: AniList GraphQL
- Input: mood/genre
- Output: lista de animes recomendados

