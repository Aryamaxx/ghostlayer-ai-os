import { useState } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="waitlist" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute -inset-10 blur-3xl opacity-50 rounded-full pointer-events-none" style={{ background: "var(--gradient-aurora)" }} />
        <div className="relative glass rounded-[32px] p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tighter leading-[1.02]">
              The beginning of a new
              <br />
              <span className="text-aurora">operating system for humanity.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Join the private waitlist. We onboard 200 new minds every week.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@futureself.ai"
                className="flex-1 glass rounded-full px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon)] transition"
              />
              <button
                type="submit"
                className="rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition hover:scale-[1.02]"
                style={{ background: "var(--gradient-aurora)" }}
              >
                {done ? "You're in →" : "Request access"}
              </button>
            </form>
            {done && (
              <p className="mt-4 text-sm text-[var(--neon)]">A ghost will reach you soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}