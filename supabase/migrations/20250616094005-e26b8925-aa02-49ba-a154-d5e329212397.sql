
-- Update zoekprofiel_responses table to match new question structure
ALTER TABLE public.zoekprofiel_responses 
ADD COLUMN functie_als text,
ADD COLUMN kerntaken text,
ADD COLUMN sector text,
ADD COLUMN organisatie_bij text;

-- Rename existing columns to match new structure
ALTER TABLE public.zoekprofiel_responses 
RENAME COLUMN branche_richting TO old_branche_richting;

ALTER TABLE public.zoekprofiel_responses 
RENAME COLUMN organisatie_type TO old_organisatie_type;

ALTER TABLE public.zoekprofiel_responses 
RENAME COLUMN belangrijke_voorwaarden TO arbeidsvoorwaarden;

ALTER TABLE public.zoekprofiel_responses 
RENAME COLUMN gewenst_werk TO old_gewenst_werk;

ALTER TABLE public.zoekprofiel_responses 
RENAME COLUMN energie_gevende_aspecten TO old_energie_gevende_aspecten;
