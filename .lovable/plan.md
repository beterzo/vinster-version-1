

# Ankerlijst Medisch Centrum + AI Prompt Update

## Wat verandert

1. De ankerlijst wordt opgeslagen in de database op het `medisch-centrum` organisation_types record
2. De edge function `generate-career-report` krijgt een nieuwe prompt-branch voor **Medisch Centrum modus** (niet-ErasmusMC organisaties)
3. De bestaande **ErasmusMC branch** wordt uitgebreid: het gebruikt de ankerlijst als basis, plus de vacature-database als extra context

---

## Stap 1: Database — Ankerlijst opslaan

Update het `organisation_types` record voor "Medisch Centrum" (id: `5e25f5db-5d83-4368-9699-3167a86b3b70`) met de volledige ankerlijst in het `anchor_list` veld (JSONB).

Dit is een data-update, geen schema-wijziging.

---

## Stap 2: Edge Function — Organisatietype detectie uitbreiden

Momenteel detecteert de edge function alleen `isErasmusMC`. Dit wordt uitgebreid naar een bredere organisatie-detectie:

### Nieuwe logica (vervangt de huidige ErasmusMC-check op regel 912-960)

Wanneer `organisation_type_id` wordt meegegeven:

1. Haal het organisatietype op inclusief `anchor_list` en `parent_type_id`
2. Als het type een `parent_type_id` heeft (bijv. ErasmusMC -> Medisch Centrum):
   - Haal ook het parent type op om de `anchor_list` te erven
3. Bepaal de modus:
   - **ErasmusMC**: `is_unique = true` EN `slug = 'erasmus-mc'` -- gebruikt ankerlijst + vacature-database
   - **Medisch Centrum (generiek)**: heeft `anchor_list` -- gebruikt alleen ankerlijst
   - **Andere organisaties**: valt terug op de reguliere taal-specifieke prompt

### Ankerlijst formattering

De anchor_list JSON wordt omgezet naar een leesbare tekstlijst voor de prompt:

```text
1. Medisch Specialistische Zorg
   - Medisch specialist (bijv. internist, chirurg, cardioloog)
   - Arts-assistent (ANIOS)
   ...
2. Verpleegkundige Zorg (algemeen & specialistisch)
   - Verpleegkundige klinische afdeling
   ...
```

---

## Stap 3: Nieuwe prompt — Medisch Centrum modus

Een nieuwe system + user prompt die de bestaande gebruikersdata combineert met de ankerlijst-regels.

### System prompt (nieuw)
Loopbaancoach gespecialiseerd in interne mobiliteit binnen een medisch centrum. Kiest uitsluitend uit de opgegeven ankerlijst. Antwoordt in exact de gevraagde JSON-structuur.

### User prompt (nieuw)
Bevat:
- Alle gebruikersdata (wensberoepen, kernwoorden, extra toelichting, opleiding)
- De volledige ankerlijst als tekst
- De 6 strikte regels uit de opdracht:
  1. Kies PRECIES 3 functies uit de ankerlijst
  2. Minimaal 2 verschillende categorieen
  3. Functie 1 en 2 zijn logische matches
  4. Functie 3 is verrassend ("En als verrassing..." of "Misschien had je dit niet verwacht, maar...")
  5. Per functie 2-3 zinnen met kernwoord-verwijzing
  6. NOOIT functies buiten de ankerlijst

---

## Stap 4: ErasmusMC prompt aanpassen

De bestaande ErasmusMC prompt wordt uitgebreid met de ankerlijst als basis. De prompt wordt:

- Ankerlijst als primaire functiebron (geërfd van parent "Medisch Centrum")
- Vacature-database als aanvullende context voor concrete functietitels
- Dezelfde 6 regels als de generieke Medisch Centrum prompt
- Extra regel: "Gebruik de vacature-database om concrete functietitels te vinden die aansluiten bij de ankerlijst-categorieen"

---

## Bestanden

| Bestand | Actie |
|---------|-------|
| `organisation_types` (database) | **Data update** -- anchor_list invullen voor medisch-centrum |
| `supabase/functions/generate-career-report/index.ts` | **Wijzigen** -- organisatie-detectie uitbreiden, nieuwe Medisch Centrum prompt, ErasmusMC prompt aanpassen met ankerlijst |

---

## Technische details

### Edge function wijzigingen (generate-career-report/index.ts)

**Regel 912-960**: Vervang de huidige `isErasmusMC` detectie door een bredere check:

```text
1. Haal org type op: slug, is_unique, anchor_list, parent_type_id
2. Als parent_type_id bestaat -> haal parent op voor anchor_list
3. Bepaal anchorList = orgType.anchor_list || parentType?.anchor_list || null
4. isErasmusMC = orgType.is_unique && orgType.slug === 'erasmus-mc'
5. hasAnchorList = anchorList !== null
```

**Regel 962-1047**: Vervang de prompt-selectie door 3 branches:

```text
if (isErasmusMC && hasAnchorList) {
  // ErasmusMC: ankerlijst + vacatures
  prompts = getErasmusMCPrompts(userData, anchorListText, vacatureList);
} else if (hasAnchorList) {
  // Generiek Medisch Centrum: alleen ankerlijst
  prompts = getMedischCentrumPrompts(userData, anchorListText);
} else {
  // Regulier: taal-specifieke prompts
  prompts = getCareerReportPrompts(language, userData);
}
```

### Ankerlijst text-formatter functie

Een hulpfunctie die de JSON anchor_list omzet naar een leesbare string voor de AI prompt:

```typescript
function formatAnchorList(anchorList: any[]): string {
  return anchorList.map(cat =>
    `${cat.category}\n${cat.functions.map(f => `   - ${f}`).join('\n')}`
  ).join('\n\n');
}
```

