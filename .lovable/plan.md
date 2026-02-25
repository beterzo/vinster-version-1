

## Fix: Laatste stap-kaart centreren in organisatie-modus

### Probleem
De laatste stap ("Onderzoeksplan") staat links uitgelijnd in een halve kolom, met lege ruimte rechts ernaast.

### Oplossing
In `src/components/journey/WelkomInline.tsx`, regel 140: de inner wrapper `max-width` aanpassen zodat de laatste oneven kaart niet dezelfde breedte krijgt als de actieve kaart (560px), maar 50% van de container — waardoor hij dezelfde visuele breedte heeft als de kaarten erboven.

**Regel 140** veranderen van:
```tsx
<div className={`${isFullWidth ? 'max-w-[560px] mx-auto' : ''}`}>
```
naar:
```tsx
<div className={`${isCurrent && isOrganisationMode ? 'max-w-[560px] mx-auto' : isLastOddNonActive ? 'sm:max-w-[50%] mx-auto' : ''}`}>
```

Dit zorgt ervoor dat:
- De **actieve kaart** nog steeds `max-w-[560px]` krijgt (prominent, gecentreerd)
- De **laatste oneven locked kaart** `max-w-[50%]` krijgt, waardoor hij dezelfde breedte heeft als de kaarten in de 2-koloms rijen erboven, maar gecentreerd staat
- Alle andere kaarten ongewijzigd blijven

### Bestand

| Bestand | Wijziging |
|---------|-----------|
| `src/components/journey/WelkomInline.tsx` | Regel 140: inner wrapper max-width conditioneel per kaarttype |

