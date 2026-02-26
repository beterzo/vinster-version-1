

## Organisatie-context behouden door signup/verificatie/login flow

### Probleem
Wanneer iemand via de organisatie-kant (bijv. `/organisaties/erasmus-mc`) een account aanmaakt, wordt de organisatie-context gewist omdat `SignupPage` bij het laden `clearOrganisation()` aanroept. Na verificatie en inloggen belandt de gebruiker daardoor in de normale Vinster-flow in plaats van de organisatie-flow.

### Oorzaak
- `SignupPage` regel 30-32: `useEffect(() => { clearOrganisation(); }, [])` wist altijd de organisatie-context uit localStorage
- Na login wordt er gekeken naar `user_organisation_sessions` in de database, maar die bestaat nog niet voor een nieuwe gebruiker

### Oplossing (3 kleine wijzigingen)

**1. `src/pages/SignupPage.tsx` -- Stop met organisatie-context wissen**
- Verwijder de `useEffect` die `clearOrganisation()` aanroept (regels 30-32)
- Verwijder ook de `clearOrganisation` import uit `useOrganisation()`
- De organisatie-context in localStorage blijft nu bewaard door de hele signup/verify/login flow

**2. `src/pages/LoginPage.tsx` -- Na login: org-sessie aanmaken en juiste redirect**
- Na succesvolle login, check of er een organisatie-context in localStorage staat (via `useOrganisation`)
- Als die er is: maak een `user_organisation_sessions` record aan in de database (zodat het gebruik gelogd wordt voor facturatie)
- Redirect naar `/organisaties/:slug/intro` in plaats van `/home`
- Als er geen org-context is: gedrag blijft exact hetzelfde als nu (redirect naar `/home`)

**3. `src/pages/LandingPage.tsx` -- Org-context wissen op de landingspagina (vangnet)**
- Verplaats de `clearOrganisation()` aanroep naar de LandingPage, zodat mensen die via de normale route binnenkomen altijd een schone context hebben
- Dit voorkomt dat een oude org-context per ongeluk actief blijft als iemand later via de homepage inlogt

### Flow na de fix
1. Gebruiker bezoekt `/organisaties/erasmus-mc` -> vult code in -> org-context opgeslagen in localStorage
2. Gaat naar intro -> moet inloggen -> redirect naar `/login` -> klikt "Account aanmaken"
3. `SignupPage` laadt -> org-context blijft bewaard
4. Account aangemaakt -> verificatie-email -> klikt link -> e-mail bevestigd
5. Logt in op `/login` -> org-context gevonden in localStorage -> org-sessie aangemaakt in DB -> redirect naar `/organisaties/erasmus-mc/intro`
6. Gebruiker zit direct in de organisatie-flow

### Wat niet verandert
- Normale gebruikers (zonder org-context) merken niks
- De organisatie-landing en intro-pagina's blijven ongewijzigd
- De bestaande org-sessie restore bij login (voor terugkerende gebruikers) blijft werken
