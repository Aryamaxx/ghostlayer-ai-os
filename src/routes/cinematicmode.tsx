import { createFileRoute } from "@tanstack/react-router";
import { CinematicMode } from "@/components/ghost/CinematicMode";

export const Route = createFileRoute("/cinematicmode")({
  head: () => ({
    meta: [
      { title: "GhostLayer · CINEMATIC" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <CinematicMode command="/cinematicmode" />,
});