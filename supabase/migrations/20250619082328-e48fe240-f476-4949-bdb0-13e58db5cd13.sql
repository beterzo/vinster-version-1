
-- Remove the 4 questions (3, 7, 8, 9) from each of the 3 wensberoepen
-- This removes 12 columns total from the wensberoepen_responses table

ALTER TABLE public.wensberoepen_responses 
DROP COLUMN IF EXISTS wensberoep_1_binnen_buiten_verhouding,
DROP COLUMN IF EXISTS wensberoep_1_reistijd,
DROP COLUMN IF EXISTS wensberoep_1_werkuren,
DROP COLUMN IF EXISTS wensberoep_1_werksfeer,
DROP COLUMN IF EXISTS wensberoep_2_binnen_buiten_verhouding,
DROP COLUMN IF EXISTS wensberoep_2_reistijd,
DROP COLUMN IF EXISTS wensberoep_2_werkuren,
DROP COLUMN IF EXISTS wensberoep_2_werksfeer,
DROP COLUMN IF EXISTS wensberoep_3_binnen_buiten_verhouding,
DROP COLUMN IF EXISTS wensberoep_3_reistijd,
DROP COLUMN IF EXISTS wensberoep_3_werkuren,
DROP COLUMN IF EXISTS wensberoep_3_werksfeer;
