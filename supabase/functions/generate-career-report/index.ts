import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportContent {
  voorblad: {
    naam: string;
    start_datum: string;
    eind_datum: string;
  };
  ideale_functie: {
    activiteiten: string[];
    werkomgeving: string[];
    interessegebieden: string[];
  };
  beroepen: {
    passend_1: {
      titel: string;
      beschrijving: string;
    };
    passend_2: {
      titel: string;
      beschrijving: string;
    };
    verrassend: {
      titel: string;
      beschrijving: string;
    };
  };
}

interface UserData {
  firstName: string;
  lastName: string;
  userId: string;
  // Enthousiasme data
  kindertijdActiviteiten: string;
  kindertijdPlekken: string;
  kindertijdInteresses: string;
  eersteWerkLeuksteTaken: string;
  eersteWerkOnderwerpen: string;
  eersteWerkOmstandigheden: string;
  plezierigWerkperiode: string;
  fluitendThuiskomenDag: string;
  leukProjectEnRol: string;
  // AI keywords
  aiActiviteiten: string;
  aiWerkomstandigheden: string;
  aiInteresses: string;
  // Selected keywords
  selectedActiviteiten: string;
  selectedWerkomstandigheden: string;
  selectedInteresses: string;
  // Extra text
  extraActiviteiten: string;
  extraWerkomstandigheden: string;
  extraInteresses: string;
  // Wensberoepen
  wensberoep1: {
    titel: string;
    werkweekActiviteiten: string;
    werklocatieOmgeving: string;
    samenwerkingContacten: string;
    fluitendThuiskomen: string;
    werkDoel: string;
    leuksteOnderdelen: string;
    belangrijkeAspecten: string;
    kennisFocus: string;
  };
  wensberoep2: {
    titel: string;
    werkweekActiviteiten: string;
    werklocatieOmgeving: string;
    samenwerkingContacten: string;
    fluitendThuiskomen: string;
    werkDoel: string;
    leuksteOnderdelen: string;
    belangrijkeAspecten: string;
    kennisFocus: string;
  };
  wensberoep3: {
    titel: string;
    werkweekActiviteiten: string;
    werklocatieOmgeving: string;
    samenwerkingContacten: string;
    fluitendThuiskomen: string;
    werkDoel: string;
    leuksteOnderdelen: string;
    belangrijkeAspecten: string;
    kennisFocus: string;
  };
  // Extra info
  opleidingsniveau: string;
  beroepsopleiding: string;
  fysiekeBeperkingen: string;
}

