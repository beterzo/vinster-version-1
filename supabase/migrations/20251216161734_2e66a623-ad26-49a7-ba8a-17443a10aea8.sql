-- Verwijder de oude constraint die slechts één record per user toestaat
ALTER TABLE zoekprofiel_antwoorden 
DROP CONSTRAINT IF EXISTS zoekprofiel_antwoorden_user_id_unique;