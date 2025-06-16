
-- Remove old, unused columns from zoekprofiel_responses table
ALTER TABLE public.zoekprofiel_responses 
DROP COLUMN old_gewenst_werk,
DROP COLUMN old_branche_richting,
DROP COLUMN old_energie_gevende_aspecten,
DROP COLUMN old_organisatie_type;
