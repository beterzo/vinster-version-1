

## Visuele verbeteringen zoekprofiel output pagina

Puur styling-wijzigingen in 2 bestanden. Geen data, routing of generatielogica verandert.

### Bestanden

| Bestand | Wat |
|---------|-----|
| `src/components/ZoekprofielViewer.tsx` | Volledige visuele restyling van het zoekprofiel-document |
| `src/components/journey/ZoekprofielInline.tsx` | Floating titel + print-knop boven viewer verwijderen (verplaatst naar viewer zelf) |

---

### 1. ZoekprofielInline.tsx -- "complete" view (regels 231-264)

- **Verwijder** de losse `<h2>` titel en de print-knop boven de viewer (regels 234-248). De titel en print-knop zitten nu in de ZoekprofielViewer header zelf.
- Voeg een **tweede print-knop** toe onder de viewer, boven het "volgende stappen" blok, zodat de gebruiker altijd een printactie kan vinden.

### 2. ZoekprofielViewer.tsx -- volledige restyling

**Props**: voeg `onPrint?: () => void` prop toe zodat de print-knop in de header kan werken.

**Buitenste wrapper** (Section 6):
```
bg-white rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.1)] overflow-hidden max-w-[800px] mx-auto
```

**Header** (Section 1):
- Achtergrond: `bg-[#1a2e5a]` (was `#232D4B`)
- Padding: `p-8 md:px-10`
- Rounded: `rounded-t-xl` (via overflow-hidden op wrapper)
- Links: titel `text-[1.75rem] font-bold text-white` + naam `text-[0.95rem] text-white/70 mt-1`
- Rechts: Vinster logo + print-knop (wit op donker, `bg-white text-[#1a2e5a] border-2 border-white rounded-[10px] px-5 py-2.5 font-bold text-sm flex items-center gap-2`, hover: `hover:bg-white/15 hover:text-white`)

**Content blokken** (Section 2):
- Geen padding-wrapper meer; items direct in de card
- Elk item: `bg-white border-l-4 border-[#F5C518] px-7 py-5 border-b border-b-[#f0f0f0]`
- Laatste item: `border-b-0`
- Label: `text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#9ca3af] mb-1`
- Waarde: `text-[1.05rem] font-semibold text-[#1a2e5a] leading-[1.6]`

**Samenvatting** (Section 3):
- Container: `bg-[#fffbeb] border border-[#fde68a] border-l-4 border-l-[#F5C518] rounded-lg p-6 mx-7 my-6`
- Label: `text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#92400e] mb-2`
- Body: `text-[0.95rem] leading-[1.7] text-[#374151]`

**Footer** (Section 5):
- `bg-[#F5C518] px-10 py-3 flex items-center justify-between rounded-b-xl` (via overflow-hidden)
- Links: klein donker Vinster logo (`h-6`) + `vinster.ai` tekst `text-[#1a2e5a] text-sm font-semibold`
- Rechts: generatiedatum `text-[0.75rem] text-[#1a2e5a]/60`

**Print stylesheet** (Section 7):
- Bestaande print CSS behouden maar uitbreiden:
  - `print-color-adjust: exact` op header en footer
  - `box-shadow: none` op wrapper
  - Buttons verbergen (`print:hidden` class)
  - Rond corners verwijderen voor print

### Resultaat

Het zoekprofiel voelt als een samenhangende, printbare kaart: donkerblauwe header met titel + print-knop, 6 nette content-rijen met amber linkerborder, een warm samenvatting-blok, en een branded gele footer. Twee print-knoppen (header + onder viewer) zorgen dat de gebruiker altijd kan printen.
