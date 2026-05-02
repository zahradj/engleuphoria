/**
 * ai-core: Consolidated AI router function with automatic failover.
 *
 * PRIMARY:  Google AI Studio (Gemini) — direct API
 * BACKUP:   Lovable AI Gateway (Gemini/OpenAI proxy)
 *
 * Routes via `action` field in request body to:
 *   - explain_mistake
 *   - evaluate_speaking (real-world task grading)
 *   - evaluate_speech (audio pronunciation grading)
 *   - speaking_feedback (general speaking practice feedback)
 *   - generate_lesson (lightweight lesson outline generation)
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

// ════════════════════════════════════════════════════════════════════
// AI FAILOVER LAYER
// Primary  → Google AI Studio (Gemini direct)
// Backup   → Lovable AI Gateway
// ════════════════════════════════════════════════════════════════════

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AICallOptions {
  systemPrompt?: string;
  userPrompt: string;
  geminiModel?: string;          // e.g. "gemini-2.5-flash"
  lovableModel?: string;         // e.g. "google/gemini-2.5-flash"
  jsonMode?: boolean;            // request JSON output
  temperature?: number;
}

interface AICallResult {
  text: string;
  provider: 'gemini-direct' | 'lovable-gateway';
}

/**
 * Call Google AI Studio (Gemini) directly.
 * Throws on failure so the failover wrapper can retry with the backup.
 * Implements exponential backoff retry on 429 (rate limit) before giving up.
 */
