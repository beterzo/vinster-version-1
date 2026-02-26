

## OrganisatieIntro toegankelijk maken zonder inloggen

### Wat verandert
De intro-pagina (`/organisaties/:slug/intro`) wordt publiek toegankelijk zodat gebruikers de uitleg kunnen lezen voordat ze een account aanmaken. De "Start Vinster" knop stuurt niet-ingelogde gebruikers naar de signup/login pagina.

### Wijzigingen

**1. `src/components/AppRouter.tsx` (regel 156) -- ProtectedRoute verwijderen**
- De route `/organisaties/:slug/intro` wordt van `<ProtectedRoute>` naar een gewone publieke route, net als `/organisaties/:slug`.

**2. `src/pages/OrganisatieIntro.tsx` (regel 162-169) -- CTA slim maken**
- Check of de gebruiker is ingelogd (via `useAuth`)
- Ingelogd: "Start Vinster" knop navigeert naar `/home` (zoals nu)
- Niet ingelogd: "Start Vinster" knop navigeert naar `/signup` (of `/login`), zodat ze eerst een account aanmaken en daarna via de login-flow (die we net gefixed hebben) automatisch terugkomen in de organisatie-flow

### Flow na de fix
1. Gebruiker vult code in op `/organisaties/erasmus-mc`
2. Komt op `/organisaties/erasmus-mc/intro` -- kan de hele uitleg lezen zonder account
3. Klikt "Start Vinster" -> wordt naar `/signup` gestuurd
4. Maakt account aan -> verificatie -> login -> belandt terug in organisatie-flow (dankzij eerdere fix)

