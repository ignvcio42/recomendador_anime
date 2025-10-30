/**
 * Servicio de traducción usando MyMemory Translation API
 * API gratuita, no requiere API key
 * Límite: ~10,000 caracteres por día (generoso para desarrollo)
 */

const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const TRANSLATION_TIMEOUT = 5000; // 5 segundos

/**
 * Caché simple en memoria para evitar traducir lo mismo dos veces
 */
const translationCache = new Map<string, string>();

/**
 * Error personalizado para traducciones
 */
export class TranslationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationError";
  }
}

/**
 * Respuesta de la API de MyMemory
 */
type MyMemoryResponse = {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseDetails?: string;
};

/**
 * Limpia HTML tags de un texto
 */
function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

/**
 * Trunca texto si es muy largo (para respetar límites de API)
 */
function truncateText(text: string, maxLength = 1000): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Traduce un texto de inglés a español usando MyMemory API
 * @param text - Texto a traducir
 * @returns Texto traducido al español
 */
export async function translateToSpanish(
  text: string | null | undefined,
): Promise<string | null> {
  // Si no hay texto, retornar null
  if (!text?.trim()) return null;

  // Limpiar HTML tags
  const cleanText = stripHtmlTags(text);
  if (!cleanText.trim()) return null;

  // Truncar si es muy largo
  const textToTranslate = truncateText(cleanText);

  // Verificar caché
  const cacheKey = textToTranslate.toLowerCase();
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Construir URL con parámetros
    const url = new URL(MYMEMORY_API_URL);
    url.searchParams.append("q", textToTranslate);
    url.searchParams.append("langpair", "en|es");

    // Hacer request con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_TIMEOUT);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new TranslationError(
        `Translation API returned status ${response.status}`,
      );
    }

    const data = (await response.json()) as MyMemoryResponse;

    // Verificar si la respuesta es válida
    if (data.responseStatus !== 200) {
      console.warn(
        `Translation warning: ${data.responseDetails ?? "Unknown error"}`,
      );
      // Si falla la traducción, retornar texto original
      return textToTranslate;
    }

    const translatedText = data.responseData.translatedText;

    // Guardar en caché
    translationCache.set(cacheKey, translatedText);

    // Limpiar caché si crece mucho (> 500 entradas)
    if (translationCache.size > 500) {
      const firstKey = translationCache.keys().next().value!;
      translationCache.delete(firstKey);
    }

    return translatedText;
  } catch (error) {
    // Si hay error (timeout, red, etc.), retornar texto original sin romper la app
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Translation timeout, returning original text");
      } else {
        console.warn(`Translation error: ${error.message}`);
      }
    }
    return textToTranslate;
  }
}

/**
 * Traduce múltiples textos en paralelo
 * Útil para traducir varios animes a la vez
 * @param texts - Array de textos a traducir
 * @returns Array de textos traducidos (mismo orden)
 */
export async function translateMultiple(
  texts: Array<string | null | undefined>,
): Promise<Array<string | null>> {
  return Promise.all(texts.map((text) => translateToSpanish(text)));
}

/**
 * Limpia la caché de traducciones (útil para testing)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