async function callGeminiDirect(opts: AICallOptions): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    console.error('GEMINI CRASH: GEMINI_API_KEY missing from environment');
    throw new Error('GEMINI_API_KEY not configured');
  }

  const model = opts.geminiModel || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body: any = {
    contents: [{ role: 'user', parts: [{ text: opts.userPrompt }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      ...(opts.jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  };
  if (opts.systemPrompt) {
    body.systemInstruction = { role: 'system', parts: [{ text: opts.systemPrompt }] };
  }

  const doFetch = () => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let geminiRes = await doFetch();

  // Exponential backoff retry on 429 rate-limit (one retry after 2s).
  if (geminiRes.status === 429) {
    console.warn('GEMINI Rate Limited (429). Waiting 2s and retrying once before failover...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    geminiRes = await doFetch();
    if (geminiRes.status === 429) {
      const errText = await geminiRes.text().catch(() => '');
      console.error('GEMINI CRASH:', geminiRes.status, errText);
      const err: any = new Error(`Gemini direct rate-limited after retry (429): ${errText.slice(0, 200)}`);
      err.status = 429;
      throw err;
    }
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text().catch(() => '');
    console.error('GEMINI CRASH:', geminiRes.status, errText);
    const err: any = new Error(`Gemini direct failed (${geminiRes.status}): ${errText.slice(0, 200)}`);
    err.status = geminiRes.status;
    throw err;
  }

  const data = await geminiRes.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join('') || '';
  if (!text) {
    console.error('GEMINI CRASH: empty response payload', JSON.stringify(data).slice(0, 300));
    throw new Error('Gemini direct returned empty response');
  }
  return text;
}

/**
 * Call Lovable AI Gateway (backup).
 */
async function callLovableGateway(opts: AICallOptions): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

  const messages: AIMessage[] = [];
  if (opts.systemPrompt) messages.push({ role: 'system', content: opts.systemPrompt });
  messages.push({ role: 'user', content: opts.userPrompt });

  const body: any = {
    model: opts.lovableModel || 'google/gemini-2.5-flash',
    messages,
  };
  if (opts.jsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('LOVABLE GATEWAY CRASH:', res.status, errText);
    const err: any = new Error(`Lovable gateway failed (${res.status}): ${errText.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || '';
  if (!text) {
    console.error('LOVABLE GATEWAY CRASH: empty response', JSON.stringify(data).slice(0, 300));
    throw new Error('Lovable gateway returned empty response');
  }
  return text;
}

/**
 * The failover wrapper. Try Gemini first, fall back to Lovable Gateway.
 * Used by every text-based action (generate_lesson, explain_mistake, evaluate_speech text portions, etc.)
 */
async function callAIWithFailover(opts: AICallOptions): Promise<AICallResult> {
  try {
    const text = await callGeminiDirect(opts);
    return { text, provider: 'gemini-direct' };
  } catch (primaryError: any) {
    console.warn('⚠️ Primary AI (Gemini) failed → switching to Lovable Gateway. Reason:', primaryError?.status, primaryError?.message || primaryError);
    try {
      const text = await callLovableGateway(opts);
      return { text, provider: 'lovable-gateway' };
    } catch (backupError: any) {
      console.error('❌ Both AI providers failed!', 'gemini=', primaryError?.status, primaryError?.message, '| lovable=', backupError?.status, backupError?.message);
      const err: any = new Error('AI generation temporarily unavailable.');
      err.status = backupError?.status ?? primaryError?.status;
      throw err;
    }
  }
}

// ─── Action: explain_mistake ────────────────────────────────────────
async function handleExplainMistake(body: any) {
  const { lesson_context, question_text, correct_answer, user_answer } = body;
  if (!correct_answer || !user_answer) {
    return jsonResponse({ error: 'correct_answer and user_answer are required' }, 400);
  }

  const systemPrompt = `You are a warm, encouraging ESL tutor. When a student gets an answer wrong, you explain WHY in exactly ONE short sentence (under 30 words). Be specific about the grammar/vocabulary rule. Never be condescending. Use simple language appropriate for language learners.`;
  const userPrompt = `The student answered a question incorrectly.
${lesson_context ? `Lesson context: ${lesson_context}` : ''}
${question_text ? `Question: ${question_text}` : ''}
Correct answer: "${correct_answer}"
Student's answer: "${user_answer}"

Explain in one encouraging sentence why their answer is wrong and what the correct answer is.`;

  try {
    const { text, provider } = await callAIWithFailover({
      systemPrompt,
      userPrompt,
      geminiModel: 'gemini-2.5-flash',
      lovableModel: 'google/gemini-2.5-flash-lite',
      temperature: 0.6,
    });
    return jsonResponse({ explanation: text.trim() || "Keep trying — you're getting closer!", provider });
  } catch (e: any) {
    if (e?.status === 429) return jsonResponse({ error: 'Rate limited — try again shortly.' }, 429);
    if (e?.status === 402) return jsonResponse({ error: 'Credits exhausted.' }, 402);
    return jsonResponse({ error: e?.message || 'AI generation temporarily unavailable.' }, 503);
  }
}

// ─── Action: evaluate_speaking (real-world task) ────────────────────
async function handleEvaluateSpeaking(body: any) {
  const { mission_briefing, student_transcript, success_criteria } = body;
  if (!mission_briefing || !student_transcript) {
    return jsonResponse({ error: 'mission_briefing and student_transcript are required' }, 400);
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

Evaluate this response and return ONLY the JSON object.`;

  let result = { score: 50, feedback: 'Good effort! Keep practicing to improve.' };
  let provider: string = 'unknown';

  try {
    const ai = await callAIWithFailover({
      systemPrompt,
      userPrompt,
      geminiModel: 'gemini-2.5-flash',
      lovableModel: 'google/gemini-2.5-flash',
      jsonMode: true,
      temperature: 0.4,
    });
    provider = ai.provider;

    const cleaned = ai.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
      const parsed = JSON.parse(cleaned);
      result.score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 50)));
      result.feedback = parsed.feedback || result.feedback;
    } catch {
      const m = cleaned.match(/\{[\s\S]*"score"[\s\S]*\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        result.score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 50)));
        result.feedback = parsed.feedback || result.feedback;
      }
    }
  } catch (e: any) {
    if (e?.status === 429) return jsonResponse({ error: 'Rate limit. Try again shortly.' }, 429);
    if (e?.status === 402) return jsonResponse({ error: 'AI credits exhausted.' }, 402);
    return jsonResponse({ error: e?.message || 'AI evaluation failed' }, 503);
  }

  return jsonResponse({ ...result, provider });
}

