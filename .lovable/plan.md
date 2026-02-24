

# Admin Portal met wachtwoord, gebruik per branche, en vacatures per branche/organisatie

## Overzicht

Er komen 4 grote wijzigingen:

1. **Wachtwoordbeveiliging** voor alle admin-pagina's
2. **Admin Portal** als centraal startpunt met navigatie
3. **Footer** krijgt een subtiel "Admin" linkje
4. **Gebruik-pagina** wordt uitgebreid met branche-niveaus (parent + children)
5. **Vacatures-pagina** wordt generiek: werkt voor elke branche EN elke specifieke organisatie

---

## 1. AdminPasswordGate component (nieuw)

**Bestand:** `src/components/AdminPasswordGate.tsx`

Een wrapper die om alle admin-routes heen zit:

- Toont een centered card met Vinster logo en wachtwoord-invoer
- Wachtwoord: `ErveKnots7751SZ` (opgeslagen als SHA-256 hash in de code)
- Na correct invoeren: `sessionStorage.setItem('vinster_admin_auth', 'true')`
- Bij herladen van pagina: checkt sessionStorage, hoeft niet opnieuw in te voeren
- Bij sluiten browser: sessie verlopen, opnieuw invoeren
- Vinster-stijl: navy header, afgeronde card, primaire knop

## 2. Admin Portal pagina (nieuw)

**Bestand:** `src/pages/AdminPortal.tsx`

Een hub-pagina met kaarten naar de admin-tools:

| Kaart | Beschrijving | Route |
|-------|-------------|-------|
| Organisatie Gebruik | Statistieken per branche en organisatie | `/admin/gebruik` |
| Vacatures Beheren | Vacatures uploaden per branche/organisatie | `/admin/vacatures` |

Design: Vinster header, titel "Admin Portal", subtitel, kaarten met iconen en navigatie-knoppen.

## 3. Footer aanpassing

**Bestand:** `src/components/Footer.tsx`

Onder de copyright-tekst komt een subtiel "Admin" linkje:
- `text-xs text-gray-400 hover:text-blue-900`
- Navigeert naar `/admin`

## 4. Gebruik-pagina uitbreiden (hernoemen)

**Bestand:** `src/pages/AdminOrganisatieGebruik.tsx`

De huidige pagina toont al alle organisaties plat. De uitbreiding:

- **Branche-totalen bovenaan**: groepeer stats per parent_type_id. Bijv. "Medisch Centrum" toont het totaal van zichzelf + ErasmusMC
- **Uitklapbaar**: klik op een branche-rij om de individuele organisaties eronder te zien
- De edge function `admin-organisation-stats` wordt uitgebreid om ook `parent_type_id` mee te sturen zodat de frontend kan groeperen
- "Terug" knop gaat naar `/admin` in plaats van `/home`

### Edge function aanpassing: `admin-organisation-stats`

De response krijgt een extra veld per org type: `parent_type_id`, zodat de frontend kan groeperen op branche.

## 5. Vacatures-pagina generiek maken

**Bestand:** `src/pages/AdminVacatures.tsx` (nieuw, vervangt `AdminErasmusMCVacatures.tsx`)

De huidige ErasmusMC-specifieke pagina wordt generiek:

- **Organisatie-selector bovenaan**: dropdown met alle organisatie-types (branches + specifieke orgs), gegroepeerd
  - Branches (parent_type_id is null): "Medisch Centrum", "Hogeschool", etc.
  - Specifieke orgs (parent_type_id is not null): "ErasmusMC" (onder Medisch Centrum)
- Na selectie van een organisatie:
  - Toon stats (aantal vacatures, laatste import) voor die specifieke org
  - CSV upload-flow (identiek aan huidige ErasmusMC-pagina)
  - Column mapping UI
  - Preview tabel
  - Vervangen/toevoegen optie
- "Terug" knop gaat naar `/admin`

Dit gebruikt dezelfde `import-organisation-vacancies` edge function die al generiek werkt (accepteert `organisation_type_id`).

## 6. Routing aanpassingen

**Bestand:** `src/components/AppRouter.tsx`

```text
/admin                        -> AdminPasswordGate > AdminPortal
/admin/gebruik                -> AdminPasswordGate > AdminOrganisatieGebruik
/admin/vacatures              -> AdminPasswordGate > AdminVacatures

# Legacy redirects
/admin/organisaties/gebruik   -> redirect naar /admin/gebruik
/admin/erasmus-mc/vacatures   -> redirect naar /admin/vacatures
```

---

## Bestanden

| Bestand | Actie |
|---------|-------|
| `src/components/AdminPasswordGate.tsx` | **Nieuw** -- wachtwoord-prompt component |
| `src/pages/AdminPortal.tsx` | **Nieuw** -- admin hub pagina |
| `src/pages/AdminVacatures.tsx` | **Nieuw** -- generieke vacatures-pagina (vervangt ErasmusMC-specifieke) |
| `src/components/Footer.tsx` | **Wijzigen** -- "Admin" link toevoegen |
| `src/components/AppRouter.tsx` | **Wijzigen** -- nieuwe routes, legacy redirects |
| `src/pages/AdminOrganisatieGebruik.tsx` | **Wijzigen** -- branche-groepering, terug-knop naar /admin |
| `supabase/functions/admin-organisation-stats/index.ts` | **Wijzigen** -- parent_type_id meesturen in response |

---

## Technische details

### AdminPasswordGate.tsx

```typescript
// SHA-256 hash van "ErveKnots7751SZ" wordt vergeleken
// sessionStorage('vinster_admin_auth') = 'true' na succes
// Render children alleen als authenticated
```

### AdminVacatures.tsx

De pagina laadt alle `organisation_types` bij mount en toont een grouped dropdown:

```text
--- Branches ---
Medisch Centrum
Hogeschool
Universiteit
Zorgorganisatie

--- Specifieke Organisaties ---
ErasmusMC (Medisch Centrum)
```

Na selectie wordt `organisation_type_id` gebruikt voor:
1. Stats ophalen (count + laatste import)
2. CSV import via bestaande `import-organisation-vacancies` edge function

### admin-organisation-stats edge function

Extra veld in de response:

```typescript
stats = orgTypes.map(ot => ({
  org_name: ot.name,
  org_id: ot.id,
  parent_type_id: ot.parent_type_id || null,  // NIEUW
  this_month: ...,
  last_month: ...,
  total: ...,
}));
```

### AdminOrganisatieGebruik.tsx groepering

De frontend groepeert op basis van `parent_type_id`:

- Branches (parent_type_id === null): toon als hoofdrij met totaal = eigen sessies + alle children
- Children (parent_type_id !== null): toon ingesprongen onder hun parent
- Collapsible rows met een chevron-icoon

