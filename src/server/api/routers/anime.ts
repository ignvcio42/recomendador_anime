import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getRandomAnime, JikanError } from "~/lib/jikan";
import { 
  searchAnimeByMood, 
  getAnimeById, 
  searchAnimeByTitle,
  autocompleteAnime,
  AniListError,
  type AniListMedia,
} from "~/lib/anilist";
import { askGemini, GeminiError, isValidMessage, type ChatMessage } from "~/lib/gemini";
import {
  mapJikanToAnimeBase,
  mapAniListToMoodResult,
  getMoodConfig,
  getAvailableMoods,
  calculateSimilarityScore,
  mapAniListToSimilarityResult,
  type AnimeBase,
  type MoodResult,
  type SimilarityResult,
} from "~/types/anime";

export const animeRouter = createTRPCRouter({
  random: createTRPCRouter({
    /**
     * Obtiene un anime aleatorio desde Jikan API
     * @returns AnimeBase - anime normalizado
     */
    getOne: publicProcedure.query(async (): Promise<AnimeBase> => {
      try {
        const response = await getRandomAnime();
        const animeBase = await mapJikanToAnimeBase(response.data);
        return animeBase;
      } catch (error) {
        if (error instanceof JikanError) {
          // Mapear errores de Jikan a errores tRPC apropiados
          if (error.isTimeout) {
            throw new TRPCError({
              code: "TIMEOUT",
              message: "Jikan API timeout - please try again",
              cause: error,
            });
          }

          if (error.statusCode === 429) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Rate limit exceeded - please wait a moment",
              cause: error,
            });
          }

          if (error.statusCode && error.statusCode >= 500) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Jikan API is experiencing issues",
              cause: error,
            });
          }

          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error,
          });
        }

        // Error desconocido
        console.error("[anime.random.getOne] Unexpected error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch random anime",
          cause: error,
        });
      }
    }),
  }),

  mood: createTRPCRouter({
    /**
     * Obtiene lista de animes basados en estado de ánimo
     * @param mood - Estado de ánimo (relajado, feliz, intenso, epico, etc.)
     * @param limit - Número máximo de resultados (default: 10, max: 50)
     * @returns MoodResult[] - lista de animes con razón del match
     */
    getList: publicProcedure
      .input(
        z.object({
          mood: z.string().min(1, "El mood no puede estar vacío"),
          limit: z.number().min(1).max(50).optional().default(10),
          page: z.number().min(1).max(10).optional().default(1), // Página para paginación
          _key: z.number().optional(), // Key interno para forzar refetch, no se usa en la lógica
        }),
      )
      .query(async ({ input }): Promise<MoodResult[]> => {
        try {
          // Validar y obtener configuración del mood
          const moodConfig = getMoodConfig(input.mood);

          if (!moodConfig) {
            const availableMoods = getAvailableMoods();
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Mood "${input.mood}" no es válido. Moods disponibles: ${availableMoods.join(", ")}`,
            });
          }

          // Preparar variables para la query GraphQL
          const variables = {
            genres: moodConfig.genres,
            tags: moodConfig.tags,
            page: input.page ?? 1, // Usar página del input o 1 por defecto
            perPage: input.limit,
          };

          // Llamar a AniList API
          const response = await searchAnimeByMood(variables);

          // Mapear resultados a MoodResult (traduciendo sinopsis en paralelo)
          const results = await Promise.all(
            response.Page.media.map((media) =>
              mapAniListToMoodResult(
                media,
                moodConfig.genres ?? [],
                moodConfig.tags ?? [],
              ),
            ),
          );

          return results;
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }

          if (error instanceof AniListError) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al consultar AniList API",
              cause: error,
            });
          }

          // Error desconocido
          console.error("[anime.mood.getList] Unexpected error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch mood recommendations",
            cause: error,
          });
        }
      }),

    /**
     * Obtiene la lista de moods disponibles
     */
    getAvailableMoods: publicProcedure.query(() => {
      return getAvailableMoods();
    }),
  }),

  byThree: createTRPCRouter({
    /**
     * Busca animes por título para autocompletado
     * @param search - Texto de búsqueda
     * @param limit - Cantidad de resultados (default: 10)
     * @returns Array de { id, title } para autocompletado
     */
    search: publicProcedure
      .input(
        z.object({
          search: z.string().min(1, "Escribe al menos 1 carácter"),
          limit: z.number().min(1).max(20).optional().default(10),
        }),
      )
      .query(async ({ input }): Promise<Array<{ id: number; title: string }>> => {
        try {
          const response = await autocompleteAnime(input.search, input.limit);
          
          // Retornar array de { id, title } para autocompletado
          return response.Page.media.map((anime) => ({
            id: anime.id,
            title: anime.title.english ?? anime.title.romaji ?? anime.title.native ?? `Anime #${anime.id}`,
          }));
        } catch (error) {
          if (error instanceof AniListError) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al buscar anime",
              cause: error,
            });
          }
          
          // Si no se encuentra, retornar array vacío en lugar de error
          return [];
        }
      }),

    /**
     * Recomienda animes basado en animes vistos (mínimo 2, máximo 10)
     * @param titles - Array de títulos (opcional)
     * @param ids - Array de IDs (opcional)
     * @param limit - Cantidad de resultados (default: 15)
     * @returns SimilarityResult[] - animes ordenados por similitud
     */
    recommend: publicProcedure
      .input(
        z.object({
          titles: z.array(z.string()).min(2).max(10).optional(),
          ids: z.array(z.number()).min(2).max(10).optional(),
          limit: z.number().min(1).max(50).optional().default(15),
        }).refine(
          (data) => {
            const hasTitles = (data.titles?.length ?? 0) >= 2;
            const hasIds = (data.ids?.length ?? 0) >= 2;
            return hasTitles || hasIds;
          },
          { message: "Debes proporcionar al menos 2 animes (máximo 10)" }
        ),
      )
      .query(async ({ input }): Promise<SimilarityResult[]> => {
        try {
          // Paso 1: Resolver los animes de referencia (mínimo 2)
          const referenceAnimes: Array<AniListMedia & {
            recommendations?: {
              nodes: Array<{
                mediaRecommendation: AniListMedia | null;
              }>;
            };
          }> = [];

          if (input.ids) {
            // Búsqueda por IDs
            for (const id of input.ids) {
              try {
                const response = await getAnimeById(id);
                referenceAnimes.push(response.Media);
              } catch (error) {
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: `No se encontró anime con ID ${id}`,
                  cause: error,
                });
              }
            }
          } else if (input.titles) {
            // Búsqueda por títulos
            for (const title of input.titles) {
              try {
                const response = await searchAnimeByTitle(title);
                referenceAnimes.push(response.Media);
              } catch (error) {
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: `No se encontró anime con título "${title}"`,
                  cause: error,
                });
              }
            }
          }

          // Paso 2: Recolectar candidatos de recomendaciones nativas
          const candidatesMap = new Map<number, { media: AniListMedia; isNative: boolean }>();

          referenceAnimes.forEach((anime) => {
            // Agregar recomendaciones nativas si existen
            if (anime.recommendations?.nodes) {
              anime.recommendations.nodes.forEach((rec: { mediaRecommendation: AniListMedia | null }) => {
                if (rec.mediaRecommendation && !referenceAnimes.find((r) => r.id === rec.mediaRecommendation!.id)) {
                  candidatesMap.set(rec.mediaRecommendation.id, {
                    media: rec.mediaRecommendation,
                    isNative: true,
                  });
                }
              });
            }
          });

          // Paso 3: Calcular scores para cada candidato (traduciendo sinopsis en paralelo)
          const scoredCandidates = await Promise.all(
            Array.from(candidatesMap.values()).map(async ({ media, isNative }) => {
              const { score, genreOverlap, tagOverlap } = calculateSimilarityScore(
                referenceAnimes,
                media,
                isNative,
              );

              return mapAniListToSimilarityResult(
                media,
                score,
                genreOverlap,
                tagOverlap,
                isNative,
              );
            }),
          );

          // Paso 4: Ordenar por score descendente y limitar resultados
          const results = scoredCandidates
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, input.limit);

          // Si no hay suficientes resultados, lanzar advertencia
          if (results.length === 0) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "No se encontraron recomendaciones para estos animes. Intenta con otros títulos.",
            });
          }

          return results;
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }

          if (error instanceof AniListError) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al consultar AniList API",
              cause: error,
            });
          }

          console.error("[anime.byThree.recommend] Unexpected error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate recommendations",
            cause: error,
          });
        }
      }),
  }),

  // ============================================================================
  // FASE 4: AI Recommendations (Gemini)
  // ============================================================================

  ai: createTRPCRouter({
    /**
     * Chat con IA especializada en anime usando Gemini
     * @param message - Mensaje del usuario
     * @param history - Historial de conversación (opcional)
     * @returns Respuesta de la IA
     */
    chat: publicProcedure
      .input(
        z.object({
          message: z.string().min(1).max(1000),
          history: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ).optional(),
        }),
      )
      .mutation(async ({ input }): Promise<{ response: string }> => {
        try {
          // Validar mensaje
          if (!isValidMessage(input.message)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "El mensaje debe tener entre 1 y 1000 caracteres",
            });
          }

          // Llamar a Gemini
          const response = await askGemini(
            input.message,
            input.history as ChatMessage[] ?? [],
          );

          return { response };
        } catch (error) {
          if (error instanceof GeminiError) {
            // Errores específicos de Gemini
            if (error.statusCode === 408) {
              throw new TRPCError({
                code: "TIMEOUT",
                message: error.message,
              });
            }
            
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
              cause: error,
            });
          }

          if (error instanceof TRPCError) {
            throw error;
          }

          console.error("[anime.ai.chat] Unexpected error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al comunicarse con la IA",
            cause: error,
          });
        }
      }),
  }),
});

