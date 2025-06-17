
-- Enable real-time updates for user_zoekprofielen table
ALTER TABLE public.user_zoekprofielen REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_zoekprofielen;
