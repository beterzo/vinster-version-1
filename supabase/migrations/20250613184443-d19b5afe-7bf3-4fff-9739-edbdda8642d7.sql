
-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Change the column type to TEXT first, then drop the enum
ALTER TABLE public.profiles ALTER COLUMN gender TYPE TEXT;

-- Now we can safely drop the enum type
DROP TYPE IF EXISTS public.gender_type CASCADE;

-- Add the constraint to validate gender values
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Recreate the function without enum casting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
