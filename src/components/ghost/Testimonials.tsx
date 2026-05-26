import { SectionHeader } from "./Features";

const quotes = [
  {
    q: "It feels like the part of my brain I always wished worked. I stopped losing ideas.",
    n: "Mira K.",
    r: "Founder, in stealth",
  },
  {
    q: "GhostLayer surfaced a half-baked thought from 9 months ago — and it became our launch.",
    n: "Daniel R.",
    r: "Creator, 1.2M followers",
  },
  {
    q: "The timeline simulator is genuinely unsettling. In a good way. It was right both times.",
    n: "Sana O.",
    r: "Investor",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="From the early layer"
          title={<>Whispers from <span className="text-aurora">the first 1,000.</span></>}
          sub="A private beta of founders, writers, and creators living one layer ahead."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {quotes.map((t, i) => (
            <figure key={i} className="glass rounded-3xl p-7 relative">
              <div className="text-3xl text-[var(--neon)]/60 font-display">“</div>
              <blockquote className="mt-1 text-lg leading-relaxed">{t.q}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="size-9 rounded-full" style={{ background: "var(--gradient-aurora)" }} />
                <div>
                  <div className="text-sm font-medium">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}