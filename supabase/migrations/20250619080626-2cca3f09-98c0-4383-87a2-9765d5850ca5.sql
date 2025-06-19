
-- Remove old columns for kindertijd and tienertijd (6 columns total)
ALTER TABLE public.enthousiasme_responses 
DROP COLUMN kindertijd_liefste_activiteiten,
DROP COLUMN kindertijd_favoriete_plekken,
DROP COLUMN kindertijd_interesses,
DROP COLUMN school_interessantste_vakken,
DROP COLUMN school_thuiskomst_activiteiten,
DROP COLUMN school_naschoolse_activiteiten;

-- Add new columns for combined kindertijd/tienertijd (3 columns)
ALTER TABLE public.enthousiasme_responses 
ADD COLUMN kindertijd_activiteiten TEXT,
ADD COLUMN kindertijd_plekken TEXT,
ADD COLUMN kindertijd_interesses_nieuw TEXT;

-- Rename existing columns for eerste werkervaring to match new questions
ALTER TABLE public.enthousiasme_responses 
RENAME COLUMN eerste_werk_leukste_aspecten TO eerste_werk_leukste_taken;

ALTER TABLE public.enthousiasme_responses 
RENAME COLUMN werkomgeving_aantrekkelijke_elementen TO eerste_werk_werkomstandigheden;

ALTER TABLE public.enthousiasme_responses 
RENAME COLUMN samenwerking_prettige_aspecten TO eerste_werk_onderwerpen;
