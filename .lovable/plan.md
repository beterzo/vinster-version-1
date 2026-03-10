

## Vinster naar de jij-vorm: analyse en implementatieprompt

### Huidige situatie

Na analyse van de volledige codebase blijkt dat **het overgrote deel al in de jij-vorm staat**:
- Alle locale-bestanden (auth, dashboard, journey, rapport, common, etc.) gebruiken consequent "je/jij"
- Alle AI-prompts (generate-profile-keywords, generate-career-report, generate-zoekprofiel) gebruiken al "je/jij"
- Email-templates gebruiken al "je/jij"

### Wat nog formeel "u" gebruikt

Alleen de **juridische teksten** in `src/locales/nl/landing.json` (regels ~200-355):
- **Privacyverklaring** (secties 4-12): "uw persoonsgegevens", "U heeft", "u kunt", etc.
- **Algemene Voorwaarden** (secties 2-12): "U bent verantwoordelijk", "u gaat akkoord", etc.

Dit zijn ~30 voorkomens van "u/uw" verspreid over deze twee juridische secties.

### Implementatie

Eén bestand aan te passen: `src/locales/nl/landing.json` -- alle "u/uw" omzetten naar "je/jij/jouw" in de privacy- en voorwaardensecties.

### Prompt voor implementatie

Hier is de prompt die je mij kunt geven:

> **"Pas alle teksten in `src/locales/nl/landing.json` aan van de u-vorm naar de jij-vorm. Dit betreft de privacyverklaring (privacy_statement secties) en de algemene voorwaarden (terms secties). Vervang consequent: 'u' → 'je/jij', 'uw' → 'je/jouw', 'U heeft' → 'Je hebt', 'U bent' → 'Je bent', 'U kunt' → 'Je kunt'. Zorg dat de juridische teksten inhoudelijk correct blijven maar in de informele jij-vorm staan."**

