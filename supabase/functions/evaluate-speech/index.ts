// Sentence-level speech grading using Gemini multimodal audio.
// Input: base64 audio (webm/mp3) + targetSentence + optional context.
// Output: scores for accuracy, fluency, pronunciation, plus per-word feedback.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EvaluationResult {
  overallScore: number;        // 0-100
  accuracyScore: number;       // word match
  fluencyScore: number;        // pacing / hesitations
  pronunciationScore: number;  // clarity
  transcript: string;
  wordBreakdown: Array<{
    word: string;
    spoken: string;
    correct: boolean;
    issue?: string;
  }>;
  feedback: string;
  tier: 'gold' | 'soft' | 'revert';  // >=85 / 50-84 / <50
  encouragement: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = userData.user.id;

    const { audioBase64, mimeType = 'audio/webm', targetSentence, hub = 'academy', context } = await req.json();

    if (!audioBase64 || !targetSentence) {
      return new Response(JSON.stringify({ error: 'audioBase64 and targetSentence are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Cost Control: Voice Energy Gate ───
    // Atomically deduct 1 voice energy. If empty, block with friendly message.
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
            return new Response(
              JSON.stringify({
                error: 'INSUFFICIENT_VOICE_ENERGY',
                message: 'You are out of Voice Energy. Wait for refill or upgrade your plan.',
                remaining: row.remaining ?? 0,
              }),
              { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
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
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              {
                type: 'input_audio',
                input_audio: {
                  data: audioBase64,
                  format: mimeType.includes('mp3') ? 'mp3' : 'webm',
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini audio error:', err);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Gemini error: ${err}`);
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content || '';
    raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let result: EvaluationResult;
    try {
      result = JSON.parse(raw);
    } catch {
      console.error('Parse failed, raw:', raw);
      result = {
        overallScore: 50, accuracyScore: 50, fluencyScore: 50, pronunciationScore: 50,
        transcript: '', wordBreakdown: [],
        feedback: 'Let\'s try that again together.',
        tier: 'soft', encouragement: 'Great effort! Try once more.',
      };
    }

    // Self-heal tier from score
    if (result.overallScore >= 85) result.tier = 'gold';
    else if (result.overallScore >= 50) result.tier = 'soft';
    else result.tier = 'revert';

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('evaluate-speech error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