// ─── Action: evaluate_speech (audio pronunciation) ──────────────────
// Audio analysis: PRIMARY = Gemini direct (generateContent with inlineData),
// BACKUP = Lovable Gateway (chat completions with input_audio).
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

  const tone = hub === 'playground'
    ? 'Use ultra-warm, kid-friendly language with emojis. Celebrate small wins.'
    : hub === 'success'
    ? 'Use a refined, professional, executive-coach tone.'
    : 'Use an encouraging teen-friendly academic tone.';

  const promptText = `You are an expert ESL pronunciation coach grading a student's spoken attempt.

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

  const audioFormat = mimeType.includes('mp3') ? 'mp3' : 'webm';
  let raw = '';
  let provider: 'gemini-direct' | 'lovable-gateway' = 'gemini-direct';

  // ───── PRIMARY: Gemini direct (inline audio) ─────
  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: promptText },
            { inlineData: { mimeType: mimeType.includes('mp3') ? 'audio/mp3' : 'audio/webm', data: audioBase64 } },
          ],
        }],
        generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Gemini direct audio failed (${res.status}): ${t.slice(0, 200)}`);
    }
    const data = await res.json();
    raw = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join('') || '';
    if (!raw) throw new Error('Gemini direct audio returned empty');
  } catch (primaryError) {
    console.warn('⚠️ Primary AI (Gemini) drained for audio. Switching to backup (Lovable Gateway)…', primaryError instanceof Error ? primaryError.message : primaryError);
    // ───── BACKUP: Lovable Gateway (input_audio) ─────
    try {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

      const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'input_audio', input_audio: { data: audioBase64, format: audioFormat } },
            ],
          }],
        }),
      });
      if (!res.ok) {
        if (res.status === 429) return jsonResponse({ error: 'Rate limit exceeded. Please wait a moment.' }, 429);
        if (res.status === 402) return jsonResponse({ error: 'AI credits exhausted.' }, 402);
        const t = await res.text().catch(() => '');
        throw new Error(`Lovable gateway audio failed (${res.status}): ${t.slice(0, 200)}`);
      }
      const data = await res.json();
      raw = data?.choices?.[0]?.message?.content || '';
      provider = 'lovable-gateway';
    } catch (backupError) {
      console.error('❌ Both AI providers failed for audio!', backupError);
      return jsonResponse({ error: 'AI generation temporarily unavailable.' }, 503);
    }
  }

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

  return jsonResponse({ ...result, provider });
}

// ─── Action: speaking_feedback (general practice) ───────────────────
async function handleSpeakingFeedback(body: any) {
  const { text, scenario } = body;
  if (!text) return jsonResponse({ error: 'text is required' }, 400);

  const systemPrompt = `You are an AI English teacher providing feedback on a student's spoken response.

Scenario: ${scenario?.name || 'General practice'}
Level: ${scenario?.cefr_level || 'B1'}

Provide constructive feedback in this exact JSON format:
{
  "pronunciation_score": 0.8, "grammar_score": 0.8, "fluency_score": 0.8,
  "rating": 4, "encouragement": "Encouraging message",
  "grammar_suggestions": ["suggestion1", "suggestion2"]
}

Scores should be between 0.0 and 1.0. Rating should be 1-5 stars. Be positive and constructive.`;

  let feedback;
  let provider = 'unknown';
  try {
    const ai = await callAIWithFailover({
      systemPrompt,
      userPrompt: `Student said: "${text}"\n\nReturn ONLY the JSON object.`,
      geminiModel: 'gemini-2.5-flash',
      lovableModel: 'google/gemini-2.5-flash-lite',
      jsonMode: true,
      temperature: 0.4,
    });
    provider = ai.provider;
    const cleaned = ai.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
      feedback = JSON.parse(cleaned);
    } catch {
      feedback = {
        pronunciation_score: 0.8, grammar_score: 0.8, fluency_score: 0.8,
        rating: 4, encouragement: 'Great job practicing! Keep it up!', grammar_suggestions: [],
      };
    }
  } catch (e: any) {
    feedback = {
      pronunciation_score: 0.8, grammar_score: 0.8, fluency_score: 0.8,
      rating: 4, encouragement: 'Good effort! Keep practicing!', grammar_suggestions: [],
    };
  }

  return jsonResponse({ feedback, provider });
}

