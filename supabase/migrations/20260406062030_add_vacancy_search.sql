-- Vinster: Erasmus MC vacature-matching
-- Voegt zoekfunctionaliteit toe aan organisation_vacancies
--
-- Wijzigingen:
--   1. category kolom voor pre-filtering
--   2. search_vector (tsvector) met Nederlandse stemming voor full-text search
--   3. GIN index voor snelle queries
--   4. RPC functie match_vacancies() voor server-side matching
--   5. RLS policy voor Edge Function toegang

-- 1. Categorie kolom toevoegen
ALTER TABLE public.organisation_vacancies
  ADD COLUMN IF NOT EXISTS category text;

-- 2. Search vector met Nederlandse stemming
-- Combineert title + department + description + keywords in één doorzoekbaar veld
ALTER TABLE public.organisation_vacancies
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('dutch',
      coalesce(title, '') || ' ' ||
      coalesce(department, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(array_to_string(keywords, ' '), '')
    )
  ) STORED;

-- 3. Indexen voor snelle queries
CREATE INDEX IF NOT EXISTS idx_ov_search
  ON public.organisation_vacancies USING GIN(search_vector);

CREATE INDEX IF NOT EXISTS idx_ov_category
  ON public.organisation_vacancies(category);

CREATE INDEX IF NOT EXISTS idx_ov_org_type
  ON public.organisation_vacancies(organisation_type_id);

-- 4. RPC functie: server-side vacature matching met ranking
-- Gebruikt ts_rank_cd (cover density) voor betere relevantie-scoring
CREATE OR REPLACE FUNCTION public.match_vacancies(
  p_keywords text,
  p_org_type_id uuid,
  p_limit int DEFAULT 25
)
RETURNS TABLE(
  title text,
  department text,
  description text,
  category text,
  rank real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    v.title,
    v.department,
    v.description,
    v.category,
    ts_rank_cd(v.search_vector, to_tsquery('dutch', p_keywords)) as rank
  FROM public.organisation_vacancies v
  WHERE v.organisation_type_id = p_org_type_id
    AND v.search_vector @@ to_tsquery('dutch', p_keywords)
  ORDER BY rank DESC
  LIMIT p_limit;
$$;

-- 5. RLS: Edge Function (service_role) kan alle vacatures lezen
-- Er is al RLS enabled, maar geen SELECT policy -> voeg toe
CREATE POLICY "Allow reading vacancies for report generation"
  ON public.organisation_vacancies
  FOR SELECT
  USING (true);
