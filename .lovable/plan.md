

## Kernwoorden naar korte zinnen

De huidige AI genereert losse woorden als "Samenwerken" of "Natuur". Dit moet veranderen naar korte beschrijvende zinnen van 6-8 woorden zoals "Graag samenwerken in een klein team".

### Wat moet er veranderen

**1. `generate-profile-keywords` edge function** -- AI-prompts aanpassen (4 talen)
- In alle system- en user-prompts expliciet instructeren: "Genereer korte beschrijvende zinnen van 6-8 woorden, geen losse woorden"
- Voorbeelden toevoegen aan de prompt per taal (NL: "Creatieve oplossingen bedenken", EN: "Enjoy solving creative problems", etc.)
- 16 items per categorie behouden, JSON-structuur ongewijzigd

**2. `generate-career-report` edge function** -- Geen promptwijzigingen nodig
- De rapport-keywords komen rechtstreeks uit de user-selecties (`selected_*_keywords`), niet uit AI-output. De inhoud verandert automatisch mee wanneer `generate-profile-keywords` zinnen genereert.

**3. Selectiepagina's** -- Grid en buttons aanpassen voor langere tekst
- `PrioriteitenActiviteiten.tsx`: Grid van `grid-cols-2 md:grid-cols-3` naar `grid-cols-1 md:grid-cols-2`, tekst links uitlijnen
- `PrioriteitenWerkomstandigheden.tsx`: Zelfde aanpassing
- `PrioriteitenInteresses.tsx`: Zelfde aanpassing
- `EditPrioriteitenDialog.tsx`: Grid van `grid-cols-2` naar `grid-cols-1`

**4. RapportViewer** -- Chips/tags aanpassen voor langere tekst
- Bestaande `rounded-full px-3 py-1` chips werken al met variabele breedte (flex-wrap), maar font-size kan iets kleiner (`text-[0.75rem]`) om ruimte te behouden op de A4 pagina

**5. Voorbeeldrapport en inline components** -- Controleren
- `VoorbeeldrapportGenerator.tsx` en `RapportInline.tsx` gebruiken dezelfde chip-stijl als RapportViewer, dezelfde aanpassing doorvoeren

### Samenvatting bestanden

| Bestand | Wijziging |
|---|---|
| `supabase/functions/generate-profile-keywords/index.ts` | Prompts 4 talen: zinnen i.p.v. woorden |
| `src/pages/PrioriteitenActiviteiten.tsx` | Grid layout breder |
| `src/pages/PrioriteitenWerkomstandigheden.tsx` | Grid layout breder |
| `src/pages/PrioriteitenInteresses.tsx` | Grid layout breder |
| `src/components/EditPrioriteitenDialog.tsx` | Grid layout breder |
| `src/components/RapportViewer.tsx` | Chip font-size check |

