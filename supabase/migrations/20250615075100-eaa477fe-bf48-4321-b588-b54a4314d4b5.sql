
-- Create storage bucket for user reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-reports', 'user-reports', false);

-- Create storage policies for user reports bucket
CREATE POLICY "Users can view their own reports" ON storage.objects
FOR SELECT USING (bucket_id = 'user-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service role can insert reports" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-reports');

CREATE POLICY "Service role can update reports" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-reports');

-- Add PDF-related columns to user_reports table
ALTER TABLE public.user_reports 
ADD COLUMN pdf_file_path TEXT,
ADD COLUMN pdf_generated_at TIMESTAMP WITH TIME ZONE;

-- Update report_status to include new states
ALTER TABLE public.user_reports 
ALTER COLUMN report_status SET DEFAULT 'generating';
