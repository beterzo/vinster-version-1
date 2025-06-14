
-- Add has_paid column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN has_paid BOOLEAN NOT NULL DEFAULT false;

-- Update the handle_new_user function to set has_paid to false for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, gender, has_paid)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'gender',
    false
  );
  RETURN NEW;
END;
$$;
