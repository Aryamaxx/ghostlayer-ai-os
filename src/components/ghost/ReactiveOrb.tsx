import { useEffect, useRef, useState } from "react";

type Props = {
  state?: "idle" | "listening" | "thinking" | "speaking";
  size?: number;
};

/**
 * The cinematic AI orb — breathing, cursor-aware, particle-emitting.
 */
export function ReactiveOrb({ state = "idle", size = 220 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      setTilt({ x: dx * 14, y: dy * 14 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const speed =
    state === "thinking" ? "2.4s" : state === "speaking" ? "1.6s" : state === "listening" ? "3.2s" : "4.8s";

  return (
    <div
      ref={wrapRef}
      className="relative pointer-events-none select-none"
      style={{ width: size, height: size }}
    >
      {/* outer halo */}
      <div
        className="absolute inset-[-40%] rounded-full blur-3xl opacity-70"
        style={{
          background: "var(--gradient-aurora)",
          animation: `pulse-glow ${speed} ease-in-out infinite`,
          transform: `translate(${tilt.x}px, ${tilt.y}px)`,
        }}
      />
      {/* rotating ring */}
      <div
        className="absolute inset-0 rounded-full border border-white/15"
        style={{ animation: "spin-slow 22s linear infinite" }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-[var(--neon)] glow-ring" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 size-1.5 rounded-full bg-[var(--violet)] glow-violet" />
      </div>
      <div
        className="absolute inset-4 rounded-full border border-white/10"
        style={{ animation: "spin-slow 38s linear infinite reverse" }}
      />

      {/* core */}
      <div
        className="absolute inset-[18%] rounded-full overflow-hidden"
        style={{
          transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`,
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.95 0.05 250 / 0.95), oklch(0.55 0.25 280 / 0.85) 45%, oklch(0.15 0.05 280 / 0.9) 75%)",
          boxShadow:
            "inset 0 0 60px oklch(0.7 0.25 280 / 0.6), 0 0 80px -10px oklch(0.72 0.20 250 / 0.9)",
          animation: `pulse-glow ${speed} ease-in-out infinite`,
        }}
      >
        {/* shimmering inner currents */}
        <div
          className="absolute inset-0 mix-blend-screen opacity-80"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, oklch(0.85 0.2 250 / 0.6), transparent, oklch(0.75 0.25 295 / 0.6), transparent)",
            animation: "spin-slow 9s linear infinite",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, oklch(0.9 0.2 250 / 0.5), transparent 50%)",
            animation: `float-slow 6s ease-in-out infinite`,
          }}
        />
      </div>

      {/* orbiting particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-white/80"
          style={{
            boxShadow: "0 0 10px oklch(0.8 0.2 260 / 1)",
            transformOrigin: "0 0",
            animation: `orb-orbit ${6 + i * 1.4}s linear infinite`,
            animationDelay: `${-i * 0.7}s`,
            ["--r" as never]: `${size * 0.55}px`,
          }}
        />
      ))}
    </div>
  );
}