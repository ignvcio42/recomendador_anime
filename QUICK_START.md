# 🚀 Quick Start - Recomendador Anime

## Fase 1: Random (Jikan) - COMPLETADA ✅

### Instalación y Configuración

1. **Instalar dependencias** (si no lo has hecho):
```bash
npm install
```

2. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

3. **Abrir en navegador**:
```
http://localhost:3000/test-random
```

---

## 🎯 Probar el Endpoint

### Opción 1: Página de Test (Recomendado)
Visita: `http://localhost:3000/test-random`

Esta página incluye:
- ✅ Componente completo con UI
- ✅ Botón para obtener otro anime
- ✅ Manejo de loading y errores
- ✅ Información técnica

### Opción 2: Integrar en tu Página Principal

Edita `src/app/page.tsx`:

```tsx
import { RandomAnime } from "~/app/_components/random-anime";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Recomendador de Anime</h1>
      <div className="mt-8">
        <RandomAnime />
      </div>
    </main>
  );
}
```

### Opción 3: Hook Personalizado

```tsx
"use client";

import { useRandomAnime } from "~/app/_components/random-anime";

export default function MyPage() {
  const { anime, isLoading, error, getNewAnime } = useRandomAnime();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{anime?.title.default}</h1>
      <img src={anime?.imageUrl} alt={anime?.title.default} />
      <button onClick={getNewAnime}>🎲 Otro anime</button>
    </div>
  );
}
```

---

## 📂 Archivos Creados

```
✅ src/types/anime.ts              # Tipos y DTOs
✅ src/lib/jikan.ts                # Cliente HTTP con retry
✅ src/server/api/routers/anime.ts # Router tRPC
✅ src/server/api/root.ts          # Actualizado con animeRouter
✅ src/app/_components/random-anime.tsx # Componente React
✅ src/app/test-random/page.tsx    # Página de prueba
✅ src/__tests__/jikan.test.ts     # Tests unitarios
✅ FASE_1_RANDOM.md                # Documentación completa
```

---

## 🧪 Ejecutar Tests

```bash
# Si tienes Jest configurado
npm test src/__tests__/jikan.test.ts

# O manualmente con Node
node --experimental-test src/__tests__/jikan.test.ts
```

---

## 🎨 Personalizar UI

El componente `RandomAnime` usa Tailwind CSS. Puedes personalizar los estilos en:
- `src/app/_components/random-anime.tsx`

Clases principales:
- `rounded-lg border border-gray-300 p-6` - Container
- `bg-blue-600 hover:bg-blue-700` - Botón
- `text-2xl font-bold` - Título

---

## 🔧 API tRPC Disponible

### `anime.random.getOne()`
**Tipo**: Query (sin parámetros)  
**Retorno**: `AnimeBase`

```typescript
// En componente cliente
const { data } = api.anime.random.getOne.useQuery();

// En Server Component
const anime = await api.anime.random.getOne();
```

---

## 📊 Estructura de Respuesta

```typescript
{
  id: 1,
  title: {
    romaji: "Cowboy Bebop",
    english: "Cowboy Bebop",
    native: "カウボーイビバップ",
    default: "Cowboy Bebop"
  },
  imageUrl: "https://cdn.myanimelist.net/...",
  url: "https://myanimelist.net/anime/1/...",
  synopsis: "In the year 2071...",
  rating: "R - 17+",
  score: 8.76,
  episodes: 26,
  year: 1998
}
```

---

## ⚠️ Troubleshooting

### Error: "Jikan API timeout"
- **Causa**: Jikan API está lento o caído
- **Solución**: Espera unos segundos y vuelve a intentar (el retry automático se encarga)

### Error: "Rate limit exceeded"
- **Causa**: Demasiadas requests a Jikan
- **Solución**: Espera 1 minuto (límite: 60 req/min)

### Error: "Failed to fetch"
- **Causa**: Sin conexión a internet o Jikan caído
- **Solución**: Verifica tu conexión y el estado de Jikan API

---

## 🎉 ¡Listo!

La Fase 1 está completamente funcional. 

**Próximas fases** (esperando comando **CONTINUA**):
- Fase 2: Recomendación según estado de ánimo (AniList)
- Fase 3: Recomendación según 3 animes vistos (AniList)
- Fase 4: IA similar a X (vector/LLM)

