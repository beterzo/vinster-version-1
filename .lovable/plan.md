

## E-mailverificatie verplicht maken op de verificatiepagina

### Wat er verandert
De huidige pagina zegt "Account aangemaakt! Je kunt nu direct inloggen." Dit wordt aangepast naar een duidelijke boodschap dat de gebruiker eerst zijn/haar e-mail moet bevestigen voordat hij/zij kan inloggen.

### Wijzigingen

**1. `src/pages/EmailVerificationPage.tsx`**
- Verwijder de "Account aangemaakt!" soft-verify flow
- Toon in plaats daarvan een Mail-icoon (in plaats van CheckCircle) met de boodschap "Controleer je e-mail"
- Beschrijving: "We hebben een verificatielink naar je e-mailadres gestuurd. Klik op de link om je account te activeren."
- Verwijder de gele "je hoeft de mail niet te openen" notice
- Vervang de primaire "Inloggen" knop door een subtielere "Terug naar inloggen" link
- Houd de "E-mail niet ontvangen?" sectie met resend-functionaliteit

**2. `src/locales/nl/auth.json`** - Alleen NL
- `soft_verify_title` --> "Controleer je e-mail"
- `soft_verify_description` --> "We hebben een verificatielink naar je e-mailadres gestuurd. Klik op de link in de e-mail om je account te activeren."
- `soft_verify_notice` --> "Het kan een paar minuten duren voordat de e-mail binnenkomt. Controleer ook je spam folder."
- `go_to_login` --> "Terug naar inloggen"

**3. `src/locales/en/auth.json`** - Alleen EN
- Zelfde aanpassingen in het Engels

**4. `src/locales/de/auth.json`** en `src/locales/no/auth.json`**
- Zelfde aanpassingen in Duits en Noors

### Visuele wijzigingen
- Icoon: van groen vinkje (CheckCircle) naar blauw mail-icoon (Mail)
- Achtergrondkleur icoon: van groen naar blauw
- Gele notice-box: wordt een neutrale info-box met de spam-tip
- Primaire knop "Inloggen" wordt een secundaire/outline knop "Terug naar inloggen"
