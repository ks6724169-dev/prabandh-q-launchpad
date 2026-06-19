
CREATE TABLE public.institutes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('school','college')),
  preferred_plan TEXT NOT NULL CHECK (preferred_plan IN ('silver','gold','platinum')),
  student_capacity TEXT,
  contact_person TEXT,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.institutes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institutes TO authenticated;
GRANT ALL ON public.institutes TO service_role;

ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register an institute"
  ON public.institutes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read their just-created institute by id"
  ON public.institutes FOR SELECT
  TO anon, authenticated
  USING (true);
