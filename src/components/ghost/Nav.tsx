import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { founderCheck } from "@/lib/ghost-admin.functions";
import { GhostMark } from "./GhostMark";

export function Nav() {
  const [email, setEmail] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);
  const check = useServerFn(founderCheck);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!email) { setIsFounder(false); return; }
    let cancelled = false;
    check().then((r) => { if (!cancelled) setIsFounder(!!r.ok); }).catch(() => {});
    return () => { cancelled = true; };
  }, [email, check]);
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass flex items-center justify-between gap-6 rounded-full px-5 py-2.5 w-full max-w-5xl">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <GhostMark className="size-7" />
          <span className="font-display font-semibold tracking-tight">GhostLayer</span>
          {isFounder && (
            <span className="ml-2 hidden sm:inline-flex items-center gap-1 rounded-full border border-[var(--neon)]/40 bg-[var(--neon)]/10 px-2 py-0.5 text-[9px] font-mono tracking-[0.25em] text-[var(--neon)] uppercase">
              <span className="size-1 rounded-full bg-[var(--neon)] animate-pulse" />
              Founder Access
            </span>
          )}
        </Link>
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <li><a href="#memory" className="hover:text-foreground transition">Memory</a></li>
          <li><a href="#timelines" className="hover:text-foreground transition">Timelines</a></li>
          <li><a href="#ghosts" className="hover:text-foreground transition">Ghosts</a></li>
          {isFounder && <>
            <li><Link to="/ghostadmin" className="text-[var(--neon)] hover:text-foreground transition font-mono text-xs tracking-widest">ROOT</Link></li>
            <li><Link to="/ghostvision" className="text-[var(--violet)] hover:text-foreground transition font-mono text-xs tracking-widest">VISION</Link></li>
            <li><Link to="/systempulse" className="text-[var(--violet)] hover:text-foreground transition font-mono text-xs tracking-widest">PULSE</Link></li>
          </>}
        </ul>
        {email ? (
          <button onClick={() => supabase.auth.signOut()} className="rounded-full glass text-sm font-medium px-4 py-1.5 hover:text-[var(--neon)] transition">
            sever link
          </button>
        ) : (
          <Link to="/login" className="rounded-full bg-foreground text-background text-sm font-medium px-4 py-1.5 hover:opacity-90 transition">
            Enter the layer
          </Link>
        )}
      </nav>
    </header>
  );
}