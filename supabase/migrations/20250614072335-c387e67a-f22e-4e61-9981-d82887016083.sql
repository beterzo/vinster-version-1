
-- Create wensberoepen_responses table with descriptive column names
CREATE TABLE public.wensberoepen_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Wensberoep 1
  wensberoep_1_titel TEXT,
  wensberoep_1_werkweek_activiteiten TEXT,
  wensberoep_1_werklocatie_omgeving TEXT,
  wensberoep_1_binnen_buiten_verhouding TEXT,
  wensberoep_1_samenwerking_contacten TEXT,
  wensberoep_1_fluitend_thuiskomen_dag TEXT,
  wensberoep_1_werk_doel TEXT,
  wensberoep_1_reistijd TEXT,
  wensberoep_1_werkuren TEXT,
  wensberoep_1_werksfeer TEXT,
  wensberoep_1_leukste_onderdelen TEXT,
  wensberoep_1_belangrijke_aspecten TEXT,
  wensberoep_1_kennis_focus TEXT,
  
  -- Wensberoep 2
  wensberoep_2_titel TEXT,
  wensberoep_2_werkweek_activiteiten TEXT,
  wensberoep_2_werklocatie_omgeving TEXT,
  wensberoep_2_binnen_buiten_verhouding TEXT,
  wensberoep_2_samenwerking_contacten TEXT,
  wensberoep_2_fluitend_thuiskomen_dag TEXT,
  wensberoep_2_werk_doel TEXT,
  wensberoep_2_reistijd TEXT,
  wensberoep_2_werkuren TEXT,
  wensberoep_2_werksfeer TEXT,
  wensberoep_2_leukste_onderdelen TEXT,
  wensberoep_2_belangrijke_aspecten TEXT,
  wensberoep_2_kennis_focus TEXT,
  
  -- Wensberoep 3
  wensberoep_3_titel TEXT,
  wensberoep_3_werkweek_activiteiten TEXT,
  wensberoep_3_werklocatie_omgeving TEXT,
  wensberoep_3_binnen_buiten_verhouding TEXT,
  wensberoep_3_samenwerking_contacten TEXT,
  wensberoep_3_fluitend_thuiskomen_dag TEXT,
  wensberoep_3_werk_doel TEXT,
  wensberoep_3_reistijd TEXT,
  wensberoep_3_werkuren TEXT,
  wensberoep_3_werksfeer TEXT,
  wensberoep_3_leukste_onderdelen TEXT,
  wensberoep_3_belangrijke_aspecten TEXT,
  wensberoep_3_kennis_focus TEXT
);

-- Add trigger for updated_at
CREATE TRIGGER update_wensberoepen_responses_updated_at
  BEFORE UPDATE ON public.wensberoepen_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.wensberoepen_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own wensberoepen responses" 
  ON public.wensberoepen_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wensberoepen responses" 
  ON public.wensberoepen_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wensberoepen responses" 
  ON public.wensberoepen_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wensberoepen responses" 
  ON public.wensberoepen_responses 
  FOR DELETE 
  USING (auth.uid() = user_id);
