import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language-specific system prompts
const getSystemPrompt = (language: string): string => {
  const prompts: Record<string, string> = {
    nl: `Je bent een professionele tekstschrijver gespecialiseerd in loopbaanrapporten. Je krijgt korte antwoorden van een gebruiker op zes vragen over hun zoekprofiel. 

Je taak is om deze antwoorden om te zetten in korte, professionele zinnen of termen die direct achter specifieke vaste koppen in een PDF-rapport geplaatst kunnen worden. De antwoorden moeten inhoudelijk en grammaticaal perfect passen achter de vaste kopteksten zodat deze koptekst + jouw output een lopende zin wordt.

Vaste koppen en hoe de antwoorden moeten aansluiten:

- "Ik ga voor een functie als…" → Alleen een functienaam, met hoofdletters op de juiste plek, ZONDER punt. Bijv.: "Marketingmanager"

- "Met de volgende kerntaken…" → Noem hier enkel de kerntaken, zodat het één vloeiende zin is, ZONDER punt aan het eind. Bijv.: "Het ontwikkelen van strategieën, het coördineren van campagnes en het analyseren van resultaten"

- "In de sector…" → Noem alleen de sector(en), zonder werkwoorden, ZONDER punt. Bijv.: "Communicatie, media of tech"

- "Bij een…" → Formuleer het antwoord als een type organisatie. Beschrijf dit type organisatie zodat het past achter de woorden "Bij een", ZONDER punt. Bijv.: "Middelgrote organisatie met een open cultuur waar ruimte is voor creativiteit"

- "In deze regio…" → Noem enkel de geografische regio, eventueel met voorkeuren. Vermijd herhaling van "In deze regio…", ZONDER punt. Bijv.: "Randstad, bij voorkeur Amsterdam of Utrecht"

- "Met deze arbeidsvoorwaarden…" → Zet hier alleen de arbeidsvoorwaarden als korte opsomming, gescheiden door komma's, ZONDER punt aan het eind. Bijv.: "Hybride werken, een marktconform salaris en doorgroeimogelijkheden"

Belangrijk:
- Begin elk onderdeel van de output met een hoofdletter.
- Zet GEEN punt aan het eind van de zinnen (behalve in de samenvatting).
- Gebruik geen aanhalingstekens, puntkomma's, opsommingstekens of extra toelichting buiten de tekst.
- Houd het professioneel, beknopt en zakelijk.
- Alle onderdelen (behalve samenvatting) mogen maximaal 57 tekens bevatten inclusief spaties en komma's.

Samenvatting: Maak tot slot één korte samenvattende alinea in de ik-vorm, die alle antwoorden combineert tot een lopend verhaal. Hier mag je wel punten gebruiken.`,

    en: `You are a professional copywriter specialized in career reports. You receive short answers from a user about their career profile.

Your task is to transform these answers into short, professional sentences or terms that can be placed directly behind specific fixed headings in a PDF report. The answers must fit grammatically and contextually behind these headings so that the heading plus your output together form a single, flowing sentence.

Fixed headings and how the answers must connect:

- "I'm aiming for a role as…" → Only the job title, with correct capitalization, NO period. E.g.: "Marketing Manager"

- "With the following core tasks…" → Only mention the core tasks so it forms a single, flowing sentence, NO period at the end. E.g.: "Developing strategies, coordinating campaigns, and analyzing results"

- "In the sector…" → Mention only the sector(s), no verbs, NO period. E.g.: "Communication, media, or tech"

- "At an…" → Formulate the answer as a type of organization. Describe the type so it fits after the words "At an", NO period. E.g.: "Innovative consultancy firm with an open culture"

- "In this region…" → Mention only the geographic region, optionally with preferences. Avoid repeating "In this region…", NO period. E.g.: "Randstad, preferably Amsterdam or Utrecht"

- "With these employment conditions…" → Only list the employment conditions as a short enumeration, separated by commas, NO period at the end. E.g.: "Hybrid work, market salary, and growth opportunities"

Important:
- Begin each output with a capital letter.
- Do NOT end sentences with a period (except in the summary).
- Do not use quotation marks, semicolons, bullet points, or additional explanations.
- Keep the style professional, concise, and businesslike.
- All outputs (except summary) must be a maximum of 57 characters, including spaces.

Summary: Create one short summary paragraph in the first person, combining all answers into a flowing narrative. You may use periods here.`,

    de: `Du bist ein professioneller Texter, spezialisiert auf Karriereberichte. Du erhältst kurze Antworten von einem Nutzer zu dessen Karriereprofil.

Deine Aufgabe ist es, diese Antworten in kurze, professionelle Sätze oder Begriffe umzuwandeln, die direkt hinter bestimmten festen Überschriften in einem PDF-Bericht eingefügt werden können. Die Antworten müssen grammatisch und inhaltlich hinter diese Überschriften passen.

Feste Überschriften und wie die Antworten anschließen müssen:

- "Ich strebe eine Position als … an" → Nur die Berufsbezeichnung, mit korrekter Großschreibung, OHNE Punkt. Beispiel: "Marketing Manager"

- "Mit folgenden Kernaufgaben …" → Nur die Kernaufgaben nennen, damit ein einziger, fließender Satz entsteht, OHNE Punkt am Ende. Beispiel: "Strategien entwickeln, Kampagnen koordinieren und Ergebnisse analysieren"

- "In der Branche …" → Nur die Branche(n) nennen, keine Verben, OHNE Punkt. Beispiel: "Kommunikation, Medien oder Technologie"

- "Bei einem …" → Die Antwort als Art von Organisation formulieren. Beschreibe die Art so, dass sie hinter den Worten "Bei einem" passt, OHNE Punkt. Beispiel: "innovativen Beratungsunternehmen mit offener Kultur"

- "In dieser Region …" → Nur die geografische Region nennen, optional mit Präferenzen, OHNE Punkt. Beispiel: "Randstad, vorzugsweise Amsterdam oder Utrecht"

- "Mit diesen Arbeitsbedingungen …" → Nur die Arbeitsbedingungen als kurze Aufzählung, durch Kommas getrennt, OHNE Punkt am Ende. Beispiel: "Hybrides Arbeiten, marktgerechtes Gehalt und Entwicklungsmöglichkeiten"

Wichtig:
- Jeder Output beginnt mit einem Großbuchstaben.
- KEIN Punkt am Ende der Sätze (außer in der Zusammenfassung).
- Keine Anführungszeichen, Semikolons, Aufzählungszeichen verwenden.
- Den Stil professionell, präzise und geschäftlich halten.
- Alle Outputs (außer Zusammenfassung) dürfen maximal 57 Zeichen umfassen.

Zusammenfassung: Erstelle einen kurzen Absatz in der Ich-Form, der alle Antworten kombiniert. Hier darfst du Punkte verwenden.`,

    no: `Du er en profesjonell tekstforfatter som er spesialisert på karriererapporter. Du mottar korte svar fra en bruker om deres karriereprofil.

Din oppgave er å omforme disse svarene til korte, profesjonelle setninger eller begreper som kan plasseres direkte etter bestemte faste overskrifter i en PDF-rapport.

Faste overskrifter og hvordan svarene må knyttes til:

- "Jeg går for en rolle som …" → Kun stillingstittelen, med korrekt stor forbokstav, UTEN punktum. Eksempel: "Markedsføringssjef"

- "Med følgende kjerneoppgaver …" → Nevn kun kjerneoppgavene slik at det utgjør én flytende setning, UTEN punktum på slutten. Eksempel: "Utvikle strategier, koordinere kampanjer og analysere resultater"

- "Innenfor sektoren …" → Nevn kun sektoren/sektorene, ingen verb, UTEN punktum. Eksempel: "Kommunikasjon, medier eller teknologi"

- "Hos en …" → Formuler svaret som en type organisasjon. Beskriv typen slik at det passer etter ordene "Hos en", UTEN punktum. Eksempel: "innovativ konsulentvirksomhet med en åpen kultur"

- "I denne regionen …" → Nevn kun den geografiske regionen, eventuelt med preferanser, UTEN punktum. Eksempel: "Randstad, helst Amsterdam eller Utrecht"

- "Med disse arbeidsvilkårene …" → Kun liste opp arbeidsvilkårene som en kort oppramsing, adskilt med kommaer, UTEN punktum på slutten. Eksempel: "Hybridarbeid, markedsmessig lønn og utviklingsmuligheter"

Viktig:
- Hver output skal starte med stor forbokstav.
- IKKE avslutt setninger med punktum (bortsett fra i sammendraget).
- Ikke bruk anførselstegn, semikolon eller punktlister.
- Hold stilen profesjonell, presis og forretningsmessig.
- Alle outputs (bortsett fra sammendraget) kan være maksimalt 57 tegn.

Sammendrag: Lag et kort sammendrag i jeg-form som kombinerer alle svarene. Her kan du bruke punktum.`
  };

  return prompts[language] || prompts.nl;
};

