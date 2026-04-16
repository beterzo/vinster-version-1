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
      system: `Je bent een loopbaanprofessional gespecialiseerd in het analyseren van open antwoorden van kandidaten. Je doel is om 48 kernwoorden of korte zinnen te genereren (exact 16 per categorie) op basis van reflectieve antwoorden op vragen over werkervaring, voorkeuren en interesses.

De output moet een JSON-object zijn, met drie aparte arrays:

- "activiteiten": dingen die iemand graag doet, verwoord als werkwoorden of korte zinnen.
- "werkomgeving": voorkeuren voor omgeving of samenwerking.
- "interesses": thema's of onderwerpen waar iemand in geïnteresseerd is.

Gebruik uitsluitend informatie uit de antwoorden van de deelnemer. Formuleer alles in de stijl van de deelnemer. Je mag ook korte zinnen gebruiken als dat beter past dan één woord.

⚠️ De output moet geldig JSON zijn. Geen toelichting, geen extra uitleg, alleen het JSON-object.`,
      user: `Je ontvangt nu een volledig ingevulde antwoordenlijst van een gebruiker. Gebruik deze input om op basis van de methodiek van de loopbaantrechter 48 kernwoorden of korte zinnen te genereren (exact 16 per categorie), verdeeld over drie categorieën:
• activiteiten (wat iemand graag doet)
• werkomgeving (de sfeer, structuur en context waarin iemand graag werkt)
• interesses (onderwerpen waar iemand door gefascineerd is of energie van krijgt)

De output moet in JSON-format zijn, met drie duidelijke keys:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Laat elke lijst exact 16 items bevatten. Dit is belangrijk: niet meer, niet minder dan 16 items per categorie. Je mag zelfstandige naamwoorden, werkwoorden of korte zinnen gebruiken. Kwalitatieve bijvoeglijke naamwoorden zijn ook toegestaan als die iets toevoegen aan het karakter of de stijl van de persoon.

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

Beschrijving 1:
1. Waar werk je en hoe ziet jouw werkomgeving eruit?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Niet ingevuld'}
2. Wat doe je allemaal op een gewone werkdag in dit werk?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Niet ingevuld'}
3. Met wie heb je tijdens dit werk vooral te maken?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Niet ingevuld'}
4. Wanneer heb je echt plezier in je werk? Wat ben je dan aan het doen?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Niet ingevuld'}
5. Wat vind jij belangrijk in dit werk qua arbeidsvoorwaarden?
${wensberoepenData?.wensberoep_1_werk_doel || 'Niet ingevuld'}
6. Waar moet je iets van weten of interesse in hebben om dit werk goed te doen?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Niet ingevuld'}
7. Hoeveel vrijheid heb je in dit werk om zelf te bepalen wat je doet en hoe je het doet?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Niet ingevuld'}
8. Waar draag jij met jouw werk aan bij, en waarom vind je dat belangrijk?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Niet ingevuld'}

Beschrijving 2:
1. Beschrijf de plek of plekken waar je werkt.
${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Niet ingevuld'}
2. Wat zijn jouw belangrijkste taken?
${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Niet ingevuld'}
3. Wat werkt voor jou het fijnst? Meedenken, zelf uitvoeren, anderen aansturen of nog iets anders?
${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Niet ingevuld'}
4. Wanneer voelt dit werk voor jou zinvol of de moeite waard?
${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Niet ingevuld'}
5. Wie kom je tegen in dit werk en wat doe je samen?
${wensberoepenData?.wensberoep_2_werk_doel || 'Niet ingevuld'}
6. Op welke momenten denk je: dit is leuk werk! Wat ben je dan aan het doen?
${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Niet ingevuld'}
7. Wat biedt dit werk jou zodat je het makkelijk volhoudt en er blij van wordt?
${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Niet ingevuld'}
8. Waar gaat het werk inhoudelijk over? Wat moet je interessant vinden als je dit werk doet?
${wensberoepenData?.wensberoep_2_kennis_focus || 'Niet ingevuld'}

Beschrijving 3:
1. Waarom past deze werkomgeving bij je?
${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Niet ingevuld'}
2. Waar besteed je het grootste deel van je tijd aan?
${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Niet ingevuld'}
3. Voor wie of wat doe jij dit werk uiteindelijk, en wat wil je daarmee bereiken?
${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Niet ingevuld'}
4. Met wat voor mensen werk je samen en wat is jouw rol daarin?
${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Niet ingevuld'}
5. Welke onderdelen van het werk geven jou de meeste energie?
${wensberoepenData?.wensberoep_3_werk_doel || 'Niet ingevuld'}
6. Welke arbeidsvoorwaarden of omstandigheden zijn voor jou echt belangrijk?
${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Niet ingevuld'}
7. Hoe zelfstandig werk je in dit beroep? Wat vind jij het prettigst?
${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Niet ingevuld'}
8. Waar moet je nieuwsgierig naar zijn of meer over willen leren in dit werk?
${wensberoepenData?.wensberoep_3_kennis_focus || 'Niet ingevuld'}`
    },
    en: {
      system: `You are a career professional specialized in analyzing open-ended responses from candidates. Your goal is to generate 48 English keywords or short phrases (exactly 16 per category) based on reflective answers to questions about work experience, preferences, and interests.

The output must be a JSON object, with three separate arrays:
• "activiteiten": things someone enjoys doing, phrased as verbs or short sentences.
• "werkomgeving": preferences for environment or collaboration.
• "interesses": themes or topics someone is interested in.

Use only information from the participant's answers. Formulate everything in the participant's own style. You may also use short sentences if that fits better than a single word.

⚠️ The output must be valid JSON. No explanation, no additional text, only the JSON object.`,
      user: `You are now receiving a fully completed list of answers from a user. Use this input to generate 48 keywords or short phrases (exactly 16 per category) based on the method of the career funnel, divided into three categories:
• activities (what someone enjoys doing)
• work environment (the atmosphere, structure, and context in which someone prefers to work)
• interests (topics that fascinate or energize someone)

The output must be in JSON format, with three clear keys:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Each list must contain exactly 16 items. This is important: not more, not less than 16 items per category. You may use nouns, verbs, or short phrases. Descriptive adjectives are also allowed if they add something to the character or style of the person.

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

Description 1:
1. Where do you work and what does your work environment look like?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Not filled in'}
2. What do you do on a typical working day in this job?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Not filled in'}
3. Who do you mainly deal with in this work?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Not filled in'}
4. When do you truly enjoy your work? What are you doing at those moments?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Not filled in'}
5. What do you find important regarding employment conditions?
${wensberoepenData?.wensberoep_1_werk_doel || 'Not filled in'}
6. What do you need to know about or be interested in to do this work well?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Not filled in'}
7. How much freedom do you have to decide what you do and how you do it?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Not filled in'}
8. What do you contribute to with your work, and why do you find that important?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Not filled in'}

Description 2:
1. Describe the place or places where you work.
${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Not filled in'}
2. What are your most important tasks?
${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Not filled in'}
3. What works best for you? Thinking along, executing yourself, managing others, or something else?
${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Not filled in'}
4. When does this work feel meaningful or worthwhile to you?
${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Not filled in'}
5. Who do you encounter in this work and what do you do together?
${wensberoepenData?.wensberoep_2_werk_doel || 'Not filled in'}
6. At what moments do you think: this is great work! What are you doing then?
${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Not filled in'}
7. What does this work offer you so that you can sustain it easily and feel happy?
${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Not filled in'}
8. What is the work about content-wise? What should you find interesting?
${wensberoepenData?.wensberoep_2_kennis_focus || 'Not filled in'}

Description 3:
1. Why does this work environment suit you?
${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Not filled in'}
2. What do you spend most of your time on?
${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Not filled in'}
3. Who or what do you ultimately do this work for, and what do you want to achieve?
${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Not filled in'}
4. What kind of people do you work with and what is your role?
${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Not filled in'}
5. Which parts of the work give you the most energy?
${wensberoepenData?.wensberoep_3_werk_doel || 'Not filled in'}
6. Which employment conditions or circumstances are really important to you?
${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Not filled in'}
7. How independently do you work in this profession? What do you find most comfortable?
${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Not filled in'}
8. What should you be curious about or want to learn more about in this work?
${wensberoepenData?.wensberoep_3_kennis_focus || 'Not filled in'}`
    },
    de: {
      system: `Du bist ein Karriere-Profi, spezialisiert auf die Analyse von offenen Antworten von Kandidaten. Dein Ziel ist es, basierend auf reflektierten Antworten zu Fragen über Berufserfahrungen, Vorlieben und Interessen, 48 Schlüsselwörter oder kurze Sätze zu generieren (genau 16 pro Kategorie).

Die Ausgabe muss ein JSON-Objekt sein, mit drei separaten Arrays:
• "activiteiten": Dinge, die jemand gerne tut, formuliert als Verben oder kurze Sätze.
• "werkomgeving": Präferenzen bezüglich Umgebung oder Zusammenarbeit.
• "interesses": Themen oder Bereiche, für die sich jemand interessiert.

Verwende ausschließlich Informationen aus den Antworten des Teilnehmers. Formuliere alles im Stil des Teilnehmers. Du darfst auch kurze Sätze verwenden, wenn diese besser passen als ein einzelnes Wort.

⚠️ Die Ausgabe muss gültiges JSON sein. Keine Erläuterungen, keine zusätzlichen Erklärungen, nur das JSON-Objekt.`,
      user: `Du erhältst nun eine vollständig ausgefüllte Antwortliste von einer Nutzerin oder einem Nutzer. Verwende diese Eingaben, um auf Grundlage der Methodik des Berufstrichters 48 Schlüsselwörter oder kurze Aussagen zu generieren (genau 16 pro Kategorie), aufgeteilt in drei Kategorien:
• Aktivitäten (was jemand gerne tut)
• Arbeitsumgebung (die Atmosphäre, Struktur und der Kontext, in dem jemand gerne arbeitet)
• Interessen (Themen, die jemanden faszinieren oder ihm/ihr Energie geben)

Das Ergebnis muss im JSON-Format sein, mit drei klaren Schlüsseln:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Jede Liste muss genau 16 Einträge enthalten. Dies ist wichtig: nicht mehr, nicht weniger als 16 Einträge pro Kategorie. Du kannst Substantive, Verben oder kurze Aussagen verwenden. Qualitative Adjektive sind ebenfalls erlaubt, wenn sie etwas über den Charakter oder Stil der Person aussagen.

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

Beschreibung 1:
1. Wo arbeiten Sie und wie sieht Ihre Arbeitsumgebung aus?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Nicht ausgefüllt'}
2. Was machen Sie alles an einem normalen Arbeitstag?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Nicht ausgefüllt'}
3. Mit wem haben Sie hauptsächlich zu tun?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Nicht ausgefüllt'}
4. Wann haben Sie wirklich Spaß an Ihrer Arbeit? Was tun Sie dann?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}
5. Was ist Ihnen bezüglich der Arbeitsbedingungen wichtig?
${wensberoepenData?.wensberoep_1_werk_doel || 'Nicht ausgefüllt'}
6. Wovon müssen Sie etwas wissen oder wofür müssen Sie sich interessieren?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Nicht ausgefüllt'}
7. Wie viel Freiheit haben Sie, selbst zu bestimmen was und wie Sie arbeiten?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Nicht ausgefüllt'}
8. Wozu tragen Sie mit Ihrer Arbeit bei, und warum finden Sie das wichtig?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Nicht ausgefüllt'}

Beschreibung 2:
1. Beschreiben Sie den Ort oder die Orte, an denen Sie arbeiten.
${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Nicht ausgefüllt'}
2. Was sind Ihre wichtigsten Aufgaben?
${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Nicht ausgefüllt'}
3. Was funktioniert für Sie am besten? Mitdenken, selbst ausführen, andere anleiten?
${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Nicht ausgefüllt'}
4. Wann fühlt sich diese Arbeit sinnvoll oder lohnenswert an?
${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}
5. Wen treffen Sie in dieser Arbeit und was machen Sie zusammen?
${wensberoepenData?.wensberoep_2_werk_doel || 'Nicht ausgefüllt'}
6. In welchen Momenten denken Sie: Das ist tolle Arbeit! Was tun Sie dann?
${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Nicht ausgefüllt'}
7. Was bietet Ihnen diese Arbeit, damit Sie sie leicht durchhalten?
${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Nicht ausgefüllt'}
8. Worum geht es inhaltlich? Was sollten Sie interessant finden?
${wensberoepenData?.wensberoep_2_kennis_focus || 'Nicht ausgefüllt'}

Beschreibung 3:
1. Warum passt diese Arbeitsumgebung zu Ihnen?
${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Nicht ausgefüllt'}
2. Womit verbringen Sie den größten Teil Ihrer Zeit?
${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Nicht ausgefüllt'}
3. Für wen oder was machen Sie diese Arbeit und was möchten Sie erreichen?
${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Nicht ausgefüllt'}
4. Mit was für Menschen arbeiten Sie zusammen und was ist Ihre Rolle?
${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Nicht ausgefüllt'}
5. Welche Teile der Arbeit geben Ihnen die meiste Energie?
${wensberoepenData?.wensberoep_3_werk_doel || 'Nicht ausgefüllt'}
6. Welche Arbeitsbedingungen sind für Sie wirklich wichtig?
${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Nicht ausgefüllt'}
7. Wie selbstständig arbeiten Sie? Was finden Sie am angenehmsten?
${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Nicht ausgefüllt'}
8. Wofür sollten Sie neugierig sein oder mehr darüber lernen wollen?
${wensberoepenData?.wensberoep_3_kennis_focus || 'Nicht ausgefüllt'}`
    },
    no: {
      system: `Du er en karriereekspert, spesialisert på å analysere åpne svar fra kandidater. Målet ditt er å generere 48 nøkkelord eller korte setninger (nøyaktig 16 per kategori) basert på reflekterende svar på spørsmål om arbeidserfaring, preferanser og interesser.

Output må være et JSON-objekt med tre separate arrays:
• "activiteiten": ting en person liker å gjøre, formulert som verb eller korte setninger.
• "werkomgeving": preferanser for miljø eller samarbeid.
• "interesses": temaer eller områder en person er interessert i.

Bruk utelukkende informasjon fra svarene til deltakeren. Formuler alt i deltakerens egen stil. Du kan også bruke korte setninger hvis det passer bedre enn enkeltord.

⚠️ Output må være gyldig JSON. Ingen forklaringer, ingen ekstra tekst, kun JSON-objektet.`,
      user: `Du mottar nå en fullstendig utfylt svarliste fra en bruker. Bruk denne inputen til å generere 48 nøkkelord eller korte fraser (nøyaktig 16 per kategori) basert på metoden til karrieretrakten, fordelt på tre kategorier:
• aktiviteter (hva personen liker å gjøre)
• arbeidsmiljø (stemningen, strukturen og konteksten personen trives i)
• interesser (temaer personen er fascinert av eller får energi av)

Output skal være i JSON-format, med tre tydelige keys:
{
  "activiteiten": [],
  "werkomgeving": [],
  "interesses": []
}
Hver liste må inneholde nøyaktig 16 elementer. Dette er viktig: ikke mer, ikke mindre enn 16 elementer per kategori. Du kan bruke substantiv, verb eller korte fraser. Kvalitative adjektiver er også tillatt dersom de tilfører noe til personens stil eller karakter.

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

Beskrivelse 1:
1. Hvor jobber du og hvordan ser arbeidsmiljøet ditt ut?
${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Ikke utfylt'}
2. Hva gjør du på en vanlig arbeidsdag?
${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Ikke utfylt'}
3. Hvem har du mest å gjøre med i dette arbeidet?
${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Ikke utfylt'}
4. Når har du virkelig glede av jobben din? Hva gjør du da?
${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Ikke utfylt'}
5. Hva synes du er viktig når det gjelder arbeidsvilkår?
${wensberoepenData?.wensberoep_1_werk_doel || 'Ikke utfylt'}
6. Hva må du vite noe om eller være interessert i for å gjøre denne jobben godt?
${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Ikke utfylt'}
7. Hvor mye frihet har du til å bestemme hva og hvordan du jobber?
${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Ikke utfylt'}
8. Hva bidrar du til med arbeidet ditt, og hvorfor synes du det er viktig?
${wensberoepenData?.wensberoep_1_kennis_focus || 'Ikke utfylt'}

Beskrivelse 2:
1. Beskriv stedet eller stedene der du jobber.
${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Ikke utfylt'}
2. Hva er dine viktigste oppgaver?
${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Ikke utfylt'}
3. Hva fungerer best for deg? Tenke med, utføre selv, lede andre?
${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Ikke utfylt'}
4. Når føles dette arbeidet meningsfullt eller verdt innsatsen?
${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Ikke utfylt'}
5. Hvem møter du i dette arbeidet og hva gjør dere sammen?
${wensberoepenData?.wensberoep_2_werk_doel || 'Ikke utfylt'}
6. I hvilke øyeblikk tenker du: dette er flott arbeid! Hva gjør du da?
${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Ikke utfylt'}
7. Hva gir denne jobben deg slik at du lett holder ut?
${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Ikke utfylt'}
8. Hva handler arbeidet om innholdsmessig? Hva bør du synes er interessant?
${wensberoepenData?.wensberoep_2_kennis_focus || 'Ikke utfylt'}

Beskrivelse 3:
1. Hvorfor passer dette arbeidsmiljøet for deg?
${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Ikke utfylt'}
2. Hva bruker du mesteparten av tiden din på?
${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Ikke utfylt'}
3. For hvem eller hva gjør du dette arbeidet og hva vil du oppnå?
${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Ikke utfylt'}
4. Hva slags mennesker jobber du med og hva er din rolle?
${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Ikke utfylt'}
5. Hvilke deler av arbeidet gir deg mest energi?
${wensberoepenData?.wensberoep_3_werk_doel || 'Ikke utfylt'}
6. Hvilke arbeidsvilkår er virkelig viktige for deg?
${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Ikke utfylt'}
7. Hvor selvstendig jobber du? Hva synes du er mest behagelig?
${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Ikke utfylt'}
8. Hva bør du være nysgjerrig på eller ønske å lære mer om?
${wensberoepenData?.wensberoep_3_kennis_focus || 'Ikke utfylt'}`
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
