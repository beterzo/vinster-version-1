

# Organisatie Welkom/Intro Pagina

Een nieuwe introductie-pagina voor organisatie-medewerkers, getoond na succesvolle login met toegangscode en voor het starten van de Vinster flow. De pagina is identiek voor alle organisatietypes.

---

## Wat wordt gebouwd

Een nieuwe pagina op route `/organisaties/:slug/intro` die alle opgegeven content toont in Vinster brand-stijl. De pagina volgt het bestaande visuele patroon van `OrganisatieLanding.tsx` (header met logo, `bg-gray-50` achtergrond, centered container) en de step-card stijl van `WelkomInline.tsx`.

---

## Pagina-structuur

### Header
Hergebruikt het bestaande header-patroon: witte balk met Vinster logo (h-20) en een "Terug" knop.

### Content (binnen witte kaart, `max-w-4xl`, `rounded-2xl`)

1. **Titel**: "Welkom bij Vinster" -- `text-3xl font-bold text-blue-900`
2. **Subtekst**: De intro-zin -- `text-lg text-gray-700 leading-relaxed`
3. **"Hoe werkt het?" sectie** met 3 genummerde stap-kaarten:
   - Elk in een `rounded-xl p-5 border border-gray-100 bg-gray-50` kaart (vergelijkbaar met WelkomInline stap-kaarten)
   - Genummerde cirkel (`w-10 h-10 rounded-full bg-[#232D4B] text-white`) + titel + beschrijving
   - Weergegeven in een verticale lijst (niet grid, want de teksten zijn lang)
4. **"Wat krijg je?" sectie**:
   - Heading + bullet list met checkmark-iconen (CheckCircle2, zelfde stijl als WelkomInline tips)
   - Aanvullende paragraaf over het doel
   - Paragraaf over meerdere keren doorlopen
5. **"Vertrouwelijk & flexibel" sectie**:
   - In een subtiel blok (`bg-[#E8F4FD] rounded-xl p-5`) met Shield-icoon, zelfde stijl als WelkomInline account notice
6. **"Verder kijken?" sectie**:
   - Korte tekst met een subtiele link naar `/` ("de algemene knop")
7. **"Start Vinster" knop**:
   - Primaire CTA: `bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8`
   - Navigeert naar `/home` (het reguliere Vinster flow startpunt)

### Footer
Hergebruikt bestaande Footer component.

---

## Redirect-logica aanpassing

Na succesvolle login met organisatie-context: de gebruiker moet naar `/organisaties/[slug]/intro` worden gestuurd in plaats van direct naar `/home`. Dit vereist een kleine aanpassing in de login/signup redirect-logica.

---

## Bestanden

| Bestand | Actie |
|---------|-------|
| `src/pages/OrganisatieIntro.tsx` | **Nieuw** -- de intro-pagina |
| `src/components/AppRouter.tsx` | **Wijzigen** -- route `/organisaties/:slug/intro` toevoegen (protected) |
| `src/pages/OrganisatieLanding.tsx` | **Wijzigen** -- na succesvolle code-validatie redirecten naar `/organisaties/[slug]/intro` i.p.v. `/signup` |

---

## Technische details

### Route
- Pad: `/organisaties/:slug/intro`
- Vereist login (ProtectedRoute wrapper) zodat de pagina alleen zichtbaar is na authenticatie
- De slug parameter wordt gebruikt om context te behouden maar de content is identiek voor alle org types

### Navigatie na "Start Vinster"
De knop navigeert naar `/home` waar de reguliere Vinster journey flow begint (RondeDashboard).

### Alle tekst is hardcoded (Dutch only)
Geen vertaalsleutels nodig -- de pagina is alleen voor organisatie-gebruik in het Nederlands.

