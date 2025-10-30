"use client";

import { Card, Text, Badge, Stack, Title } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";

/**
 * Componente placeholder para Fase 4: IA similar a X
 */
export function AIRecommendation() {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Stack gap="md" align="center" style={{ minHeight: 200 }}>
        <IconBrain size={48} stroke={1.5} color="gray" />
        <div style={{ textAlign: "center" }}>
          <Title order={3} c="dimmed">Fase 4: IA Similar a X</Title>
          <Text size="sm" c="dimmed" mt="xs">
            Próximamente - Vector/LLM
          </Text>
          <Badge color="yellow" variant="light" mt="md">
            En desarrollo
          </Badge>
        </div>
        <Text size="xs" c="dimmed" ta="center" mt="md">
          Usa IA avanzada para encontrar animes similares a uno específico
        </Text>
      </Stack>
    </Card>
  );
}

