-- Add zoekprofiel_content column to store AI-generated search profile
ALTER TABLE public.user_zoekprofielen 
ADD COLUMN IF NOT EXISTS zoekprofiel_content jsonb;