
-- Eerst controleren we of er een foreign key constraint is en deze verwijderen
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'enthousiasme_responses_user_id_fkey'
    ) THEN
        ALTER TABLE public.enthousiasme_responses 
        DROP CONSTRAINT enthousiasme_responses_user_id_fkey;
    END IF;
END $$;

-- Voeg een foreign key constraint toe die verwijst naar de profiles tabel
ALTER TABLE public.enthousiasme_responses 
ADD CONSTRAINT enthousiasme_responses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Controleer of de trigger voor nieuwe gebruikers bestaat en maak deze aan als het niet bestaat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, gender, has_paid)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    (NEW.raw_user_meta_data ->> 'gender'),
    false
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Maak een profiel aan voor bestaande gebruikers die nog geen profiel hebben
INSERT INTO public.profiles (id, first_name, last_name, gender, has_paid)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data ->> 'first_name', 'Onbekend') as first_name,
  COALESCE(au.raw_user_meta_data ->> 'last_name', 'Onbekend') as last_name,
  COALESCE(au.raw_user_meta_data ->> 'gender', 'prefer_not_to_say') as gender,
  false as has_paid
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
