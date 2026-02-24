

# Medisch Centrum categoriepagina met vrije start + specifieke organisaties

## Wat verandert

De huidige flow is: klik op "Medisch Centrum" in de nav, je komt op `/organisaties/medisch-centrum` waar je een toegangscode moet invullen. Dat wordt nu anders.

De nieuwe flow wordt:
- Klik op **Medisch Centrum** in de nav -> je komt op een **categoriepagina** (`/organisaties/medisch-centrum`)
- Op die pagina kun je:
  1. **Direct starten** met een algemeen Medisch Centrum traject (geen code nodig) -- je krijgt dan resultaten met functies specifiek voor medische centra
  2. **Een specifieke organisatie kiezen** (bijv. ErasmusMC) -- daar heb je wel een toegangscode voor nodig

ErasmusMC blijft als sub-item in de dropdown staan, maar je kunt er ook via de categoriepagina naartoe.

---

## Nieuwe pagina: `/organisaties/medisch-centrum` (categoriepagina)

De huidige `OrganisatieLanding.tsx` wordt alleen nog gebruikt voor **specifieke organisaties** (is_unique = true, zoals ErasmusMC) die een code vereisen.

Voor **categorietypen** (is_unique = false, zoals "Medisch Centrum") wordt een nieuw paginacomponent gemaakt: `OrganisatieCategorieLanding.tsx`.

### Inhoud van de categoriepagina

**Header**: Vinster logo + "Terug naar home" knop (zelfde stijl als overal)

**Sectie 1 - Intro + direct starten**:
- Titel: "Medisch Centrum" (of dynamisch de naam van het org type)
- Warm intro-tekst: "Ontdek welke functies binnen een medisch centrum bij jou passen. Vinster helpt je om inzicht te krijgen in jouw mogelijkheden."
- Primaire CTA-knop: **"Start het traject"** -- deze zet de OrganisationContext op het Medisch Centrum type (zonder accessCodeId) en stuurt de gebruiker naar de organisatie intro-pagina (`/organisaties/medisch-centrum/intro`)

**Sectie 2 - Specifieke organisatie**:
- Heading: "Hoor je bij een specifieke organisatie?"
- Uitleg: "Als je van een specifieke organisatie een toegangscode hebt ontvangen, kun je die hier gebruiken voor een traject op maat."
- Lijst/kaarten van beschikbare specifieke organisaties onder dit type (query: alle `organisation_types` waar `is_unique = true` en die bij dit categorietype horen)
- Momenteel is de enige: **ErasmusMC** -- weergegeven als een kaart met naam en een "Vul code in" knop die naar `/organisaties/erasmus-mc` leidt

### Hoe weten we welke specifieke organisaties bij een categorie horen?

De database heeft nu geen relatie tussen "Medisch Centrum" (categorie) en "ErasmusMC" (specifiek). We moeten dit toevoegen.

**Optie**: Een `parent_type_id` kolom toevoegen aan `organisation_types` tabel. ErasmusMC krijgt dan `parent_type_id` = de id van "Medisch Centrum". Dit maakt het generiek en schaalbaar.

---

## Database wijziging

Voeg een kolom `parent_type_id` toe aan de `organisation_types` tabel:
- Type: UUID, nullable, foreign key naar `organisation_types.id`
- Update ErasmusMC record: zet `parent_type_id` = id van "Medisch Centrum"

Dit maakt het mogelijk om op de categoriepagina dynamisch alle specifieke organisaties op te halen die onder dat type vallen.

---

## Navigatie aanpassingen

De dropdown items in `DesktopNavigation.tsx` en `MobileMenu.tsx` blijven grotendeels hetzelfde:
- **Medisch Centrum** -> navigeert naar `/organisaties/medisch-centrum` (de nieuwe categoriepagina)
- **ErasmusMC** (indent) -> navigeert naar `/organisaties/erasmus-mc` (de code-pagina, onveranderd)
- Rest blijft greyed out

Geen grote veranderingen nodig in de nav.

---

## OrganisationContext aanpassing

Momenteel vereist `setOrganisation` altijd een `accessCodeId`. Voor het "vrije" categorie-traject (zonder code) moet dit optioneel worden:
- Bij direct starten: `setOrganisation({ organisationTypeId: "...", accessCodeId: null, slug: "medisch-centrum", name: "Medisch Centrum" })`
- Bij ErasmusMC met code: blijft zoals het is

De context accepteert al `null` voor `accessCodeId`, dus hier is geen wijziging nodig.

---

## Routing

De bestaande route `/organisaties/:slug` vangt alles op. We moeten in die route (of in een wrapper) detecteren of het slug een **categorie** is (is_unique = false) of een **specifieke organisatie** (is_unique = true) en het juiste component renderen.

**Aanpak**: Maak een nieuw wrapper-component `OrganisatieRouteHandler.tsx` dat:
1. Het org type ophaalt op basis van slug
2. Als `is_unique = false` -> render `OrganisatieCategorieLanding`
3. Als `is_unique = true` -> render `OrganisatieLanding` (bestaande code-pagina)

Of eenvoudiger: pas `OrganisatieLanding.tsx` aan om beide flows te ondersteunen op basis van `is_unique`.

Ik kies voor de eenvoudige aanpak: **uitbreiden van `OrganisatieLanding.tsx`** met een categorie-view wanneer `is_unique = false`.

---

## Samenvatting bestanden

### Nieuw
| Bestand | Doel |
|---------|------|
| Geen nieuwe bestanden | Alles past in bestaande structuur |

### Database migratie
| Wijziging | Doel |
|-----------|------|
| Kolom `parent_type_id` (UUID, nullable) toevoegen aan `organisation_types` | Relatie categorie <-> specifieke organisatie |
| ErasmusMC record updaten met `parent_type_id` = Medisch Centrum id | Link leggen |

### Te wijzigen
| Bestand | Wijziging |
|---------|-----------|
| `src/pages/OrganisatieLanding.tsx` | Splitsen in twee views: categorie-view (is_unique=false) met "Start traject" knop + lijst specifieke organisaties, en code-view (is_unique=true) met toegangscode formulier |
| `src/integrations/supabase/types.ts` | Regenereren na kolom toevoeging (of handmatig `parent_type_id` toevoegen) |

### Ongewijzigd
- `DesktopNavigation.tsx` -- nav items blijven hetzelfde
- `MobileMenu.tsx` -- items blijven hetzelfde
- `OrganisatieIntro.tsx` -- intro-pagina werkt al generiek
- `AppRouter.tsx` -- route `/organisaties/:slug` vangt beide flows op

---

## Technische details

### OrganisatieLanding.tsx -- categorie-view (is_unique = false)

Wanneer het opgehaalde org type `is_unique = false` heeft:

1. Toon intro + "Start het traject" knop
2. Query `organisation_types` waar `parent_type_id` = huidig org type id om specifieke organisaties te laden
3. Toon die als kaarten met een link naar hun eigen landing page

Bij klik op "Start het traject":
- `setOrganisation({ organisationTypeId: orgType.id, accessCodeId: null, slug, name: orgType.name })`
- Navigeer naar `/organisaties/${slug}/intro`

### OrganisatieLanding.tsx -- code-view (is_unique = true)

Blijft exact zoals het nu is: toegangscode formulier.

