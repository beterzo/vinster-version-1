

## Verrassende functie iets avontuurlijker maken

De 3e functiesugestie (het "verrassende" beroep) wordt in de AI-prompt iets sterker aangestuurd richting meer out-of-the-box denken. De aanpassing is subtiel -- geen grote koerswijziging, maar net een duwtje extra.

### Wat verandert

In `supabase/functions/generate-career-report/index.ts` worden alle prompt-teksten die de verrassende functie beschrijven iets aangescherpt. De kernboodschap blijft hetzelfde, maar we voegen instructies toe die het AI-model meer richting onverwachte, creatievere suggesties duwen.

### Aanpassingen per taal

**Nederlands (system + user prompt)**:
- "verrassend en avontuurlijk" wordt "verrassend, avontuurlijk en onverwacht"
- Toevoeging: "Kies bewust een richting die de gebruiker zelf nooit zou googelen of overwegen. Verras echt."
- "Denk creatief en buiten de gebaande paden" wordt "Denk creatief, durf te verrassen en ga bewust buiten de gebaande paden"

**Engels (system + user prompt)**:
- "surprising, more adventurous alternative" wordt "surprising, adventurous and unexpected alternative"
- Toevoeging: "Choose a direction the user would never search for or consider on their own. Truly surprise them."
- "Think creatively and outside the box" wordt "Think creatively, dare to surprise, and deliberately go outside the box"

**Duits (system + user prompt)**:
- "überraschender, kreativerer und etwas abenteuerlicherer" wordt "überraschender, abenteuerlicher und unerwarteter"
- Toevoeging: "Wähle bewusst eine Richtung, die die Person selbst nie googeln oder in Betracht ziehen würde. Überrasche wirklich."
- "Denke kreativ und über den Tellerrand hinaus" wordt "Denke kreativ, wage es zu überraschen und gehe bewusst über den Tellerrand hinaus"

**Noors (system + user prompt)**:
- "overraskende, mer kreativt og eventyrlig" wordt "overraskende, eventyrlig og uventet"
- Toevoeging: "Velg bevisst en retning brukeren aldri ville ha googlet eller vurdert selv. Overrask virkelig."
- "Tenk kreativt og utenfor boksen" wordt "Tenk kreativt, vag a overraske, og ga bevisst utenfor boksen"

**ErasmusMC prompt (lijn 1056)**:
- "bewust verrassend en avontuurlijk" wordt "bewust verrassend, avontuurlijk en onverwacht"
- Toevoeging: "Kies een functie waar de medewerker zelf nooit aan zou denken maar die wél past bij de kernvaardigheden."

**Generic Medisch Centrum prompt (lijn 1130)**:
- Zelfde aanpassing als ErasmusMC

### Wat NIET verandert
- De structuur van het rapport (nog steeds 2 passend + 1 verrassend)
- De JSON-output structuur
- De maximale woordlimiet (40 woorden)
- De eis dat het een bestaand beroep moet zijn
- Geen frontend-wijzigingen

### Technisch
Alleen het bestand `supabase/functions/generate-career-report/index.ts` wordt aangepast (10 tekst-wijzigingen in prompt strings). Na implementatie wordt de edge function opnieuw gedeployed.
