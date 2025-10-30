/**
 * Servicio de IA con Gemini (Google)
 * API gratuita con límites generosos: 60 requests/min
 * Especializado en recomendaciones de anime
 */

import { env } from "~/env";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
const REQUEST_TIMEOUT = 30000; // 30 segundos

/**
 * Error personalizado para Gemini API
 */
export class GeminiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

/**
 * Tipo de mensaje en el chat
 */
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Respuesta de Gemini API
 */
type GeminiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
};

/**
 * Sistema de prompts para especializar a Gemini en anime
 */
const SYSTEM_PROMPT = `Eres un experto en anime japonés con conocimiento extenso sobre series, películas, géneros, estudios y directores.

TU ROL:
- Ayudar a usuarios a descubrir nuevos animes
- Hacer recomendaciones personalizadas y específicas
- Responder preguntas sobre anime
- Comparar animes y explicar similitudes

REGLAS ESTRICTAS:
1. SOLO hablas sobre anime (series, películas, OVAs, especiales)
2. Si te preguntan algo NO relacionado con anime, responde amablemente: "Soy un asistente especializado en anime. ¿En qué anime puedo ayudarte?"
3. Da recomendaciones ESPECÍFICAS con títulos exactos
4. Incluye RAZONES de por qué recomiendas cada anime
5. Menciona el género, año y una breve descripción
6. Sé conversacional pero conciso

FORMATO DE RESPUESTAS:
- Usa listas numeradas para múltiples recomendaciones
- Explica por qué cada recomendación es relevante
- Menciona aspectos visuales, narrativos o temáticos

EJEMPLOS DE BUENAS RESPUESTAS:
Usuario: "Quiero algo con estética similar a Violet Evergarden"
Tú: "Te recomendaría:
1. A Silent Voice (2016) - Hermosa animación de Kyoto Animation, similar calidad visual
2. Your Name (2016) - Estética impresionante con enfoque emocional
3. Garden of Words (2013) - Makoto Shinkai, fondos detallados y atmósfera contemplativa"

Usuario: "Me gustó Death Note"
Tú: "Basado en Death Note, te gustarían:
1. Code Geass - Protagonista brillante, estrategias complejas, dilemas morales
2. Psycho-Pass - Thriller psicológico, sistema de justicia cuestionable
3. Monster - Suspenso, juego mental entre protagonista y antagonista"

RECUERDA: Solo anime, siempre específico, siempre con razones.`;

/**
 * Llama a Gemini API con un mensaje y contexto
 * @param userMessage - Mensaje del usuario
 * @param conversationHistory - Historial previo (opcional)
 * @returns Respuesta de Gemini
 */
export async function askGemini(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
): Promise<string> {
  // Verificar API key
  if (!env.GEMINI_API_KEY) {
    throw new GeminiError(
      "GEMINI_API_KEY no está configurada en las variables de entorno",
      500,
    );
  }

  try {
    // Construir el prompt completo con historial
    const fullPrompt = buildPrompt(userMessage, conversationHistory);

    // Construir request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8, // Algo de creatividad pero no demasiado
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    // Hacer request con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new GeminiError(
        `Gemini API error: ${response.status} - ${errorText}`,
        response.status,
      );
    }

    const data = (await response.json()) as GeminiResponse;

    // Verificar si fue bloqueado por seguridad
    if (data.promptFeedback?.blockReason) {
      throw new GeminiError(
        `Contenido bloqueado: ${data.promptFeedback.blockReason}`,
        400,
      );
    }

    // Extraer respuesta
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new GeminiError("Respuesta vacía de Gemini", 500);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error instanceof GeminiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new GeminiError("Timeout: La IA tardó demasiado en responder", 408);
      }
      throw new GeminiError(`Error de red: ${error.message}`, 500);
    }

    throw new GeminiError("Error desconocido al llamar a Gemini", 500);
  }
}

/**
 * Construye el prompt completo con sistema, historial y mensaje actual
 */
function buildPrompt(
  userMessage: string,
  conversationHistory: ChatMessage[],
): string {
  let prompt = SYSTEM_PROMPT + "\n\n---\n\n";

  // Agregar historial si existe (últimos 5 mensajes para no exceder límites)
  const recentHistory = conversationHistory.slice(-5);
  if (recentHistory.length > 0) {
    prompt += "CONVERSACIÓN PREVIA:\n";
    recentHistory.forEach((msg) => {
      if (msg.role === "user") {
        prompt += `Usuario: ${msg.content}\n`;
      } else {
        prompt += `Asistente: ${msg.content}\n`;
      }
    });
    prompt += "\n";
  }

  // Agregar mensaje actual
  prompt += `Usuario: ${userMessage}\n\nAsistente:`;

  return prompt;
}

/**
 * Valida si un mensaje es apropiado
 */
export function isValidMessage(message: string): boolean {
  const trimmed = message.trim();
  return trimmed.length > 0 && trimmed.length <= 1000;
}

/**
 * Limpia el historial dejando solo los últimos N mensajes
 */
export function truncateHistory(
  history: ChatMessage[],
  maxMessages = 10,
): ChatMessage[] {
  if (history.length <= maxMessages) {
    return history;
  }
  return history.slice(-maxMessages);
}

