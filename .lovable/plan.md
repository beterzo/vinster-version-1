

## Fix: Hoofdletters in AI-rapportteksten

### Probleem
De vorige fix ging te ver: de instructie "Alle woorden in de beschrijving moeten in kleine letters staan" zorgt ervoor dat de AI ook beroepstitels en het begin van zinnen in kleine letters schrijft. Heidi ziet nu correct lopende zinnen, maar zonder hoofdletters aan het begin en na punten.

### Oorzaak
De schrijfstijl-instructie in alle 10 prompt-blokken (2 functies x 4 talen + 2 extra NL) zegt expliciet dat alles in kleine letters moet. De AI volgt dit te letterlijk.

### Oplossing
De SCHRIJFSTIJL-instructie in alle prompt-blokken aanpassen. De nieuwe instructie moet:

1. **Beroepstitels**: beginnen met een hoofdletter (bijv. "Beleidsmedewerker arbeidsmarkt" i.p.v. "beleidsmedewerker arbeidsmarkt")
2. **Beschrijvingen**: elke zin begint met een hoofdletter, na elke punt ook een hoofdletter
3. **Keywords**: nog steeds subtiel verwerkt zonder random hoofdletters midden in zinnen

**Nieuwe NL-instructie:**
> "Schrijf vloeiende, natuurlijke zinnen. Begin elke zin met een hoofdletter, ook na een punt. Beroepstitels beginnen ook met een hoofdletter. Verwerk de kernwoorden subtiel in de tekst — gebruik ze NIET letterlijk met hoofdletters midden in een zin."

Equivalent voor EN, DE en NO.

### Bestanden
- `supabase/functions/generate-career-report/index.ts` — alle 10 SCHRIJFSTIJL/WRITING STYLE/SCHREIBSTIL/SKRIVESTIL blokken aanpassen
- Deploy edge function

### Resultaat
Toekomstige rapporten hebben correcte hoofdletters bij titels en zinnen, zonder de eerder opgeloste keyword-hoofdletter-bug terug te brengen.

