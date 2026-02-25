

## Layout fix: Organisatie-modus (5 stappen) - full-width actieve kaart + 2x2 grid

Alleen het grid-gedeelte in `src/components/journey/WelkomInline.tsx` wordt aangepast. Geen wijzigingen aan content, styling, badges, routing of kaart-opmaak.

### Wat verandert

**Alleen bij organisatie-modus (5 stappen):**
- De actieve/huidige stap wordt full-width weergegeven, gecentreerd met `max-width: 560px`
- De overige 4 stappen worden in een strak 2x2 grid getoond
- Als er een oneven aantal overige stappen is (bv. na voltooiing van stap 1), wordt de laatste kaart ook full-width gecentreerd

**Bij normale modus (6 stappen):** Geen verandering, blijft 3+3 flex-wrap layout.

### Technische aanpak

In de steps grid sectie (regel 111-229), de rendering conditioneel maken op `isOrganisationMode`:

**Organisatie-modus:** Gebruik een CSS grid container:
```
grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[800px] mx-auto
```

Per kaart:
- Actieve/huidige stap: `col-span-1 sm:col-span-2` + inner wrapper met `max-w-[560px] mx-auto`
- Locked/completed stappen: gewone grid cellen (`col-span-1`), met `h-full` voor gelijke hoogte
- Als het aantal overige stappen oneven is, krijgt de laatste ook `sm:col-span-2` + centered

**Normale modus:** Behoudt huidige `flex flex-wrap justify-center gap-4` met `lg:w-[calc(33.333%-0.75rem)]` (3+3).

### Responsive gedrag
- Onder `sm` (640px): alles 1 kolom, geen col-span nodig
- Boven `sm`: 2-koloms grid voor organisatie-modus

### Bestand

| Bestand | Wijziging |
|---------|-----------|
| `src/components/journey/WelkomInline.tsx` | Grid layout conditioneel per modus in het steps-renderblok (regels 111-229) |
