

## Keywords: neutraal genereren, jij-vorm in rapport

### Probleem
Nu worden keywords met "Je" gegenereerd, wat ook zichtbaar is in het selectieproces. De gebruiker wil neutrale keywords bij het selecteren, en pas "Je" ervoor in het rapport.

### Aanpak

**1. `supabase/functions/generate-profile-keywords/index.ts`** — Prompts voor alle 4 talen terug naar neutraal
- Items worden gegenereerd zonder persoonlijk voornaamwoord
- Stijl: "bedenkt graag creatieve oplossingen", "werkt het liefst in een informele sfeer", "bent geïnteresseerd in technologie"
- In het selectieproces ziet de gebruiker dus neutrale zinnen

**2. `src/utils/keywordUtils.ts`** — Nieuwe functie `formatKeywordsWithJeVorm`
- Voegt "Je " toe aan het eerste item per categorie
- Laat de rest ongewijzigd (ze beginnen al met een werkwoord dat aansluit)
- Taalafhankelijk: NL → "Je", EN → "You", DE → "Du", NO → "Du"

**3. Rapportweergave aanpassen** — 3 bestanden
- `src/components/RapportViewer.tsx`: Bij het tonen van chips, "Je " toevoegen aan eerste item
- `src/components/journey/RapportInline.tsx`: Idem via `formatKeywordsForReport`
- `src/pages/VoorbeeldrapportGenerator.tsx`: Voorbeelddata updaten naar neutrale stijl, weergave met jij-vorm

**4. `supabase/functions/generate-career-report/index.ts`** — Geen wijziging nodig
- De keywords worden al direct uit de database gehaald (user-selected). De jij-vorm wordt alleen in de frontend toegevoegd bij weergave.

### Resultaat
- **Selectieproces**: "bedenkt graag creatieve oplossingen" ✓
- **Rapport**: "Je bedenkt graag creatieve oplossingen, werkt het liefst in een informele sfeer, bent geïnteresseerd in..." ✓

