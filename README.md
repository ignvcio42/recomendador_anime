# AniReko - Sistema de Recomendación de Anime

Sistema web de recomendaciones de anime con múltiples métodos de búsqueda, construido con el T3 Stack.

## 🎯 Funcionalidades

### 1. Recomendación Aleatoria
Obtén un anime completamente aleatorio con toda su información detallada.

### 2. Recomendación por Ánimo
Encuentra animes según tu estado de ánimo actual:
- Relajado
- Feliz
- Intenso
- Épico
- Triste
- Misterioso

### 3. Recomendación por Favoritos
Ingresa entre 2 y 10 animes que te gustan y recibe recomendaciones basadas en géneros y etiquetas similares.

### 4. Asistente IA
Chatea con una IA especializada en anime que puede:
- Responder preguntas sobre anime
- Dar recomendaciones personalizadas
- Hablar sobre tus series favoritas

## 🛠️ Tecnologías Utilizadas

- **[Next.js](https://nextjs.org)** - Framework de React
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[tRPC](https://trpc.io)** - API type-safe
- **[Mantine UI](https://mantine.dev/)** - Componentes de UI
- **[Prisma](https://prisma.io)** - ORM (opcional)

### APIs Externas
- **[Jikan API](https://jikan.moe/)** - Datos de MyAnimeList
- **[AniList API](https://anilist.co/)** - Base de datos de anime
- **[Google Gemini](https://ai.google.dev/)** - IA conversacional
- **[MyMemory Translation](https://mymemory.translated.net/)** - Traducción de sinopsis

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd recomendador_anime
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos (opcional, solo si usas Prisma)
DATABASE_URL="file:./db.sqlite"

# Google Gemini API (obligatorio para el asistente IA)
GEMINI_API_KEY="tu_api_key_aqui"
```

Para obtener tu API key de Gemini:
- Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
- Inicia sesión con tu cuenta de Google
- Crea una nueva API key
- Cópiala en el archivo `.env`

4. **Ejecutar el proyecto**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

## 📱 Características

✅ Diseño responsive (mobile y desktop)  
✅ Interfaz moderna estilo anime  
✅ Traducciones automáticas al español  
✅ Rate limiting en búsquedas  
✅ Autocompletado en búsqueda de animes  
✅ Sistema de caché para traducciones  

## 🌐 Estructura del Proyecto

```
src/
├── app/                    # Páginas y componentes de Next.js
│   ├── _components/        # Componentes React
│   └── api/               # API routes
├── server/                # Backend tRPC
│   └── api/
│       └── routers/       # Routers de tRPC
├── lib/                   # Utilidades y clientes de APIs
└── types/                 # Tipos TypeScript
```

## 📝 Notas

- El asistente IA requiere una API key de Gemini (gratis)
- Las traducciones tienen un límite de 500 caracteres
- Se recomienda no exceder 5 búsquedas por ánimo cada 5 minutos
- Todas las APIs externas son gratuitas

## 👨‍💻 Autor

Creado por **Ignacio Guajardo**
