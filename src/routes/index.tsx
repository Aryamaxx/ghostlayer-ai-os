import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/ghost/Nav";
import { Hero } from "@/components/ghost/Hero";
import { Features } from "@/components/ghost/Features";
import { Timelines } from "@/components/ghost/Timelines";
import { Testimonials } from "@/components/ghost/Testimonials";
import { Waitlist } from "@/components/ghost/Waitlist";
import { Footer } from "@/components/ghost/Footer";
import { Orb } from "@/components/ghost/Orb";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Features />
      <Timelines />
      <Testimonials />
      <Waitlist />
      <Footer />
      <Orb />
    </main>
  );
}
