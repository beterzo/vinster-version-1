

## Organisatie-indicator op het loopbaantraject

Een subtiele badge/indicator toevoegen aan de hero-sectie van de RondeDashboard pagina, zodat je altijd kunt zien of je in een normaal Vinster-traject zit of in een organisatie-traject -- en zo ja, welke branche of welk bedrijf.

### Wat je ziet

**Normaal traject:** Geen extra indicator, alles blijft zoals het nu is.

**Organisatie-traject (categorie, bijv. "Medisch Centrum"):**
Een kleine badge onder de titel "Jouw loopbaantraject" met een gebouw-icoon en de branchenaam, bijv.:
`🏢 Medisch Centrum`

**Organisatie-traject (specifiek bedrijf, bijv. "ErasmusMC"):**
Badge toont zowel de branche als het bedrijf:
`🏢 Medisch Centrum — ErasmusMC`

De badge krijgt een subtiele stijl (lichtgele achtergrond, donkere tekst) die past bij het bestaande design.

### Technisch

**Bestand: `src/pages/RondeDashboard.tsx`**

In het hero-blok (regel 292-307), direct onder de huidige `<p>` met "Stap X van Y", wordt een conditoneel blok toegevoegd:

- Als `isOrganisationMode` true is, toon een `<div>` met:
  - Een `Building2` icoon (uit lucide-react)
  - De `organisationName` uit de OrganisationContext
  - Als er een `accessCodeId` is (= specifiek bedrijf), wordt de naam van het bedrijf getoond; anders alleen de branchenaam
- Styling: `inline-flex items-center gap-1.5 text-xs font-medium bg-[#FEF9E6] text-[#232D4B] px-3 py-1 rounded-full mt-1.5`

Alle benodigde data (`isOrganisationMode`, `organisationName`, `organisationAccessCodeId`) is al beschikbaar in de component via de `useOrganisation()` hook (regel 30).

| Bestand | Wijziging |
|---------|-----------|
| `src/pages/RondeDashboard.tsx` | Organisatie-badge toevoegen in hero-sectie (~5 regels) |

Geen nieuwe bestanden, geen database-wijzigingen, geen edge function changes.
