"use client";

import { Card, Image, Text, Badge, Button, Group, Stack, Loader, Alert, Title } from "@mantine/core";
import { IconDice5, IconAlertCircle, IconStar, IconCalendar, IconDeviceTv, IconExternalLink } from "@tabler/icons-react";
import { api } from "~/trpc/react";

/**
 * Componente de Mantine UI para anime random
 */
export function RandomAnime() {
  const {
    data: anime,
    isLoading,
    error,
    refetch,
  } = api.anime.random.getOne.useQuery();

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Buscando anime aleatorio...</Text>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
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
            onClick={() => refetch()}
          >
            Reintentar
          </Button>
        </Stack>
      </Alert>
    );
  }

  if (!anime) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed">No se encontró anime</Text>
      </Card>
    );
  }

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Group align="flex-start" gap="lg" wrap="nowrap">
        {anime.imageUrl && (
          <Image
            src={anime.imageUrl}
            alt={anime.title.default}
            width={200}
            height={280}
            radius="md"
            fit="cover"
          />
        )}

        <Stack flex={1} gap="md">
          <div>
            <Title order={2}>{anime.title.default}</Title>
            
            {anime.title.english && anime.title.english !== anime.title.default && (
              <Text size="lg" c="dimmed" mt={4}>
                {anime.title.english}
              </Text>
            )}
            
            {anime.title.native && (
              <Text size="sm" c="dimmed" mt={2}>
                {anime.title.native}
              </Text>
            )}
          </div>

          <Group gap="xs">
            {anime.score && (
              <Badge
                leftSection={<IconStar size={14} />}
                variant="gradient"
                gradient={{ from: "yellow", to: "orange" }}
              >
                {anime.score}
              </Badge>
            )}
            {anime.year && (
              <Badge
                leftSection={<IconCalendar size={14} />}
                variant="light"
                color="blue"
              >
                {anime.year}
              </Badge>
            )}
            {anime.episodes && (
              <Badge
                leftSection={<IconDeviceTv size={14} />}
                variant="light"
                color="grape"
              >
                {anime.episodes} eps
              </Badge>
            )}
          </Group>

          {anime.rating && (
            <Text size="sm" c="dimmed">
              {anime.rating}
            </Text>
          )}

          {anime.synopsis && (
            <Text size="sm" lineClamp={4}>
              {anime.synopsis}
            </Text>
          )}

          {anime.url && (
            <Button
              component="a"
              href={anime.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              rightSection={<IconExternalLink size={16} />}
              w="fit-content"
            >
              Ver en MyAnimeList
            </Button>
          )}
        </Stack>
      </Group>

      <Button
        fullWidth
        mt="md"
        leftSection={<IconDice5 size={20} />}
        onClick={() => refetch()}
        disabled={isLoading}
        variant="gradient"
        gradient={{ from: "blue", to: "cyan" }}
      >
        Obtener otro anime aleatorio
      </Button>
    </Card>
  );
}

/**
 * Hook personalizado
 */
export function useRandomAnime() {
  const query = api.anime.random.getOne.useQuery();

  return {
    anime: query.data,
    isLoading: query.isLoading,
    error: query.error,
    getNewAnime: () => query.refetch(),
  };
}
