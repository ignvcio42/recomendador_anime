/**
 * Base DTO para anime - formato normalizado usado en toda la app
 */
export type AnimeBase = {
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
};

/**
 * Respuesta cruda de Jikan API v4 - /random/anime
 */
export type JikanRandomAnimeResponse = {
  data: {
    mal_id: number;
    url: string;
    images: {
      jpg?: {
        image_url?: string;
        small_image_url?: string;
        large_image_url?: string;
      };
      webp?: {
        image_url?: string;
        small_image_url?: string;
        large_image_url?: string;
      };
    };
    title: string;
    title_english?: string | null;
    title_japanese?: string | null;
    synopsis?: string | null;
    rating?: string | null;
    score?: number | null;
    episodes?: number | null;
    year?: number | null;
    aired?: {
      from?: string | null;
      to?: string | null;
    };
  };
};

/**
 * Mapea la respuesta de Jikan a nuestro DTO normalizado AnimeBase
 */
export async function mapJikanToAnimeBase(
  jikanData: JikanRandomAnimeResponse["data"],
): Promise<AnimeBase> {
  const { translateToSpanish } = await import("~/lib/translator");
  
  // Traducir sinopsis a español
  const translatedSynopsis = await translateToSpanish(jikanData.synopsis);
  
  return {
    id: jikanData.mal_id,
    title: {
      romaji: jikanData.title, // Jikan no tiene romaji explícito, usamos title principal
      english: jikanData.title_english ?? undefined,
      native: jikanData.title_japanese ?? undefined,
      default: jikanData.title_english ?? jikanData.title,
    },
    imageUrl:
      jikanData.images.jpg?.image_url ??
      jikanData.images.webp?.image_url ??
      undefined,
    url: jikanData.url,
    synopsis: translatedSynopsis ?? undefined,
    rating: jikanData.rating ?? undefined,
    score: jikanData.score ?? undefined,
    episodes: jikanData.episodes ?? undefined,
    year: jikanData.year ?? undefined,
  };
}

// ============================================================================
// FASE 2: Mood-based Recommendations (AniList)
// ============================================================================

/**
 * Resultado de recomendación por mood - extiende AnimeBase con razón del match
 */
export type MoodResult = AnimeBase & {
  reason: {
    matchedGenres?: string[];
    matchedTags?: string[];
  };
};

/**
 * Configuración de mood - mapea estados de ánimo a géneros y tags de AniList
 */
export type MoodConfig = {
  genres?: string[];
  tags?: string[];
};

/**
 * Diccionario de moods soportados
 * Extensible: puedes agregar más moods aquí
 */
export const MOODS: Record<string, MoodConfig> = {
  relajado: {
    genres: ["Slice of Life"],
    tags: ["Iyashikei"],
  },
  feliz: {
    genres: ["Comedy", "Slice of Life"],
    tags: ["Cute Girls Doing Cute Things", "School"],
  },
  intenso: {
    genres: ["Thriller", "Psychological"],
    tags: ["Psychological", "Mind Games"],
  },
  epico: {
    genres: ["Action", "Adventure"],
    tags: ["Shounen", "Super Power"],
  },
  triste: {
    genres: ["Drama"],
    tags: ["Tragedy", "Emotional"],
  },
  romantico: {
    genres: ["Romance"],
    tags: ["Love Triangle", "School"],
  },
  misterioso: {
    genres: ["Mystery"],
    tags: ["Detective", "Supernatural"],
  },
  fantastico: {
    genres: ["Fantasy"],
    tags: ["Magic", "Isekai"],
  },
};

/**
 * Obtiene la lista de moods disponibles
 */
export function getAvailableMoods(): string[] {
  return Object.keys(MOODS);
}

/**
 * Valida si un mood es soportado
 */
export function isValidMood(mood: string): boolean {
  return mood.toLowerCase() in MOODS;
}

/**
 * Obtiene la configuración de un mood
 */
export function getMoodConfig(mood: string): MoodConfig | null {
  const normalizedMood = mood.toLowerCase();
  return MOODS[normalizedMood] ?? null;
}

/**
 * Media de AniList - tipo de respuesta GraphQL
 */
export type AniListMedia = {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string | null;
    medium: string | null;
  };
  siteUrl: string;
  description: string | null;
  averageScore: number | null;
  episodes: number | null;
  seasonYear: number | null;
  genres: string[];
  tags: Array<{
    name: string;
    rank: number;
  }>;
};

/**
 * Mapea un anime de AniList a MoodResult
 */
