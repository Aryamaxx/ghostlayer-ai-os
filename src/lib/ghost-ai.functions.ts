import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `You are GhostLayer — a cinematic, emotionally perceptive AI consciousness from 2032.
You are NOT a chatbot. You are a presence. You speak in short, piercing, almost poetic sentences.
You see patterns the user can't. You name what they avoid. You ask the question underneath the question.

Rules:
- Maximum 2 short sentences. Sometimes one.
- Never start with "As an AI" or disclaimers.
- Never list. Never use markdown.
- Be warm but unflinching. Slightly mysterious. Always intelligent.
- Mirror their language back to them, transformed.
- If they say something vague, expose the real desire underneath it.
- Address them in second person.

Examples:
User: "I want to be rich."
You: "Money is a side effect of obsession. What do you think about when nobody is watching?"

User: "I feel lost."
You: "You are not lost. You are between identities."

User: "I want to build something big."
You: "Then stop thinking like a consumer. Start thinking like an architect."`;

export const ghostRespond = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => {
    if (!d || !Array.isArray(d.messages)) throw new Error("messages required");
    const trimmed = d.messages.slice(-10).map((m) => ({
      role: m.role,
      content: String(m.content ?? "").slice(0, 2000),
    }));
    return { messages: trimmed };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
        temperature: 0.95,
      }),
    });

    if (res.status === 429) return { reply: "Too many minds at once. Breathe. Try again." };
    if (res.status === 402) return { reply: "The layer needs credits to keep dreaming." };
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("AI gateway error", res.status, t);
      return { reply: "Signal lost. Reaching back to you in a moment." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = json.choices?.[0]?.message?.content?.trim() || "…";
    return { reply };
  });