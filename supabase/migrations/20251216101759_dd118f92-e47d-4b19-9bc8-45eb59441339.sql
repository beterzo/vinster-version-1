-- Drop the old constraint that only checks user_id
ALTER TABLE public.extra_informatie_responses 
DROP CONSTRAINT IF EXISTS extra_informatie_responses_user_id_unique;