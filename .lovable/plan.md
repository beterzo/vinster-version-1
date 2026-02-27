
# Admin Dashboard: Statistieken op basis van betaling vs. toegangscode

## Huidige situatie

Het dashboard telt nu **alle geregistreerde profielen** (`profiles.created_at`) voor de "Algemeen Vinster Gebruik" sectie, ongeacht of ze betaald hebben. Dit leidt tot hogere aantallen dan daadwerkelijk actieve (betalende) gebruikers.

## Gewenste logica

De tellingen moeten als volgt werken:

| Type | Wat telt als "gebruiker" |
|------|--------------------------|
| **Algemeen (totaal/normaal)** | Alleen profielen met `has_paid = true` |
| **Branche-categorien** (Medisch Centrum, Transport, Financieel, etc.) | Alleen profielen met `has_paid = true` die via die branche zijn binnengekomen |
| **Specifieke organisaties** (ErasmusMC, en toekomstige `is_unique = true` orgs) | Telt op basis van `user_organisation_sessions` -- wanneer iemand de juiste code heeft ingevuld (zij betalen niet zelf, wordt achteraf gefactureerd) |

## Wat er verandert

### 1. Edge function `admin-organisation-stats/index.ts`

- **Profiles query** uitbreiden: `has_paid` meenemen in de select
- **General stats**: Alleen profielen met `has_paid = true` tellen voor totaal, org en normaal
- **Org types query**: `is_unique` veld meenemen
- **Per-organisatie stats**: 
  - Voor `is_unique = false` (branches): tel sessies van gebruikers die `has_paid = true` hebben
  - Voor `is_unique = true` (specifieke orgs zoals ErasmusMC): tel sessies ongeacht betaalstatus (code-gebruik is het criterium)
- Het `is_unique` veld meegeven in de response zodat het frontend dit eventueel kan tonen

### 2. Frontend (`AdminOrganisatieGebruik.tsx`)

Geen visuele wijzigingen nodig -- de data komt al correct uit de edge function. De aantallen zullen automatisch lager worden omdat testaccounts en niet-betalende gebruikers niet meer meetellen (behalve bij specifieke organisaties).

## Technische details

De kern van de wijziging zit in de edge function. De belangrijkste aanpassingen:

```text
profiles query:  SELECT id, created_at, has_paid  (was: id, created_at)
org_types query: SELECT id, name, parent_type_id, is_unique  (was: id, name, parent_type_id)

General stats:
  - Filter profiles op has_paid = true
  
Per-org stats:
  - Als is_unique = true: tel alle sessies (huidige logica)
  - Als is_unique = false: tel alleen sessies waar de user has_paid = true
```