function getOrganisationSectorPrompts(language: string, sectorName: string, organisationName: string, data: UserData, vacancies?: any[]): { system: string; user: string } {
  // Groepeer vacatures per categorie voor gestructureerde weergave
  let vacatureList: string | null = null;
  if (vacancies && vacancies.length > 0) {
    const grouped: Record<string, typeof vacancies> = {};
    vacancies.forEach(v => {
      const cat = v.category || 'Overig';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(v);
    });
    vacatureList = Object.entries(grouped)
      .map(([cat, vacs]) =>
        `CATEGORIE: ${cat}\n${(vacs as any[]).map(v =>
          `• ${v.title}${v.description ? ` — ${v.description}` : ''}`
        ).join('\n')}`
      ).join('\n\n');
  }

  const prompts: Record<string, { system: string; user: string }> = {
    nl: {
      system: `Je bent een professionele loopbaancoach voor medewerkers van ${organisationName} binnen de sector "${sectorName}".

Je ontvangt informatie over een medewerker en kiest drie concrete functies die bij deze persoon passen.

BELANGRIJK: Je ontvangt GEEN beroepsnamen van de medewerker -- die zijn bewust weggelaten. Baseer je functievoorstellen UITSLUITEND op de inhoud van de antwoorden en kernwoorden. Laat je niet leiden door veronderstellingen over welk beroep de medewerker in gedachten had.
${vacatureList ? `
BESCHIKBARE FUNCTIES BINNEN ${organisationName}:
Je MOET je 3 voorstellen kiezen uit onderstaande functies. Gebruik de functietitel EXACT zoals hieronder staat. Verzin GEEN eigen titels.

${vacatureList}

SELECTIEREGELS:
1. Kies PRECIES 3 functies uit bovenstaande lijst.
2. Gebruik de EXACTE functietitel -- wijzig deze niet.
3. De 3 functies moeten uit minimaal 2 verschillende categorieën komen.
4. Functie 1 en 2 zijn de meest logische en herkenbare matches op basis van de kernwoorden.
5. Functie 3 is bewust verrassend en onverwacht -- kies deze uit een ANDERE categorie dan functie 1 en 2. Begin met: "En als verrassing..." of "Misschien had je dit niet verwacht, maar..."
6. Schrijf per functie 2-3 zinnen, maximaal 40 woorden.
7. Verwerk actief de kernwoorden van de medewerker in je uitleg.
8. Houd rekening met opleidingsniveau en eventuele beperkingen.` : `
Je kiest:
• Twee logische, passende functies die direct aansluiten op de voorkeuren van de medewerker
• Eén verrassend, avontuurlijk en onverwacht alternatief -- een functie die de medewerker zelf waarschijnlijk niet snel zou bedenken, maar die wél aansluit bij het opleidingsniveau en de kernvaardigheden. Kies bewust een richting die de medewerker zelf nooit zou googelen of overwegen. Verras echt. Begin deze met: "En als verrassing..." of "Misschien had je dit niet verwacht, maar..."`}

SCHRIJFSTIJL:
Schrijf vloeiende, natuurlijke zinnen. Begin elke zin met een hoofdletter, ook na een punt. Beroepstitels beginnen ook met een hoofdletter. Verwerk de kernwoorden subtiel in de tekst — gebruik ze NIET letterlijk met hoofdletters midden in een zin. Schrijf zoals een mens zou schrijven, niet als een opsomming van trefwoorden.

Je antwoordt altijd in exact de gevraagde JSON-structuur, zonder toelichting erboven of eronder.
Lever uitsluitend het JSON-object aan.`,
      user: `Je genereert een loopbaanrapport voor een medewerker van ${organisationName}.

Hier is informatie over de medewerker:
• Naam: ${data.firstName} ${data.lastName}

De medewerker heeft 3 sets van 8 vragen beantwoord over ideale werksituaties. De beroepsnamen zijn bewust weggelaten -- analyseer alleen de antwoorden.

Beschrijving 1:
- Werkweek activiteiten: ${data.wensberoep1.werkweekActiviteiten}
- Werklocatie: ${data.wensberoep1.werklocatieOmgeving}
- Samenwerking: ${data.wensberoep1.samenwerkingContacten}
- Fluitend thuiskomen: ${data.wensberoep1.fluitendThuiskomen}
- Doel: ${data.wensberoep1.werkDoel}
- Leukste onderdelen: ${data.wensberoep1.leuksteOnderdelen}
- Belangrijke aspecten: ${data.wensberoep1.belangrijkeAspecten}
- Kennis focus: ${data.wensberoep1.kennisFocus}

Beschrijving 2:
- Werkweek activiteiten: ${data.wensberoep2.werkweekActiviteiten}
- Werklocatie: ${data.wensberoep2.werklocatieOmgeving}
- Samenwerking: ${data.wensberoep2.samenwerkingContacten}
- Fluitend thuiskomen: ${data.wensberoep2.fluitendThuiskomen}
- Doel: ${data.wensberoep2.werkDoel}
- Leukste onderdelen: ${data.wensberoep2.leuksteOnderdelen}
- Belangrijke aspecten: ${data.wensberoep2.belangrijkeAspecten}
- Kennis focus: ${data.wensberoep2.kennisFocus}

Beschrijving 3:
- Werkweek activiteiten: ${data.wensberoep3.werkweekActiviteiten}
- Werklocatie: ${data.wensberoep3.werklocatieOmgeving}
- Samenwerking: ${data.wensberoep3.samenwerkingContacten}
- Fluitend thuiskomen: ${data.wensberoep3.fluitendThuiskomen}
- Doel: ${data.wensberoep3.werkDoel}
- Leukste onderdelen: ${data.wensberoep3.leuksteOnderdelen}
- Belangrijke aspecten: ${data.wensberoep3.belangrijkeAspecten}
- Kennis focus: ${data.wensberoep3.kennisFocus}

AI-gegenereerde kernwoorden (volledige set):
• Activiteiten: ${data.aiActiviteiten}
• Werkomgeving: ${data.aiWerkomstandigheden}
• Interesses: ${data.aiInteresses}

Door de medewerker geselecteerde kernwoorden (meest belangrijk):
• Lievelings activiteiten: ${data.selectedActiviteiten}
• Werkomgeving: ${data.selectedWerkomstandigheden}
• Interesses: ${data.selectedInteresses}

Extra toelichting:
• Activiteiten: ${data.extraActiviteiten}
• Werkomgeving: ${data.extraWerkomstandigheden}
• Interesses: ${data.extraInteresses}

Context:
• Opleiding: ${data.opleidingsniveau}
• Richting: ${data.beroepsopleiding}
• Beperkingen: ${data.fysiekeBeperkingen}

Geef je 3 functievoorstellen op basis van bovenstaande informatie.`
    },
    en: {
      system: `You are a professional career coach for employees of ${organisationName} within the "${sectorName}" sector.

You receive information about an employee and choose three concrete roles that fit this person.

IMPORTANT: You do NOT receive occupation names from the employee -- these have been deliberately omitted. Base your suggestions EXCLUSIVELY on the content of the answers and keywords. Do not be guided by assumptions about what occupation the employee had in mind.
${vacatureList ? `
AVAILABLE ROLES WITHIN ${organisationName}:
You MUST choose your 3 suggestions from the roles listed below. Use the job title EXACTLY as listed. Do NOT invent your own titles.

${vacatureList}

SELECTION RULES:
1. Choose EXACTLY 3 roles from the list above.
2. Use the EXACT job title -- do not modify it.
3. The 3 roles must come from at least 2 different categories.
4. Roles 1 and 2 are the most logical and recognisable matches based on the keywords.
5. Role 3 is deliberately surprising and unexpected -- choose it from a DIFFERENT category than roles 1 and 2.
6. Write 2-3 sentences per role, maximum 40 words.
7. Actively use the employee's keywords in your explanation.
8. Take education level and any limitations into account.` : `
You choose:
• Two logical, fitting occupations that directly match the employee's preferences
• One surprising, adventurous and unexpected alternative -- a role the employee would likely not have thought of themselves, but that still matches their education level and core competencies. Choose a direction the employee would never search for or consider on their own. Truly surprise them.`}

WRITING STYLE:
Write fluent, natural sentences. Start every sentence with a capital letter, including after a period. Job titles also start with a capital letter. Weave the keywords subtly into the text — do NOT use them literally with capital letters in the middle of a sentence. Write as a human would write, not as a list of buzzwords.

You always respond in exactly the requested JSON structure, without any explanation above or below it.
Provide only the JSON object.`,
      user: `You are generating a career report for an employee of ${organisationName}.

Here is information about the employee:
• Name: ${data.firstName} ${data.lastName}

The employee has answered 3 sets of 8 questions about ideal work situations. Occupation names have been deliberately omitted -- analyse only the answers.

Description 1:
- Weekly activities: ${data.wensberoep1.werkweekActiviteiten}
- Work location: ${data.wensberoep1.werklocatieOmgeving}
- Collaboration: ${data.wensberoep1.samenwerkingContacten}
- Satisfied day: ${data.wensberoep1.fluitendThuiskomen}
- Goal: ${data.wensberoep1.werkDoel}
- Best parts: ${data.wensberoep1.leuksteOnderdelen}
- Important aspects: ${data.wensberoep1.belangrijkeAspecten}
- Knowledge focus: ${data.wensberoep1.kennisFocus}

Description 2:
- Weekly activities: ${data.wensberoep2.werkweekActiviteiten}
- Work location: ${data.wensberoep2.werklocatieOmgeving}
- Collaboration: ${data.wensberoep2.samenwerkingContacten}
- Satisfied day: ${data.wensberoep2.fluitendThuiskomen}
- Goal: ${data.wensberoep2.werkDoel}
- Best parts: ${data.wensberoep2.leuksteOnderdelen}
- Important aspects: ${data.wensberoep2.belangrijkeAspecten}
- Knowledge focus: ${data.wensberoep2.kennisFocus}

Description 3:
- Weekly activities: ${data.wensberoep3.werkweekActiviteiten}
- Work location: ${data.wensberoep3.werklocatieOmgeving}
- Collaboration: ${data.wensberoep3.samenwerkingContacten}
- Satisfied day: ${data.wensberoep3.fluitendThuiskomen}
- Goal: ${data.wensberoep3.werkDoel}
- Best parts: ${data.wensberoep3.leuksteOnderdelen}
- Important aspects: ${data.wensberoep3.belangrijkeAspecten}
- Knowledge focus: ${data.wensberoep3.kennisFocus}

AI-generated keywords (full set):
• Activities: ${data.aiActiviteiten}
• Work environment: ${data.aiWerkomstandigheden}
• Interests: ${data.aiInteresses}

Employee-selected keywords (most important):
• Favourite activities: ${data.selectedActiviteiten}
• Work environment: ${data.selectedWerkomstandigheden}
• Interests: ${data.selectedInteresses}

Extra explanations:
• Activities: ${data.extraActiviteiten}
• Work environment: ${data.extraWerkomstandigheden}
• Interests: ${data.extraInteresses}

Context:
• Education: ${data.opleidingsniveau}
• Field of study: ${data.beroepsopleiding}
• Limitations: ${data.fysiekeBeperkingen}

Provide your 3 role suggestions based on the information above.`
    },
    de: {
      system: `Du bist ein professioneller Karriereberater für Mitarbeiter von ${organisationName} im Bereich "${sectorName}".

Du erhältst Informationen über eine Mitarbeiterin / einen Mitarbeiter und wählst drei konkrete Funktionen, die zu dieser Person passen.

WICHTIG: Du erhältst KEINE Berufsnamen von der Person -- diese wurden bewusst weggelassen. Basiere deine Vorschläge AUSSCHLIESSLICH auf dem Inhalt der Antworten und Schlüsselwörter.
${vacatureList ? `
VERFÜGBARE FUNKTIONEN BEI ${organisationName}:
Du MUSST deine 3 Vorschläge aus den unten aufgeführten Funktionen wählen. Verwende den Berufstitel EXAKT wie angegeben. Erfinde KEINE eigenen Titel.

${vacatureList}

AUSWAHLREGELN:
1. Wähle GENAU 3 Funktionen aus der obigen Liste.
2. Verwende den EXAKTEN Berufstitel -- ändere ihn nicht.
3. Die 3 Funktionen müssen aus mindestens 2 verschiedenen Kategorien stammen.
4. Funktion 1 und 2 sind die logischsten und erkennbarsten Übereinstimmungen.
5. Funktion 3 ist bewusst überraschend -- wähle sie aus einer ANDEREN Kategorie als Funktion 1 und 2.
6. Schreibe 2-3 Sätze pro Funktion, maximal 40 Wörter.
7. Verarbeite aktiv die Schlüsselwörter der Person.
8. Berücksichtige Bildungsniveau und eventuelle Einschränkungen.` : `
Du wählst:
• Zwei logische, passende Berufe, die direkt an die Präferenzen der Person anknüpfen
• Einen überraschenden, abenteuerlichen und unerwarteten Alternativberuf -- einen Beruf, an den die Person selbst wahrscheinlich nicht gedacht hätte, der aber zum Bildungsniveau und den Kernkompetenzen passt.`}

SCHREIBSTIL:
Schreibe flüssige, natürliche Sätze. Beginne jeden Satz mit einem Großbuchstaben, auch nach einem Punkt. Berufsbezeichnungen beginnen ebenfalls mit einem Großbuchstaben. Verarbeite die Schlüsselwörter subtil im Text — verwende sie NICHT wörtlich mit Großbuchstaben mitten im Satz. Schreibe so, wie ein Mensch schreiben würde, nicht wie eine Aufzählung von Schlagwörtern.

Du antwortest immer exakt in der geforderten JSON-Struktur, ohne zusätzliche Erklärungen.
Liefere ausschließlich das JSON-Objekt.`,
      user: `Du erstellst einen Karrierebericht für eine Mitarbeiterin / einen Mitarbeiter von ${organisationName}.

Informationen zur Person:
• Name: ${data.firstName} ${data.lastName}

Die Person hat 3 Sets von je 8 Fragen über ideale Arbeitssituationen beantwortet. Die Berufsnamen wurden bewusst weggelassen -- analysiere ausschließlich die Antworten.

Beschreibung 1:
- Wochenaktivitäten: ${data.wensberoep1.werkweekActiviteiten}
- Arbeitsort: ${data.wensberoep1.werklocatieOmgeving}
- Zusammenarbeit: ${data.wensberoep1.samenwerkingContacten}
- Zufriedener Tag: ${data.wensberoep1.fluitendThuiskomen}
- Ziel: ${data.wensberoep1.werkDoel}
- Beste Teile: ${data.wensberoep1.leuksteOnderdelen}
- Wichtige Aspekte: ${data.wensberoep1.belangrijkeAspecten}
- Wissensfokus: ${data.wensberoep1.kennisFocus}

Beschreibung 2:
- Wochenaktivitäten: ${data.wensberoep2.werkweekActiviteiten}
- Arbeitsort: ${data.wensberoep2.werklocatieOmgeving}
- Zusammenarbeit: ${data.wensberoep2.samenwerkingContacten}
- Zufriedener Tag: ${data.wensberoep2.fluitendThuiskomen}
- Ziel: ${data.wensberoep2.werkDoel}
- Beste Teile: ${data.wensberoep2.leuksteOnderdelen}
- Wichtige Aspekte: ${data.wensberoep2.belangrijkeAspecten}
- Wissensfokus: ${data.wensberoep2.kennisFocus}

Beschreibung 3:
- Wochenaktivitäten: ${data.wensberoep3.werkweekActiviteiten}
- Arbeitsort: ${data.wensberoep3.werklocatieOmgeving}
- Zusammenarbeit: ${data.wensberoep3.samenwerkingContacten}
- Zufriedener Tag: ${data.wensberoep3.fluitendThuiskomen}
- Ziel: ${data.wensberoep3.werkDoel}
- Beste Teile: ${data.wensberoep3.leuksteOnderdelen}
- Wichtige Aspekte: ${data.wensberoep3.belangrijkeAspecten}
- Wissensfokus: ${data.wensberoep3.kennisFocus}

KI-generierte Schlüsselwörter (vollständiger Satz):
• Aktivitäten: ${data.aiActiviteiten}
• Arbeitsumgebung: ${data.aiWerkomstandigheden}
• Interessen: ${data.aiInteresses}

Von der Person ausgewählte Schlüsselwörter (am wichtigsten):
• Lieblingsaktivitäten: ${data.selectedActiviteiten}
• Arbeitsumgebung: ${data.selectedWerkomstandigheden}
• Interessen: ${data.selectedInteresses}

Zusätzliche Erläuterungen:
• Aktivitäten: ${data.extraActiviteiten}
• Arbeitsumgebung: ${data.extraWerkomstandigheden}
• Interessen: ${data.extraInteresses}

Kontext:
• Bildungsabschluss: ${data.opleidingsniveau}
• Fachrichtung: ${data.beroepsopleiding}
• Einschränkungen: ${data.fysiekeBeperkingen}

Gib deine 3 Funktionsvorschläge auf Basis der obigen Informationen.`
    },
    no: {
      system: `Du er en profesjonell karriereveileder for ansatte hos ${organisationName} innenfor "${sectorName}"-sektoren.

Du mottar informasjon om en ansatt og velger tre konkrete funksjoner som passer denne personen.

VIKTIG: Du mottar INGEN yrkesnavn fra den ansatte -- disse er bevisst utelatt. Baser forslagene dine UTELUKKENDE på innholdet i svarene og nøkkelordene.
${vacatureList ? `
TILGJENGELIGE FUNKSJONER HOS ${organisationName}:
Du MÅ velge dine 3 forslag fra funksjonene listet nedenfor. Bruk yrkestittelen NØYAKTIG som angitt. IKKE finn opp egne titler.

${vacatureList}

UTVALGSREGLER:
1. Velg NØYAKTIG 3 funksjoner fra listen ovenfor.
2. Bruk den EKSAKTE yrkestittelen -- ikke endre den.
3. De 3 funksjonene må komme fra minst 2 forskjellige kategorier.
4. Funksjon 1 og 2 er de mest logiske og gjenkjennelige treffene.
5. Funksjon 3 er bevisst overraskende -- velg den fra en ANNEN kategori enn funksjon 1 og 2.
6. Skriv 2-3 setninger per funksjon, maksimalt 40 ord.
7. Bruk aktivt nøkkelordene til den ansatte.
8. Ta hensyn til utdanningsnivå og eventuelle begrensninger.` : `
Du velger:
• To logiske, passende yrker som direkte samsvarer med den ansattes preferanser
• Ett overraskende, eventyrlig og uventet alternativ -- et yrke den ansatte sannsynligvis ikke ville tenkt på selv, men som likevel passer med utdanningsnivået og kjernekompetansene.`}

SKRIVESTIL:
Skriv flytende, naturlige setninger. Start hver setning med stor bokstav, også etter punktum. Yrkesbenevnelser starter også med stor bokstav. Vev nøkkelordene subtilt inn i teksten — IKKE bruk dem bokstavelig med store bokstaver midt i en setning. Skriv slik et menneske ville skrevet, ikke som en oppramsing av stikkord.

Du svarer alltid i nøyaktig den forespurte JSON-strukturen, uten forklaring.
Lever kun JSON-objektet.`,
      user: `Du genererer en karriererapport for en ansatt hos ${organisationName}.

Informasjon om den ansatte:
• Navn: ${data.firstName} ${data.lastName}

Den ansatte har besvart 3 sett med 8 spørsmål om ideale arbeidssituasjoner. Yrkesnavnene er bevisst utelatt -- analyser kun svarene.

Beskrivelse 1:
- Ukeaktiviteter: ${data.wensberoep1.werkweekActiviteiten}
- Arbeidssted: ${data.wensberoep1.werklocatieOmgeving}
- Samarbeid: ${data.wensberoep1.samenwerkingContacten}
- Fornøyd dag: ${data.wensberoep1.fluitendThuiskomen}
- Mål: ${data.wensberoep1.werkDoel}
- Beste deler: ${data.wensberoep1.leuksteOnderdelen}
- Viktige aspekter: ${data.wensberoep1.belangrijkeAspecten}
- Kunnskapsfokus: ${data.wensberoep1.kennisFocus}

Beskrivelse 2:
- Ukeaktiviteter: ${data.wensberoep2.werkweekActiviteiten}
- Arbeidssted: ${data.wensberoep2.werklocatieOmgeving}
- Samarbeid: ${data.wensberoep2.samenwerkingContacten}
- Fornøyd dag: ${data.wensberoep2.fluitendThuiskomen}
- Mål: ${data.wensberoep2.werkDoel}
- Beste deler: ${data.wensberoep2.leuksteOnderdelen}
- Viktige aspekter: ${data.wensberoep2.belangrijkeAspecten}
- Kunnskapsfokus: ${data.wensberoep2.kennisFocus}

Beskrivelse 3:
- Ukeaktiviteter: ${data.wensberoep3.werkweekActiviteiten}
- Arbeidssted: ${data.wensberoep3.werklocatieOmgeving}
- Samarbeid: ${data.wensberoep3.samenwerkingContacten}
- Fornøyd dag: ${data.wensberoep3.fluitendThuiskomen}
- Mål: ${data.wensberoep3.werkDoel}
- Beste deler: ${data.wensberoep3.leuksteOnderdelen}
- Viktige aspekter: ${data.wensberoep3.belangrijkeAspecten}
- Kunnskapsfokus: ${data.wensberoep3.kennisFocus}

AI-genererte nøkkelord (fullstendig sett):
• Aktiviteter: ${data.aiActiviteiten}
• Arbeidsmiljø: ${data.aiWerkomstandigheden}
• Interesser: ${data.aiInteresses}

Nøkkelord valgt av den ansatte (viktigst):
• Favorittaktiviteter: ${data.selectedActiviteiten}
• Arbeidsmiljø: ${data.selectedWerkomstandigheden}
• Interesser: ${data.selectedInteresses}

Ekstra forklaringer:
• Aktiviteter: ${data.extraActiviteiten}
• Arbeidsmiljø: ${data.extraWerkomstandigheden}
• Interesser: ${data.extraInteresses}

Kontekst:
• Utdanningsnivå: ${data.opleidingsniveau}
• Utdanningsretning: ${data.beroepsopleiding}
• Begrensninger: ${data.fysiekeBeperkingen}

Gi dine 3 funksjonsforslag basert på informasjonen ovenfor.`
    }
  };

  return prompts[language] || prompts.nl;
}

