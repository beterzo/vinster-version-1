
-- First, let's clean up duplicate records by keeping only the most recent one for each user
WITH ranked_responses AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC, created_at DESC) as rn
  FROM zoekprofiel_responses
)
DELETE FROM zoekprofiel_responses 
WHERE id IN (
  SELECT id 
  FROM ranked_responses 
  WHERE rn > 1
);

-- Now add the unique constraint
ALTER TABLE zoekprofiel_responses ADD CONSTRAINT zoekprofiel_responses_user_id_key UNIQUE (user_id);
