

## Minimum kernwoorden van 5 naar 8

Alle plekken waar het minimum van 5 kernwoorden wordt afgedwongen, worden gewijzigd naar 8.

### Code-aanpassingen

**`src/pages/PrioriteitenActiviteiten.tsx`** -- `>= 5` wordt `>= 8` (2x)

**`src/pages/PrioriteitenWerkomstandigheden.tsx`** -- `>= 5` wordt `>= 8` (2x)

**`src/pages/PrioriteitenInteresses.tsx`** -- `>= 5` wordt `>= 8` (2x)

**`src/pages/RondeDashboard.tsx`** -- 3x `>= 5` wordt `>= 8` (completeness check)

**`src/components/journey/PersoonsprofielInline.tsx`** -- `minimumRequired = 5` wordt `minimumRequired = 8`

### Vertalingen (alle talen)

**Nederlands** (`nl/journey.json`):
- "Selecteer minimaal 5 activiteiten..." wordt "...minimaal 8..."
- "Geselecteerd: {count} van minimaal 5" wordt "...minimaal 8"
- Idem voor werkomstandigheden en interesses

**Nederlands** (`nl/common.json`):
- "Selecteer minimaal 5 items" wordt "...minimaal 8 items"
- "Je moet minimaal 5 items selecteren..." wordt "...minimaal 8 items..."

**Engels** (`en/common.json`):
- "Select at least 5 items" wordt "...at least 8 items"
- "You must select at least 5 items..." wordt "...at least 8 items..."

**Duits** (`de/common.json`):
- "Mindestens 5 Elemente auswahlen" wordt "...8 Elemente..."
- "...mindestens 5 Elemente..." wordt "...8 Elemente..."

**Noors** (`no/common.json`):
- "Velg minst 5 elementer" wordt "...8 elementer"
- "...minst 5 elementer..." wordt "...8 elementer..."

### Wat NIET verandert
- De `hasMinimumKeywords` functie in `usePrioriteitenResponses.tsx` (die checkt op `>= 3`, een andere drempel voor page completion tracking)
- De `isPageComplete` functie (ook `>= 3`)
- Geen styling, layout of andere logica
