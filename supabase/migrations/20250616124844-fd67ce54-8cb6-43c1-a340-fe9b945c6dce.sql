
-- Vervang de waarden hieronder met je eigen gegevens
-- user_id kun je vinden in de auth.users tabel
INSERT INTO public.profiles (id, first_name, last_name, gender, has_paid)
VALUES (
  '6330b8eb-ef4a-4021-9cf7-788922b82199', -- Dit is jouw user_id uit de logs
  'Je_Voornaam',  -- Vervang met je echte voornaam
  'Je_Achternaam', -- Vervang met je echte achternaam
  'male', -- Of 'female', 'other', 'prefer_not_to_say'
  false
);
