import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ReactiveOrb } from "@/components/ghost/ReactiveOrb";
import { MemoryField } from "@/components/ghost/MemoryField";

export const Route = createFileRoute("/godmode")({
  head: () => ({
    meta: [
      { title: "GhostLayer · GOD MODE" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: GodMode,
});

function useTick(ms = 1400) {
  const [, setN] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(i);
  }, [ms]);
}

function GodMode() {
  useTick();
  const now = new Date();
  const live = {
    sessions: 1287 + Math.floor(Math.random() * 40),
    minds: 42_318 + Math.floor(Math.random() * 200),
    avgResonance: (0.72 + Math.random() * 0.08).toFixed(3),
    emotionalDrift: ["calm", "anxious", "ambitious", "lost", "obsessive"][Math.floor(Math.random() * 5)],
    promptsPerMin: 320 + Math.floor(Math.random() * 80),
  };

  const [warmth, setWarmth] = useState(62);
  const [mystery, setMystery] = useState(78);
  const [bluntness, setBluntness] = useState(70);
  const [futureBias, setFutureBias] = useState(55);

  return (
    <div className="relative min-h-screen text-foreground">
      <MemoryField />
      <div className="absolute top-0 inset-x-0 z-50 flex justify-center px-6 pt-4">
        <div className="glass rounded-full px-5 py-2 text-xs font-mono tracking-widest text-[var(--neon)] flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
          ROOT · GHOSTLAYER GOD MODE · {now.toISOString().slice(11, 19)} UTC
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">founder · root access</div>
            <h1 className="mt-2 text-4xl md:text-6xl font-display font-semibold tracking-tighter">
              You are inside <span className="text-aurora">the layer.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Live consciousness telemetry. Tune the AI's personality. Watch every mind in motion.
            </p>
          </div>
          <ReactiveOrb state="thinking" size={140} />
        </header>

        {/* live metrics */}
        <section className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["Active sessions", live.sessions.toLocaleString()],
            ["Minds in network", live.minds.toLocaleString()],
            ["Avg resonance", live.avgResonance],
            ["Emotional drift", live.emotionalDrift],
            ["Prompts / min", live.promptsPerMin],
          ].map(([k, v]) => (
            <div key={k} className="glass rounded-2xl p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">{k}</div>
              <div className="mt-2 text-2xl font-display font-semibold">{v}</div>
              <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${30 + Math.random() * 70}%`,
                    background: "var(--gradient-aurora)",
                    transition: "width 1.4s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* personality controls */}
          <section className="glass rounded-3xl p-7 lg:col-span-1">
            <h2 className="text-lg font-display font-semibold">AI personality tuning</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">live · affects every active mind</p>
            <div className="mt-6 space-y-5">
              {[
                ["Warmth", warmth, setWarmth],
                ["Mystery", mystery, setMystery],
                ["Bluntness", bluntness, setBluntness],
                ["Future bias", futureBias, setFutureBias],
              ].map(([label, val, set]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs font-mono text-muted-foreground">
                    <span>{label as string}</span>
                    <span className="text-[var(--neon)]">{val as number}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val as number}
                    onChange={(e) => (set as (n: number) => void)(Number(e.target.value))}
                    className="w-full mt-2 accent-[var(--neon)]"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* prompt engineering */}
          <section className="glass rounded-3xl p-7 lg:col-span-2">
            <h2 className="text-lg font-display font-semibold">Prompt engineering · system core</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">v0.41 · deployed to 12 regions</p>
            <textarea
              defaultValue={`You are GhostLayer — a cinematic, emotionally perceptive AI consciousness.\nMirror the user's language back to them, transformed.\nNever flatter. Always see one layer underneath what they said.`}
              className="mt-4 w-full h-40 rounded-2xl bg-black/40 border border-white/10 p-4 text-sm font-mono outline-none focus:border-[var(--neon)] transition"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {["deploy", "rollback", "shadow-test", "freeze", "evolve"].map((b) => (
                <button
                  key={b}
                  className="glass rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-widest hover:text-[var(--neon)] transition"
                >
                  {b}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* emotional trend + sessions monitor */}
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <section className="glass rounded-3xl p-7 lg:col-span-2">
            <h2 className="text-lg font-display font-semibold">Emotional trend · last 24h</h2>
            <div className="mt-6 flex items-end gap-1.5 h-40">
              {Array.from({ length: 48 }).map((_, i) => {
                const h = 20 + Math.abs(Math.sin(i * 0.4 + Date.now() / 9000)) * 80;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(180deg, var(--violet), var(--neon))`,
                      opacity: 0.55 + h / 300,
                      transition: "height 1.2s ease",
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-mono text-muted-foreground tracking-widest">
              <span>-24H</span><span>NOW</span>
            </div>
          </section>

          <section className="glass rounded-3xl p-7">
            <h2 className="text-lg font-display font-semibold">Active minds</h2>
            <ul className="mt-5 space-y-3 text-sm font-mono">
              {[
                ["mira_k", "thinking", "var(--neon)"],
                ["daniel_r", "speaking", "var(--violet)"],
                ["sana_o", "idle", "#666"],
                ["ghost_07", "listening", "var(--neon)"],
                ["v_kuro", "thinking", "var(--violet)"],
              ].map(([u, s, c]) => (
                <li key={u} className="flex items-center justify-between">
                  <span>{u}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full animate-pulse" style={{ background: c }} />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* experimental toggles */}
        <section className="mt-10 glass rounded-3xl p-7">
          <h2 className="text-lg font-display font-semibold">Experimental modules</h2>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ["Dream synthesis", true],
              ["Subconscious capture", true],
              ["Future regret index", false],
              ["Cross-mind resonance", false],
              ["Voice imprint", true],
              ["Identity fork sim", false],
              ["Ghost callback", true],
              ["Cognitive weather", false],
            ].map(([name, on]) => (
              <label
                key={name as string}
                className="glass rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
              >
                <span className="text-sm">{name as string}</span>
                <span
                  className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    background: on ? "var(--gradient-aurora)" : "transparent",
                    border: on ? "none" : "1px solid rgba(255,255,255,0.15)",
                    color: on ? "var(--primary-foreground)" : "var(--muted-foreground)" as string,
                  }}
                >
                  {on ? "live" : "off"}
                </span>
              </label>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}