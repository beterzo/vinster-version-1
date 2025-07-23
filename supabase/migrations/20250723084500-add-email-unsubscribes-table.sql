
-- Create table for email unsubscribes
CREATE TABLE public.email_unsubscribes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT,
  user_agent TEXT,
  ip_address INET
);

-- Enable RLS
ALTER TABLE public.email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing unsubscribes (public access for unsubscribe page)
CREATE POLICY "Public can view their own unsubscribe status" 
  ON public.email_unsubscribes 
  FOR SELECT 
  USING (true);

-- Create policy for inserting unsubscribes (public access for unsubscribe functionality)
CREATE POLICY "Public can unsubscribe" 
  ON public.email_unsubscribes 
  FOR INSERT 
  WITH CHECK (true);

-- Create index for email lookup performance
CREATE INDEX idx_email_unsubscribes_email ON public.email_unsubscribes(email);

-- Add comment for documentation
COMMENT ON TABLE public.email_unsubscribes IS 'Stores email addresses that have unsubscribed from Vinster emails';
