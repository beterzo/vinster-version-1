

# Alleen Medisch Centrum / ErasmusMC als actief traject

## Samenvatting

Alleen via **Medisch Centrum** (en de sub-organisatie **ErasmusMC**) kan daadwerkelijk een Vinster-traject gestart worden. Alle andere organisatietypen (Hogeschool, Transport, Financieel, Universiteit, Zorgorganisatie, Mbo-instelling) worden op inactief gezet in de database. Daardoor toont hun landingspagina automatisch de bestaande "Toegang tot Vinster voor jouw organisatie? Neem contact op"-melding.

De navigatiemenu's blijven ongewijzigd -- alle organisaties blijven zichtbaar en klikbaar, maar leiden naar de contactpagina.

## Aanpassing

### Database-update (geen schema-wijziging, alleen data)

De volgende organisatietypen worden op `is_active = false` gezet:

| Organisatie | Huidige status | Nieuwe status |
|---|---|---|
| Medisch Centrum | actief | **actief** (blijft) |
| ErasmusMC | actief | **actief** (blijft) |
| Hogeschool | actief | **inactief** |
| Transport en Logistiek | actief | **inactief** |
| Financieel | actief | **inactief** |
| Universiteit | actief | **inactief** |
| Zorgorganisatie | actief | **inactief** |
| Mbo-instelling | inactief | **inactief** (blijft) |

### Resultaat

- Klikken op bijv. "Hogeschool" of "Transport" in het menu leidt naar `/organisaties/hogeschool` etc.
- De landingspagina vindt geen actieve organisatie en toont: **"Toegang tot Vinster voor jouw organisatie? Neem contact op"** met een mailto-link naar team@vinster.ai
- Medisch Centrum en ErasmusMC blijven volledig functioneel

### Geen code-aanpassingen nodig

De bestaande fallback in `OrganisatieLanding.tsx` regelt dit automatisch. De navigatie (desktop + mobiel) is al bijgewerkt zodat alle items klikbaar zijn.

