

# Plan: Organisatie-aanvraag via Resend e-mail i.p.v. Make.com webhook

## Samenvatting

Het organisatieformulier ("Voor organisaties") op de pagina `/access-codes-professionals` stuurt momenteel data naar een Make.com webhook. Dit wordt vervangen door een Supabase Edge Function die via Resend een mooi opgemaakte e-mail stuurt naar **team@vinster.ai** en **kai@beterzo.tech**.

---

## Wat verandert er

| Onderdeel | Nu | Straks |
|-----------|-----|--------|
| Organisatieformulier submit | POST naar Make.com webhook | Supabase Edge Function `send-organization-request` |
| Notificatie | Alleen via Make.com | E-mail naar team@vinster.ai + kai@beterzo.tech |
| E-mail styling | Geen | Vinster-stijl met duidelijke tabel |

**Let op:** Het bovenste formulier (individuele toegangscodes) blijft ongewijzigd via de Make.com webhook.

---

## Deel 1: Nieuwe Edge Function `send-organization-request`

Nieuw bestand: `supabase/functions/send-organization-request/index.ts`

De functie:
- Ontvangt de formulierdata (naam, email, organisatie, aantal, adres, kostenplaats, opmerkingen)
- Valideert verplichte velden
- Stuurt een e-mail naar **beide** ontvangers: `team@vinster.ai` en `kai@beterzo.tech`
- Gebruikt de bestaande `RESEND_API_KEY` secret (al geconfigureerd)
- E-mail in Vinster-stijl met een nette tabel:

```
Onderwerp: "Nieuwe organisatie-aanvraag: [Organisatienaam] - [Aantal] codes"

Inhoud:
- Vinster logo header
- Titel: "Nieuwe aanvraag toegangscodes"
- Tabel met kolommen:
  | Veld                  | Waarde              |
  |-----------------------|---------------------|
  | Naam                  | ...                 |
  | E-mailadres           | ...                 |
  | Organisatie           | ...                 |
  | Aantal codes          | ...                 |
  | Adres organisatie     | ...                 |
  | Kostenplaats          | ...                 |
  | Opmerkingen           | ...                 |
  | Tijdstip aanvraag     | ...                 |
- Footer met Vinster branding
```

De e-mail gebruikt Vinster kleuren (#232D4B donkerblauw, #F0F4FF lichtblauw achtergrond) en een professionele HTML-tabel layout.

---

## Deel 2: OrganizationForm.tsx aanpassen

In `src/components/OrganizationForm.tsx`:

- Vervang de `fetch` naar `https://hook.eu2.make.com/ridk4qt9ezc49c632dhws7h03p1dyre8`
- Door een call naar `supabase.functions.invoke('send-organization-request', { body: { ... } })`
- Dezelfde velden worden meegestuurd, dezelfde validatie blijft behouden
- Success/error handling blijft identiek

---

## Bestanden

| Bestand | Actie |
|---------|-------|
| `supabase/functions/send-organization-request/index.ts` | Nieuw - Edge Function |
| `src/components/OrganizationForm.tsx` | Aanpassen - webhook vervangen door edge function |

---

## Technische details

- Geen nieuwe secrets nodig (`RESEND_API_KEY` bestaat al)
- Geen database wijzigingen nodig
- Edge function wordt automatisch gedeployed
- `verify_jwt = false` in config.toml (formulier is publiek, geen login vereist)
