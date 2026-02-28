

# Logo beschikbaar maken via publieke URL

## Wat er gebeurt

Het geüploade logo (wit op blauw) wordt gekopieerd naar de `public/images/` map van het project. Na deployment is het logo bereikbaar op:

```text
https://vinster.lovable.app/images/vinster-logo-wit-op-blauw.png
```

Deze URL kun je direct gebruiken in de HTML van je nieuwsbrief, bijvoorbeeld:

```text
<img src="https://vinster.lovable.app/images/vinster-logo-wit-op-blauw.png" alt="Vinster Logo" />
```

## Technisch

- **Kopieer** `user-uploads://Vinster_logo_wit_op_blauw.png` naar `public/images/vinster-logo-wit-op-blauw.png`
- Geen code-aanpassingen nodig, het bestand wordt automatisch geserveerd als statisch asset

