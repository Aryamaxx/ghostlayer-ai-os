import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getActiveBroadcast } from "@/lib/ghost-admin.functions";

export function BroadcastBanner() {
  const fetcher = useServerFn(getActiveBroadcast);
  const [msg, setMsg] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      fetcher().then((r) => { if (alive) setMsg(r.broadcast?.message ?? null); }).catch(() => {});
    };
    tick();
    const i = setInterval(tick, 20_000);
    return () => { alive = false; clearInterval(i); };
  }, [fetcher]);

  if (!msg || hidden) return null;
  return (
    <div className="fixed top-20 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="glass rounded-full px-5 py-2 text-xs font-mono tracking-wider flex items-center gap-3 pointer-events-auto animate-fade-in"
           style={{ borderColor: "var(--neon)" }}>
        <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
        <span className="text-aurora">{msg}</span>
        <button onClick={() => setHidden(true)} className="text-muted-foreground hover:text-foreground ml-2">×</button>
      </div>
    </div>
  );
}