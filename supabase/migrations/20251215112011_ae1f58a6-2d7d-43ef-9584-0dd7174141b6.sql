-- Verwijder de oude constraint die multi-ronde responses blokkeert
ALTER TABLE public.wensberoepen_responses 
DROP CONSTRAINT IF EXISTS wensberoepen_responses_user_id_unique;