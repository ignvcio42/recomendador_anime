"use client";

import { Container, Title, Text, Stack, Tabs, Paper, Badge, Group, Divider } from "@mantine/core";
import { IconDice5, IconMoodSmile, IconList, IconBrain } from "@tabler/icons-react";
import { RandomAnime } from "./_components/random-anime";
import { MoodRecommendation } from "./_components/mood-recommendation";
import { SimilarRecommendation } from "./_components/similar-recommendation";
import { AIRecommendation } from "./_components/ai-recommendation";

export default function HomePage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" wrap="wrap">
              <div>
                <Title order={1} size="h1">
                  🎌 Recomendador de Anime
                </Title>
                <Text size="lg" c="dimmed" mt="xs">
                  Sistema inteligente de recomendación con múltiples métodos
                </Text>
              </div>
              <Badge size="lg" variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
                T3 Stack
              </Badge>
            </Group>
            
            <Divider />
            
            <Text size="sm" c="dimmed">
              Explora diferentes formas de descubrir tu próximo anime favorito: desde recomendaciones
              aleatorias hasta sistemas de IA avanzados.
            </Text>
          </Stack>
        </Paper>

        {/* Tabs con las 4 funcionalidades */}
        <Tabs defaultValue="random" variant="pills" radius="md">
          <Tabs.List grow>
            <Tabs.Tab
              value="random"
              leftSection={<IconDice5 size={18} />}
            >
              <Group gap="xs">
                <Text size="sm" fw={500}>Aleatorio</Text>
                <Badge size="xs" color="green" variant="filled">Activo</Badge>
              </Group>
            </Tabs.Tab>

            <Tabs.Tab
              value="mood"
              leftSection={<IconMoodSmile size={18} />}
            >
              <Group gap="xs">
                <Text size="sm" fw={500}>Por Ánimo</Text>
                <Badge size="xs" color="green" variant="filled">Activo</Badge>
              </Group>
            </Tabs.Tab>

            <Tabs.Tab
              value="similar"
              leftSection={<IconList size={18} />}
            >
              <Group gap="xs">
                <Text size="sm" fw={500}>Por Vistos</Text>
                <Badge size="xs" color="green" variant="filled">Activo</Badge>
              </Group>
            </Tabs.Tab>

            <Tabs.Tab
              value="ai"
              leftSection={<IconBrain size={18} />}
            >
              <Group gap="xs">
                <Text size="sm" fw={500}>IA Avanzada</Text>
                <Badge size="xs" color="yellow" variant="filled">Fase 4</Badge>
              </Group>
            </Tabs.Tab>
          </Tabs.List>

          {/* Fase 1: Random (Jikan) - ACTIVA */}
          <Tabs.Panel value="random" pt="xl">
            <Stack gap="md">
              <div>
                <Title order={2}>🎲 Recomendación Aleatoria</Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Descubre animes al azar de la base de datos de MyAnimeList
                </Text>
                <Group gap="xs" mt="sm">
                  <Badge variant="light" color="blue">Jikan API</Badge>
                  <Badge variant="light" color="green">✓ Implementado</Badge>
                  <Badge variant="light" color="gray">Sin caché</Badge>
                </Group>
              </div>
              <RandomAnime />
            </Stack>
          </Tabs.Panel>

          {/* Fase 2: Mood (AniList) - ACTIVA */}
          <Tabs.Panel value="mood" pt="xl">
            <Stack gap="md">
              <div>
                <Title order={2}>😊 Recomendación por Estado de Ánimo</Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Encuentra animes que coincidan con tu mood actual
                </Text>
                <Group gap="xs" mt="sm">
                  <Badge variant="light" color="blue">AniList GraphQL</Badge>
                  <Badge variant="light" color="green">✓ Implementado</Badge>
                  <Badge variant="light" color="gray">Sin caché</Badge>
                </Group>
              </div>
              <MoodRecommendation />
            </Stack>
          </Tabs.Panel>

          {/* Fase 3: Similar (AniList) - ACTIVA */}
          <Tabs.Panel value="similar" pt="xl">
            <Stack gap="md">
              <div>
                <Title order={2}>📺 Recomendación por Animes Vistos</Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Basado en animes que hayas visto (mínimo 2, máximo 10). Cuantos más agregues, más específica será la búsqueda.
                </Text>
                <Group gap="xs" mt="sm">
                  <Badge variant="light" color="blue">AniList GraphQL</Badge>
                  <Badge variant="light" color="green">✓ Implementado</Badge>
                  <Badge variant="light" color="teal">Jaccard Similarity</Badge>
                  <Badge variant="light" color="cyan">Campos dinámicos</Badge>
                </Group>
              </div>
              <SimilarRecommendation />
            </Stack>
          </Tabs.Panel>

          {/* Fase 4: AI (Vector/LLM) - PLACEHOLDER */}
          <Tabs.Panel value="ai" pt="xl">
            <Stack gap="md">
              <div>
                <Title order={2}>🧠 Recomendación con IA</Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Encuentra animes similares usando embeddings y LLM
                </Text>
                <Group gap="xs" mt="sm">
                  <Badge variant="light" color="purple">Vector DB</Badge>
                  <Badge variant="light" color="pink">LLM</Badge>
                  <Badge variant="light" color="yellow">⏳ Próximamente</Badge>
                </Group>
              </div>
              <AIRecommendation />
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* Footer Info */}
      </Stack>
    </Container>
  );
}
