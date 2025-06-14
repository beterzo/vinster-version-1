
-- Create table for storing enthousiasme scan responses
CREATE TABLE public.enthousiasme_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  step1_q1 TEXT, -- "Welke dingen deed je het liefst als kind?"
  step1_q2 TEXT, -- "Waar was je graag?"
  step1_q3 TEXT, -- "Wat interesseerde jou?"
  step2_q1 TEXT, -- "Wat interesseerde jou het meest op school?"
  step2_q2 TEXT, -- "Wat deed je zodra je thuis kwam?"
  step2_q3 TEXT, -- "Wat deed je naast school?"
  step3_q1 TEXT, -- "Wat vond je het leukst in je werk?"
  step3_q2 TEXT, -- "Wat sprak/spreekt je aan in de werkomgeving?"
  step3_q3 TEXT, -- "Wat vond/vind je fijn in samenwerken?"
  step4_q1 TEXT, -- "Aan welke periode denk je met heel veel plezier terug?"
  step4_q2 TEXT, -- "Kun je nog een leuke periode of project noemen?"
  step4_q3 TEXT, -- "Wanneer kom jij fluitend thuis?"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.enthousiasme_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own enthousiasme responses" 
  ON public.enthousiasme_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enthousiasme responses" 
  ON public.enthousiasme_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enthousiasme responses" 
  ON public.enthousiasme_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_enthousiasme_responses_updated_at 
  BEFORE UPDATE ON public.enthousiasme_responses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
