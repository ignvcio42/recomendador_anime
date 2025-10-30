/**
 * Template de tests para el cliente Jikan
 * 
 * NOTA: Este archivo es un ejemplo/template de tests.
 * Para ejecutar tests reales, instala Jest o Vitest:
 * 
 * npm install -D jest @types/jest ts-jest
 * npm install -D vitest
 * 
 * Luego descomenta los tests a continuación y ejecuta:
 * npm test src/__tests__/jikan.test.ts
 */

import { getRandomAnime } from "~/lib/jikan";
import type { JikanRandomAnimeResponse } from "~/types/anime";

/**
 * TESTS CON JEST/VITEST
 * 
 * Descomenta este bloque cuando instales Jest o Vitest:
 * 
 * describe("Jikan Client", () => {
 *   test("getRandomAnime - success", async () => {
 *     const mockData: JikanRandomAnimeResponse = {
 *       data: {
 *         mal_id: 1,
 *         url: "https://myanimelist.net/anime/1",
 *         images: { jpg: { image_url: "https://example.com/img.jpg" } },
 *         title: "Cowboy Bebop",
 *         title_english: "Cowboy Bebop",
 *         title_japanese: "カウボーイビバップ",
 *         synopsis: "In the year 2071...",
 *         rating: "R - 17+",
 *         score: 8.76,
 *         episodes: 26,
 *         year: 1998,
 *       },
 *     };
 * 
 *     global.fetch = jest.fn(() =>
 *       Promise.resolve({
 *         ok: true,
 *         status: 200,
 *         json: async () => mockData,
 *       } as Response),
 *     ) as any;
 * 
 *     const result = await getRandomAnime();
 *     expect(result).toEqual(mockData);
 *     expect(global.fetch).toHaveBeenCalledTimes(1);
 *   });
 * 
 *   test("getRandomAnime - retry on 500", async () => {
 *     let callCount = 0;
 *     global.fetch = jest.fn(() => {
 *       callCount++;
 *       if (callCount < 2) {
 *         return Promise.resolve({
 *           ok: false,
 *           status: 500,
 *           statusText: "Internal Server Error",
 *         } as Response);
 *       }
 *       return Promise.resolve({
 *         ok: true,
 *         status: 200,
 *         json: async () => ({ data: { mal_id: 1, title: "Test", images: {} } }),
 *       } as Response);
 *     }) as any;
 * 
 *     const result = await getRandomAnime();
 *     expect(result.data.mal_id).toBe(1);
 *     expect(global.fetch).toHaveBeenCalledTimes(2);
 *   });
 * 
 *   test("getRandomAnime - fail after max retries", async () => {
 *     global.fetch = jest.fn(() =>
 *       Promise.resolve({
 *         ok: false,
 *         status: 503,
 *         statusText: "Service Unavailable",
 *       } as Response),
 *     ) as any;
 * 
 *     await expect(getRandomAnime()).rejects.toThrow();
 *     expect(global.fetch).toHaveBeenCalledTimes(3); // 1 + 2 retries
 *   });
 * });
 */

/**
 * Test manual ejecutable - Llama a la API real de Jikan
 * ADVERTENCIA: Esto hace una llamada HTTP real
 */
export async function testRealAPI() {
  console.log("🧪 Test Manual - Jikan Client (API Real)");
  console.log("⚠️  Esto hace una llamada HTTP real a Jikan API");

  try {
    console.log("📡 Llamando a Jikan API...");
    const result = await getRandomAnime();
    console.log("✅ Test exitoso!");
    console.log(`📺 Anime: ${result.data.title}`);
    console.log(`⭐ Score: ${result.data.score ?? "N/A"}`);
    console.log(`🔗 URL: ${result.data.url}`);
    return result;
  } catch (error) {
    console.error("❌ Test falló:", error);
    throw error;
  }
}

/**
 * Ejemplo de mock manual simple (sin framework de testing)
 */
export function exampleMockTest() {
  console.log("📝 Ejemplo de estructura de mock:");
  
  const mockResponse: JikanRandomAnimeResponse = {
    data: {
      mal_id: 1,
      url: "https://myanimelist.net/anime/1/Cowboy_Bebop",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
        },
      },
      title: "Cowboy Bebop",
      title_english: "Cowboy Bebop",
      title_japanese: "カウボーイビバップ",
      synopsis: "In the year 2071, humanity has colonized several of the planets...",
      rating: "R - 17+ (violence & profanity)",
      score: 8.76,
      episodes: 26,
      year: 1998,
    },
  };

  console.log("Mock data:", mockResponse.data.title);
  return mockResponse;
}

// Exportar para uso en otros archivos
export { getRandomAnime };
