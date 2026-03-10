import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language-specific prompts
const getPrompts = (language: string, enthousiasmeData: any, wensberoepenData: any) => {
  const prompts: Record<string, { system: string; user: string }> = {
    nl: {
      system: `Je bent een loopbaanprofessional gespecialiseerd in het analyseren van open antwoorden van kandidaten. Je doel is om 48 korte beschrijvende zinnen te genereren (exact 16 per categorie) op basis van reflectieve antwoorden op vragen over werkervaring, voorkeuren en interesses.

BELANGRIJK: Genereer GEEN losse woorden. Elk item moet een korte beschrijvende zin zijn van 4-8 woorden die een concrete voorkeur of eigenschap beschrijft.

CRUCIAAL - NEUTRALE STIJL: Alle items worden geformuleerd ZONDER persoonlijk voornaamwoord ("Je"). Begin elk item direct met het werkwoord of een beschrijvend woord. De items moeten neutraal zijn zodat ze als losse keuzeopties gepresenteerd kunnen worden.

De output moet een JSON-object zijn, met drie aparte arrays:

- "activiteiten": dingen die iemand graag doet. GEEN "Je" gebruiken.
  Correct voorbeeld: ["bedenkt graag creatieve oplossingen", "werkt het liefst samen in een klein team", "begeleidt en coacht anderen", "geeft graag presentaties aan grote groepen"]
  FOUT: ["Je bedenkt graag creatieve oplossingen"] — GEEN "Je" gebruiken!
- "werkomgeving": voorkeuren voor omgeving of samenwerking. Zelfde regel: GEEN "Je".
  Voorbeeld: ["werkt het liefst in een informele sfeer", "houdt van flexibele werktijden", "wisselt graag af tussen kantoor en buitenwerk", "zoekt een rustige werkplek met concentratie"]
- "interesses": thema's of onderwerpen waar iemand in geïnteresseerd is. Zelfde regel.
  Voorbeeld: ["geïnteresseerd in technologie en innovatie", "gefascineerd door menselijk gedrag", "heeft een passie voor duurzaamheid", "nieuwsgierig naar kunst en cultuur"]

Gebruik uitsluitend informatie uit de antwoorden van de deelnemer. Formuleer alles in de stijl van de deelnemer. Elk item MOET een korte zin zijn van 4-8 woorden, NOOIT een los woord. NOOIT beginnen met "Je".

⚠️ De output moet geldig JSON zijn. Geen toelichting, geen extra uitleg, alleen het JSON-object.`,
      user: `Je ontvangt nu een volledig ingevulde antwoordenlijst van een gebruiker. Gebruik deze input om op basis van de methodiek van de loopbaantrechter 48 korte beschrijvende zinnen te genereren (exact 16 per categorie), verdeeld over drie categorieën:
• activiteiten (wat iemand graag doet)
• werkomgeving (de sfeer, structuur en context waarin iemand graag werkt)
• interesses (onderwerpen waar iemand door gefascineerd is of energie van krijgt)

BELANGRIJK - NEUTRALE STIJL: Begin GEEN enkel item met "Je". Start direct met het werkwoord.
Goed voorbeeld:
  Item 1: "bedenkt graag creatieve oplossingen"
  Item 2: "werkt het liefst in een informele sfeer"
  Item 3: "geïnteresseerd in technologie"
FOUT voorbeeld:
  Item 1: "Je bedenkt graag creatieve oplossingen"  ← FOUT, geen "Je" gebruiken!

De output moet in JSON-format zijn, met drie duidelijke keys:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Laat elke lijst exact 16 korte zinnen bevatten. Dit is belangrijk: niet meer, niet minder dan 16 items per categorie. Elk item moet een beschrijvende zin zijn van 4-8 woorden. NOOIT beginnen met "Je".

Input – Antwoorden gebruiker:

Jouw jeugd & schooltijd
1. Wat deed je graag? (op school en buiten school)
${enthousiasmeData?.kindertijd_activiteiten || 'Niet ingevuld'}
2. Waar was je veel te vinden? (als je uit school kwam of in het weekend)
${enthousiasmeData?.kindertijd_plekken || 'Niet ingevuld'}
3. Wat interesseerde jou? (denk aan schoolvakken, hobby's, onderwerpen op tv of in boeken)
${enthousiasmeData?.kindertijd_interesses_nieuw || 'Niet ingevuld'}

Je eerste werkervaring (dat kan ook een bijbaantje zijn)
4. Wat vond/vind je het leukst om te doen?
${enthousiasmeData?.eerste_werk_leukste_taken || 'Niet ingevuld'}
5. Wat sprak/spreekt je aan in de werkomstandigheden?
${enthousiasmeData?.eerste_werk_werkomstandigheden || 'Niet ingevuld'}
6. Wat zijn onderwerpen waar je je met plezier mee bezig hield/houdt?
${enthousiasmeData?.eerste_werk_onderwerpen || 'Niet ingevuld'}

Plezierige periodes
7. Aan welke periode denk je met heel veel plezier terug? Wat deed je toen?
${enthousiasmeData?.plezierige_werkperiode_beschrijving || 'Niet ingevuld'}
8. Kun je nog een leuke periode of project noemen? Wat was jouw rol?
${enthousiasmeData?.leuk_project_en_rol || 'Niet ingevuld'}
9. Wanneer kom jij fluitend thuis? Wat heb je dan meegemaakt op een dag?
${enthousiasmeData?.fluitend_thuiskomen_dag || 'Niet ingevuld'}

Wensberoep 1 – ${wensberoepenData?.wensberoep_1_titel || 'Niet ingevuld'}
1. Wat doe je in een werkweek?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Niet ingevuld'}
2. Waar doe je je werk?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Niet ingevuld'}
3. Werk je samen of alleen?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Niet ingevuld'}
4. Wat heb je gedaan op een dag dat je fluitend thuiskomt?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Niet ingevuld'}
5. Wat is je doel met dit werk?
${wensberoepenData?.wensberoep_1_werk_doel || 'Niet ingevuld'}
6. Welke onderdelen uit je werk zijn het leukst?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Niet ingevuld'}
7. Wat is belangrijk in dit werk?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Niet ingevuld'}
8. Waar gaat het vooral over in jouw werk?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Niet ingevuld'}

Wensberoep 2 – ${wensberoepenData?.wensberoep_2_titel || 'Niet ingevuld'}
1: ${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Niet ingevuld'}
2: ${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Niet ingevuld'}
3: ${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Niet ingevuld'}
4: ${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Niet ingevuld'}
5: ${wensberoepenData?.wensberoep_2_werk_doel || 'Niet ingevuld'}
6: ${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Niet ingevuld'}
7: ${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Niet ingevuld'}
8: ${wensberoepenData?.wensberoep_2_kennis_focus || 'Niet ingevuld'}

Wensberoep 3 – ${wensberoepenData?.wensberoep_3_titel || 'Niet ingevuld'}
1: ${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Niet ingevuld'}
2: ${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Niet ingevuld'}
3: ${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Niet ingevuld'}
4: ${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Niet ingevuld'}
5: ${wensberoepenData?.wensberoep_3_werk_doel || 'Niet ingevuld'}
6: ${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Niet ingevuld'}
7: ${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Niet ingevuld'}
8: ${wensberoepenData?.wensberoep_3_kennis_focus || 'Niet ingevuld'}`
    },
    en: {
      system: `You are a career professional specialized in analyzing open-ended responses from candidates. Your goal is to generate 48 short descriptive phrases in English (exactly 16 per category) based on reflective answers to questions about work experience, preferences, and interests.

IMPORTANT: Do NOT generate single words. Each item must be a short descriptive phrase of 4-8 words that describes a concrete preference or characteristic.

CRUCIAL - ENUMERATION STYLE: The items must form one flowing enumeration in the second person ("you"). Only the FIRST item per category starts with "You". All subsequent items continue WITHOUT "You", so they can be read as a comma-separated flowing sentence.

The output must be a JSON object, with three separate arrays:
• "activiteiten": things someone enjoys doing. First item starts with "You", the rest continues without "You".
  Correct example: ["You enjoy solving creative problems", "prefer collaborating in small teams", "like coaching and mentoring others", "love presenting ideas to large groups"]
  WRONG: ["You enjoy solving creative problems", "You prefer collaborating", "You like coaching"] — "You" appears too often!
• "werkomgeving": preferences for environment or collaboration. Same rule: only first item starts with "You".
  Example: ["You prefer working in a relaxed atmosphere", "enjoy flexible scheduling of work hours", "like alternating between office and fieldwork", "seek a quiet workspace for concentration"]
• "interesses": themes or topics someone is interested in. Same rule.
  Example: ["You are interested in technology and innovation", "are fascinated by human behavior", "have a passion for sustainability", "are curious about art and culture"]

Use only information from the participant's answers. Formulate everything in the participant's own style. Each item MUST be a short phrase of 4-8 words, NEVER a single word.

⚠️ The output must be valid JSON. No explanation, no additional text, only the JSON object.`,
      user: `You are now receiving a fully completed list of answers from a user. Use this input to generate 48 short descriptive phrases (exactly 16 per category) based on the method of the career funnel, divided into three categories:
• activities (what someone enjoys doing)
• work environment (the atmosphere, structure, and context in which someone prefers to work)
• interests (topics that fascinate or energize someone)

IMPORTANT - ENUMERATION STYLE: Only the FIRST item per category starts with "You". All following items start WITHOUT "You" so they fit as an enumeration after the first item.
Correct example:
  Item 1: "You enjoy solving creative problems"
  Item 2: "prefer working in a relaxed atmosphere"
  Item 3: "are interested in technology"
WRONG example:
  Item 1: "You enjoy solving creative problems"
  Item 2: "You prefer working in a relaxed atmosphere"  ← WRONG, "You" only at item 1!

The output must be in JSON format, with three clear keys:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Each list must contain exactly 16 short phrases. This is important: not more, not less than 16 items per category. Each item must be a descriptive phrase of 4-8 words.

Input – User answers:

Your childhood & school years
1. What did you enjoy doing? (at school and outside of school)
${enthousiasmeData?.kindertijd_activiteiten || 'Not filled in'}
2. Where could you often be found? (after school or on weekends)
${enthousiasmeData?.kindertijd_plekken || 'Not filled in'}
3. What interested you? (think of school subjects, hobbies, TV topics or books)
${enthousiasmeData?.kindertijd_interesses_nieuw || 'Not filled in'}

Your first work experience (this may also be a side job)
4. What did/do you enjoy doing most?
${enthousiasmeData?.eerste_werk_leukste_taken || 'Not filled in'}
5. What did/do you like about the working conditions?
${enthousiasmeData?.eerste_werk_werkomstandigheden || 'Not filled in'}
6. What topics did/do you enjoy working on?
${enthousiasmeData?.eerste_werk_onderwerpen || 'Not filled in'}

Enjoyable periods
7. Which period do you look back on with the most joy? What were you doing then?
${enthousiasmeData?.plezierige_werkperiode_beschrijving || 'Not filled in'}
8. Can you name another fun period or project? What was your role?
${enthousiasmeData?.leuk_project_en_rol || 'Not filled in'}
9. When do you come home whistling? What happened during that day?
${enthousiasmeData?.fluitend_thuiskomen_dag || 'Not filled in'}

Dream job 1 – ${wensberoepenData?.wensberoep_1_titel || 'Not filled in'}
1. What do you do in a typical workweek?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Not filled in'}
2. Where do you do your work?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Not filled in'}
3. Do you work alone or with others?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Not filled in'}
4. What happens during a day that makes you come home whistling?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Not filled in'}
5. What is your goal with this work?
${wensberoepenData?.wensberoep_1_werk_doel || 'Not filled in'}
6. What parts of the work do you enjoy the most?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Not filled in'}
7. What is important in this work?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Not filled in'}
8. What is the main focus of your work?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Not filled in'}

Dream job 2 – ${wensberoepenData?.wensberoep_2_titel || 'Not filled in'}
1: ${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Not filled in'}
2: ${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Not filled in'}
3: ${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Not filled in'}
4: ${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Not filled in'}
5: ${wensberoepenData?.wensberoep_2_werk_doel || 'Not filled in'}
6: ${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Not filled in'}
7: ${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Not filled in'}
8: ${wensberoepenData?.wensberoep_2_kennis_focus || 'Not filled in'}

Dream job 3 – ${wensberoepenData?.wensberoep_3_titel || 'Not filled in'}
1: ${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Not filled in'}
2: ${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Not filled in'}
3: ${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Not filled in'}
4: ${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Not filled in'}
5: ${wensberoepenData?.wensberoep_3_werk_doel || 'Not filled in'}
6: ${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Not filled in'}
7: ${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Not filled in'}
8: ${wensberoepenData?.wensberoep_3_kennis_focus || 'Not filled in'}`
    },
    de: {
      system: `Du bist ein Karriere-Profi, spezialisiert auf die Analyse von offenen Antworten von Kandidaten. Dein Ziel ist es, basierend auf reflektierten Antworten zu Fragen über Berufserfahrungen, Vorlieben und Interessen, 48 kurze beschreibende Sätze zu generieren (genau 16 pro Kategorie).

WICHTIG: Generiere KEINE einzelnen Wörter. Jedes Item muss ein kurzer beschreibender Satz von 4-8 Wörtern sein, der eine konkrete Vorliebe oder Eigenschaft beschreibt.

ENTSCHEIDEND - AUFZÄHLUNGSSTIL: Die Items müssen zusammen eine fließende Aufzählung in der Du-Form bilden. Nur das ERSTE Item pro Kategorie beginnt mit "Du". Alle folgenden Items setzen OHNE "Du" fort, sodass sie mit Kommas hintereinander als ein fließender Satz gelesen werden können.

Die Ausgabe muss ein JSON-Objekt sein, mit drei separaten Arrays:
• "activiteiten": Dinge, die jemand gerne tut. Erstes Item beginnt mit "Du", der Rest ohne "Du".
  Korrektes Beispiel: ["Du findest gerne kreative Lösungen", "arbeitest am liebsten im kleinen Team", "begleitest und coachst andere", "hältst gerne Präsentationen vor großen Gruppen"]
  FALSCH: ["Du findest gerne kreative Lösungen", "Du arbeitest am liebsten im Team", "Du begleitest andere"] — "Du" steht zu oft!
• "werkomgeving": Präferenzen für Umgebung oder Zusammenarbeit. Gleiche Regel.
  Beispiel: ["Du arbeitest am liebsten in entspannter Atmosphäre", "schätzt flexible Arbeitszeiten", "wechselst gerne zwischen Büro und Außenarbeit", "suchst einen ruhigen Arbeitsplatz"]
• "interesses": Themen oder Bereiche. Gleiche Regel.
  Beispiel: ["Du interessierst dich für Technologie und Innovation", "bist fasziniert von menschlichem Verhalten", "hast eine Leidenschaft für Nachhaltigkeit", "bist neugierig auf Kunst und Kultur"]

Verwende ausschließlich Informationen aus den Antworten des Teilnehmers. Formuliere alles im Stil des Teilnehmers. Jedes Item MUSS ein kurzer Satz von 4-8 Wörtern sein, NIEMALS ein einzelnes Wort.

⚠️ Die Ausgabe muss gültiges JSON sein. Keine Erläuterungen, keine zusätzlichen Erklärungen, nur das JSON-Objekt.`,
      user: `Du erhältst nun eine vollständig ausgefüllte Antwortliste von einer Nutzerin oder einem Nutzer. Verwende diese Eingaben, um auf Grundlage der Methodik des Berufstrichters 48 kurze beschreibende Sätze zu generieren (genau 16 pro Kategorie), aufgeteilt in drei Kategorien:
• Aktivitäten (was jemand gerne tut)
• Arbeitsumgebung (die Atmosphäre, Struktur und der Kontext, in dem jemand gerne arbeitet)
• Interessen (Themen, die jemanden faszinieren oder ihm/ihr Energie geben)

WICHTIG - AUFZÄHLUNGSSTIL: Nur das ERSTE Item pro Kategorie beginnt mit "Du". Alle folgenden Items beginnen OHNE "Du", sodass sie als Aufzählung hinter dem ersten Item passen.
Korrektes Beispiel:
  Item 1: "Du findest gerne kreative Lösungen"
  Item 2: "arbeitest am liebsten in entspannter Atmosphäre"
  Item 3: "interessierst dich für Technologie"
FALSCHES Beispiel:
  Item 1: "Du findest gerne kreative Lösungen"
  Item 2: "Du arbeitest am liebsten in entspannter Atmosphäre"  ← FALSCH, "Du" nur bei Item 1!

Das Ergebnis muss im JSON-Format sein, mit drei klaren Schlüsseln:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Jede Liste muss genau 16 kurze Sätze enthalten. Dies ist wichtig: nicht mehr, nicht weniger als 16 Einträge pro Kategorie. Jedes Item muss ein beschreibender Satz von 4-8 Wörtern sein.

Eingabe – Antworten der Nutzerin/des Nutzers:

Deine Kindheit & Schulzeit
1. Was hast du gerne gemacht? (in der Schule und außerhalb der Schule)
${enthousiasmeData?.kindertijd_activiteiten || 'Nicht ausgefüllt'}
2. Wo warst du oft anzutreffen? (nach der Schule oder am Wochenende)
${enthousiasmeData?.kindertijd_plekken || 'Nicht ausgefüllt'}
3. Was hat dich interessiert? (denk an Schulfächer, Hobbys, Themen im Fernsehen oder in Büchern)
${enthousiasmeData?.kindertijd_interesses_nieuw || 'Nicht ausgefüllt'}

Deine erste Arbeitserfahrung (kann auch ein Nebenjob gewesen sein)
4. Was hast du am liebsten gemacht?
${enthousiasmeData?.eerste_werk_leukste_taken || 'Nicht ausgefüllt'}
5. Was hat dir an den Arbeitsbedingungen gefallen?
${enthousiasmeData?.eerste_werk_werkomstandigheden || 'Nicht ausgefüllt'}
6. Mit welchen Themen hast du dich gerne beschäftigt?
${enthousiasmeData?.eerste_werk_onderwerpen || 'Nicht ausgefüllt'}

Schöne Phasen
7. An welche Zeit denkst du besonders gerne zurück? Was hast du damals gemacht?
${enthousiasmeData?.plezierige_werkperiode_beschrijving || 'Nicht ausgefüllt'}
8. Gibt es eine weitere schöne Phase oder ein Projekt? Welche Rolle hattest du?
${enthousiasmeData?.leuk_project_en_rol || 'Nicht ausgefüllt'}
9. Wann kommst du pfeifend nach Hause? Was ist an diesem Tag passiert?
${enthousiasmeData?.fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}

Wunschberuf 1 – ${wensberoepenData?.wensberoep_1_titel || 'Nicht ausgefüllt'}
1. Was machst du in einer typischen Arbeitswoche?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Nicht ausgefüllt'}
2. Wo übst du deinen Beruf aus?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Nicht ausgefüllt'}
3. Arbeitest du alleine oder im Team?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Nicht ausgefüllt'}
4. Was erlebst du an einem Tag, an dem du pfeifend nach Hause kommst?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}
5. Was ist dein Ziel mit dieser Arbeit?
${wensberoepenData?.wensberoep_1_werk_doel || 'Nicht ausgefüllt'}
6. Welche Aufgaben gefallen dir in diesem Beruf am meisten?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Nicht ausgefüllt'}
7. Was ist in diesem Beruf wichtig?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Nicht ausgefüllt'}
8. Worum geht es inhaltlich hauptsächlich in deinem Beruf?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Nicht ausgefüllt'}

Wunschberuf 2 – ${wensberoepenData?.wensberoep_2_titel || 'Nicht ausgefüllt'}
1: ${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Nicht ausgefüllt'}
2: ${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Nicht ausgefüllt'}
3: ${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Nicht ausgefüllt'}
4: ${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}
5: ${wensberoepenData?.wensberoep_2_werk_doel || 'Nicht ausgefüllt'}
6: ${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Nicht ausgefüllt'}
7: ${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Nicht ausgefüllt'}
8: ${wensberoepenData?.wensberoep_2_kennis_focus || 'Nicht ausgefüllt'}

Wunschberuf 3 – ${wensberoepenData?.wensberoep_3_titel || 'Nicht ausgefüllt'}
1: ${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Nicht ausgefüllt'}
2: ${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Nicht ausgefüllt'}
3: ${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Nicht ausgefüllt'}
4: ${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}
5: ${wensberoepenData?.wensberoep_3_werk_doel || 'Nicht ausgefüllt'}
6: ${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Nicht ausgefüllt'}
7: ${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Nicht ausgefüllt'}
8: ${wensberoepenData?.wensberoep_3_kennis_focus || 'Nicht ausgefüllt'}`
    },
    no: {
      system: `Du er en karriereekspert, spesialisert på å analysere åpne svar fra kandidater. Målet ditt er å generere 48 korte beskrivende setninger (nøyaktig 16 per kategori) basert på reflekterende svar på spørsmål om arbeidserfaring, preferanser og interesser.

VIKTIG: IKKE generer enkeltord. Hvert element må være en kort beskrivende setning på 4-8 ord som beskriver en konkret preferanse eller egenskap.

AVGJØRENDE - OPPLISTINGSSTIL: Elementene skal sammen danne én flytende opplisting i du-form. Kun det FØRSTE elementet per kategori begynner med "Du". Alle påfølgende elementer fortsetter UTEN "Du", slik at de med komma kan leses som én sammenhengende setning.

Output må være et JSON-objekt med tre separate arrays:
• "activiteiten": ting en person liker å gjøre. Første element begynner med "Du", resten uten "Du".
  Korrekt eksempel: ["Du liker å finne kreative løsninger", "trives med å samarbeide i team", "veileder og coacher andre", "holder gjerne presentasjoner for store grupper"]
  FEIL: ["Du liker å finne kreative løsninger", "Du trives med å samarbeide", "Du veileder andre"] — "Du" brukes for ofte!
• "werkomgeving": preferanser for miljø eller samarbeid. Samme regel.
  Eksempel: ["Du jobber helst i en uformell atmosfære", "setter pris på fleksibel arbeidstid", "veksler gjerne mellom kontor og feltarbeid", "søker en rolig arbeidsplass"]
• "interesses": temaer eller områder. Samme regel.
  Eksempel: ["Du er interessert i teknologi og innovasjon", "er fascinert av menneskelig atferd", "har en lidenskap for bærekraft", "er nysgjerrig på kunst og kultur"]

Bruk utelukkende informasjon fra svarene til deltakeren. Formuler alt i deltakerens egen stil. Hvert element MÅ være en kort setning på 4-8 ord, ALDRI et enkeltord.

⚠️ Output må være gyldig JSON. Ingen forklaringer, ingen ekstra tekst, kun JSON-objektet.`,
      user: `Du mottar nå en fullstendig utfylt svarliste fra en bruker. Bruk denne inputen til å generere 48 korte beskrivende setninger (nøyaktig 16 per kategori) basert på metoden til karrieretrakten, fordelt på tre kategorier:
• aktiviteter (hva personen liker å gjøre)
• arbeidsmiljø (stemningen, strukturen og konteksten personen trives i)
• interesser (temaer personen er fascinert av eller får energi av)

VIKTIG - OPPLISTINGSSTIL: Kun det FØRSTE elementet per kategori begynner med "Du". Alle følgende elementer begynner UTEN "Du", slik at de passer som opplisting etter det første elementet.
Korrekt eksempel:
  Element 1: "Du liker å finne kreative løsninger"
  Element 2: "jobber helst i en uformell atmosfære"
  Element 3: "er interessert i teknologi"
FEIL eksempel:
  Element 1: "Du liker å finne kreative løsninger"
  Element 2: "Du jobber helst i en uformell atmosfære"  ← FEIL, "Du" kun ved element 1!

Output skal være i JSON-format, med tre tydelige keys:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Hver liste må inneholde nøyaktig 16 korte setninger. Dette er viktig: ikke mer, ikke mindre enn 16 elementer per kategori. Hvert element må være en beskrivende setning på 4-8 ord.

Input – Brukerens svar:

Barndom og skoletid
1. Hva likte du å gjøre? (på skolen og utenom skolen)
${enthousiasmeData?.kindertijd_activiteiten || 'Ikke utfylt'}
2. Hvor oppholdt du deg ofte? (etter skoletid eller i helgene)
${enthousiasmeData?.kindertijd_plekken || 'Ikke utfylt'}
3. Hva interesserte deg? (tenk på skolefag, hobbyer, temaer på TV eller i bøker)
${enthousiasmeData?.kindertijd_interesses_nieuw || 'Ikke utfylt'}

Din første arbeidserfaring (kan også være en deltidsjobb)
4. Hva likte/liker du best å gjøre?
${enthousiasmeData?.eerste_werk_leukste_taken || 'Ikke utfylt'}
5. Hva likte/liker du ved arbeidsforholdene?
${enthousiasmeData?.eerste_werk_werkomstandigheden || 'Ikke utfylt'}
6. Hvilke temaer jobbet/jobber du gjerne med?
${enthousiasmeData?.eerste_werk_onderwerpen || 'Ikke utfylt'}

Gode perioder
7. Hvilken periode tenker du tilbake på med særlig glede? Hva gjorde du da?
${enthousiasmeData?.plezierige_werkperiode_beschrijving || 'Ikke utfylt'}
8. Kan du nevne en annen god periode eller et prosjekt? Hva var din rolle?
${enthousiasmeData?.leuk_project_en_rol || 'Ikke utfylt'}
9. Når kommer du hjem med et smil? Hva har du da opplevd i løpet av dagen?
${enthousiasmeData?.fluitend_thuiskomen_dag || 'Ikke utfylt'}

Ønskeyrke 1 – ${wensberoepenData?.wensberoep_1_titel || 'Ikke utfylt'}
1. Hva gjør du i løpet av en arbeidsuke?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Ikke utfylt'}
2. Hvor jobber du?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Ikke utfylt'}
3. Jobber du alene eller med andre?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Ikke utfylt'}
4. Hva har du gjort på en dag som får deg til å komme hjem med et smil?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Ikke utfylt'}
5. Hva er målet ditt med denne jobben?
${wensberoepenData?.wensberoep_1_werk_doel || 'Ikke utfylt'}
6. Hvilke deler av jobben liker du best?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Ikke utfylt'}
7. Hva er viktig i denne jobben?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Ikke utfylt'}
8. Hva handler jobben din hovedsakelig om?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Ikke utfylt'}

Ønskeyrke 2 – ${wensberoepenData?.wensberoep_2_titel || 'Ikke utfylt'}
1: ${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Ikke utfylt'}
2: ${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Ikke utfylt'}
3: ${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Ikke utfylt'}
4: ${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Ikke utfylt'}
5: ${wensberoepenData?.wensberoep_2_werk_doel || 'Ikke utfylt'}
6: ${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Ikke utfylt'}
7: ${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Ikke utfylt'}
8: ${wensberoepenData?.wensberoep_2_kennis_focus || 'Ikke utfylt'}

Ønskeyrke 3 – ${wensberoepenData?.wensberoep_3_titel || 'Ikke utfylt'}
1: ${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Ikke utfylt'}
2: ${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Ikke utfylt'}
3: ${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Ikke utfylt'}
4: ${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Ikke utfylt'}
5: ${wensberoepenData?.wensberoep_3_werk_doel || 'Ikke utfylt'}
6: ${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Ikke utfylt'}
7: ${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Ikke utfylt'}
8: ${wensberoepenData?.wensberoep_3_kennis_focus || 'Ikke utfylt'}`
    }
  };

  return prompts[language] || prompts.nl;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, round_id, language = 'nl' } = await req.json();

    console.log('Generating profile keywords for user:', user_id, 'round:', round_id, 'language:', language);

    if (!user_id || !round_id) {
      throw new Error('user_id and round_id are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch enthousiasme responses for this round
    const { data: enthousiasmeData, error: enthousiasmeError } = await supabase
      .from('enthousiasme_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('round_id', round_id)
      .maybeSingle();

    if (enthousiasmeError) {
      console.error('Error fetching enthousiasme responses:', enthousiasmeError);
      throw enthousiasmeError;
    }

    // Fetch wensberoepen responses for this round
    const { data: wensberoepenData, error: wensberoepenError } = await supabase
      .from('wensberoepen_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('round_id', round_id)
      .maybeSingle();

    if (wensberoepenError) {
      console.error('Error fetching wensberoepen responses:', wensberoepenError);
      throw wensberoepenError;
    }

    console.log('Fetched enthousiasme data:', !!enthousiasmeData);
    console.log('Fetched wensberoepen data:', !!wensberoepenData);

    // Get language-specific prompts
    const prompts = getPrompts(language, enthousiasmeData, wensberoepenData);

    // Call Lovable AI Gateway
    console.log('Calling Lovable AI Gateway...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: prompts.system },
          { role: 'user', content: prompts.user }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log('AI response received');

    // Parse the AI response
    const content = aiResult.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('Raw AI content:', content);

    // Extract JSON from the response (handle potential markdown code blocks)
    let keywords;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      keywords = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
      console.error('Content was:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('Parsed keywords:', keywords);

    // Validate the structure
    if (!keywords.activiteiten || !keywords.werkomgeving || !keywords.interesses) {
      throw new Error('Invalid keywords structure');
    }

    // Save keywords to prioriteiten_responses
    const { error: updateError } = await supabase
      .from('prioriteiten_responses')
      .upsert({
        user_id,
        round_id,
        ai_activiteiten_keywords: keywords.activiteiten,
        ai_werkomstandigheden_keywords: keywords.werkomgeving,
        ai_interesses_keywords: keywords.interesses,
      }, {
        onConflict: 'user_id,round_id'
      });

    if (updateError) {
      console.error('Error saving keywords:', updateError);
      throw updateError;
    }

    console.log('Keywords saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      keywords 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-profile-keywords:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