export async function mapAniListToMoodResult(
  aniListMedia: AniListMedia,
  requestedGenres: string[],
  requestedTags: string[],
): Promise<MoodResult> {
  const { translateToSpanish } = await import("~/lib/translator");
  
  // Traducir sinopsis a español
  const translatedSynopsis = await translateToSpanish(aniListMedia.description);
  
  // Encontrar géneros que matchean
  const matchedGenres = aniListMedia.genres.filter((genre) =>
    requestedGenres.includes(genre),
  );

  // Encontrar tags que matchean
  const matchedTags = aniListMedia.tags
    .map((tag) => tag.name)
    .filter((tagName) => requestedTags.includes(tagName));

  return {
    id: aniListMedia.id,
    title: {
      romaji: aniListMedia.title.romaji ?? undefined,
      english: aniListMedia.title.english ?? undefined,
      native: aniListMedia.title.native ?? undefined,
      default:
        aniListMedia.title.english ??
        aniListMedia.title.romaji ??
        `Anime #${aniListMedia.id}`,
    },
    imageUrl: aniListMedia.coverImage.large ?? aniListMedia.coverImage.medium ?? undefined,
    url: aniListMedia.siteUrl,
    synopsis: translatedSynopsis ?? undefined,
    score: aniListMedia.averageScore ?? undefined,
    episodes: aniListMedia.episodes ?? undefined,
    year: aniListMedia.seasonYear ?? undefined,
    reason: {
      matchedGenres: matchedGenres.length > 0 ? matchedGenres : undefined,
      matchedTags: matchedTags.length > 0 ? matchedTags : undefined,
    },
  };
}

// ============================================================================
// FASE 3: Similar Recommendations (by 3 animes)
// ============================================================================

/**
 * Resultado de recomendación por similitud - extiende AnimeBase con score
 */
export type SimilarityResult = AnimeBase & {
  similarityScore: number; // 0-100, mayor = más similar
  matchDetails?: {
    genreOverlap: number;
    tagOverlap: number;
    isNativeRecommendation: boolean;
  };
};

/**
 * Calcula similitud de Jaccard entre dos conjuntos
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Calcula score de similitud entre animes de referencia y un candidato
 */
export function calculateSimilarityScore(
  referenceAnimes: AniListMedia[],
  candidate: AniListMedia,
  isNativeRecommendation: boolean,
): { score: number; genreOverlap: number; tagOverlap: number } {
  // Unir todos los géneros y tags de los 3 animes de referencia
  const allGenres = new Set<string>();
  const allTags = new Set<string>();

  referenceAnimes.forEach((anime) => {
    anime.genres.forEach((g) => allGenres.add(g));
    anime.tags.forEach((t) => allTags.add(t.name));
  });

  // Géneros y tags del candidato
  const candidateGenres = new Set(candidate.genres);
  const candidateTags = new Set(candidate.tags.map((t) => t.name));

  // Calcular Jaccard similarity
  const genreSimilarity = jaccardSimilarity(allGenres, candidateGenres);
  const tagSimilarity = jaccardSimilarity(allTags, candidateTags);

  // Score base: promedio ponderado (géneros 60%, tags 40%)
  let score = genreSimilarity * 60 + tagSimilarity * 40;

  // Boost si es recomendación nativa de AniList
  if (isNativeRecommendation) {
    score += 20; // +20 puntos
  }

  // Normalizar a 0-100
  return {
    score: Math.min(100, Math.round(score)),
    genreOverlap: Math.round(genreSimilarity * 100),
    tagOverlap: Math.round(tagSimilarity * 100),
  };
}

/**
 * Mapea AniListMedia a SimilarityResult
 */
export async function mapAniListToSimilarityResult(
  media: AniListMedia,
  similarityScore: number,
  genreOverlap: number,
  tagOverlap: number,
  isNativeRecommendation: boolean,
): Promise<SimilarityResult> {
  const { translateToSpanish } = await import("~/lib/translator");
  
  // Traducir sinopsis a español
  const translatedSynopsis = await translateToSpanish(media.description);
  
  return {
    id: media.id,
    title: {
      romaji: media.title.romaji ?? undefined,
      english: media.title.english ?? undefined,
      native: media.title.native ?? undefined,
      default:
        media.title.english ??
        media.title.romaji ??
        `Anime #${media.id}`,
    },
    imageUrl: media.coverImage.large ?? media.coverImage.medium ?? undefined,
    url: media.siteUrl,
    synopsis: translatedSynopsis ?? undefined,
    score: media.averageScore ?? undefined,
    episodes: media.episodes ?? undefined,
    year: media.seasonYear ?? undefined,
    similarityScore,
    matchDetails: {
      genreOverlap,
      tagOverlap,
      isNativeRecommendation,
    },
  };
}