// ─── Action: generate_lesson (lightweight outline) ──────────────────
async function handleGenerateLesson(body: any) {
  const { topic, level = 'B1', objectives = [], duration_minutes = 30 } = body;
  if (!topic) return jsonResponse({ error: 'topic is required' }, 400);

  const systemPrompt = `You are a senior ESL curriculum designer. Produce a concise, classroom-ready lesson outline. Be specific, professional, and aligned with CEFR level ${level}.`;
  const userPrompt = `Create a ${duration_minutes}-minute lesson outline on the topic: "${topic}".
${objectives.length ? `Objectives:\n- ${objectives.join('\n- ')}` : ''}

Return ONLY JSON in this exact shape:
{
  "title": "<lesson title>",
  "level": "${level}",
  "objectives": ["<objective 1>", "<objective 2>", "<objective 3>"],
  "warm_up": "<2-3 sentence warm-up>",
  "key_vocabulary": ["<word 1>", "<word 2>", "<word 3>", "<word 4>", "<word 5>"],
  "stages": [
    { "name": "Discovery", "minutes": 5, "activity": "<activity>" },
    { "name": "Modeling", "minutes": 5, "activity": "<activity>" },
    { "name": "Guided Practice", "minutes": 8, "activity": "<activity>" },
    { "name": "Independent Practice", "minutes": 7, "activity": "<activity>" },
    { "name": "Wrap-Up", "minutes": 5, "activity": "<activity>" }
  ],
  "assessment": "<short final check>"
}`;

  try {
    const ai = await callAIWithFailover({
      systemPrompt,
      userPrompt,
      geminiModel: 'gemini-2.5-flash',
      lovableModel: 'google/gemini-2.5-flash',
      jsonMode: true,
      temperature: 0.7,
    });
    const cleaned = ai.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let lesson: any;
    try {
      lesson = JSON.parse(cleaned);
    } catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      lesson = m ? JSON.parse(m[0]) : null;
    }
    if (!lesson) return jsonResponse({ error: 'AI returned an unparseable lesson.' }, 502);
    return jsonResponse({ lesson, provider: ai.provider });
  } catch (e: any) {
    if (e?.status === 429) return jsonResponse({ error: 'Rate limited — try again shortly.' }, 429);
    if (e?.status === 402) return jsonResponse({ error: 'Credits exhausted.' }, 402);
    return jsonResponse({ error: e?.message || 'AI generation temporarily unavailable.' }, 503);
  }
}

// ─── Action: generate_trial_lesson (30-min trial, 6-8 slides) ───────
async function handleGenerateTrialLesson(body: any) {
  const { demographic = 'teens', cefr_level = 'B1', theme } = body;
  if (!theme) return jsonResponse({ error: 'theme is required' }, 400);

  const tone = demographic === 'kids'
    ? 'kid-friendly with playful emojis and very short sentences'
    : demographic === 'adults'
    ? 'refined, professional, executive-coach tone'
    : 'energetic teen-friendly academic tone';

  const systemPrompt = `You are designing a 30-minute Trial English Lesson. It must be highly engaging and shorter than standard lessons.
Limit the output to exactly 6 to 8 slides max.
Slide 1: Icebreaker/Hook. Slide 2-3: Quick Vocabulary Win. Slide 4-5: Interactive Speaking/Roleplay. Slide 6: Wrap-up and Celebration.
Tone: ${tone} based on demographic.
Align language and complexity strictly to CEFR ${cefr_level}.
You MUST return ONLY valid JSON. No markdown, no commentary.`;

  const userPrompt = `Theme: "${theme}"
Demographic: ${demographic}
CEFR: ${cefr_level}

Return ONLY this JSON shape:
{
  "lesson_title": "<short, catchy title>",
  "target_goal": "<1-sentence goal>",
  "target_vocabulary": ["<word1>", "<word2>", "<word3>", "<word4>", "<word5>"],
  "slides": [
    {
      "phase": "warm-up" | "presentation" | "practice" | "production" | "review",
      "slide_type": "text_image" | "multiple_choice" | "flashcard" | "drag_and_match" | "drag_and_drop" | "fill_in_the_gaps" | "mascot_speech",
      "title": "<slide title>",
      "content": "<student-facing text>",
      "teacher_script": "<what the teacher says aloud>",
      "visual_keyword": "<2-3 words for an illustration>",
      "image_generation_prompt": "<detailed prompt for an image generator>",
      "interactive_data": null
    }
  ]
}

Rules:
- Exactly 6 to 8 slides total.
- Slide 1 = Hook (warm-up). Slides 2-3 = Vocabulary (presentation, with flashcard or text_image). Slides 4-5 = Speaking/Roleplay (production, with mascot_speech or multiple_choice). Last slide = Wrap-up/Celebration (review).
- For multiple_choice slides, set interactive_data = { "question": "...", "options": ["A","B","C","D"], "correct_index": 0 }.
- For flashcard slides, set interactive_data = { "front": "...", "back": "..." }.
- For drag_and_match (two-column matcher: left ↔ right), set interactive_data = { "instruction": "...", "pairs": [{ "left_item": "...", "right_item": "..." }] }.
- For drag_and_drop (sorting/categorization: drop items into category zones), set interactive_data = { "instruction": "Drag each item into the correct category.", "pairs": [{ "draggable": "Apple", "target_zone": "Fruit" }, { "draggable": "Carrot", "target_zone": "Vegetable" }] }. Use 2-3 distinct target_zones and 4-6 draggable items total. Prefer drag_and_drop for vocabulary categorization (animals vs objects, fruits vs vegetables, verbs vs nouns, etc.) and drag_and_match for 1-to-1 pairing (word ↔ definition, English ↔ translation).
- For fill_in_the_gaps, set interactive_data = { "instruction": "...", "sentence_parts": ["before _ ", " after"], "missing_word": "...", "distractors": ["...","..."] }.
`;

  try {
    const ai = await callAIWithFailover({
      systemPrompt,
      userPrompt,
      geminiModel: 'gemini-2.5-flash',
      lovableModel: 'google/gemini-2.5-flash',
      jsonMode: true,
      temperature: 0.75,
    });
    const cleaned = ai.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let lesson: any;
    try { lesson = JSON.parse(cleaned); }
    catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      lesson = m ? JSON.parse(m[0]) : null;
    }
    if (!lesson || !Array.isArray(lesson.slides)) {
      return jsonResponse({ error: 'AI returned an unparseable trial lesson.' }, 502);
    }
    // Enforce 6-8 slides
    if (lesson.slides.length > 8) lesson.slides = lesson.slides.slice(0, 8);
    return jsonResponse({ lesson, provider: ai.provider });
  } catch (e: any) {
    if (e?.status === 429) return jsonResponse({ error: 'Rate limited — try again shortly.' }, 429);
    if (e?.status === 402) return jsonResponse({ error: 'Credits exhausted.' }, 402);
    return jsonResponse({ error: e?.message || 'AI generation temporarily unavailable.' }, 503);
  }
}

