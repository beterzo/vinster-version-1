
## Admin pagina: zelf code intypen + statistieken fix

### Probleem 1: Statistieken tonen 0 terwijl code 1x gebruikt is
De gebruikstabel telt records uit `user_organisation_sessions`, maar die tabel is leeg. De code-validatie verhoogt alleen `uses_count` op `organisation_access_codes`. De sessie-aanmaak in LoginPage is pas net toegevoegd en was nog niet actief toen de code werd gebruikt.

**Fix:** De stats Edge Function (`admin-organisation-stats`) moet ook `uses_count` uit `organisation_access_codes` meenemen als fallback. De tabel toont dan het hoogste van beide: sessie-count of totaal uses_count van alle codes bij die organisatie.

### Probleem 2: Codes zelf intypen i.p.v. random genereren
Nu genereert de Edge Function een random 8-karakter code. Je wilt zelf een code kunnen intypen.

**Fix:** Voeg een tekstveld toe waar je de code zelf intypt. De Edge Function accepteert een optionele `code` parameter -- als die meegegeven wordt, gebruikt hij die in plaats van een random code te genereren.

### Wijzigingen

**1. `supabase/functions/admin-organisation-stats/index.ts` -- Gebruik `uses_count` als fallback**
- Haal ook `organisation_access_codes` op met `uses_count` per `organisation_type_id`
- Per organisatie: tel sessies, maar gebruik ook de som van `uses_count` van alle codes bij die org
- Toon het hoogste getal zodat er geen gebruik verloren gaat

**2. `supabase/functions/generate-organisation-code/index.ts` -- Accepteer custom code**
- Voeg optionele `code` parameter toe aan de request body
- Als `code` is meegegeven en niet leeg: gebruik die waarde
- Als `code` leeg of niet meegegeven: genereer random code zoals nu

**3. `src/pages/AdminOrganisatieGebruik.tsx` -- Tekstveld voor eigen code**
- Vervang de auto-genereer flow met een tekstveld waar je zelf een code intypt
- Voeg state `newCodeValue` toe
- Het veld wordt meegestuurd als `code` parameter naar de Edge Function
- Validatie: code mag niet leeg zijn
