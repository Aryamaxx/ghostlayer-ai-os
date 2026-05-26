import { SectionHeader } from "./Features";

const MEMORIES = [
  {
    when: "3 months ago",
    note: "You wanted to start an AI trading channel. You wrote 4 scripts. You shipped none.",
    tag: "abandoned · high signal",
  },
  {
    when: "11 weeks ago",
    note: "You almost reached out to the founder of the company you keep mentioning.",
    tag: "unsent · still warm",
  },
  {
    when: "Last Tuesday",
    note: "You said 'this is the year' for the fourth time this year.",
    tag: "pattern detected",
  },
  {
    when: "Recurring",
    note: "Your strongest ideas come at 1:47am. You never finish them in the morning.",
    tag: "circadian leak",
  },
];

export function GhostMemories() {
  return (
    <section id="ghosts" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Ghost memories"
          title={<>The ideas you <span className="text-aurora">tried to forget.</span></>}
          sub="GhostLayer keeps everything you abandoned. It surfaces the right ghost on the right day — not the day you wanted, the day you needed."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {MEMORIES.map((m, i) => (
            <article
              key={i}
              className="relative glass rounded-3xl p-7 overflow-hidden group"
              style={{ animation: `rise-in 0.6s ease ${i * 0.06}s both` }}
            >
              <div
                className="absolute -top-20 -left-20 size-60 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                style={{ background: "var(--gradient-aurora)" }}
              />
              <div className="relative">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest">
                  <span className="text-muted-foreground">{m.when}</span>
                  <span className="text-[var(--violet)]">{m.tag}</span>
                </div>
                <p className="mt-4 text-xl leading-snug font-display">
                  "{m.note}"
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                  retrieved by ghostlayer · do you want to continue?
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}