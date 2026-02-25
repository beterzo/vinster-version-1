

# Visual Polish & Design System Overhaul

A comprehensive styling improvement across the entire Vinster application. No functionality, routing, or data logic changes -- only design, styling, and UI polish.

---

## Scope Summary

| Area | Key Changes |
|------|-------------|
| Global / Design System | Unified color palette, shadows, border-radius, hover transitions |
| Homepage | Hero CTA, feature cards, process steps, testimonial, footer |
| Login Page | Glassmorphism quote, input focus states, layout alignment |
| Trajectory Page | Stepper cleanup, progress bar, step cards, logo removal |
| Form Pages | Progress bar labels, input styling, button sizing, instruction pages |
| 404 Page | Branded design with logo and styled button |

---

## 1. Global / Design System

**Files**: `tailwind.config.ts`, `src/index.css`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/button.tsx`

- Remove light-blue card backgrounds (`#A8C6E3`, `#E6F0F6`, `#E8F4FD`) that look like disabled states -- replace with white + subtle shadow or very light gray
- Update default shadow utility to `box-shadow: 0 2px 16px rgba(0,0,0,0.08)` (slightly stronger than current 0.06)
- Increase default border-radius on `Input` and `Textarea` components to `rounded-[10px]`
- Add global hover transitions: all buttons get `transition-all duration-200` and cards get `hover:-translate-y-[1px]`
- Ensure all text on colored backgrounds meets 4.5:1 contrast ratio (especially white text on light blue cards and yellow buttons)

---

## 2. Homepage

**Files**: `src/components/HeroSection.tsx`, `src/components/WhatIsVinsterCard.tsx`, `src/components/WhatDoYouGetCard.tsx`, `src/components/ProcessSteps.tsx`, `src/components/TestimonialSection.tsx`, `src/components/Footer.tsx`

**Hero Section**:
- Add a prominent yellow CTA button ("Start hier voor EUR29") below the description text: `px-8 py-4 text-lg bg-[#F5C518] text-[#232D4B] rounded-full font-bold`
- Increase hero headline (`h1`) to `text-5xl` (48px) with more vertical spacing

**Feature Cards**:
- "Wat is Vinster?" card: change from `#A8C6E3` (washed-out blue) to white with a subtle border and shadow, matching visual weight -- dark text instead of white
- "Wat krijg je?" card: keep dark blue (`#0476B9`) but ensure all body text is `text-white` (not `opacity-95`)
- Increase internal padding on both cards to `p-10` (2.5rem)

**Process Steps**:
- Make all 4 step icons consistent: all filled circles in dark navy (`#232D4B`) with white icons inside (remove yellow, light blue, and outline variants)
- Fix connector line so it doesn't overlap icons (use `z-index` layering)
- Add subtle light gray background (`bg-[#f5f5f3]`) to visually separate from adjacent sections

**CTA Button ("Begin je traject EUR29")**:
- Make larger: `min-w-[240px] h-[52px]`
- Use white text on yellow background for better contrast
- Add hover darkening effect

**Testimonial Banner**:
- Reduce dark overlay opacity to ~40% (`bg-opacity-40`)
- Add name/role placeholder below quote text
- Style quote block with glassmorphism: `bg-white/15 backdrop-blur-[4px] border border-white/20 rounded-xl`

**Footer**:
- Change background to dark navy (`bg-[#232D4B]`)
- Make all text and links white/light gray
- Add subtle top border separator
- Update hover states for white links
- Use white version of the Vinster logo

---

## 3. Login Page

**File**: `src/pages/LoginPage.tsx`

- Quote overlay: change to glassmorphism -- `bg-white/15 backdrop-blur-[8px] border border-white/20 rounded-xl` with white text
- "Onthoud mij" and "Wachtwoord vergeten?" are already on the same row with `justify-between` -- no change needed
- Input focus states: add `focus:border-[#232D4B] focus:bg-[#f8f9ff]` (very light blue background tint)

---

## 4. Trajectory Page (Jouw loopbaantraject)

**Files**: `src/pages/RondeDashboard.tsx`, `src/components/JourneyStepNavigator.tsx`, `src/components/ProgressStep.tsx`, `src/components/journey/WelkomInline.tsx`

