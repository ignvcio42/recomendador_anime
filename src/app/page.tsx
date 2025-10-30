"use client";

import { Container, Stack, Tabs, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSparkles, IconMoodHeart, IconStars, IconRobot } from "@tabler/icons-react";
import { RandomAnime } from "./_components/random-anime";
import { MoodRecommendation } from "./_components/mood-recommendation";
import { SimilarRecommendation } from "./_components/similar-recommendation";
import { AIRecommendation } from "./_components/ai-recommendation";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default function HomePage() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <>
      <Navbar />
      
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Tabs 
            defaultValue="random" 
            variant="pills" 
            radius="xl"
          >
            <Tabs.List
              style={{
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                borderRadius: "1rem",
                border: "2px solid rgba(118, 75, 162, 0.2)",
                display: "flex",
                gap: isMobile ? "0.5rem" : "0.75rem",
                width: "100%",
              }}
            >
              <Tabs.Tab
                value="random"
                leftSection={<IconSparkles size={isMobile ? 16 : 18} />}
                style={{
                  transition: "all 0.3s ease",
                  fontSize: isMobile ? "0.7rem" : undefined,
                  padding: isMobile ? "0.5rem 0.25rem" : undefined,
                  flex: isMobile ? "1" : undefined,
                  minWidth: 0,
                  whiteSpace: isMobile ? "nowrap" : undefined,
                }}
              >
                Aleatorio
              </Tabs.Tab>

              <Tabs.Tab
                value="mood"
                leftSection={<IconMoodHeart size={isMobile ? 16 : 18} />}
                style={{
                  transition: "all 0.3s ease",
                  fontSize: isMobile ? "0.7rem" : undefined,
                  padding: isMobile ? "0.5rem 0.25rem" : undefined,
                  flex: isMobile ? "1" : undefined,
                  minWidth: 0,
                  whiteSpace: isMobile ? "nowrap" : undefined,
                }}
              >
                Ánimo
              </Tabs.Tab>

              <Tabs.Tab
                value="similar"
                leftSection={<IconStars size={isMobile ? 16 : 18} />}
                style={{
                  transition: "all 0.3s ease",
                  fontSize: isMobile ? "0.7rem" : undefined,
                  padding: isMobile ? "0.5rem 0.25rem" : undefined,
                  flex: isMobile ? "1" : undefined,
                  minWidth: 0,
                  whiteSpace: isMobile ? "nowrap" : undefined,
                }}
              >
                Favoritos
              </Tabs.Tab>

              <Tabs.Tab
                value="ai"
                leftSection={<IconRobot size={isMobile ? 16 : 18} />}
                style={{
                  transition: "all 0.3s ease",
                  fontSize: isMobile ? "0.7rem" : undefined,
                  padding: isMobile ? "0.5rem 0.25rem" : undefined,
                  flex: isMobile ? "1" : undefined,
                  minWidth: 0,
                  whiteSpace: isMobile ? "nowrap" : undefined,
                }}
              >
                IA
              </Tabs.Tab>
            </Tabs.List>

            {/* Random */}
            <Tabs.Panel value="random" pt="xl">
              <div
                style={{
                  animation: "fadeIn 0.5s ease-in",
                }}
              >
                <RandomAnime />
              </div>
            </Tabs.Panel>

            {/* Mood */}
            <Tabs.Panel value="mood" pt="xl">
              <div
                style={{
                  animation: "fadeIn 0.5s ease-in",
                }}
              >
                <MoodRecommendation />
              </div>
            </Tabs.Panel>

            {/* Similar */}
            <Tabs.Panel value="similar" pt="xl">
              <div
                style={{
                  animation: "fadeIn 0.5s ease-in",
                }}
              >
                <SimilarRecommendation />
              </div>
            </Tabs.Panel>

            {/* AI */}
            <Tabs.Panel value="ai" pt="xl">
              <div
                style={{
                  animation: "fadeIn 0.5s ease-in",
                }}
              >
                <AIRecommendation />
              </div>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .mantine-Card-root {
          transition: box-shadow 0.2s ease;
        }

        .mantine-Card-root:hover {
          box-shadow: 0 4px 12px rgba(118, 75, 162, 0.15) !important;
        }

        .mantine-Button-root {
          transition: all 0.2s ease;
        }

        .mantine-Button-root:hover {
          opacity: 0.9;
        }

        .mantine-Tabs-tab[data-active] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
        }

        .mantine-Tabs-tab {
          font-weight: 500;
        }

        .mantine-Tabs-tab:hover:not([data-active]) {
          background: rgba(118, 75, 162, 0.08);
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .mantine-Container-root {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }

          .mantine-Tabs-list {
            width: 100% !important;
            display: flex !important;
            justify-content: space-between !important;
          }

          .mantine-Tabs-tab {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: row !important;
            gap: 0.25rem !important;
          }

          .mantine-SimpleGrid-root {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
          }
        }

        @media (max-width: 480px) {
          .mantine-SimpleGrid-root {
            grid-template-columns: 1fr !important;
          }
          
          .mantine-Container-root {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
