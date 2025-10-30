"use client";

import Link from "next/link";
import {
  ActionIcon,
  Anchor,
  Burger,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome2,
  IconWand,
  IconMoodSmile,
  IconGauge,
  IconSparkles,
} from "@tabler/icons-react";

export function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);

  const links = [
    { href: "/", label: "Inicio", icon: IconHome2 },
  ];

  return (
    <header
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-3)",
        background: "var(--mantine-color-body)",
      }}
    >
      <Container size="xl" py="sm">
        <Group justify="space-between" align="center">
          {/* Izquierda: Home (texto + icono) */}
          <Link href="/" aria-label="Ir al inicio" style={{ textDecoration: "none" }}>
            <Group gap={8}>
              <ActionIcon
                variant="transparent"
                aria-hidden="true"
                style={{ pointerEvents: "none" }}
              >
                <IconHome2 size={22} />
              </ActionIcon>
              <Text
                fw={600}
                style={{
                  letterSpacing: "0.2px",
                }}
              >
                AniReko
              </Text>
            </Group>
          </Link>

          {/* Desktop nav */}
          <Group visibleFrom="md" gap="lg">
            {links.slice(1).map(({ href, label }) => (
              <Anchor
                key={href}
                component={Link}
                href={href}
                underline="never"
                fz="sm"
                c="dimmed"
                style={{ fontWeight: 500 }}
              >
                {label}
              </Anchor>
            ))}
          </Group>

          {/* Mobile burger */}
          <Burger hiddenFrom="md" opened={opened} onClick={toggle} aria-label="Abrir menú" />
        </Group>
      </Container>

      {/* Sidebar (mobile) */}
      <Drawer
        opened={opened}
        onClose={close}
        padding="md"
        size="80%"
        position="right"
        title="Menú"
        overlayProps={{ opacity: 0.15, blur: 2 }}
        aria-label="Menú lateral"
      >
        <Stack gap="sm">
          {links.map(({ href, label, icon: Icon }) => (
            <Anchor
              key={href}
              component={Link}
              href={href}
              underline="never"
              onClick={close}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 8px",
                borderRadius: 10,
                border: "1px solid var(--mantine-color-gray-3)",
              }}
            >
              <Icon size={18} />
              <Text>{label}</Text>
            </Anchor>
          ))}
        </Stack>
      </Drawer>
    </header>
  );
}
