-- Create journey_resets table to track when users restart their journey
CREATE TABLE public.journey_resets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  webhook_processed BOOLEAN NOT NULL DEFAULT false,
  reset_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.journey_resets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own journey resets" 
ON public.journey_resets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey resets" 
ON public.journey_resets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for service role (Make scenario) to update
CREATE POLICY "Service role can update journey resets" 
ON public.journey_resets 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_journey_resets_updated_at
BEFORE UPDATE ON public.journey_resets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();