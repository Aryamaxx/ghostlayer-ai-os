export function Orb() {
  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <div className="absolute inset-0 rounded-full blur-2xl opacity-70 pointer-events-none" style={{ background: "var(--gradient-aurora)", animation: "pulse-glow 4s ease-in-out infinite" }} />
      <button
        aria-label="Summon GhostLayer"
        className="relative size-14 rounded-full glass glow-ring flex items-center justify-center transition hover:scale-105"
      >
        <span className="size-7 rounded-full" style={{ background: "var(--gradient-aurora)", animation: "float-slow 6s ease-in-out infinite" }} />
      </button>
    </div>
  );
}