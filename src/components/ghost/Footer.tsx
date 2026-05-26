import { GhostMark } from "./GhostMark";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <GhostMark className="size-5" />
          <span className="font-display font-semibold text-foreground">GhostLayer</span>
          <span className="opacity-60">· consciousness layer</span>
        </div>
        <div>© {new Date().getFullYear()} GhostLayer Systems</div>
      </div>
    </footer>
  );
}