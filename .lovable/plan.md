

## Visual Improvements to Rapport Output Page

Changes apply to `src/components/journey/RapportInline.tsx` (the on-screen "complete" view, lines 369-480) and `src/components/RapportViewer.tsx`. Print-only components are left untouched.

---

### 1. Ideale functie - three content blocks (RapportInline lines 374-422)

Replace the current mixed-background sections with unified white cards:

| Current | New |
|---------|-----|
| Section 1: `bg-[#FEF3C7] border-l-4 border-[#F5C518]` | `bg-white rounded-xl shadow-card border border-[#f0f0f0] border-l-[5px] border-l-[#F5C518] p-8 mb-6` |
| Section 2: `bg-[#fffbeb] border-l-4 border-[#F5C518]` | Same white card, `border-l-[#1a2e5a]` |
| Section 3: `bg-[#fffbeb] border-l-4 border-[#232D4B]` | Same white card, `border-l-[#16a34a]` |

Number badges change from `w-6 h-6` to `w-8 h-8` with updated colors:
- Badge 1: `bg-[#F5C518] text-[#1a2e5a]`
- Badge 2: `bg-[#1a2e5a] text-white`
- Badge 3: `bg-[#16a34a] text-white`

Section headings: `text-lg font-bold text-[#1a2e5a]`. Body text: `text-[0.95rem] leading-[1.7] text-[#374151]`.

### 2. Keyword chips

Default chips (sections 2 and 3):
```
bg-[#f3f4f6] text-[#1a2e5a] border border-[#e5e7eb] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]
```

Section 1 (amber) chips:
```
bg-[#fffbeb] text-[#92400e] border border-[#fde68a] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]
```

### 3. Beroepskaarten (RapportInline lines 424-461)

Replace current cards with:
```
bg-white rounded-xl shadow-card border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 mb-5 relative
```

- Title: `text-lg font-bold text-[#1a2e5a] mb-2`
- Description: unchanged color, but add a helper function `boldQuotedKeywords(text)` that finds `"keyword"` patterns in the description text and replaces them with bold spans (`font-bold text-[#1a2e5a]`) without the quotes
- Badge moves to `absolute top-4 right-4` position (top-right corner of card)
- "Passend" badge: `bg-[#16a34a] text-white`
- "Verrassend" badge: `bg-[#F5C518] text-[#1a2e5a]`

### 4. Print button (RapportInline lines 464-472)

Update to a more prominent secondary button:
```
bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] px-5 py-2.5 font-semibold text-[0.9rem] flex items-center gap-2
```
Printer icon stays at `w-4 h-4`.

### 5. Loading state toast (RapportInline lines 298-304)

Replace the current centered spinner with a fixed-position toast notification:
```
fixed bottom-6 right-6 z-50 bg-[#1a2e5a] text-white rounded-[10px] px-5 py-3 flex items-center gap-3 shadow-lg text-sm font-medium
```
Add CSS `@keyframes spin` inline for the spinner animation (small 16px border-spinner). Display the existing translation text next to it.

### 6. RapportViewer.tsx (standalone viewer)

Apply same visual changes to the screen view (pages 2 and 3):
- Page 2 "ideale functie": Convert three plain `<p>` blocks into the same white-card-with-left-border system with keyword chips instead of comma-separated text
- Page 3 "beroepen": Apply the same card styling with badges and bold-keywords helper
- Print button: Update to match the new secondary button style
- Background: Change `bg-gray-100` to `bg-[#fafaf8]`

### Files affected

| File | Changes |
|------|---------|
| `src/components/journey/RapportInline.tsx` | Sections 1-5: card styling, chips, beroepskaarten, print button, loading toast |
| `src/components/RapportViewer.tsx` | Same visual system for standalone viewer (pages 2-3), background color, print button |
| `src/utils/keywordUtils.ts` | Add `boldQuotedKeywords()` helper that strips quotes and bolds keywords in description text |

No changes to data fetching, routing, translations, or print-only components.

