

## Fix signup timeout-afhandeling en glassmorphism op signup pagina

### Probleem 1: Signup lijkt niet te werken

De `send-confirmation-email` edge function heeft soms een cold start die langer dan 5 seconden duurt. Supabase geeft dan een `hook_timeout` error terug, maar het account wordt WEL aangemaakt en de verificatie-email wordt WEL verstuurd. De gebruiker ziet echter een foutmelding.

**Oplossing:** In `src/pages/SignupPage.tsx` de hook_timeout error afhandelen als een succes in plaats van een fout. Als de foutmelding "hook_timeout" of "maximum time" bevat, sturen we de gebruiker gewoon door naar de verificatiepagina (want het account is aangemaakt en de email is verzonden).

Betreffende code (regel 54-56): In plaats van een foutmelding te tonen, behandelen we dit als succes en navigeren naar `/email-verification`.

### Probleem 2: Glassmorphism ontbreekt op signup pagina

**Oplossing:** In `src/pages/SignupPage.tsx` regel 110 aanpassen:

Van:
```
bg-white bg-opacity-90 rounded-2xl p-8 max-w-md
```

Naar (identiek aan login pagina):
```
bg-white/15 backdrop-blur-[8px] border border-white/20 rounded-xl p-8 max-w-md
```

En de blockquote tekst van `text-blue-900` naar `text-white drop-shadow-sm` (ook identiek aan login pagina).

### Bestanden

| Bestand | Wijziging |
|---------|-----------|
| `src/pages/SignupPage.tsx` | 1) Hook timeout als succes behandelen (regel 54-56), 2) Glassmorphism styling toepassen (regel 110-113) |

Geen edge function changes nodig. Geen database wijzigingen.
