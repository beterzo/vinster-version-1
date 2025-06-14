
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting AI keywords generation');
    
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('user_id is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching user data for:', user_id);

    // Fetch enthousiasme responses
    const { data: enthousiasmeData, error: enthousiasmeError } = await supabase
      .from('enthousiasme_responses')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (enthousiasmeError) {
      console.error('Error fetching enthousiasme data:', enthousiasmeError);
      throw new Error('Failed to fetch enthousiasme data');
    }

    // Fetch wensberoepen responses
    const { data: wensberoepenData, error: wensberoepenError } = await supabase
      .from('wensberoepen_responses')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (wensberoepenError) {
      console.error('Error fetching wensberoepen data:', wensberoepenError);
      throw new Error('Failed to fetch wensberoepen data');
    }

    console.log('Successfully fetched user interview data');

    // Prepare data for AI analysis
    const analysisData = {
      enthousiasme: enthousiasmeData,
      wensberoepen: wensberoepenData
    };

    // Call OpenAI API
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Calling OpenAI API for keyword generation');

    const prompt = `
Analyseer de volgende interview data van een gebruiker en genereer kernwoorden/kernzinnen voor 3 categorieën. 
Geef alleen de kernwoorden terug, gescheiden door komma's, maximaal 10 woorden per categorie.

INTERVIEW DATA:
${JSON.stringify(analysisData, null, 2)}

Genereer kernwoorden voor:
1. Lievelings Activiteiten (wat de persoon graag doet)
2. Werkomstandigheden (hoe en waar de persoon graag werkt)  
3. Interesses (onderwerpen en gebieden waarin de persoon geïnteresseerd is)

Antwoord in dit exacte JSON formaat:
{
  "lievelings_activiteiten": "kernwoord1, kernwoord2, kernwoord3",
  "werkomstandigheden": "kernwoord1, kernwoord2, kernwoord3", 
  "interesses": "kernwoord1, kernwoord2, kernwoord3"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert in het analyseren van loopbaan interviews en het genereren van relevante kernwoorden. Antwoord altijd in het gevraagde JSON formaat.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;
    
    console.log('OpenAI response:', generatedContent);

    // Parse the AI response
    let keywords;
    try {
      keywords = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    console.log('Parsed keywords:', keywords);

    // Update the profiles table with the generated keywords
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ai_lievelings_activiteiten: keywords.lievelings_activiteiten,
        ai_werkomstandigheden: keywords.werkomstandigheden,
        ai_interesses: keywords.interesses
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('Error updating profiles:', updateError);
      throw new Error('Failed to save keywords to database');
    }

    console.log('Successfully saved AI keywords to database');

    return new Response(JSON.stringify({ 
      success: true, 
      keywords: keywords
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-keywords function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
