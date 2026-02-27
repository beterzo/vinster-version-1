

# Plan: Anchor-lijst vervangen door sector-gebaseerde AI-prompting

## Samenvatting

De huidige organisatie-rapportgeneratie werkt met een vaste "ankerlijst" van functies waaruit de AI moet kiezen. Dit beperkt de variatie enorm (bijv. maar ~60 functies voor medische centra). We vervangen dit door een open prompt waarbij de AI alleen de instructie krijgt om functies te bedenken **binnen de relevante sector/branche**, zonder vaste lijst.

## Wat verandert er

### 1. Database: anchor_list kolom leegmaken
- De `anchor_list` JSONB-kolom in `organisation_types` wordt leeggemaakt (op NULL gezet) voor "Medisch Centrum"
- De kolom zelf kan blijven bestaan (geen schema-wijziging nodig), maar wordt niet meer gebruikt

### 2. Edge Function: `generate-career-report/index.ts`

De huidige code heeft 3 takken:
- **ErasmusMC** (anchor list + vacatures) 
- **Generiek met anchor list** (alleen anchor list)
- **Normaal** (geen organisatie)

Dit wordt vereenvoudigd naar 2 takken:
- **Organisatie-modus**: sector-gebaseerde prompt (bijv. "medische sector", "transport & logistiek", "financiele sector") -- in alle 4 talen (NL, EN, DE, NO)
- **Normaal**: bestaande prompts blijven ongewijzigd

**Wat er concreet verandert in de prompts:**
- De `formatAnchorList()` functie en alle verwijzingen naar ankerlijsten worden verwijderd
- De variabelen `hasAnchorList` en `anchorListText` verdwijnen
- In plaats daarvan wordt de **naam van de organisatie-categorie** (bijv. "Medisch Centrum", "Transport & Logistiek") doorgegeven aan de prompt
- De AI krijgt de instructie: "Bedenk functies die passen **binnen de sector [naam]**" in plaats van "Kies uit deze lijst"
- ErasmusMC blijft een aparte variant behouden vanwege de vacature-database, maar ook zonder ankerlijst -- de vacatures dienen als inspiratie, niet als beperking
- De sector-prompt wordt in alle 4 talen (NL, EN, DE, NO) geschreven

**Voorbeeld van de nieuwe organisatie-prompt (NL):**
> "Je bent een loopbaancoach gespecialiseerd in de medische sector. Je bedenkt functies die bestaan binnen een medisch centrum of ziekenhuis. Je bent NIET beperkt tot een vaste lijst -- kies uit alle bestaande functies die passen bij deze branche."

**Voorbeeld voor Transport & Logistiek:**
> "Je bent een loopbaancoach gespecialiseerd in transport en logistiek. Je bedenkt functies die bestaan binnen de transport- en logistieksector."

### 3. Sector-naam ophalen
- De `organisation_types.name` wordt al opgehaald uit de database
- Bij child-organisaties (zoals ErasmusMC) wordt ook de parent-naam opgehaald om de sector te bepalen
- De sector-naam wordt dynamisch in de prompt geplaatst

### 4. Taalondersteuning
De organisatie-prompt wordt in alle 4 talen geschreven:
- **NL**: "binnen de sector [naam]"
- **EN**: "within the [name] sector"  
- **DE**: "im Bereich [Name]"
- **NO**: "innenfor [navn]-sektoren"

## Wat NIET verandert
- De normale (niet-organisatie) prompts in alle 4 talen blijven exact hetzelfde
- De frontend code blijft ongewijzigd (stuurt nog steeds `organisation_type_id` mee)
- De vacature-logica voor ErasmusMC blijft bestaan als aanvullende context (maar niet meer als beperking)
- De JSON output-structuur blijft identiek

## Technisch overzicht

### Bestanden die worden aangepast:
1. **`supabase/functions/generate-career-report/index.ts`** -- hoofdwijziging:
   - `formatAnchorList()` functie verwijderen
   - Nieuwe functie `getOrganisationPrompts(language, sectorName, data, vacancies?)` toevoegen
   - De 3-takken logica vereenvoudigen naar 2 takken
   - Sector-naam ophalen uit organisatie + parent
   
### Database-wijziging:
1. `UPDATE organisation_types SET anchor_list = NULL WHERE slug = 'medisch-centrum'` -- data leegmaken

