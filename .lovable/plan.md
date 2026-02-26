

## Aanpassingen branch pagina (/organisaties/medisch-centrum)

### Wat verandert

**1. Verwijder Section 2 (het losse code-invoerblok)**
Het aparte blok "Heeft u een organisatiecode?" met placeholder "bijv. molewaterplein" wordt verwijderd.

**2. Pas Section 3 aan (specifieke organisaties)**
Het bestaande blok "Hoor je bij een specifieke organisatie?" blijft behouden met de tekst. Maar in plaats van een "Vul code in" knop die doorlinkt naar /organisaties/erasmus-mc, komt er per organisatie een inline code-invoerveld:
- Een tekstveld met placeholder "Vul hier je code in"
- Een "Bevestig" knop ernaast
- Validatie en foutmelding direct inline
- Bij succes: context opslaan en doorgaan naar intro

**3. Erasmus MC logo toevoegen**
Het geupload logo wordt gekopieerd naar het project en getoond naast de Erasmus MC naam in de organisatie-kaart, zodat het er professioneel en herkenbaar uitziet.

### Technische details

**Bestand: `src/pages/OrganisatieLanding.tsx`**
- Verwijder Section 2 (regels 231-272)
- Pas Section 3 aan: vervang de `Button` per child org door een inline `form` met `Input` + `Button`
- Voeg state toe per child org voor code/error/validating (gebruik een object met child.id als key)
- Placeholder wordt "Vul hier je code in"
- Bij submit: roep `validate-organisation-code` aan met `branch_slug: slug`
- Toon het Erasmus MC logo als afbeelding naast de naam in de kaart

**Bestand: Erasmus MC logo**
- Kopieer het geuploade logo naar `public/images/erasmus-mc-logo.png`
- Toon het in de child org kaart naast de naam (ca. 40-48px hoog)

De layout per child org kaart wordt:
- Links: logo + organisatienaam
- Daaronder of ernaast: code invoerveld + bevestig knop
- Foutmelding inline onder het veld
