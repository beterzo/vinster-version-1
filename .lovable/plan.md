

## Fix: Dubbele bullets verwijderen in "Belangrijk om te weten"

### Probleem
Elke lijst-item heeft zowel een geel vinkje-icoon (vanuit de component) als een bullet-teken (`•`) in de tekst zelf. Dit geeft dubbele bullets.

### Oorzaak
De `•` staat hardcoded in `src/locales/nl/dashboard.json` bij elke `point1`–`point6` string.

### Oplossing
Verwijder het `•` teken (en de spatie erna) uit alle 6 punten in `src/locales/nl/dashboard.json`. Geen andere bestanden of talen worden aangepast.

| Regel | Oud | Nieuw |
|-------|-----|-------|
| 58 | `"• Er zijn geen goede of foute antwoorden..."` | `"Er zijn geen goede of foute antwoorden..."` |
| 59 | `"• Je kunt maximaal tien keer..."` | `"Je kunt maximaal tien keer..."` |
| 60 | `"• Alle informatie wordt vertrouwelijk..."` | `"Alle informatie wordt vertrouwelijk..."` |
| 61 | `"• Denk aan concrete situaties..."` | `"Denk aan concrete situaties..."` |
| 62 | `"• Het is juist goed om de antwoorden..."` | `"Het is juist goed om de antwoorden..."` |
| 63 | `"• Alle voortgang wordt automatisch opgeslagen"` | `"Alle voortgang wordt automatisch opgeslagen"` |

### Bestand

| Bestand | Wijziging |
|---------|-----------|
| `src/locales/nl/dashboard.json` | `•` verwijderen uit point1 t/m point6 (regels 58-63) |
