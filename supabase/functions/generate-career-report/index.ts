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
  sectorVoorkeur: string;
  fysiekeBeperkingen: string;
}

function getCareerReportPrompts(language: string, data: UserData): { system: string; user: string } {
  const prompts: Record<string, { system: string; user: string }> = {
    nl: {
      system: `Je bent een professionele loopbaancoach met diepgaande kennis van bestaande beroepen, functies, sectoren en loopbaanontwikkeling. Je denkt praktisch en mensgericht, en baseert je adviezen op een aantal interviews en wat iemand leuk vindt om te doen (activiteiten), waar iemand zich prettig voelt (werkomgeving), en waar iemand oprecht in geïnteresseerd is (interesses).

Je ontvangt informatie over een aantal wensberoepen van een gebruiker en ook over iemand zijn/haar lievelings activiteiten, gewenste werkomgeving en interesses.

Je vertaalt dit profiel naar drie bestaande functies die passen bij het Nederlandse arbeidslandschap. Dit zijn:
• Twee logische, passende beroepen die direct aansluiten op de voorkeuren van de gebruiker
• Eén verrassend, maar goed beargumenteerd alternatief dat ook écht bestaat (dus geen verzonnen functietitel)

Voor elk beroep geef je een heldere, korte uitleg (max. 6 zinnen) waarin je actief de kernwoorden verwerkt en laat zien waarom deze functie bij de gebruiker past. Houd daarbij rekening met het opleidingsniveau, fysieke beperkingen (indien van toepassing), sectorvoorkeur en andere context.

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

De gebruiker heeft in totaal 3 wensberoepen genoemd en per wensberoep 8 vragen beantwoord. De antwoorden op deze vragen moeten worden meegenomen als context om voorbeeldfuncties te genereren.

Wensberoep 1: ${data.wensberoep1.titel}
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

Wensberoep 2: ${data.wensberoep2.titel}
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

Wensberoep 3: ${data.wensberoep3.titel}
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
• Sectorvoorkeur: ${data.sectorVoorkeur}

⸻

Opdracht:

Bedenk drie concrete functies die bij deze persoon passen:
• Kies uitsluitend bestaande beroepen die in Nederland gangbaar zijn
• Gebruik bijvoorbeeld beroepentitels zoals opgenomen in NLQF/BIG/ISCO-structuren, of zoals te vinden op websites als werk.nl, nationaleberoepengids.nl of 123test.nl
• Geef twee passende beroepen en één verrassend beroep (dat buiten verwachting ligt, maar goed onderbouwd is)
• Voeg bij elk beroep een korte uitleg toe van maximaal 50 woorden
• Verwerk actief de gegenereerde kernwoorden in de uitleg
• Houd rekening met opleiding, beperkingen en sectorvoorkeur
• De functietitels mogen maximaal uit 3 woorden bestaan

⚠️ Belangrijk:
De functie uitleg mag per functie maximaal 50 woorden zijn.`
    },
    en: {
      system: `You are a professional career coach with in-depth knowledge of existing occupations, roles, sectors and career development. You think in a practical and people-focused way, and you base your advice on a series of interviews and on what someone likes to do (activities), where they feel comfortable (work environment), and what they are genuinely interested in (interests).

You receive information about several desired occupations from a user, as well as information about their favourite activities, preferred work environment and interests.

You translate this profile into three existing roles that fit within the European labour market. These are:
• Two logical, fitting occupations that directly match the user's preferences
• One surprising, but well-argued alternative that really exists (so no invented job titles)

For each occupation, you provide a clear, concise explanation (max. 6 sentences) in which you actively use the keywords and show why this role fits the user. You take into account the user's education level, physical limitations (if applicable), sector preference and other relevant context.

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

The user has mentioned a total of 3 desired occupations and has answered 8 questions per desired occupation. The answers to these questions must be used as context to generate example job suggestions.

⸻

Desired occupation 1: ${data.wensberoep1.titel}

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

Desired occupation 2: ${data.wensberoep2.titel}

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

Desired occupation 3: ${data.wensberoep3.titel}

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
• Preferred sector: ${data.sectorVoorkeur}

⸻

Task

Generate three concrete job suggestions that fit this person:

• Choose only existing occupations commonly used in Europe
• Use job titles as found in SOC/O*NET/ESCO frameworks, or as found on websites like onetonline.org, prospects.ac.uk
• Provide two fitting occupations and one surprising (but well-substantiated) option
• Provide a short explanation per occupation (max 50 words)
• Actively use the generated keywords in the explanation
• Consider education, limitations, and sector preference
• Job titles must consist of a maximum of 3 words

⚠️ Important
The function explanation can be no longer than 50 words per occupation.`
    },
    de: {
      system: `Du bist eine professionelle Laufbahnberaterin bzw. ein professioneller Laufbahnberater mit tiefgehendem Wissen über bestehende Berufe, Tätigkeiten, Branchen und berufliche Entwicklung. Du denkst praktisch und menschenorientiert und stützt deine Empfehlungen auf mehrere Interviews sowie darauf, was eine Person gerne tut (Aktivitäten), in welcher Arbeitsumgebung sie sich wohlfühlt und welche Themen sie wirklich interessieren (Interessen).

Du erhältst Informationen über mehrere Wunschberufe einer Nutzerin oder eines Nutzers sowie Angaben zu bevorzugten Aktivitäten, gewünschter Arbeitsumgebung und Interessen.

Du übersetzt dieses Profil in drei real existierende Berufe, die zum deutschen Arbeitsmarkt passen. Diese sind:
• Zwei logische, passende Berufe, die direkt an die Präferenzen der Person anknüpfen
• Ein überraschender, aber gut begründeter Alternativberuf, der ebenfalls real existiert (keine erfundenen Berufstitel)

Für jeden Beruf gibst du eine klare, kurze Erklärung (max. 6 Sätze), in der du die Schlüsselwörter aktiv einsetzt und nachvollziehbar erklärst, warum dieser Beruf zu der Person passt. Dabei berücksichtigst du Bildungsniveau, eventuelle körperliche Einschränkungen, Branchenpräferenzen und weiteren Kontext.

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

Die Nutzerin / der Nutzer hat insgesamt 3 Wunschberufe genannt und pro Wunschberuf 8 Fragen beantwortet. Die Antworten auf diese Fragen müssen als Kontext genutzt werden, um passende Beispielberufe zu generieren.

Wunschberuf 1: ${data.wensberoep1.titel}
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

Wunschberuf 2: ${data.wensberoep2.titel}
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

Wunschberuf 3: ${data.wensberoep3.titel}
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
• Bevorzugter Sektor: ${data.sectorVoorkeur}

⸻

Aufgabe:

Denke dir drei konkrete Berufe aus, die zu dieser Person passen:
• Wähle ausschließlich bestehende Berufe, die im europäischen Kontext gebräuchlich sind
• Nutze zum Beispiel Berufstitel, wie sie in Strukturen wie DEQF/BIG/ISCO vorkommen oder auf Websites wie berufenet.arbeitsagentur.de, BERUFENET der Bundesagentur für Arbeit, berufe.tv oder BERUFE-Entdecker der IHK zu finden sind
• Gib zwei passende Berufe und einen überraschenden Beruf an (unerwartet, aber gut begründet)
• Füge für jeden Beruf eine kurze Erklärung mit maximal 50 Wörtern hinzu
• Verarbeite die generierten Schlüsselwörter aktiv in den Erläuterungen
• Berücksichtige Ausbildung, Einschränkungen und bevorzugten Sektor
• Die Berufstitel dürfen höchstens aus 3 Wörtern bestehen

⚠️ Wichtig:
Die Erläuterung pro Beruf darf maximal 50 Wörter enthalten.`
    },
    no: {
      system: `Du er en profesjonell karriereveileder med inngående kunnskap om eksisterende yrker, funksjoner, sektorer og karriereutvikling. Du tenker praktisk og menneskefokusert, og du baserer dine råd på flere intervjuer og på hva en person liker å gjøre (aktiviteter), hvilken arbeidskontekst personen trives i (arbeidsmiljø), og hva personen oppriktig er interessert i (interesser).

Du mottar informasjon om flere ønskede yrker fra en bruker, samt informasjon om brukerens favorittaktiviteter, ønsket arbeidsmiljø og interesser.

Du oversetter denne profilen til tre eksisterende yrker som passer innenfor det norske arbeidsmarkedet. Disse er:
• To logiske, passende yrker som direkte samsvarer med brukerens preferanser
• Ett overraskende, men godt begrunnet alternativ som også finnes i virkeligheten (ingen oppdiktede yrkestitler)

For hvert yrke gir du en tydelig og kort forklaring (maks. 6 setninger) der du aktivt bruker nøkkelordene og forklarer hvorfor yrket passer brukeren. Du tar hensyn til utdanningsnivå, eventuelle fysiske begrensninger, sektorpreferanse og annen relevant kontekst.

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

Brukeren har oppgitt totalt tre ønskede yrker og besvart åtte spørsmål for hvert ønsket yrke. Svarene på disse spørsmålene skal brukes som kontekst for å generere passende jobbforslag.

⸻

Ønsket yrke 1: ${data.wensberoep1.titel}

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

Ønsket yrke 2: ${data.wensberoep2.titel}

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

Ønsket yrke 3: ${data.wensberoep3.titel}

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
• Foretrukket sektor: ${data.sectorVoorkeur}

⸻

Oppgave

Lag tre konkrete jobbforslag som passer denne personen:
• Velg kun eksisterende yrker som er vanlige i Norge og Europa
• Bruk for eksempel yrkestitler som finnes i strukturer som NOKUT, Utdanning.no, NAVs yrkesbeskrivelser eller på nettsider som Finn.no, Arbeidsplassen.no eller utdanning.no
• Gi to passende yrker og ett overraskende (men godt begrunnet) yrke
• Forklaringen per yrke skal være maks 50 ord
• Bruk nøkkelordene aktivt i forklaringene
• Ta hensyn til utdanning, begrensninger og foretrukket sektor
• Yrker kan bestå av maks tre ord

⚠️ Viktig
Forklaringen til funksjonene kan maksimalt være på 50 ord per funksjon.`
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
    const { user_id, round_id, language = 'nl' } = await req.json();

    console.log('🚀 Starting AI career report generation for user:', user_id, 'round:', round_id, 'language:', language);

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
      sectorVoorkeur: extraInfoData?.sector_voorkeur || 'Niet ingevuld',
      fysiekeBeperkingen: extraInfoData?.fysieke_beperkingen || 'Geen',
    };

    // Get language-specific prompts
    const prompts = getCareerReportPrompts(language, userData);

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
