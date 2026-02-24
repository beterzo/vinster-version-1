
# ErasmusMC Integratie - Volledige Implementatie

Dit is een groot plan met meerdere fasen. We bouwen de volledige ErasmusMC-integratie: navigatie-aanpassingen, landingspagina verbetering, rapportgeneratie met vacaturedatabase, zoekprofiel-skip, admin pagina's voor vacature-import en gebruiksdashboard.

---

## Wat er al bestaat

- Database tabellen: `organisation_types`, `organisation_access_codes`, `user_organisation_sessions`, `organisation_vacancies` -- allemaal aanwezig
- ErasmusMC staat in de DB als actief type met `is_unique = true`
- Nav dropdown met "Organisaties" (alleen NL) in Desktop + Mobile
- OrganisatieLanding pagina met access code formulier
- OrganisationContext met localStorage persistentie
- `validate-organisation-code` Edge Function
- Reguliere `generate-career-report` Edge Function (1104 regels, 4 talen)

---

## Fase 1: Navigatie aanpassingen

### Dropdown items aanpassen
Huidige items in `DesktopNavigation.tsx` en `MobileMenu.tsx`:
- Medisch Centrum (available)
- ErasmusMC (indent, available)
- Universiteit (NOT available)
- Zorgorganisatie (NOT available)
- Hogeschool (NOT available)

Wijzigen naar spec:
- "Zorgorganisatie" hernoemen naar "Zorg en Welzijn"
- "Mbo-instelling" toevoegen (niet beschikbaar)
- Greyed-out items: tooltip "Binnenkort beschikbaar" toevoegen bij hover (desktop) -- gebruik Radix Tooltip component
- Items die niet beschikbaar zijn: niet navigeren naar `/organisaties/binnenkort`, maar tooltip tonen en klik blokkeren

### Bestanden
- `src/components/DesktopNavigation.tsx` -- items updaten, tooltip toevoegen
- `src/components/MobileMenu.tsx` -- items updaten, disabled tekst tonen

---

## Fase 2: ErasmusMC landing page verbetering

De huidige `OrganisatieLanding.tsx` werkt al generiek voor alle org types inclusief ErasmusMC. Aanpassingen:

- Voor ErasmusMC slug: toon een specifiekere intro tekst als er geen `intro_text` in de DB staat
- Default fallback tekst: "Welkom bij Vinster voor ErasmusMC. Ontdek welke functies bij jou passen binnen het Erasmus MC."
- De pagina heeft al een `isErasmusMC` check met een subtiel visueel verschil (border accent)
- Optioneel: update de intro_text in de database voor ErasmusMC via een data-update

### Bestanden
- `src/pages/OrganisatieLanding.tsx` -- ErasmusMC-specifieke fallback tekst
- Database update: `intro_text` voor ErasmusMC instellen

---

## Fase 3: Rapportgeneratie met ErasmusMC vacaturedatabase

Dit is de grootste wijziging. De `generate-career-report` Edge Function moet detecteren of de gebruiker in organisatie-modus is en dan een aangepaste prompt gebruiken.

### Aanpak

1. **OrganisationContext doorgeven aan rapport-generatie**
   - De `RapportInline.tsx` component roept `generate-career-report` aan met `user_id`, `round_id`, `language`
   - Toevoegen: `organisation_type_id` parameter (uit OrganisationContext of uit `user_organisation_sessions`)

2. **Edge Function uitbreiden** (`generate-career-report/index.ts`)
   - Nieuw optioneel parameter: `organisation_type_id`
   - Als dit gevuld is:
     a. Haal het `organisation_type` op (inclusief `is_unique`, `slug`)
     b. Als `is_unique` en slug = `erasmus-mc`: query `organisation_vacancies` voor de top 20 meest relevante vacatures op basis van de gebruiker's kernwoorden
     c. Gebruik een compleet andere system prompt en user prompt (ErasmusMC-specifiek)
   - Vacature-matching: simpele keyword-matching -- vergelijk de geselecteerde kernwoorden van de gebruiker met de `title`, `description`, en `keywords` velden van vacatures. Sorteer op relevantie (aantal matches) en neem top 20.

3. **ErasmusMC-specifieke prompt**
   Systeem prompt:
   ```
   Je bent een loopbaancoach gespecialiseerd in interne mobiliteit binnen het Erasmus MC.
   Je ontvangt informatie over een medewerker en een database van interne vacatures.
   Je kiest 3 functies die passen bij de medewerker.
   ```

   User prompt bevat:
   - Alle gebruikersdata (zelfde als regulier)
   - Top 20 vacatures als context (titel, afdeling, beschrijving)
   - De specifieke instructies uit de spec (3 functies, functie 3 verrassend, etc.)

### Bestanden
- `supabase/functions/generate-career-report/index.ts` -- ErasmusMC branch toevoegen
- `src/components/journey/RapportInline.tsx` -- organisation_type_id meesturen
- `src/contexts/OrganisationContext.tsx` -- geen wijzigingen nodig (data is er al)

---

## Fase 4: Zoekprofiel-stap overslaan in organisatie-modus

In organisatie-modus moet de Zoekprofiel-stap worden overgeslagen. Na het rapport gaat de gebruiker direct naar Onderzoeksplan.

### Aanpak

1. **JourneyStepNavigator conditieel maken**
   - In `RondeDashboard.tsx`: als `isOrganisationMode` actief is, filter `zoekprofiel` uit de `JOURNEY_STEPS` array
   - De stap-navigator toont dan 5 stappen in plaats van 6

