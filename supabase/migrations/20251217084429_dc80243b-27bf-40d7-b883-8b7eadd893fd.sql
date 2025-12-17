-- Add round_id column to user_zoekprofielen
ALTER TABLE public.user_zoekprofielen ADD COLUMN round_id uuid REFERENCES public.user_rounds(id);

-- Drop old unique constraint if exists (user_id only)
ALTER TABLE public.user_zoekprofielen DROP CONSTRAINT IF EXISTS user_zoekprofielen_user_id_key;

-- Add composite unique constraint for round-specific zoekprofielen
ALTER TABLE public.user_zoekprofielen ADD CONSTRAINT unique_user_round_zoekprofiel UNIQUE (user_id, round_id);