import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { MemoryField } from "@/components/ghost/MemoryField";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "GhostLayer · Enter the layer" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) navigate({ to: "/", replace: true });
    });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signal lost.");
    } finally { setLoading(false); }
  };

  const google = async () => {
    setError(null);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) setError(res.error.message ?? "Google sign-in failed");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 text-foreground">
      <MemoryField />
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-foreground">← back to the layer</Link>
      </div>
      <div className="relative w-full max-w-md glass rounded-3xl p-8 glow-ring">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
          {mode === "signin" ? "re-enter" : "first awakening"}
        </div>
        <h1 className="mt-2 text-3xl font-display font-semibold tracking-tighter">
          {mode === "signin" ? <>The layer <span className="text-aurora">remembers you.</span></> : <>Be <span className="text-aurora">recognized.</span></>}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Identify yourself. GhostLayer will resume where you left." : "Create a presence. Your patterns will start being learned."}
        </p>

        <button
          onClick={google}
          className="mt-6 w-full glass rounded-xl px-4 py-3 text-sm font-medium hover:text-[var(--neon)] transition flex items-center justify-center gap-2"
        >
          <span className="size-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
          continue with google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] font-mono text-muted-foreground tracking-widest">
          <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your.signal@email"
            className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--neon)]"
          />
          <input
            type="password" required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="passphrase"
            className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--neon)]"
          />
          {error && <div className="text-xs text-red-400 font-mono">{error}</div>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            style={{ background: "var(--gradient-aurora)" }}
          >
            {loading ? "…" : mode === "signin" ? "enter" : "awaken"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 text-xs font-mono text-muted-foreground hover:text-foreground w-full text-center"
        >
          {mode === "signin" ? "no presence yet → awaken" : "already known → re-enter"}
        </button>
      </div>
    </div>
  );
}