import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mission_briefing, student_transcript, success_criteria } = await req.json();

    if (!mission_briefing || !student_transcript) {
      return new Response(
        JSON.stringify({ error: 'mission_briefing and student_transcript are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const criteriaText = Array.isArray(success_criteria) && success_criteria.length > 0
      ? `\nSuccess Criteria the student should have addressed:\n${success_criteria.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}`
      : '';

    const systemPrompt = `You are an expert English language evaluator for an online learning platform.
You will evaluate a student's spoken or written response to a real-world task.

INSTRUCTIONS:
- Evaluate the response on a scale of 0 to 100 based on: grammar accuracy (30%), vocabulary richness (25%), task completion (30%), and coherence (15%).
- Provide exactly 2 sentences of constructive, encouraging feedback.
- Return ONLY valid JSON with this exact structure: {"score": <number>, "feedback": "<string>"}
- Be encouraging but honest. If the response is very short or off-topic, score accordingly.`;

    const userPrompt = `Mission Briefing: "${mission_briefing}"
${criteriaText}

Student's Response: "${student_transcript}"

Evaluate this response and return JSON with score (0-100) and feedback (2 sentences).`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'evaluate_response',
            description: 'Return the evaluation score and feedback',
            parameters: {
              type: 'object',
              properties: {
                score: { type: 'number', description: 'Score from 0-100' },
                feedback: { type: 'string', description: 'Two sentences of constructive feedback' },
              },
              required: ['score', 'feedback'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'evaluate_response' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limited. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      throw new Error('AI evaluation failed');
    }

    const aiData = await response.json();
    let result = { score: 50, feedback: 'Good effort! Keep practicing to improve.' };

    try {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        result.score = Math.max(0, Math.min(100, Math.round(parsed.score || 50)));
        result.feedback = parsed.feedback || result.feedback;
      }
    } catch {
      // Try parsing from content as fallback
      try {
        const content = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*"score"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          result.score = Math.max(0, Math.min(100, Math.round(parsed.score || 50)));
          result.feedback = parsed.feedback || result.feedback;
        }
      } catch { /* use default */ }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('evaluate-speaking error:', e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
