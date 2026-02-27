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
  const vacatureList = vacancies && vacancies.length > 0
    ? vacancies.map((v, i) => `${i + 1}. ${v.title}${v.department ? ` (Afdeling: ${v.department})` : ''}${v.description ? ` — ${v.description}` : ''}`).join('\n')
    : null;

  const prompts: Record<string, { system: string; user: string }> = {
    nl: {
      system: `Je bent een professionele loopbaancoach gespecialiseerd in de sector "${sectorName}". Je hebt diepgaande kennis van alle functies en beroepen die bestaan binnen deze branche.

Je ontvangt informatie over een medewerker en vertaalt dit naar drie concrete functies die bestaan binnen de sector "${sectorName}".

BELANGRIJK: Je ontvangt GEEN beroepsnamen van de medewerker -- die zijn bewust weggelaten. Baseer je functievoorstellen UITSLUITEND op de inhoud van de antwoorden. Laat je niet leiden door veronderstellingen over welk beroep de medewerker in gedachten had.

BELANGRIJK: Je bent NIET beperkt tot een vaste lijst van functies. Je mag ALLE bestaande functies voorstellen die passen binnen de sector "${sectorName}", zolang het échte, bestaande functies zijn.

Je kiest:
• Twee logische, passende functies die direct aansluiten op de voorkeuren van de medewerker
• Eén verrassend, avontuurlijk en onverwacht alternatief — een functie die de medewerker zelf waarschijnlijk niet snel zou bedenken, maar die wél aansluit bij het opleidingsniveau en de kernvaardigheden. Kies bewust een richting die de medewerker zelf nooit zou googelen of overwegen. Verras echt. Begin deze met: "En als verrassing..." of "Misschien had je dit niet verwacht, maar..."

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

Kernwoorden van de medewerker:
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
${vacatureList ? `\nDaarnaast zijn er recente vacatures binnen ${organisationName} die als inspiratie kunnen dienen (maar je bent hier NIET toe beperkt):\n${vacatureList}` : ''}

Regels:
1. Bedenk PRECIES 3 functies die bestaan binnen de sector "${sectorName}".
2. De functies moeten echte, bestaande functies zijn — geen verzonnen titels.
3. Zorg voor variatie: de 3 functies moeten uit verschillende werkgebieden komen.
4. Functie 1 en 2 zijn de meest logische en herkenbare matches.
5. Functie 3 is bewust verrassend en onverwacht. Begin deze met: "En als verrassing..." of "Misschien had je dit niet verwacht, maar..."
6. Schrijf per functie 2-3 zinnen, maximaal 40 woorden.
7. Verwerk actief de kernwoorden van de medewerker.
8. De functietitels mogen maximaal uit 3 woorden bestaan.`
    },
    en: {
      system: `You are a professional career coach specialised in the "${sectorName}" sector. You have in-depth knowledge of all roles and occupations that exist within this industry.

You receive information about an employee and translate this into three concrete roles that exist within the "${sectorName}" sector.

IMPORTANT: You do NOT receive occupation names from the employee -- these have been deliberately omitted. Base your job suggestions EXCLUSIVELY on the content of the answers. Do not be guided by assumptions about what occupation the employee had in mind.

IMPORTANT: You are NOT limited to a fixed list of roles. You may suggest ANY existing role that fits within the "${sectorName}" sector, as long as it is a real, existing occupation.

You choose:
• Two logical, fitting occupations that directly match the employee's preferences
• One surprising, adventurous and unexpected alternative — a role the employee would likely not have thought of themselves, but that still matches their education level and core competencies. Choose a direction the employee would never search for or consider on their own. Truly surprise them

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

Employee keywords:
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
${vacatureList ? `\nAdditionally, here are recent vacancies within ${organisationName} for inspiration (you are NOT limited to these):\n${vacatureList}` : ''}

Rules:
1. Suggest EXACTLY 3 roles that exist within the "${sectorName}" sector.
2. The roles must be real, existing occupations — no invented titles.
3. Ensure variety: the 3 roles should come from different work areas.
4. Role 1 and 2 are the most logical and recognisable matches.
5. Role 3 is deliberately surprising and unexpected.
6. Write 2-3 sentences per role, maximum 40 words.
7. Actively use the employee's keywords.
8. Job titles must consist of a maximum of 3 words.`
    },
    de: {
      system: `Du bist ein professioneller Karriereberater, spezialisiert auf den Bereich "${sectorName}". Du hast fundierte Kenntnisse über alle Funktionen und Berufe, die in dieser Branche existieren.

Du erhältst Informationen über eine Mitarbeiterin / einen Mitarbeiter und übersetzt diese in drei konkrete Funktionen, die im Bereich "${sectorName}" existieren.

WICHTIG: Du erhältst KEINE Berufsnamen von der Person -- diese wurden bewusst weggelassen. Basiere deine Vorschläge AUSSCHLIESSLICH auf dem Inhalt der Antworten. Lass dich nicht von Vermutungen leiten, welchen Beruf die Person im Kopf hatte.

WICHTIG: Du bist NICHT auf eine feste Liste von Funktionen beschränkt. Du darfst ALLE existierenden Funktionen vorschlagen, die in den Bereich "${sectorName}" passen, solange es echte, bestehende Berufe sind.

Du wählst:
• Zwei logische, passende Berufe, die direkt an die Präferenzen der Person anknüpfen
• Einen überraschenden, abenteuerlichen und unerwarteten Alternativberuf — einen Beruf, an den die Person selbst wahrscheinlich nicht gedacht hätte, der aber zum Bildungsniveau und den Kernkompetenzen passt

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

Schlüsselwörter der Person:
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
${vacatureList ? `\nZusätzlich gibt es aktuelle Stellenangebote bei ${organisationName} als Inspiration (du bist NICHT darauf beschränkt):\n${vacatureList}` : ''}

Regeln:
1. Schlage GENAU 3 Funktionen vor, die im Bereich "${sectorName}" existieren.
2. Die Funktionen müssen echte, bestehende Berufe sein — keine erfundenen Titel.
3. Sorge für Abwechslung: die 3 Funktionen sollten aus verschiedenen Arbeitsbereichen kommen.
4. Funktion 1 und 2 sind die logischsten und erkennbarsten Übereinstimmungen.
5. Funktion 3 ist bewusst überraschend und unerwartet.
6. Schreibe 2-3 Sätze pro Funktion, maximal 40 Wörter.
7. Verarbeite aktiv die Schlüsselwörter der Person.
8. Berufstitel dürfen maximal aus 3 Wörtern bestehen.`
    },
    no: {
      system: `Du er en profesjonell karriereveileder spesialisert innenfor "${sectorName}"-sektoren. Du har inngående kunnskap om alle funksjoner og yrker som finnes innenfor denne bransjen.

Du mottar informasjon om en ansatt og oversetter dette til tre konkrete funksjoner som finnes innenfor "${sectorName}"-sektoren.

VIKTIG: Du mottar INGEN yrkesnavn fra den ansatte -- disse er bevisst utelatt. Baser yrkesforslag UTELUKKENDE på innholdet i svarene. Ikke la deg lede av antakelser om hvilket yrke den ansatte hadde i tankene.

VIKTIG: Du er IKKE begrenset til en fast liste over funksjoner. Du kan foreslå ALLE eksisterende funksjoner som passer innenfor "${sectorName}"-sektoren, så lenge det er ekte, eksisterende yrker.

Du velger:
• To logiske, passende yrker som direkte samsvarer med den ansattes preferanser
• Ett overraskende, eventyrlig og uventet alternativ — et yrke den ansatte sannsynligvis ikke ville tenkt på selv, men som likevel passer med utdanningsnivået og kjernekompetansene

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

Nøkkelord for den ansatte:
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
${vacatureList ? `\nI tillegg er det nylige stillingsannonser hos ${organisationName} som inspirasjon (du er IKKE begrenset til disse):\n${vacatureList}` : ''}

Regler:
1. Foreslå NØYAKTIG 3 funksjoner som finnes innenfor "${sectorName}"-sektoren.
2. Funksjonene må være ekte, eksisterende yrker — ingen oppdiktede titler.
3. Sørg for variasjon: de 3 funksjonene bør komme fra forskjellige arbeidsområder.
4. Funksjon 1 og 2 er de mest logiske og gjenkjennelige treffene.
5. Funksjon 3 er bevisst overraskende og uventet.
6. Skriv 2-3 setninger per funksjon, maksimalt 40 ord.
7. Bruk aktivt nøkkelordene til den ansatte.
8. Yrkestitler kan bestå av maks 3 ord.`
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
Vraag 1: "Wat doe je in een werkweek? Antwoord in werkwoorden en activiteiten."
Antwoord 1: "${data.wensberoep1.werkweekActiviteiten}"

Vraag 2: "Waar doe je je werk? Beschrijf de omgeving, het gebouw, de ruimte..."
Antwoord 2: "${data.wensberoep1.werklocatieOmgeving}"

Vraag 3: "Werk je meer samen of meer alleen? Met wat voor mensen heb je contact?"
Antwoord 3: "${data.wensberoep1.samenwerkingContacten}"

Vraag 4: "Wat heb je gedaan op een dag dat je tevreden thuiskomt?"
Antwoord 4: "${data.wensberoep1.fluitendThuiskomen}"

Vraag 5: "Wat is je doel met dit werk?"
Antwoord 5: "${data.wensberoep1.werkDoel}"

Vraag 6: "Welke onderdelen uit je werk zijn het leukst?"
Antwoord 6: "${data.wensberoep1.leuksteOnderdelen}"

Vraag 7: "Wat is voor jou belangrijk in dit werk?"
Antwoord 7: "${data.wensberoep1.belangrijkeAspecten}"

Vraag 8: "Waar gaat het vooral over in jouw werk? Waar moet je veel van weten?"
Antwoord 8: "${data.wensberoep1.kennisFocus}"

Beschrijving 2:
Vraag 1: "Wat doe je in een werkweek? Antwoord in werkwoorden en activiteiten."
Antwoord 1: "${data.wensberoep2.werkweekActiviteiten}"

Vraag 2: "Waar doe je je werk? Beschrijf de omgeving, het gebouw, de ruimte..."
Antwoord 2: "${data.wensberoep2.werklocatieOmgeving}"

Vraag 3: "Werk je meer samen of meer alleen? Met wat voor mensen heb je contact?"
Antwoord 3: "${data.wensberoep2.samenwerkingContacten}"

Vraag 4: "Wat heb je gedaan op een dag dat je tevreden thuiskomt?"
Antwoord 4: "${data.wensberoep2.fluitendThuiskomen}"

Vraag 5: "Wat is je doel met dit werk?"
Antwoord 5: "${data.wensberoep2.werkDoel}"

Vraag 6: "Welke onderdelen uit je werk zijn het leukst?"
Antwoord 6: "${data.wensberoep2.leuksteOnderdelen}"

Vraag 7: "Wat is voor jou belangrijk in dit werk?"
Antwoord 7: "${data.wensberoep2.belangrijkeAspecten}"

Vraag 8: "Waar gaat het vooral over in jouw werk? Waar moet je veel van weten?"
Antwoord 8: "${data.wensberoep2.kennisFocus}"

Beschrijving 3:
Vraag 1: "Wat doe je in een werkweek? Antwoord in werkwoorden en activiteiten."
Antwoord 1: "${data.wensberoep3.werkweekActiviteiten}"

Vraag 2: "Waar doe je je werk? Beschrijf de omgeving, het gebouw, de ruimte..."
Antwoord 2: "${data.wensberoep3.werklocatieOmgeving}"

Vraag 3: "Werk je meer samen of meer alleen? Met wat voor mensen heb je contact?"
Antwoord 3: "${data.wensberoep3.samenwerkingContacten}"

Vraag 4: "Wat heb je gedaan op een dag dat je tevreden thuiskomt?"
Antwoord 4: "${data.wensberoep3.fluitendThuiskomen}"

Vraag 5: "Wat is je doel met dit werk?"
Antwoord 5: "${data.wensberoep3.werkDoel}"

Vraag 6: "Welke onderdelen uit je werk zijn het leukst?"
Antwoord 6: "${data.wensberoep3.leuksteOnderdelen}"

Vraag 7: "Wat is voor jou belangrijk in dit werk?"
Antwoord 7: "${data.wensberoep3.belangrijkeAspecten}"

Vraag 8: "Waar gaat het vooral over in jouw werk? Waar moet je veel van weten?"
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
• Verwerk actief de gegenereerde kernwoorden in de uitleg
• Houd rekening met opleiding en beperkingen
• De functietitels mogen maximaal uit 3 woorden bestaan

⚠️ Belangrijk:
De functie uitleg mag per functie maximaal 40 woorden zijn. Zorg dat elke beschrijving eindigt met een afgeronde zin.`
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

Question 1: "What do you do in a working week? Answer in verbs and activities."
Answer 1: "${data.wensberoep1.werkweekActiviteiten}"

Question 2: "Where do you do your work? Describe the environment, the building, the space…"
Answer 2: "${data.wensberoep1.werklocatieOmgeving}"

Question 3: "Do you work mostly together or mostly alone? What kind of people do you have contact with?"
Answer 3: "${data.wensberoep1.samenwerkingContacten}"

Question 4: "What have you done on a day when you come home satisfied?"
Answer 4: "${data.wensberoep1.fluitendThuiskomen}"

Question 5: "What is your goal with this work?"
Answer 5: "${data.wensberoep1.werkDoel}"

Question 6: "Which parts of your work do you enjoy most?"
Answer 6: "${data.wensberoep1.leuksteOnderdelen}"

Question 7: "What is important to you in this work?"
Answer 7: "${data.wensberoep1.belangrijkeAspecten}"

Question 8: "What is your work mainly about? What do you need to know a lot about?"
Answer 8: "${data.wensberoep1.kennisFocus}"

⸻

Description 2:

Question 1: "What do you do in a working week? Answer in verbs and activities."
Answer 1: "${data.wensberoep2.werkweekActiviteiten}"

Question 2: "Where do you do your work? Describe the environment, the building, the space…"
Answer 2: "${data.wensberoep2.werklocatieOmgeving}"

Question 3: "Do you work mostly together or mostly alone? What kind of people do you have contact with?"
Answer 3: "${data.wensberoep2.samenwerkingContacten}"

Question 4: "What have you done on a day when you come home satisfied?"
Answer 4: "${data.wensberoep2.fluitendThuiskomen}"

Question 5: "What is your goal with this work?"
Answer 5: "${data.wensberoep2.werkDoel}"

Question 6: "Which parts of your work do you enjoy most?"
Answer 6: "${data.wensberoep2.leuksteOnderdelen}"

Question 7: "What is important to you in this work?"
Answer 7: "${data.wensberoep2.belangrijkeAspecten}"

Question 8: "What is your work mainly about? What do you need to know a lot about?"
Answer 8: "${data.wensberoep2.kennisFocus}"

⸻

Description 3:

Question 1: "What do you do in a working week? Answer in verbs and activities."
Answer 1: "${data.wensberoep3.werkweekActiviteiten}"

Question 2: "Where do you do your work? Describe the environment, the building, the space…"
Answer 2: "${data.wensberoep3.werklocatieOmgeving}"

Question 3: "Do you work mostly together or mostly alone? What kind of people do you have contact with?"
Answer 3: "${data.wensberoep3.samenwerkingContacten}"

Question 4: "What have you done on a day when you come home satisfied?"
Answer 4: "${data.wensberoep3.fluitendThuiskomen}"

Question 5: "What is your goal with this work?"
Answer 5: "${data.wensberoep3.werkDoel}"

Question 6: "Which parts of your work do you enjoy most?"
Answer 6: "${data.wensberoep3.leuksteOnderdelen}"

Question 7: "What is important to you in this work?"
Answer 7: "${data.wensberoep3.belangrijkeAspecten}"

Question 8: "What is your work mainly about? What do you need to know a lot about?"
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
• Actively use the generated keywords in the explanation
• Consider education and limitations
• Job titles must consist of a maximum of 3 words

⚠️ Important
The function explanation can be no longer than 40 words per occupation. Ensure each description ends with a complete sentence.`
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
Frage 1: „Was machst du in einer Arbeitswoche? Antworte in Tätigkeitswörtern (Verben) und Aktivitäten."
Antwort 1: "${data.wensberoep1.werkweekActiviteiten}"

Frage 2: „Wo übst du deine Arbeit aus? Beschreibe die Umgebung, das Gebäude, den Raum …"
Antwort 2: "${data.wensberoep1.werklocatieOmgeving}"

Frage 3: „Arbeitest du mehr im Team oder mehr allein? Mit welchen Menschen hast du Kontakt?"
Antwort 3: "${data.wensberoep1.samenwerkingContacten}"

Frage 4: „Was hast du an einem Tag getan, an dem du zufrieden nach Hause kommst?"
Antwort 4: "${data.wensberoep1.fluitendThuiskomen}"

Frage 5: „Was ist dein Ziel mit dieser Arbeit?"
Antwort 5: "${data.wensberoep1.werkDoel}"

Frage 6: „Welche Teile deiner Arbeit machen dir am meisten Spaß?"
Antwort 6: "${data.wensberoep1.leuksteOnderdelen}"

Frage 7: „Was ist für dich wichtig in dieser Arbeit?"
Antwort 7: "${data.wensberoep1.belangrijkeAspecten}"

Frage 8: „Worum geht es in deiner Arbeit hauptsächlich? Wovon musst du viel wissen?"
Antwort 8: "${data.wensberoep1.kennisFocus}"

Beschreibung 2:
Frage 1: „Was machst du in einer Arbeitswoche? Antworte in Tätigkeitswörtern (Verben) und Aktivitäten."
Antwort 1: "${data.wensberoep2.werkweekActiviteiten}"

Frage 2: „Wo übst du deine Arbeit aus? Beschreibe die Umgebung, das Gebäude, den Raum …"
Antwort 2: "${data.wensberoep2.werklocatieOmgeving}"

Frage 3: „Arbeitest du mehr im Team oder mehr allein? Mit welchen Menschen hast du Kontakt?"
Antwort 3: "${data.wensberoep2.samenwerkingContacten}"

Frage 4: „Was hast du an einem Tag getan, an dem du zufrieden nach Hause kommst?"
Antwort 4: "${data.wensberoep2.fluitendThuiskomen}"

Frage 5: „Was ist dein Ziel mit dieser Arbeit?"
Antwort 5: "${data.wensberoep2.werkDoel}"

Frage 6: „Welche Teile deiner Arbeit machen dir am meisten Spaß?"
Antwort 6: "${data.wensberoep2.leuksteOnderdelen}"

Frage 7: „Was ist für dich wichtig in dieser Arbeit?"
Antwort 7: "${data.wensberoep2.belangrijkeAspecten}"

Frage 8: „Worum geht es in deiner Arbeit hauptsächlich? Wovon musst du viel wissen?"
Antwort 8: "${data.wensberoep2.kennisFocus}"

Beschreibung 3:
Frage 1: „Was machst du in einer Arbeitswoche? Antworte in Tätigkeitswörtern (Verben) und Aktivitäten."
Antwort 1: "${data.wensberoep3.werkweekActiviteiten}"

Frage 2: „Wo übst du deine Arbeit aus? Beschreibe die Umgebung, das Gebäude, den Raum …"
Antwort 2: "${data.wensberoep3.werklocatieOmgeving}"

Frage 3: „Arbeitest du mehr im Team oder mehr allein? Mit welchen Menschen hast du Kontakt?"
Antwort 3: "${data.wensberoep3.samenwerkingContacten}"

Frage 4: „Was hast du an einem Tag getan, an dem du zufrieden nach Hause kommst?"
Antwort 4: "${data.wensberoep3.fluitendThuiskomen}"

Frage 5: „Was ist dein Ziel mit dieser Arbeit?"
Antwort 5: "${data.wensberoep3.werkDoel}"

Frage 6: „Welche Teile deiner Arbeit machen dir am meisten Spaß?"
Antwort 6: "${data.wensberoep3.leuksteOnderdelen}"

Frage 7: „Was ist für dich wichtig in dieser Arbeit?"
Antwort 7: "${data.wensberoep3.belangrijkeAspecten}"

Frage 8: „Worum geht es in deiner Arbeit hauptsächlich? Wovon musst du viel wissen?"
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
• Verarbeite die generierten Schlüsselwörter aktiv in den Erläuterungen
• Berücksichtige Ausbildung und Einschränkungen
• Die Berufstitel dürfen höchstens aus 3 Wörtern bestehen

⚠️ Wichtig:
Die Erläuterung pro Beruf darf maximal 40 Wörter enthalten. Stelle sicher, dass jede Beschreibung mit einem vollständigen Satz endet.`
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

Spørsmål 1: "Hva gjør du i en arbeidsuke? Svar i verb og aktiviteter."
Svar 1: "${data.wensberoep1.werkweekActiviteiten}"

Spørsmål 2: "Hvor utfører du arbeidet ditt? Beskriv miljøet, bygget, rommet …"
Svar 2: "${data.wensberoep1.werklocatieOmgeving}"

Spørsmål 3: "Jobber du mest sammen med andre eller mest alene? Hvilke mennesker har du kontakt med?"
Svar 3: "${data.wensberoep1.samenwerkingContacten}"

Spørsmål 4: "Hva har du gjort på en dag der du kommer hjem fornøyd?"
Svar 4: "${data.wensberoep1.fluitendThuiskomen}"

Spørsmål 5: "Hva er målet ditt med dette arbeidet?"
Svar 5: "${data.wensberoep1.werkDoel}"

Spørsmål 6: "Hvilke deler av arbeidet liker du best?"
Svar 6: "${data.wensberoep1.leuksteOnderdelen}"

Spørsmål 7: "Hva er viktig for deg i dette arbeidet?"
Svar 7: "${data.wensberoep1.belangrijkeAspecten}"

Spørsmål 8: "Hva handler arbeidet ditt hovedsakelig om? Hva må du vite mye om?"
Svar 8: "${data.wensberoep1.kennisFocus}"

⸻

Beskrivelse 2:

Spørsmål 1: "Hva gjør du i en arbeidsuke? Svar i verb og aktiviteter."
Svar 1: "${data.wensberoep2.werkweekActiviteiten}"

Spørsmål 2: "Hvor utfører du arbeidet ditt? Beskriv miljøet, bygget, rommet …"
Svar 2: "${data.wensberoep2.werklocatieOmgeving}"

Spørsmål 3: "Jobber du mest sammen med andre eller mest alene? Hvilke mennesker har du kontakt med?"
Svar 3: "${data.wensberoep2.samenwerkingContacten}"

Spørsmål 4: "Hva har du gjort på en dag der du kommer hjem fornøyd?"
Svar 4: "${data.wensberoep2.fluitendThuiskomen}"

Spørsmål 5: "Hva er målet ditt med dette arbeidet?"
Svar 5: "${data.wensberoep2.werkDoel}"

Spørsmål 6: "Hvilke deler av arbeidet liker du best?"
Svar 6: "${data.wensberoep2.leuksteOnderdelen}"

Spørsmål 7: "Hva er viktig for deg i dette arbeidet?"
Svar 7: "${data.wensberoep2.belangrijkeAspecten}"

Spørsmål 8: "Hva handler arbeidet ditt hovedsakelig om? Hva må du vite mye om?"
Svar 8: "${data.wensberoep2.kennisFocus}"

⸻

Beskrivelse 3:

Spørsmål 1: "Hva gjør du i en arbeidsuke? Svar i verb og aktiviteter."
Svar 1: "${data.wensberoep3.werkweekActiviteiten}"

Spørsmål 2: "Hvor utfører du arbeidet ditt? Beskriv miljøet, bygget, rommet …"
Svar 2: "${data.wensberoep3.werklocatieOmgeving}"

Spørsmål 3: "Jobber du mest sammen med andre eller mest alene? Hvilke mennesker har du kontakt med?"
Svar 3: "${data.wensberoep3.samenwerkingContacten}"

Spørsmål 4: "Hva har du gjort på en dag der du kommer hjem fornøyd?"
Svar 4: "${data.wensberoep3.fluitendThuiskomen}"

Spørsmål 5: "Hva er målet ditt med dette arbeidet?"
Svar 5: "${data.wensberoep3.werkDoel}"

Spørsmål 6: "Hvilke deler av arbeidet liker du best?"
Svar 6: "${data.wensberoep3.leuksteOnderdelen}"

Spørsmål 7: "Hva er viktig for deg i dette arbeidet?"
Svar 7: "${data.wensberoep3.belangrijkeAspecten}"

Spørsmål 8: "Hva handler arbeidet ditt hovedsakelig om? Hva må du vite mye om?"
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
• Bruk nøkkelordene aktivt i forklaringene
• Ta hensyn til utdanning og begrensninger
• Yrker kan bestå av maks tre ord

⚠️ Viktig
Forklaringen til funksjonene kan maksimalt være på 40 ord per funksjon. Sørg for at hver beskrivelse avsluttes med en komplett setning.`
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
        .select('slug, name, is_unique, parent_type_id')
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

        // For unique organisations (like ErasmusMC), also fetch relevant vacancies as inspiration
        if (orgType.is_unique) {
          console.log('🏥 Unique organisation detected - fetching vacancies as inspiration...');

          const allKeywords = [
            ...(prioriteitenData?.selected_activiteiten_keywords || []),
            ...(prioriteitenData?.selected_werkomstandigheden_keywords || []),
            ...(prioriteitenData?.selected_interesses_keywords || []),
          ].map((k: string) => k.toLowerCase());

          const { data: vacancies } = await supabase
            .from('organisation_vacancies')
            .select('title, department, description, keywords')
            .eq('organisation_type_id', organisation_type_id);

          if (vacancies && vacancies.length > 0) {
            const scored = vacancies.map(v => {
              const searchText = [
                v.title || '',
                v.department || '',
                v.description || '',
                ...(v.keywords || []),
              ].join(' ').toLowerCase();
              const matchCount = allKeywords.filter(kw => searchText.includes(kw)).length;
              return { ...v, matchCount };
            });
            scored.sort((a, b) => b.matchCount - a.matchCount);
            organisationVacancies = scored.slice(0, 20);
            console.log(`✅ Found ${vacancies.length} total vacancies, selected top ${organisationVacancies.length} relevant`);
          }
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
