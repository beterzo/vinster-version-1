

# Entry Events Tabel en Tracking

## Overzicht

Nieuwe tabel `entry_events` die elke keer dat een gebruiker toegang krijgt (via Stripe, promo-code, of organisatiecode) een record logt. Dit wordt de single source of truth voor de KPI "nieuwe accounts met toegang".

## 1. Database migratie

Nieuwe tabel `entry_events`:

```sql
CREATE TABLE entry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_method text NOT NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  stripe_payment_intent_id text NULL,
  code text NULL,
  org_id uuid NULL,
  source text NULL
);

ALTER TABLE entry_events ENABLE ROW LEVEL SECURITY;
```

Geen RLS policies nodig voor gebruikers (alleen service_role schrijft). De admin edge function leest al met service_role.

## 2. Edge functions aanpassen

### `verify-payment/index.ts`
Na succesvolle `has_paid = true` update, insert:
```
entry_method: 'stripe_payment'
stripe_payment_intent_id: session.payment_intent
source: 'checkout'
```

### `validate-access-code/index.ts`
Na succesvolle promo-code validatie, insert:
```
entry_method: 'promo_code'
code: accessCode
source: 'stripe_promo'
```

### `validate-organisation-code/index.ts`
Na succesvolle organisatiecode validatie, insert:
```
entry_method: 'organisation_access_code'
code: code
org_id: accessCode.organisation_type_id
source: 'organisation'
```

### `stripe-webhook/index.ts`
Bij `checkout.session.completed` voor individuele betalingen (niet professional_codes), insert:
```
entry_method: 'stripe_payment'
stripe_payment_intent_id: session.payment_intent
source: 'webhook'
```
(Hiervoor moet de webhook ook de user_id uit metadata halen en Supabase client aanmaken.)

## 3. Admin dashboard query aanpassen

### `admin-organisation-stats/index.ts`
- Fetch `entry_events` tabel
- Nieuwe KPI rij: **"Via entry_events"** met breakdown per `entry_method`
- Per maand: JOIN `profiles.created_at` met `entry_events.user_id` om nieuwe accounts met toegang te tellen

Response uitbreiden met:
```
entry_kpis: {
  [month]: {
    total_with_access: number,
    via_stripe: number,
    via_promo: number,
    via_org_code: number
  }
}
```

## 4. Frontend widget updaten

### `AdminOrganisatieGebruik.tsx`
- Nieuwe rijen in de "Nieuwe Accounts" widget toevoegen op basis van `entry_kpis`
- Rijen: Via Stripe betaling | Via promo-code | Via organisatiecode
- Dit wordt de standaard KPI

## Bestanden die worden aangepast

1. **Database migratie** - nieuwe `entry_events` tabel
2. `supabase/functions/verify-payment/index.ts` - entry_event insert
3. `supabase/functions/validate-access-code/index.ts` - entry_event insert
4. `supabase/functions/validate-organisation-code/index.ts` - entry_event insert
5. `supabase/functions/stripe-webhook/index.ts` - entry_event insert voor individuele betalingen
6. `supabase/functions/admin-organisation-stats/index.ts` - entry_events query + KPI berekening
7. `src/pages/AdminOrganisatieGebruik.tsx` - nieuwe KPI rijen tonen

