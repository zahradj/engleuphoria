
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, scenario } = await req.json();
    
    if (!text || !scenario) {
      throw new Error('Text and scenario are required');
    }

    console.log('Generating feedback for text:', text);

    const systemPrompt = `You are an English language assessment expert. Analyze the student's speech and provide constructive feedback.

STUDENT LEVEL: ${scenario.cefr_level}
SCENARIO: ${scenario.name}

Analyze this student response: "${text}"

Provide feedback as JSON with this exact structure:
{
  "pronunciation_score": 0.85,
  "grammar_score": 0.90,
  "fluency_score": 0.75,
  "rating": 4,
  "encouragement": "Great job! Your pronunciation is improving!",
  "grammar_suggestions": ["Consider using 'the' before 'restaurant'"],
  "alternative_phrases": ["You could also say: 'I would like to order...'"],
  "specific_tips": ["Practice the 'th' sound in 'the'"]
}

Be encouraging and constructive. Scores should be between 0-1. Rating should be 1-5 stars.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    let feedback;
    
    try {
      feedback = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      feedback = {
        pronunciation_score: 0.8,
        grammar_score: 0.8,
        fluency_score: 0.8,
        rating: 4,
        encouragement: "Good effort! Keep practicing!",
        grammar_suggestions: [],
        alternative_phrases: [],
        specific_tips: []
      };
    }

    console.log('Feedback generated successfully');

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI feedback error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
