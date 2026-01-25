
# Plan: Kleine letters na komma in rapport + Minimum 8 activiteiten

Dit plan behandelt de twee verzoeken van Heidi:

1. **Keywords in het rapport**: Na de eerste komma moeten alle woorden met kleine letters beginnen (behalve het eerste woord)
2. **Minimum activiteiten**: Gebruikers moeten minimaal 8 (in plaats van 5) activiteiten selecteren

---

## Overzicht van de wijzigingen

| Wijziging | Locatie(s) | Type |
|-----------|------------|------|
| Keyword formatting | Utility functie + rapport viewers | Code aanpassing |
| Minimum 8 activiteiten | Validatie + vertalingen (4 talen) | Code + tekst |

---

## Deel 1: Kleine letters na komma in rapport

### Huidige situatie
Keywords worden nu zo weergegeven:
```
Schrijven, Filosoferen, Trainingen ontwerpen, Programmas ontwerpen
```

### Gewenste situatie
```
Schrijven, filosoferen, trainingen ontwerpen, programmas ontwerpen
```

### Wijzigingen

**1. Nieuwe formatting functie toevoegen aan `src/utils/keywordUtils.ts`**

Toevoegen van een functie die keywords formatteert voor rapport-weergave:
- Eerste keyword: hoofdletter
- Alle volgende keywords: kleine letter

```typescript
export const formatKeywordsForReport = (keywords: string[]): string => {
  if (!keywords || keywords.length === 0) return '';
  
  return keywords
    .map((keyword, index) => {
      const cleaned = keyword.trim();
      if (index === 0) {
        // Eerste keyword: hoofdletter
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      } else {
        // Overige keywords: kleine letter
        return cleaned.toLowerCase();
      }
    })
    .join(', ');
};
```

**2. Aanpassen `src/components/RapportViewer.tsx`**

Vervangen van `.join(', ')` door de nieuwe `formatKeywordsForReport()` functie op regels 123, 128, 133.

**3. Aanpassen `src/components/journey/RapportInline.tsx`**

Vervangen van `.join(', ')` door `formatKeywordsForReport()` op regels 71, 79, 87.

**4. Aanpassen `src/pages/VoorbeeldrapportGenerator.tsx`**

Vervangen van `.join(', ')` door `formatKeywordsForReport()` op regels 543, 554, 565.

---

## Deel 2: Minimum 8 activiteiten

### Huidige situatie
- Minimum: 5 activiteiten
- Tekst: "Selecteer minimaal 5 activiteiten..."

### Gewenste situatie
- Minimum: **8** activiteiten (alleen voor activiteiten, werkomstandigheden en interesses blijven 5)

### Wijzigingen

**1. Code validatie aanpassen**

| Bestand | Regel | Wijziging |
|---------|-------|-----------|
| `src/pages/PrioriteitenActiviteiten.tsx` | 78 | `>= 5` naar `>= 8` |
| `src/components/journey/PersoonsprofielInline.tsx` | 221 | Type-check toevoegen: `>= 8` voor activiteiten, `>= 5` voor andere |
| `src/pages/RondeDashboard.tsx` | 84 | `>= 5` naar `>= 8` |

**2. Vertalingen aanpassen (4 talen)**

**Nederlands (`src/locales/nl/journey.json`):**
```json
"subtitle": "Selecteer minimaal 8 activiteiten die je leuk vindt om te doen",
"selected_count": "Geselecteerd: {count} van minimaal 8"
```

**Engels (`src/locales/en/journey.json`):**
```json
"subtitle": "Select at least 8 activities that you enjoy doing",
"selected_count": "Selected: {count} of at least 8"
```

**Duits (`src/locales/de/journey.json`):**
```json
"subtitle": "Wählen Sie mindestens 8 Aktivitäten aus, die Sie gerne machen",
"selected_count": "Ausgewählt: {count} von mindestens 8"
```

**Noors (`src/locales/no/journey.json`):**
```json
"subtitle": "Velg minst 8 aktiviteter du liker å gjøre",
"selected_count": "Valgt: {count} av minst 8"
```

---

## Technische details

### Bestanden die worden aangepast

| Bestand | Actie |
|---------|-------|
| `src/utils/keywordUtils.ts` | Nieuwe functie toevoegen |
| `src/components/RapportViewer.tsx` | Import + 3x replace |
| `src/components/journey/RapportInline.tsx` | Import + 3x replace |
| `src/pages/VoorbeeldrapportGenerator.tsx` | Import + 3x replace |
| `src/pages/PrioriteitenActiviteiten.tsx` | Validatie wijzigen |
| `src/components/journey/PersoonsprofielInline.tsx` | Validatie wijzigen |
| `src/pages/RondeDashboard.tsx` | Validatie wijzigen |
| `src/locales/nl/journey.json` | Tekst aanpassen |
| `src/locales/en/journey.json` | Tekst aanpassen |
| `src/locales/de/journey.json` | Tekst aanpassen |
| `src/locales/no/journey.json` | Tekst aanpassen |

### Belangrijk: Werkomstandigheden en Interesses
De minimumeis voor **werkomstandigheden** en **interesses** blijft op **5**. Alleen de **activiteiten** stap gaat naar **8**.

---

## Resultaat

Na implementatie:
- **Rapport keywords**: "Schrijven, filosoferen, trainingen ontwerpen, programmas ontwerpen"
- **Activiteiten selectie**: Gebruikers moeten minimaal 8 activiteiten kiezen voordat ze verder kunnen
