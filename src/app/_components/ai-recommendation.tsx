"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Loader,
  Alert,
  Title,
  Textarea,
  Paper,
  ScrollArea,
  Avatar,
  Divider,
} from "@mantine/core";
import {
  IconSend,
  IconRobot,
  IconUser,
  IconAlertCircle,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { api } from "~/trpc/react";

/**
 * Tipo de mensaje en el chat
 */
type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

/**
 * Componente funcional para Fase 4: Recomendación con IA (Gemini)
 */
export function AIRecommendation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Mutation para enviar mensaje
  const chatMutation = api.anime.ai.chat.useMutation({
    onSuccess: (data) => {
      // Agregar respuesta de la IA
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => {
      // Agregar mensaje de error como respuesta
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    },
  });

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    const trimmed = inputMessage.trim();
    if (!trimmed || chatMutation.isPending) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Preparar historial para la IA (últimos 10 mensajes)
    const history = messages.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Enviar a la IA
    chatMutation.mutate({
      message: trimmed,
      history,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const isEmpty = messages.length === 0;

  return (
    <Stack gap="lg" h="calc(100vh - 300px)" style={{ minHeight: 500 }}>
      {/* Header con info */}
      <Paper p="md" radius="md" withBorder>
        <Group justify="space-between">
          <div>
            <Group gap="xs">
              <IconRobot size={24} />
              <Title order={4}>Asistente de Anime IA</Title>
              <Badge variant="light" color="purple">Gemini</Badge>
            </Group>
            <Text size="sm" c="dimmed" mt="xs">
              Pregunta lo que quieras sobre anime. Puedo recomendarte series similares, explicar estilos, y más.
            </Text>
          </div>
          {!isEmpty && (
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconTrash size={14} />}
              onClick={handleClearChat}
            >
              Limpiar chat
            </Button>
          )}
        </Group>
      </Paper>

      {/* Chat area */}
      <Card shadow="md" padding={0} radius="md" withBorder style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Messages */}
        <ScrollArea h="100%" p="md" ref={scrollAreaRef} style={{ flex: 1 }}>
          {isEmpty ? (
            // Empty state
            <Stack align="center" justify="center" h="100%" gap="md">
              <IconSparkles size={64} stroke={1.5} color="gray" opacity={0.5} />
              <div style={{ textAlign: "center" }}>
                <Title order={3} c="dimmed">
                  ¡Hola! Soy tu asistente de anime
                </Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Pregúntame lo que quieras sobre anime
                </Text>
              </div>
              <Stack gap="xs" mt="md">
                <Badge variant="light" color="violet">💬 &quot;Quiero algo con estética de Violet Evergarden&quot;</Badge>
                <Badge variant="light" color="blue">🔍 &quot;Animes similares a Death Note&quot;</Badge>
                <Badge variant="light" color="pink">✨ &quot;Recomiéndame un anime de acción con buena animación&quot;</Badge>
              </Stack>
            </Stack>
          ) : (
            // Messages list
            <Stack gap="md">
              {messages.map((message, index) => (
                <Group
                  key={index}
                  align="flex-start"
                  gap="sm"
                  style={{
                    flexDirection: message.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    color={message.role === "user" ? "blue" : "violet"}
                    radius="xl"
                    size="md"
                  >
                    {message.role === "user" ? (
                      <IconUser size={20} />
                    ) : (
                      <IconRobot size={20} />
                    )}
                  </Avatar>

                  <Paper
                    p="sm"
                    radius="md"
                    style={{
                      maxWidth: "75%",
                      backgroundColor:
                        message.role === "user"
                          ? "var(--mantine-color-blue-light)"
                          : "var(--mantine-color-violet-light)",
                    }}
                  >
                    <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                      {message.content}
                    </Text>
                    <Text size="xs" c="dimmed" mt="xs">
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </Paper>
                </Group>
              ))}

              {/* Loading indicator */}
              {chatMutation.isPending && (
                <Group align="flex-start" gap="sm">
                  <Avatar color="violet" radius="xl" size="md">
                    <IconRobot size={20} />
                  </Avatar>
                  <Paper p="sm" radius="md" style={{ backgroundColor: "var(--mantine-color-violet-light)" }}>
                    <Group gap="xs">
                      <Loader size="xs" />
                      <Text size="sm" c="dimmed">
                        Pensando...
                      </Text>
                    </Group>
                  </Paper>
                </Group>
              )}
            </Stack>
          )}
        </ScrollArea>

        <Divider />

        {/* Input area */}
        <Group p="md" gap="xs" wrap="nowrap">
          <Textarea
            placeholder="Escribe tu pregunta sobre anime..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            minRows={1}
            maxRows={4}
            autosize
            style={{ flex: 1 }}
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || chatMutation.isPending}
            leftSection={<IconSend size={18} />}
            variant="gradient"
            gradient={{ from: "violet", to: "purple" }}
          >
            Enviar
          </Button>
        </Group>
      </Card>

      {/* Info footer */}
      <Alert color="violet" variant="light" icon={<IconAlertCircle size={16} />}>
        <Text size="xs">
          <strong>Tip:</strong> Sé específico en tus preguntas. Puedes preguntar por géneros, estudios, directores, o describir lo que buscas.
        </Text>
      </Alert>
    </Stack>
  );
}
