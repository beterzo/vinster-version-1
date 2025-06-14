
-- Create prioriteiten_responses table
CREATE TABLE public.prioriteiten_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Selected keywords (stored as JSON arrays)
  selected_activiteiten_keywords TEXT[],
  selected_werkomstandigheden_keywords TEXT[],
  selected_interesses_keywords TEXT[],
  
  -- Additional text input
  extra_activiteiten_tekst TEXT,
  extra_werkomstandigheden_tekst TEXT,
  extra_interesses_tekst TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_prioriteiten UNIQUE(user_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.prioriteiten_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for prioriteiten_responses
CREATE POLICY "Users can view their own prioriteiten responses" 
  ON public.prioriteiten_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prioriteiten responses" 
  ON public.prioriteiten_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prioriteiten responses" 
  ON public.prioriteiten_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prioriteiten responses" 
  ON public.prioriteiten_responses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER prioriteiten_responses_updated_at 
  BEFORE UPDATE ON public.prioriteiten_responses 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
