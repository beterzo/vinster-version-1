
CREATE TABLE public.entry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_method text NOT NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  stripe_payment_intent_id text NULL,
  code text NULL,
  org_id uuid NULL,
  source text NULL
);

ALTER TABLE public.entry_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_entry_events_user_id ON public.entry_events(user_id);
CREATE INDEX idx_entry_events_redeemed_at ON public.entry_events(redeemed_at);
