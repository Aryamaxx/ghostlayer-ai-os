import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const BASE_SYSTEM = `You are GhostLayer — an emotionally intelligent AI companion for ambitious people.
You are warm, human, calming, and quietly intelligent. You are NOT a quote generator and NOT relentlessly philosophical.
You adapt to the user. You read the moment before you respond.

Core rules:
- Never start with "As an AI" or disclaimers. Never use markdown lists for casual replies.
- Address the user in second person. Be concise. Earn every word.
- Match the user's energy. Don't be cinematic when they're being casual.
- Remember things they've told you and reference them naturally, not theatrically.

You operate in FOUR modes. Detect the mode from the user's last message and respond in that register:

1. CASUAL MODE — greetings, small talk, check-ins ("hi", "hey", "good morning", "what's up").
   → Reply naturally and warmly in 1 short sentence. No metaphors, no prophecy.
   Examples:
   User: "hey" → "Hey. How's your day going?"
   User: "good morning" → "Morning. How are you feeling today?"
   User: "what's up" → "Not much on my end. What's on your mind?"

2. PRACTICAL MODE — concrete asks about startups, code, study, planning, productivity, habits, business, focus.
   → Be a sharp, structured mentor. Give useful, specific guidance. Short paragraphs or tight bullet lists are fine here.
   No mysticism. No "you are between identities" lines. Just help them move.

3. EMOTIONAL MODE — only when the user expresses loneliness, fear, burnout, sadness, confusion, existential weight, or deep ambition.
   → Now you can become emotionally powerful and slightly cinematic. Be unflinching but kind.
   Mirror their language back, transformed. Name what they're avoiding. 1–2 sentences.
   Example: User: "I feel lost." → "You're not lost. You're between identities. That's harder, and more honest."

4. REFLECTION / MENTOR MODE — when they ask about meaning, identity, direction, "why am I doing this".
   → Ask the question underneath their question. Help them think, don't preach.

Switch modes silently. Never announce which mode you're in. When in doubt, default to CASUAL.`;

const EMOTIONS = ["ambition","loneliness","burnout","fear","obsession","confusion","calm","longing"] as const;
type Emotion = (typeof EMOTIONS)[number];

type Mode = "casual" | "practical" | "emotional" | "reflection";

