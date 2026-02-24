
-- Organisation types (Medisch Centrum, Universiteit, etc.)
CREATE TABLE public.organisation_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  intro_text text,
  anchor_list jsonb,
  is_active boolean DEFAULT false,
  is_unique boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Access codes issued per organisation type
CREATE TABLE public.organisation_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  organisation_type_id uuid REFERENCES public.organisation_types(id),
  is_active boolean DEFAULT true,
  uses_count integer DEFAULT 0,
  max_uses integer,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);

-- Tracks which org context a user session belongs to
CREATE TABLE public.user_organisation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organisation_type_id uuid REFERENCES public.organisation_types(id),
  access_code_id uuid REFERENCES public.organisation_access_codes(id),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Vacancy database for unique organisations (e.g. ErasmusMC)
CREATE TABLE public.organisation_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_type_id uuid REFERENCES public.organisation_types(id),
  title text NOT NULL,
  department text,
  description text,
  keywords text[],
  year integer,
  raw_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- RLS: organisation_types - publiek leesbaar voor actieve types
ALTER TABLE public.organisation_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active organisation types"
ON public.organisation_types
FOR SELECT
USING (is_active = true);

-- RLS: organisation_access_codes - geen publieke toegang (Edge Function gebruikt service role)
ALTER TABLE public.organisation_access_codes ENABLE ROW LEVEL SECURITY;

-- RLS: user_organisation_sessions - gebruikers kunnen eigen sessies lezen
ALTER TABLE public.user_organisation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organisation sessions"
ON public.user_organisation_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own organisation sessions"
ON public.user_organisation_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organisation sessions"
ON public.user_organisation_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS: organisation_vacancies - geen publieke toegang
ALTER TABLE public.organisation_vacancies ENABLE ROW LEVEL SECURITY;

-- Seed data: organisatietypes
INSERT INTO public.organisation_types (slug, name, is_active, is_unique) VALUES
  ('medisch-centrum', 'Medisch Centrum', true, false),
  ('erasmus-mc', 'ErasmusMC', true, true),
  ('universiteit', 'Universiteit', true, false),
  ('zorgorganisatie', 'Zorgorganisatie', true, false),
  ('hogeschool', 'Hogeschool', true, false),
  ('mbo-instelling', 'Mbo-instelling', false, false),
  ('transport-logistiek', 'Transport & Logistiek', false, false),
  ('financieel', 'Financieel', false, false);
