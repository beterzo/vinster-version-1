

## Knopkleur consistent maken op alle auth-pagina's

Op de **loginpagina** wordt de juiste donkere navy kleur (`#232D4B`) gebruikt voor de hoofdknop. Op de overige auth-pagina's (signup, wachtwoord vergeten, wachtwoord resetten, e-mail bevestigd, wachtwoord reset success) wordt het lichtere Tailwind `blue-900` gebruikt. Dit wordt overal gelijkgetrokken naar `#232D4B`.

### Aanpassingen

**`src/pages/SignupPage.tsx`**
- Knop: `bg-blue-900 hover:bg-blue-800` wordt `bg-[#232D4B] hover:bg-[#1a2350]`
- Afronding: `rounded-lg` wordt `rounded-[10px]` (consistent met login)

**`src/pages/ForgotPasswordPage.tsx`**
- Knop: `bg-blue-900 hover:bg-blue-800` wordt `bg-[#232D4B] hover:bg-[#1a2350]`
- Afronding: `rounded-lg` wordt `rounded-[10px]`

**`src/pages/ResetPasswordPage.tsx`**
- Knop: `bg-blue-900 hover:bg-blue-800` wordt `bg-[#232D4B] hover:bg-[#1a2350]`
- Afronding: `rounded-lg` wordt `rounded-[10px]`

**`src/pages/EmailConfirmedPage.tsx`**
- Knop: `bg-blue-900 hover:bg-blue-800` wordt `bg-[#232D4B] hover:bg-[#1a2350]`
- Afronding: `rounded-lg` wordt `rounded-[10px]`

**`src/pages/PasswordResetSuccessPage.tsx`**
- Link-knop: `bg-blue-900 hover:bg-blue-800 rounded-lg` wordt `bg-[#232D4B] hover:bg-[#1a2350] rounded-[10px]`

### Wat NIET verandert
- De loginpagina (die is al goed)
- Outline/secondary knoppen (CheckEmailPasswordResetPage, EmailVerificationPage)
- Geen andere pagina's of componenten
