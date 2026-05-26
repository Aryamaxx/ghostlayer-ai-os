import timelines from "@/assets/ghost-timelines.jpg";
import { SectionHeader } from "./Features";

const branches = [
  {
    label: "Timeline A",
    title: "Build the YouTube channel",
    stats: [
      ["Revenue (12mo)", "$48K"],
      ["Stress", "High"],
      ["Consistency", "5x/week"],
      ["Growth probability", "62%"],
    ],
    color: "var(--neon)",
  },
  {
    label: "Timeline B",
    title: "Ship the AI SaaS",
    stats: [
      ["Revenue (12mo)", "$190K"],
      ["Stress", "Medium"],
      ["Consistency", "Async"],
      ["Growth probability", "74%"],
    ],
    color: "var(--violet)",
  },
];

export function Timelines() {
  return (
    <section id="timelines" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Parallel timelines"
          title={<>Simulate every <span className="text-aurora">version of you.</span></>}
          sub="Ask the question. GhostLayer forks reality and shows you what each path actually costs, in time, in money, in self."
        />

        <div className="relative mt-16 glass rounded-3xl p-6 md:p-10 overflow-hidden">
          <img
            src={timelines}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-30 pointer-events-none"
            width={1536}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background pointer-events-none" />

          <div className="relative z-10">
            <div className="glass rounded-2xl px-5 py-4 max-w-2xl mx-auto text-center">
              <span className="text-xs font-mono text-muted-foreground">Prompt</span>
              <p className="mt-1 text-lg">“Should I build a YouTube channel or an AI SaaS?”</p>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {branches.map((b) => (
                <div key={b.label} className="glass rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -inset-px rounded-2xl opacity-30 pointer-events-none" style={{ boxShadow: `inset 0 0 60px ${b.color}` }} />
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: b.color }}>
                    <span className="size-1.5 rounded-full" style={{ background: b.color }} />
                    {b.label}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{b.title}</h3>
                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                    {b.stats.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted-foreground">{k}</dt>
                        <dd className="mt-0.5 text-lg font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}