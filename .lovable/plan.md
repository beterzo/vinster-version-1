

## Verwijder de vraag "In welke organisatie/sector zou je willen werken?"

### Wat verandert

Het veld `sector_voorkeur` wordt verwijderd uit alle formulieren, weergaven en validatie. De database-kolom blijft bestaan (geen migratie nodig), maar wordt niet meer gevuld of uitgelezen in nieuwe invullingen.

### UI-aanpassingen

**1. `src/pages/ExtraInformatieVragen.tsx`**
- Verwijder `sector_voorkeur` uit de `answers` state
- Verwijder vraag 3 uit de `questions` array
- Verwijder `sector_voorkeur` uit de `allFieldsFilled` validatie
- De stap-indicator ("Stap 3 van 6") en vraagnummering blijft correct doordat de vragen automatisch hernummerd worden

**2. `src/components/journey/PersoonsprofielInline.tsx`**
- Verwijder `sector_voorkeur` uit `extraInfoAnswers` state
- Verwijder vraag 3 uit de `extraInfoQuestions` array
- Verwijder `sector_voorkeur` uit de `allFieldsFilled` check

**3. `src/components/EditExtraInfoDialog.tsx`**
- Verwijder `sector_voorkeur` uit `formData` state en het formulier (het "In welke sectoren" veld)

**4. `src/components/RapportActies.tsx`**
- Verwijder het blok dat `sector_voorkeur` toont

### Hook-aanpassingen

**5. `src/hooks/useExtraInformatieResponses.tsx`**
- Verwijder `sector_voorkeur` uit de `ExtraInformatieData` interface
- Verwijder uit initial state en reset state
- Verwijder uit `loadResponses` mapping

### Data/webhook-aanpassingen

**6. `src/hooks/useMakeWebhookData.ts`**
- Verwijder `sector_voorkeur` uit het webhook data object (2 plekken)

**7. `src/services/webhookService.ts`**
- Verwijder `sector_voorkeur` uit de interface

### AI prompt-aanpassingen

**8. `supabase/functions/generate-career-report/index.ts`**
- Verwijder `sectorVoorkeur` uit de `UserData` interface
- Verwijder de regel `sectorVoorkeur: extraInfoData?.sector_voorkeur || 'Niet ingevuld'` uit de data mapping
- In alle 4 talen (NL, EN, DE, NO):
  - Verwijder de `Sectorvoorkeur: ${data.sectorVoorkeur}` regel uit de user prompt
  - Verwijder verwijzingen naar "sectorvoorkeur" uit de system prompt instructies (bijv. "Houd daarbij rekening met het opleidingsniveau, fysieke beperkingen (indien van toepassing), sectorvoorkeur en andere context" wordt "...fysieke beperkingen (indien van toepassing) en andere context")
  - Idem voor EN ("sector preference"), DE ("Bevorzugter Sektor"), NO ("Foretrukket sektor")

### Vertalingen

**9. Alle taalbestanden** (`nl`, `en`, `de`, `no`):
- `journey.json`: Verwijder `question3` en `placeholder3` onder `extra_informatie`, hernummer `question4`/`placeholder4` naar `question3`/`placeholder3`
- `dashboard.json`: Verwijder de `sector_preference` vertaalsleutel

### Wat NIET verandert
- De database-kolom `sector_voorkeur` blijft bestaan (bestaande data blijft bewaard)
- De Supabase types (`types.ts`) worden niet handmatig aangepast (die worden automatisch gegenereerd)

