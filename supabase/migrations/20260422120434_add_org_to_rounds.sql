-- Add organisation context to user_rounds
-- Each round remembers which organisation type (if any) it was created under,
-- so the rounds overview can show a badge and the report generation uses the
-- correct ankerlijst per round, independent of the current session org context.

ALTER TABLE user_rounds
  ADD COLUMN IF NOT EXISTS organisation_type_id uuid REFERENCES organisation_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS organisation_name text,
  ADD COLUMN IF NOT EXISTS organisation_slug text;

CREATE INDEX IF NOT EXISTS idx_user_rounds_organisation_type_id ON user_rounds(organisation_type_id);
