
-- Create table for extra informatie responses
CREATE TABLE public.extra_informatie_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opleidingsniveau TEXT,
  beroepsopleiding TEXT,
  fysieke_beperkingen TEXT,
  sector_voorkeur TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.extra_informatie_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own extra informatie responses" 
  ON public.extra_informatie_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own extra informatie responses" 
  ON public.extra_informatie_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own extra informatie responses" 
  ON public.extra_informatie_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own extra informatie responses" 
  ON public.extra_informatie_responses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_extra_informatie_responses_updated_at 
  BEFORE UPDATE ON public.extra_informatie_responses 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
