
-- Add unique constraint on user_id to fix UPSERT conflicts
ALTER TABLE public.wensberoepen_responses 
ADD CONSTRAINT wensberoepen_responses_user_id_unique UNIQUE (user_id);
