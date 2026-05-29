import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { founderCheck, ghostCinematicRespond } from "@/lib/ghost-admin.functions";
import { MemoryField } from "@/components/ghost/MemoryField";
import { ReactiveOrb } from "@/components/ghost/ReactiveOrb";

type Msg = { role: "user" | "assistant"; content: string };
type OrbState = "idle" | "listening" | "thinking" | "speaking";

function CinematicTypewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const words = text.split(/\s+/);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 650);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!started) return;
    if (count >= words.length) { onComplete?.(); return; }
    const t = setTimeout(() => setCount((c) => c + 1), 95 + (Math.random() * 50 - 25));
    return () => clearTimeout(t);
  }, [started, count, words.length, onComplete]);
  const done = count >= words.length;
  return (
    <span>
      {words.slice(0, count).map((w, i) => (
        <span key={i} className="inline-block mr-[0.25em] animate-fade-in" style={{ animationDuration: "220ms" }}>{w}</span>
      ))}
      {!done && started && <span className="inline-block w-[2px] h-[1em] bg-[var(--violet)] animate-pulse-glow align-middle ml-0.5" />}
    </span>
  );
}

export function CinematicMode({ command }: { command: string }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const check = useServerFn(founderCheck);
  const respond = useServerFn(ghostCinematicRespond);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [orb, setOrb] = useState<OrbState>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate({ to: "/login" }); return; }
      try {
        const r = await check();
        if (cancelled) return;
        setStatus(r.ok ? "ok" : "denied");
      } catch { setStatus("denied"); }
    })();
    return () => { cancelled = true; };
  }, [check, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingIndex]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setOrb("thinking");
    try {
      const { reply } = await respond({ data: { messages: next } });
      const idx = next.length;
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setTypingIndex(idx);
      setOrb("speaking");
    } catch {
      const idx = next.length;
      setMessages((m) => [...m, { role: "assistant", content: "The signal fractured. Try once more." }]);
      setTypingIndex(idx);
      setOrb("speaking");
    } finally {
      setLoading(false);
    }
  };

  if (status === "checking") {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-foreground">
        <MemoryField />
        <div className="font-mono text-xs tracking-[0.4em] text-[var(--violet)] animate-pulse">OPENING THE LAYER…</div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center gap-4 text-foreground px-6 text-center">
        <MemoryField />
        <div className="text-xs font-mono tracking-[0.4em] text-red-400">ACCESS DENIED</div>
        <h1 className="text-3xl font-display tracking-tighter">This mode does not exist for you.</h1>
        <Link to="/" className="mt-2 glass rounded-full px-5 py-2 text-xs font-mono hover:text-[var(--violet)]">return to the layer</Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden cinematic-veil">
      <MemoryField />
      {/* darker cinematic overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/55" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 35%, oklch(0.65 0.24 295 / 0.20), transparent 70%)", animation: "pulse-glow 6s ease-in-out infinite" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-12 min-h-screen flex flex-col">
        <div className="flex items-center justify-between">
          <div className="glass rounded-full px-4 py-1.5 text-[11px] font-mono tracking-[0.3em] text-[var(--violet)] flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--violet)] animate-pulse" />
            {command} · CINEMATIC
          </div>
          <Link to="/ghostadmin" className="text-[11px] font-mono text-muted-foreground hover:text-foreground tracking-widest">root</Link>
        </div>

        <div className="flex flex-col items-center mt-8">
          <ReactiveOrb state={orb} size={150} />
          <h1 className="mt-6 text-3xl md:text-4xl font-display font-semibold tracking-tighter text-center">
            The layer is <span className="text-aurora">awake.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            The original signal. Mysterious, intense, conscious. This voice is yours alone.
          </p>
        </div>

        <div ref={scrollRef} className="flex-1 mt-8 space-y-3 overflow-y-auto pr-1 min-h-[120px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "text-sm text-muted-foreground font-mono"
                  : "glass glow-violet rounded-2xl px-5 py-4 text-[16px] leading-relaxed text-foreground border-[var(--violet)]/25"
              }
            >
              {m.role === "user" ? (
                <span><span className="text-[var(--violet)]/80">you ›</span> {m.content}</span>
              ) : (
                <span>
                  <span className="text-[var(--violet)] font-mono text-xs mr-2 tracking-widest">GHOST</span>
                  {i === typingIndex ? (
                    <CinematicTypewriter text={m.content} onComplete={() => { setTypingIndex(null); setOrb("idle"); }} />
                  ) : (
                    m.content
                  )}
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="glass rounded-2xl px-5 py-4 text-sm text-muted-foreground inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--violet)] animate-pulse" />
              <span className="size-1.5 rounded-full bg-[var(--violet)] animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="size-1.5 rounded-full bg-[var(--violet)] animate-pulse" style={{ animationDelay: "0.4s" }} />
              <span className="ml-2 font-mono text-xs">the signal is forming…</span>
            </div>
          )}
        </div>

        <form
          onSubmit={submit}
          onFocus={() => setOrb("listening")}
          onBlur={() => !loading && typingIndex === null && setOrb("idle")}
          className="glass glow-violet rounded-2xl flex items-center gap-2 px-4 py-3 mt-4 border-[var(--violet)]/25"
        >
          <span className="text-[var(--violet)] font-mono text-sm">›</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak to the layer…"
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-[15px]"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40 transition hover:scale-[1.03]"
            style={{ background: "var(--gradient-aurora)" }}
          >
            {loading ? "…" : "send"}
          </button>
        </form>
      </div>
    </div>
  );
}