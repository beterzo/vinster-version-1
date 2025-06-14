
-- Voeg 3 nieuwe kolommen toe aan de profiles tabel voor AI-gegenereerde kernwoorden
ALTER TABLE public.profiles 
ADD COLUMN ai_lievelings_activiteiten TEXT,
ADD COLUMN ai_werkomstandigheden TEXT, 
ADD COLUMN ai_interesses TEXT;
