

## Organisatie-modus onthouden en herstellen bij login

### Hoe het werkt
Wanneer iemand zich aanmeldt via de organisatie-flow, wordt er al een record aangemaakt in de `user_organisation_sessions` tabel (met `user_id` en `organisation_type_id`). Dit gebruiken we als bron van waarheid.

### Aanpak

**Bij login**: na succesvol inloggen checken we of de gebruiker een `user_organisation_sessions` record heeft. Zo ja, dan herstellen we de organisatie-context en sturen we door naar `/home`. Zo nee, dan blijft alles normaal.

**Bij signup**: als iemand zich aanmeldt via de organisatie-flow (context is actief), dan verandert er niets -- de huidige flow werkt al correct. Als iemand zich aanmeldt via de normale flow, dan wordt de context gewist (zoals nu al het geval is).

**clearOrganisation op LoginPage verwijderen**: de login-pagina mag de organisatie-context niet meer wissen, omdat we juist na login willen checken of de gebruiker bij een organisatie hoort.

### Technische wijzigingen

| Bestand | Wijziging |
|---------|-----------|
| `src/pages/LoginPage.tsx` | 1. Verwijder `clearOrganisation()` useEffect. 2. Na succesvolle login: query `user_organisation_sessions` + bijbehorende `organisation_types` voor de ingelogde user. Als er een sessie is, roep `setOrganisation()` aan met de juiste data en navigeer naar `/home`. Als er geen sessie is, navigeer normaal naar `/home`. |
| `src/hooks/useAuth.tsx` | In de `onAuthStateChange` SIGNED_IN handler: voeg een check toe die `user_organisation_sessions` ophaalt voor de user. Als er een record is, herstel de organisatie-context via een callback/event. |

### Gekozen aanpak: LoginPage-niveau

De eenvoudigste en betrouwbaarste aanpak is om de logica in `LoginPage.tsx` te houden:

1. **Verwijder** de `clearOrganisation()` useEffect uit LoginPage
2. **Na succesvolle login** (in de `handleSubmit` else-tak, waar nu `navigate("/home")` staat):
   - Query `user_organisation_sessions` voor de net ingelogde user (via `supabase.auth.getUser()` of het auth-resultaat)
   - Join met `organisation_types` om de `slug` en `name` op te halen
   - Als er een record is: `setOrganisation({ organisationTypeId, accessCodeId: null, slug, name })` en dan `navigate("/home")`
   - Als er geen record is: gewoon `navigate("/home")` (normaal traject)

3. **LandingPage en SignupPage** behouden hun `clearOrganisation()` -- die zijn immers de entry-points van de normale flow

### Wat er NIET verandert
- De organisatie-flow zelf (OrganisatieLanding.tsx)
- De `clearOrganisation()` op LandingPage en SignupPage
- De database-structuur (we gebruiken bestaande tabellen)

### Resultaat
- Normale gebruiker logt in via `/login` --> komt in normaal traject
- Organisatie-gebruiker logt in via `/login` --> organisatie-context wordt automatisch hersteld uit de database
- Iemand die via de landingspagina of signup komt --> organisatie-context wordt altijd gewist

