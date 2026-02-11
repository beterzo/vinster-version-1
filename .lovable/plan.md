

# Plan: Privacy-aanpassing voor gebruik van accounts door derden

## Samenvatting

Toevoegen van juridische en communicatieve maatregelen om duidelijk te maken dat accounts bedoeld zijn voor individueel gebruik, en dat Vinster niet verantwoordelijk is wanneer derden via hetzelfde account werken.

---

## Overzicht van alle wijzigingen

| Wijziging | Locatie | Doel |
|-----------|---------|------|
| Nieuwe sectie in privacyverklaring | 4 taalbestanden + PrivacyVerklaring.tsx | Juridische afdekking |
| Extra punt in algemene voorwaarden | 4 taalbestanden | Juridische versterking |
| Melding op welkompagina journey | WelkomInline.tsx + 4 taalbestanden | Gebruiker informeren |

---

## Advies op de gestelde vragen

**Op welke pagina's dit het beste toegevoegd kan worden:**
1. **Privacyverklaring** - Nieuwe sectie "Gebruik van accounts door derden" (juridisch zwaarste gewicht)
2. **Algemene voorwaarden** - Extra punt bij sectie 3 "Account en toegang" (versterkt juridische positie)
3. **Welkompagina** - Subtiele melding bij het starten van het traject (communiceert richting gebruiker)

**Moet dit ook in de algemene voorwaarden?**
Ja. De algemene voorwaarden bevatten al "Het is niet toegestaan om uw account te delen met derden" en "U bent verantwoordelijk voor alle activiteiten onder uw account". Hier wordt een extra, explicieter punt aan toegevoegd over verantwoordelijkheid bij gedeeld gebruik.

**Technische notificatie bij meerdere rapporten?**
Dit is technisch mogelijk (er is al een `user_rounds` tabel), maar wordt in dit plan niet meegenomen omdat het de gebruikerservaring zou verstoren en niet alle multi-rapport-gebruikers misbruikers zijn. Dit kan later als aparte feature worden overwogen.

---

## Deel 1: Privacyverklaring uitbreiden (4 talen)

Toevoegen van een nieuwe sectie na "Beveiliging" (sectie 8), waardoor alle volgende secties opschuiven.

**Nederlands:**
```
Titel: "9. Gebruik van accounts door derden"
Tekst: "Elk Vinster-account is bedoeld voor individueel gebruik door de
accounthouder. Wanneer u derden via uw persoonlijke account toegang geeft
tot Vinster, bent u zelf verantwoordelijk voor de verwerking en bescherming
van de ingevoerde gegevens. Vinster is in dat geval niet verantwoordelijk
voor de privacy en veiligheid van deze gegevens. Wij adviseren iedereen
die Vinster wil gebruiken om een eigen account aan te maken."
```

**Engels:**
```
Titel: "9. Use of accounts by third parties"
Tekst: "Each Vinster account is intended for individual use by the account
holder. If you grant third parties access to Vinster via your personal
account, you are responsible for the processing and protection of the
data entered. In such cases, Vinster is not responsible for the privacy
and security of this data. We advise everyone who wishes to use Vinster
to create their own account."
```

**Duits:**
```
Titel: "9. Nutzung von Konten durch Dritte"
Tekst: "Jedes Vinster-Konto ist für die individuelle Nutzung durch den
Kontoinhaber bestimmt. Wenn Sie Dritten über Ihr persönliches Konto
Zugang zu Vinster gewähren, sind Sie selbst für die Verarbeitung und den
Schutz der eingegebenen Daten verantwortlich. Vinster ist in diesem Fall
nicht verantwortlich für den Datenschutz und die Sicherheit dieser Daten.
Wir empfehlen jedem, der Vinster nutzen möchte, ein eigenes Konto zu erstellen."
```

