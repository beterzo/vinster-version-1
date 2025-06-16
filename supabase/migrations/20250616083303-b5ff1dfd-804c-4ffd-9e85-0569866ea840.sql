
-- Create a table for zoekprofiel responses
CREATE TABLE public.zoekprofiel_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gewenst_werk TEXT,
  branche_richting TEXT,
  energie_gevende_aspecten TEXT,
  organisatie_type TEXT,
  gewenste_regio TEXT,
  belangrijke_voorwaarden TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.zoekprofiel_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own zoekprofiel responses" 
  ON public.zoekprofiel_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own zoekprofiel responses" 
  ON public.zoekprofiel_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zoekprofiel responses" 
  ON public.zoekprofiel_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zoekprofiel responses" 
  ON public.zoekprofiel_responses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updating the updated_at column
CREATE TRIGGER update_zoekprofiel_responses_updated_at
  BEFORE UPDATE ON public.zoekprofiel_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
