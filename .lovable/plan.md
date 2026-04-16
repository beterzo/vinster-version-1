

## Plan: Verschillende vragen per wensberoep + inleidende zin + AI-titels verbergen

### Samenvatting
Elk wensberoep krijgt unieke vragen (in plaats van 3x dezelfde 8 vragen), een inleidende zin die benadrukt dat je mag verzinnen, en de wensberoeptitels worden verborgen voor de AI.

### Wat verandert er

**1. Locale bestanden -- nieuwe vragen per stap (4 talen: NL, EN, DE, NO)**

Elke stap krijgt eigen vraagstellingen. De vragen worden thematisch door elkaar gehusseld zoals in het document. Daarnaast krijgt elke stap een `intro_text` veld:

- **Step 1 intro**: "Beantwoord de volgende vragen alsof je dit werk echt doet. Verzin er gerust op los, het hoeft niet precies te kloppen met werkelijkheid."
- **Step 2 intro**: "Beantwoord de volgende vragen alsof je dit werk echt doet. Verzin er gerust op los, het hoeft niet te kloppen met werkelijkheid."
- **Step 3 intro**: "Beantwoord de volgende vragen alsof je dit werk echt doet. Verzin er gerust op los, het hoeft niet te kloppen met werkelijkheid."

NL vragen exact uit het document. EN/DE/NO worden vertaald.

De DB-kolomnamen blijven ongewijzigd -- de mapping question1-8 naar dezelfde kolommen (werkweek_activiteiten, werklocatie_omgeving, etc.) blijft hetzelfde, alleen de vraagtekst verandert.

**2. Step-pagina's -- inleidende zin tonen**

`WensberoepenStep1.tsx`, `WensberoepenStep2.tsx`, `WensberoepenStep3.tsx`: een inleidende tekst tonen onder de titel/subtitle, voor de vragen beginnen. Gebruikt de nieuwe `intro_text` vertaalsleutel.

**3. AI Edge Functions -- vragen updaten + titels verbergen**

- **`generate-career-report/index.ts`**: De vraag-teksten in de `getCareerReportPrompts` functie updaten zodat ze per beschrijving (1/2/3) de juiste nieuwe vraagtekst bevatten. Titels worden al niet meegestuurd (dat is goed).

- **`generate-profile-keywords/index.ts`**: 
  - Wensberoeptitels VERWIJDEREN uit de prompt (nu staat er `Wensberoep 1 – ${titel}`). Vervangen door alleen "Beschrijving 1" / "Beschrijving 2" / "Beschrijving 3".
  - Vragen updaten naar de nieuwe teksten per beschrijving.
  - Dit in alle 4 talen.

**4. WensberoepenForm component** (fallback-teksten updaten)

De hardcoded Nederlandse labels in `WensberoepenForm.tsx` updaten naar de step-1 vragen (dit component wordt mogelijk niet actief gebruikt, maar moet consistent zijn).

### Bestanden die gewijzigd worden

| Bestand | Wijziging |
|---------|-----------|
| `src/locales/nl/journey.json` | Nieuwe vragen per step + intro_text |
| `src/locales/en/journey.json` | Idem, Engelse vertaling |
| `src/locales/de/journey.json` | Idem, Duitse vertaling |
| `src/locales/no/journey.json` | Idem, Noorse vertaling |
| `src/pages/WensberoepenStep1.tsx` | Intro-tekst tonen |
| `src/pages/WensberoepenStep2.tsx` | Intro-tekst tonen |
| `src/pages/WensberoepenStep3.tsx` | Intro-tekst tonen |
| `supabase/functions/generate-profile-keywords/index.ts` | Titels verwijderen, vragen updaten |
| `supabase/functions/generate-career-report/index.ts` | Vragen in prompts updaten (4 talen) |
| `src/components/wensberoepen/WensberoepenForm.tsx` | Fallback labels updaten |

### Wat NIET verandert
- Database schema (kolommen blijven hetzelfde)
- De mapping van question-nummer naar DB-kolom
- De wensberoeptitels worden nog steeds opgeslagen (voor weergave aan de gebruiker), maar de AI krijgt ze niet te zien

### Technische details

De nieuwe NL-vragen per stap (exact uit het document):

**Wensberoep 1:**
1. Waar werk je en hoe ziet jouw werkomgeving eruit?
2. Wat doe je allemaal op een gewone werkdag in dit werk?
3. Met wie heb je tijdens dit werk vooral te maken?
4. Wanneer heb je echt plezier in je werk? Wat ben je dan aan het doen?
5. Wat vind jij belangrijk in dit werk qua arbeidsvoorwaarden? (bijvoorbeeld m.b.t. salaris, werktijden, vrijheid)
6. Waar moet je iets van weten of interesse in hebben om dit werk goed te doen?
7. Hoeveel vrijheid heb je in dit werk om zelf te bepalen wat je doet en hoe je het doet?
8. Waar draag jij met jouw werk aan bij, en waarom vind je dat belangrijk?

**Wensberoep 2:**
1. Beschrijf de plek of plekken waar je werkt.
2. Wat zijn jouw belangrijkste taken?
3. Wat werkt voor jou het fijnst? Meedenken, zelf uitvoeren, anderen aansturen of nog iets anders?
4. Wanneer voelt dit werk voor jou zinvol of de moeite waard? Kun je daar een voorbeeld van geven?
5. Wie kom je tegen in dit werk en wat doe je samen?
6. Op welke momenten denk je: dit is leuk werk! Wat ben je dan aan het doen?
7. Wat biedt dit werk jou zodat je het makkelijk volhoudt en er blij van wordt?
8. Waar gaat het werk inhoudelijk over? Wat moet je interessant vinden als je dit werk doet?

**Wensberoep 3:**
1. Waarom past deze werkomgeving bij je?
2. Waar besteed je het grootste deel van je tijd aan?
3. Voor wie of wat doe jij dit werk uiteindelijk, en wat wil je daarmee bereiken?
4. Met wat voor mensen werk je samen en wat is jouw rol daarin?
5. Welke onderdelen van het werk geven jou de meeste energie?
6. Welke arbeidsvoorwaarden of omstandigheden zijn voor jou echt belangrijk?
7. Hoe zelfstandig werk je in dit beroep? Wat vind jij het prettigst?
8. Waar moet je nieuwsgierig naar zijn of meer over willen leren in dit werk?

### Over de AI-vraag
De eigenaar vraagt: "Denk je dat de AI zo wel het onderscheid tussen wat je graag doet, de werkomstandigheden en interesses uit elkaar kan houden?"

Ja, dat kan de AI prima. De vragen dekken dezelfde thema's (activiteiten, omgeving, samenwerking, plezier, doel, kennis), alleen anders geformuleerd. De AI-prompt vraagt expliciet om keywords in drie categorieen (activiteiten, werkomgeving, interesses) te genereren. De variatie in formulering geeft juist rijkere input.

