
-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- founder check (security definer; reads auth.users.email)
CREATE OR REPLACE FUNCTION public.is_founder(_uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _uid
      AND lower(email) IN ('1981amitpande@gmail.com','aryamaxxpandey@gmail.com')
  );
$$;

CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_founder(auth.uid()));
CREATE POLICY "profiles self upsert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- conversations
CREATE TABLE public.ghost_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ghost_conversations TO authenticated;
GRANT ALL ON public.ghost_conversations TO service_role;
ALTER TABLE public.ghost_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conv own or founder read" ON public.ghost_conversations FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_founder(auth.uid()));
CREATE POLICY "conv own write" ON public.ghost_conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "conv own update" ON public.ghost_conversations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "conv own delete" ON public.ghost_conversations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- messages
CREATE TABLE public.ghost_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ghost_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  emotion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ghost_messages_user_idx ON public.ghost_messages(user_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.ghost_messages TO authenticated;
GRANT ALL ON public.ghost_messages TO service_role;
ALTER TABLE public.ghost_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg own or founder read" ON public.ghost_messages FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_founder(auth.uid()));
CREATE POLICY "msg own write" ON public.ghost_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "msg own delete" ON public.ghost_messages FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- memories
CREATE TABLE public.ghost_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('goal','fear','pattern','obsession','identity','topic')),
  content TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1.0,
  last_referenced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ghost_memories_user_idx ON public.ghost_memories(user_id, weight DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ghost_memories TO authenticated;
GRANT ALL ON public.ghost_memories TO service_role;
ALTER TABLE public.ghost_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mem own or founder read" ON public.ghost_memories FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_founder(auth.uid()));
CREATE POLICY "mem own write" ON public.ghost_memories FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mem own update" ON public.ghost_memories FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "mem own delete" ON public.ghost_memories FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- broadcasts
CREATE TABLE public.ghost_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ghost_broadcasts TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.ghost_broadcasts TO authenticated;
GRANT ALL ON public.ghost_broadcasts TO service_role;
ALTER TABLE public.ghost_broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broadcast read all" ON public.ghost_broadcasts FOR SELECT TO authenticated, anon
  USING (active = true OR public.is_founder(auth.uid()));
CREATE POLICY "broadcast founder write" ON public.ghost_broadcasts FOR INSERT TO authenticated
  WITH CHECK (public.is_founder(auth.uid()));
CREATE POLICY "broadcast founder update" ON public.ghost_broadcasts FOR UPDATE TO authenticated
  USING (public.is_founder(auth.uid()));

-- personality (singleton)
CREATE TABLE public.ghost_personality (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  warmth INT NOT NULL DEFAULT 62,
  mystery INT NOT NULL DEFAULT 78,
  bluntness INT NOT NULL DEFAULT 70,
  intensity INT NOT NULL DEFAULT 55,
  system_prompt TEXT,
  shadow_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.ghost_personality (id) VALUES (1) ON CONFLICT DO NOTHING;
GRANT SELECT ON public.ghost_personality TO authenticated, anon;
GRANT UPDATE ON public.ghost_personality TO authenticated;
GRANT ALL ON public.ghost_personality TO service_role;
ALTER TABLE public.ghost_personality ENABLE ROW LEVEL SECURITY;
CREATE POLICY "personality read all" ON public.ghost_personality FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "personality founder write" ON public.ghost_personality FOR UPDATE TO authenticated
  USING (public.is_founder(auth.uid()));