**Header stepper bar (RondeDashboard)**:
- Keep only one progress indicator (the header one is clean, remove the redundant one if present in WelkomInline when not in overview mode)
- Stepper visual consistency:
  - Completed: navy background circle with checkmark (already done)
  - Active: yellow/amber background circle with step number (already done)
  - Locked: light gray background circle with lock icon (already done)
- Increase spacing between stepper items (`gap-3` instead of `mx-1.5`)

**WelkomInline ("Jouw voortgang" overview)**:
- Remove the Vinster logo from the center of the card -- replace with a simple compass/rocket icon or just let the title stand alone
- Widen the yellow progress bar to full width and add a percentage label
- Remove `#E8F4FD` (light blue) backgrounds from completed step cards -- use white with navy left border instead
- Remove `#E8F4FD` from the "total time" info box -- use light gray instead

**Step cards (ProgressStep)**:
- Badge system:
  - "Voltooid" badge: navy background, white text (already in place as blue badge)
  - "Aan de beurt" badge: yellow/amber background, dark text (already in place)
  - Locked cards: `opacity-50` with lock icon (already done)
- Add a clear "Ga verder" button to the active/current step card
- Hover effect on clickable cards (already done with `hover:-translate-y-0.5`)
- Change active card accent from left border to bottom border in brand yellow

---

## 5. Form Pages

**Files**: `src/pages/EnthousiasmeStep1.tsx`, `src/pages/EnthousiasmeIntro.tsx`, `src/pages/WensberoepenStep1.tsx`, `src/pages/WensberoepenStep2.tsx`, `src/pages/WensberoepenStep3.tsx`, `src/pages/EnthousiasmeStep2.tsx`, `src/pages/EnthousiasmeStep3.tsx`, `src/components/EnthousiasmeProgress.tsx`, `src/components/WensberoepenProgress.tsx`, `src/components/ui/textarea.tsx`, `src/pages/PrioriteitenActiviteiten.tsx`, `src/pages/PrioriteitenInteresses.tsx`, `src/pages/PrioriteitenWerkomstandigheden.tsx`, `src/pages/ExtraInformatieVragen.tsx`

**Page background**: Change from `bg-gray-50` to `bg-[#fafaf8]`

**Progress indicator (EnthousiasmeProgress / WensberoepenProgress)**:
- Replace thin bar with a labeled full-width bar: "Vraag X van Y" text above it with percentage fill

**Question labels**:
- Increase font-size to `text-base` (16px) with `font-semibold`
- Add a thin left border accent in yellow next to each label: `border-l-2 border-[#F5C518] pl-3`

**Textarea / Input styling** (global via components):
- Focus state: `focus:border-[#232D4B] focus:bg-[#f8f9ff]`
- Textarea minimum height: `min-h-[100px]`
- Placeholder: `placeholder:text-gray-400 placeholder:italic`
- Border-radius: `rounded-[10px]`
- Disable horizontal resize: `resize-y` (via CSS)

**Navigation buttons**:
- Height: `h-12` (48px) minimum
- "Volgende" (primary): `bg-[#232D4B] text-white hover:bg-[#1a2350]` -- filled navy
- "Vorige" (secondary): `bg-transparent border border-[#232D4B] text-[#232D4B]`
- Disabled state: `bg-gray-200 text-gray-400 cursor-not-allowed`

**Instruction pages (EnthousiasmeIntro, WensberoepenIntro)**:
- Reduce headline from `text-4xl` to `text-2xl`
- Add a subtle yellow-tinted banner at the top of instruction cards
- Increase body text `leading-[1.7]`

---

## 6. 404 Page

**File**: `src/pages/NotFound.tsx`

- Add Vinster logo at the top
- Use brand colors: navy heading, gray description
- Styled "Terug naar home" button using the primary brand style (navy or yellow CTA button)
- Warm off-white background (`bg-[#fafaf8]`)
- Add a friendly Dutch message

---

## Technical Notes

- All changes are CSS/Tailwind only -- no functionality, routing, or data logic changes
- All existing Dutch copy is preserved exactly as-is
- Color palette strictly limited to: dark navy (#232D4B), yellow (#F5C518), white, light gray (#f8f8f8 / #fafaf8)
- Light blue backgrounds (#E8F4FD, #E6F0F6, #A8C6E3) will be replaced with white + shadow or light gray
- Hover transitions use `transition-all duration-200` consistently
- Many files will be touched but each change is small (class name swaps)

