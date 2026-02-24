

# Organisaties Module - Fase 1

Dit plan implementeert de eerste drie onderdelen van de organisaties-module: database, navigatie-dropdown en een proof-of-concept landingspagina voor "Medisch Centrum".

---

## Stap 1: Database migratie

Vier nieuwe tabellen aanmaken in Supabase:

### `organisation_types`
- id, slug (unique), name, intro_text, anchor_list (jsonb), is_active, is_unique, created_at
- RLS: publiek leesbaar voor actieve types (voor landingspagina's), schrijven alleen via service role

### `organisation_access_codes`
- id, code (unique), organisation_type_id (FK), is_active, uses_count, max_uses, created_at, last_used_at
- RLS: geen publieke lees-toegang (validatie gaat via Edge Function)

### `user_organisation_sessions`
- id, user_id (FK auth.users), organisation_type_id (FK), access_code_id (FK), completed_at, created_at
- RLS: gebruikers kunnen eigen sessies lezen

### `organisation_vacancies`
- id, organisation_type_id (FK), title, department, description, keywords (text[]), year, raw_data (jsonb), created_at
- RLS: geen publieke toegang (alleen service role voor admin)

### Seed data
Na de migratie worden de organisatietypes ingevoegd:

| slug | name | is_active | is_unique |
|------|------|-----------|-----------|
| medisch-centrum | Medisch Centrum | true | false |
| erasmus-mc | ErasmusMC | true | true |
| universiteit | Universiteit | true | false |
| zorgorganisatie | Zorgorganisatie | true | false |
| hogeschool | Hogeschool | true | false |
| mbo-instelling | Mbo-instelling | false | false |
| transport-logistiek | Transport & Logistiek | false | false |
| financieel | Financieel | false | false |

---

## Stap 2: Edge Function voor code-validatie

Nieuwe Edge Function: `validate-organisation-code`

- Ontvangt: `{ code: string }`
- Checkt in `organisation_access_codes`: code bestaat, is_active = true, uses_count < max_uses (of max_uses is null)
- Bij succes: verhoogt uses_count, zet last_used_at, geeft organisation_type_id terug
- Bij fout: geeft foutmelding "Deze code is niet geldig of niet meer actief."
- Geen authenticatie vereist (code wordt gevalideerd voor login/registratie)

---

## Stap 3: Navigatie-dropdown "Organisaties"

### Desktop (`DesktopNavigation.tsx`)
- Nieuw menu-item "Organisaties" toevoegen (alleen zichtbaar als taal = NL)
- Bij hover/click opent een dropdown met de actieve organisatietypes
- ErasmusMC wordt als sub-item onder "Medisch Centrum" getoond
- De dropdown haalt de actieve types op uit Supabase (of hardcoded voor nu, met later DB-backed)
- Styling: witte tekst, zelfde stijl als bestaande nav-items, dropdown met witte achtergrond

### Mobiel (`MobileMenu.tsx`)
- "Organisaties" als uitklapbaar item in de drawer (alleen NL)
- Zelfde items als desktop

---

## Stap 4: Landingspagina per organisatietype

### Route: `/organisaties/:slug`

Nieuwe pagina `src/pages/OrganisatieLanding.tsx`:

1. **Header**: Vinster-logo + navigatie (hergebruikt bestaande header-componenten)
2. **Intro-sectie**: Titel van het organisatietype + intro_text uit de database
3. **Toegangscode-formulier**:
   - Input veld voor de code
   - Knop "Toegang krijgen"
   - Foutmelding bij ongeldige code
   - Bij succes: sla organisatie-context op in localStorage + redirect naar `/login` of `/signup` met org-context als query parameter
4. **Footer**: Hergebruikt bestaande Footer-component

### Route: `/organisaties` (overzichtspagina)
Eenvoudige pagina met kaarten voor elk actief organisatietype, elk linkt naar `/organisaties/[slug]`.

### Routes toevoegen aan `AppRouter.tsx`:
- `/organisaties` -> OrganisatiesOverzicht
- `/organisaties/:slug` -> OrganisatieLanding

---

## Stap 5: Organisatie-context opslag

Nieuw bestand `src/contexts/OrganisationContext.tsx`:
- React Context die bijhoudt of de gebruiker in "organisatie-modus" is
- Slaat op: organisation_type_id, slug, name
- Persisteert in localStorage zodat het blijft bij page refresh
- Wordt later gebruikt door de rapportgeneratie en flow-logica

---

## Bestanden die worden aangemaakt

| Bestand | Doel |
|---------|------|
| `supabase/migrations/[timestamp]_create_organisation_tables.sql` | Database migratie |
| `supabase/functions/validate-organisation-code/index.ts` | Code-validatie Edge Function |
| `src/pages/OrganisatiesOverzicht.tsx` | Overzichtspagina alle org-types |
| `src/pages/OrganisatieLanding.tsx` | Landingspagina per org-type |
| `src/contexts/OrganisationContext.tsx` | Organisatie-context provider |

## Bestanden die worden gewijzigd

| Bestand | Wijziging |
|---------|-----------|
| `src/components/DesktopNavigation.tsx` | Dropdown "Organisaties" toevoegen |
| `src/components/MobileMenu.tsx` | "Organisaties" uitklapbaar item toevoegen |
| `src/components/AppRouter.tsx` | Nieuwe routes toevoegen |
| `src/App.tsx` | OrganisationProvider wrappen |

---

## Technische details

### Dropdown implementatie (Desktop)
Gebruik het bestaande Radix `DropdownMenu` component uit shadcn/ui. Bij hover wordt het menu geopend. ErasmusMC wordt als ingesprongen sub-item onder "Medisch Centrum" getoond.

### Code-validatie flow
```text
Gebruiker voert code in
        |
        v
Edge Function checkt code
        |
    Geldig? --Nee--> Toon foutmelding
        |
       Ja
        |
        v
Sla org-context op (localStorage)
        |
        v
Redirect naar /login?org=medisch-centrum
        |
        v
Na login: maak user_organisation_sessions record aan
```

### Wat wordt NIET gewijzigd
- De reguliere Vinster-flow blijft ongewijzigd
- Rapportgeneratie-aanpassingen komen in een volgende fase
- Admin-pagina's komen in een volgende fase
- Zoekprofiel-skip logica komt in een volgende fase