// ─── Action: generate_story (graded reader + comprehension) ─────────
async function handleGenerateStory(body: any) {
  const { cefr_level = 'B1', genre = 'Everyday Life', target_vocabulary = [] } = body;
  if (!Array.isArray(target_vocabulary) || target_vocabulary.length < 3) {
    return jsonResponse({ error: 'target_vocabulary must be an array of at least 3 words' }, 400);
  }

  const systemPrompt = `Write a highly engaging story strictly aligned with the requested CEFR Level. You MUST naturally include the provided Target Vocabulary Words.
Break the story into 4 to 5 pages (slides).
For each page, generate an image_prompt that we can later use to generate illustrations.
Add 2 Reading Comprehension multiple-choice questions at the very end of the story.
You MUST return ONLY valid JSON. No markdown, no commentary.`;

  const userPrompt = `Genre: "${genre}"
CEFR Level: ${cefr_level}
Target Vocabulary (must appear naturally in the story): ${target_vocabulary.map((w: string) => `"${w}"`).join(', ')}

Return ONLY this JSON shape:
{
  "title": "<engaging title>",
  "slides": [
    { "page_number": 1, "narrative": "<2-4 sentences appropriate for ${cefr_level}>", "image_prompt": "<detailed visual scene>" }
  ],
  "comprehension": [
    { "question": "<question about the story>", "options": ["A","B","C","D"], "correct_index": 0 },
    { "question": "<another question>", "options": ["A","B","C","D"], "correct_index": 2 }
  ]
}

Rules:
- 4 or 5 narrative pages.
- Exactly 2 comprehension questions, each with 4 options.
- Use every target vocabulary word at least once across the story.
- Keep grammar and sentence length faithful to ${cefr_level}.`;

  try {
    const ai = await callAIWithFailover({
      systemPrompt,
      userPrompt,
      geminiModel: 'gemini-2.5-flash',
      lovableModel: 'google/gemini-2.5-flash',
      jsonMode: true,
      temperature: 0.85,
    });
    const cleaned = ai.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let story: any;
    try { story = JSON.parse(cleaned); }
    catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      story = m ? JSON.parse(m[0]) : null;
    }
    if (!story || !Array.isArray(story.slides)) {
      return jsonResponse({ error: 'AI returned an unparseable story.' }, 502);
    }
    return jsonResponse({ story, provider: ai.provider });
  } catch (e: any) {
    if (e?.status === 429) return jsonResponse({ error: 'Rate limited — try again shortly.' }, 429);
    if (e?.status === 402) return jsonResponse({ error: 'Credits exhausted.' }, 402);
    return jsonResponse({ error: e?.message || 'AI generation temporarily unavailable.' }, 503);
  }
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
      case 'generate_lesson':
        return await handleGenerateLesson(body);
      case 'generate_trial_lesson':
        return await handleGenerateTrialLesson(body);
      case 'generate_story':
        return await handleGenerateStory(body);
      default:
        return jsonResponse({
          error: `Unknown action: "${action}". Valid: explain_mistake, evaluate_speaking, evaluate_speech, speaking_feedback, generate_lesson, generate_trial_lesson, generate_story`,
        }, 400);
    }
  } catch (error) {
    console.error('ai-core error:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Internal server error' }, 500);
  }
});
