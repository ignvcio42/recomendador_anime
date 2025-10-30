# Fase 2 — Recomendación por Estado de Ánimo (AniList) ✅

## Objetivo
Implementar un endpoint que reciba un mood (string) y devuelva una lista de animes acordes usando AniList GraphQL API.

## Fuente
**AniList GraphQL API**: `https://graphql.anilist.co`

---

## 📁 Archivos Creados/Modificados

```
src/
├── types/
│   └── anime.ts                          # Agregado: MoodResult, MOODS, helpers
├── lib/
│   └── anilist.ts                        # NUEVO: Cliente GraphQL para AniList
├── server/
│   └── api/
│       └── routers/
│           └── anime.ts                  # Agregado: anime.mood.getList
├── app/
│   └── _components/
│       └── mood-recommendation.tsx       # ACTUALIZADO: UI funcional con Mantine
└── __tests__/
    └── mood.test.ts                      # NUEVO: Tests unitarios y de integración
```

---

## 🎯 Endpoints tRPC

### `anime.mood.getList(input: { mood, limit })`
- **Tipo**: Query
- **Input**: 
  - `mood`: string (requerido) - Estado de ánimo
  - `limit`: number (opcional, default: 10, max: 50) - Cantidad de resultados
- **Retorno**: `Promise<MoodResult[]>`
- **Descripción**: Obtiene lista de animes filtrados por mood usando AniList

**Ejemplo de uso:**
```typescript
const { data, isLoading } = api.anime.mood.getList.useQuery({
  mood: "relajado",
  limit: 12
});
```

### `anime.mood.getAvailableMoods()`
- **Tipo**: Query
- **Retorno**: `Promise<string[]>`
- **Descripción**: Retorna lista de moods disponibles

**Ejemplo de uso:**
```typescript
const { data: moods } = api.anime.mood.getAvailableMoods.useQuery();
// ["relajado", "feliz", "intenso", "epico", ...]
```

---

## 📦 Tipos y DTOs

### `MoodResult`
Extiende `AnimeBase` con información de match:

```typescript
type MoodResult = AnimeBase & {
  reason: {
    matchedGenres?: string[];  // Géneros que matchearon
    matchedTags?: string[];    // Tags que matchearon
  };
}
```

### Diccionario `MOODS`
Mapa extensible de moods a géneros/tags de AniList:

```typescript
const MOODS: Record<string, MoodConfig> = {
  relajado: {
    genres: ["Slice of Life"],
    tags: ["Iyashikei"],
  },
  feliz: {
    genres: ["Comedy"],
    tags: [],
  },
  intenso: {
    genres: ["Thriller"],
    tags: ["Psychological"],
  },
  epico: {
    genres: ["Action", "Adventure"],
    tags: [],
  },
  triste: {
    genres: ["Drama"],
    tags: ["Tragedy"],
  },
  romantico: {
    genres: ["Romance"],
    tags: [],
  },
  misterioso: {
    genres: ["Mystery"],
    tags: ["Detective"],
  },
  fantastico: {
    genres: ["Fantasy"],
    tags: ["Magic"],
  },
}
```

### Helpers Disponibles

```typescript
// Obtener lista de moods soportados
function getAvailableMoods(): string[]

// Validar si un mood existe
function isValidMood(mood: string): boolean

// Obtener configuración de un mood
function getMoodConfig(mood: string): MoodConfig | null

// Mapear AniList media a MoodResult
function mapAniListToMoodResult(
  aniListMedia: AniListMedia,
  requestedGenres: string[],
  requestedTags: string[]
): MoodResult
```

---

## 🔍 Query GraphQL

```graphql
query SearchAnimeByMood(
  $genres: [String]
  $tags: [String]
  $page: Int
  $perPage: Int
) {
  Page(page: $page, perPage: $perPage) {
    media(
      type: ANIME
      genre_in: $genres
      tag_in: $tags
      sort: [POPULARITY_DESC, SCORE_DESC]
      isAdult: false
    ) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      siteUrl
      description
      averageScore
      episodes
      seasonYear
      genres
      tags {
        name
        rank
      }
    }
  }
}
```

---

