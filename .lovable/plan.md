
# Fix: Hardcoded Nederlandse knoptekst op successcherm

## Probleem
De knop "Nieuw formulier invullen" op het successcherm van het organisatieformulier is hardcoded in het Nederlands, waardoor deze tekst ook verschijnt op de Engelse, Duitse en Noorse versie van de site.

## Oplossing

### 1. Vertaalsleutel toevoegen aan alle 4 taalbestanden

In `professionals.organization_form` een nieuw veld `new_form_button` toevoegen:

| Taal | Bestand | Tekst |
|------|---------|-------|
| NL | `src/locales/nl/professionals.json` | "Nieuw formulier invullen" |
| EN | `src/locales/en/professionals.json` | "Fill in a new form" |
| DE | `src/locales/de/professionals.json` | "Neues Formular ausfullen" |
| NO | `src/locales/no/professionals.json` | "Fyll ut nytt skjema" |

### 2. Hardcoded tekst vervangen in component

In `src/components/OrganizationForm.tsx` (regel ~157):
- Vervang `Nieuw formulier invullen` door `{t('professionals.organization_form.new_form_button')}`

## Bestanden die worden aangepast

| Bestand | Actie |
|---------|-------|
| `src/locales/nl/professionals.json` | Nieuw veld toevoegen |
| `src/locales/en/professionals.json` | Nieuw veld toevoegen |
| `src/locales/de/professionals.json` | Nieuw veld toevoegen |
| `src/locales/no/professionals.json` | Nieuw veld toevoegen |
| `src/components/OrganizationForm.tsx` | Hardcoded tekst vervangen door vertaalsleutel |
