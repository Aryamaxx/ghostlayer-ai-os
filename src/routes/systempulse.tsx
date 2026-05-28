import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { MemoryField } from "@/components/ghost/MemoryField";
import { ReactiveOrb } from "@/components/ghost/ReactiveOrb";
import { founderCheck, founderStats } from "@/lib/ghost-admin.functions";

export const Route = createFileRoute("/systempulse")({
  head: () => ({
    meta: [
      { title: "GhostLayer · PULSE" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SystemPulse,
});

type Stats = Awaited<ReturnType<typeof founderStats>>;

function SystemPulse() {
  const navigate = useNavigate();
  const check = useServerFn(founderCheck);
  const getStats = useServerFn(founderStats);
  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [series, setSeries] = useState<{ t: number; v: number }[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate({ to: "/login" }); return; }
      try {
        const r = await check();
        if (!r.ok) { setStatus("denied"); return; }
        setStatus("ok");
      } catch { setStatus("denied"); }
    })();
  }, [check, navigate]);

  useEffect(() => {
    if (status !== "ok") return;
    const tick = async () => {
      try {
        const s = await getStats();
        setStats(s);
        setSeries((prev) => [...prev.slice(-29), { t: Date.now(), v: s.promptsLastHour }]);
      } catch {}
    };
    tick();
    const i = setInterval(tick, 5000);
    return () => clearInterval(i);
  }, [status, getStats]);

  if (status === "checking") {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-foreground">
        <MemoryField />
        <div className="font-mono text-xs tracking-[0.4em] text-[var(--neon)] animate-pulse">SYNCING PULSE…</div>
      </div>
    );
  }
  if (status === "denied") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center gap-3 text-foreground px-6 text-center">
        <MemoryField />
        <div className="text-xs font-mono tracking-[0.4em] text-red-400">ACCESS DENIED</div>
        <Link to="/" className="glass rounded-full px-5 py-2 text-xs font-mono hover:text-[var(--neon)]">return</Link>
      </div>
    );
  }

  const max = Math.max(1, ...series.map((p) => p.v));

  return (
    <div className="relative min-h-screen text-foreground">
      <MemoryField />
      <main className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--neon)]">founder · pulse</div>
            <h1 className="mt-2 text-4xl md:text-5xl font-display font-semibold tracking-tighter">
              The layer is <span className="text-aurora">breathing.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">Live signal flow. Refreshes every 5 seconds.</p>
          </div>
          <ReactiveOrb state="listening" size={120} />
        </div>

        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Awakened", stats?.users ?? 0],
            ["Live signals", stats?.promptsLastHour ?? 0],
            ["Total messages", stats?.messages ?? 0],
            ["Memories", stats?.memories ?? 0],
          ].map(([k, v]) => (
            <div key={k as string} className="glass rounded-2xl p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">{k as string}</div>
              <div className="mt-2 text-2xl font-display font-semibold">{String(v)}</div>
            </div>
          ))}
        </section>

        <section className="mt-10 glass rounded-3xl p-7">
          <h2 className="text-lg font-display font-semibold">Signal cardiogram</h2>
          <div className="mt-6 relative h-48 w-full">
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="pulseFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {series.length > 1 && (() => {
                const pts = series.map((p, i) => {
                  const x = (i / (series.length - 1)) * 600;
                  const y = 200 - (p.v / max) * 180 - 10;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                });
                const line = `M ${pts.join(" L ")}`;
                const fill = `${line} L 600,200 L 0,200 Z`;
                return (
                  <>
                    <path d={fill} fill="url(#pulseFill)" />
                    <path d={line} fill="none" stroke="var(--neon)" strokeWidth="2" />
                  </>
                );
              })()}
            </svg>
            {series.length < 2 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-muted-foreground">listening for signals…</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}