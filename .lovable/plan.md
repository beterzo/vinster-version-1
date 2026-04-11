

## Fix: AI-rapportteksten met rare hoofdletters en slechte zinnen

### Probleem
De AI-prompt instrueert het model om kernwoorden te verwerken in de uitleg, maar geeft geen instructie over:
1. Geen hoofdletters midden in zinnen gebruiken voor keywords
2. Vloeiende, natuurlijke zinnen schrijven in plaats van keywords aan elkaar plakken

### Oplossing
Expliciete instructies toevoegen aan **beide** prompt-functies in `supabase/functions/generate-career-report/index.ts`:

**1. `getOrganisationSectorPrompts` (alle 4 talen)** — bij de schrijfinstructies toevoegen:
- "Schrijf vloeiende, natuurlijke zinnen. Verwerk de kernwoorden subtiel in de tekst — gebruik ze NIET letterlijk met hoofdletters midden in een zin. Schrijf zoals een mens zou schrijven, niet als een opsomming van trefwoorden."

**2. `getCareerReportPrompts` (alle 4 talen)** — zelfde instructie toevoegen bij de opdracht-sectie.

### Bestanden
- `supabase/functions/generate-career-report/index.ts` — prompt-aanpassingen in beide functies, 4 talen elk
- Deploy edge function na wijziging

### Resultaat
Toekomstige rapporten krijgen vloeiende tekst zonder random hoofdletters. Bestaande rapporten blijven ongewijzigd.

