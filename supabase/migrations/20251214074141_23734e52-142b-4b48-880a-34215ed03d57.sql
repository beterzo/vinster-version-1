-- Drop existing unique constraints on user_id and add composite unique constraints on (user_id, round_id)

-- enthousiasme_responses
ALTER TABLE enthousiasme_responses DROP CONSTRAINT IF EXISTS enthousiasme_responses_user_id_key;
ALTER TABLE enthousiasme_responses ADD CONSTRAINT enthousiasme_responses_user_round_unique UNIQUE (user_id, round_id);

-- wensberoepen_responses
ALTER TABLE wensberoepen_responses DROP CONSTRAINT IF EXISTS wensberoepen_responses_user_id_key;
ALTER TABLE wensberoepen_responses ADD CONSTRAINT wensberoepen_responses_user_round_unique UNIQUE (user_id, round_id);

-- prioriteiten_responses
ALTER TABLE prioriteiten_responses DROP CONSTRAINT IF EXISTS prioriteiten_responses_user_id_key;
ALTER TABLE prioriteiten_responses ADD CONSTRAINT prioriteiten_responses_user_round_unique UNIQUE (user_id, round_id);

-- extra_informatie_responses
ALTER TABLE extra_informatie_responses DROP CONSTRAINT IF EXISTS extra_informatie_responses_user_id_key;
ALTER TABLE extra_informatie_responses ADD CONSTRAINT extra_informatie_responses_user_round_unique UNIQUE (user_id, round_id);

-- zoekprofiel_antwoorden
ALTER TABLE zoekprofiel_antwoorden DROP CONSTRAINT IF EXISTS zoekprofiel_antwoorden_user_id_key;
ALTER TABLE zoekprofiel_antwoorden ADD CONSTRAINT zoekprofiel_antwoorden_user_round_unique UNIQUE (user_id, round_id);