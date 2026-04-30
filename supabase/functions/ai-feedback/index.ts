
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function handleExplainMistake(body: any) {
  const { lesson_context, question_text, correct_answer, user_answer } = body;
  if (!correct_answer || !user_answer) {
    return new Response(
      JSON.stringify({ error: "correct_answer and user_answer are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const systemPrompt = `You are a warm, encouraging ESL tutor. When a student gets an answer wrong, you explain WHY in exactly ONE short sentence (under 30 words). Be specific about the grammar/vocabulary rule. Never be condescending. Use simple language appropriate for language learners.`;
  const userPrompt = `The student answered a question incorrectly.
${lesson_context ? `Lesson context: ${lesson_context}` : ""}
${question_text ? `Question: ${question_text}` : ""}
Correct answer: "${correct_answer}"
Student's answer: "${user_answer}"

Explain in one encouraging sentence why their answer is wrong and what the correct answer is.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited — try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (status === 402) {
      return new Response(JSON.stringify({ error: "Credits exhausted." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    throw new Error(`AI gateway error: ${status}`);
  }

  const data = await response.json();
  const explanation = data.choices?.[0]?.message?.content?.trim() || "Keep trying — you're getting closer!";

  return new Response(JSON.stringify({ explanation }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Route: explain-mistake action
    if (body.action === 'explain_mistake') {
      return await handleExplainMistake(body);
    }

    // Default: speaking feedback
    const { text, scenario } = body;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!openAIApiKey && !LOVABLE_API_KEY) {
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

Scenario: ${scenario?.name || 'General practice'}
Level: ${scenario?.cefr_level || 'B1'}
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

    // Prefer Lovable AI Gateway, fall back to OpenAI
    let feedbackText: string;
    if (LOVABLE_API_KEY) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
        }),
      });
      if (!response.ok) throw new Error(`AI gateway error: ${response.status}`);
      const data = await response.json();
      feedbackText = data.choices?.[0]?.message?.content || '';
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
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
      if (!response.ok) throw new Error(data.error?.message || 'Failed to generate feedback');
      feedbackText = data.choices[0].message.content;
    }

    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch {
      feedback = {
        pronunciation_score: 0.8,
        grammar_score: 0.8,
        fluency_score: 0.8,
        rating: 4,
        encouragement: "Great job practicing! Keep it up!",
        grammar_suggestions: []
      };
    }

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
