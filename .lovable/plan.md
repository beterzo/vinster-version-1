

## Creatievere "verrassende" derde functie in loopbaanrapporten

Aanpassing van de AI-prompt instructies in 1 bestand: `supabase/functions/generate-career-report/index.ts`. Geen UI, routing of datawijzigingen.

### Wat verandert

De instructie voor de derde functie (type "verrassend") wordt in alle prompt-varianten aangepast om de AI meer creatieve vrijheid te geven, terwijl het opleidingsniveau als ankerpunt behouden blijft.

### Alle 5 prompt-branches worden aangepast:

**1. Nederlands (regulier Vinster)**
- System prompt (regel ~118-119): Van "Een verrassend, maar goed beargumenteerd alternatief" naar een instructie die expliciet vraagt om een creatievere, avontuurlijkere suggestie -- een functie die de gebruiker zelf niet snel zou bedenken, maar die qua opleidingsniveau en kernvaardigheden wél haalbaar is.
- User prompt (regel ~254): Van "één verrassend beroep (dat buiten verwachting ligt, maar goed onderbouwd is)" naar "één verrassend en avontuurlijk beroep -- iets dat de gebruiker zelf waarschijnlijk niet zou bedenken, maar dat wél aansluit bij het opleidingsniveau en de kernvaardigheden. Denk creatief en buiten de gebaande paden."

**2. Engels**
- System prompt (regel ~271): Zelfde aanpassing in het Engels -- "One surprising, more adventurous alternative... the user would not have thought of themselves, but that still matches their education level and core competencies."
- User prompt (regel ~417): Idem.

**3. Duits**
- System prompt (regel ~434): "Ein überraschender, kreativerer und etwas abenteuerlicherer Alternativberuf..."
- User prompt (regel ~572): Idem.

**4. Noors**
- System prompt (regel ~589): "Ett overraskende, mer kreativt og eventyrlig alternativ..."
- User prompt (regel ~736): Idem.

**5. ErasmusMC branch (regel ~1062)**
- Regel 4 in de regels wordt uitgebreider: "Functie 3 is bewust verrassend en avontuurlijk -- een functie uit een andere categorie die de medewerker zelf niet snel zou bedenken, maar die wél aansluit bij het opleidingsniveau en de kernvaardigheden. Durf creatief te zijn, maar houd het haalbaar."

**6. Generiek Medisch Centrum branch (regel ~1136)**
- Zelfde aanpassing als ErasmusMC branch regel 4.

### Belangrijk: wat NIET verandert
- Het opleidingsniveau blijft een harde constraint in alle prompts
- De derde functie moet nog steeds een bestaand, reeel beroep zijn
- Max 3 woorden functietitel, max 40 woorden beschrijving -- allemaal ongewijzigd
- De JSON output structuur verandert niet

### Bestand

| Bestand | Wat |
|---------|-----|
| `supabase/functions/generate-career-report/index.ts` | Prompt tekst voor "verrassend" beroep aanscherpen in alle 6 branches (NL/EN/DE/NO + ErasmusMC + generiek MC) |

Na wijziging wordt de edge function opnieuw gedeployd.

