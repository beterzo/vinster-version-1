
-- Remove the gender column from the profiles table
ALTER TABLE public.profiles 
DROP COLUMN gender;

-- Update the handle_new_user function to remove gender reference
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Remove the gender constraint if it exists
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_gender_check;
