
# KPI Widget: Nieuwe betaalde accounts per maand

## Wat er komt

Een nieuwe widget bovenaan de AdminOrganisatieGebruik pagina die per maand toont:
- **Totaal nieuwe profielen** (profiles.created_at in die maand)
- **Nieuwe betaalde accounts** (has_paid = true OR user heeft een organisatie-sessie met access_code_id)
- **Onbetaalde accounts** (geen van beide)
- **Breakdown**: via betaling vs. via organisatiecode

## Huidige data (feb 2026)
- 19 nieuwe profielen, 18 betaald, 1 onbetaald, 0 via organisatiecode (de enige org-sessie in feb was van een bestaande gebruiker)

## Technische aanpassingen

### 1. Edge function: `admin-organisation-stats/index.ts`
- Per maand berekenen: LEFT JOIN profiles met user_organisation_sessions (op user_id) om access_code_id te checken
- Nieuwe velden in response: `account_kpis` object met per maand + totalen:
  - `total_new_profiles`, `new_paid_accounts`, `new_unpaid_accounts`, `via_payment`, `via_code`

### 2. Frontend: `AdminOrganisatieGebruik.tsx`
- Nieuwe state voor `accountKpis`
- Widget met tabel (zelfde stijl als "Algemeen Vinster Gebruik") boven de bestaande tabellen
- Kolommen: maand headers + totaal
- Rijen: Totaal nieuw | Betaald | Onbetaald | Via betaling | Via org-code

### Bestanden
- `supabase/functions/admin-organisation-stats/index.ts` - KPI berekening toevoegen
- `src/pages/AdminOrganisatieGebruik.tsx` - Widget toevoegen
