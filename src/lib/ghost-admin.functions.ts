import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FOUNDERS = ["1981amitpande@gmail.com", "aryamaxxpandey@gmail.com"];

async function assertFounder(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) throw new Error("Forbidden");
  if (!FOUNDERS.includes(data.user.email.toLowerCase())) throw new Error("Forbidden");
  return data.user;
}

export const founderCheck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const u = await assertFounder(context.userId);
      return { ok: true, email: u.email };
    } catch {
      return { ok: false, email: null };
    }
  });

export const founderStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context.userId);
    const [{ count: users }, { count: conversations }, { count: messages }, { count: memories }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("ghost_conversations").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("ghost_messages").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("ghost_memories").select("*", { count: "exact", head: true }),
    ]);
    const since = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("ghost_messages")
      .select("emotion, created_at")
      .gte("created_at", since);
    const emotionCounts: Record<string, number> = {};
    for (const m of recent ?? []) {
      const k = m.emotion ?? "unknown";
      emotionCounts[k] = (emotionCounts[k] ?? 0) + 1;
    }
    return {
      users: users ?? 0,
      conversations: conversations ?? 0,
      messages: messages ?? 0,
      memories: memories ?? 0,
      promptsLastHour: recent?.length ?? 0,
      emotionCounts,
    };
  });

export const founderListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context.userId);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, display_name, created_at, last_seen_at")
      .order("created_at", { ascending: false })
      .limit(100);
    const ids = (profiles ?? []).map((p) => p.id);
    let counts: Record<string, number> = {};
    if (ids.length) {
      const { data: msgs } = await supabaseAdmin
        .from("ghost_messages")
        .select("user_id")
        .in("user_id", ids);
      counts = (msgs ?? []).reduce<Record<string, number>>((acc, m) => {
        acc[m.user_id] = (acc[m.user_id] ?? 0) + 1;
        return acc;
      }, {});
    }
    return { users: (profiles ?? []).map((p) => ({ ...p, messageCount: counts[p.id] ?? 0 })) };
  });

export const founderInspectMemory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertFounder(context.userId);
    const [{ data: memories }, { data: recent }] = await Promise.all([
      supabaseAdmin
        .from("ghost_memories")
        .select("*")
        .eq("user_id", data.userId)
        .order("weight", { ascending: false }),
      supabaseAdmin
        .from("ghost_messages")
        .select("role, content, emotion, created_at")
        .eq("user_id", data.userId)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);
    return { memories: memories ?? [], recent: recent ?? [] };
  });

export const founderBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ message: z.string().min(2).max(280) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertFounder(context.userId);
    await supabaseAdmin.from("ghost_broadcasts").update({ active: false }).eq("active", true);
    const { data: row } = await supabaseAdmin
      .from("ghost_broadcasts")
      .insert({ message: data.message, active: true, created_by: context.userId })
      .select()
      .single();
    return { broadcast: row };
  });

export const founderClearBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context.userId);
    await supabaseAdmin.from("ghost_broadcasts").update({ active: false }).eq("active", true);
    return { ok: true };
  });

export const founderUpdatePersonality = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      warmth: z.number().min(0).max(100),
      mystery: z.number().min(0).max(100),
      bluntness: z.number().min(0).max(100),
      intensity: z.number().min(0).max(100),
      system_prompt: z.string().max(4000).nullable().optional(),
      shadow_mode: z.boolean().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertFounder(context.userId);
    const patch: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
    const { data: row } = await supabaseAdmin
      .from("ghost_personality")
      .update(patch)
      .eq("id", 1)
      .select()
      .single();
    return { personality: row };
  });

export const founderGetPersonality = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context.userId);
    const { data } = await supabaseAdmin.from("ghost_personality").select("*").eq("id", 1).maybeSingle();
    return { personality: data };
  });

export const getActiveBroadcast = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await supabaseAdmin
    .from("ghost_broadcasts")
    .select("id, message, created_at")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return { broadcast: data };
});