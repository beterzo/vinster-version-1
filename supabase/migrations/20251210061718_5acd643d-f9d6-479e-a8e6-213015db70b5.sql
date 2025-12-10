-- Create user_rounds table to track multiple rounds per user (max 10)
CREATE TABLE public.user_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  round_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, round_number),
  CONSTRAINT max_10_rounds CHECK (round_number >= 1 AND round_number <= 10)
);

-- Add round_id to user_reports and add report_content for AI-generated JSON
ALTER TABLE public.user_reports ADD COLUMN round_id UUID REFERENCES public.user_rounds(id);
ALTER TABLE public.user_reports ADD COLUMN report_content JSONB;

-- Add round_id to response tables
ALTER TABLE public.enthousiasme_responses ADD COLUMN round_id UUID REFERENCES public.user_rounds(id);
ALTER TABLE public.wensberoepen_responses ADD COLUMN round_id UUID REFERENCES public.user_rounds(id);
ALTER TABLE public.prioriteiten_responses ADD COLUMN round_id UUID REFERENCES public.user_rounds(id);
ALTER TABLE public.extra_informatie_responses ADD COLUMN round_id UUID REFERENCES public.user_rounds(id);
ALTER TABLE public.zoekprofiel_antwoorden ADD COLUMN round_id UUID REFERENCES public.user_rounds(id);

-- Enable RLS on user_rounds
ALTER TABLE public.user_rounds ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_rounds
CREATE POLICY "Users can view their own rounds" 
ON public.user_rounds 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rounds" 
ON public.user_rounds 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rounds" 
ON public.user_rounds 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Drop the existing unique constraint on user_id in user_reports to allow multiple reports
-- First check if it exists and drop it
DO $$
BEGIN
    -- Remove the onConflict on user_id by dropping any unique constraint
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_reports_user_id_key') THEN
        ALTER TABLE public.user_reports DROP CONSTRAINT user_reports_user_id_key;
    END IF;
END $$;

-- Create trigger for updated_at on user_rounds
CREATE TRIGGER update_user_rounds_updated_at
BEFORE UPDATE ON public.user_rounds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_user_rounds_user_id ON public.user_rounds(user_id);
CREATE INDEX idx_user_rounds_status ON public.user_rounds(status);
CREATE INDEX idx_user_reports_round_id ON public.user_reports(round_id);
CREATE INDEX idx_enthousiasme_responses_round_id ON public.enthousiasme_responses(round_id);
CREATE INDEX idx_wensberoepen_responses_round_id ON public.wensberoepen_responses(round_id);
CREATE INDEX idx_prioriteiten_responses_round_id ON public.prioriteiten_responses(round_id);
CREATE INDEX idx_extra_informatie_responses_round_id ON public.extra_informatie_responses(round_id);