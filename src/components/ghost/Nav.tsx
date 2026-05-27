import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GhostMark } from "./GhostMark";

export function Nav() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => subscription.unsubscribe();
  }, []);
  const isFounder = !!email && ["1981amitpande@gmail.com","aryamaxxpandey@gmail.com"].includes(email.toLowerCase());
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass flex items-center justify-between gap-6 rounded-full px-5 py-2.5 w-full max-w-5xl">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <GhostMark className="size-7" />
          <span className="font-display font-semibold tracking-tight">GhostLayer</span>
        </Link>
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <li><a href="#memory" className="hover:text-foreground transition">Memory</a></li>
          <li><a href="#timelines" className="hover:text-foreground transition">Timelines</a></li>
          <li><a href="#ghosts" className="hover:text-foreground transition">Ghosts</a></li>
          {isFounder && <li><Link to="/ghostadmin" className="text-[var(--neon)] hover:text-foreground transition font-mono text-xs tracking-widest">ROOT</Link></li>}
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