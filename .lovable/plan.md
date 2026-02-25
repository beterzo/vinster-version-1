

## Fix remaining `hover:bg-blue-50` instances

9 files still contain `hover:bg-blue-50` which should be `hover:bg-[rgba(26,46,90,0.05)]` per the design system. Additionally, `border-blue-900 text-blue-900` should become `border-[#1a2e5a] text-[#1a2e5a]`.

### Files to update

| File | Instances | Notes |
|------|-----------|-------|
| `src/pages/ZoekprofielDownload.tsx` | 4 buttons | Also fix `border-blue-900 text-blue-900` |
| `src/pages/CheckEmailPasswordResetPage.tsx` | 1 button | Also fix border/text colors |
| `src/pages/OverVinster.tsx` | 1 button | Also fix border/text colors |
| `src/pages/OrganisatieLanding.tsx` | 1 child button | Also fix border/text colors |
| `src/pages/AdminErasmusMCVacatures.tsx` | 1 button | Also fix border/text colors |
| `src/components/CookieSettings.tsx` | 1 button | Also fix border/text colors |
| `src/components/DesktopNavigation.tsx` | 2 dropdown items | Change to `hover:bg-[rgba(26,46,90,0.05)] hover:text-[#1a2e5a]` |
| `src/components/HelpPopover.tsx` | 1 icon button | Change to `hover:bg-[rgba(26,46,90,0.05)]` |
| `src/pages/ZoekprofielIntro.tsx` | 1 button | Also fix border/text colors |

### Change pattern

Every `hover:bg-blue-50` becomes `hover:bg-[rgba(26,46,90,0.05)]`, and every `border-blue-900 text-blue-900` becomes `border-[#1a2e5a] text-[#1a2e5a]`. Pure CSS class swaps, zero functional changes.

