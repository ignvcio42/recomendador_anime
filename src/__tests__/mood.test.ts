/**
 * Tests para Fase 2: Mood-based Recommendations
 * 
 * Para ejecutar estos tests, instala Jest o Vitest:
 * npm install -D jest @types/jest ts-jest
 * npm install -D vitest
 */

import {
  getAvailableMoods,
  isValidMood,
  getMoodConfig,
  mapAniListToMoodResult,
  type AniListMedia,
} from "~/types/anime";

/**
 * TESTS UNITARIOS
 * 
 * Descomentar cuando instales Jest/Vitest:
 * 
 * describe("Mood Utilities", () => {
 *   test("getAvailableMoods devuelve lista de moods", () => {
 *     const moods = getAvailableMoods();
 *     expect(moods).toContain("relajado");
 *     expect(moods).toContain("feliz");
 *     expect(moods).toContain("intenso");
 *     expect(moods).toContain("epico");
 *     expect(moods.length).toBeGreaterThan(0);
 *   });
 * 
 *   test("isValidMood valida correctamente", () => {
 *     expect(isValidMood("relajado")).toBe(true);
 *     expect(isValidMood("RELAJADO")).toBe(true);
 *     expect(isValidMood("Relajado")).toBe(true);
 *     expect(isValidMood("invalido")).toBe(false);
 *     expect(isValidMood("")).toBe(false);
 *   });
 * 
 *   test("getMoodConfig devuelve config correcta", () => {
 *     const config = getMoodConfig("relajado");
 *     expect(config).toBeDefined();
 *     expect(config?.genres).toContain("Slice of Life");
 *     expect(config?.tags).toContain("Iyashikei");
 *   });
 * 
 *   test("getMoodConfig devuelve null para mood inválido", () => {
 *     const config = getMoodConfig("invalido");
 *     expect(config).toBeNull();
 *   });
 * });
 * 
 * describe("AniList Mapper", () => {
 *   test("mapAniListToMoodResult mapea correctamente", () => {
 *     const mockMedia: AniListMedia = {
 *       id: 1,
 *       title: {
 *         romaji: "Non Non Biyori",
 *         english: "Non Non Biyori",
 *         native: "のんのんびより",
 *       },
 *       coverImage: {
 *         large: "https://example.com/image.jpg",
 *         medium: null,
 *       },
 *       siteUrl: "https://anilist.co/anime/1",
 *       description: "A slice of life anime...",
 *       averageScore: 82,
 *       episodes: 12,
 *       seasonYear: 2013,
 *       genres: ["Slice of Life", "Comedy"],
 *       tags: [
 *         { name: "Iyashikei", rank: 90 },
 *         { name: "Countryside", rank: 85 },
 *       ],
 *     };
 * 
 *     const result = mapAniListToMoodResult(
 *       mockMedia,
 *       ["Slice of Life"],
 *       ["Iyashikei"],
 *     );
 * 
 *     expect(result.id).toBe(1);
 *     expect(result.title.default).toBe("Non Non Biyori");
 *     expect(result.title.romaji).toBe("Non Non Biyori");
 *     expect(result.title.native).toBe("のんのんびより");
 *     expect(result.imageUrl).toBe("https://example.com/image.jpg");
 *     expect(result.score).toBe(82);
 *     expect(result.episodes).toBe(12);
 *     expect(result.year).toBe(2013);
 *     expect(result.reason.matchedGenres).toContain("Slice of Life");
 *     expect(result.reason.matchedTags).toContain("Iyashikei");
 *   });
 * 
 *   test("mapAniListToMoodResult maneja datos faltantes", () => {
 *     const mockMedia: AniListMedia = {
 *       id: 2,
 *       title: {
 *         romaji: null,
 *         english: null,
 *         native: null,
 *       },
 *       coverImage: {
 *         large: null,
 *         medium: null,
 *       },
 *       siteUrl: "https://anilist.co/anime/2",
 *       description: null,
 *       averageScore: null,
 *       episodes: null,
 *       seasonYear: null,
 *       genres: [],
 *       tags: [],
 *     };
 * 
 *     const result = mapAniListToMoodResult(mockMedia, [], []);
 * 
 *     expect(result.id).toBe(2);
 *     expect(result.title.default).toBe("Anime #2");
 *     expect(result.imageUrl).toBeUndefined();
 *     expect(result.score).toBeUndefined();
 *     expect(result.reason.matchedGenres).toBeUndefined();
 *     expect(result.reason.matchedTags).toBeUndefined();
 *   });
 * });
 */

