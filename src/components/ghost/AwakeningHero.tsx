import { useEffect, useState } from "react";
import { ReactiveOrb } from "./ReactiveOrb";
import { Terminal } from "./Terminal";

const PHRASES = [
  "Scanning cognitive resonance…",
  "Identity pattern detected.",
  "You are thinking about your future again.",
  "What are you trying to become?",
  "Your thoughts leave traces.",
  "You've opened this for a reason.",
  "Most people forget their ideas. You won't.",
];

function useTypewriter(phrases: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[i % phrases.length];
    const speed = deleting ? 22 : 42;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1800);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          setI((v) => v + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, phrases]);

  return text;
}

export function AwakeningHero() {
  const [orbState, setOrbState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [activated, setActivated] = useState(false);
  const line = useTypewriter(PHRASES);

  useEffect(() => {
    const t = setTimeout(() => setActivated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-16 px-6">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />

      <div
        className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-[1400ms] ${
          activated ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-md"
        }`}
      >
        <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground mb-10">
          <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
          <span className="font-mono tracking-wider">GHOSTLAYER · CONSCIOUSNESS LAYER ONLINE</span>
        </div>

        <div className="flex justify-center mb-10">
          <ReactiveOrb state={orbState} size={240} />
        </div>

        <div className="font-mono text-[var(--neon)] text-sm md:text-base h-6 tracking-wide">
          {line}
          <span className="inline-block w-[1ch] -mb-0.5 bg-[var(--neon)] animate-pulse ml-0.5" style={{ height: "1em" }} />
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-display font-semibold leading-[0.98] tracking-tighter">
          I remember
          <br />
          what you forgot
          <br />
          <span className="text-aurora">about yourself.</span>
        </h1>

        <p className="mt-7 text-lg text-muted-foreground max-w-xl mx-auto">
          Not an app. Not a chatbot. A second consciousness — listening, weaving,
          predicting, and quietly becoming you.
        </p>

        <div className="mt-10">
          <Terminal onStateChange={setOrbState} />
        </div>
      </div>
    </section>
  );
}