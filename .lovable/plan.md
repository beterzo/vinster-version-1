
## Admin pagina: normaal gebruik + maandelijks overzicht

### Wat wordt toegevoegd

**1. "Normaal Vinster gebruik" statistieken**
Bovenaan de admin pagina komt een nieuwe kaart die toont hoeveel gebruikers de normale (niet-organisatie) kant van Vinster gebruiken. Dit wordt gemeten via de `profiles` tabel -- alle gebruikers die GEEN `user_organisation_sessions` record hebben zijn "normale" gebruikers.

**2. Maandelijks overzicht (voor alles)**
In plaats van alleen "deze maand" en "vorige maand" komt er een tabel met de laatste 6 maanden als kolommen (bijv. feb 2026, jan 2026, dec 2025, ...) plus een totaal-kolom. Dit geldt voor zowel de organisatie-statistieken als de normale gebruikers.

### Wijzigingen

**`supabase/functions/admin-organisation-stats/index.ts`**
- Haal alle `profiles` op met `created_at`
- Haal alle `user_organisation_sessions` op met `user_id` (voor het onderscheid normaal vs. organisatie)
- Bereken per maand (laatste 6 maanden):
  - Totaal nieuwe gebruikers
  - Nieuwe organisatie-gebruikers (met sessie)
  - Nieuwe normale gebruikers (zonder sessie)
- Per organisatie: maandelijkse breakdown i.p.v. alleen deze/vorige maand
- Return `monthly_columns` (lijst van maand-labels) + `general_stats` (normaal gebruik per maand) naast de bestaande `stats`

**`src/pages/AdminOrganisatieGebruik.tsx`**
- Nieuwe kaart bovenaan: "Algemeen Vinster Gebruik" met maandelijkse kolommen
  - Rij: Totaal nieuwe gebruikers
  - Rij: Via organisatie
  - Rij: Normaal (zonder organisatie)
- Organisatie-tabel: dynamische maandkolommen i.p.v. vaste "deze maand" / "vorige maand"
- Interfaces updaten voor de nieuwe datastructuur

### Voorbeeld tabelindeling

```text
Algemeen Vinster Gebruik
                    | feb '26 | jan '26 | dec '25 | ... | Totaal
Totaal gebruikers   |    12   |    8    |    5    |     |   45
Via organisatie      |    3    |    2    |    1    |     |   10
Normaal (individueel)|   9    |    6    |    4    |     |   35

Organisatie Gebruik
                    | feb '26 | jan '26 | dec '25 | ... | Totaal
Medisch Centrum     |    2    |    1    |    0    |     |    5
  - ErasmusMC       |    1    |    1    |    0    |     |    3
Transport & Log.    |    1    |    1    |    1    |     |    5
```
