"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({
  /** Tu tema personalizado aquí */
  primaryColor: "blue",
  fontFamily: "var(--font-geist-sans), sans-serif",
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}

