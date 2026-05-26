import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ghostRespond } from "@/lib/ghost-ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

const PROMPTS = [
  "Tell GhostLayer what's on your mind…",
  "What future are you trying to create?",
  "Describe your obsession…",
  "Say something you've never said out loud…",
];

export function Terminal({
  onStateChange,
}: {
  onStateChange?: (s: "idle" | "listening" | "thinking" | "speaking") => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const placeholderRef = useRef(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const respond = useServerFn(ghostRespond);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    onStateChange?.("thinking");
    try {
      const { reply } = await respond({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      onStateChange?.("speaking");
      setTimeout(() => onStateChange?.("idle"), 2200);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Signal lost. Try once more." },
      ]);
      onStateChange?.("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {messages.length > 0 && (
        <div className="mb-4 space-y-2 max-h-[260px] overflow-y-auto pr-1 text-left">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "text-sm text-muted-foreground font-mono"
                  : "glass rounded-2xl px-4 py-3 text-[15px] leading-relaxed text-foreground"
              }
            >
              {m.role === "user" ? (
                <span><span className="text-[var(--neon)]/80">you ›</span> {m.content}</span>
              ) : (
                <span><span className="text-[var(--violet)] font-mono text-xs mr-2">GHOST</span>{m.content}</span>
              )}
            </div>
          ))}
          {loading && (
            <div className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
              <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" style={{ animationDelay: "0.4s" }} />
              <span className="ml-2 font-mono text-xs">processing thought…</span>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={submit}
        onFocus={() => onStateChange?.("listening")}
        onBlur={() => !loading && onStateChange?.("idle")}
        className="glass rounded-2xl flex items-center gap-2 px-4 py-3 glow-ring"
      >
        <span className="text-[var(--neon)] font-mono text-sm">›</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholderRef.current}
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
      <div className="mt-2 text-[11px] font-mono text-muted-foreground/70 text-center tracking-wider">
        no signup · direct line to the layer
      </div>
    </div>
  );
}