-- Add AI-generated keywords columns to prioriteiten_responses (per round)
ALTER TABLE public.prioriteiten_responses 
ADD COLUMN IF NOT EXISTS ai_activiteiten_keywords JSONB,
ADD COLUMN IF NOT EXISTS ai_werkomstandigheden_keywords JSONB,
ADD COLUMN IF NOT EXISTS ai_interesses_keywords JSONB;