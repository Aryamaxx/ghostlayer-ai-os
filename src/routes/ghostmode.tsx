import { createFileRoute } from "@tanstack/react-router";
import { CinematicMode } from "@/components/ghost/CinematicMode";

export const Route = createFileRoute("/ghostmode")({
  head: () => ({
    meta: [
      { title: "GhostLayer · CINEMATIC" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <CinematicMode command="/ghostmode" />,
});