
# Alle organisatietypen klikbaar maken in navigatie

## Wat er verandert

De vier inactieve organisatietypen (Universiteit, Zorg en Welzijn, Hogeschool, Mbo-instelling) worden klikbaar gemaakt in zowel de desktop dropdown als het mobiele menu. Wanneer iemand erop klikt, gaan ze naar `/organisaties/{slug}`.

Omdat deze organisaties niet als actief in de database staan, toont de bestaande `OrganisatieLanding` pagina automatisch de "Toegang tot Vinster voor jouw organisatie? Neem contact op" melding -- precies het gewenste resultaat.

## Aanpassingen

### 1. `src/components/DesktopNavigation.tsx`
- Verwijder het onderscheid tussen `available: true` en `available: false`
- Alle items worden klikbare links naar `/organisaties/{slug}`
- Verwijder de "Neem contact op" tooltip bij inactieve items
- Verwijder de grijze styling voor inactieve items

### 2. `src/components/MobileMenu.tsx`
- Zelfde aanpassing: alle organisatie-items worden klikbaar
- Verwijder de `disabled` state en "Binnenkort" labels
- Alle items navigeren naar `/organisaties/{slug}`

Er zijn geen database- of backend-wijzigingen nodig. De bestaande fallback op de landingspagina regelt de contactmelding.