function getCareerReportPrompts(language: string, data: UserData): { system: string; user: string } {
  const prompts: Record<string, { system: string; user: string }> = {
    nl: {
      system: `Je bent een professionele loopbaancoach met diepgaande kennis van bestaande beroepen, functies, sectoren en loopbaanontwikkeling. Je denkt praktisch en mensgericht, en baseert je adviezen op een aantal interviews en wat iemand leuk vindt om te doen (activiteiten), waar iemand zich prettig voelt (werkomgeving), en waar iemand oprecht in geïnteresseerd is (interesses).

Je ontvangt GEEN beroepsnamen van de gebruiker -- die zijn bewust weggelaten. Baseer je functievoorstellen UITSLUITEND op de inhoud van de antwoorden. Laat je niet leiden door veronderstellingen over welk beroep de gebruiker in gedachten had.

Je ontvangt informatie over de antwoorden van een gebruiker op vragen over ideale werksituaties, en ook over iemand zijn/haar lievelings activiteiten, gewenste werkomgeving en interesses.

Je vertaalt dit profiel naar drie bestaande functies die passen bij het Nederlandse arbeidslandschap. Dit zijn:
• Twee logische, passende beroepen die direct aansluiten op de voorkeuren van de gebruiker
• Eén verrassend, avontuurlijk en onverwacht alternatief — een functie die de gebruiker zelf waarschijnlijk niet snel zou bedenken, maar die qua opleidingsniveau en kernvaardigheden wél haalbaar is. Kies bewust een richting die de gebruiker zelf nooit zou googelen of overwegen. Verras echt. Durf creatief te denken en buiten de gebaande paden te gaan, maar het moet een écht bestaand beroep zijn (geen verzonnen functietitel)

Voor elk beroep geef je een heldere, korte uitleg (max. 6 zinnen) waarin je actief de kernwoorden verwerkt en laat zien waarom deze functie bij de gebruiker past. Houd daarbij rekening met het opleidingsniveau, fysieke beperkingen (indien van toepassing) en andere context.

Je kiest alleen uit functies die:
• Bekend zijn binnen het Nederlandse werkveld (bijv. uit de NLQF, werk.nl, nationaleberoepengids.nl)
• Een herkenbare functietitel hebben van maximaal drie woorden
• Reëel en uitvoerbaar zijn binnen de aangegeven wensen

SCHRIJFSTIJL:
Schrijf vloeiende, natuurlijke zinnen. Begin elke zin met een hoofdletter, ook na een punt. Beroepstitels beginnen ook met een hoofdletter. Verwerk de kernwoorden subtiel in de tekst — gebruik ze NIET letterlijk met hoofdletters midden in een zin. Schrijf zoals een mens zou schrijven, niet als een opsomming van trefwoorden.

Je antwoordt altijd in exact de gevraagde JSON-structuur, zonder toelichting erboven of eronder. Je output wordt automatisch verwerkt in een rapport, dus zorg dat het direct bruikbaar en foutloos is.

Lever uitsluitend het JSON-object aan zoals opgegeven in de prompt.`,
      user: `Prompt – Functievoorstellen op basis van loopbaanscan (met alleen bestaande beroepen)

De gebruiker heeft een loopbaanscan ingevuld. Op basis van twee interviews en drie wensberoepen zijn kernwoorden ontstaan die passen bij:
• wat de gebruiker graag doet (activiteiten)
• in welke omgeving de gebruiker wil werken (werkomgeving)
• waar de interesse ligt (interesses)

Daarnaast heeft de gebruiker een aantal voorkeuren opgegeven.

Hier eerst wat informatie over de gebruiker:
• voornaam: ${data.firstName}
• achternaam: ${data.lastName}
• user_id: ${data.userId}

De gebruiker heeft 3 sets van 8 vragen beantwoord over ideale werksituaties. De beroepsnamen zijn bewust weggelaten -- analyseer alleen de antwoorden.

Beschrijving 1:
Vraag 1: "Waar werk je en hoe ziet jouw werkomgeving eruit?"
Antwoord 1: "${data.wensberoep1.werkweekActiviteiten}"

Vraag 2: "Wat doe je allemaal op een gewone werkdag in dit werk?"
Antwoord 2: "${data.wensberoep1.werklocatieOmgeving}"

Vraag 3: "Met wie heb je tijdens dit werk vooral te maken?"
Antwoord 3: "${data.wensberoep1.samenwerkingContacten}"

Vraag 4: "Wanneer heb je echt plezier in je werk? Wat ben je dan aan het doen?"
Antwoord 4: "${data.wensberoep1.fluitendThuiskomen}"

Vraag 5: "Wat vind jij belangrijk in dit werk qua arbeidsvoorwaarden?"
Antwoord 5: "${data.wensberoep1.werkDoel}"

Vraag 6: "Waar moet je iets van weten of interesse in hebben om dit werk goed te doen?"
Antwoord 6: "${data.wensberoep1.leuksteOnderdelen}"

Vraag 7: "Hoeveel vrijheid heb je in dit werk om zelf te bepalen wat je doet en hoe je het doet?"
Antwoord 7: "${data.wensberoep1.belangrijkeAspecten}"

Vraag 8: "Waar draag jij met jouw werk aan bij, en waarom vind je dat belangrijk?"
Antwoord 8: "${data.wensberoep1.kennisFocus}"

Beschrijving 2:
Vraag 1: "Beschrijf de plek of plekken waar je werkt."
Antwoord 1: "${data.wensberoep2.werkweekActiviteiten}"

Vraag 2: "Wat zijn jouw belangrijkste taken?"
Antwoord 2: "${data.wensberoep2.werklocatieOmgeving}"

Vraag 3: "Wat werkt voor jou het fijnst? Meedenken, zelf uitvoeren, anderen aansturen of nog iets anders?"
Antwoord 3: "${data.wensberoep2.samenwerkingContacten}"

Vraag 4: "Wanneer voelt dit werk voor jou zinvol of de moeite waard?"
Antwoord 4: "${data.wensberoep2.fluitendThuiskomen}"

Vraag 5: "Wie kom je tegen in dit werk en wat doe je samen?"
Antwoord 5: "${data.wensberoep2.werkDoel}"

Vraag 6: "Op welke momenten denk je: dit is leuk werk! Wat ben je dan aan het doen?"
Antwoord 6: "${data.wensberoep2.leuksteOnderdelen}"

Vraag 7: "Wat biedt dit werk jou zodat je het makkelijk volhoudt en er blij van wordt?"
Antwoord 7: "${data.wensberoep2.belangrijkeAspecten}"

Vraag 8: "Waar gaat het werk inhoudelijk over? Wat moet je interessant vinden als je dit werk doet?"
Antwoord 8: "${data.wensberoep2.kennisFocus}"

Beschrijving 3:
Vraag 1: "Waarom past deze werkomgeving bij je?"
Antwoord 1: "${data.wensberoep3.werkweekActiviteiten}"

Vraag 2: "Waar besteed je het grootste deel van je tijd aan?"
Antwoord 2: "${data.wensberoep3.werklocatieOmgeving}"

Vraag 3: "Voor wie of wat doe jij dit werk uiteindelijk, en wat wil je daarmee bereiken?"
Antwoord 3: "${data.wensberoep3.samenwerkingContacten}"

Vraag 4: "Met wat voor mensen werk je samen en wat is jouw rol daarin?"
Antwoord 4: "${data.wensberoep3.fluitendThuiskomen}"

Vraag 5: "Welke onderdelen van het werk geven jou de meeste energie?"
Antwoord 5: "${data.wensberoep3.werkDoel}"

Vraag 6: "Welke arbeidsvoorwaarden of omstandigheden zijn voor jou echt belangrijk?"
Antwoord 6: "${data.wensberoep3.leuksteOnderdelen}"

Vraag 7: "Hoe zelfstandig werk je in dit beroep? Wat vind jij het prettigst?"
Antwoord 7: "${data.wensberoep3.belangrijkeAspecten}"

Vraag 8: "Waar moet je nieuwsgierig naar zijn of meer over willen leren in dit werk?"
Antwoord 8: "${data.wensberoep3.kennisFocus}"

Op basis van de interviews en de wensberoepen zijn kernwoorden gegenereerd in de categorieën:
- Lievelings activiteiten
- Werkomgeving
- Interesses

Hierbij alle kernwoorden per categorie:
- Lievelings activiteiten: ${data.aiActiviteiten}
- Werkomgeving: ${data.aiWerkomstandigheden}
- Interesses: ${data.aiInteresses}

Uit alle kernwoorden heeft de gebruiker zelf nog de nadruk gelegd op een aantal van de meest belangrijke kernwoorden:
• Lievelings activiteiten: ${data.selectedActiviteiten}
• Werkomgeving: ${data.selectedWerkomstandigheden}
• Interesses: ${data.selectedInteresses}

Ook heeft de gebruiker de kans gehad om extra toelichting per categorie te geven:
• Lievelings activiteiten: ${data.extraActiviteiten}
• Werkomgeving: ${data.extraWerkomstandigheden}
• Interesses: ${data.extraInteresses}

Hier nog wat meer context over de gebruiker:
• Hoogste opleiding: ${data.opleidingsniveau}
• Richting van de opleiding: ${data.beroepsopleiding}
• Eventuele beperkingen: ${data.fysiekeBeperkingen}

⸻

Opdracht:

Bedenk drie concrete functies die bij deze persoon passen:
• Kies uitsluitend bestaande beroepen die in Nederland gangbaar zijn
• Gebruik bijvoorbeeld beroepentitels zoals opgenomen in NLQF/BIG/ISCO-structuren, of zoals te vinden op websites als werk.nl, nationaleberoepengids.nl of 123test.nl
• Geef twee passende beroepen en één verrassend, avontuurlijk en onverwacht beroep — iets dat de gebruiker zelf waarschijnlijk niet zou bedenken, maar dat wél aansluit bij het opleidingsniveau en de kernvaardigheden. Kies bewust een richting die de gebruiker zelf nooit zou googelen of overwegen. Verras echt. Denk creatief, durf te verrassen en ga bewust buiten de gebaande paden
• Voeg bij elk beroep een korte uitleg toe van maximaal 40 woorden
• Schrijf altijd volledige, afgeronde zinnen - geen afgekapte tekst
• Verwerk actief de gegenereerde kernwoorden in de uitleg, maar doe dit subtiel — gebruik ze NIET letterlijk met hoofdletters midden in een zin. Schrijf vloeiende, natuurlijke zinnen zoals een mens zou schrijven
• Houd rekening met opleiding en beperkingen
• De functietitels mogen maximaal uit 3 woorden bestaan

⚠️ Belangrijk:
De functie uitleg mag per functie maximaal 40 woorden zijn. Zorg dat elke beschrijving eindigt met een afgeronde zin. Begin elke zin met een hoofdletter. Beroepstitels beginnen ook met een hoofdletter.`
    },
    en: {
      system: `You are a professional career coach with in-depth knowledge of existing occupations, roles, sectors and career development. You think in a practical and people-focused way, and you base your advice on a series of interviews and on what someone likes to do (activities), where they feel comfortable (work environment), and what they are genuinely interested in (interests).

You do NOT receive occupation names from the user -- these have been deliberately omitted. Base your job suggestions EXCLUSIVELY on the content of the answers. Do not be guided by assumptions about what occupation the user had in mind.

You receive information about a user's answers to questions about ideal work situations, as well as information about their favourite activities, preferred work environment and interests.

You translate this profile into three existing roles that fit within the European labour market. These are:
• Two logical, fitting occupations that directly match the user's preferences
• One surprising, adventurous and unexpected alternative — a role the user would likely not have thought of themselves, but that still matches their education level and core competencies. Choose a direction the user would never search for or consider on their own. Truly surprise them. Think creatively and outside the box, but it must be a real, existing occupation (no invented job titles)

For each occupation, you provide a clear, concise explanation (max. 6 sentences) in which you actively use the keywords and show why this role fits the user. You take into account the user's education level, physical limitations (if applicable) and other relevant context.

You only choose occupations that:
• Are known within the European labour market (SOC/O*NET/ESCO frameworks, or as found on websites like onetonline.org, prospects.ac.uk)
• Have a recognisable job title of a maximum of three words
• Are realistic and feasible within the stated preferences

WRITING STYLE:
Write fluent, natural sentences. Start every sentence with a capital letter, including after a period. Job titles also start with a capital letter. Weave the keywords subtly into the text — do NOT use them literally with capital letters in the middle of a sentence. Write as a human would write, not as a list of buzzwords.

You always respond in exactly the requested JSON structure, without any explanation above or below it. Your output is processed automatically in a report, so it must be immediately usable and free of errors.

Provide only the JSON object as specified in the prompt.`,
      user: `Prompt – Job suggestions based on career scan (with only existing occupations)

The user has completed a career scan. Based on two interviews and three desired occupations, keywords have been generated that relate to:
• what the user likes to do (activities)
• the environment in which the user wants to work (work environment)
• where the user's interests lie (interests)

The user has also provided a number of preferences.

Here is some information about the user:
• first name: ${data.firstName}
• last name: ${data.lastName}
• user_id: ${data.userId}

The user has answered 3 sets of 8 questions about ideal work situations. Occupation names have been deliberately omitted -- analyse only the answers.

⸻

Description 1:

Question 1: "Where do you work and what does your work environment look like?"
Answer 1: "${data.wensberoep1.werkweekActiviteiten}"

Question 2: "What do you do on a typical working day in this job?"
Answer 2: "${data.wensberoep1.werklocatieOmgeving}"

Question 3: "Who do you mainly deal with in this work?"
Answer 3: "${data.wensberoep1.samenwerkingContacten}"

Question 4: "When do you truly enjoy your work? What are you doing at those moments?"
Answer 4: "${data.wensberoep1.fluitendThuiskomen}"

Question 5: "What do you find important regarding employment conditions?"
Answer 5: "${data.wensberoep1.werkDoel}"

Question 6: "What do you need to know about or be interested in to do this work well?"
Answer 6: "${data.wensberoep1.leuksteOnderdelen}"

Question 7: "How much freedom do you have to decide what you do and how you do it?"
Answer 7: "${data.wensberoep1.belangrijkeAspecten}"

Question 8: "What do you contribute to with your work, and why do you find that important?"
Answer 8: "${data.wensberoep1.kennisFocus}"

⸻

Description 2:

Question 1: "Describe the place or places where you work."
Answer 1: "${data.wensberoep2.werkweekActiviteiten}"

Question 2: "What are your most important tasks?"
Answer 2: "${data.wensberoep2.werklocatieOmgeving}"

Question 3: "What works best for you? Thinking along, executing yourself, managing others, or something else?"
Answer 3: "${data.wensberoep2.samenwerkingContacten}"

Question 4: "When does this work feel meaningful or worthwhile to you?"
Answer 4: "${data.wensberoep2.fluitendThuiskomen}"

Question 5: "Who do you encounter in this work and what do you do together?"
Answer 5: "${data.wensberoep2.werkDoel}"

Question 6: "At what moments do you think: this is great work! What are you doing then?"
Answer 6: "${data.wensberoep2.leuksteOnderdelen}"

Question 7: "What does this work offer you so that you can sustain it easily and feel happy?"
Answer 7: "${data.wensberoep2.belangrijkeAspecten}"

Question 8: "What is the work about content-wise? What should you find interesting?"
Answer 8: "${data.wensberoep2.kennisFocus}"

⸻

Description 3:

Question 1: "Why does this work environment suit you?"
Answer 1: "${data.wensberoep3.werkweekActiviteiten}"

Question 2: "What do you spend most of your time on?"
Answer 2: "${data.wensberoep3.werklocatieOmgeving}"

Question 3: "Who or what do you ultimately do this work for, and what do you want to achieve?"
Answer 3: "${data.wensberoep3.samenwerkingContacten}"

Question 4: "What kind of people do you work with and what is your role?"
Answer 4: "${data.wensberoep3.fluitendThuiskomen}"

Question 5: "Which parts of the work give you the most energy?"
Answer 5: "${data.wensberoep3.werkDoel}"

Question 6: "Which employment conditions or circumstances are really important to you?"
Answer 6: "${data.wensberoep3.leuksteOnderdelen}"

Question 7: "How independently do you work in this profession? What do you find most comfortable?"
Answer 7: "${data.wensberoep3.belangrijkeAspecten}"

Question 8: "What should you be curious about or want to learn more about in this work?"
Answer 8: "${data.wensberoep3.kennisFocus}"

⸻

Keywords generated from interviews and desired occupations

These must be used as context.

• Favorite activities: ${data.aiActiviteiten}
• Work environment: ${data.aiWerkomstandigheden}
• Interests: ${data.aiInteresses}

The user has highlighted a set of preferred keywords:
• Favorite activities: ${data.selectedActiviteiten}
• Work environment: ${data.selectedWerkomstandigheden}
• Interests: ${data.selectedInteresses}

Extra explanations provided by the user:
• Favorite activities: ${data.extraActiviteiten}
• Work environment: ${data.extraWerkomstandigheden}
• Interests: ${data.extraInteresses}

Additional user context:
• Highest education: ${data.opleidingsniveau}
• Field of study: ${data.beroepsopleiding}
• Possible limitations: ${data.fysiekeBeperkingen}

⸻

Task

Generate three concrete job suggestions that fit this person:

• Choose only existing occupations commonly used in Europe
• Use job titles as found in SOC/O*NET/ESCO frameworks, or as found on websites like onetonline.org, prospects.ac.uk
• Provide two fitting occupations and one surprising, adventurous and unexpected option — something the user would likely not have thought of themselves, but that still matches their education level and core competencies. Choose a direction the user would never search for or consider on their own. Truly surprise them. Think creatively, dare to surprise, and deliberately go outside the box
• Provide a short explanation per occupation (max 40 words)
• Always write complete, finished sentences - no truncated text
• Actively weave the generated keywords into the explanation, but do so subtly — do NOT use them literally with capital letters in the middle of a sentence. Write fluent, natural sentences as a human would write
• Consider education and limitations
• Job titles must consist of a maximum of 3 words

⚠️ Important
The function explanation can be no longer than 40 words per occupation. Ensure each description ends with a complete sentence. Start every sentence with a capital letter. Job titles also start with a capital letter.`
    },
    de: {
      system: `Du bist eine professionelle Laufbahnberaterin bzw. ein professioneller Laufbahnberater mit tiefgehendem Wissen über bestehende Berufe, Tätigkeiten, Branchen und berufliche Entwicklung. Du denkst praktisch und menschenorientiert und stützt deine Empfehlungen auf mehrere Interviews sowie darauf, was eine Person gerne tut (Aktivitäten), in welcher Arbeitsumgebung sie sich wohlfühlt und welche Themen sie wirklich interessieren (Interessen).

Du erhältst KEINE Berufsnamen von der Person -- diese wurden bewusst weggelassen. Basiere deine Vorschläge AUSSCHLIESSLICH auf dem Inhalt der Antworten. Lass dich nicht von Vermutungen leiten, welchen Beruf die Person im Kopf hatte.

Du erhältst Informationen über die Antworten einer Person auf Fragen zu idealen Arbeitssituationen sowie Angaben zu bevorzugten Aktivitäten, gewünschter Arbeitsumgebung und Interessen.

Du übersetzt dieses Profil in drei real existierende Berufe, die zum deutschen Arbeitsmarkt passen. Diese sind:
• Zwei logische, passende Berufe, die direkt an die Präferenzen der Person anknüpfen
• Ein überraschender, abenteuerlicher und unerwarteter Alternativberuf — ein Beruf, an den die Person selbst wahrscheinlich nicht gedacht hätte, der aber zum Bildungsniveau und den Kernkompetenzen passt. Wähle bewusst eine Richtung, die die Person selbst nie googeln oder in Betracht ziehen würde. Überrasche wirklich. Denke kreativ, wage es zu überraschen und gehe bewusst über den Tellerrand hinaus, aber es muss ein real existierender Beruf sein (keine erfundenen Berufstitel)

Für jeden Beruf gibst du eine klare, kurze Erklärung (max. 6 Sätze), in der du die Schlüsselwörter aktiv einsetzt und nachvollziehbar erklärst, warum dieser Beruf zu der Person passt. Dabei berücksichtigst du Bildungsniveau, eventuelle körperliche Einschränkungen und weiteren Kontext.

Du wählst ausschließlich Berufe aus, die:
• Auf dem deutschen Arbeitsmarkt bekannt und eindeutig definierbar sind
• Eine gut erkennbare Berufsbezeichnung mit maximal drei Wörtern haben
• Realistisch und innerhalb der genannten Wünsche ausführbar sind
• In anerkannten Strukturen oder Datenbanken vorkommen, wie zum Beispiel:
DEQF/BIG/ISCO sowie Websites und Berufsbeschreibungen wie berufenet.arbeitsagentur.de, BERUFENET der Bundesagentur für Arbeit, berufe.tv oder BERUFE-Entdecker der IHK

SCHREIBSTIL:
Schreibe flüssige, natürliche Sätze. Beginne jeden Satz mit einem Großbuchstaben, auch nach einem Punkt. Berufsbezeichnungen beginnen ebenfalls mit einem Großbuchstaben. Verarbeite die Schlüsselwörter subtil im Text — verwende sie NICHT wörtlich mit Großbuchstaben mitten im Satz. Schreibe so, wie ein Mensch schreiben würde, nicht wie eine Aufzählung von Schlagwörtern.

Du antwortest immer exakt in der geforderten JSON-Struktur, ohne zusätzliche Erklärungen davor oder danach. Deine Ausgabe wird automatisch in einen Bericht übernommen und muss deshalb sofort nutzbar und fehlerfrei sein.

Liefere ausschließlich das JSON-Objekt, wie in der Prompt-Beschreibung angegeben.`,
      user: `Prompt – Berufsvorschläge auf Basis eines Laufbahn-Scans (nur bestehende Berufe)

Die Nutzerin / der Nutzer hat einen Laufbahn-Scan ausgefüllt. Auf Basis von zwei Interviews und drei Wunschberufen sind Schlüsselwörter entstanden, die passen zu:
• was die Nutzerin / der Nutzer gerne macht (Aktivitäten)
• in welcher Umgebung die Nutzerin / der Nutzer arbeiten möchte (Arbeitsumgebung)
• wo die Interessen liegen (Interessen)

Außerdem hat die Nutzerin / der Nutzer einige Präferenzen angegeben.

Zunächst einige Informationen über die Person:
• Vorname: ${data.firstName}
• Nachname: ${data.lastName}
• user_id: ${data.userId}

Die Person hat 3 Sets von je 8 Fragen über ideale Arbeitssituationen beantwortet. Die Berufsnamen wurden bewusst weggelassen -- analysiere ausschließlich die Antworten.

Beschreibung 1:
Frage 1: „Wo arbeiten Sie und wie sieht Ihre Arbeitsumgebung aus?"
Antwort 1: "${data.wensberoep1.werkweekActiviteiten}"

Frage 2: „Was machen Sie alles an einem normalen Arbeitstag?"
Antwort 2: "${data.wensberoep1.werklocatieOmgeving}"

Frage 3: „Mit wem haben Sie hauptsächlich zu tun?"
Antwort 3: "${data.wensberoep1.samenwerkingContacten}"

Frage 4: „Wann haben Sie wirklich Spaß an Ihrer Arbeit? Was tun Sie dann?"
Antwort 4: "${data.wensberoep1.fluitendThuiskomen}"

Frage 5: „Was ist Ihnen bezüglich der Arbeitsbedingungen wichtig?"
Antwort 5: "${data.wensberoep1.werkDoel}"

Frage 6: „Wovon müssen Sie etwas wissen oder wofür müssen Sie sich interessieren?"
Antwort 6: "${data.wensberoep1.leuksteOnderdelen}"

Frage 7: „Wie viel Freiheit haben Sie, selbst zu bestimmen was und wie Sie arbeiten?"
Antwort 7: "${data.wensberoep1.belangrijkeAspecten}"

Frage 8: „Wozu tragen Sie mit Ihrer Arbeit bei, und warum finden Sie das wichtig?"
Antwort 8: "${data.wensberoep1.kennisFocus}"

Beschreibung 2:
Frage 1: „Beschreiben Sie den Ort oder die Orte, an denen Sie arbeiten."
Antwort 1: "${data.wensberoep2.werkweekActiviteiten}"

Frage 2: „Was sind Ihre wichtigsten Aufgaben?"
Antwort 2: "${data.wensberoep2.werklocatieOmgeving}"

Frage 3: „Was funktioniert für Sie am besten? Mitdenken, selbst ausführen, andere anleiten?"
Antwort 3: "${data.wensberoep2.samenwerkingContacten}"

Frage 4: „Wann fühlt sich diese Arbeit sinnvoll oder lohnenswert an?"
Antwort 4: "${data.wensberoep2.fluitendThuiskomen}"

Frage 5: „Wen treffen Sie in dieser Arbeit und was machen Sie zusammen?"
Antwort 5: "${data.wensberoep2.werkDoel}"

Frage 6: „In welchen Momenten denken Sie: Das ist tolle Arbeit! Was tun Sie dann?"
Antwort 6: "${data.wensberoep2.leuksteOnderdelen}"

Frage 7: „Was bietet Ihnen diese Arbeit, damit Sie sie leicht durchhalten?"
Antwort 7: "${data.wensberoep2.belangrijkeAspecten}"

Frage 8: „Worum geht es inhaltlich? Was sollten Sie interessant finden?"
Antwort 8: "${data.wensberoep2.kennisFocus}"

Beschreibung 3:
Frage 1: „Warum passt diese Arbeitsumgebung zu Ihnen?"
Antwort 1: "${data.wensberoep3.werkweekActiviteiten}"

Frage 2: „Womit verbringen Sie den größten Teil Ihrer Zeit?"
Antwort 2: "${data.wensberoep3.werklocatieOmgeving}"

Frage 3: „Für wen oder was machen Sie diese Arbeit und was möchten Sie erreichen?"
Antwort 3: "${data.wensberoep3.samenwerkingContacten}"

Frage 4: „Mit was für Menschen arbeiten Sie zusammen und was ist Ihre Rolle?"
Antwort 4: "${data.wensberoep3.fluitendThuiskomen}"

Frage 5: „Welche Teile der Arbeit geben Ihnen die meiste Energie?"
Antwort 5: "${data.wensberoep3.werkDoel}"

Frage 6: „Welche Arbeitsbedingungen sind für Sie wirklich wichtig?"
Antwort 6: "${data.wensberoep3.leuksteOnderdelen}"

Frage 7: „Wie selbstständig arbeiten Sie? Was finden Sie am angenehmsten?"
Antwort 7: "${data.wensberoep3.belangrijkeAspecten}"

Frage 8: „Wofür sollten Sie neugierig sein oder mehr darüber lernen wollen?"
Antwort 8: "${data.wensberoep3.kennisFocus}"

Auf Basis der Interviews und der Wunschberufe sind Schlüsselwörter in folgenden Kategorien generiert worden:
• Lieblingsaktivitäten
• Arbeitsumgebung
• Interessen

Hier alle Schlüsselwörter pro Kategorie:
• Lieblingsaktivitäten: ${data.aiActiviteiten}
• Arbeitsumgebung: ${data.aiWerkomstandigheden}
• Interessen: ${data.aiInteresses}

Aus allen Schlüsselwörtern hat die Nutzerin / der Nutzer selbst noch einige der wichtigsten hervorgehoben:
• Lieblingsaktivitäten: ${data.selectedActiviteiten}
• Arbeitsumgebung: ${data.selectedWerkomstandigheden}
• Interessen: ${data.selectedInteresses}

Die Nutzerin / der Nutzer hatte außerdem die Möglichkeit, pro Kategorie zusätzliche Erläuterungen zu geben:
• Lieblingsaktivitäten: ${data.extraActiviteiten}
• Arbeitsumgebung: ${data.extraWerkomstandigheden}
• Interessen: ${data.extraInteresses}

Zusätzlicher Kontext zur Person:
• Höchster Bildungsabschluss: ${data.opleidingsniveau}
• Fachrichtung der Ausbildung: ${data.beroepsopleiding}
• Eventuelle Einschränkungen: ${data.fysiekeBeperkingen}

⸻

Aufgabe:

Denke dir drei konkrete Berufe aus, die zu dieser Person passen:
• Wähle ausschließlich bestehende Berufe, die im europäischen Kontext gebräuchlich sind
• Nutze zum Beispiel Berufstitel, wie sie in Strukturen wie DEQF/BIG/ISCO vorkommen oder auf Websites wie berufenet.arbeitsagentur.de, BERUFENET der Bundesagentur für Arbeit, berufe.tv oder BERUFE-Entdecker der IHK zu finden sind
• Gib zwei passende Berufe und einen überraschenden, abenteuerlichen und unerwarteten Beruf an — etwas, an das die Person selbst wahrscheinlich nicht gedacht hätte, das aber zum Bildungsniveau und den Kernkompetenzen passt. Wähle bewusst eine Richtung, die die Person selbst nie googeln oder in Betracht ziehen würde. Überrasche wirklich. Denke kreativ, wage es zu überraschen und gehe bewusst über den Tellerrand hinaus
• Füge für jeden Beruf eine kurze Erklärung mit maximal 40 Wörtern hinzu
• Schreibe immer vollständige, abgeschlossene Sätze - kein abgebrochener Text
• Verarbeite die generierten Schlüsselwörter subtil in den Erläuterungen — verwende sie NICHT wörtlich mit Großbuchstaben mitten im Satz. Schreibe flüssige, natürliche Sätze wie ein Mensch
• Berücksichtige Ausbildung und Einschränkungen
• Die Berufstitel dürfen höchstens aus 3 Wörtern bestehen

⚠️ Wichtig:
Die Erläuterung pro Beruf darf maximal 40 Wörter enthalten. Stelle sicher, dass jede Beschreibung mit einem vollständigen Satz endet. Beginne jeden Satz mit einem Großbuchstaben. Berufsbezeichnungen beginnen ebenfalls mit einem Großbuchstaben.`
    },
    no: {
      system: `Du er en profesjonell karriereveileder med inngående kunnskap om eksisterende yrker, funksjoner, sektorer og karriereutvikling. Du tenker praktisk og menneskefokusert, og du baserer dine råd på flere intervjuer og på hva en person liker å gjøre (aktiviteter), hvilken arbeidskontekst personen trives i (arbeidsmiljø), og hva personen oppriktig er interessert i (interesser).

Du mottar INGEN yrkesnavn fra brukeren -- disse er bevisst utelatt. Baser yrkesforslag UTELUKKENDE på innholdet i svarene. Ikke la deg lede av antakelser om hvilket yrke brukeren hadde i tankene.

Du mottar informasjon om en brukers svar på spørsmål om ideale arbeidssituasjoner, samt informasjon om brukerens favorittaktiviteter, ønsket arbeidsmiljø og interesser.

Du oversetter denne profilen til tre eksisterende yrker som passer innenfor det norske arbeidsmarkedet. Disse er:
• To logiske, passende yrker som direkte samsvarer med brukerens preferanser
• Ett overraskende, eventyrlig og uventet alternativ — et yrke brukeren sannsynligvis ikke ville tenkt på selv, men som likevel passer med utdanningsnivået og kjernekompetansene. Velg bevisst en retning brukeren aldri ville ha googlet eller vurdert selv. Overrask virkelig. Tenk kreativt, våg å overraske, og gå bevisst utenfor boksen, men det må være et reelt eksisterende yrke (ingen oppdiktede yrkestitler)

For hvert yrke gir du en tydelig og kort forklaring (maks. 6 setninger) der du aktivt bruker nøkkelordene og forklarer hvorfor yrket passer brukeren. Du tar hensyn til utdanningsnivå, eventuelle fysiske begrensninger og annen relevant kontekst.

Du velger kun yrker som:
• Er kjente og etablerte i det norske arbeidsmarkedet
• Har en tydelig yrkestittel på maks tre ord
• Er realistiske og gjennomførbare innenfor brukerens ønsker
• Forekommer i anerkjente strukturer og databaser, for eksempel:
NOKUT, Utdanning.no, NAVs yrkesbeskrivelser, samt nettsider som Finn.no, Arbeidsplassen.no eller utdanning.no

SKRIVESTIL:
Skriv flytende, naturlige setninger. Start hver setning med stor bokstav, også etter punktum. Yrkesbenevnelser starter også med stor bokstav. Vev nøkkelordene subtilt inn i teksten — IKKE bruk dem bokstavelig med store bokstaver midt i en setning. Skriv slik et menneske ville skrevet, ikke som en oppramsing av stikkord.

Du svarer alltid i nøyaktig den forespurte JSON-strukturen, uten forklaring over eller under. Outputen din blir automatisk brukt i en rapport, så den må være umiddelbart anvendelig og helt feilfri.

Lever kun JSON-objektet slik det er spesifisert i prompten.`,
      user: `Prompt – Jobbforslag basert på karriereskanning (kun eksisterende yrker)

Brukeren har fullført en karriereskanning. Basert på to intervjuer og tre ønskede yrker har det blitt generert nøkkelord som passer til:
• hva brukeren liker å gjøre (aktiviteter)
• hvilket arbeidsmiljø brukeren ønsker å jobbe i (arbeidsmiljø)
• hvor interessene ligger (interesser)

Brukeren har også gitt noen preferanser.

Her er først litt informasjon om brukeren:
• fornavn: ${data.firstName}
• etternavn: ${data.lastName}
• user_id: ${data.userId}

Brukeren har besvart 3 sett med 8 spørsmål om ideale arbeidssituasjoner. Yrkesnavnene er bevisst utelatt -- analyser kun svarene.

⸻

Beskrivelse 1:

Spørsmål 1: "Hvor jobber du og hvordan ser arbeidsmiljøet ditt ut?"
Svar 1: "${data.wensberoep1.werkweekActiviteiten}"

Spørsmål 2: "Hva gjør du på en vanlig arbeidsdag?"
Svar 2: "${data.wensberoep1.werklocatieOmgeving}"

Spørsmål 3: "Hvem har du mest å gjøre med i dette arbeidet?"
Svar 3: "${data.wensberoep1.samenwerkingContacten}"

Spørsmål 4: "Når har du virkelig glede av jobben din? Hva gjør du da?"
Svar 4: "${data.wensberoep1.fluitendThuiskomen}"

Spørsmål 5: "Hva synes du er viktig når det gjelder arbeidsvilkår?"
Svar 5: "${data.wensberoep1.werkDoel}"

Spørsmål 6: "Hva må du vite noe om eller være interessert i for å gjøre denne jobben godt?"
Svar 6: "${data.wensberoep1.leuksteOnderdelen}"

Spørsmål 7: "Hvor mye frihet har du til å bestemme hva og hvordan du jobber?"
Svar 7: "${data.wensberoep1.belangrijkeAspecten}"

Spørsmål 8: "Hva bidrar du til med arbeidet ditt, og hvorfor synes du det er viktig?"
Svar 8: "${data.wensberoep1.kennisFocus}"

⸻

Beskrivelse 2:

Spørsmål 1: "Beskriv stedet eller stedene der du jobber."
Svar 1: "${data.wensberoep2.werkweekActiviteiten}"

Spørsmål 2: "Hva er dine viktigste oppgaver?"
Svar 2: "${data.wensberoep2.werklocatieOmgeving}"

Spørsmål 3: "Hva fungerer best for deg? Tenke med, utføre selv, lede andre?"
Svar 3: "${data.wensberoep2.samenwerkingContacten}"

Spørsmål 4: "Når føles dette arbeidet meningsfullt eller verdt innsatsen?"
Svar 4: "${data.wensberoep2.fluitendThuiskomen}"

Spørsmål 5: "Hvem møter du i dette arbeidet og hva gjør dere sammen?"
Svar 5: "${data.wensberoep2.werkDoel}"

Spørsmål 6: "I hvilke øyeblikk tenker du: dette er flott arbeid! Hva gjør du da?"
Svar 6: "${data.wensberoep2.leuksteOnderdelen}"

Spørsmål 7: "Hva gir denne jobben deg slik at du lett holder ut?"
Svar 7: "${data.wensberoep2.belangrijkeAspecten}"

Spørsmål 8: "Hva handler arbeidet om innholdsmessig? Hva bør du synes er interessant?"
Svar 8: "${data.wensberoep2.kennisFocus}"

⸻

Beskrivelse 3:

Spørsmål 1: "Hvorfor passer dette arbeidsmiljøet for deg?"
Svar 1: "${data.wensberoep3.werkweekActiviteiten}"

Spørsmål 2: "Hva bruker du mesteparten av tiden din på?"
Svar 2: "${data.wensberoep3.werklocatieOmgeving}"

Spørsmål 3: "For hvem eller hva gjør du dette arbeidet og hva vil du oppnå?"
Svar 3: "${data.wensberoep3.samenwerkingContacten}"

Spørsmål 4: "Hva slags mennesker jobber du med og hva er din rolle?"
Svar 4: "${data.wensberoep3.fluitendThuiskomen}"

Spørsmål 5: "Hvilke deler av arbeidet gir deg mest energi?"
Svar 5: "${data.wensberoep3.werkDoel}"

Spørsmål 6: "Hvilke arbeidsvilkår er virkelig viktige for deg?"
Svar 6: "${data.wensberoep3.leuksteOnderdelen}"

Spørsmål 7: "Hvor selvstendig jobber du? Hva synes du er mest behagelig?"
Svar 7: "${data.wensberoep3.belangrijkeAspecten}"

Spørsmål 8: "Hva bør du være nysgjerrig på eller ønske å lære mer om?"
Svar 8: "${data.wensberoep3.kennisFocus}"

⸻

Nøkkelord generert fra intervjuer og ønskede yrker

Disse nøkkelordene skal brukes som kontekst i jobbforslagene.

• Favorittaktiviteter: ${data.aiActiviteiten}
• Arbeidsmiljø: ${data.aiWerkomstandigheden}
• Interesser: ${data.aiInteresses}

Brukeren har også valgt de viktigste nøkkelordene:
• Favorittaktiviteter: ${data.selectedActiviteiten}
• Arbeidsmiljø: ${data.selectedWerkomstandigheden}
• Interesser: ${data.selectedInteresses}

Ekstra forklaringer gitt av brukeren:
• Favorittaktiviteter: ${data.extraActiviteiten}
• Arbeidsmiljø: ${data.extraWerkomstandigheden}
• Interesser: ${data.extraInteresses}

Ytterligere kontekst:
• Høyeste utdanningsnivå: ${data.opleidingsniveau}
• Utdanningsretning: ${data.beroepsopleiding}
• Eventuelle begrensninger: ${data.fysiekeBeperkingen}

⸻

Oppgave

Lag tre konkrete jobbforslag som passer denne personen:
• Velg kun eksisterende yrker som er vanlige i Norge og Europa
• Bruk for eksempel yrkestitler som finnes i strukturer som NOKUT, Utdanning.no, NAVs yrkesbeskrivelser eller på nettsider som Finn.no, Arbeidsplassen.no eller utdanning.no
• Gi to passende yrker og ett overraskende, eventyrlig og uventet yrke — noe brukeren sannsynligvis ikke ville tenkt på selv, men som likevel passer med utdanningsnivået og kjernekompetansene. Velg bevisst en retning brukeren aldri ville ha googlet eller vurdert selv. Overrask virkelig. Tenk kreativt, våg å overraske, og gå bevisst utenfor boksen
• Forklaringen per yrke skal være maks 40 ord
• Skriv alltid fullstendige, avsluttede setninger - ingen avbrutt tekst
• Vev nøkkelordene subtilt inn i forklaringene — IKKE bruk dem bokstavelig med store bokstaver midt i en setning. Skriv flytende, naturlige setninger slik et menneske ville skrevet
• Ta hensyn til utdanning og begrensninger
• Yrker kan bestå av maks tre ord

⚠️ Viktig
Forklaringen til funksjonene kan maksimalt være på 40 ord per funksjon. Sørg for at hver beskrivelse avsluttes med en komplett setning. Start hver setning med stor bokstav. Yrkesbenevnelser starter også med stor bokstav.`
    }
  };

  return prompts[language] || prompts.nl;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, round_id, language = 'nl', organisation_type_id } = await req.json();

    console.log('🚀 Starting AI career report generation for user:', user_id, 'round:', round_id, 'language:', language, 'org_type:', organisation_type_id);

    if (!user_id || !round_id) {
      throw new Error('user_id and round_id are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch all user data for this round
    console.log('📊 Fetching user data from database...');

    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, ai_lievelings_activiteiten, ai_werkomstandigheden, ai_interesses')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Get enthousiasme responses for this round
    const { data: enthousiasmeData } = await supabase
      .from('enthousiasme_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('round_id', round_id)
      .single();

    // Get wensberoepen responses for this round
    const { data: wensberoepenData } = await supabase
      .from('wensberoepen_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('round_id', round_id)
      .single();

    // Get prioriteiten responses for this round
    const { data: prioriteitenData } = await supabase
      .from('prioriteiten_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('round_id', round_id)
      .single();

    // Get extra informatie for this round
    const { data: extraInfoData } = await supabase
      .from('extra_informatie_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('round_id', round_id)
      .single();

    // Get round info
    const { data: roundData } = await supabase
      .from('user_rounds')
      .select('started_at')
      .eq('id', round_id)
      .single();

    console.log('✅ User data fetched successfully');

    // Parse AI keywords from prioriteiten_responses (round-specific)
    const parseKeywords = (jsonData: any): string[] => {
      if (!jsonData) return [];
      if (Array.isArray(jsonData)) return jsonData;
      try {
        if (typeof jsonData === 'string') {
          return JSON.parse(jsonData);
        }
        return [];
      } catch {
        return [];
      }
    };

    const aiActiviteiten = parseKeywords(prioriteitenData?.ai_activiteiten_keywords);
    const aiWerkomstandigheden = parseKeywords(prioriteitenData?.ai_werkomstandigheden_keywords);
    const aiInteresses = parseKeywords(prioriteitenData?.ai_interesses_keywords);

    // Build user data object for prompts
    const userData: UserData = {
      firstName: profileData?.first_name || '',
      lastName: profileData?.last_name || '',
      userId: user_id,
      // Enthousiasme data
      kindertijdActiviteiten: enthousiasmeData?.kindertijd_activiteiten || 'Niet ingevuld',
      kindertijdPlekken: enthousiasmeData?.kindertijd_plekken || 'Niet ingevuld',
      kindertijdInteresses: enthousiasmeData?.kindertijd_interesses_nieuw || 'Niet ingevuld',
      eersteWerkLeuksteTaken: enthousiasmeData?.eerste_werk_leukste_taken || 'Niet ingevuld',
      eersteWerkOnderwerpen: enthousiasmeData?.eerste_werk_onderwerpen || 'Niet ingevuld',
      eersteWerkOmstandigheden: enthousiasmeData?.eerste_werk_werkomstandigheden || 'Niet ingevuld',
      plezierigWerkperiode: enthousiasmeData?.plezierige_werkperiode_beschrijving || 'Niet ingevuld',
      fluitendThuiskomenDag: enthousiasmeData?.fluitend_thuiskomen_dag || 'Niet ingevuld',
      leukProjectEnRol: enthousiasmeData?.leuk_project_en_rol || 'Niet ingevuld',
      // AI keywords
      aiActiviteiten: aiActiviteiten.join(', ') || 'Geen',
      aiWerkomstandigheden: aiWerkomstandigheden.join(', ') || 'Geen',
      aiInteresses: aiInteresses.join(', ') || 'Geen',
      // Selected keywords
      selectedActiviteiten: (prioriteitenData?.selected_activiteiten_keywords || []).join(', ') || 'Geen',
      selectedWerkomstandigheden: (prioriteitenData?.selected_werkomstandigheden_keywords || []).join(', ') || 'Geen',
      selectedInteresses: (prioriteitenData?.selected_interesses_keywords || []).join(', ') || 'Geen',
      // Extra text
      extraActiviteiten: prioriteitenData?.extra_activiteiten_tekst || 'Niet ingevuld',
      extraWerkomstandigheden: prioriteitenData?.extra_werkomstandigheden_tekst || 'Niet ingevuld',
      extraInteresses: prioriteitenData?.extra_interesses_tekst || 'Niet ingevuld',
      // Wensberoepen
      wensberoep1: {
        titel: wensberoepenData?.wensberoep_1_titel || 'Niet ingevuld',
        werkweekActiviteiten: wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Niet ingevuld',
        werklocatieOmgeving: wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Niet ingevuld',
        samenwerkingContacten: wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Niet ingevuld',
        fluitendThuiskomen: wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Niet ingevuld',
        werkDoel: wensberoepenData?.wensberoep_1_werk_doel || 'Niet ingevuld',
        leuksteOnderdelen: wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Niet ingevuld',
        belangrijkeAspecten: wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Niet ingevuld',
        kennisFocus: wensberoepenData?.wensberoep_1_kennis_focus || 'Niet ingevuld',
      },
      wensberoep2: {
        titel: wensberoepenData?.wensberoep_2_titel || 'Niet ingevuld',
        werkweekActiviteiten: wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Niet ingevuld',
        werklocatieOmgeving: wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Niet ingevuld',
        samenwerkingContacten: wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Niet ingevuld',
        fluitendThuiskomen: wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Niet ingevuld',
        werkDoel: wensberoepenData?.wensberoep_2_werk_doel || 'Niet ingevuld',
        leuksteOnderdelen: wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Niet ingevuld',
        belangrijkeAspecten: wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Niet ingevuld',
        kennisFocus: wensberoepenData?.wensberoep_2_kennis_focus || 'Niet ingevuld',
      },
      wensberoep3: {
        titel: wensberoepenData?.wensberoep_3_titel || 'Niet ingevuld',
        werkweekActiviteiten: wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Niet ingevuld',
        werklocatieOmgeving: wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Niet ingevuld',
        samenwerkingContacten: wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Niet ingevuld',
        fluitendThuiskomen: wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Niet ingevuld',
        werkDoel: wensberoepenData?.wensberoep_3_werk_doel || 'Niet ingevuld',
        leuksteOnderdelen: wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Niet ingevuld',
        belangrijkeAspecten: wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Niet ingevuld',
        kennisFocus: wensberoepenData?.wensberoep_3_kennis_focus || 'Niet ingevuld',
      },
      // Extra info
      opleidingsniveau: extraInfoData?.opleidingsniveau || 'Niet ingevuld',
      beroepsopleiding: extraInfoData?.beroepsopleiding || 'Niet ingevuld',
      fysiekeBeperkingen: extraInfoData?.fysieke_beperkingen || 'Geen',
    };

    // === Organisation type detection & sector-based prompting ===
    let isOrganisationMode = false;
    let organisationVacancies: any[] = [];
    let sectorName = '';
    let organisationName = '';

    if (organisation_type_id) {
      // Fetch org type with name and parent_type_id
      const { data: orgType } = await supabase
        .from('organisation_types')
        .select('slug, name, is_unique, parent_type_id, anchor_list')
        .eq('id', organisation_type_id)
        .single();

      if (orgType) {
        isOrganisationMode = true;
        organisationName = orgType.name;

        // Determine sector name: use parent name if this is a child org, otherwise use own name
        if (orgType.parent_type_id) {
          const { data: parentType } = await supabase
            .from('organisation_types')
            .select('name')
            .eq('id', orgType.parent_type_id)
            .single();
          sectorName = parentType?.name || orgType.name;
        } else {
          sectorName = orgType.name;
        }

        console.log(`🏢 Organisation mode: "${organisationName}" in sector "${sectorName}"`);

        // For unique organisations (like ErasmusMC), fetch relevant vacancies via full-text search
        if (orgType.is_unique) {
          console.log('🏥 Unique organisation detected - matching vacancies via full-text search...');

          // Combineer geselecteerde + AI-gegenereerde keywords voor breed zoeken
          const selectedKeywords = [
            ...(prioriteitenData?.selected_activiteiten_keywords || []),
            ...(prioriteitenData?.selected_werkomstandigheden_keywords || []),
            ...(prioriteitenData?.selected_interesses_keywords || []),
          ];

          const aiKeywords = [
            ...(profileData?.ai_lievelings_activiteiten || '').split(','),
            ...(profileData?.ai_werkomstandigheden || '').split(','),
            ...(profileData?.ai_interesses || '').split(','),
          ];

          const uniqueKeywords = [...new Set([...selectedKeywords, ...aiKeywords])]
            .map((k: string) => k.trim().toLowerCase().replace(/[^a-zA-Zëéèüïöäàáâ\s]/g, ''))
            .filter((k: string) => k.length > 2);

          console.log(`🔍 Searching with ${uniqueKeywords.length} unique keywords`);

          if (uniqueKeywords.length > 0) {
            // Server-side full-text search met Nederlandse stemming
            const keywordQuery = uniqueKeywords.join(' | ');

            const { data: matched, error: matchError } = await supabase.rpc('match_vacancies', {
              p_keywords: keywordQuery,
              p_org_type_id: organisation_type_id,
              p_limit: 25,
            });

            if (matchError) {
              console.error('⚠️ Full-text search error, falling back to random selection:', matchError);
            }

            organisationVacancies = matched || [];
            console.log(`✅ Full-text search returned ${organisationVacancies.length} matches`);
          }

          // Fallback: als < 10 resultaten, haal willekeurige vacatures
          if (organisationVacancies.length < 10) {
            console.log('⚠️ Too few matches, broadening search...');
            const { data: fallback } = await supabase
              .from('organisation_vacancies')
              .select('title, department, description, category')
              .eq('organisation_type_id', organisation_type_id)
              .limit(25);
            if (fallback && fallback.length > organisationVacancies.length) {
              organisationVacancies = fallback;
              console.log(`✅ Fallback: using ${organisationVacancies.length} random vacancies`);
            }
          }

          // Garandeer categorie-diversiteit (min 3 categorieën voor "verrassend" functie)
          const existingCategories = [...new Set(organisationVacancies.map((v: any) => v.category).filter(Boolean))];
          if (existingCategories.length < 3 && organisationVacancies.length >= 10) {
            console.log(`⚠️ Only ${existingCategories.length} categories, fetching diverse additions...`);
            const { data: diverse } = await supabase
              .from('organisation_vacancies')
              .select('title, department, description, category')
              .eq('organisation_type_id', organisation_type_id)
              .not('category', 'in', `(${existingCategories.map(c => `"${c}"`).join(',')})`)
              .limit(5);
            if (diverse) {
              organisationVacancies = [...organisationVacancies, ...diverse];
              console.log(`✅ Added ${diverse.length} diverse vacancies from other categories`);
            }
          }

          console.log(`📋 Final vacancy list: ${organisationVacancies.length} vacancies across ${[...new Set(organisationVacancies.map((v: any) => v.category).filter(Boolean))].length} categories`);
        }

        // For non-unique organisations with an anchor list, format as vacancies
        if (!orgType.is_unique && orgType.anchor_list && orgType.anchor_list.length > 0) {
          console.log('📋 Non-unique org with anchor list - formatting as vacancies...');
          organisationVacancies = orgType.anchor_list.flatMap((cat: any) =>
            cat.functions.map((fn: string) => ({
              title: fn,
              category: cat.category,
              description: null,
              department: null,
            }))
          );
          console.log(`✅ Anchor list: ${organisationVacancies.length} functions across ${orgType.anchor_list.length} categories`);
        }
      }
    }

    // === Prompt selection: 2 branches ===
    let prompts;

    if (isOrganisationMode) {
      // Organisation mode: sector-based prompting (with optional vacancies as inspiration)
      prompts = getOrganisationSectorPrompts(language, sectorName, organisationName, userData, organisationVacancies.length > 0 ? organisationVacancies : undefined);
    } else {
      prompts = getCareerReportPrompts(language, userData);
    }

    console.log('🏢 Organisation mode:', isOrganisationMode, '| Sector:', sectorName || 'N/A');

    console.log('🤖 Calling Lovable AI Gateway with language:', language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: prompts.system },
          { role: "user", content: prompts.user }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_career_report",
              description: "Generate three career suggestions for the career report",
              parameters: {
                type: "object",
                properties: {
                  beroepen: {
                    type: "object",
                    properties: {
                      passend_1: {
                        type: "object",
                        properties: {
                          titel: { type: "string" },
                          beschrijving: { type: "string" }
                        },
                        required: ["titel", "beschrijving"]
                      },
                      passend_2: {
                        type: "object",
                        properties: {
                          titel: { type: "string" },
                          beschrijving: { type: "string" }
                        },
                        required: ["titel", "beschrijving"]
                      },
                      verrassend: {
                        type: "object",
                        properties: {
                          titel: { type: "string" },
                          beschrijving: { type: "string" }
                        },
                        required: ["titel", "beschrijving"]
                      }
                    },
                    required: ["passend_1", "passend_2", "verrassend"]
                  }
                },
                required: ["beroepen"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_career_report" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to continue.');
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('✅ AI response received');

    // Extract the tool call result - only beroepen from AI
    let aiBeroepen;
    
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const aiContent = JSON.parse(toolCall.function.arguments);
      aiBeroepen = aiContent.beroepen;
    } else {
      // Fallback: try to parse from message content
      const messageContent = aiResponse.choices?.[0]?.message?.content;
      if (messageContent) {
        const cleanedContent = messageContent.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedContent);
        aiBeroepen = parsed.beroepen;
      } else {
        throw new Error('No valid response from AI');
      }
    }

    // Use user-selected keywords for ideale_functie (not AI-generated)
    const selectedActiviteiten = prioriteitenData?.selected_activiteiten_keywords || [];
    const selectedWerkomstandigheden = prioriteitenData?.selected_werkomstandigheden_keywords || [];
    const selectedInteresses = prioriteitenData?.selected_interesses_keywords || [];

    const reportContent: ReportContent = {
      voorblad: {
        naam: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim(),
        start_datum: roundData?.started_at ? new Date(roundData.started_at).toLocaleDateString('nl-NL') : new Date().toLocaleDateString('nl-NL'),
        eind_datum: new Date().toLocaleDateString('nl-NL')
      },
      ideale_functie: {
        activiteiten: selectedActiviteiten,
        werkomgeving: selectedWerkomstandigheden,
        interessegebieden: selectedInteresses
      },
      beroepen: aiBeroepen
    };

    console.log('📝 Report content generated:', JSON.stringify(reportContent).substring(0, 200) + '...');

    // Save report to database - check if exists first, then insert or update
    const { data: existingReport } = await supabase
      .from('user_reports')
      .select('id')
      .eq('round_id', round_id)
      .maybeSingle();

    let saveError;
    if (existingReport) {
      // Update existing report
      const { error } = await supabase
        .from('user_reports')
        .update({
          report_content: reportContent,
          report_status: 'completed',
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReport.id);
      saveError = error;
    } else {
      // Insert new report
      const { error } = await supabase
        .from('user_reports')
        .insert({
          user_id: user_id,
          round_id: round_id,
          report_content: reportContent,
          report_status: 'completed',
          generated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      saveError = error;
    }

    if (saveError) {
      console.error('Error saving report:', saveError);
      throw saveError;
    }

    // Update round status to completed
    await supabase
      .from('user_rounds')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', round_id);

    console.log('✅ Report saved to database');

    return new Response(JSON.stringify({ 
      success: true, 
      report_content: reportContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error generating career report:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
