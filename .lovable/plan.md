

# "Organisatie niet gevonden" vervangen door contactpagina

## Wat er verandert

In `src/pages/OrganisatieLanding.tsx` (regels 183-203) wordt het "niet gevonden" blok vervangen door een vriendelijkere boodschap:

**Huidige tekst:**
- "Organisatie niet gevonden"
- "Dit organisatietype bestaat niet of is niet actief."
- Knop: "Bekijk alle organisaties"

**Nieuwe tekst:**
- "Toegang tot Vinster voor jouw organisatie?"
- Link: "Neem contact op" (opent mailto:team@vinster.ai)

## Technisch

Eenvoudige tekstwijziging in het `!orgType` blok van `OrganisatieLanding.tsx`:
- Titel wordt "Toegang tot Vinster voor jouw organisatie?"
- De knop/paragraaf wordt vervangen door een `mailto:team@vinster.ai` link met de tekst "Neem contact op"
- De "Bekijk alle organisaties" knop wordt verwijderd

