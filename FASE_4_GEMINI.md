# Fase 4: Recomendador con IA (Gemini)

## 🤖 Descripción

Chat interactivo con un **asistente de IA especializado en anime** usando **Gemini** (Google). La IA está entrenada para:

- 🎯 Hacer recomendaciones personalizadas
- 🎨 Buscar animes por estética o estilo
- 📊 Comparar animes y explicar similitudes
- 💬 Responder preguntas sobre anime en lenguaje natural
- ✨ Sugerir basado en preferencias complejas

## ✨ Características

### 1. **Chat Interactivo**
- Interfaz de chat moderna con Mantine UI
- Historial de conversación
- Auto-scroll a últimos mensajes
- Timestamps en cada mensaje

### 2. **IA Especializada**
- Prompt system que garantiza respuestas solo sobre anime
- Contexto conversacional (últimos 10 mensajes)
- Recomendaciones con razones específicas
- Formato estructurado y fácil de leer

### 3. **API Gemini (Gratuita)**
- ✅ 60 requests/minuto gratis
- ✅ No requiere tarjeta de crédito
- ✅ Modelo: `gemini-2.0-flash-exp` (más reciente y potente)
- ✅ Timeout de 30 segundos

## 🚀 Configuración

### Paso 1: Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la API key generada

### Paso 2: Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Agrega tu API key:

```env
# Gemini AI API Key
GEMINI_API_KEY="tu-api-key-aqui"
```

### Paso 3: Reiniciar el Servidor

```bash
npm run dev
```

¡Listo! La IA ya está funcionando. 🎉

## 📝 Ejemplos de Uso

### Ejemplo 1: Recomendación por estética
```
Usuario: "Quiero algo con estética similar a Violet Evergarden"

IA: "Te recomendaría:
1. A Silent Voice (2016) - Hermosa animación de Kyoto Animation
2. Your Name (2016) - Estética impresionante de Makoto Shinkai
3. Garden of Words (2013) - Fondos detallados y atmósfera contemplativa"
```

### Ejemplo 2: Animes similares
```
Usuario: "Me gustó Death Note, ¿qué me recomiendas?"

IA: "Basado en Death Note:
1. Code Geass - Protagonista brillante, estrategias complejas
2. Psycho-Pass - Thriller psicológico, sistema de justicia cuestionable
3. Monster - Suspenso, juego mental entre protagonista y antagonista"
```

### Ejemplo 3: Por género y mood
```
Usuario: "Quiero un slice of life relajante con buen romance"

IA: "Perfecto para relajarte:
1. Tsuki ga Kirei - Romance puro, ritmo tranquilo
2. Horimiya - Relaciones sanas, comedia ligera
3. My Love Story!! - Wholesome, protagonistas adorables"
```

## 🎯 Casos de Uso

### ✅ Preguntas que funcionan bien:
- "Animes como [X]"
- "Con estética de [Y]"
- "Género [Z] pero con [característica]"
- "Algo entre [A] y [B]"
- "Recomienda para [mood/situación]"

### ❌ Lo que NO hace (por diseño):
- No responde preguntas no relacionadas con anime
- No genera spoilers (entrenado para evitarlo)
- No hace listas genéricas sin razones

## 🛠️ Arquitectura Técnica

### Frontend (`src/app/_components/ai-recommendation.tsx`)
```typescript
- Estado: messages[], inputMessage
- Mutation: api.anime.ai.chat.useMutation()
- Auto-scroll: useEffect + ScrollArea
- UI: Mantine (Card, Paper, Avatar, Textarea)
```

### Backend (`src/server/api/routers/anime.ts`)
```typescript
ai: createTRPCRouter({
  chat: publicProcedure
    .input(z.object({
      message: z.string(),
      history: z.array(...).optional()
    }))
    .mutation(async ({ input }) => {
      const response = await askGemini(input.message, input.history);
      return { response };
    })
})
```

### Servicio AI (`src/lib/gemini.ts`)
```typescript
export async function askGemini(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  // Construir prompt con sistema + historial
  // Llamar a Gemini API
  // Parsear respuesta
}
```

## 📊 Límites de Gemini

| Característica | Límite Gratuito |
|---|---|
| Requests por minuto | 60 |
| Requests por día | 1,500 |
| Tokens por request | ~4,000 |
| Costo | **$0 (gratis)** |

## 🔐 Seguridad

- ✅ API key en servidor (nunca expuesta al cliente)
- ✅ Variables de entorno con validación (Zod)
- ✅ Timeouts (30s) para evitar bloqueos
- ✅ Safety settings habilitadas
- ✅ Validación de mensajes (1-1000 caracteres)

## 🎨 UI/UX

### Componentes Mantine Usados:
- `ScrollArea` - área de chat con scroll
- `Avatar` - íconos de usuario/IA
- `Paper` - burbujas de mensaje
- `Textarea` - input con autosize
- `Button` - enviar mensaje
- `Badge` - tips y estado
- `Alert` - mensajes de ayuda

### Features UX:
- Auto-scroll a último mensaje
- Enter para enviar (Shift+Enter para nueva línea)
- Loading indicator mientras piensa
- Timestamps en cada mensaje
- Botón limpiar chat
- Empty state con ejemplos

## 🐛 Manejo de Errores

| Error | Código | Acción |
|---|---|---|
| Sin API key | 500 | "API key no configurada" |
| Timeout (>30s) | 408 | "IA tardó demasiado" |
| Contenido bloqueado | 400 | "Contenido inapropiado" |
| Rate limit excedido | 429 | "Demasiadas requests" |
| Error de red | 500 | "Error de conexión" |

Todos los errores se muestran en el chat como mensajes del asistente con emoji ❌.

## 🚀 Mejoras Futuras (Opcionales)

- [ ] Streaming de respuestas (palabra por palabra)
- [ ] Integración con base de datos de anime real
- [ ] Caché de respuestas comunes
- [ ] Rate limiting por usuario
- [ ] Historial persistente (localStorage)
- [ ] Compartir conversaciones
- [ ] Modo voz (text-to-speech)
- [ ] Búsqueda semántica en base vectorial

## 📚 Recursos

- [Gemini API Docs](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Límites y Pricing](https://ai.google.dev/pricing)

## ✅ Checklist de Implementación

- [x] Servicio de Gemini AI
- [x] Endpoint tRPC para chat
- [x] Componente de chat interactivo
- [x] Variables de entorno configuradas
- [x] Prompt system especializado en anime
- [x] Manejo de errores robusto
- [x] UI/UX pulida con Mantine
- [x] Documentación completa

---

**Implementado**: Octubre 2025  
**Tecnología**: Gemini 1.5 Flash (Google)  
**Costo**: $0 (gratis) 🎉

