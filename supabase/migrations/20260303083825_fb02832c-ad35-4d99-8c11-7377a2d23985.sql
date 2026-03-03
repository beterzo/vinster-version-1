-- Zet alle niet-medische organisatietypen op inactief
-- Alleen Medisch Centrum en ErasmusMC blijven actief
UPDATE public.organisation_types 
SET is_active = false 
WHERE slug IN ('hogeschool', 'transport-en-logistiek', 'financieel', 'universiteit', 'zorgorganisatie');