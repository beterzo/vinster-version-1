
-- Backfill entry_events: paid profiles as stripe_payment
INSERT INTO public.entry_events (user_id, entry_method, redeemed_at, source)
SELECT p.id, 'stripe_payment', p.created_at, 'backfill'
FROM public.profiles p
WHERE p.has_paid = true
  AND p.id NOT IN (SELECT e.user_id FROM public.entry_events e WHERE e.entry_method = 'stripe_payment');

-- Backfill entry_events: org sessions with access_code_id as organisation_access_code
INSERT INTO public.entry_events (user_id, entry_method, redeemed_at, code, org_id, source)
SELECT DISTINCT ON (s.user_id)
  s.user_id,
  'organisation_access_code',
  s.created_at,
  c.code,
  s.organisation_type_id,
  'backfill'
FROM public.user_organisation_sessions s
LEFT JOIN public.organisation_access_codes c ON c.id = s.access_code_id
WHERE s.access_code_id IS NOT NULL
  AND s.user_id NOT IN (SELECT e.user_id FROM public.entry_events e WHERE e.entry_method = 'organisation_access_code');
