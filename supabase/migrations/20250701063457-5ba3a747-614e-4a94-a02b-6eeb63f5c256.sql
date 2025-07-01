
-- Verwijder de bestaande zoekprofiel_responses tabel
DROP TABLE IF EXISTS public.zoekprofiel_responses;

-- Maak een nieuwe tabel voor zoekprofiel antwoorden
CREATE TABLE public.zoekprofiel_antwoorden (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  functie_als TEXT,
  kerntaken TEXT,
  organisatie_bij TEXT,
  sector TEXT,
  gewenste_regio TEXT,
  arbeidsvoorwaarden TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.zoekprofiel_antwoorden ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zoekprofiel antwoorden" 
  ON public.zoekprofiel_antwoorden 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updating the updated_at column
CREATE TRIGGER update_zoekprofiel_antwoorden_updated_at
  BEFORE UPDATE ON public.zoekprofiel_antwoorden
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
