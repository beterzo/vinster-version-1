

## Visuele verbeteringen Onderzoeksplan pagina

Alleen styling-wijzigingen in 1 bestand: `src/components/journey/OnderzoeksplanInline.tsx`. Geen content, data of routing verandert.

### Huidige situatie

De buttons zijn al navy (`bg-[#1a2e5a]`), dus Section 1 is grotendeels in orde. De verbeteringen zitten in de step list layout en card structuur.

### Wijzigingen in `page2` blok (regels 57-110)

**Section 5 - Card wrapper:**
Vervang de huidige `Card` + `CardContent` wrapper door een eigen card-div:
```
bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-8 md:px-10 max-w-[720px] mx-auto
```

**Section 4 - Intro tekst boven de stappen:**
Voeg onder de titel een intro-paragraaf toe met de bestaande `page1.instruction` tekst (of een variant), gestyled als:
```
text-[0.95rem] leading-[1.7] text-[#6b7280] pb-5 border-b-2 border-[#f0f0f0] mb-5
```

**Section 2 - Stappen lijst:**
- Elk item: `flex items-start gap-4 py-4 border-b border-[#f0f0f0]` (laatste: geen border)
- Badge: `w-8 h-8 min-w-[32px] rounded-full bg-[#1a2e5a] text-white text-[0.8rem] font-bold flex items-center justify-center mt-0.5`
- Tekst: `text-[0.95rem] leading-[1.7] text-[#374151] flex-1`

**Section 3 - Fase-scheiders:**
Na stap 3 en stap 6: een dunne gele lijn `border-t-2 border-[#F5C518] my-2 opacity-40`

**Section 6 - Navigatieknoppen:**
Buttons in een flex-row met top-border:
```
flex justify-between items-center mt-8 pt-6 border-t border-[#f0f0f0]
```
- "Vorige": `bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] min-h-[48px] px-7 font-semibold`
- "Volgende": `bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white rounded-[10px] min-h-[48px] px-7 font-semibold`

### Wijzigingen in `page1` en `page3` blokken

Dezelfde navigatie-layout toepassen (flex-row met border-top, navy primary + outline secondary). De card wrapper ook hier verfijnen naar `rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)]` in plaats van `rounded-3xl shadow-xl`.

### Bestanden

| Bestand | Wat |
|---------|-----|
| `src/components/journey/OnderzoeksplanInline.tsx` | Alle 3 pages: card styling, step list layout, fase-scheiders, intro blok, navigatie layout |

Geen vertalingen nodig -- de intro tekst hergebruikt een bestaande vertaalsleutel.
