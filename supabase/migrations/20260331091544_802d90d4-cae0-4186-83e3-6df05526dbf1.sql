-- Create a completed round for Alex Kersjes (existing user before round system)
INSERT INTO user_rounds (user_id, round_number, status, completed_at)
VALUES ('b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21', 1, 'completed', now());

-- Get the round ID and update all orphaned responses
WITH new_round AS (
  SELECT id FROM user_rounds WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_number = 1
)
UPDATE enthousiasme_responses SET round_id = (SELECT id FROM new_round)
WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_id IS NULL;

WITH new_round AS (
  SELECT id FROM user_rounds WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_number = 1
)
UPDATE wensberoepen_responses SET round_id = (SELECT id FROM new_round)
WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_id IS NULL;

WITH new_round AS (
  SELECT id FROM user_rounds WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_number = 1
)
UPDATE prioriteiten_responses SET round_id = (SELECT id FROM new_round)
WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_id IS NULL;

WITH new_round AS (
  SELECT id FROM user_rounds WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_number = 1
)
UPDATE user_reports SET round_id = (SELECT id FROM new_round)
WHERE user_id = 'b8e9dd73-66c4-41df-86bf-9b2c2d0dfb21' AND round_id IS NULL;