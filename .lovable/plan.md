

## Loopbaanrapport bevestigingspagina vereenvoudigen

De huidige `confirm`-pagina bevat een waarschuwing dat je "nog terug kunt om antwoorden aan te passen". Dit moet eruit. In plaats daarvan krijgt de gebruiker een helder overzicht van wat er is gedaan en wat er gaat gebeuren, met alleen een duidelijke "Genereer mijn rapport" knop.

### Wat er verandert

**1. Vertalingen aanpassen (`src/locales/nl/journey.json`)**

De huidige teksten:
- `warning_title`: "Let op"
- `warning_text`: "Je kunt nu nog terug om je antwoorden in de vorige stappen aan te passen..."

Worden vervangen door:
- `warning_title` en `warning_text` worden verwijderd (of niet meer getoond)
- `description` wordt aangepast naar een samenvatting: "Je hebt de enthousiasmescan, wensberoepen en je persoonsprofiel afgerond. Op basis van al deze gegevens genereert Vinster nu een persoonlijk loopbaanrapport voor jou."

Dezelfde aanpassingen in EN, DE en NO vertalingen.

**2. Component aanpassen (`src/components/journey/RapportInline.tsx`)**

In het `confirm` blok (regels 306-373):
- Waarschuwingsblok (gele banner met "Let op" + terug-uitleg) verwijderen
- "Vorige" knop verwijderen -- er is geen reden meer om terug te gaan
- De "Genereer mijn rapport" knop wordt de enige knop, full-width, navy (`bg-[#232D4B] text-white font-bold`)
- De "Wat je krijgt" sectie blijft staan als uitleg

### Resultaat

De gebruiker ziet:
1. Titel: "Je loopbaanrapport"
2. Subtitel: "Bijna klaar om je persoonlijke rapport te genereren"
3. Uitleg over wat er tot nu toe is ingevuld
4. "Wat je krijgt" met de twee checkmark-items
5. Een enkele grote knop: "Ja, genereer mijn rapport"

Geen waarschuwing over terugkeren, geen "Vorige" knop.
