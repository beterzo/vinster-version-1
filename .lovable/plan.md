

## Erasmus MC los van het blok tonen

### Wat verandert

De huidige opzet toont Erasmus MC (en toekomstige organisaties) binnen het witte "Hoor je bij een specifieke organisatie?" blok als een kaart met code-invoer. De aanpassing haalt de organisatie-items uit dat blok en toont ze als losse, visuele kaarten eronder.

### Nieuwe layout

**Section 1** (intro + "Start het traject") -- blijft exact hetzelfde.

**Section 2** ("Hoor je bij een specifieke organisatie?") -- wordt een simpele tekst-sectie zonder witte kaart eromheen, alleen de koptekst en uitleg.

**Organisatie-kaarten** -- elke child org wordt een eigen los blok:

```text
+--------------------------------------------------+
|  [Erasmus MC logo]     Erasmus MC                 |
|                                                   |
|  [________Vul hier je code in________] [Bevestig] |
|                                                   |
+--------------------------------------------------+
```

- Elk een eigen wit afgerond blok met border en lichte shadow
- Logo links bovenin (groot genoeg, ca. 48px hoog), organisatienaam ernaast
- Code-invoer + bevestig-knop eronder
- Bij organisaties zonder logo: alleen de naam met een KeyRound icoon
- Schaalt goed als er later meer organisaties bijkomen (grid of stack)

### Technische details

**Bestand: `src/pages/OrganisatieLanding.tsx`**

1. Verwijder de omsluitende witte kaart (`div.bg-white.rounded-2xl`) rond Section 2
2. Houd de koptekst "Hoor je bij een specifieke organisatie?" en uitleg als losse tekst (zonder kaart-styling)
3. Render elke `childOrg` als een eigen `div.bg-white.rounded-2xl.shadow-sm.border` blok
4. Per blok: logo + naam bovenaan, code-invoer + knop eronder
5. Alle bestaande validatie-logica (`handleChildCodeSubmit`, state per child) blijft ongewijzigd

Geen andere bestanden wijzigen.
