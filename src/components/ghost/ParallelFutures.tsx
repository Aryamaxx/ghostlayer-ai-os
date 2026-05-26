import { useState } from "react";
import { SectionHeader } from "./Features";

const SCENARIOS = [
  {
    q: "Build an AI startup vs. become a creator?",
    a: {
      label: "Future A — AI Startup",
      income: "$190K / yr (yr 2)",
      emotion: "Focused · isolated",
      lifestyle: "Async, deep, founder-coded",
      burnout: "38%",
      growth: "Exponential",
      consistency: "Async deep work",
      color: "var(--neon)",
    },
    b: {
      label: "Future B — Creator",
      income: "$48K / yr (yr 1)",
      emotion: "Energized · exposed",
      lifestyle: "Public, performative",
      burnout: "61%",
      growth: "Compounding audience",
      consistency: "5x/week, on-camera",
      color: "var(--violet)",
    },
  },
  {
    q: "Stay in the job vs. go all in solo?",
    a: {
      label: "Future A — Stay",
      income: "$140K (steady)",
      emotion: "Safe · slowly numb",
      lifestyle: "Predictable",
      burnout: "27%",
      growth: "Linear",
      consistency: "9-5",
      color: "var(--neon)",
    },
    b: {
      label: "Future B — Solo",
      income: "$0 → $260K (yr 3)",
      emotion: "Alive · terrified",
      lifestyle: "Unstructured, intense",
      burnout: "54%",
      growth: "Power-law",
      consistency: "Self-imposed",
      color: "var(--violet)",
    },
  },
];

export function ParallelFutures() {
  const [idx, setIdx] = useState(0);
  const s = SCENARIOS[idx];

  return (
    <section id="timelines" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Parallel futures"
          title={<>Simulate every <span className="text-aurora">version of you.</span></>}
          sub="Ask the question. GhostLayer forks reality and shows what each path actually costs — in money, in emotion, in self."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {SCENARIOS.map((sc, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`glass rounded-full px-4 py-2 text-xs md:text-sm transition ${
                i === idx ? "text-foreground border-white/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sc.q}
            </button>
          ))}
        </div>

        <div className="relative mt-10 glass rounded-3xl p-6 md:p-10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: "var(--gradient-glow)" }}
          />
          <div className="relative z-10">
            <div className="glass rounded-2xl px-5 py-4 max-w-2xl mx-auto text-center">
              <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Prompt</span>
              <p className="mt-1 text-lg">"{s.q}"</p>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {[s.a, s.b].map((b) => (
                <article
                  key={b.label}
                  className="glass rounded-2xl p-6 relative overflow-hidden group"
                  style={{ animation: "rise-in 0.6s ease both" }}
                >
                  <div
                    className="absolute -inset-px rounded-2xl opacity-40 pointer-events-none group-hover:opacity-70 transition"
                    style={{ boxShadow: `inset 0 0 80px ${b.color}` }}
                  />
                  <div
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
                    style={{ color: b.color }}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: b.color }} />
                    {b.label}
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      ["Projected income", b.income],
                      ["Emotional state", b.emotion],
                      ["Lifestyle", b.lifestyle],
                      ["Burnout probability", b.burnout],
                      ["Growth trajectory", b.growth],
                      ["Consistency required", b.consistency],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                        <dd className="mt-0.5 text-base font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}