**Noors:**
```
Titel: "9. Bruk av kontoer av tredjeparter"
Tekst: "Hver Vinster-konto er ment for individuell bruk av kontoinnehaveren.
Hvis du gir tredjeparter tilgang til Vinster via din personlige konto, er
du selv ansvarlig for behandlingen og beskyttelsen av de innlagte dataene.
Vinster er i slike tilfeller ikke ansvarlig for personvernet og sikkerheten
til disse dataene. Vi anbefaler alle som ønsker å bruke Vinster å opprette
sin egen konto."
```

### Code-aanpassing in PrivacyVerklaring.tsx

Een extra `<section>` blok toevoegen na de "security" sectie, met de nieuwe vertaalsleutel `privacy.sections.third_party_accounts`.

---

## Deel 2: Algemene voorwaarden aanscherpen (4 talen)

Toevoegen van een extra bullet bij sectie 3 "Account en toegang" in alle 4 talen.

| Taal | Nieuwe bullet |
|------|---------------|
| NL | "Wanneer u derden via uw account toegang geeft tot Vinster, bent u volledig verantwoordelijk voor de privacy en bescherming van alle ingevoerde gegevens. Vinster aanvaardt hiervoor geen aansprakelijkheid." |
| EN | "If you grant third parties access to Vinster via your account, you are fully responsible for the privacy and protection of all data entered. Vinster accepts no liability for this." |
| DE | "Wenn Sie Dritten über Ihr Konto Zugang zu Vinster gewähren, sind Sie vollständig verantwortlich für den Datenschutz und den Schutz aller eingegebenen Daten. Vinster übernimmt hierfür keine Haftung." |
| NO | "Hvis du gir tredjeparter tilgang til Vinster via kontoen din, er du fullt ansvarlig for personvernet og beskyttelsen av alle innlagte data. Vinster aksepterer intet ansvar for dette." |

---

## Deel 3: Melding op welkompagina

Een subtiele, niet-opdringerige melding toevoegen onderaan de tips-sectie op de welkompagina (WelkomInline.tsx). Deze verschijnt als een rustig info-blok.

**Visueel:** Een lichtgrijs blok met een shield-icoon, in dezelfde stijl als de bestaande tijdsindicator.

**Tekst per taal:**

| Taal | Tekst |
|------|-------|
| NL | "Dit account is bedoeld voor persoonlijk gebruik. Laat anderen hun eigen account aanmaken voor de beste ervaring en privacy." |
| EN | "This account is intended for personal use. Let others create their own account for the best experience and privacy." |
| DE | "Dieses Konto ist für den persönlichen Gebrauch bestimmt. Lassen Sie andere ihr eigenes Konto erstellen für das beste Erlebnis und Datenschutz." |
| NO | "Denne kontoen er ment for personlig bruk. La andre opprette sin egen konto for best opplevelse og personvern." |

---

## Bestanden die worden aangepast

| Bestand | Actie |
|---------|-------|
| `src/locales/nl/landing.json` | Privacy sectie 9 + AV extra bullet + welkom tekst |
| `src/locales/en/landing.json` | Privacy sectie 9 + AV extra bullet + welkom tekst |
| `src/locales/de/landing.json` | Privacy sectie 9 + AV extra bullet + welkom tekst |
| `src/locales/no/landing.json` | Privacy sectie 9 + AV extra bullet + welkom tekst |
| `src/pages/PrivacyVerklaring.tsx` | Extra section blok toevoegen |
| `src/components/journey/WelkomInline.tsx` | Info-melding toevoegen |
| `src/locales/nl/journey.json` | Welkom account-melding tekst |
| `src/locales/en/journey.json` | Welkom account-melding tekst |
| `src/locales/de/journey.json` | Welkom account-melding tekst |
| `src/locales/no/journey.json` | Welkom account-melding tekst |

---

## Wat dit plan NIET doet

- **Geen technische blokkering** van gedeeld gebruik (zou gebruikers onterecht kunnen treffen)
- **Geen pop-up notificatie** bij meerdere rapporten (kan later als aparte feature)
- **Geen melding bij account-aanmaak** (de welkompagina is effectiever omdat die bij elke sessie gezien wordt)

