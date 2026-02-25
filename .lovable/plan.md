

## Visuele verbeteringen voor 4 pagina's

Puur styling-wijzigingen. Geen data, routing of logica verandert.

---

### Pagina A: Dashboard

**Bestand: `src/components/Dashboard.tsx`**

**A1. "Belangrijk om te weten" sectie (regels 211-226)**
- Heading van `text-3xl` naar `text-base font-bold text-[#1a2e5a] mb-2`
- Body tekst items: `text-sm leading-[1.7] text-[#374151]` (was `text-[#232D4B]`)
- Bestaande `border-l-4 border-[#F5C518]` blijft behouden

**A2. Welcome header (regels 173-186)**
- Greeting: van `text-3xl` naar `text-[1.75rem] font-bold text-[#1a2e5a]`
- Description: `text-base leading-[1.7] text-[#4b5563] max-w-[600px]`
- Wrapper padding: `py-8 pb-6` (was via card padding)

**Bestand: `src/components/RoundsOverview.tsx`**

**A3. Spelrondes kaarten (regels 76-124)**
- Elke ronde-div: `border-l-4 border-[#1a2e5a] rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] p-5 hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-150`
- Voeg `ChevronRight` icon toe aan de rechterkant (18px, `text-[#9ca3af]`)
- "In uitvoering" badge: `bg-[#F5C518] text-[#1a2e5a]` (al correct)
- "Voltooid" badge: `bg-[#16a34a] text-white` (was `bg-[#232D4B]`)

**Bestand: `src/components/EnNuVerderSection.tsx`**

**A4. "En nu verder?" kaarten (regels 61-84)**
- Grid: `items-stretch` toevoegen voor gelijke hoogte
- CTA buttons in kaarten: van gele `bg-[#F5C518]` naar navy `bg-[#232D4B] text-white h-12 rounded-xl font-semibold`
- Container: `pb-8` toevoegen voor onderruimte

---

### Pagina B: Prioriteiten selectie (3 bestanden)

**Bestanden: `src/pages/PrioriteitenActiviteiten.tsx`, `PrioriteitenWerkomstandigheden.tsx`, `PrioriteitenInteresses.tsx`**

**B1. Keyword knoppen**
- Ongeselecteerd: `bg-white border-[1.5px] border-[#d1d5db] text-[#374151] rounded-[10px] py-3 px-4 text-sm font-medium hover:bg-[#f9fafb] hover:border-[#9ca3af] relative`
- Geselecteerd: `bg-[#F5C518]/10 border-2 border-[#F5C518] text-[#1a2e5a] font-bold relative` + checkmark element (absolute `top-1.5 right-2 text-[#F5C518] text-[0.65rem] font-black`)

**B2. Selectieteller**
- Vervang de huidige `<p className="text-sm text-gray-500 mt-2">` door een visueel teller-blok:
  - Container: `flex items-center gap-4 p-3 bg-white rounded-[10px] border border-[#e5e7eb] mb-5 max-w-md mx-auto`
  - Label "Geselecteerd" + vetgedrukte teller "X / 8"
  - Progress bar: `h-1.5 rounded-full bg-[#e5e7eb] flex-1` met fill `bg-[#F5C518]` (of `bg-[#16a34a]` als >= 5)
  - Wanneer >= 5: label wordt "Minimaal bereikt" in groen

**B3. Grid layout**
- Van `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` naar `grid-cols-2 md:grid-cols-3` (verwijder `lg:grid-cols-4`)

---

### Pagina C: Extra informatie vragen

**Bestand: `src/pages/ExtraInformatieVragen.tsx`**

**C1. Vraagnummer badges**
- Per vraag: label in een `flex items-center mb-2` row
- Badge: `inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1a2e5a] text-white text-xs font-bold mr-2.5 flex-shrink-0`
- Verwijder de huidige `border-l-4 border-[#F5C518] pl-3` van het label

**C2. Vraag labels**
- `text-base font-semibold text-[#1a2e5a]`

**C3. Witruimte**
- Van `space-y-8` naar `space-y-10` (of `mb-8` per vraagblok) voor meer ademruimte

**C4. Textarea styling**
- `border-[1.5px] border-[#d1d5db] rounded-[10px] min-h-[100px] p-3 text-[0.95rem] leading-[1.6] focus:border-[#1a2e5a] focus:bg-[#f8faff] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(26,46,90,0.08)]`
- Verwijder bestaande `border-[#232D4B] border-2 bg-[#f8f9ff]` (te donker in ruststand)

**C5. Navigatieknoppen**
- Wrapper: `flex justify-between mt-10 pt-6 border-t border-[#f0f0f0]` (was `pt-12`)

---

### Pagina D: Profiel voltooien intro

**Bestand: `src/pages/ProfielVoltooienIntro.tsx`**

**D1. Navy banner boven de kaart**
- Card krijgt `overflow-hidden rounded-xl`
- Bovenaan een banner-div: `bg-[#1a2e5a] rounded-t-xl p-6 px-8`
  - Badge: amber cirkel `w-8 h-8 rounded-full bg-[#F5C518] text-[#1a2e5a] font-bold text-sm flex items-center justify-center` met "3"
  - Titel: `text-[1.75rem] font-bold text-white`
  - Subtitle: `text-[0.95rem] text-white/70 mt-1`

**D2. Body tekst**
- `text-[0.95rem] leading-[1.8] text-[#374151] mb-5`

**D3. CTA knop**
- Van `bg-yellow-400 text-blue-900` naar `bg-[#1a2e5a] hover:bg-[#142347] text-white rounded-[10px] min-h-[48px] min-w-[240px] font-semibold text-base mt-8`

**D4. Waarschuwingsbox**
- Bewaar bestaande gele stijl, maar verfijn naar: `bg-[#fffbeb] border-l-4 border-[#F5C518] rounded-lg p-4 px-5 mb-6`
- "Let op:" label: `font-bold text-[#92400e]`
- Body: `text-[#374151]`

---

### Bestanden overzicht

| Bestand | Wijzigingen |
|---------|------------|
| `src/components/Dashboard.tsx` | A1 (belangrijk om te weten styling), A2 (welcome header) |
| `src/components/RoundsOverview.tsx` | A3 (ronde kaarten + ChevronRight + badge kleuren) |
| `src/components/EnNuVerderSection.tsx` | A4 (kaart hoogte, CTA buttons navy, padding) |
| `src/pages/PrioriteitenActiviteiten.tsx` | B1-B3 (keyword buttons, teller, grid) |
| `src/pages/PrioriteitenWerkomstandigheden.tsx` | B1-B3 (zelfde wijzigingen) |
| `src/pages/PrioriteitenInteresses.tsx` | B1-B3 (zelfde wijzigingen) |
| `src/pages/ExtraInformatieVragen.tsx` | C1-C5 (badges, labels, spacing, textarea, nav) |
| `src/pages/ProfielVoltooienIntro.tsx` | D1-D4 (banner, body, CTA, waarschuwingsbox) |

