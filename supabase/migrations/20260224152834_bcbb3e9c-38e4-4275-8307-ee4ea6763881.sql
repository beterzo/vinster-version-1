
-- Add parent_type_id column to organisation_types
ALTER TABLE public.organisation_types
ADD COLUMN parent_type_id uuid REFERENCES public.organisation_types(id);

-- Link ErasmusMC to Medisch Centrum
UPDATE public.organisation_types
SET parent_type_id = (
  SELECT id FROM public.organisation_types WHERE slug = 'medisch-centrum' LIMIT 1
)
WHERE slug = 'erasmus-mc';
