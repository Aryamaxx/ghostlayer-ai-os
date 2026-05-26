import brain from "@/assets/ghost-brain.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[820px] rounded-full opacity-60 pointer-events-none"
        style={{ background: "var(--gradient-glow)", animation: "pulse-glow 6s ease-in-out infinite" }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground mb-8" style={{ animation: "rise-in 0.7s ease both" }}>
          <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
          A personal AI operating system · v0.1
        </div>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold leading-[0.95] tracking-tighter"
          style={{ animation: "rise-in 0.9s ease 0.05s both" }}
        >
          Your AI remembers
          <br />
          your life better
          <br />
          <span className="text-aurora">than you do.</span>
        </h1>
        <p
          className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          style={{ animation: "rise-in 1s ease 0.15s both" }}
        >
          GhostLayer is the second brain for the AI age — a consciousness layer that captures
          every thought, predicts your next move, and simulates your future timelines.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animation: "rise-in 1.1s ease 0.25s both" }}>
          <a
            href="#waitlist"
            className="group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition hover:scale-[1.02]"
            style={{ background: "var(--gradient-aurora)" }}
          >
            Enter the layer
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#demo"
            className="glass rounded-full px-6 py-3.5 text-sm font-medium text-foreground hover:bg-white/5 transition"
          >
            Watch the demo
          </a>
        </div>

        <div className="relative mt-20 mx-auto max-w-3xl" style={{ animation: "rise-in 1.3s ease 0.4s both" }}>
          <div className="absolute -inset-10 rounded-[40px] opacity-70 pointer-events-none blur-2xl" style={{ background: "var(--gradient-aurora)" }} />
          <div className="relative glass rounded-[28px] p-2 glow-violet">
            <div className="relative rounded-[22px] overflow-hidden aspect-[16/10] bg-black">
              <img
                src={brain}
                alt="GhostLayer AI brain visualization"
                className="size-full object-cover opacity-90"
                width={1536}
                height={1024}
                style={{ animation: "float-slow 9s ease-in-out infinite" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <Orbit />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Orbit() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative size-[70%]" style={{ animation: "spin-slow 40s linear infinite" }}>
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-[var(--neon)] glow-ring" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 size-2 rounded-full bg-[var(--violet)] glow-violet" />
      </div>
    </div>
  );
}