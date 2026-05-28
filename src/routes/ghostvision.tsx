import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { MemoryField } from "@/components/ghost/MemoryField";
import { ReactiveOrb } from "@/components/ghost/ReactiveOrb";
import { founderCheck, founderStats, founderListUsers } from "@/lib/ghost-admin.functions";

export const Route = createFileRoute("/ghostvision")({
  head: () => ({
    meta: [
      { title: "GhostLayer · VISION" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: GhostVision,
});

function GhostVision() {
  const navigate = useNavigate();
  const check = useServerFn(founderCheck);
  const getStats = useServerFn(founderStats);
  const listUsers = useServerFn(founderListUsers);
  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [stats, setStats] = useState<Awaited<ReturnType<typeof founderStats>> | null>(null);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate({ to: "/login" }); return; }
      try {
        const r = await check();
        if (!r.ok) { setStatus("denied"); return; }
        setStatus("ok");
        const [s, u] = await Promise.all([getStats(), listUsers()]);
        setStats(s); setUserCount(u.users.length);
      } catch { setStatus("denied"); }
    })();
  }, [check, getStats, listUsers, navigate]);

  if (status === "checking") {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-foreground">
        <MemoryField />
        <div className="font-mono text-xs tracking-[0.4em] text-[var(--violet)] animate-pulse">FOCUSING VISION…</div>
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

  const emotions = Object.entries(stats?.emotionCounts ?? {}).sort((a, b) => b[1] - a[1]);
  const total = emotions.reduce((s, [, v]) => s + v, 0) || 1;

  return (
    <div className="relative min-h-screen text-foreground">
      <MemoryField />
      <main className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--violet)]">founder · vision</div>
            <h1 className="mt-2 text-4xl md:text-5xl font-display font-semibold tracking-tighter">
              Emotional drift <span className="text-aurora">across the layer.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Live snapshot of what every awakened mind has been feeling in the last hour.
            </p>
          </div>
          <ReactiveOrb state="thinking" size={120} />
        </div>

        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Awakened minds", userCount],
            ["Signals · 1h", stats?.promptsLastHour ?? 0],
            ["Total memories", stats?.memories ?? 0],
            ["Conversations", stats?.conversations ?? 0],
          ].map(([k, v]) => (
            <div key={k as string} className="glass rounded-2xl p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">{k as string}</div>
              <div className="mt-2 text-2xl font-display font-semibold">{String(v)}</div>
            </div>
          ))}
        </section>

        <section className="mt-10 glass rounded-3xl p-7">
          <h2 className="text-lg font-display font-semibold">Emotional distribution · last hour</h2>
          <div className="mt-6 space-y-4">
            {emotions.length === 0 && <div className="text-xs font-mono text-muted-foreground">no signals yet</div>}
            {emotions.map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs font-mono">
                  <span className="uppercase tracking-widest text-muted-foreground">{k}</span>
                  <span className="text-[var(--neon)]">{v}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full transition-all duration-700" style={{ width: `${(v / total) * 100}%`, background: "var(--gradient-aurora)" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}