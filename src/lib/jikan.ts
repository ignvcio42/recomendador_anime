import type { JikanRandomAnimeResponse } from "~/types/anime";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const DEFAULT_TIMEOUT = 10000; // 10 segundos
const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 1000; // 1 segundo

/**
 * Error personalizado para fallos de Jikan API
 */
export class JikanError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isTimeout = false,
  ) {
    super(message);
    this.name = "JikanError";
  }
}

/**
 * Implementa retry exponencial con backoff
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch con timeout
 */
async function fetchWithTimeout(
  url: string,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new JikanError(`Request timeout after ${timeout}ms`, undefined, true);
    }
    throw error;
  }
}

/**
 * Fetch con retry exponencial
 */
async function fetchWithRetry<T>(
  url: string,
  timeout = DEFAULT_TIMEOUT,
  maxRetries = MAX_RETRIES,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, timeout);

      // Si es 429 (rate limit) o 5xx, reintentamos
      if (response.status === 429 || response.status >= 500) {
        throw new JikanError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      if (!response.ok) {
        throw new JikanError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      lastError = error as Error;

      // Si es el último intento, lanzamos el error
      if (attempt === maxRetries) {
        break;
      }

      // Calculamos el delay exponencial: 1s, 2s, 4s...
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
      console.warn(
        `[Jikan] Attempt ${attempt + 1}/${maxRetries + 1} failed. Retrying in ${delay}ms...`,
        error,
      );
      await sleep(delay);
    }
  }

  throw lastError ?? new JikanError("Unknown error during fetch");
}

/**
 * Cliente Jikan - obtiene un anime random
 */
export async function getRandomAnime(): Promise<JikanRandomAnimeResponse> {
  const url = `${JIKAN_BASE_URL}/random/anime`;
  return fetchWithRetry<JikanRandomAnimeResponse>(url);
}

