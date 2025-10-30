# Fase 1 — Random (Jikan) ✅

## Objetivo
Implementar un endpoint que retorne 1 anime aleatorio vía Jikan API.

## Fuente
**Jikan REST API**: `GET https://api.jikan.moe/v4/random/anime`

---

## 📁 (a) Diseño de Carpetas

```
src/
├── types/
│   └── anime.ts                 # DTOs y tipos (AnimeBase, JikanRandomAnimeResponse)
├── lib/
│   └── jikan.ts                 # Cliente HTTP con timeout y retry exponencial
├── server/
│   └── api/
│       ├── root.ts              # Router principal (incluye animeRouter)
│       └── routers/
│           └── anime.ts         # Router tRPC con anime.random.getOne
├── app/
│   └── _components/
│       └── random-anime.tsx     # Componente React de ejemplo
└── __tests__/
    └── jikan.test.ts            # Tests con mock de fetch
```

---

## 🎯 (b) Endpoints tRPC

### `anime.random.getOne()`
- **Tipo**: Query (sin input)
- **Retorno**: `Promise<AnimeBase>`
- **Descripción**: Obtiene un anime aleatorio desde Jikan API v4

**Uso desde cliente:**
```typescript
const { data, isLoading, error } = api.anime.random.getOne.useQuery();
```

**Uso desde servidor (SSR):**
```typescript
const anime = await api.anime.random.getOne();
```

---

## 📦 (c) Tipos y DTOs

### `AnimeBase` (salida normalizada)
```typescript
type AnimeBase = {
  id: number | string;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
    default: string;
  };
  imageUrl?: string;
  url?: string;
  synopsis?: string;
  rating?: string;
  score?: number;
  episodes?: number;
  year?: number;
}
```

### `JikanRandomAnimeResponse` (respuesta cruda de API)
```typescript
type JikanRandomAnimeResponse = {
  data: {
    mal_id: number;
    url: string;
    images: { jpg?: { image_url?: string; ... }; ... };
    title: string;
    title_english?: string | null;
    title_japanese?: string | null;
    synopsis?: string | null;
    rating?: string | null;
    score?: number | null;
    episodes?: number | null;
    year?: number | null;
    // ...
  };
}
```

### Mapper
```typescript
function mapJikanToAnimeBase(jikanData): AnimeBase
```

---

## 🚀 (d) Ejemplo de Uso

### En un componente React (App Router)

```tsx
"use client";

import { api } from "~/trpc/react";

export function MyComponent() {
  const { data: anime, isLoading, error, refetch } = 
    api.anime.random.getOne.useQuery();

  if (isLoading) return <div>Cargando anime...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!anime) return null;

  return (
    <div>
      <h1>{anime.title.default}</h1>
      {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title.default} />}
      <p>Score: {anime.score}</p>
      <p>{anime.synopsis}</p>
      <button onClick={() => refetch()}>🎲 Otro anime</button>
    </div>
  );
}
```

### Con hook personalizado

```tsx
import { useRandomAnime } from "~/app/_components/random-anime";

function App() {
  const { anime, isLoading, error, getNewAnime } = useRandomAnime();
  
  return (
    <div>
      <h1>{anime?.title.default}</h1>
      <button onClick={getNewAnime}>Otro anime</button>
    </div>
  );
}
```

### Componente completo listo para usar

```tsx
import { RandomAnime } from "~/app/_components/random-anime";

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Anime Random</h1>
      <RandomAnime />
    </div>
  );
}
```

---

## 🧪 (e) Pruebas Rápidas

### Test con Mock de Fetch
Ver: `src/__tests__/jikan.test.ts`

**Tests incluidos:**
1. ✅ `getRandomAnime - success`: Respuesta exitosa
2. ✅ `getRandomAnime - retry on 500`: Retry automático en error 500
3. ✅ `getRandomAnime - fail after max retries`: Falla después de 2 reintentos
4. ✅ `getRandomAnime - timeout`: Manejo de timeout

**Ejecutar tests:**
```bash
# Si usas Jest
npm test src/__tests__/jikan.test.ts

# Si usas Vitest
npx vitest run src/__tests__/jikan.test.ts
```

### Prueba Manual en Navegador

1. Inicia el servidor:
```bash
npm run dev
```

2. Crea una página de prueba en `src/app/test-random/page.tsx`:
```tsx
import { RandomAnime } from "~/app/_components/random-anime";

export default function TestPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Test: Anime Random</h1>
      <RandomAnime />
    </main>
  );
}
```

3. Visita: `http://localhost:3000/test-random`

---

## 🔧 Características Técnicas

### Cliente HTTP (`src/lib/jikan.ts`)
- ✅ **Timeout**: 10 segundos por defecto
- ✅ **Retry Exponencial**: 2 reintentos con backoff (1s, 2s)
- ✅ **Retry en**: 429 (rate limit), 5xx (server errors)
- ✅ **Manejo de errores**: `JikanError` personalizado
- ✅ **AbortController**: Para cancelar requests en timeout

### Router tRPC (`src/server/api/routers/anime.ts`)
- ✅ **Procedimiento**: `publicProcedure.query`
- ✅ **Sin autenticación** (público)
- ✅ **Mapeo de errores**: JikanError → TRPCError
  - Timeout → `TIMEOUT`
  - 429 → `TOO_MANY_REQUESTS`
  - 5xx → `INTERNAL_SERVER_ERROR`
  - Otros → `BAD_REQUEST`

### Sin Persistencia
- ❌ No usa Prisma (no es necesario en Fase 1)
- ❌ No guarda historial
- ✅ Solo passthrough de Jikan → tRPC → Cliente

---

## 📊 Formato de Respuesta

### Ejemplo de `AnimeBase` retornado:

```json
{
  "id": 1,
  "title": {
    "romaji": "Cowboy Bebop",
    "english": "Cowboy Bebop",
    "native": "カウボーイビバップ",
    "default": "Cowboy Bebop"
  },
  "imageUrl": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
  "url": "https://myanimelist.net/anime/1/Cowboy_Bebop",
  "synopsis": "In the year 2071, humanity has colonized several...",
  "rating": "R - 17+ (violence & profanity)",
  "score": 8.76,
  "episodes": 26,
  "year": 1998
}
```

---

## ✅ Checklist de Entregables

- [x] Diseño de carpeta y estructura
- [x] Implementación tRPC `anime.random.getOne()`
- [x] Adaptador HTTP con retry (`src/lib/jikan.ts`)
- [x] Tipos y DTOs (`AnimeBase`, mapper)
- [x] Test rápido con mock de fetch
- [x] Snippet de consumo en frontend (componente + hook)
- [x] Sin errores de linter
- [x] Sin persistencia (solo passthrough)

---

## 🎉 Estado: COMPLETO

**Fase 1 implementada y lista para usar.**

No se avanzó a Fase 2. Esperando comando **CONTINUA** para proceder con:
- **Fase 2**: Recomendación según estado de ánimo (AniList)

