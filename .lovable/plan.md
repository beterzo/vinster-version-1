

# Organisatie-intro en welkompagina dynamisch maken op basis van sector/organisatie

## Wat verandert

De intro-pagina (`OrganisatieIntro.tsx`) en het in-journey welkomscherm (`WelkomInline.tsx` in `RondeDashboard`) worden context-bewust. Afhankelijk van of de gebruiker in een **categorie** (bijv. "Medisch Centrum") of een **specifieke organisatie** (bijv. "ErasmusMC") zit, worden alle teksten aangepast.

### Logica voor het label

De `OrganisationContext` bevat al:
- `name`: "Medisch Centrum" of "ErasmusMC"
- `accessCodeId`: `null` (categorie) of ingevuld (specifieke org)

Op basis hiervan bepalen we het label:
- **Categorie** (`accessCodeId === null`): gebruik "een medisch centrum" / "deze branche" / de naam in lowercase
- **Specifieke org** (`accessCodeId !== null`): gebruik de exacte naam, bijv. "ErasmusMC"

---

## OrganisatieIntro.tsx — Alle tekstwijzigingen

De pagina krijgt de `useOrganisation()` hook en past alle hardcoded teksten aan:

| Huidige tekst | Categorie (Medisch Centrum) | Specifieke org (ErasmusMC) |
|---|---|---|
| "binnen jouw organisatie bij jou kunnen passen" | "binnen een medisch centrum bij jou kunnen passen" | "binnen ErasmusMC bij jou kunnen passen" |
| "concrete functie-ideeen binnen jouw organisatie" | "concrete functie-ideeen binnen een medisch centrum" | "concrete functie-ideeen binnen ErasmusMC" |
| "drie mogelijke functierichtingen" | "drie mogelijke functierichtingen in deze branche" | "drie mogelijke functierichtingen binnen ErasmusMC" |
| "Verder kijken dan jouw organisatie?" | "Verder kijken dan deze branche?" | "Verder kijken dan ErasmusMC?" |
| "buiten jouw organisatie" | "buiten deze branche" | "buiten ErasmusMC" |
| Wensberoepen beschrijving "binnen of buiten jouw eigen organisatie" | "binnen of buiten een medisch centrum" | "binnen of buiten ErasmusMC" |
| "bij welke interne functies jouw wensen passen" | "bij welke functies in een medisch centrum jouw wensen passen" | "bij welke functies binnen ErasmusMC jouw wensen passen" |

De stappen-teksten en resultaat-items worden van const naar dynamische variabelen die het label gebruiken.

## WelkomInline.tsx — Organisatiemodus

Het welkomscherm in de journey (`RondeDashboard`) toont momenteel de generieke Vinster stappen (6 stappen incl. zoekprofiel). In organisatiemodus moet dit aangepast worden:

1. Het component krijgt een optionele prop `organisationName` en `isOrganisationMode`
2. In organisatiemodus:
   - Toon alleen de 4 relevante stappen (enthousiasmescan, wensberoepen, persoonsprofiel, rapport) — geen zoekprofiel, onderzoeksplan wordt apart getoond
   - Pas de stap-beschrijvingen aan om de sector/organisatienaam te bevatten (zelfde logica als hierboven)
   - Pas de tips aan voor organisatiecontext

De `RondeDashboard.tsx` geeft de organisatie-props door aan `WelkomInline`.

---

## Bestanden

| Bestand | Actie |
|---------|-------|
| `src/pages/OrganisatieIntro.tsx` | **Wijzigen** — dynamische teksten op basis van `useOrganisation()` context (categorie vs specifieke org) |
| `src/components/journey/WelkomInline.tsx` | **Wijzigen** — optionele `organisationName` / `isOrganisationMode` props toevoegen, stappen en beschrijvingen aanpassen in org-modus |
| `src/pages/RondeDashboard.tsx` | **Wijzigen** — organisatie-props doorgeven aan `WelkomInline` |

---

## Technische details

### OrganisatieIntro.tsx

Het component gebruikt `useOrganisation()` om `name` en `accessCodeId` op te halen. Op basis daarvan:

```text
const isCategory = !accessCodeId;  // geen code = categorie
const contextLabel = isCategory
  ? `een ${name.toLowerCase()}`    // "een medisch centrum"
  : name;                          // "ErasmusMC"
const brancheLabel = isCategory
  ? "deze branche"
  : name;
```

Alle hardcoded strings in `steps`, `resultItems`, en de body-tekst worden functies die deze labels gebruiken.

### WelkomInline.tsx

Nieuwe props:

```typescript
interface WelkomInlineProps {
  onNext: () => void;
  completedSteps?: JourneyStep[];
  onStepClick?: (step: JourneyStep) => void;
  isOrganisationMode?: boolean;
  organisationName?: string | null;
  organisationAccessCodeId?: string | null;
}
```

In organisatiemodus:
- De stappen-array wordt gefilterd: alleen enthousiasme, wensberoepen, persoonsprofiel, loopbaanrapport (+ onderzoeksplan als laatste)
- De beschrijvingen worden aangepast met het organisatie-label
- De progress-berekening wordt aangepast op het juiste aantal stappen

### RondeDashboard.tsx

Geeft de extra props door:

```typescript
<WelkomInline
  onNext={handleContinueFromWelkom}
  completedSteps={completedSteps}
  onStepClick={handleStepClick}
  isOrganisationMode={isOrganisationMode}
  organisationName={name}
  organisationAccessCodeId={accessCodeId}
/>
```

Waarbij `name` en `accessCodeId` uit `useOrganisation()` komen (die al geimporteerd is op regel 21 en 30).