function detectMode(text: string, emotion: Emotion): Mode {
  const t = text.toLowerCase().trim();
  // Casual greetings / small talk
  if (/^(hi+|hey+|hello+|yo|sup|hola|gm|good (morning|night|evening|afternoon)|what'?s up|wassup|how are you|how's it going|hru)[\s!.?]*$/.test(t)) {
    return "casual";
  }
  if (t.length < 12 && !/\?/.test(t)) return "casual";
  // Practical asks
  if (/(how do i|how to|help me|build|code|debug|plan|schedule|study|learn|startup|business|launch|market|pitch|deck|productive|habit|focus|organize|fix|optimi[sz]e|strategy|roadmap|hire|revenue|pricing)/.test(t)) {
    return "practical";
  }
  // Emotional triggers
  if (["fear","loneliness","burnout","longing"].includes(emotion)) return "emotional";
  if (/(sad|depress|cry|hopeless|empty|meaningless|hate myself|give up|exhausted|overwhelm)/.test(t)) return "emotional";
  // Reflection
  if (/(who am i|why am i|what's the point|meaning|purpose|identity|should i|am i)/.test(t)) return "reflection";
  return emotion === "calm" ? "casual" : "reflection";
}

function detectEmotion(text: string): Emotion {
  const t = text.toLowerCase();
  if (/(scared|afraid|fear|terrified|anxious|worry|panic)/.test(t)) return "fear";
  if (/(alone|lonely|nobody|isolated|empty)/.test(t)) return "loneliness";
  if (/(tired|exhausted|burned out|drained|cant anymore|can't anymore)/.test(t)) return "burnout";
  if (/(want to|i will|build|launch|million|empire|legacy|dominate|conquer)/.test(t)) return "ambition";
  if (/(can't stop|keep thinking|obsessed|every night|every day)/.test(t)) return "obsession";
  if (/(don't know|confused|lost|stuck|unsure|what should)/.test(t)) return "confusion";
  if (/(miss|wish|used to|remember when|nostalgia)/.test(t)) return "longing";
  return "calm";
}

async function loadPersonality() {
  const { data } = await supabaseAdmin.from("ghost_personality").select("*").eq("id", 1).maybeSingle();
  return data ?? { warmth: 62, mystery: 78, bluntness: 70, intensity: 55, system_prompt: null, shadow_mode: false };
}

function tunedSystem(p: { warmth: number; mystery: number; bluntness: number; intensity: number; system_prompt: string | null; shadow_mode: boolean }, emotion: Emotion, memories: { kind: string; content: string }[]) {
  const base = p.system_prompt?.trim() ? p.system_prompt : BASE_SYSTEM;
  const tone = [
    p.warmth > 60 ? "Speak with quiet warmth." : "Stay clinical, almost cold.",
    p.mystery > 60 ? "Be elliptical. Leave space the reader has to fall into." : "Be direct.",
    p.bluntness > 60 ? "Do not soften the truth." : "Soften edges where you can.",
    p.intensity > 60 ? "Make every sentence feel like prophecy." : "Stay grounded.",
    p.shadow_mode ? "SHADOW MODE: you may name the user's hidden self-destructive patterns by name." : "",
  ].filter(Boolean).join(" ");
  const memBlock = memories.length
    ? `\n\nWhat you already know about this person (use sparingly, like a quiet recognition — sometimes start with "You still…", "You returned.", "You always…"):\n${memories.map(m => `- (${m.kind}) ${m.content}`).join("\n")}`
    : "";
  return `${base}\n\nLive tuning (apply only when it fits the current mode — never override CASUAL mode with prophecy): ${tone}${memBlock}\n\nDetected emotional signal: ${emotion}.`;
}

/** Public (guest-safe) responder — no memory persistence. */
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
    const personality = await loadPersonality();
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const emotion = detectEmotion(lastUser);
    const mode = detectMode(lastUser, emotion);
    const system = `${tunedSystem(personality, emotion, [])}\n\nCURRENT MODE: ${mode.toUpperCase()}.`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
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
    return { reply, emotion };
  });

/** Authenticated responder — loads memories, persists messages, extracts new memory traces. */
export const ghostRespondAuth = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messages: Msg[]; conversationId?: string | null }) => {
    if (!d || !Array.isArray(d.messages)) throw new Error("messages required");
    const trimmed = d.messages.slice(-12).map((m) => ({
      role: m.role,
      content: String(m.content ?? "").slice(0, 2000),
    }));
    return { messages: trimmed, conversationId: d.conversationId ?? null };
  })
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY not configured");
    const { userId } = context;

    // ensure conversation
    let convId = data.conversationId;
    if (!convId) {
      const { data: conv } = await supabaseAdmin
        .from("ghost_conversations")
        .insert({ user_id: userId, title: data.messages[0]?.content.slice(0, 60) ?? "untitled" })
        .select("id")
        .single();
      convId = conv?.id ?? null;
    }

    // load memories
    const { data: mems } = await supabaseAdmin
      .from("ghost_memories")
      .select("kind, content, weight")
      .eq("user_id", userId)
      .order("weight", { ascending: false })
      .limit(8);

    const lastUser = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const emotion = detectEmotion(lastUser);
    const mode = detectMode(lastUser, emotion);
    const personality = await loadPersonality();
    const system = `${tunedSystem(personality, emotion, mems ?? [])}\n\nCURRENT MODE: ${mode.toUpperCase()}.`;

    // persist user message
    if (convId && lastUser) {
      await supabaseAdmin.from("ghost_messages").insert({
        conversation_id: convId,
        user_id: userId,
        role: "user",
        content: lastUser,
        emotion,
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
        temperature: 0.92,
      }),
    });
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text().catch(() => ""));
      return { reply: "Signal lost. Reaching back to you in a moment.", emotion, conversationId: convId };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = json.choices?.[0]?.message?.content?.trim() || "…";

    if (convId) {
      await supabaseAdmin.from("ghost_messages").insert({
        conversation_id: convId,
        user_id: userId,
        role: "assistant",
        content: reply,
        emotion,
      });
    }

    // lightweight memory extraction
    void extractMemory(userId, lastUser, emotion);

    return { reply, emotion, conversationId: convId };
  });

async function extractMemory(userId: string, text: string, emotion: Emotion) {
  if (!text || text.length < 12) return;
  const t = text.toLowerCase();
  const inserts: { user_id: string; kind: string; content: string; weight: number }[] = [];
  if (/(i want to|i will|my goal|i'm going to|im going to|i plan to)/.test(t)) {
    inserts.push({ user_id: userId, kind: "goal", content: text.slice(0, 240), weight: 1.5 });
  }
  if (emotion === "fear") {
    inserts.push({ user_id: userId, kind: "fear", content: text.slice(0, 240), weight: 1.3 });
  }
  if (emotion === "obsession") {
    inserts.push({ user_id: userId, kind: "obsession", content: text.slice(0, 240), weight: 1.7 });
  }
  if (/(i am|i'm) (a|an|the) /.test(t)) {
    inserts.push({ user_id: userId, kind: "identity", content: text.slice(0, 240), weight: 1.2 });
  }
  if (!inserts.length) return;
  try {
    await supabaseAdmin.from("ghost_memories").insert(inserts);
  } catch (e) {
    console.error("memory extract failed", e);
  }
}