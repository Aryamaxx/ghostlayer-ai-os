
-- 1. Restrict ghost_personality SELECT to founders only
DROP POLICY IF EXISTS "personality read all" ON public.ghost_personality;

CREATE POLICY "personality founder read"
ON public.ghost_personality
FOR SELECT
TO authenticated
USING (public.is_founder(auth.uid()));

-- 2. Replace hardcoded email founder check with a UUID-keyed table
CREATE TABLE IF NOT EXISTS public.founders (
  user_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.founders TO authenticated;
GRANT ALL ON public.founders TO service_role;

ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "founders self read"
ON public.founders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Seed from current auth.users matching the original founder emails
INSERT INTO public.founders (user_id)
SELECT id FROM auth.users
WHERE lower(email) IN ('1981amitpande@gmail.com','aryamaxxpandey@gmail.com')
ON CONFLICT (user_id) DO NOTHING;

-- Rewrite is_founder to use the table instead of hardcoded emails
CREATE OR REPLACE FUNCTION public.is_founder(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.founders WHERE user_id = _uid);
$$;
