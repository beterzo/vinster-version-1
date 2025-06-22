
-- Add has_paid column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN has_paid BOOLEAN NOT NULL DEFAULT false;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.has_paid IS 'Tracks whether user has completed payment, updated by n8n webhook after successful Stripe payment';
