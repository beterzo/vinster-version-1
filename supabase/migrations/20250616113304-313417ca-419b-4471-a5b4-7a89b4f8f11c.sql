
-- Update the user_zoekprofielen table to use pdf_url instead of pdf_file_path
ALTER TABLE public.user_zoekprofielen 
RENAME COLUMN pdf_file_path TO pdf_url;

-- Add a comment to clarify this now stores external URLs
COMMENT ON COLUMN public.user_zoekprofielen.pdf_url IS 'External URL to the generated PDF file';
