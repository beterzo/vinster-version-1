
## Global Design System Fixes for Vinster

This plan addresses 6 categories of visual inconsistencies across the entire application. No functionality, routing, or data logic will be changed.

---

### 1. Eliminate All Light Blue Backgrounds

Replace every instance of light blue backgrounds (`#E8F4FD`, `#E6F0F6`, `bg-blue-50`, etc.) with the correct design system alternatives.

**Files affected (13 files):**

| File | Current | Replacement |
|------|---------|-------------|
| `src/components/WelcomeCard.tsx` | `backgroundColor: '#E6F0F6'` | `bg-white border border-[#e5e7eb] shadow-card` |
| `src/components/DataSafetySection.tsx` | `backgroundColor: '#E6F0F6'` | `bg-white border border-[#e5e7eb] shadow-card` |
| `src/pages/PaymentRequired.tsx` (2 cards) | `backgroundColor: '#E6F0F6'` | `bg-white border border-[#e5e7eb] shadow-card` |
| `src/components/StepCard.tsx` | `backgroundColor: '#E8F4FD'` (badge + icon bg) | Badge: `bg-[#232D4B] text-white`. Icon bg: `bg-[#232D4B]/10` |
| `src/components/RapportActies.tsx` | `backgroundColor: '#E8F4FD'` (icon bg + keyword chips) | Icon: `bg-[#232D4B]/10`. Chips: `bg-[#fffbeb] text-[#232D4B]` |
| `src/components/journey/RapportInline.tsx` | `bg-[#E8F4FD]` (section backgrounds, beroepen cards) | Section bg: `bg-[#fffbeb] border-l-4 border-[#F5C518]`. Beroepen cards: `bg-white border border-[#e5e7eb]` |
| `src/components/journey/ZoekprofielInline.tsx` | `bg-[#E8F4FD]` (CTA block + icon circle) | CTA: `bg-[#fffbeb] border-l-4 border-[#F5C518]`. Icon circle: `bg-[#232D4B]/10` |
| `src/components/journey/OnderzoeksplanInline.tsx` | `bg-[#E8F4FD]` | `bg-[#fffbeb] border-l-4 border-[#F5C518]` |
| `src/components/journey/OrganisatieOnderzoeksplanInline.tsx` | `bg-[#E8F4FD]` | `bg-[#fffbeb] border-l-4 border-[#F5C518]` |
| `src/components/ZoekprofielViewer.tsx` | `bg-[#E8F4FD]` | `bg-[#fffbeb] border-l-4 border-[#F5C518]` |
| `src/pages/OrganisatieIntro.tsx` | `bg-[#E8F4FD]` | `bg-[#fffbeb] border-l-4 border-[#F5C518]` |
| `src/pages/EmailVerificationPage.tsx` | `bg-blue-50 border-blue-200` | `bg-[#fffbeb] border border-amber-200` |
| `src/pages/PrioriteitenInteresses.tsx` | `bg-blue-50` (submitting state) | `bg-[#fffbeb]` |

---

### 2. Primary Button Consistency

Replace all `hover:bg-blue-50` secondary button hover states and ensure consistent button styling.

**Global find-and-replace across ~25 files:**
- `hover:bg-blue-50` becomes `hover:bg-[rgba(26,46,90,0.05)]`
- `border-blue-900 text-blue-900` becomes `border-[#1a2e5a] text-[#1a2e5a]`
- Any yellow/amber primary action buttons get changed to `bg-[#1a2e5a] text-white hover:bg-[#142347]`

**Files with `hover:bg-blue-50` (25 files):** OverVinster, OrganisatieLanding, ZoekprofielIntro, AdminOrganisatieGebruik, AdminErasmusMCVacatures, CookieSettings, OrganisatiesOverzicht, Ervaringen, WensberoepenInline, CheckEmailPasswordResetPage, WensberoepenVoltooiPagina, AdminVacatures, RapportInline, Contact, ZoekprofielAntwoorden, OnderzoeksplanPagina, VeelgesteldeVragen, AlgemeneVoorwaarden, Cookiebeleid, PrivacyVerklaring, VoorWieIsHet, ProfielVoltooienIntro, OrganisatieIntro, RapportDownload, ZoekprofielDownload, and more.

