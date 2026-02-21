

# Plan: Betalingsflow migreren van Make.com naar directe Stripe-integratie

## Samenvatting

De volledige betalingsflow wordt gemigreerd van Make.com webhooks naar directe Stripe-integratie via Supabase Edge Functions. Dit omvat zowel de normale betaling als de toegangscode-validatie.

---

## Wat er gebouwd wordt

### 1. Edge Function: `create-checkout-session`

Nieuw bestand: `supabase/functions/create-checkout-session/index.ts`

Wat het doet:
- Authenticatie van de ingelogde gebruiker
- Zoekt of er al een Stripe-klant bestaat met dat e-mailadres
  - **Wel gevonden**: gebruikt die bestaande klant-ID
  - **Niet gevonden**: geeft het e-mailadres mee als `customer_email` -- Stripe maakt dan automatisch een nieuw klantrecord aan tijdens het afrekenen
- Maakt een Stripe Checkout sessie aan met:
  - Het juiste product per taal (NL/EN/EN-US/DE/NO)
  - BTW inclusief in de prijs, zichtbaar op de factuur
  - `allow_promotion_codes: true` voor kortingscodes
  - Automatische factuur (`invoice_creation: { enabled: true }`)
  - `metadata` met `user_id`
  - `locale` per taal
- Retourneert de checkout URL

Prijzen per taal:

| Taal | Price ID | Bedrag |
|------|----------|--------|
| NL | `price_1Rvvv7BiHXiKCcHU0KcdPOTI` | EUR 29 |
| EN | `price_1RvvuWBiHXiKCcHURzeouvup` | EUR 29 |
| EN-US | `price_1SrvTuBiHXiKCcHU1cbMTgk1` | USD 34 |
| DE | `price_1RvvtyBiHXiKCcHUW0vJIVSL` | EUR 29 |
| NO | `price_1RvvtKBiHXiKCcHU4ROeMOpf` | NOK 333 |

### 2. Edge Function: `verify-payment`

Nieuw bestand: `supabase/functions/verify-payment/index.ts`

Wat het doet:
- Ontvangt `session_id` van de frontend
- Haalt de checkout sessie op bij Stripe
- Controleert of `payment_status === 'paid'`
- Zo ja: zet `has_paid = true` in de `profiles` tabel via service role key
- Retourneert succes/faal status

### 3. Edge Function: `validate-access-code`

Nieuw bestand: `supabase/functions/validate-access-code/index.ts`

Wat het doet:
- Ontvangt toegangscode en user ID
- Zoekt de code op als Stripe promotion code
- Controleert of het een 100% kortingscode is
- Zo ja: zet `has_paid = true` en deactiveert de promotion code
- Retourneert succes of foutmelding

### 4. Nieuwe pagina: `/payment-success`

Nieuw bestand: `src/pages/PaymentSuccess.tsx`

- Leest `session_id` uit de URL
- Roept `verify-payment` edge function aan
- Toont een bevestigingsbericht bij succes
- Redirect automatisch naar `/home`
- Toont foutmelding als betaling niet voltooid is

### 5. Aanpassen: `PaymentRequired.tsx`

**Betaalknop**: Make.com webhook wordt vervangen door `supabase.functions.invoke('create-checkout-session')`. Redirect via `window.location.href`.

**Toegangscode**: Make.com webhook wordt vervangen door `supabase.functions.invoke('validate-access-code')`. Bij succes direct `refreshPaymentStatus()` en redirect.

### 6. Route toevoegen in `AppRouter.tsx`

Nieuwe route `/payment-success` als protected route (zonder payment check).

### 7. Config.toml update

Drie nieuwe edge functions met `verify_jwt = false`.

---

## BTW-afhandeling

De prijzen zijn inclusief BTW. Om de BTW apart op de factuur te tonen, wordt een Stripe Tax Rate met `inclusive: true` aangemaakt of hergebruikt. Hierdoor:
- Gebruiker betaalt gewoon EUR 29
- Factuur toont: EUR 23,97 + EUR 5,03 BTW (21%) = EUR 29,00

---

## Bestanden overzicht

| Bestand | Actie |
|---------|-------|
| `supabase/functions/create-checkout-session/index.ts` | Nieuw |
| `supabase/functions/verify-payment/index.ts` | Nieuw |
| `supabase/functions/validate-access-code/index.ts` | Nieuw |
| `src/pages/PaymentSuccess.tsx` | Nieuw |
| `src/pages/PaymentRequired.tsx` | Aanpassen |
| `src/components/AppRouter.tsx` | Route toevoegen |
| `supabase/config.toml` | Functions toevoegen |

---

## Geen wijzigingen nodig aan

- Database (`profiles.has_paid` wordt hergebruikt)
- `usePaymentStatus` hook
- `PaymentGate` component
- Secrets (`STRIPE_SECRET_KEY` is al geconfigureerd)

