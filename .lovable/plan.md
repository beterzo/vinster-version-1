

# Styling Update: Remaining Form Pages

Bring the 8 remaining form pages in line with the new design system already applied to `EnthousiasmeStep1`.

---

## Changes per file (identical pattern)

Each file gets these 4 small class-name swaps:

| What | Old | New |
|------|-----|-----|
| Page background | `bg-gray-50` | `bg-[#fafaf8]` |
| Card shadow | `shadow-xl` | `shadow-card` |
| Title color | `text-blue-900` | `text-[#232D4B]` |
| Question labels | `text-blue-900 font-medium text-lg` | `text-[#232D4B] font-semibold text-base border-l-2 border-[#F5C518] pl-3` |
| "Vorige" button | `border-blue-900 text-blue-900 hover:bg-blue-50` | `border-[#232D4B] text-[#232D4B] hover:bg-gray-50 h-12` |
| "Volgende" button (enabled) | `bg-yellow-400 hover:bg-yellow-500 text-blue-900` | `bg-[#232D4B] hover:bg-[#1a2350] text-white` |
| "Volgende" button (disabled) | `bg-gray-300 text-gray-500` | `bg-gray-200 text-gray-400` |
| Button height | (default) | `h-12` added |
| Textarea focus classes | `border-gray-300 focus:border-blue-900 focus:ring-blue-900` | removed (handled globally by updated Textarea component) |

---

## Files to update

1. **`src/pages/EnthousiasmeStep2.tsx`** -- 3 textarea questions
2. **`src/pages/EnthousiasmeStep3.tsx`** -- 3 textarea questions
3. **`src/pages/WensberoepenStep1.tsx`** -- job title input + 8 questions
4. **`src/pages/WensberoepenStep2.tsx`** -- job title input + 8 questions
5. **`src/pages/WensberoepenStep3.tsx`** -- job title input + 8 questions
6. **`src/pages/PrioriteitenActiviteiten.tsx`** -- keyword grid + extra text
7. **`src/pages/PrioriteitenWerkomstandigheden.tsx`** -- keyword grid + extra text
8. **`src/pages/PrioriteitenInteresses.tsx`** -- keyword grid + extra text + submit button
9. **`src/pages/ExtraInformatieVragen.tsx`** -- 4 textarea questions

Also update loading state backgrounds from `bg-gray-50` to `bg-[#fafaf8]` in each file.

---

## Keyword grid pages (Prioriteiten*)

Additional change for the keyword toggle buttons:
- Selected state: keep `bg-blue-900` as `bg-[#232D4B]` and `border-[#232D4B]`
- Unselected hover: change `hover:bg-blue-50` to `hover:bg-gray-50`

---

## No functionality changes

All routing, data saving, validation logic, and copy remain untouched. Only Tailwind class names are swapped.

