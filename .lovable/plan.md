

## Plan: Ervaringen-pagina vullen met echte reacties

### Wat gaan we doen
De nep-ervaringen op de Ervaringen-pagina vervangen met de echte reacties uit het DOCX-bestand. Elke reactie krijgt nu ook een `role` veld (bijv. "Loopbaancoach", "Communicatiemedewerker Museum").

### Aanpassingen

**1. Component `Ervaringen.tsx` aanpassen**
- Het `role` veld tonen onder elk citaat (lichtgrijze tekst, rechts uitgelijnd of onder het citaat).

**2. Alle 4 taalbestanden updaten** (`nl`, `en`, `de`, `no`)
- **NL**: De 10 echte Nederlandse citaten uit het document overnemen, met bijbehorende rol.
- **EN**: Engelse vertalingen van alle 10 citaten.
- **DE**: Duitse vertalingen van alle 10 citaten.
- **NO**: Noorse vertalingen van alle 10 citaten.

### De 10 citaten (NL)

1. "Mooi om te zien wat voor verrassende inzichten zo'n loopbaanrapport kan geven..." — Loopbaancoach
2. "Ik heb het meteen uitgeprobeerd. Immers the proof of the pudding is in the eating..." — Loopbaancoach
3. "Ik sprak net iemand die ik ondersteun bij haar loopbaan..." — Loopbaancoach
4. "Ik heb ook een rapport laten maken om te kijken hoe het werkt..." — Loopbaancoach
5. "Heel zinvol om in te vullen! Brengt je echt aan het nadenken." — Communicatiemedewerker Museum
6. "Mijn klant wil stoppen met haar werk als administratief medewerker..." — Loopbaancoach
7. "Inmiddels heb ik alle stappen ingevuld in Vinster..." — Loopbaancoach
8. "Ik heb de Vinster tool doorlopen. Heel praktisch en goed te doen..." — Loopbaancoach
9. "Ik vind de vragen in Vinster echt super..." — Loopbaancoach
10. "Ik deed zelf ooit bij Heidi Jansen de Loopbaantrechter..." — Personal coach

### Technisch

- Testimonial type wordt `{ quote: string; role: string }`
- In `Ervaringen.tsx`: `testimonial.role` renderen als `<p>` onder de `<blockquote>`
- Intro-tekst en CTA blijven ongewijzigd

