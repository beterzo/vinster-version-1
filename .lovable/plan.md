
## Fix 6-stappen grid layout op de journey overview

### Probleem
De 6 stappen in de normale (niet-organisatie) modus gebruiken nu `flex flex-wrap` met berekende breedtes per kaart. Dit levert een ongelijk grid op.

### Oplossing
Eén wijziging in `src/components/journey/WelkomInline.tsx`:

**Grid container (regel 114)**: vervang de `flex flex-wrap justify-center gap-4` class voor de normale modus door een CSS grid:

```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[960px] mx-auto
```

**Kaart-breedte (regel 138)**: verwijder de berekende breedtes (`w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]`) en gebruik simpelweg `col-span-1` -- de grid regelt de rest.

Dit geeft:
- Desktop (lg+): 3 kolommen x 2 rijen -- perfect symmetrisch
- Tablet (sm-lg): 2 kolommen (3 rijen)
- Mobiel (kleiner dan sm): 1 kolom

Geen wijzigingen aan content, iconen, tekst, routing of card-styling.
