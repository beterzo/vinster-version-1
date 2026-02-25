

## Twee aanpassingen

### 1. Organisatie-badge toevoegen aan Dashboard en PaymentRequired

Dezelfde badge (Building2 icoon + organisatienaam, gele achtergrond) die nu op de RondeDashboard staat, wordt ook toegevoegd aan:

**Dashboard (`src/components/Dashboard.tsx`)**
- Import `useOrganisation` en `Building2`
- Badge plaatsen in de welkomst-card, direct onder de welkomsttekst (regel 175-176), voor de beschrijvingstekst

**PaymentRequired (`src/pages/PaymentRequired.tsx`)**
- Import `useOrganisation` en `Building2`
- Badge plaatsen in de welkomstsectie, direct onder de subtitel (regel 183-184)

Styling is identiek aan de RondeDashboard badge:
`inline-flex items-center gap-1.5 text-xs font-medium bg-[#FEF9E6] text-[#232D4B] px-3 py-1 rounded-full`

### 2. WelkomInline stappen-grid centreren

**WelkomInline (`src/components/journey/WelkomInline.tsx`)**

Huidige grid (regel 112):
```
grid gap-4 md:grid-cols-2 lg:grid-cols-3
```
Dit zet 3 kaarten bovenaan en 2 (of 3) links-uitgelijnd onderaan.

Oplossing: de grid-container veranderen zodat de onderste rij gecentreerd wordt. Dit doe ik door de grid-container `justify-items-center` te geven en de items een `max-w` mee te geven, OF door een flexbox-aanpak te gebruiken:

Verander van een CSS grid naar een flex-wrap layout:
```
flex flex-wrap justify-center gap-4
```
Met elk item een vaste breedte:
```
w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]
```

Dit zorgt ervoor dat bij 5 items (organisatie-modus) de 2 onderste kaarten gecentreerd staan, en bij 6 items (normaal) ze netjes 3+3 vullen.

### Bestanden

| Bestand | Wijziging |
|---------|-----------|
| `src/components/Dashboard.tsx` | Organisatie-badge in welkomst-card |
| `src/pages/PaymentRequired.tsx` | Organisatie-badge in welkomstsectie |
| `src/components/journey/WelkomInline.tsx` | Grid naar flex-wrap voor gecentreerde onderste rij |
