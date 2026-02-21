

# Plan: Professionals toegangscodes via Stripe met BTW en Vinster-stijl e-mail

## Samenvatting

Het "snel bestellen" formulier op de professionals-pagina wordt gemigreerd van Make.com naar een directe Stripe-integratie. Na betaling worden automatisch toegangscodes gegenereerd en per e-mail verstuurd in de Vinster huisstijl. BTW wordt inclusief op de factuur getoond.

---

## Wat er gebouwd wordt

### 1. Edge Function: `create-professional-checkout`

Nieuw bestand: `supabase/functions/create-professional-checkout/index.ts`

- Ontvangt `email`, `quantity` en `language` (geen authenticatie nodig)
- Maakt een Stripe Checkout sessie aan met:
  - Dezelfde `PRICE_MAP` per taal als bij individuele betaling
  - `quantity` op basis van het gekozen aantal
  - `customer_email` met het opgegeven e-mailadres
  - `invoice_creation: { enabled: true }` met BTW zichtbaar op de factuur
  - `allow_promotion_codes: true`
  - `metadata` met `type: "professional_codes"`, `quantity`, `email`, `language`
  - `success_url` naar `/professional-codes-success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url` naar `/professionals`
- Zoekt eerst of er al een Stripe-klant bestaat, anders wordt `customer_email` meegegeven

### 2. Edge Function: `fulfill-professional-codes`

Nieuw bestand: `supabase/functions/fulfill-professional-codes/index.ts`

- Ontvangt `session_id`
- Controleert betaling bij Stripe (`payment_status === 'paid'`)
- Leest `quantity`, `email` en `language` uit de sessie-metadata
- Genereert het gewenste aantal Stripe promotion codes:
  - Per code: unieke coupon met `percent_off: 100`, `max_redemptions: 1`, `duration: 'once'`
  - Per coupon: een promotion code met leesbaar formaat (bijv. `VINSTER-A3X7-K9P2`)
- Verstuurt een e-mail via Resend in de Vinster huisstijl met:
  - Dezelfde header-stijl als de bestaande bevestigingsmail (gradient header met "Vinster" + tagline)
  - Overzichtelijke tabel met alle toegangscodes
  - Instructies hoe de codes te delen met clienten
  - Footer met bedrijfsgegevens (KvK, team@vinster.ai)
  - Vertaald in de juiste taal (NL/EN/DE/NO)

### 3. E-mail template (in Vinster stijl)

De e-mail volgt exact dezelfde stijl als de bestaande Vinster e-mails:

- **Header**: Gradient achtergrond (#232D4B naar #E4C05B) met "Vinster" logo-tekst en tagline
- **Content**: Witte achtergrond, bedankbericht, duidelijke tabel met codes
- **Codes tabel**: Elke code in een apart vak met monospace lettertype, makkelijk te kopieren
- **Instructies**: Korte uitleg hoe clienten de code kunnen gebruiken
- **Footer**: Groet van Team Vinster, KvK-nummer, contactinfo

Vertalingen voor alle 4 talen (NL, EN, DE, NO).

### 4. Nieuwe pagina: `/professional-codes-success`

Nieuw bestand: `src/pages/ProfessionalCodesSuccess.tsx`

- Leest `session_id` uit de URL
- Roept `fulfill-professional-codes` aan
- Toont laadstatus tijdens het genereren van codes
- Bij succes: bevestigingsbericht "Je codes zijn per e-mail verzonden!"
- Knop om terug te gaan naar de homepage
- Bij fout: duidelijke foutmelding

### 5. Aanpassen: `ToegangscodesProfessionals.tsx`

- Make.com `fetch` call wordt vervangen door `supabase.functions.invoke('create-professional-checkout')`
- Gebruikt `window.open(url, '_blank')` voor Stripe redirect

### 6. Route toevoegen in `AppRouter.tsx`

- Nieuwe publieke route: `/professional-codes-success`

### 7. Config.toml update

Twee nieuwe entries:
```
[functions.create-professional-checkout]
verify_jwt = false

[functions.fulfill-professional-codes]
verify_jwt = false
```

---

## BTW-afhandeling

Zelfde aanpak als bij de individuele betaling:
- Prijzen zijn inclusief BTW
- `invoice_creation: { enabled: true }` zorgt voor automatische factuur
- BTW wordt apart getoond op de factuur (bijv. 10 x EUR 29 = EUR 290, waarvan EUR 50,33 BTW)

---

## Prijsberekening voorbeelden

| Aantal | Taal | Totaal |
|--------|------|--------|
| 5 | NL | 5 x EUR 29 = EUR 145 |
| 10 | EN-US | 10 x USD 34 = USD 340 |
| 25 | NO | 25 x NOK 333 = NOK 8.325 |

---

## Bestanden overzicht

| Bestand | Actie |
|---------|-------|
| `supabase/functions/create-professional-checkout/index.ts` | Nieuw |
| `supabase/functions/fulfill-professional-codes/index.ts` | Nieuw |
| `src/pages/ProfessionalCodesSuccess.tsx` | Nieuw |
| `src/pages/ToegangscodesProfessionals.tsx` | Aanpassen |
| `src/components/AppRouter.tsx` | Route toevoegen |
| `supabase/config.toml` | Functions toevoegen |

---

## Geen wijzigingen nodig aan

- Database (codes worden beheerd in Stripe als promotion codes)
- Bestaande `validate-access-code` (werkt al met Stripe promotion codes)
- OrganizationForm (blijft via Resend e-mail naar team@vinster.ai)
- Taalbestanden (toasts en labels zijn al aanwezig en worden hergebruikt)

