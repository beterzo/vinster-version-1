
-- Remove the has_paid column from profiles table
ALTER TABLE public.profiles 
DROP COLUMN has_paid;

-- Update the handle_new_user function to remove has_paid reference
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, gender)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'gender'
  );
  RETURN NEW;
END;
$$;
