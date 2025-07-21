
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLanguage, context } = await req.json();

    if (!texts || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: texts and targetLanguage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const languageMap = {
      'es': 'Spanish',
      'ar': 'Arabic',
      'fr': 'French'
    };

    const targetLangName = languageMap[targetLanguage] || targetLanguage;

    const systemPrompt = `You are a professional translator specializing in educational content for English as a Second Language (ESL) platforms. 

Context: This is content for "Engleuphoria", an interactive English learning platform for children and students.

Guidelines:
- Translate to ${targetLangName} while maintaining educational context
- Keep technical terms and proper nouns when appropriate
- Maintain the tone suitable for children and educational environments
- For UI elements, use common conventions in the target language
- For Arabic, ensure proper RTL text handling
- Preserve any placeholder syntax like {} for string interpolation
- Keep educational terminology accurate and age-appropriate

Return ONLY a JSON object with the translated texts in the same structure as the input.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Translate this content to ${targetLangName}. Context: ${context || 'Educational platform'}. Input: ${JSON.stringify(texts)}` 
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedContent = data.choices[0].message.content;

    let translations;
    try {
      translations = JSON.parse(translatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', translatedContent);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-translate function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
