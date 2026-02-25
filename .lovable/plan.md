

## Fix 6-stappen grid layout

### Probleem
De 6 stappen in normale modus gebruiken `flex flex-wrap` met berekende breedtes, wat een ongelijk grid oplevert.

### Oplossing
Eén bestand: `src/components/journey/WelkomInline.tsx`, twee kleine wijzigingen:

1. **Grid container (regel ~114)**: Vervang `flex flex-wrap justify-center gap-4` door:
   ```
   grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[960px] mx-auto
   ```

2. **Kaart wrapper (regel ~138)**: Verwijder de berekende breedtes (`w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]`) en gebruik `col-span-1`.

### Resultaat
- Desktop (lg+): 3 kolommen x 2 rijen -- symmetrisch
- Tablet (sm-lg): 2 kolommen
- Mobiel: 1 kolom

Geen wijzigingen aan content, iconen, tekst, routing of card-styling.