## 🚀 Ejemplo de Uso

### En Componente React (Mantine UI)

```tsx
"use client";

import { useState } from "react";
import { Select, Button, SimpleGrid, Card } from "@mantine/core";
import { api } from "~/trpc/react";

export function MyMoodComponent() {
  const [mood, setMood] = useState<string | null>(null);
  
  const { data: moods } = api.anime.mood.getAvailableMoods.useQuery();
  const { data: animes, isLoading } = api.anime.mood.getList.useQuery(
    { mood: mood!, limit: 12 },
    { enabled: !!mood }
  );

  return (
    <div>
      <Select
        data={moods?.map(m => ({ value: m, label: m }))}
        value={mood}
        onChange={setMood}
      />
      
      {isLoading && <p>Cargando...</p>}
      
      {animes && (
        <SimpleGrid cols={4}>
          {animes.map(anime => (
            <Card key={anime.id}>
              <h3>{anime.title.default}</h3>
              <p>Score: {anime.score}</p>
              <div>
                {anime.reason.matchedGenres?.map(g => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
}
```

### Uso Directo del Cliente GraphQL

```typescript
import { searchAnimeByMood } from "~/lib/anilist";

const response = await searchAnimeByMood({
  genres: ["Slice of Life"],
  tags: ["Iyashikei"],
  page: 1,
  perPage: 10
});

console.log(response.Page.media); // Array de animes
```

---

## 🧪 Tests

### Ubicación
`src/__tests__/mood.test.ts`

### Tests Incluidos

1. **getAvailableMoods** - Verifica que retorna lista correcta
2. **isValidMood** - Valida moods case-insensitive
3. **getMoodConfig** - Obtiene configuración correcta
4. **mapAniListToMoodResult** - Mapeo correcto de datos
5. **Test de integración** - Llamada real a AniList API

### Ejecutar Tests

```bash
# Manual (función exportada)
import { testMoodUtilities } from "~/tests/mood.test";
testMoodUtilities();

# Integración (API real)
import { testAniListIntegration } from "~/tests/mood.test";
await testAniListIntegration();
```

---

## 🔧 Características Técnicas

### Cliente GraphQL (`src/lib/anilist.ts`)
- ✅ **GraphQL Client**: graphql-request
- ✅ **Timeout**: 10 segundos con Promise.race
- ✅ **Error Handling**: AniListError personalizado
- ✅ **Type Safety**: Tipos TypeScript completos

### Router tRPC (`src/server/api/routers/anime.ts`)
- ✅ **Validación de Input**: Zod schema con mood y limit
- ✅ **Validación de Mood**: Verifica mood en diccionario MOODS
- ✅ **Error Claro**: Mensaje con moods disponibles si es inválido
- ✅ **Mapeo Automático**: AniList → MoodResult con reason

### Componente Mantine (`src/app/_components/mood-recommendation.tsx`)
- ✅ **Select con moods disponibles**
- ✅ **Grid responsivo** de resultados (1-4 columnas)
- ✅ **Badges** para géneros y tags matcheados
- ✅ **Loading y error states** manejados
- ✅ **Empty state** cuando no hay selección
- ✅ **Links a AniList** para cada anime

---

## 📊 Ejemplo de Respuesta

### Input
```typescript
{
  mood: "relajado",
  limit: 2
}
```

### Output
```json
[
  {
    "id": 17549,
    "title": {
      "romaji": "Non Non Biyori",
      "english": "Non Non Biyori",
      "native": "のんのんびより",
      "default": "Non Non Biyori"
    },
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx17549-4Qs4y7rYwl5y.jpg",
    "url": "https://anilist.co/anime/17549",
    "synopsis": "Asahigaoka might look like typical, boring countryside...",
    "score": 78,
    "episodes": 12,
    "year": 2013,
    "reason": {
      "matchedGenres": ["Slice of Life"],
      "matchedTags": ["Iyashikei"]
    }
  },
  {
    "id": 5081,
    "title": {
      "romaji": "Bakuman.",
      "english": "Bakuman.",
      "native": "バクマン。",
      "default": "Bakuman."
    },
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5081-WfUK1yvEivDa.jpg",
    "url": "https://anilist.co/anime/5081",
    "synopsis": "Moritaka Mashiro, a junior high student...",
    "score": 80,
    "episodes": 25,
    "year": 2010,
    "reason": {
      "matchedGenres": ["Slice of Life"]
    }
  }
]
```

