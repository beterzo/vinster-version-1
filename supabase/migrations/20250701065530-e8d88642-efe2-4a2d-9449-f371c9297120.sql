
-- Add UNIQUE constraint on user_id to enable upsert functionality
ALTER TABLE public.zoekprofiel_antwoorden ADD CONSTRAINT zoekprofiel_antwoorden_user_id_unique UNIQUE (user_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own zoekprofiel antwoorden" ON public.zoekprofiel_antwoorden;
DROP POLICY IF EXISTS "Users can create their own zoekprofiel antwoorden" ON public.zoekprofiel_antwoorden;
DROP POLICY IF EXISTS "Users can update their own zoekprofiel antwoorden" ON public.zoekprofiel_antwoorden;
DROP POLICY IF EXISTS "Users can delete their own zoekprofiel antwoorden" ON public.zoekprofiel_antwoorden;

-- Create correct RLS policies with proper WITH CHECK clauses
CREATE POLICY "Users can view their own zoekprofiel antwoorden" 
  ON public.zoekprofiel_antwoorden 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own zoekprofiel antwoorden" 
  ON public.zoekprofiel_antwoorden 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zoekprofiel antwoorden" 
  ON public.zoekprofiel_antwoorden 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zoekprofiel antwoorden" 
  ON public.zoekprofiel_antwoorden 
  FOR DELETE 
  USING (auth.uid() = user_id);
