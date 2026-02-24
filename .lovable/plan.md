

# Styling fix voor organisatiepagina's - Vinster brand

Alle organisatiepagina's worden visueel aangepast om de Vinster brand-stijl te volgen, zoals te zien op pagina's als OverVinster en VoorWieIsHet. Geen logica wordt gewijzigd.

---

## Bestaande Vinster-stijlpatronen (referentie)

Uit de bestaande pagina's zijn deze patronen geidentificeerd:

- **Header**: Witte achtergrond, border-b, het blauwe vierkante logo (`/lovable-uploads/4022d2c1-...` of `/lovable-uploads/3bf8603d-...`), h-20, met "Terug naar home" knop
- **Kleuren**: `text-blue-900` voor koppen, `text-gray-700` voor body tekst, `bg-gray-50` voor pagina-achtergrond, `bg-blue-900` voor primaire knoppen
- **Kaarten**: `rounded-2xl` of `rounded-3xl`, `shadow-sm` of `shadow-lg`, `border border-gray-100`, witte achtergrond
- **Container**: `max-w-4xl` of `max-w-6xl`, `mx-auto`, `px-6`, `py-12`
- **Knoppen**: `bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8`
- **Font**: urw-form (al globaal ingesteld)

---

## Wijzigingen per bestand

### 1. `src/pages/OrganisatiesOverzicht.tsx`

**Wat verandert:**
- Header: van donkerblauwe balk met klein logo naar witte header met groot Vinster-logo (zelfde stijl als OverVinster/VoorWieIsHet) + "Terug naar home" knop
- Achtergrond: `bg-gray-50` in plaats van `bg-background`
- Container: `max-w-6xl mx-auto px-6 py-12`
- Titel: `text-blue-900` met grotere tekst, gecentreerd
- Subtekst: `text-lg text-gray-700` in plaats van `text-muted-foreground`
- Org-kaarten: witte kaart met `rounded-2xl shadow-sm border border-gray-100 p-8`, hover met `shadow-md`, org-naam als `text-xl font-semibold text-blue-900`, beschrijving als `text-gray-600`, en een "Bekijk" knop-achtige CTA onderaan elke kaart
- Grid: `gap-6 sm:grid-cols-2 lg:grid-cols-3`

### 2. `src/pages/OrganisatieLanding.tsx`

**Wat verandert:**
- Header: zelfde witte header met groot logo als OverVinster
- Achtergrond: `bg-gray-50`
- Container: `max-w-4xl mx-auto px-6 py-12` met wittte kaart eromheen (`rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12`)
- Titel: `text-3xl md:text-4xl font-bold text-blue-900`
- Intro-tekst: `text-lg text-gray-700 leading-relaxed` (warm, niet grijs/klein)
- Code-formulier: binnen een subtiel afgescheiden sectie (`bg-blue-50 rounded-xl p-6`), duidelijk label "Jouw toegangscode" erboven, input met goede hoogte, knop in `bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 w-full`
- ErasmusMC variant: subtiel accent behouden (`bg-[#00205B]` kleurtje als border-accent)
- "Niet gevonden" state: zelfde stijl

### 3. `src/pages/OrganisatieBinnenkort.tsx`

**Wat verandert:**
- Header: witte header met groot logo (zelfde als hierboven)
- Achtergrond: `bg-gray-50`
- Icoon-cirkel: `bg-blue-50` (lichtblauw) in plaats van `bg-vinster-blue/10`
- Tekst: `text-blue-900` voor kop, `text-gray-600` voor body
- Knop: `bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8`
- Wrap in witte kaart: `bg-white rounded-2xl shadow-sm p-12`

### 4. `src/components/DesktopNavigation.tsx`

**Wat verandert (alleen styling):**
- Dropdown container: `rounded-xl` in plaats van `rounded-lg`, betere shadow (`shadow-xl`), `py-1` padding
- Dropdown items: `py-2.5 px-5` voor betere spacing, `text-sm` blijft, hover-state `hover:bg-blue-50 hover:text-blue-900`
- ErasmusMC indent: `pl-10` met een subtiele `text-gray-500` kleur en `text-xs` label-stijl
- Niet-beschikbare items: licht gedimd met `opacity-70`

### 5. `src/components/MobileMenu.tsx`

**Wat verandert (alleen styling):**
- Organisatie sub-items: betere spacing, `pl-6`, hover `text-blue-900`
- Niet-beschikbare items: licht gedimd

---

## Bestanden die worden gewijzigd

| Bestand | Type wijziging |
|---------|---------------|
| `src/pages/OrganisatiesOverzicht.tsx` | Header, kleuren, kaarten, layout |
| `src/pages/OrganisatieLanding.tsx` | Header, kleuren, formulier, layout |
| `src/pages/OrganisatieBinnenkort.tsx` | Header, kleuren, layout |
| `src/components/DesktopNavigation.tsx` | Dropdown styling |
| `src/components/MobileMenu.tsx` | Sub-items styling |

Geen admin-pagina's bestaan nog, dus die worden niet aangepast. Geen logica wordt gewijzigd.
