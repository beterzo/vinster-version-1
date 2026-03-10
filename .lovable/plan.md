

## Kernwoorden als vloeiende opsomming

### Probleem
Nu begint elk keyword met "Je..." waardoor het bij het lezen als losse zinnen klinkt in plaats van één vloeiend verhaal.

### Gewenst resultaat
Per categorie moet de lijst leesbaar zijn als één doorlopende zin:
- Item 1: "Je bedenkt graag creatieve oplossingen"
- Item 2: "werkt het liefst in een informele sfeer"  
- Item 3: "bent geïnteresseerd in technologie en innovatie"
- etc.

Alleen het **eerste** item begint met "Je", de rest vervolgt zonder "Je" zodat het met komma's een natuurlijke opsomming vormt.

### Aanpassing

**1 bestand: `supabase/functions/generate-profile-keywords/index.ts`**

Prompts voor alle 4 talen aanpassen met deze instructie:

| Taal | Regel |
|------|-------|
| NL | Alleen het eerste item per categorie begint met "Je". De rest vervolgt zonder "Je" (bijv. "werkt het liefst…", "bent geïnteresseerd in…") |
| EN | Alleen het eerste item begint met "You". De rest vervolgt (bijv. "enjoy working in…", "are interested in…") |
| DE | Alleen het eerste item begint met "Du". De rest vervolgt (bijv. "arbeitest gerne…", "interessierst dich für…") |
| NO | Alleen het eerste item begint met "Du". De rest vervolgt (bijv. "liker å jobbe…", "er interessert i…") |

Voorbeelden in de prompt worden bijgewerkt zodat de AI dit patroon volgt. JSON-structuur en het aantal items (16 per categorie) blijven ongewijzigd.

