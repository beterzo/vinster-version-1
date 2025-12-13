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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, round_id, language = 'nl' } = await req.json();

    console.log('🚀 Starting AI career report generation for user:', user_id, 'round:', round_id);

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

    // Parse AI keywords
    const parseKeywords = (jsonString: string | null): string[] => {
      if (!jsonString) return [];
      try {
        return JSON.parse(jsonString);
      } catch {
        return [];
      }
    };

    const aiActiviteiten = parseKeywords(profileData?.ai_lievelings_activiteiten);
    const aiWerkomstandigheden = parseKeywords(profileData?.ai_werkomstandigheden);
    const aiInteresses = parseKeywords(profileData?.ai_interesses);

    // Build comprehensive prompt
    const languageInstructions = {
      nl: 'Schrijf het rapport in het Nederlands.',
      en: 'Write the report in English.',
      de: 'Schreibe den Bericht auf Deutsch.',
      no: 'Skriv rapporten på norsk.'
    };

    const prompt = `Je bent een expert loopbaanadviseur. Analyseer de volgende informatie van een gebruiker en genereer een uitgebreid loopbaanrapport.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.nl}

## GEBRUIKERSINFORMATIE

**Naam:** ${profileData?.first_name || ''} ${profileData?.last_name || ''}

### ENTHOUSIASME SCAN ANTWOORDEN
- Kindertijd activiteiten: ${enthousiasmeData?.kindertijd_activiteiten || 'Niet ingevuld'}
- Kindertijd plekken: ${enthousiasmeData?.kindertijd_plekken || 'Niet ingevuld'}
- Kindertijd interesses: ${enthousiasmeData?.kindertijd_interesses_nieuw || 'Niet ingevuld'}
- Eerste werk leukste taken: ${enthousiasmeData?.eerste_werk_leukste_taken || 'Niet ingevuld'}
- Eerste werk onderwerpen: ${enthousiasmeData?.eerste_werk_onderwerpen || 'Niet ingevuld'}
- Eerste werk omstandigheden: ${enthousiasmeData?.eerste_werk_werkomstandigheden || 'Niet ingevuld'}
- Plezierige werkperiode: ${enthousiasmeData?.plezierige_werkperiode_beschrijving || 'Niet ingevuld'}
- Fluitend thuiskomen dag: ${enthousiasmeData?.fluitend_thuiskomen_dag || 'Niet ingevuld'}
- Leuk project en rol: ${enthousiasmeData?.leuk_project_en_rol || 'Niet ingevuld'}

### AI-GEGENEREERDE KERNWOORDEN
- Favoriete activiteiten: ${aiActiviteiten.join(', ') || 'Geen'}
- Werkomstandigheden: ${aiWerkomstandigheden.join(', ') || 'Geen'}
- Interessegebieden: ${aiInteresses.join(', ') || 'Geen'}

### GESELECTEERDE PRIORITEITEN (door gebruiker benadrukt)
- Geselecteerde activiteiten: ${(prioriteitenData?.selected_activiteiten_keywords || []).join(', ') || 'Geen'}
- Geselecteerde werkomstandigheden: ${(prioriteitenData?.selected_werkomstandigheden_keywords || []).join(', ') || 'Geen'}
- Geselecteerde interesses: ${(prioriteitenData?.selected_interesses_keywords || []).join(', ') || 'Geen'}

### EXTRA TOELICHTING BIJ PRIORITEITEN
- Extra over activiteiten: ${prioriteitenData?.extra_activiteiten_tekst || 'Niet ingevuld'}
- Extra over werkomstandigheden: ${prioriteitenData?.extra_werkomstandigheden_tekst || 'Niet ingevuld'}
- Extra over interesses: ${prioriteitenData?.extra_interesses_tekst || 'Niet ingevuld'}

### WENSBEROEPEN (droomfuncties beschreven door gebruiker)

**Wensberoep 1: ${wensberoepenData?.wensberoep_1_titel || 'Niet ingevuld'}**
- Werkweek activiteiten: ${wensberoepenData?.wensberoep_1_werkweek_activiteiten || 'Niet ingevuld'}
- Werklocatie/omgeving: ${wensberoepenData?.wensberoep_1_werklocatie_omgeving || 'Niet ingevuld'}
- Samenwerking/contacten: ${wensberoepenData?.wensberoep_1_samenwerking_contacten || 'Niet ingevuld'}
- Fluitend thuiskomen: ${wensberoepenData?.wensberoep_1_fluitend_thuiskomen_dag || 'Niet ingevuld'}
- Doel van werk: ${wensberoepenData?.wensberoep_1_werk_doel || 'Niet ingevuld'}
- Leukste onderdelen: ${wensberoepenData?.wensberoep_1_leukste_onderdelen || 'Niet ingevuld'}
- Belangrijke aspecten: ${wensberoepenData?.wensberoep_1_belangrijke_aspecten || 'Niet ingevuld'}
- Kennis focus: ${wensberoepenData?.wensberoep_1_kennis_focus || 'Niet ingevuld'}

**Wensberoep 2: ${wensberoepenData?.wensberoep_2_titel || 'Niet ingevuld'}**
- Werkweek activiteiten: ${wensberoepenData?.wensberoep_2_werkweek_activiteiten || 'Niet ingevuld'}
- Werklocatie/omgeving: ${wensberoepenData?.wensberoep_2_werklocatie_omgeving || 'Niet ingevuld'}
- Samenwerking/contacten: ${wensberoepenData?.wensberoep_2_samenwerking_contacten || 'Niet ingevuld'}
- Fluitend thuiskomen: ${wensberoepenData?.wensberoep_2_fluitend_thuiskomen_dag || 'Niet ingevuld'}
- Doel van werk: ${wensberoepenData?.wensberoep_2_werk_doel || 'Niet ingevuld'}
- Leukste onderdelen: ${wensberoepenData?.wensberoep_2_leukste_onderdelen || 'Niet ingevuld'}
- Belangrijke aspecten: ${wensberoepenData?.wensberoep_2_belangrijke_aspecten || 'Niet ingevuld'}
- Kennis focus: ${wensberoepenData?.wensberoep_2_kennis_focus || 'Niet ingevuld'}

**Wensberoep 3: ${wensberoepenData?.wensberoep_3_titel || 'Niet ingevuld'}**
- Werkweek activiteiten: ${wensberoepenData?.wensberoep_3_werkweek_activiteiten || 'Niet ingevuld'}
- Werklocatie/omgeving: ${wensberoepenData?.wensberoep_3_werklocatie_omgeving || 'Niet ingevuld'}
- Samenwerking/contacten: ${wensberoepenData?.wensberoep_3_samenwerking_contacten || 'Niet ingevuld'}
- Fluitend thuiskomen: ${wensberoepenData?.wensberoep_3_fluitend_thuiskomen_dag || 'Niet ingevuld'}
- Doel van werk: ${wensberoepenData?.wensberoep_3_werk_doel || 'Niet ingevuld'}
- Leukste onderdelen: ${wensberoepenData?.wensberoep_3_leukste_onderdelen || 'Niet ingevuld'}
- Belangrijke aspecten: ${wensberoepenData?.wensberoep_3_belangrijke_aspecten || 'Niet ingevuld'}
- Kennis focus: ${wensberoepenData?.wensberoep_3_kennis_focus || 'Niet ingevuld'}

### EXTRA INFORMATIE
- Opleidingsniveau: ${extraInfoData?.opleidingsniveau || 'Niet ingevuld'}
- Beroepsopleiding/specialisatie: ${extraInfoData?.beroepsopleiding || 'Niet ingevuld'}
- Sector voorkeur: ${extraInfoData?.sector_voorkeur || 'Niet ingevuld'}
- Fysieke beperkingen: ${extraInfoData?.fysieke_beperkingen || 'Geen'}

## INSTRUCTIES

Genereer een loopbaanrapport met de volgende structuur. Geef je antwoord als een JSON object.

1. **Jouw ideale functie-inhoud**: 
   - Stel een lijst samen van 15-25 kernwoorden voor "activiteiten" (wat deze persoon graag doet)
   - Stel een lijst samen van 15-25 kernwoorden voor "werkomgeving" (hoe deze persoon graag werkt)
   - Stel een lijst samen van 10-20 kernwoorden voor "interessegebieden" (waar deze persoon interesse in heeft)

2. **Drie mogelijke beroepen**:
   - Twee "passende" beroepen die goed aansluiten bij het profiel
   - Eén "verrassend" beroep dat misschien onverwacht is maar ook goed zou kunnen passen
   - Voor elk beroep: geef een concrete functietitel en een beschrijving van 2-3 zinnen waarom dit beroep past

Baseer de beroepen op alle verzamelde informatie, met speciale aandacht voor:
- De door de gebruiker geselecteerde prioriteiten (deze zijn extra belangrijk)
- De wensberoepen die ze zelf hebben beschreven
- Het opleidingsniveau en de sectorvoorkeur

Geef alleen het JSON object terug, zonder extra tekst of markdown formatting.`;

    console.log('🤖 Calling Lovable AI Gateway...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "Je bent een expert loopbaanadviseur. Genereer gestructureerde loopbaanrapporten in JSON formaat. Geef alleen valide JSON terug zonder markdown code blocks." 
          },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_career_report",
              description: "Genereer een gestructureerd loopbaanrapport",
              parameters: {
                type: "object",
                properties: {
                  ideale_functie: {
                    type: "object",
                    properties: {
                      activiteiten: {
                        type: "array",
                        items: { type: "string" },
                        description: "15-25 kernwoorden voor favoriete activiteiten"
                      },
                      werkomgeving: {
                        type: "array",
                        items: { type: "string" },
                        description: "15-25 kernwoorden voor ideale werkomgeving"
                      },
                      interessegebieden: {
                        type: "array",
                        items: { type: "string" },
                        description: "10-20 kernwoorden voor interessegebieden"
                      }
                    },
                    required: ["activiteiten", "werkomgeving", "interessegebieden"]
                  },
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
                required: ["ideale_functie", "beroepen"]
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

    // Extract the tool call result
    let reportContent: ReportContent;
    
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const aiContent = JSON.parse(toolCall.function.arguments);
      
      reportContent = {
        voorblad: {
          naam: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim(),
          start_datum: roundData?.started_at ? new Date(roundData.started_at).toLocaleDateString('nl-NL') : new Date().toLocaleDateString('nl-NL'),
          eind_datum: new Date().toLocaleDateString('nl-NL')
        },
        ideale_functie: aiContent.ideale_functie,
        beroepen: aiContent.beroepen
      };
    } else {
      // Fallback: try to parse from message content
      const messageContent = aiResponse.choices?.[0]?.message?.content;
      if (messageContent) {
        const cleanedContent = messageContent.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedContent);
        
        reportContent = {
          voorblad: {
            naam: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim(),
            start_datum: roundData?.started_at ? new Date(roundData.started_at).toLocaleDateString('nl-NL') : new Date().toLocaleDateString('nl-NL'),
            eind_datum: new Date().toLocaleDateString('nl-NL')
          },
          ideale_functie: parsed.ideale_functie,
          beroepen: parsed.beroepen
        };
      } else {
        throw new Error('No valid response from AI');
      }
    }

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
