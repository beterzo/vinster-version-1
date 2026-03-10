

## Quote glassmorphism aanpassing

Twee pagina's moeten worden bijgewerkt zodat de quote-overlay dezelfde glassmorphism-stijl krijgt als Login, Signup en EmailVerification:

### Wijzigingen

**1. `src/pages/ForgotPasswordPage.tsx`** (regel ~89-92)
- Verander `bg-white bg-opacity-90 rounded-2xl p-8 max-w-md` naar `bg-white/15 backdrop-blur-[8px] border border-white/20 rounded-xl p-8 max-w-md`
- Verander `text-xl font-medium text-blue-900 leading-relaxed` naar `text-xl font-medium text-white leading-relaxed drop-shadow-sm`

**2. `src/pages/CheckEmailPasswordResetPage.tsx`** (regel ~83-86)
- Zelfde wijzigingen als hierboven

Dit brengt beide pagina's in lijn met de glassmorphism-stijl van de andere auth-pagina's.

