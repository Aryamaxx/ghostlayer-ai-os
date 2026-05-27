import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/ghost/Nav";
import { AwakeningHero } from "@/components/ghost/AwakeningHero";
import { Features } from "@/components/ghost/Features";
import { ParallelFutures } from "@/components/ghost/ParallelFutures";
import { GhostMemories } from "@/components/ghost/GhostMemories";
import { Testimonials } from "@/components/ghost/Testimonials";
import { Waitlist } from "@/components/ghost/Waitlist";
import { Footer } from "@/components/ghost/Footer";
import { Orb } from "@/components/ghost/Orb";
import { MemoryField } from "@/components/ghost/MemoryField";
import { BroadcastBanner } from "@/components/ghost/BroadcastBanner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen text-foreground overflow-x-hidden">
      <MemoryField />
      <Nav />
      <BroadcastBanner />
      <AwakeningHero />
      <Features />
      <ParallelFutures />
      <GhostMemories />
      <Testimonials />
      <Waitlist />
      <Footer />
      <Orb />
    </main>
  );
}
