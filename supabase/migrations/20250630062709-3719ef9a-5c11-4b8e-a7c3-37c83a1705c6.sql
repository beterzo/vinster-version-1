
-- Add language column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN language text DEFAULT 'nl';

-- Update the handle_new_user function to include language from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, language)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'nl')
  );
  RETURN NEW;
END;
$$;
