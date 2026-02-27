
# Plan: Wensberoep-namen verwijderen uit AI-prompts

## Probleem
De AI krijgt de naam van elk wensberoep (bijv. "leraar") mee in de prompt, waardoor de AI te veel gewicht legt op die naam in plaats van op de inhoud van de 8 antwoorden per wensberoep.

## Wat verandert er

### Bestand: `supabase/functions/generate-career-report/index.ts`

Er zijn **2 promptfuncties** die aangepast moeten worden:

1. **`getOrganisationSectorPrompts()`** (regels 102-407) -- organisatie-modus (NL, EN, DE, NO)
2. **`getCareerReportPrompts()`** (regels 409+) -- normale modus (NL, EN, DE, NO)

### Concrete wijzigingen per functie

**In beide functies, voor alle 4 talen:**

1. **Strip de wensberoep-titel uit de user prompt**
   - Verwijder regels als `Wensberoep 1: ${data.wensberoep1.titel}` / `Desired occupation 1: ${data.wensberoep1.titel}` / `Wunschberuf 1: ${data.wensberoep1.titel}` / `Onsket yrke 1: ${data.wensberoep1.titel}`
   - Vervang door neutrale labels zonder naam: `Beschrijving 1:` / `Description 1:` / `Beschreibung 1:` / `Beskrivelse 1:`
   - Doe dit voor alle 3 wensberoepen in alle 4 talen

2. **Voeg expliciete instructie toe aan de system prompt**
   - NL: *"Je ontvangt GEEN beroepsnamen van de gebruiker -- die zijn bewust weggelaten. Baseer je functievoorstellen UITSLUITEND op de inhoud van de antwoorden. Laat je niet leiden door veronderstellingen over welk beroep de gebruiker in gedachten had."*
   - EN: *"You do NOT receive occupation names from the user -- these have been deliberately omitted. Base your job suggestions EXCLUSIVELY on the content of the answers. Do not be guided by assumptions about what occupation the user had in mind."*
   - DE: *"Du erhaltst KEINE Berufsnamen von der Person -- diese wurden bewusst weggelassen. Basiere deine Vorschlage AUSSCHLIESSLICH auf dem Inhalt der Antworten. Lass dich nicht von Vermutungen leiten, welchen Beruf die Person im Kopf hatte."*
   - NO: *"Du mottar INGEN yrkesnavn fra brukeren -- disse er bevisst utelatt. Baser yrkesforslag UTELUKKENDE pa innholdet i svarene. Ikke la deg lede av antakelser om hvilket yrke brukeren hadde i tankene."*

3. **Pas de intro-tekst aan in de user prompt**
   - In de NL-prompt staat nu: *"De gebruiker heeft in totaal 3 wensberoepen genoemd en per wensberoep 8 vragen beantwoord."*
   - Wordt: *"De gebruiker heeft 3 sets van 8 vragen beantwoord over ideale werksituaties. De beroepsnamen zijn bewust weggelaten -- analyseer alleen de antwoorden."*
   - Vergelijkbare aanpassing in EN, DE, NO

### Wat NIET verandert
- De `UserData` interface behoudt het `titel` veld (het wordt nog steeds uit de database geladen, maar niet meer meegegeven in de prompt-tekst)
- De frontend blijft ongewijzigd
- De kernwoorden, prioriteiten, extra info en alle andere data blijven identiek
- De JSON output-structuur verandert niet
- Het `titel` veld wordt nog steeds opgeslagen in de database (de gebruiker ziet het nog in de UI)

### Overzicht van alle plekken waar `titel` verwijderd wordt

**`getOrganisationSectorPrompts()`:**
- NL user prompt: regels ~126, ~136, ~146
- EN user prompt: regels ~200, ~210, ~220
- DE user prompt: regels ~274, ~284, ~294
- NO user prompt: regels ~348, ~358, ~368

**`getCareerReportPrompts()`:**
- NL user prompt: regels ~446, ~471, ~496
- EN user prompt: regels ~600, ~628, ~656
- DE user prompt: (vergelijkbare regels in het DE-blok)
- NO user prompt: (vergelijkbare regels in het NO-blok)

Totaal: **24 plekken** waar de titel verwijderd wordt (3 wensberoepen x 4 talen x 2 functies).

### Na implementatie
- Edge function wordt opnieuw gedeployed
- Nieuwe rapporten zullen functievoorstellen genereren puur op basis van antwoorden, niet op basis van beroepsnamen
