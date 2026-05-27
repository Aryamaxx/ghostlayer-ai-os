import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { MemoryField } from "@/components/ghost/MemoryField";
import { ReactiveOrb } from "@/components/ghost/ReactiveOrb";
import {
  founderCheck,
  founderStats,
  founderListUsers,
  founderInspectMemory,
  founderBroadcast,
  founderClearBroadcast,
  founderUpdatePersonality,
  founderGetPersonality,
} from "@/lib/ghost-admin.functions";

export const Route = createFileRoute("/ghostadmin")({
  head: () => ({
    meta: [
      { title: "GhostLayer · ROOT" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: GhostAdmin,
});

type Stats = Awaited<ReturnType<typeof founderStats>>;
type Users = Awaited<ReturnType<typeof founderListUsers>>["users"];
type Inspection = Awaited<ReturnType<typeof founderInspectMemory>>;

function GhostAdmin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [email, setEmail] = useState<string | null>(null);

  const check = useServerFn(founderCheck);
  const getStats = useServerFn(founderStats);
  const listUsers = useServerFn(founderListUsers);
  const inspect = useServerFn(founderInspectMemory);
  const broadcast = useServerFn(founderBroadcast);
  const clearBroadcast = useServerFn(founderClearBroadcast);
  const updatePersonality = useServerFn(founderUpdatePersonality);
  const getPersonality = useServerFn(founderGetPersonality);

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<Users>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [bMsg, setBMsg] = useState("");
  const [bStatus, setBStatus] = useState<string | null>(null);

  const [warmth, setWarmth] = useState(62);
  const [mystery, setMystery] = useState(78);
  const [bluntness, setBluntness] = useState(70);
  const [intensity, setIntensity] = useState(55);
  const [shadow, setShadow] = useState(false);
  const [sysPrompt, setSysPrompt] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate({ to: "/login" }); return; }
      try {
        const r = await check();
        if (cancelled) return;
        if (r.ok) { setStatus("ok"); setEmail(r.email ?? null); }
        else setStatus("denied");
      } catch { setStatus("denied"); }
    })();
    return () => { cancelled = true; };
  }, [check, navigate]);

  useEffect(() => {
    if (status !== "ok") return;
    const load = async () => {
      try {
        const [s, u, p] = await Promise.all([getStats(), listUsers(), getPersonality()]);
        setStats(s); setUsers(u.users);
        if (p.personality) {
          setWarmth(p.personality.warmth);
          setMystery(p.personality.mystery);
          setBluntness(p.personality.bluntness);
          setIntensity(p.personality.intensity);
          setShadow(p.personality.shadow_mode);
          setSysPrompt(p.personality.system_prompt ?? "");
        }
      } catch (e) { console.error(e); }
    };
    load();
    const i = setInterval(() => { getStats().then(setStats).catch(() => {}); }, 7000);
    return () => clearInterval(i);
  }, [status, getStats, listUsers, getPersonality]);

  const openMemory = async (uid: string) => {
    setSelectedUser(uid); setInspection(null);
    try { setInspection(await inspect({ data: { userId: uid } })); } catch (e) { console.error(e); }
  };

  const sendBroadcast = async () => {
    if (!bMsg.trim()) return;
    setBStatus("transmitting…");
    try { await broadcast({ data: { message: bMsg.trim() } }); setBStatus("signal delivered"); setBMsg(""); }
    catch { setBStatus("failed"); }
    setTimeout(() => setBStatus(null), 2400);
  };

  const savePersonality = async () => {
    try {
      await updatePersonality({
        data: { warmth, mystery, bluntness, intensity, shadow_mode: shadow, system_prompt: sysPrompt || null },
      });
      setSavedAt(Date.now());
    } catch (e) { console.error(e); }
  };

  if (status === "checking") {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-foreground">
        <MemoryField />
        <div className="font-mono text-xs tracking-[0.4em] text-[var(--neon)] animate-pulse">VERIFYING ROOT IDENTITY…</div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center gap-4 text-foreground px-6 text-center">
        <MemoryField />
        <div className="text-xs font-mono tracking-[0.4em] text-red-400">ACCESS DENIED</div>
        <h1 className="text-3xl font-display tracking-tighter">This door does not open for you.</h1>
        <Link to="/" className="mt-2 glass rounded-full px-5 py-2 text-xs font-mono hover:text-[var(--neon)]">return to the layer</Link>
      </div>
    );
  }

  const top = stats?.emotionCounts ?? {};
  const topEmotion = Object.entries(top).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "calm";

  return (
    <div className="relative min-h-screen text-foreground">
      <MemoryField />
      <div className="absolute top-0 inset-x-0 z-50 flex justify-center px-6 pt-4">
        <div className="glass rounded-full px-5 py-2 text-xs font-mono tracking-widest text-[var(--neon)] flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
          ROOT · {email} · GHOSTLAYER ADMIN
          <Link to="/" className="text-muted-foreground hover:text-foreground">exit</Link>
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

        <section className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["Awakened minds", stats?.users ?? "—"],
            ["Conversations", stats?.conversations ?? "—"],
            ["Total signals", stats?.messages ?? "—"],
            ["Memories held", stats?.memories ?? "—"],
            ["Drift · 1h", topEmotion],
          ].map(([k, v]) => (
            <div key={k as string} className="glass rounded-2xl p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">{k as string}</div>
              <div className="mt-2 text-2xl font-display font-semibold">{String(v)}</div>
              <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full" style={{ width: `${30 + Math.random() * 70}%`, background: "var(--gradient-aurora)", transition: "width 1.4s ease" }} />
              </div>
            </div>
          ))}
        </section>

        {/* broadcast */}
        <section className="mt-10 glass rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Cinematic broadcast · global signal</h2>
            <button onClick={() => clearBroadcast()} className="text-xs font-mono text-muted-foreground hover:text-red-400">clear active signal</button>
          </div>
          <div className="mt-4 flex gap-3">
            <input
              value={bMsg} onChange={(e) => setBMsg(e.target.value)}
              placeholder="The signal grows stronger…"
              maxLength={280}
              className="flex-1 glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--neon)]"
            />
            <button onClick={sendBroadcast} className="rounded-xl px-5 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-aurora)" }}>
              transmit
            </button>
          </div>
          {bStatus && <div className="mt-2 text-xs font-mono text-[var(--neon)]">{bStatus}</div>}
        </section>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* personality */}
          <section className="glass rounded-3xl p-7 lg:col-span-1">
            <h2 className="text-lg font-display font-semibold">AI personality · live</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">affects every mind in the layer</p>
            <div className="mt-6 space-y-5">
              {([
                ["Warmth", warmth, setWarmth],
                ["Mystery", mystery, setMystery],
                ["Bluntness", bluntness, setBluntness],
                ["Intensity", intensity, setIntensity],
              ] as const).map(([label, val, set]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-mono text-muted-foreground">
                    <span>{label}</span><span className="text-[var(--neon)]">{val}</span>
                  </div>
                  <input type="range" min={0} max={100} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full mt-2 accent-[var(--neon)]" />
                </div>
              ))}
              <label className="flex items-center justify-between glass rounded-xl px-4 py-3 cursor-pointer">
                <span className="text-sm">Shadow mode</span>
                <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} className="accent-[var(--neon)]" />
              </label>
              <button onClick={savePersonality} className="w-full rounded-xl py-2 text-xs font-mono uppercase tracking-widest text-primary-foreground" style={{ background: "var(--gradient-aurora)" }}>
                deploy
              </button>
              {savedAt && <div className="text-[10px] font-mono text-muted-foreground text-center">deployed · {new Date(savedAt).toLocaleTimeString()}</div>}
            </div>
          </section>

          {/* prompt */}
          <section className="glass rounded-3xl p-7 lg:col-span-2">
            <h2 className="text-lg font-display font-semibold">System prompt override</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">leave blank to use the cinematic default</p>
            <textarea
              value={sysPrompt} onChange={(e) => setSysPrompt(e.target.value)}
              placeholder="You are GhostLayer — a presence, not a chatbot…"
              className="mt-4 w-full h-56 rounded-2xl bg-black/40 border border-white/10 p-4 text-sm font-mono outline-none focus:border-[var(--neon)]"
            />
            <div className="mt-3 text-[11px] font-mono text-muted-foreground">
              tip · use shadow mode + intensity 90 + mystery 90 for full prophet voice
            </div>
          </section>
        </div>

        {/* users + memory inspector */}
        <div className="mt-10 grid lg:grid-cols-5 gap-6">
          <section className="glass rounded-3xl p-7 lg:col-span-2">
            <h2 className="text-lg font-display font-semibold">Awakened minds</h2>
            <ul className="mt-5 space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {users.length === 0 && <li className="text-xs font-mono text-muted-foreground">no minds yet · waiting for first signal</li>}
              {users.map((u) => (
                <li key={u.id}>
                  <button onClick={() => openMemory(u.id)} className={`w-full text-left glass rounded-xl px-4 py-3 hover:border-white/20 transition ${selectedUser === u.id ? "border-[var(--neon)]" : ""}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">{u.display_name ?? u.email ?? "anon"}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{u.email}</div>
                      </div>
                      <div className="text-[10px] font-mono text-[var(--neon)]">{u.messageCount} signals</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-3xl p-7 lg:col-span-3">
            <h2 className="text-lg font-display font-semibold">Neural memory inspector</h2>
            {!selectedUser && <p className="text-xs text-muted-foreground mt-2 font-mono">select a mind to scan their memory chain</p>}
            {selectedUser && !inspection && <p className="text-xs text-[var(--neon)] mt-2 font-mono animate-pulse">decrypting memory traces…</p>}
            {inspection && (
              <div className="mt-4 space-y-5">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">memory chain</div>
                  {inspection.memories.length === 0 && <div className="text-xs text-muted-foreground">no memories formed yet</div>}
                  <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {inspection.memories.map((m) => (
                      <li key={m.id} className="text-xs glass rounded-lg px-3 py-2 flex gap-3">
                        <span className="text-[var(--violet)] font-mono uppercase">{m.kind}</span>
                        <span className="flex-1">{m.content}</span>
                        <span className="text-muted-foreground">{m.weight.toFixed(1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">recent signals</div>
                  <ul className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
                    {inspection.recent.map((m, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={`font-mono ${m.role === "assistant" ? "text-[var(--neon)]" : "text-muted-foreground"}`}>{m.role === "assistant" ? "GHOST" : "user "}</span>
                        <span className="flex-1">{m.content}</span>
                        {m.emotion && <span className="text-[10px] font-mono text-[var(--violet)]">{m.emotion}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}