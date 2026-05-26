const features = [
  {
    id: "memory",
    title: "Memory Vault",
    desc: "Drop in voice notes, screenshots, tweets, links, half-formed ideas. GhostLayer tags, summarizes, and weaves them into a living graph of you.",
    tag: "01 / Capture",
  },
  {
    id: "search",
    title: "Future Memory Search",
    desc: "Ask in plain language. “What was that AI trading idea I had last spring?” — and watch it reconstruct the moment with notes, links, and emotion.",
    tag: "02 / Recall",
  },
  {
    id: "identity",
    title: "AI Identity Model",
    desc: "It learns how you think — your taste, rhythms, ambitions — and quietly bends the interface, the suggestions, and the workflows around you.",
    tag: "03 / Evolve",
  },
  {
    id: "creator",
    title: "Creator Mode",
    desc: "Voice notes turn into scripts. Trends turn into calendars. Forgotten ideas resurface the day you finally need them.",
    tag: "04 / Create",
  },
  {
    id: "insights",
    title: "Daily Insights",
    desc: "Every morning, a quiet briefing: behavior patterns, emotional drift, missed opportunities, and the business idea hiding in your week.",
    tag: "05 / Reflect",
  },
  {
    id: "orb",
    title: "Ambient Orb",
    desc: "A floating presence across your devices — always listening when invited, always summoned in one breath.",
    tag: "06 / Companion",
  },
];

export function Features() {
  return (
    <section id="memory" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="The layer"
          title={<>Six systems. <span className="text-aurora">One mind.</span></>}
          sub="GhostLayer isn’t an app. It’s an operating system for everything you’ve ever almost remembered."
        />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <article
              key={f.id}
              id={f.id}
              className="group relative glass rounded-3xl p-7 overflow-hidden transition hover:-translate-y-1 hover:border-white/20"
              style={{ animation: `rise-in 0.7s ease ${i * 0.05}s both` }}
            >
              <div
                className="absolute -top-24 -right-24 size-56 rounded-full opacity-0 group-hover:opacity-60 transition duration-700 blur-3xl pointer-events-none"
                style={{ background: "var(--gradient-aurora)" }}
              />
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{f.tag}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--neon)]">
                <span className="size-1.5 rounded-full bg-[var(--neon)]" />
                Active in beta
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</div>
      <h2 className="mt-4 text-4xl md:text-6xl font-display font-semibold tracking-tighter leading-[1.02]">
        {title}
      </h2>
      <p className="mt-5 text-lg text-muted-foreground">{sub}</p>
    </div>
  );
}