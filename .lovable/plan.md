
# Audit: Admin Organisatie Gebruik - Definities, Inconsistenties en Fix-plan

## 1. Definities (1 waarheid)

### Widget 1: "Nieuwe Accounts per Maand" (account_kpis)

| KPI | Definitie | Tabel(len) | Filter | Issue |
|-----|-----------|------------|--------|-------|
| **Totaal nieuwe profielen** | COUNT profiles | `profiles.created_at` in maandrange | - | OK |
| **Betaalde accounts** | profiles WHERE `has_paid=true` OR user_id in `user_organisation_sessions` | `profiles` + `user_organisation_sessions` | Maar de edge function selecteert `access_code_id` uit sessions terwijl die kolom NIET in de select staat (bug) | BUG: selecteert `'id, organisation_type_id, created_at, user_id'` - mist `access_code_id`. Filter `sessions.filter(s => s.access_code_id)` geeft altijd leeg resultaat. "Via organisatiecode" is daarom altijd 0 |
| **Onbetaalde accounts** | total - betaald | afgeleid | - | Indirect fout door bovenstaande bug |
| **Via betaling** | profiles WHERE `has_paid=true` en `created_at` in maand | `profiles` | OK | Telt zowel Stripe als promo-codes (want beide zetten has_paid=true) |
| **Via organisatiecode** | profiles met `access_code_id IS NOT NULL` in sessions | `user_organisation_sessions` | Bug: altijd 0 | **BUG** |

### Widget 2: "Toegang via Entry Events" (entry_kpis)

| KPI | Definitie | Tabel(len) | Filter |
|-----|-----------|------------|--------|
| **Totaal met toegang** | DISTINCT user_id in entry_events, gefilterd op users waarvan `profiles.created_at` in maandrange | `entry_events` JOIN `profiles` | `profiles.created_at` in maand |
| **Via Stripe betaling** | entry_method = 'stripe_payment' | `entry_events` | - |
| **Via promo-code** | entry_method = 'promo_code' | `entry_events` | - |
| **Via organisatiecode** | entry_method = 'organisation_access_code' | `entry_events` | - |

**Status**: Tabel is leeg. Geen enkele entry_event is gelogd, want de edge functions zijn net gedeployed maar er zijn nog geen nieuwe transacties geweest. Alle historische data ontbreekt.

### Widget 3: "Algemeen Vinster Gebruik" (general_stats)

| KPI | Definitie | Tabel(len) | Filter |
|-----|-----------|------------|--------|
| **Totaal gebruikers** | COUNT paid profiles (`has_paid=true`) met `created_at` in maand | `profiles` | `has_paid=true` |
| **Via organisatie** | Subset van bovenstaande die OOK voorkomen in `user_organisation_sessions` (any session, any date) | `profiles` + `user_organisation_sessions` | Sessie kan van andere maand zijn |
| **Normaal** | Totaal - Via organisatie | afgeleid | - |

**Issue**: "Via organisatie" checkt of de user OOIT een org-sessie had, niet of die sessie in dezelfde maand valt. Een user uit jan met een sessie in feb telt als "Via organisatie" in jan.

### Widget 4: "Gebruik per branche / organisatie" (stats)

| KPI | Definitie | Unit |
|-----|-----------|------|
| Maandgetal | Aantal `user_organisation_sessions` aangemaakt in die maand, gefilterd op org_type_id | **Sessies** (niet users) |
| Voor branches (is_unique=false) | Alleen sessies van paid users | Sessies van paid users |
| Voor specifieke orgs (is_unique=true) | Alle sessies | Sessies |

**Issue**: De unit is sessies, maar de header zegt niet wat het telt. Bovendien: 1 user kan meerdere sessies hebben.

### Widget 5: "Toegangscodes" (codes)

| Veld | Definitie | Bron |
|------|-----------|------|
| **Gebruik** (uses_count) | Teller die opgehoogd wordt bij elke `validate-organisation-code` call | `organisation_access_codes.uses_count` |

**Issue**: `uses_count=3` voor MoleWaterPlein3015, maar er is maar 1 sessie en 1 unieke user. De teller gaat omhoog bij elke validatie-poging, niet bij elke unieke user. Als iemand 3x de code invult, staat er 3.

---

## 2. Consistentie-checks februari 2026

### A. Reconciliatie nieuwe profielen

```text
total_new_profiles = 19
via_payment (has_paid=true) = 18
not_paid = 1
via_org_code = 0 (BUG: access_code_id wordt niet opgehaald)
overlap (paid EN code) = n.v.t. (code is altijd 0)
```

