

# Plan: Stripe Webhook voor automatische code-fulfillment

## Probleem
De huidige flow vertrouwt op een client-side redirect naar `/professional-codes-success` om de `fulfill-professional-codes` edge function aan te roepen. Als de redirect mislukt (bijv. bij Klarna/iDEAL betalingen, browser-problemen, of als de gebruiker het tabblad sluit), worden er geen codes gegenereerd en verstuurd.

## Oplossing
Een nieuwe Stripe webhook edge function maken die luistert naar het `checkout.session.completed` event en automatisch de fulfillment triggert -- onafhankelijk van de browser.

## Wat er verandert

### 1. Nieuwe edge function: `stripe-webhook`
- Luistert naar Stripe webhook events
- Verifieert de webhook signature met een `STRIPE_WEBHOOK_SECRET`
- Bij een `checkout.session.completed` event met metadata `type: "professional_codes"`, roept het dezelfde fulfillment-logica aan
- De bestaande dubbel-fulfillment check (`metadata.fulfilled === "true"`) voorkomt dat codes twee keer worden aangemaakt (zowel via webhook als via de success-pagina)

### 2. Aanpassing `supabase/config.toml`
- Toevoegen van de `stripe-webhook` function configuratie met `verify_jwt = false`

### 3. Success-pagina blijft als backup
- De `ProfessionalCodesSuccess.tsx` pagina blijft bestaan als fallback
- Door de bestaande dubbel-fulfillment check is het veilig als beide paden worden getriggerd

## Wat je zelf moet doen na implementatie

1. **Stripe Webhook Secret aanmaken**: In het Stripe Dashboard een webhook endpoint toevoegen:
   - URL: `https://aqajxxevifmhdjlvqhkz.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`
   - Kopieer de webhook signing secret

2. **Secret opslaan**: De `STRIPE_WEBHOOK_SECRET` wordt als Supabase secret opgeslagen via Lovable

## Technische details

### `supabase/functions/stripe-webhook/index.ts`

De function zal:
1. De raw request body lezen en de Stripe signature header verwerken
2. Het event verifiereren met `stripe.webhooks.constructEvent()`
3. Bij `checkout.session.completed`:
   - Controleren of `metadata.type === "professional_codes"`
   - Controleren of `metadata.fulfilled !== "true"` (dubbel-fulfillment preventie)
   - De bestaande code-generatie en e-mail logica uitvoeren (gekopieerd/gedeeld uit `fulfill-professional-codes`)
   - De session metadata updaten naar `fulfilled: "true"`
4. Een `200` response retourneren aan Stripe

### Geen wijzigingen aan bestaande bestanden
- `fulfill-professional-codes` blijft ongewijzigd werken als fallback via de success-pagina
- `ProfessionalCodesSuccess.tsx` blijft ongewijzigd
- `create-professional-checkout` blijft ongewijzigd