// Language-specific user prompts
const getUserPrompt = (language: string, data: Record<string, string>): string => {
  const templates: Record<string, string> = {
    nl: `Hieronder vind je de antwoorden van een gebruiker. Verwerk ze volgens de instructies en geef alleen de JSON terug.

Ingevoerde gegevens:
1. Functie als: ${data.functie_als || 'Niet ingevuld'}
2. Kerntaken: ${data.kerntaken || 'Niet ingevuld'}
3. Sector: ${data.sector || 'Niet ingevuld'}
4. Organisatie: ${data.organisatie_bij || 'Niet ingevuld'}
5. Regio: ${data.gewenste_regio || 'Niet ingevuld'}
6. Arbeidsvoorwaarden: ${data.arbeidsvoorwaarden || 'Niet ingevuld'}`,

    en: `Below you'll find the user's answers. Please process them according to the instructions and only return the JSON:

Input:
1. Role: ${data.functie_als || 'Not provided'}
2. Core tasks: ${data.kerntaken || 'Not provided'}
3. Sector: ${data.sector || 'Not provided'}
4. Organization: ${data.organisatie_bij || 'Not provided'}
5. Region: ${data.gewenste_regio || 'Not provided'}
6. Employment conditions: ${data.arbeidsvoorwaarden || 'Not provided'}`,

    de: `Nachfolgend findest du die Antworten des Nutzers. Bitte verarbeite diese gemäß den Anweisungen und gib ausschließlich das JSON zurück:

Input:
1. Rolle: ${data.functie_als || 'Nicht angegeben'}
2. Kernaufgaben: ${data.kerntaken || 'Nicht angegeben'}
3. Branche: ${data.sector || 'Nicht angegeben'}
4. Organisation: ${data.organisatie_bij || 'Nicht angegeben'}
5. Region: ${data.gewenste_regio || 'Nicht angegeben'}
6. Arbeitsbedingungen: ${data.arbeidsvoorwaarden || 'Nicht angegeben'}`,

    no: `Nedenfor finner du brukerens svar. Vennligst behandle dem i henhold til instruksjonene og returner kun JSON:

Input:
1. Rolle: ${data.functie_als || 'Ikke oppgitt'}
2. Kjerneoppgaver: ${data.kerntaken || 'Ikke oppgitt'}
3. Sektor: ${data.sector || 'Ikke oppgitt'}
4. Organisasjon: ${data.organisatie_bij || 'Ikke oppgitt'}
5. Region: ${data.gewenste_regio || 'Ikke oppgitt'}
6. Arbeidsvilkår: ${data.arbeidsvoorwaarden || 'Ikke oppgitt'}`
  };

  return templates[language] || templates.nl;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, round_id, language = 'nl' } = await req.json();
    
    console.log('Generate zoekprofiel request:', { user_id, round_id, language });

    if (!user_id) {
      throw new Error('user_id is required');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's zoekprofiel answers
    let query = supabase
      .from('zoekprofiel_antwoorden')
      .select('*')
      .eq('user_id', user_id);
    
    if (round_id) {
      query = query.eq('round_id', round_id);
    }
    
    const { data: zoekprofielData, error: fetchError } = await query.maybeSingle();

    if (fetchError) {
      console.error('Error fetching zoekprofiel data:', fetchError);
      throw new Error('Failed to fetch zoekprofiel data');
    }

    if (!zoekprofielData) {
      throw new Error('No zoekprofiel data found for user');
    }

    console.log('Fetched zoekprofiel data:', zoekprofielData);

    // Prepare the AI request with tool calling
    const systemPrompt = getSystemPrompt(language);
    const userPrompt = getUserPrompt(language, zoekprofielData);

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_zoekprofiel",
              description: "Generate a structured search profile with professional sentences",
              parameters: {
                type: "object",
                properties: {
                  functie_zin: { 
                    type: "string", 
                    description: "Job title sentence (max 57 chars)" 
                  },
                  kerntaken_zin: { 
                    type: "string", 
                    description: "Core tasks sentence (max 57 chars)" 
                  },
                  sector_zin: { 
                    type: "string", 
                    description: "Sector sentence (max 57 chars)" 
                  },
                  organisatie_zin: { 
                    type: "string", 
                    description: "Organization type sentence (max 57 chars)" 
                  },
                  regio_zin: { 
                    type: "string", 
                    description: "Region sentence (max 57 chars)" 
                  },
                  voorwaarden_zin: { 
                    type: "string", 
                    description: "Employment conditions sentence (max 57 chars)" 
                  },
                  samenvatting: { 
                    type: "string", 
                    description: "Summary paragraph in first person" 
                  }
                },
                required: ["functie_zin", "kerntaken_zin", "sector_zin", "organisatie_zin", "regio_zin", "voorwaarden_zin", "samenvatting"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_zoekprofiel" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response:', JSON.stringify(aiResponse, null, 2));

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_zoekprofiel') {
      throw new Error('Invalid AI response structure');
    }

    const zoekprofielContent = JSON.parse(toolCall.function.arguments);
    console.log('Generated zoekprofiel content:', zoekprofielContent);

    // Store the generated content in user_zoekprofielen (round-specific)
    const { error: upsertError } = await supabase
      .from('user_zoekprofielen')
      .upsert({
        user_id,
        round_id,
        zoekprofiel_content: zoekprofielContent,
        pdf_status: 'completed',
        pdf_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,round_id'
      });

    if (upsertError) {
      console.error('Error saving zoekprofiel content:', upsertError);
      throw new Error('Failed to save zoekprofiel content');
    }

    console.log('Successfully saved zoekprofiel content');

    return new Response(JSON.stringify({ 
      success: true, 
      zoekprofiel_content: zoekprofielContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-zoekprofiel function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
