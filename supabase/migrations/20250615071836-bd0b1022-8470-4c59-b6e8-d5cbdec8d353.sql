
-- Add unique constraint on user_id to allow upsert operations
ALTER TABLE public.user_reports 
ADD CONSTRAINT user_reports_user_id_unique UNIQUE (user_id);
