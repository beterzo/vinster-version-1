
-- Create storage bucket for zoekprofiel PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'zoekprofiel-pdfs',
  'zoekprofiel-pdfs', 
  false,
  10485760,
  ARRAY['application/pdf']
);

-- Create storage policies for zoekprofiel PDFs
CREATE POLICY "Users can view their own zoekprofiel PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'zoekprofiel-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service role can insert zoekprofiel PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'zoekprofiel-pdfs');

CREATE POLICY "Service role can update zoekprofiel PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'zoekprofiel-pdfs');

-- Create user_zoekprofielen table
CREATE TABLE public.user_zoekprofielen (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pdf_file_path TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  pdf_status TEXT NOT NULL DEFAULT 'generating',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_zoekprofielen_user_id_key UNIQUE (user_id)
);

-- Add RLS policies for user_zoekprofielen
ALTER TABLE public.user_zoekprofielen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own zoekprofiel PDFs"
ON public.user_zoekprofielen FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own zoekprofiel PDFs"
ON public.user_zoekprofielen FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update zoekprofiel PDFs"
ON public.user_zoekprofielen FOR UPDATE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_user_zoekprofielen_updated_at
  BEFORE UPDATE ON public.user_zoekprofielen
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