2. **Flow navigatie aanpassen**
   - Na het rapport: `handleNext` springt naar `onderzoeksplan` in plaats van `zoekprofiel`
   - `getCompletedSteps` hoeft `zoekprofiel` niet te checken in org-modus

3. **Niet wijzigen**: de `JOURNEY_STEPS` constante zelf -- die blijft intact voor reguliere gebruikers. Het filteren gebeurt in de component.

### Bestanden
- `src/pages/RondeDashboard.tsx` -- org-modus check, stappen filteren
- `src/components/JourneyStepNavigator.tsx` -- accepteert gefilterde stappen-lijst
- `src/types/journey.ts` -- geen wijzigingen

---

## Fase 5: Admin pagina - Vacature Import

Nieuwe pagina: `/admin/erasmus-mc/vacatures`

### Functionaliteit
- Drag & drop of file picker voor CSV/Excel bestanden
- Na upload: preview tabel met eerste 10 rijen
- Column mapping UI: gebruiker selecteert welke kolom = title, department, description, year
- Import knop: slaat alle rijen op in `organisation_vacancies`
- Toon huidige telling en laatste import datum
- Optie: vervangen of toevoegen

### Technisch
- Frontend: CSV parsing met `Papa Parse` (of native FileReader voor CSV). Voor Excel: we gebruiken een simpele CSV-only approach eerst (Excel support kan later met SheetJS).
- Geen nieuwe Edge Function nodig -- de admin kan direct via de Supabase client schrijven naar `organisation_vacancies` (maar we moeten RLS policies toevoegen voor admin-rollen, OF een Edge Function gebruiken met service role key)
- Omdat er geen admin-role systeem is: we maken een Edge Function `import-organisation-vacancies` die met service role key de data opslaat

### Bestanden (nieuw)
- `src/pages/AdminErasmusMCVacatures.tsx`
- `supabase/functions/import-organisation-vacancies/index.ts`
- `src/components/AppRouter.tsx` -- route toevoegen

---

## Fase 6: Admin pagina - Gebruiksdashboard

Nieuwe pagina: `/admin/organisaties/gebruik`

### Functionaliteit
- Tabel per organisatie type: naam | deze maand | vorige maand | totaal
- Data uit `user_organisation_sessions` gegroepeerd op `organisation_type_id` en maand
- Access code overzicht: code | org type | uses_count | max_uses | active | last used
- CSV export knop
- Genereer nieuwe access codes: selecteer org type, optioneel max_uses, klik "Genereer code"

### Technisch
- Edge Function `admin-organisation-stats` voor het ophalen van geaggregeerde data (service role)
- Edge Function `generate-organisation-code` voor het aanmaken van nieuwe codes (service role)
- Frontend pagina met tabellen en export functionaliteit

### Bestanden (nieuw)
- `src/pages/AdminOrganisatieGebruik.tsx`
- `supabase/functions/admin-organisation-stats/index.ts`
- `supabase/functions/generate-organisation-code/index.ts`
- `src/components/AppRouter.tsx` -- routes toevoegen

---

## Fase 7: Database updates

Via data-updates (niet migraties, tabellen bestaan al):
- Update `intro_text` voor ErasmusMC in `organisation_types`
- Update `name` van "Zorgorganisatie" naar "Zorg en Welzijn" in `organisation_types`

---

## Implementatievolgorde

Stap 1: Navigatie aanpassingen (dropdown items, tooltips, "Zorg en Welzijn" hernoemen)
Stap 2: ErasmusMC landing page tekst verbetering + DB update
Stap 3: Zoekprofiel-stap overslaan in org-modus (RondeDashboard + JourneyStepNavigator)
Stap 4: Rapportgeneratie Edge Function uitbreiden met ErasmusMC branch
Stap 5: Admin vacature-import pagina + Edge Function
Stap 6: Admin gebruiksdashboard + Edge Functions voor stats en code-generatie
Stap 7: Routes registreren in AppRouter

---

## Samenvatting bestanden

### Nieuw aan te maken
| Bestand | Doel |
|---------|------|
| `src/pages/AdminErasmusMCVacatures.tsx` | Vacature import pagina |
| `src/pages/AdminOrganisatieGebruik.tsx` | Gebruiksdashboard + code management |
| `supabase/functions/import-organisation-vacancies/index.ts` | Vacature import Edge Function |
| `supabase/functions/admin-organisation-stats/index.ts` | Statistieken ophalen |
| `supabase/functions/generate-organisation-code/index.ts` | Access code generatie |

### Te wijzigen
| Bestand | Wijziging |
|---------|-----------|
| `src/components/DesktopNavigation.tsx` | Items updaten, tooltips, "Zorg en Welzijn" |
| `src/components/MobileMenu.tsx` | Items updaten |
| `src/pages/OrganisatieLanding.tsx` | ErasmusMC fallback tekst |
| `supabase/functions/generate-career-report/index.ts` | ErasmusMC branch met vacature-prompt |
| `src/components/journey/RapportInline.tsx` | organisation_type_id meesturen |
| `src/pages/RondeDashboard.tsx` | Zoekprofiel skip in org-modus |
| `src/components/AppRouter.tsx` | Admin routes toevoegen |
| `supabase/config.toml` | Nieuwe Edge Functions registreren |
