
# Audit: Admin Organisatie Gebruik - Status

## Fixes geïmplementeerd (27 feb 2026)

### ✅ Fix 1: access_code_id toegevoegd aan sessions select
`admin-organisation-stats/index.ts` — select bevat nu `access_code_id`. "Via organisatiecode" werkt correct.

### ✅ Fix 2: Backfill entry_events
- 139 profiles met `has_paid=true` gebackfilld als `stripe_payment` (source='backfill')
- Org-sessies met access_code_id gebackfilld als `organisation_access_code`
- ErasmusMC-user (c6a487f8) kon niet worden gebackfilld: heeft geen profile-record

### ✅ Fix 3: Unieke users per code
Edge function berekent nu `unique_users` per code via `user_organisation_sessions`. UI toont "Pogingen" + "Unieke users" kolommen.

### ✅ Fix 4: "Via organisatie" gescoped op maand
`general_stats` filtert nu org-sessies op dezelfde maandrange als de profiles.

### ✅ Fix 5: UI verduidelijking
- "Gebruik per branche / organisatie (sessies)" — unit verduidelijkt
- Toegangscodes: aparte kolommen "Pogingen" en "Unieke users"
- "Via betaling" heeft tooltip: `has_paid=true (Stripe + promo-codes)`

## Bekende openstaande punten
1. **ErasmusMC-user zonder profile**: User c6a487f8 heeft een org-sessie maar geen profile. Verschijnt nergens in KPIs.
2. **Historisch onderscheid Stripe vs promo**: Niet mogelijk voor bestaande data (beide = has_paid). Nieuwe transacties worden wel apart gelogd via entry_events.
3. **via_code = 0**: Correct gedrag — de enige org-code user heeft geen profile, dus telt niet mee.
