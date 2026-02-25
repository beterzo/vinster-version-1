

## Antwoorden vergrendelen na voltooiing persoonsprofiel

### Wat er verandert

Zodra het persoonsprofiel is voltooid (`prioriteitenCompleted && extraInformatieCompleted`), worden de stappen **enthousiasmescan**, **wensberoepen** en **persoonsprofiel** op read-only gezet. De gebruiker kan ze nog bekijken, maar niet meer aanpassen.

### Aanpassing

**Bestand:** `src/hooks/useStepAccess.tsx`

Alleen de `canEdit` logica voor 3 stappen wijzigen:

```
// Huidige logica:
enthousiasme.canEdit = !isBlockedByCompletedReport
wensberoepen.canEdit = enthousiasmeCompleted && !isBlockedByCompletedReport
persoonsprofiel.canEdit = isWensberoepenComplete && !isBlockedByCompletedReport

// Nieuwe logica:
enthousiasme.canEdit = !persoonsprofielCompleted && !isBlockedByCompletedReport
wensberoepen.canEdit = enthousiasmeCompleted && !persoonsprofielCompleted && !isBlockedByCompletedReport
persoonsprofiel.canEdit = isWensberoepenComplete && !persoonsprofielCompleted && !isBlockedByCompletedReport
```

De `blockedReason` voor deze 3 stappen krijgt een extra conditie: als `persoonsprofielCompleted` true is, toon een melding als "Je profiel is voltooid. Je kunt je antwoorden alleen bekijken." (vertaalsleutel `dashboard.step_blocked.profiel_completed`).

**Vertalingen** (4 bestanden: `nl/dashboard.json`, `en/dashboard.json`, `de/dashboard.json`, `no/dashboard.json`):
- Nieuwe sleutel `step_blocked.profiel_completed` toevoegen met passende tekst per taal.

### Wat niet verandert
- `canAccess` blijft hetzelfde (gebruiker kan altijd naar de stap navigeren om te bekijken)
- De bestaande read-only UI (amber banner, disabled inputs) wordt automatisch actief via `getStepMode()` die al `canEdit` checkt
- Geen routing- of datalogica wijzigingen

### Scope
- 5 bestanden (1 hook + 4 locale files)
- Puur logica-aanpassing, geen UI-wijzigingen nodig (read-only modus bestaat al)
