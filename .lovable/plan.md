

# Fix: Prioriteiten-stappen verschijnen maar 1 keer

## Analyse

Na grondig onderzoek van de code heb ik de volgende bevinding:

De **persoonsprofiel substappen** zijn gedefinieerd als:
`intro -> extra_info -> activiteiten -> werkomstandigheden -> interesses`

Elke stap komt 1 keer voor in de configuratie. Het probleem zit waarschijnlijk in de **navigatie-logica**:

1. Wanneer een gebruiker de persoonsprofiel-stap verlaat (naar overview/welkom) en daarna terugkomt, wordt `subSteps[0]` = `intro` geladen
2. Vanuit `intro` gaat de gebruiker opnieuw door `extra_info` -> `activiteiten` -> etc.
3. Dit geeft het gevoel dat je **activiteiten 2 keer ziet**: een keer in de eerste doorloop, en dan opnieuw als je teruggaat via de stepper of overview

## Oplossing

### 1. Navigatie fixen: skip intro bij terugkeer

In `RondeDashboard.tsx` de `handleContinueFromOverview` en `handleStepClick` aanpassen zodat voor persoonsprofiel bij terugkeer de `intro` substep wordt overgeslagen als keywords al gegenereerd zijn. Dan landt de gebruiker direct op `extra_info` of `activiteiten`.

### 2. Verifieer substep-volgorde

De volgorde in `src/types/journey.ts` is:
```text
persoonsprofiel: ['intro', 'extra_info', 'activiteiten', 'werkomstandigheden', 'interesses']
```

Dit is correct: 1x extra info, 1x activiteiten, 1x werkomstandigheden, 1x interesses. De volgorde blijft behouden.

### 3. Bestanden die worden aangepast

- **`src/pages/RondeDashboard.tsx`**: `handleStepClick` en `handleContinueFromOverview` aanpassen om `intro` over te slaan wanneer AI-keywords al bestaan
- **`src/components/journey/PersoonsprofielInline.tsx`**: Geen wijzigingen nodig, de substep-rendering is correct

Dit zorgt ervoor dat elke prioriteiten-pagina (activiteiten, werkomstandigheden, interesses) precies 1 keer wordt getoond in het traject.

