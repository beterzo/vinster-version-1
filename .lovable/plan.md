

# Premium Redesign: RondeDashboard Journey Page

## Overview

Redesign the RondeDashboard (`/ronde/:roundId`) and its child components to feel premium, modern, and trustworthy -- inspired by Notion/Linear aesthetics while staying true to Vinster's existing blue (#232D4B) / yellow (#F5C518) brand palette.

**Important**: The project uses a strict blue + yellow color scheme. No green or teal will be introduced. Completed states use blue, active states use yellow, locked states use gray.

---

## What Changes

### 1. RondeDashboard Page (`src/pages/RondeDashboard.tsx`)
- Change background from `bg-gradient-to-b from-gray-50 to-white` to a warm off-white `bg-[#F8F7F5]`
- Add a subtle hero area at the top with a motivating headline and progress indicator ("Stap X van 6")
- Increase padding and max-width for a more spacious, editorial layout
- Wrap the step navigator in a redesigned container with better shadow and spacing
- Add a thin progress bar under the hero showing overall journey completion

### 2. JourneyStepNavigator (`src/components/JourneyStepNavigator.tsx`)
- Redesign step buttons: white cards with `box-shadow: 0 2px 16px rgba(0,0,0,0.06)` and 16px border-radius
- Active step: left border accent in yellow (#F5C518), slightly elevated shadow, subtle scale
- Completed steps: blue (#232D4B) checkmark badge, light blue (#E8F4FD) background
- Locked steps: `opacity-50`, lock icon, no hover effect
- Add smooth hover transitions: `transition-all duration-200`, `hover:translate-y-[-2px]` on accessible steps
- Add tooltips on locked steps: "Voltooi stap X eerst"
- Connector lines between steps: refined with a gradient from blue to gray

### 3. WelkomInline / Progress Overview (`src/components/journey/WelkomInline.tsx`)
- Step cards: redesign with premium white cards, subtle shadows, hover lift effect
- Active step card: expanded with full description, yellow left border accent
- Completed step cards: compact with checkmark, blue accent
- Locked step cards: muted opacity, lock icon, tooltip on hover
- Progress bar: "Stap X van 6 -- [Step Name]" with thin bar underneath
- "Goed om te weten" section: redesign as a warm coach-tip callout with light yellow (#FEF9E6) background, rounded corners, info/lightbulb icon, and a friendly tone

### 4. ProgressStep (`src/components/ProgressStep.tsx`)
- Redesign cards: white background, `shadow-[0_2px_16px_rgba(0,0,0,0.06)]`, `rounded-2xl`
- Active step: left-4 border in yellow, slightly elevated shadow
- Hover: `hover:-translate-y-0.5 hover:shadow-md` transition
- Locked: `opacity-50`, no hover, cursor-not-allowed
- Completed: blue checkmark icon, light blue background tint

### 5. ImportantInfoCard (`src/components/ImportantInfoCard.tsx`)
- Redesign from solid blue box to a soft callout card
- Light yellow (#FEF9E6) background with a lightbulb or info icon
- Rounded-2xl, subtle border, warm and inviting "coach tip" feel
- Text in dark gray (#374151) instead of white for readability

### 6. CSS/Tailwind Updates (`src/index.css` and `tailwind.config.ts`)
- Add custom shadow utility: `shadow-card: 0 2px 16px rgba(0,0,0,0.06)`
- Add hover translate keyframe for smooth lift effect
- Ensure `#F8F7F5` warm off-white is available as a utility

### 7. Progress component (`src/components/ui/progress.tsx`)
- No changes needed -- already uses yellow-400 indicator which fits the brand

---

## Visual Design Principles Applied

- **Background**: Warm off-white (#F8F7F5) instead of pure white/gray
- **Cards**: White with subtle shadow (0 2px 16px rgba(0,0,0,0.06)), 16px border-radius
- **Active states**: Yellow (#F5C518) accents (left border, badges)
- **Completed states**: Blue (#232D4B) checkmarks, light blue (#E8F4FD) tints
- **Locked states**: Gray, opacity-50, lock icons, tooltips
- **Typography**: Existing urw-form font, clear hierarchy (bold 20px titles, regular 15px descriptions in #6B7280)
- **Micro-interactions**: Hover lift (-2px translateY), smooth transitions (200ms), elevated shadows on hover
- **Coach tip**: Warm yellow callout instead of solid blue block

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/RondeDashboard.tsx` | Hero section, warm background, progress indicator |
| `src/components/JourneyStepNavigator.tsx` | Premium step pills with shadows, hover effects, tooltips |
| `src/components/journey/WelkomInline.tsx` | Premium step cards, coach tip callout |
| `src/components/ProgressStep.tsx` | Card redesign with shadows, hover lift, left border accent |
| `src/components/ImportantInfoCard.tsx` | Coach tip callout style |
| `tailwind.config.ts` | Custom shadow utility |

---

## Technical Details

- All hover effects use Tailwind's `transition-all duration-200` and `hover:-translate-y-0.5`
- Card shadows use inline style or custom Tailwind class: `shadow-[0_2px_16px_rgba(0,0,0,0.06)]`
- Tooltips on locked steps use existing Radix `Tooltip` component (already in the project)
- No new dependencies needed
- All existing Dutch copy preserved exactly as-is
- Color palette strictly adheres to blue (#232D4B) + yellow (#F5C518) -- no green/teal/indigo introduced