/**
 * Test manual ejecutable
 */
export function testMoodUtilities() {
  console.log("🧪 Test Manual - Mood Utilities");

  // Test 1: getAvailableMoods
  const moods = getAvailableMoods();
  console.log("✅ Moods disponibles:", moods);
  console.assert(moods.includes("relajado"), "Debe incluir 'relajado'");
  console.assert(moods.includes("feliz"), "Debe incluir 'feliz'");

  // Test 2: isValidMood
  console.log("\n✅ Validación de moods:");
  console.log("  - 'relajado':", isValidMood("relajado"));
  console.log("  - 'RELAJADO':", isValidMood("RELAJADO"));
  console.log("  - 'invalido':", isValidMood("invalido"));
  console.assert(isValidMood("relajado") === true);
  console.assert(isValidMood("invalido") === false);

  // Test 3: getMoodConfig
  console.log("\n✅ Configuración de mood 'relajado':");
  const config = getMoodConfig("relajado");
  console.log("  Genres:", config?.genres);
  console.log("  Tags:", config?.tags);
  console.assert(config !== null);
  console.assert(config?.genres?.includes("Slice of Life"));

  // Test 4: mapAniListToMoodResult
  console.log("\n✅ Mapper de AniList:");
  const mockMedia: AniListMedia = {
    id: 1,
    title: {
      romaji: "Test Anime",
      english: "Test Anime EN",
      native: "テストアニメ",
    },
    coverImage: {
      large: "https://example.com/image.jpg",
      medium: null,
    },
    siteUrl: "https://anilist.co/anime/1",
    description: "Test description",
    averageScore: 85,
    episodes: 12,
    seasonYear: 2024,
    genres: ["Slice of Life", "Comedy"],
    tags: [{ name: "Iyashikei", rank: 90 }],
  };

  const result = mapAniListToMoodResult(mockMedia, ["Slice of Life"], ["Iyashikei"]);
  console.log("  Result ID:", result.id);
  console.log("  Result Title:", result.title.default);
  console.log("  Matched Genres:", result.reason.matchedGenres);
  console.log("  Matched Tags:", result.reason.matchedTags);
  console.assert(result.id === 1);
  console.assert(result.reason.matchedGenres?.includes("Slice of Life"));

  console.log("\n🏁 Tests manuales completados!");
}

/**
 * Test de integración con AniList API (requiere conexión)
 */
export async function testAniListIntegration() {
  console.log("🧪 Test de Integración - AniList API");
  console.log("⚠️  Esto hace una llamada HTTP real a AniList");

  try {
    const { searchAnimeByMood } = await import("~/lib/anilist");

    console.log("📡 Buscando animes con mood 'relajado'...");
    const response = await searchAnimeByMood({
      genres: ["Slice of Life"],
      tags: ["Iyashikei"],
      page: 1,
      perPage: 5,
    });

    console.log("✅ Respuesta recibida!");
    console.log(`📺 Animes encontrados: ${response.Page.media.length}`);

    response.Page.media.forEach((anime, index) => {
      console.log(`\n${index + 1}. ${anime.title.english ?? anime.title.romaji}`);
      console.log(`   Score: ${anime.averageScore ?? "N/A"}`);
      console.log(`   Genres: ${anime.genres.join(", ")}`);
    });

    return response;
  } catch (error) {
    console.error("❌ Test de integración falló:", error);
    throw error;
  }
}

// Para ejecutar tests manuales:
// import { testMoodUtilities, testAniListIntegration } from "~/tests/mood.test";
// testMoodUtilities();
// await testAniListIntegration();

