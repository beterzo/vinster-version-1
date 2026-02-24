
# Organisatie-specifiek Onderzoeksplan

## Wat verandert

In organisatie-modus wordt het bestaande 3-pagina onderzoeksplan (met 10 stappen + zoekprofiel-verwijzing) vervangen door een eenvoudigere, organisatie-gerichte versie. Deze bevat een lijst gespreksvragen die de medewerker kan bespreken met hun loopbaan- of HR-adviseur.

Daarnaast bevat de pagina:
- Een "Download als PDF" knop die zowel het rapport (3 functies) als het onderzoeksplan in een printbaar document combineert
- Een "Opnieuw beginnen" knop om het traject opnieuw te doorlopen
- Geen "Zoek vacatures" of externe CTA's

---

## Technische aanpak

### 1. Nieuw component: `OrganisatieOnderzoeksplanInline.tsx`

Een apart component specifiek voor organisatie-modus. Dit is schoner dan de bestaande `OnderzoeksplanInline` conditioneel te maken, omdat de content en het gedrag fundamenteel anders zijn (1 pagina i.p.v. 3, geen substep-navigatie, inclusief PDF-functionaliteit).

**Inhoud (hardcoded Dutch):**
- Titel: "En nu?"
- Intro tekst over bespreking met adviseur
- 13 gespreksvragen als gestylede lijst (genummerde cirkels, zelfde stijl als bestaande stappen)
- "Download als PDF" knop -- roept `window.print()` aan, net als de bestaande print-logica in `RapportInline`
- "Opnieuw beginnen" knop -- navigeert terug naar `/home` waar de gebruiker een nieuwe ronde kan starten

**Print-content:**
Het component moet het rapport-content ophalen uit de database (via `roundId`) en een print-only layout renderen die bevat:
- Pagina 1: Cover page (hergebruik bestaande `PrintCoverPage` stijl)
- Pagina 2: Ideale functie-inhoud (hergebruik bestaande `PrintIdealeFunctiePage` stijl)
- Pagina 3: Mogelijke beroepen/functies (hergebruik bestaande `PrintBeroepenPage` stijl)
- Pagina 4: Het onderzoeksplan met de 13 vragen

De print-componenten worden als `hidden print:block` elementen gerenderd, exact zoals in `RapportInline.tsx`.

### 2. Wijziging in `RondeDashboard.tsx`

In organisatie-modus: het onderzoeksplan-step krijgt maar 1 substep (`page1`) in plaats van 3. Wanneer `isOrganisationMode` actief is, render `OrganisatieOnderzoeksplanInline` in plaats van `OnderzoeksplanInline`.

De `activeSteps` filtering die zoekprofiel al uitsluit blijft ongewijzigd. Het onderzoeksplan is nu effectief de laatste stap.

### 3. Geen wijzigingen aan bestaande componenten

- `OnderzoeksplanInline.tsx` -- blijft intact voor reguliere gebruikers
- `RapportInline.tsx` -- blijft intact, de "volgende" knop stuurt door naar onderzoeksplan
- `journey.ts` types -- geen wijzigingen nodig

---

## Bestanden

| Bestand | Actie |
|---------|-------|
| `src/components/journey/OrganisatieOnderzoeksplanInline.tsx` | **Nieuw** -- organisatie-specifiek onderzoeksplan met PDF download |
| `src/pages/RondeDashboard.tsx` | **Wijzigen** -- render `OrganisatieOnderzoeksplanInline` in org-modus |

---

## Design

- Gestylede vragenlijst met genummerde cirkels (`w-8 h-8 rounded-full bg-[#232D4B] text-white`)
- Card met `rounded-3xl shadow-xl border-0` (zelfde als bestaande inline-componenten)
- "Download als PDF" knop: outline stijl met printer-icoon (`border-[#232D4B] text-[#232D4B]`)
- "Opnieuw beginnen" knop: gele accent (`bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B]`)
- Intro tekst in een subtiel blok (`bg-[#E8F4FD] rounded-xl`)
- Print layout: 4 pagina's A4 met Vinster branding, rapport-inhoud + vragenlijst
