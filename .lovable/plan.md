

## Layout stappen-grid aanpassen: 2 boven + 3 onder

### Probleem
Bij 5 stappen (organisatie-modus) worden ze nu 3+2 verdeeld, wat er onevenwichtig uitziet. Bij 6 stappen (normaal) worden ze 3+3 verdeeld, wat prima is.

### Oplossing
In `src/components/journey/WelkomInline.tsx` de breedte per kaart dynamisch maken op basis van het totaal aantal stappen en de positie:

- **5 stappen (organisatie-modus):** eerste 2 kaarten krijgen `lg:w-[calc(50%-0.5rem)]` (2 per rij), de onderste 3 kaarten krijgen `lg:w-[calc(33.333%-0.75rem)]` (3 per rij)
- **6 stappen (normaal):** alle kaarten blijven `lg:w-[calc(33.333%-0.75rem)]` (3+3)

### Technisch
In de `cardContent` div (regel 120), de `lg:w-[...]` class dynamisch maken:

```
const lgWidth = totalSteps === 5 && index < 2
  ? 'lg:w-[calc(50%-0.5rem)]'
  : 'lg:w-[calc(33.333%-0.75rem)]';
```

De container (`flex flex-wrap justify-center gap-4`) blijft ongewijzigd.

### Bestand

| Bestand | Wijziging |
|---------|-----------|
| `src/components/journey/WelkomInline.tsx` | Dynamische breedte per kaart op basis van positie en totaal aantal stappen |

