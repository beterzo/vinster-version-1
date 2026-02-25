

## Activiteiten minimum verlagen van 8 naar 5

De minimale selectie voor activiteiten wordt teruggebracht van 8 naar 5, zodat het gelijk is aan werkomstandigheden en interesses.

### Wat er verandert

Alle plekken waar "8" als minimum voor activiteiten staat worden aangepast naar "5":

**Code-logica (3 bestanden):**
- `src/pages/PrioriteitenActiviteiten.tsx` -- threshold van `>= 8` naar `>= 5`
- `src/components/journey/PersoonsprofielInline.tsx` -- aparte check voor activiteiten (8) wordt gelijkgetrokken naar 5
- `src/pages/RondeDashboard.tsx` -- completie-check van `>= 8` naar `>= 5`

**Vertalingen (4 talen):**
- `src/locales/nl/journey.json` -- "minimaal 8" wordt "minimaal 5"
- `src/locales/en/journey.json` -- "at least 8" wordt "at least 5"
- `src/locales/de/journey.json` -- "mindestens 8" wordt "mindestens 5"
- `src/locales/no/journey.json` -- "minst 8" wordt "minst 5"

### Technisch detail

In `PersoonsprofielInline.tsx` kan de speciale `type === 'activiteiten' ? 8 : 5` conditie worden vereenvoudigd naar een vaste waarde van `5` voor alle categorieen.

