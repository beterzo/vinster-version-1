
# Organisatie-dropdown uitbreiden met Transport en Financieel

## Wat verandert er

In beide navigatiecomponenten (`DesktopNavigation.tsx` en `MobileMenu.tsx`) worden twee items toegevoegd aan de `organisationItems` lijst:

- **"Transport"** (korte naam in menu) met tooltip/label **"Transport & Logistiek"** -- slug: `transport-en-logistiek`, available: true
- **"Financieel"** (korte naam in menu) met tooltip/label **"Financiele instellingen"** -- slug: `financiele-instellingen`, available: true

## Technische aanpak

Een nieuw veld `shortName` wordt toegevoegd aan elk item. Het menu toont `shortName` (als aanwezig), terwijl de volledige `name` wordt getoond in de tooltip (desktop) of als sublabel (mobiel).

De nieuwe lijst wordt:

```text
Medisch Centrum        (available, link)
  -> ErasmusMC         (available, link, indent)
Transport              (available, link) -- tooltip: "Transport & Logistiek"
Financieel             (available, link) -- tooltip: "Financiele instellingen"
Universiteit           (niet beschikbaar, tooltip: "Neem contact op")
Zorg en Welzijn        (niet beschikbaar, tooltip: "Neem contact op")
Hogeschool             (niet beschikbaar, tooltip: "Neem contact op")
Mbo-instelling         (niet beschikbaar, tooltip: "Neem contact op")
```

### Bestanden die worden aangepast

1. **`src/components/DesktopNavigation.tsx`** -- organisationItems lijst uitbreiden, shortName gebruiken als weergavenaam
2. **`src/components/MobileMenu.tsx`** -- zelfde aanpassing

Geen andere bestanden worden geraakt. Puur visueel/navigatie.
