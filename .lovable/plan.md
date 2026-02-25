

## Organisatie-modus wissen bij normale navigatie

### Probleem
De organisatie-context wordt opgeslagen in localStorage en nooit gewist wanneer een gebruiker via de normale knoppen navigeert (Hero "Start hier", login, signup, etc.). Dit betekent dat als iemand eerder via een organisatie-pad is binnengekomen, de organisatie-modus actief blijft -- ook bij een normaal traject.

### Oplossing
Op drie strategische plekken `clearOrganisation()` aanroepen, zodat de organisatie-context altijd wordt gewist bij normale flow-entry points:

1. **`src/pages/LandingPage.tsx`** (of `src/components/HeroSection.tsx`)
   - Bij mount van de landingspagina: `clearOrganisation()` aanroepen. De landingspagina is het startpunt van de normale flow. Als iemand hier terechtkomt, moet de organisatie-context weg zijn.

2. **`src/pages/SignupPage.tsx`**
   - Bij mount: `clearOrganisation()` aanroepen. Signup via de normale knoppen = normaal traject.

3. **`src/pages/LoginPage.tsx`**
   - Bij mount: `clearOrganisation()` aanroepen. Inloggen via de normale knop = normaal traject.

De organisatie-modus wordt **alleen** gezet via `OrganisatieLanding.tsx` (de organisatie dropdown flow), dus die blijft onaangetast.

### Technische wijzigingen

| Bestand | Wijziging |
|---------|-----------|
| `src/pages/LandingPage.tsx` | Import `useOrganisation`, roep `clearOrganisation()` aan in een `useEffect` bij mount |
| `src/pages/SignupPage.tsx` | Import `useOrganisation`, roep `clearOrganisation()` aan in een `useEffect` bij mount |
| `src/pages/LoginPage.tsx` | Import `useOrganisation`, roep `clearOrganisation()` aan in een `useEffect` bij mount |

Per bestand wordt dit toegevoegd:

```tsx
import { useOrganisation } from "@/contexts/OrganisationContext";

// In de component:
const { clearOrganisation } = useOrganisation();

useEffect(() => {
  clearOrganisation();
}, [clearOrganisation]);
```

Dit is minimaal invasief: 3 regels per bestand, geen verandering aan bestaande logica. De organisatie-modus wordt alleen actief als de gebruiker expliciet via de organisatie-dropdown navigeert.