---

## ✅ Requisitos Cumplidos

- ✅ Cliente GraphQL tipado (graphql-request)
- ✅ Diccionario MOODS extensible con 8 moods iniciales
- ✅ Sanitización de mood con lookup case-insensitive
- ✅ Error claro si mood no existe (lista moods disponibles)
- ✅ Paginación básica con limit (1-50)
- ✅ Schema tRPC con validación Zod
- ✅ Query GraphQL con filtros genre_in y tag_in
- ✅ Mapping a MoodResult con matchedGenres/Tags
- ✅ Tests unitarios y de integración
- ✅ Ejemplo frontend funcional con Mantine UI

---

## 🎨 UI en Mantine

### Componente `MoodRecommendation`

**Características:**
- Select dropdown con lista de moods
- Botón "Buscar Animes" con gradiente pink→violet
- Grid responsive (1-4 columnas según viewport)
- Cards con imagen, título, score, episodios, año
- Badges de géneros/tags matcheados
- Botón a AniList en cada card
- Loading state con spinner
- Error state con alert rojo
- Empty states para sin selección y sin resultados

---

## 🔄 Extensibilidad

### Agregar Nuevo Mood

```typescript
// En src/types/anime.ts
export const MOODS: Record<string, MoodConfig> = {
  // ... moods existentes
  
  nostalgico: {
    genres: ["Drama", "Slice of Life"],
    tags: ["Coming of Age"],
  },
  
  aventurero: {
    genres: ["Adventure", "Fantasy"],
    tags: ["Travel"],
  },
};
```

No requiere cambios en:
- Router tRPC (usa getAvailableMoods())
- Componente UI (carga moods dinámicamente)
- Cliente GraphQL (pasa géneros/tags)

---

## 📈 Build Status

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (4/4)

Route (app)              Size     First Load JS
┌ ○ /                   4.75 kB         182 kB
├ ○ /_not-found         876 B           88.4 kB
└ ƒ /api/trpc/[trpc]    0 B             0 B
```

**Sin errores de TypeScript ni ESLint** ✅

---

## 🎉 Estado: COMPLETADO

**Fase 2 implementada y lista para usar.**

### Integrado en Page Principal
- Tab "Por Ánimo" con badge "Activo"
- UI completa con Mantine
- Funcionalidad 100% operativa

### Próximas Fases
No se avanzó a Fase 3. Esperando comando **CONTINUA** para:
- **Fase 3**: Recomendación según 3 animes vistos (AniList)
- **Fase 4**: IA similar a X (Vector/LLM)

---

## 🚀 Demo Rápido

1. **Iniciar servidor**:
   ```bash
   npm run dev
   ```

2. **Abrir**: `http://localhost:3000`

3. **Ir al tab "Por Ánimo"**

4. **Seleccionar mood** (ej: "relajado")

5. **Click en "Buscar Animes"**

6. **Ver resultados** en grid con géneros matcheados

---

## 💡 Notas Técnicas

### Rate Limits
AniList no tiene rate limits estrictos documentados públicamente, pero se recomienda:
- Máximo 90 requests/min
- Usar caché para queries repetidas (implementar en Fase 4 con Prisma)

### Calidad de Matches
Los géneros y tags de AniList son curados manualmente, ofreciendo alta precisión. Los resultados se ordenan por:
1. **POPULARITY_DESC** - Popularidad descendente
2. **SCORE_DESC** - Score descendente

Esto asegura que los primeros resultados sean animes conocidos y bien valorados.

### Extensión de MOODS
El diccionario MOODS es un punto de entrada simple pero efectivo. Para casos de uso avanzados, considerar:
- Múltiples géneros por mood
- Weights/prioridades para géneros
- Combinaciones complejas (género A AND (tag B OR tag C))
- ML/embeddings para mapear texto libre a géneros (Fase 4)

