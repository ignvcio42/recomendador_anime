import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AniReko",
  description: "Sistema de recomendación de anime con múltiples métodos",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable}`}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        style={{
          background: "linear-gradient(180deg, #f8f9ff 0%, #fff5f7 100%)",
          minHeight: "100vh",
        }}
      >
        <TRPCReactProvider>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
