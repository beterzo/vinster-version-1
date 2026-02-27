

# Fix: Totaal baseren op sessies in plaats van code-gebruik

## Wat er verandert

In `supabase/functions/admin-organisation-stats/index.ts` wordt de totaal-berekening voor `is_unique` organisaties aangepast:

**Huidige logica (regel ~80):**
```
total: isUnique ? Math.max(orgSessions.length, codeTotal) : filteredSessions.length
```

**Nieuwe logica:**
```
total: isUnique ? orgSessions.length : filteredSessions.length
```

Dit zorgt ervoor dat het totaal altijd gebaseerd is op daadwerkelijke sessies, niet op `uses_count` van toegangscodes (die hoger kan zijn door meerdere validatiepogingen).

## Bestanden

- **`supabase/functions/admin-organisation-stats/index.ts`**: Verwijder `Math.max` met `codeTotal`, gebruik alleen sessie-telling. De `codeUsesMap` variabele kan ook verwijderd worden aangezien die niet meer nodig is.

