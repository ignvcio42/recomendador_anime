"use client";

import { Box, Container, Text, Stack, Group, Anchor } from "@mantine/core";

export function Footer() {
  return (
    <Box
      component="footer"
      style={{
        borderTop: "1px solid rgba(118, 75, 162, 0.2)",
        padding: "2rem 0",
        marginTop: "4rem",
      }}
    >
      <Container size="xl">
        <Stack gap="md" align="center">
          <Text
            size="sm"
            c="dimmed"
            style={{
              textAlign: "center",
            }}
          >
            Creado por Ignacio Guajardo
          </Text>
          
          <Group gap="xs" justify="center" wrap="wrap">
            <Text size="xs" c="dimmed">
              Powered by:
            </Text>
            <Anchor
              href="https://jikan.moe/"
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              c="dimmed"
              underline="hover"
            >
              Jikan API
            </Anchor>
            <Text size="xs" c="dimmed">•</Text>
            <Anchor
              href="https://anilist.co/"
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              c="dimmed"
              underline="hover"
            >
              AniList
            </Anchor>
            <Text size="xs" c="dimmed">•</Text>
            <Anchor
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              c="dimmed"
              underline="hover"
            >
              Google Gemini
            </Anchor>
            <Text size="xs" c="dimmed">•</Text>
            <Anchor
              href="https://mymemory.translated.net/"
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              c="dimmed"
              underline="hover"
            >
              MyMemory
            </Anchor>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}

