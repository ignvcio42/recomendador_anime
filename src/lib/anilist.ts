import { GraphQLClient } from "graphql-request";
import type { AniListMedia } from "~/types/anime";

// Re-export for convenience
export type { AniListMedia };

const ANILIST_API_URL = "https://graphql.anilist.co";
const DEFAULT_TIMEOUT = 10000;

/**
 * Cliente GraphQL para AniList API
 */
export const anilistClient = new GraphQLClient(ANILIST_API_URL, {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Error personalizado para AniList API
 */
export class AniListError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "AniListError";
  }
}

/**
 * Tipos de respuesta de AniList GraphQL
 */
export type AniListMediaResponse = {
  Page: {
    media: Array<{
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
    }>;
  };
};

/**
 * Query GraphQL para buscar animes por mood
 */
export const SEARCH_ANIME_BY_MOOD_QUERY = `
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
`;

/**
 * Variables para la query GraphQL
 */
export type SearchAnimeByMoodVariables = {
  genres?: string[];
  tags?: string[];
  page?: number;
  perPage?: number;
};

/**
 * Wrapper con timeout para promises
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs),
    ),
  ]);
}

/**
 * Ejecuta una query GraphQL a AniList con manejo de errores y timeout
 */
export async function queryAniList<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    const requestPromise = anilistClient.request<T>(query, variables);
    const data = await withTimeout(requestPromise, DEFAULT_TIMEOUT);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Request timeout") {
        throw new AniListError("Request timeout after 10 seconds", 408);
      }
      throw new AniListError(
        `AniList API error: ${error.message}`,
        500,
      );
    }
    throw new AniListError("Unknown AniList API error", 500);
  }
}

/**
 * Busca animes por mood usando géneros y tags
 */
export async function searchAnimeByMood(
  variables: SearchAnimeByMoodVariables,
): Promise<AniListMediaResponse> {
  return queryAniList<AniListMediaResponse>(
    SEARCH_ANIME_BY_MOOD_QUERY,
    variables,
  );
}

// ============================================================================
// FASE 3: Similar Recommendations (by 3 animes)
// ============================================================================

/**
 * Query para buscar anime por ID
 */
export const GET_ANIME_BY_ID_QUERY = `
  query GetAnimeById($id: Int!) {
    Media(id: $id, type: ANIME) {
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
      recommendations(sort: RATING_DESC, perPage: 10) {
        nodes {
          mediaRecommendation {
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
    }
  }
`;

/**
 * Query para buscar anime por título
 */
export const SEARCH_ANIME_BY_TITLE_QUERY = `
  query SearchAnimeByTitle($search: String!) {
    Media(search: $search, type: ANIME) {
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
      recommendations(sort: RATING_DESC, perPage: 10) {
        nodes {
          mediaRecommendation {
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
    }
  }
`;

/**
 * Tipo de respuesta para búsqueda por ID
 */
export type AniListMediaByIdResponse = {
  Media: AniListMedia & {
    recommendations?: {
      nodes: Array<{
        mediaRecommendation: AniListMedia | null;
      }>;
    };
  };
};

/**
 * Tipo de respuesta para búsqueda por título
 */
export type AniListMediaByTitleResponse = {
  Media: AniListMedia & {
    recommendations?: {
      nodes: Array<{
        mediaRecommendation: AniListMedia | null;
      }>;
    };
  };
};

/**
 * Busca un anime por ID
 */
export async function getAnimeById(
  id: number,
): Promise<AniListMediaByIdResponse> {
  return queryAniList<AniListMediaByIdResponse>(GET_ANIME_BY_ID_QUERY, { id });
}

/**
 * Busca un anime por título
 */
export async function searchAnimeByTitle(
  search: string,
): Promise<AniListMediaByTitleResponse> {
  return queryAniList<AniListMediaByTitleResponse>(
    SEARCH_ANIME_BY_TITLE_QUERY,
    { search },
  );
}

/**
 * Query para autocompletado (múltiples resultados)
 */
export const AUTOCOMPLETE_ANIME_QUERY = `
  query AutocompleteAnime($search: String!, $perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(search: $search, type: ANIME, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
          native
        }
      }
    }
  }
`;

/**
 * Tipo de respuesta para autocompletado
 */
export type AniListAutocompleteResponse = {
  Page: {
    media: Array<{
      id: number;
      title: {
        romaji: string | null;
        english: string | null;
        native: string | null;
      };
    }>;
  };
};

/**
 * Busca animes para autocompletado (múltiples resultados)
 */
export async function autocompleteAnime(
  search: string,
  perPage = 10,
): Promise<AniListAutocompleteResponse> {
  return queryAniList<AniListAutocompleteResponse>(AUTOCOMPLETE_ANIME_QUERY, {
    search,
    perPage,
  });
}

