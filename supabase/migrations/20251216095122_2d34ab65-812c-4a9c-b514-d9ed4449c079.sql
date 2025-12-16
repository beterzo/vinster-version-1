-- First, drop the old constraint that only checks user_id
ALTER TABLE public.prioriteiten_responses DROP CONSTRAINT IF EXISTS unique_user_prioriteiten;

-- Now create a new unique constraint on (user_id, round_id) for multi-round support
ALTER TABLE public.prioriteiten_responses 
ADD CONSTRAINT unique_user_round_prioriteiten UNIQUE (user_id, round_id);