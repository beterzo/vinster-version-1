
-- Make the user-reports bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'user-reports';

-- Create RLS policy to ensure users can only access their own PDF files
CREATE POLICY "Users can view their own report PDFs" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'user-reports' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
