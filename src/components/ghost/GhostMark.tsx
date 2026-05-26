export function GhostMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="gm" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.18 230)" />
          <stop offset="100%" stopColor="oklch(0.65 0.24 295)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" stroke="url(#gm)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6" fill="url(#gm)" />
      <circle cx="16" cy="16" r="10" stroke="url(#gm)" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}