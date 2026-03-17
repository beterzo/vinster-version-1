

## Probleem

Beide checkout-flows (normaal traject en professionele codes) gebruiken hetzelfde Stripe-product/prijs (€29) en schrijven metadata alleen naar de Checkout Session — niet naar de Payment Intent. Hierdoor is achteraf niet te zien wat er precies is gekocht.

**Voor Tineke Postma**: Zonder metadata op de payment intents en zonder mogelijkheid om checkout sessions te doorzoeken via de API, kunnen we niet 100% vaststellen welk type aankoop dit was. Gezien de context (coach, 3x €29) is het waarschijnlijk dat ze ofwel 3 losse trajecten heeft gekocht, ofwel 3x 1 professionele code — maar de fulfillment is mogelijk niet getriggerd.

## Plan: Metadata doorzetten naar Payment Intent

### Wat verandert

In beide edge functions voegen we `payment_intent_data.metadata` toe aan de `stripe.checkout.sessions.create()` call. Hierdoor wordt metadata ook op de Payment Intent gezet en is deze altijd zichtbaar in het Stripe Dashboard.

### 1. `create-professional-checkout/index.ts`

Voeg `payment_intent_data` toe aan de session create call:

```typescript
const session = await stripe.checkout.sessions.create({
  // ... bestaande config ...
  metadata: {
    type: "professional_codes",
    quantity: String(quantity),
    email,
    language: langKey,
  },
  payment_intent_data: {
    metadata: {
      type: "professional_codes",
      quantity: String(quantity),
      email,
      language: langKey,
    },
  },
  // ... rest ...
});
```

### 2. `create-checkout-session/index.ts`

Zelfde aanpak voor normale trajectbetalingen:

```typescript
const session = await stripe.checkout.sessions.create({
  // ... bestaande config ...
  metadata: { user_id: user.id },
  payment_intent_data: {
    metadata: {
      type: "individual_trajectory",
      user_id: user.id,
    },
  },
  // ... rest ...
});
```

### Resultaat

- Alle toekomstige betalingen hebben metadata op zowel de Checkout Session als de Payment Intent
- In het Stripe Dashboard kun je direct zien of een betaling een "professional_codes" of "individual_trajectory" aankoop was
- Bestaande betalingen (zoals die van Tineke) worden hier niet door beïnvloed

### Voor Tineke nu

Dit is een code-fix voor de toekomst. Voor Tineke's situatie moet je handmatig in het Stripe Dashboard kijken bij **Checkout Sessions** (niet Payment Intents) of daar de metadata staat, of haar rechtstreeks vragen wat ze heeft besteld.

