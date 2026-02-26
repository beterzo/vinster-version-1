
## Na login direct naar /home in plaats van intro-pagina

### Probleem
Na het aanmaken van een account via de organisatie-flow komt de gebruiker opnieuw op de intro-pagina (`/organisaties/:slug/intro`), terwijl die al gelezen is voor het aanmaken van het account.

### Oplossing
Een kleine aanpassing in `src/pages/LoginPage.tsx` (regel 83): verander de redirect van `/organisaties/${orgSlug}/intro` naar `/home`. De organisatie-context is al opgeslagen in localStorage en de org-sessie wordt aangemaakt in de database, dus de gebruiker belandt direct in het dashboard met de juiste organisatie-context actief.

### Wat verandert
- **`src/pages/LoginPage.tsx`** regel 83: `navigate("/home")` in plaats van `navigate(\`/organisaties/${orgSlug}/intro\`)`

### Flow na de fix
1. Gebruiker bezoekt `/organisaties/erasmus-mc` -> vult code in -> leest intro
2. Klikt "Start Vinster" -> gaat naar `/signup` -> maakt account aan
3. Verifieert e-mail -> logt in -> belandt direct op `/home` (dashboard)
4. De organisatie-context is actief, dus het dashboard toont de juiste organisatie-flow
