
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
    const { text, scenario } = await req.json();

    if (!openAIApiKey) {
      // Return basic feedback if no API key
      return new Response(JSON.stringify({
        feedback: {
          pronunciation_score: 0.8,
          grammar_score: 0.8,
          fluency_score: 0.8,
          rating: 4,
          encouragement: "Good effort! Keep practicing!",
          grammar_suggestions: []
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating feedback for text:', text);

    const systemPrompt = `You are an AI English teacher providing feedback on a student's spoken response.

Scenario: ${scenario.name}
Level: ${scenario.cefr_level}
Student said: "${text}"

Provide constructive feedback in this exact JSON format:
{
  "pronunciation_score": 0.8,
  "grammar_score": 0.8,
  "fluency_score": 0.8,
  "rating": 4,
  "encouragement": "Encouraging message",
  "grammar_suggestions": ["suggestion1", "suggestion2"]
}

Scores should be between 0.0 and 1.0. Rating should be 1-5 stars. Be positive and constructive.`;

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
          { role: 'user', content: text }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate feedback');
    }

    let feedbackText = data.choices[0].message.content;
    
    // Try to parse JSON response
    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch (parseError) {
      console.warn('Failed to parse AI feedback as JSON, using default');
      feedback = {
        pronunciation_score: 0.8,
        grammar_score: 0.8,
        fluency_score: 0.8,
        rating: 4,
        encouragement: "Great job practicing! Keep it up!",
        grammar_suggestions: []
      };
    }

    console.log('Feedback generated:', feedback);

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-feedback function:', error);
    return new Response(JSON.stringify({ 
      feedback: {
        pronunciation_score: 0.8,
        grammar_score: 0.8,
        fluency_score: 0.8,
        rating: 4,
        encouragement: "Good effort! Keep practicing!",
        grammar_suggestions: []
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