**Disabled state:** Add `disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:transform-none` where missing.

---

### 3. Global Card Styling

Ensure all white content cards use: `bg-white rounded-xl shadow-card border border-[#f0f0f0]`.

Clickable cards add: `transition-all duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover`.

**Key files to audit:** StepCard.tsx, ProgressStep.tsx, ProgressSection.tsx, WelcomeCard.tsx, DataSafetySection.tsx, ImportantInfoCard.tsx, EnNuVerderSection.tsx, FeatureCards.tsx.

Most cards already follow this pattern. Minor adjustments needed for `border-radius: 12px` consistency (some use `rounded-3xl`, standardize to `rounded-xl`).

---

### 4. Stepper / Navigation Bar Responsive Fix

**File:** `src/components/JourneyStepNavigator.tsx`

Changes:
- Wrap container with `overflow-hidden` (remove `overflow-x-auto`)
- Hide step labels on small screens: `<span className="hidden md:inline whitespace-nowrap">`
- On medium screens, add `max-w-[8ch] truncate` to labels
- On large screens, show full labels
- Locked steps: ensure `opacity-50 text-[#9ca3af]` and Lock icon at 14px (`w-3.5 h-3.5`)

---

### 5. Badge / Status Chip System

**Files:** `src/components/ProgressStep.tsx`, `src/components/StepCard.tsx`

Standardize badge colors:

| Status | Background | Text Color |
|--------|-----------|------------|
| Voltooid | `#16a34a` | `#ffffff` |
| Aan de beurt | `#F5C518` | `#1a2e5a` |
| Vergrendeld | `#e5e7eb` | `#6b7280` |

In **ProgressStep.tsx:**
- Line 103: Change `bg-[#232D4B] text-white` to `bg-[#16a34a] text-white` for "Voltooid"
- Line 108: Keep `bg-[#F5C518] text-[#232D4B]` (already correct)

In **StepCard.tsx:**
- Line 36: Change `backgroundColor: '#E8F4FD', color: '#232D4B'` to `backgroundColor: '#16a34a', color: '#ffffff'` for completed badge
- Line 43: Keep amber for active (already correct)
- Line 50: Keep gray for locked (already correct)

In **RapportInline.tsx:**
- "Verrassend" badge (line 469): Change `bg-[#78BFE3]` to `bg-[#F5C518] text-[#1a2e5a]`
- "Passend" badge: Change to `bg-[#16a34a] text-white` (already navy, change to green)

---

### 6. Page Background

Replace `bg-gray-50` with `bg-[#fafaf8]` across all 27+ page files.

**Global find-and-replace:**
- `min-h-screen bg-gray-50` becomes `min-h-screen bg-[#fafaf8]`

**Files affected:** Contact, RapportDownload, RapportBekijken, ZoekprofielDownload, AdminPasswordGate, OnderzoeksplanPagina, WensberoepenVoltooiPagina, ProfielVoltooienIntro, PrivacyVerklaring, AdminOrganisatieGebruik, AdminErasmusMCVacatures, Ervaringen, VeelgesteldeVragen, ZoekprofielAntwoorden, AdminPortal, AlgemeneVoorwaarden, VoorWieIsHet, ToegangscodesProfessionals, Cookiebeleid, AdminVacatures, ZoekprofielIntro, FeatureCards, and more.

The Dashboard already uses `bg-[#fafaf8]` (correct).

---

### Summary of scope

- **~43 files** will be touched
- **Zero** functional changes
- All changes are CSS class / inline style swaps
- Decorative elements using `#78BFE3` in print layouts (RapportInline, OrganisatieOnderzoeksplanInline, VoorbeeldrapportGenerator) are kept as-is since those are intentional brand color blocks for PDF/print output
