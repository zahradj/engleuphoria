/**
 * ai-core: Consolidated AI router function.
 * Routes via `action` field in request body to:
 *   - explain_mistake
 *   - evaluate_speaking (real-world task grading)
 *   - evaluate_speech (audio pronunciation grading)
 *   - speaking_feedback (general speaking practice feedback)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ─── Action: explain_mistake ────────────────────────────────────────
async function handleExplainMistake(body: any) {
  const { lesson_context, question_text, correct_answer, user_answer } = body;
  if (!correct_answer || !user_answer) {
    return jsonResponse({ error: 'correct_answer and user_answer are required' }, 400);
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

  const systemPrompt = `You are a warm, encouraging ESL tutor. When a student gets an answer wrong, you explain WHY in exactly ONE short sentence (under 30 words). Be specific about the grammar/vocabulary rule. Never be condescending. Use simple language appropriate for language learners.`;
  const userPrompt = `The student answered a question incorrectly.
${lesson_context ? `Lesson context: ${lesson_context}` : ''}
${question_text ? `Question: ${question_text}` : ''}
Correct answer: "${correct_answer}"
Student's answer: "${user_answer}"

Explain in one encouraging sentence why their answer is wrong and what the correct answer is.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-lite',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) return jsonResponse({ error: 'Rate limited — try again shortly.' }, 429);
    if (response.status === 402) return jsonResponse({ error: 'Credits exhausted.' }, 402);
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  const explanation = data.choices?.[0]?.message?.content?.trim() || "Keep trying — you're getting closer!";
  return jsonResponse({ explanation });
}

// ─── Action: evaluate_speaking (real-world task) ────────────────────
async function handleEvaluateSpeaking(body: any) {
  const { mission_briefing, student_transcript, success_criteria } = body;
  if (!mission_briefing || !student_transcript) {
    return jsonResponse({ error: 'mission_briefing and student_transcript are required' }, 400);
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

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
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
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
    if (response.status === 429) return jsonResponse({ error: 'Rate limited. Please try again in a moment.' }, 429);
    if (response.status === 402) return jsonResponse({ error: 'AI credits exhausted. Please add funds.' }, 402);
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

  return jsonResponse(result);
}

// ─── Action: evaluate_speech (audio pronunciation) ──────────────────
async function handleEvaluateSpeech(body: any, authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: userData, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !userData?.user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const userId = userData.user.id;
  const { audioBase64, mimeType = 'audio/webm', targetSentence, hub = 'academy', context } = body;

  if (!audioBase64 || !targetSentence) {
    return jsonResponse({ error: 'audioBase64 and targetSentence are required' }, 400);
  }

  // Voice Energy Gate
  try {
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (SERVICE_KEY) {
      const credResp = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/consume_voice_energy`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_user_id: userId }),
      });
      if (credResp.ok) {
        const rows = await credResp.json();
        const row = Array.isArray(rows) ? rows[0] : rows;
        if (row && row.success === false) {
          return jsonResponse({
            error: 'INSUFFICIENT_VOICE_ENERGY',
            message: 'You are out of Voice Energy. Wait for refill or upgrade your plan.',
            remaining: row.remaining ?? 0,
          }, 402);
        }
      }
    }
  } catch (e) {
    console.warn('[voice-energy] gate error (allowing through)', e);
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

  const tone = hub === 'playground'
    ? 'Use ultra-warm, kid-friendly language with emojis. Celebrate small wins.'
    : hub === 'success'
    ? 'Use a refined, professional, executive-coach tone.'
    : 'Use an encouraging teen-friendly academic tone.';

  const systemPrompt = `You are an expert ESL pronunciation coach grading a student's spoken attempt.

TARGET SENTENCE: "${targetSentence}"
${context ? `CONTEXT: ${context}` : ''}
TONE: ${tone}

Listen to the audio and evaluate:
1. accuracyScore (0-100): How closely the spoken words match the target.
2. fluencyScore (0-100): Pacing, smoothness, lack of awkward hesitations.
3. pronunciationScore (0-100): Phonetic clarity of each word.
4. overallScore (0-100): Weighted average (accuracy 40%, pronunciation 40%, fluency 20%).

TIER RULES:
- >= 85 → "gold" (celebration)
- 50-84 → "soft" (gentle correction)
- < 50 → "revert" (replay model and re-prime)

Return ONLY this JSON, no markdown:
{
  "overallScore": <number>,
  "accuracyScore": <number>,
  "fluencyScore": <number>,
  "pronunciationScore": <number>,
  "transcript": "<exact words you heard>",
  "wordBreakdown": [
    { "word": "<target word>", "spoken": "<heard>", "correct": <bool>, "issue": "<short note or null>" }
  ],
  "feedback": "<one sentence specific tip>",
  "tier": "gold" | "soft" | "revert",
  "encouragement": "<one short warm sentence>"
}`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: systemPrompt },
          { type: 'input_audio', input_audio: { data: audioBase64, format: mimeType.includes('mp3') ? 'mp3' : 'webm' } },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini audio error:', err);
    if (response.status === 429) return jsonResponse({ error: 'Rate limit exceeded. Please wait a moment.' }, 429);
    if (response.status === 402) return jsonResponse({ error: 'AI credits exhausted.' }, 402);
    throw new Error(`Gemini error: ${err}`);
  }

  const data = await response.json();
  let raw = data.choices?.[0]?.message?.content || '';
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let result: any;
  try {
    result = JSON.parse(raw);
  } catch {
    console.error('Parse failed, raw:', raw);
    result = {
      overallScore: 50, accuracyScore: 50, fluencyScore: 50, pronunciationScore: 50,
      transcript: '', wordBreakdown: [],
      feedback: "Let's try that again together.",
      tier: 'soft', encouragement: 'Great effort! Try once more.',
    };
  }

  // Self-heal tier from score
  if (result.overallScore >= 85) result.tier = 'gold';
  else if (result.overallScore >= 50) result.tier = 'soft';
  else result.tier = 'revert';

  return jsonResponse(result);
}

// ─── Action: speaking_feedback (general practice) ───────────────────
async function handleSpeakingFeedback(body: any) {
  const { text, scenario } = body;
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openAIApiKey && !LOVABLE_API_KEY) {
    return jsonResponse({
      feedback: {
        pronunciation_score: 0.8, grammar_score: 0.8, fluency_score: 0.8,
        rating: 4, encouragement: 'Good effort! Keep practicing!', grammar_suggestions: [],
      },
    });
  }

  const systemPrompt = `You are an AI English teacher providing feedback on a student's spoken response.

Scenario: ${scenario?.name || 'General practice'}
Level: ${scenario?.cefr_level || 'B1'}
Student said: "${text}"

Provide constructive feedback in this exact JSON format:
{
  "pronunciation_score": 0.8, "grammar_score": 0.8, "fluency_score": 0.8,
  "rating": 4, "encouragement": "Encouraging message",
  "grammar_suggestions": ["suggestion1", "suggestion2"]
}

Scores should be between 0.0 and 1.0. Rating should be 1-5 stars. Be positive and constructive.`;

  let feedbackText: string;
  if (LOVABLE_API_KEY) {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
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
          { role: 'user', content: text },
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
      pronunciation_score: 0.8, grammar_score: 0.8, fluency_score: 0.8,
      rating: 4, encouragement: 'Great job practicing! Keep it up!', grammar_suggestions: [],
    };
  }

  return jsonResponse({ feedback });
}

// ─── Main Router ────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action || '';

    switch (action) {
      case 'explain_mistake':
        return await handleExplainMistake(body);
      case 'evaluate_speaking':
        return await handleEvaluateSpeaking(body);
      case 'evaluate_speech':
        return await handleEvaluateSpeech(body, req.headers.get('Authorization'));
      case 'speaking_feedback':
        return await handleSpeakingFeedback(body);
      default:
        return jsonResponse({ error: `Unknown action: "${action}". Valid: explain_mistake, evaluate_speaking, evaluate_speech, speaking_feedback` }, 400);
    }
  } catch (error) {
    console.error('ai-core error:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Internal server error' }, 500);
  }
});
