"use client";

import { useState } from "react";
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
  Autocomplete,
  SimpleGrid,
  Tooltip,
  Paper,
  Progress,
  ActionIcon,
} from "@mantine/core";
import {
  IconList,
  IconAlertCircle,
  IconStar,
  IconCalendar,
  IconDeviceTv,
  IconExternalLink,
  IconSparkles,
  IconSearch,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { api } from "~/trpc/react";
import { useDebouncedValue } from "@mantine/hooks";

/**
 * Componente funcional para Fase 3: Recomendación según animes vistos
 * Ahora con campos dinámicos (mínimo 2, máximo 10)
 */
export function SimilarRecommendation() {
  // Estado para los inputs de anime (empezamos con 2)
  const [animeInputs, setAnimeInputs] = useState<string[]>(["", ""]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Debounce para cada input (SIEMPRE 10, el máximo permitido)
  const [debouncedInput0] = useDebouncedValue(animeInputs[0] ?? "", 500);
  const [debouncedInput1] = useDebouncedValue(animeInputs[1] ?? "", 500);
  const [debouncedInput2] = useDebouncedValue(animeInputs[2] ?? "", 500);
  const [debouncedInput3] = useDebouncedValue(animeInputs[3] ?? "", 500);
  const [debouncedInput4] = useDebouncedValue(animeInputs[4] ?? "", 500);
  const [debouncedInput5] = useDebouncedValue(animeInputs[5] ?? "", 500);
  const [debouncedInput6] = useDebouncedValue(animeInputs[6] ?? "", 500);
  const [debouncedInput7] = useDebouncedValue(animeInputs[7] ?? "", 500);
  const [debouncedInput8] = useDebouncedValue(animeInputs[8] ?? "", 500);
  const [debouncedInput9] = useDebouncedValue(animeInputs[9] ?? "", 500);

  // Búsquedas de autocompletado (SIEMPRE 10 hooks, activados según necesidad)
  const { data: suggestions0 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput0 ?? "x" },
    { enabled: (debouncedInput0?.length ?? 0) > 0 && animeInputs.length > 0 }
  );
  const { data: suggestions1 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput1 ?? "x" },
    { enabled: (debouncedInput1?.length ?? 0) > 0 && animeInputs.length > 1 }
  );
  const { data: suggestions2 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput2 ?? "x" },
    { enabled: (debouncedInput2?.length ?? 0) > 0 && animeInputs.length > 2 }
  );
  const { data: suggestions3 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput3 ?? "x" },
    { enabled: (debouncedInput3?.length ?? 0) > 0 && animeInputs.length > 3 }
  );
  const { data: suggestions4 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput4 ?? "x" },
    { enabled: (debouncedInput4?.length ?? 0) > 0 && animeInputs.length > 4 }
  );
  const { data: suggestions5 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput5 ?? "x" },
    { enabled: (debouncedInput5?.length ?? 0) > 0 && animeInputs.length > 5 }
  );
  const { data: suggestions6 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput6 ?? "x" },
    { enabled: (debouncedInput6?.length ?? 0) > 0 && animeInputs.length > 6 }
  );
  const { data: suggestions7 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput7 ?? "x" },
    { enabled: (debouncedInput7?.length ?? 0) > 0 && animeInputs.length > 7 }
  );
  const { data: suggestions8 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput8 ?? "x" },
    { enabled: (debouncedInput8?.length ?? 0) > 0 && animeInputs.length > 8 }
  );
  const { data: suggestions9 } = api.anime.byThree.search.useQuery(
    { search: debouncedInput9 ?? "x" },
    { enabled: (debouncedInput9?.length ?? 0) > 0 && animeInputs.length > 9 }
  );

  // Array de sugerencias para mapear fácilmente
  const suggestions = [
    suggestions0?.map((s) => s.title) ?? [],
    suggestions1?.map((s) => s.title) ?? [],
    suggestions2?.map((s) => s.title) ?? [],
    suggestions3?.map((s) => s.title) ?? [],
    suggestions4?.map((s) => s.title) ?? [],
    suggestions5?.map((s) => s.title) ?? [],
    suggestions6?.map((s) => s.title) ?? [],
    suggestions7?.map((s) => s.title) ?? [],
    suggestions8?.map((s) => s.title) ?? [],
    suggestions9?.map((s) => s.title) ?? [],
  ];

  // Query para obtener recomendaciones
  const {
    data: recommendations,
    isLoading,
    error,
  } = api.anime.byThree.recommend.useQuery(
    {
      titles: animeInputs.filter((t) => t.trim() !== ""),
      limit: 12,
    },
    {
      enabled: searchTriggered && animeInputs.filter((t) => t.trim() !== "").length >= 2,
    },
  );

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...animeInputs];
    newInputs[index] = value;
    setAnimeInputs(newInputs);
    setSearchTriggered(false);
  };

  const handleAddInput = () => {
    if (animeInputs.length < 10) {
      setAnimeInputs([...animeInputs, ""]);
    }
  };

  const handleRemoveInput = (index: number) => {
    if (animeInputs.length > 2) {
      const newInputs = animeInputs.filter((_, i) => i !== index);
      setAnimeInputs(newInputs);
      setSearchTriggered(false);
    }
  };

  const handleSearch = () => {
    const filledInputs = animeInputs.filter((t) => t.trim() !== "");
    if (filledInputs.length >= 2) {
      setSearchTriggered(true);
    }
  };

  const filledCount = animeInputs.filter((t) => t.trim() !== "").length;
  const canSearch = filledCount >= 2;
  const canAddMore = animeInputs.length < 10;
  const canRemove = animeInputs.length > 2;

  return (
    <Stack gap="lg">
      {/* Inputs para animes con autocompletado dinámico */}
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <div>
            <Title order={4}>Ingresa animes que hayas visto</Title>
            <Text size="sm" c="dimmed" mt="xs">
              Mínimo 2 animes, máximo 10. Cuantos más agregues, más específica será la búsqueda.
            </Text>
          </div>

          <Stack gap="sm">
            {animeInputs.map((input, index) => (
              <Group key={index} gap="xs" wrap="nowrap">
                <Autocomplete
                  placeholder={`Anime ${index + 1} (ej: Naruto, Steins Gate)`}
                  value={input}
                  onChange={(value) => handleInputChange(index, value)}
                  data={suggestions[index]}
                  leftSection={<IconSearch size={16} />}
                  size="md"
                  limit={5}
                  style={{ flex: 1 }}
                />
                {canRemove && (
                  <Tooltip label="Quitar este anime">
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="lg"
                      onClick={() => handleRemoveInput(index)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            ))}
          </Stack>

          {/* Botón para agregar más animes */}
          {canAddMore && (
            <Button
              onClick={handleAddInput}
              variant="light"
              leftSection={<IconPlus size={18} />}
              color="blue"
            >
              Agregar otro anime ({animeInputs.length}/10)
            </Button>
          )}

          {/* Botón de búsqueda */}
          <Button
            onClick={handleSearch}
            disabled={!canSearch || isLoading}
            leftSection={<IconSparkles size={18} />}
            variant="gradient"
            gradient={{ from: "teal", to: "cyan" }}
            fullWidth
            size="lg"
          >
            Buscar Recomendaciones
          </Button>

          {/* Progress indicator */}
          <Group gap="xs" justify="center">
            <Text size="xs" c="dimmed">
              {filledCount}/{animeInputs.length} animes ingresados
            </Text>
            {filledCount >= 2 && (
              <Badge size="xs" color="green" variant="dot">
                Listo para buscar
              </Badge>
            )}
          </Group>
          <Progress
            value={(filledCount / Math.max(animeInputs.length, 2)) * 100}
            size="xs"
            color={canSearch ? "teal" : "gray"}
          />
        </Stack>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">
              Analizando {filledCount} animes y buscando recomendaciones...
            </Text>
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
            <Button variant="white" onClick={handleSearch} disabled={!canSearch}>
              Reintentar
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Results Grid */}
      {recommendations && recommendations.length > 0 && (
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Encontradas {recommendations.length} recomendaciones basadas en {filledCount} animes
            </Text>
            <Badge variant="light" color="cyan">
              {filledCount} {filledCount === 1 ? "anime" : "animes"} analizados
            </Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {recommendations.map((anime) => (
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
                  {/* Similarity Score Badge */}
                  <Badge
                    variant="gradient"
                    gradient={{ from: "teal", to: "cyan" }}
                    size="lg"
                    fullWidth
                  >
                    {anime.similarityScore}% Similar
                  </Badge>

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
                        variant="light"
                        color="yellow"
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

                  {/* Match Details */}
                  {anime.matchDetails && (
                    <Group gap="xs">
                      {anime.matchDetails.isNativeRecommendation && (
                        <Badge size="xs" variant="dot" color="green">
                          Recomendación oficial
                        </Badge>
                      )}
                      {anime.matchDetails.genreOverlap > 0 && (
                        <Badge size="xs" variant="dot" color="teal">
                          {anime.matchDetails.genreOverlap}% géneros
                        </Badge>
                      )}
                      {anime.matchDetails.tagOverlap > 0 && (
                        <Badge size="xs" variant="dot" color="cyan">
                          {anime.matchDetails.tagOverlap}% tags
                        </Badge>
                      )}
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
      {recommendations?.length === 0 && !isLoading && searchTriggered && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconList size={48} stroke={1.5} color="gray" />
            <Text c="dimmed" ta="center">
              No se encontraron recomendaciones. Intenta con otros animes.
            </Text>
          </Stack>
        </Card>
      )}

      {/* Empty State */}
      {!searchTriggered && !isLoading && !error && (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconList size={64} stroke={1.5} color="gray" opacity={0.5} />
            <div style={{ textAlign: "center" }}>
              <Title order={3} c="dimmed">
                Ingresa al menos 2 animes
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                Escribe y selecciona de las sugerencias. Cuantos más agregues, más precisa será la búsqueda.
              </Text>
            </div>
            <Group gap="sm" mt="md">
              <Badge variant="light" color="teal">Campos dinámicos</Badge>
              <Badge variant="light" color="cyan">Mínimo 2 animes</Badge>
              <Badge variant="light" color="blue">Hasta 10 animes</Badge>
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
