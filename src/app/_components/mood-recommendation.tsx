"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Loader,
  Alert,
  Title,
  Select,
  SimpleGrid,
  Tooltip,
  Paper,
  Progress,
} from "@mantine/core";
import {
  IconMoodSmile,
  IconAlertCircle,
  IconStar,
  IconCalendar,
  IconDeviceTv,
  IconExternalLink,
  IconSparkles,
  IconClock,
} from "@tabler/icons-react";
import { api } from "~/trpc/react";

// Rate limiter: 5 búsquedas cada 5 minutos
const MAX_SEARCHES = 5;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutos en ms

/**
 * Hook para manejar rate limiting
 */
function useRateLimit() {
  const [searchCount, setSearchCount] = useState(0);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (resetTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((resetTime - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setSearchCount(0);
          setResetTime(null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resetTime]);

  const canSearch = searchCount < MAX_SEARCHES;

  const incrementSearch = () => {
    const newCount = searchCount + 1;
    setSearchCount(newCount);

    if (newCount === 1) {
      // Primera búsqueda - iniciar ventana de tiempo
      setResetTime(Date.now() + RATE_LIMIT_WINDOW);
    }
  };

  const getRemainingSearches = () => MAX_SEARCHES - searchCount;

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    canSearch,
    incrementSearch,
    getRemainingSearches,
    timeRemaining,
    formatTimeRemaining,
    searchCount,
  };
}

/**
 * Componente funcional para Fase 2: Recomendación según estado de ánimo
 */
export function MoodRecommendation() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState(0); // Key para forzar refetch
  const [randomPage, setRandomPage] = useState(1); // Página aleatoria para variar resultados

  const rateLimit = useRateLimit();

  // Query para obtener moods disponibles
  const { data: availableMoods } = api.anime.mood.getAvailableMoods.useQuery();

  // Query para obtener animes por mood
  const {
    data: animes,
    isLoading,
    error,
  } = api.anime.mood.getList.useQuery(
    { 
      mood: selectedMood!, 
      limit: 12,
      page: randomPage, // Página aleatoria para variar resultados
      _key: searchKey, // Key para forzar refetch
    } as { mood: string; limit: number; page: number },
    { 
      enabled: !!selectedMood && searchKey > 0,
      // No usar caché para permitir búsquedas frescas
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  // Opciones para el Select
  const moodOptions = availableMoods?.map((mood) => ({
    value: mood,
    label: mood.charAt(0).toUpperCase() + mood.slice(1),
  })) ?? [];

  const handleSearch = () => {
    if (!selectedMood) return;
    
    if (!rateLimit.canSearch) {
      return; // El rate limit se muestra en la UI
    }

    // Generar página aleatoria entre 1 y 5 para variar resultados
    const newRandomPage = Math.floor(Math.random() * 5) + 1;
    
    // Incrementar búsqueda, cambiar página y forzar refetch
    rateLimit.incrementSearch();
    setRandomPage(newRandomPage);
    setSearchKey((prev) => prev + 1);
  };

  // Auto-búsqueda cuando se selecciona un mood por primera vez
  useEffect(() => {
    if (selectedMood && searchKey === 0 && rateLimit.canSearch) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMood]);

  return (
    <Stack gap="lg">
      {/* Selector de Mood */}
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <Group align="flex-end" gap="md">
            <Select
              label="¿Cómo te sientes?"
              placeholder="Selecciona tu estado de ánimo"
              data={moodOptions}
              value={selectedMood}
              onChange={(value) => {
                setSelectedMood(value);
                // No auto-buscar aquí, esperar a que el usuario haga click
              }}
              leftSection={<IconMoodSmile size={16} />}
              style={{ flex: 1 }}
              size="md"
            />
            <Button
              onClick={handleSearch}
              disabled={!selectedMood || isLoading || !rateLimit.canSearch}
              leftSection={<IconSparkles size={18} />}
              variant="gradient"
              gradient={{ from: "pink", to: "violet" }}
            >
              Buscar Animes
            </Button>
          </Group>

          {/* Rate Limit Info */}
          {rateLimit.searchCount > 0 && (
            <Paper p="sm" radius="sm" bg="gray.0" withBorder>
              <Group gap="xs" justify="space-between">
                <Group gap="xs">
                  <IconClock size={16} />
                  <Text size="sm">
                    Búsquedas restantes: <strong>{rateLimit.getRemainingSearches()}/{MAX_SEARCHES}</strong>
                  </Text>
                </Group>
                {rateLimit.timeRemaining > 0 && (
                  <Text size="xs" c="dimmed">
                    Reinicia en: {rateLimit.formatTimeRemaining()}
                  </Text>
                )}
              </Group>
              <Progress
                value={(rateLimit.searchCount / MAX_SEARCHES) * 100}
                size="xs"
                mt="xs"
                color={rateLimit.canSearch ? "blue" : "red"}
              />
            </Paper>
          )}

          {/* Rate Limit Exceeded Alert */}
          {!rateLimit.canSearch && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Límite de búsquedas alcanzado"
              color="orange"
            >
              Has alcanzado el límite de {MAX_SEARCHES} búsquedas. 
              Espera {rateLimit.formatTimeRemaining()} para buscar nuevamente.
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Buscando animes perfectos para ti...</Text>
          </Stack>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          <Stack gap="sm">
            <Text>{error.message}</Text>
            <Button 
              variant="white" 
              onClick={handleSearch}
              disabled={!rateLimit.canSearch}
            >
              Reintentar
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Results Grid */}
      {animes && animes.length > 0 && (
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Encontrados {animes.length} animes para el mood <strong>{selectedMood}</strong>
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {animes.map((anime) => (
              <Card key={anime.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  {anime.imageUrl ? (
                    <Image
                      src={anime.imageUrl}
                      height={280}
                      alt={anime.title.default}
                      fit="cover"
                    />
                  ) : (
                    <div
                      style={{
                        height: 280,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconDeviceTv size={48} color="white" opacity={0.5} />
                    </div>
                  )}
                </Card.Section>

                <Stack gap="sm" mt="md">
                  <Tooltip label={anime.title.default} multiline w={220}>
                    <Title order={4} lineClamp={2} size="h5">
                      {anime.title.default}
                    </Title>
                  </Tooltip>

                  {anime.title.native && (
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {anime.title.native}
                    </Text>
                  )}

                  <Group gap="xs" wrap="wrap">
                    {anime.score && (
                      <Badge
                        leftSection={<IconStar size={12} />}
                        variant="gradient"
                        gradient={{ from: "yellow", to: "orange" }}
                        size="sm"
                      >
                        {anime.score / 10}
                      </Badge>
                    )}
                    {anime.year && (
                      <Badge
                        leftSection={<IconCalendar size={12} />}
                        variant="light"
                        color="blue"
                        size="sm"
                      >
                        {anime.year}
                      </Badge>
                    )}
                    {anime.episodes && (
                      <Badge
                        leftSection={<IconDeviceTv size={12} />}
                        variant="light"
                        color="grape"
                        size="sm"
                      >
                        {anime.episodes} eps
                      </Badge>
                    )}
                  </Group>

                  {/* Matched Genres/Tags */}
                  {(anime.reason.matchedGenres ?? anime.reason.matchedTags) && (
                    <Group gap="xs">
                      {anime.reason.matchedGenres?.map((genre) => (
                        <Badge key={genre} size="xs" variant="dot" color="pink">
                          {genre}
                        </Badge>
                      ))}
                      {anime.reason.matchedTags?.map((tag) => (
                        <Badge key={tag} size="xs" variant="dot" color="violet">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  )}

                  {anime.synopsis && (
                    <Text size="xs" c="dimmed" lineClamp={3}>
                      {anime.synopsis.replace(/<[^>]*>/g, "")}
                    </Text>
                  )}

                  {anime.url && (
                    <Button
                      component="a"
                      href={anime.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="light"
                      size="xs"
                      rightSection={<IconExternalLink size={14} />}
                      fullWidth
                    >
                      Ver en AniList
                    </Button>
                  )}
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {/* No Results */}
      {animes?.length === 0 && !isLoading && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconMoodSmile size={48} stroke={1.5} color="gray" />
            <Text c="dimmed" ta="center">
              No se encontraron animes para este mood. Intenta con otro.
            </Text>
          </Stack>
        </Card>
      )}

      {/* Empty State */}
      {!selectedMood && !isLoading && !error && searchKey === 0 && (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconMoodSmile size={64} stroke={1.5} color="gray" opacity={0.5} />
            <div style={{ textAlign: "center" }}>
              <Title order={3} c="dimmed">
                Selecciona tu estado de ánimo
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                Elige cómo te sientes y te recomendaremos animes perfectos para ti
              </Text>
            </div>
            <Text size="xs" c="dimmed" ta="center" mt="md">
              Moods disponibles: {availableMoods?.join(", ")}
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
