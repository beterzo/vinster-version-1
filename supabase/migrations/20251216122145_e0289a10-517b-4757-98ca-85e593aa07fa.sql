-- Drop the old unique constraint on user_id alone (blocks multi-round functionality)
ALTER TABLE public.user_reports DROP CONSTRAINT IF EXISTS user_reports_user_id_unique;

-- Add composite unique constraint on (user_id, round_id) to allow one report per round per user
ALTER TABLE public.user_reports DROP CONSTRAINT IF EXISTS unique_user_round_report;
ALTER TABLE public.user_reports ADD CONSTRAINT unique_user_round_report UNIQUE (user_id, round_id);