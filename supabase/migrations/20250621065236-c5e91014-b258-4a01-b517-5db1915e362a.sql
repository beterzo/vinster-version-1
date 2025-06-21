
-- Create a public bucket for assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true);

-- Create policy to allow public read access to assets
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Create policy to allow authenticated users to upload assets
CREATE POLICY "Authenticated users can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update assets
CREATE POLICY "Authenticated users can update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete assets
CREATE POLICY "Authenticated users can delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
