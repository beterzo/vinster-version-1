
-- Verwijder het oudere duplicate record (behoud het meest recente)
DELETE FROM public.extra_informatie_responses 
WHERE id = '7e4d0c38-1169-4171-ab80-b3faeef49772';

-- Voeg een UNIQUE constraint toe op user_id om toekomstige duplicaten te voorkomen
ALTER TABLE public.extra_informatie_responses 
ADD CONSTRAINT extra_informatie_responses_user_id_unique UNIQUE (user_id);