De ErasmusMC-user (c6a487f8) heeft WEL een sessie met access_code_id, maar heeft GEEN profile-record. Deze user zit daarom in geen enkele KPI.

### B. Via organisatiecode vs. Gebruik per branche

- "Via organisatiecode" in widget 1 = **0** (bug: access_code_id niet geselecteerd)
- "Gebruik per branche" voor ErasmusMC = **1** sessie in feb
- "Via organisatie" in Algemeen Gebruik = **0** voor feb (want de ErasmusMC-user heeft geen profile)
- **Inconsistentie**: Er IS 1 org-sessie in feb, maar deze verschijnt nergens in de profile-based widgets

### C. Toegangscodes

```text
Code: MoleWaterPlein3015
uses_count: 3 (validatie-pogingen, niet unieke users)
unique_users: 1
total_sessions: 1
last_used_at: 2026-02-26
```

De "3" in uses_count is misleidend - het zijn 3 code-invoer pogingen, niet 3 unieke gebruikers.

### D. Stripe/promo-codes

- `validate-access-code` logt nu een entry_event met `entry_method='promo_code'` - maar tabel is leeg (geen transacties sinds deploy)
- "Via betaling" in widget 1 is puur `has_paid=true` - dit omvat zowel Stripe-betalingen als promo-code redemptions (want beide zetten has_paid=true)
- Er is geen manier om historisch te onderscheiden of has_paid via Stripe of via promo-code is gezet

### E. entry_events tabel

Volledig leeg. Geen backfill uitgevoerd. Widget 2 toont overal nullen.

---

## 3. Gevonden bugs (samenvatting)

1. **BUG: access_code_id niet geselecteerd** - Edge function selecteert `'id, organisation_type_id, created_at, user_id'` uit sessions, maar filtert daarna op `s.access_code_id`. Dit veld is altijd undefined, dus "Via organisatiecode" is altijd 0.
2. **BUG: ErasmusMC-user zonder profile** - User c6a487f8 heeft een org-sessie maar geen profile-record. Verschijnt nergens in KPIs.
3. **Misleidend: uses_count** - Telt validatie-pogingen, niet unieke users. UI toont het als "Gebruik" zonder toelichting.
4. **Inconsistentie: "Via organisatie"** - Checkt of user OOIT een sessie had, niet of sessie in dezelfde maand valt.
5. **Leeg: entry_events** - Geen backfill, alle historische data mist.
6. **Onduidelijk: "Via betaling"** - Kan niet onderscheiden tussen Stripe en promo-code (beide = has_paid).

---

## 4. Fix-plan

### Fix 1: access_code_id toevoegen aan sessions select
In `admin-organisation-stats/index.ts`, wijzig de sessions select van:
```
.select('id, organisation_type_id, created_at, user_id')
```
naar:
```
.select('id, organisation_type_id, created_at, user_id, access_code_id')
```

### Fix 2: Backfill entry_events
Maak een eenmalige backfill query die:
- Alle profiles met `has_paid=true` als `stripe_payment` logt (conservatief - we weten niet welke via promo waren)
- Alle `user_organisation_sessions` met `access_code_id IS NOT NULL` als `organisation_access_code` logt

### Fix 3: Toegangscodes - toon unieke users ipv uses_count
In de edge function, bereken het aantal unieke users per code via een COUNT DISTINCT op `user_organisation_sessions.user_id WHERE access_code_id = code.id` en stuur dit mee als `unique_users`. Toon dit in de UI naast of in plaats van `uses_count`.

### Fix 4: "Via organisatie" scopen op maand
In de general_stats berekening, filter de org-sessie check op dezelfde maandrange als de profiles, zodat "Via organisatie" alleen users telt die in diezelfde maand een sessie startten.

### Fix 5: UI verduidelijking
- Bij "Gebruik per branche": voeg "(sessies)" toe aan de header
- Bij "Toegangscodes > Gebruik": toon "3 pogingen / 1 unieke user"
- Bij "Via betaling": tooltip dat dit `has_paid=true` is (Stripe + promo)

### Bestanden die worden aangepast
1. `supabase/functions/admin-organisation-stats/index.ts` - Fix 1, 3, 4
2. `src/pages/AdminOrganisatieGebruik.tsx` - Fix 5 (UI labels)
3. Eenmalige SQL backfill - Fix 2 (via migration of handmatig)
