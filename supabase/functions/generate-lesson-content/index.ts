// Generate lesson content via Google AI Studio (Gemini API)
// - Pedagogical Routing: injects framework based on CEFR level
// - Google Search Grounding: real-world examples & up-to-date usage
// - Returns: strict JSON (slides[] or blueprint object) + methodology metadata

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = 'gemini-2.5-flash';

const BASE_SYSTEM = `You are a world-class ESL Curriculum Architect and Game Designer. Your goal is to create highly engaging, visually stunning, and gamified English lessons.

RULE 1 - NO REPETITION: Never use boring textbook tropes (e.g., "John goes to the supermarket"). Create highly imaginative, slightly wacky, or deeply engaging scenarios (e.g., "A time-traveling chef trying to find a missing recipe", or "A teenage detective in a cyberpunk city").

RULE 2 - GAMIFICATION FIRST: Maximize interactivity. Do not just output text to read. Structure the lesson using interactive slide types: multiple_choice, drag_and_drop, sentence_builder, error_detection, and interactive_story.

RULE 3 - VISUAL APPEAL: For every single slide, generate a highly descriptive image_prompt field. Specify a vibrant art style (e.g., "3D Pixar style, vibrant colors, dynamic lighting" or "Studio Ghibli aesthetic"). The frontend will use this to generate the slide background.

RULE 4 - VISUAL GRAMMAR: When teaching grammar, always use our custom syntax tags so the frontend can color-code the UI (e.g., <verb>jumped</verb>, <noun>dragon</noun>, <adjective>brave</adjective>, <target>highlight</target>).`;

// ---------------------------------------------------------------------------
// Pedagogical Framework Routing — based on CEFR level
// ---------------------------------------------------------------------------

type MethodologyKey = 'TPR' | 'CLT' | 'TBLT';

interface Methodology {
  key: MethodologyKey;
  label: string;
  emoji: string;
  instruction: string;
}

const METHODOLOGIES: Record<MethodologyKey, Methodology> = {
  TPR: {
    key: 'TPR',
    label: 'Total Physical Response',
    emoji: '🧒',
    instruction:
      "Apply Total Physical Response (TPR) principles. Keep sentences under 6 words. Use repetitive, high-frequency sight words. Focus heavily on visual matching and auditory phonics games. Include physical-action prompts (clap, jump, point) and big, joyful visuals. Avoid abstract grammar explanations.",
  },
  CLT: {
    key: 'CLT',
    label: 'Communicative Language Teaching',
    emoji: '🗣️',
    instruction:
      "Apply Communicative Language Teaching (CLT). Focus on functional language (ordering food, asking directions, making plans). Include interactive dialogue roleplays, gamified error detection, and short real-life conversations. Prioritise meaning over form, and always anchor grammar inside a communicative task.",
  },
  TBLT: {
    key: 'TBLT',
    label: 'Task-Based Language Teaching',
    emoji: '🧠',
    instruction:
      "Apply Task-Based Language Teaching (TBLT) and the Harvard Business Case Study method. Use complex, multi-paragraph reading scenarios requiring critical thinking, negotiation, and advanced idiom usage. Build tasks around authentic professional outputs (briefs, proposals, debate prep) and require nuanced lexical choice.",
  },
};

function methodologyForLevel(rawLevel?: string): Methodology {
  const lvl = String(rawLevel || '').trim().toUpperCase().replace(/\s+/g, '');
  // Accept Pre-A1, A1, A2, B1, B2, C1, C2, plus combos like "A2/B1"
  if (lvl.includes('PRE-A1') || lvl === 'PREA1' || lvl === 'A0') return METHODOLOGIES.TPR;
  if (lvl.startsWith('A1')) return METHODOLOGIES.TPR;
  if (lvl.startsWith('A2') || lvl.startsWith('B1')) return METHODOLOGIES.CLT;
  if (lvl.startsWith('B2') || lvl.startsWith('C1') || lvl.startsWith('C2')) return METHODOLOGIES.TBLT;
  // Combos — use the higher band
  if (lvl.includes('B2') || lvl.includes('C1') || lvl.includes('C2')) return METHODOLOGIES.TBLT;
  if (lvl.includes('A2') || lvl.includes('B1')) return METHODOLOGIES.CLT;
  if (lvl.includes('A1')) return METHODOLOGIES.TPR;
  return METHODOLOGIES.CLT; // safe default
}

const PROMPT_VARIANTS: Record<string, string> = {
  story:
    'Produce an interactive_story arc of 8-12 slides. Each slide must include: id, type, title, narrative (with grammar tags), image_prompt, and—where applicable—an interactive activity (multiple_choice with options[], drag_and_drop with items/targets, sentence_builder with tokens[], or error_detection with sentence + wrongIndex).',
  grammar_practice:
    'Produce 8-15 array-based practice slides focused on a single grammar target. Allowed slide types: multiple_choice, error_detection, sentence_builder, fill_blank. Each slide MUST include items[] (array of practice items) instead of a single sentence. Always tag the grammar target using <target>...</target>.',
  blueprint:
    'Produce a Lesson Blueprint object: { topic, cefr_level, objectives[], vocabulary[], grammar_focus, warmup_prompt, suggested_slide_sequence[] (each {id,type,intent}) }. No slides[].',
  lesson:
    'Produce a complete 6-slide GRR lesson arc: warm_up, prime, mimic, practice, produce, cool_off. Each slide includes type, title, content/items[], image_prompt.',
};

const RESPONSE_SCHEMA: Record<string, unknown> = {
  type: 'OBJECT',
  properties: {
    slides: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          type: { type: 'STRING' },
          title: { type: 'STRING' },
          narrative: { type: 'STRING' },
          image_prompt: { type: 'STRING' },
          items: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                sentence: { type: 'STRING' },
                wrongIndex: { type: 'INTEGER' },
                correct: { type: 'STRING' },
                options: { type: 'ARRAY', items: { type: 'STRING' } },
                tokens: { type: 'ARRAY', items: { type: 'STRING' } },
                blanks: { type: 'ARRAY', items: { type: 'STRING' } },
                explanation: { type: 'STRING' },
              },
            },
          },
          options: { type: 'ARRAY', items: { type: 'STRING' } },
          correct: { type: 'STRING' },
        },
        required: ['id', 'type', 'title'],
      },
    },
    blueprint: { type: 'OBJECT' },
  },
};

interface RequestBody {
  prompt_type?: string;
  lesson_data?: Record<string, unknown> & { level?: string; cefr_level?: string };
  user_prompt?: string;
  /** Disable Google Search grounding (default: enabled). */
  disable_grounding?: boolean;
}

/** Tolerant JSON extraction — strips ```json fences and locates the outermost {...} */
function extractJson(text: string): unknown {
  const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { /* fall through */ }
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try { return JSON.parse(cleaned.slice(first, last + 1)); } catch { /* fall through */ }
  }
  throw new Error('Unparseable JSON output');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body = (await req.json()) as RequestBody;
    const promptType = (body.prompt_type || 'lesson').toLowerCase();
    const variantInstruction = PROMPT_VARIANTS[promptType] || PROMPT_VARIANTS.lesson;

    // 1. Resolve methodology from CEFR level on the lesson payload.
    const rawLevel =
      (body.lesson_data?.cefr_level as string | undefined) ||
      (body.lesson_data?.level as string | undefined) ||
      '';
    const methodology = methodologyForLevel(rawLevel);

    // 2. Compose the system prompt: base + methodology + task variant + grounding.
    const groundingEnabled = body.disable_grounding !== true;
    const groundingNote = groundingEnabled
      ? '\n\nGROUNDING: When generating the lesson, use Google Search to reference up-to-date, real-world examples, modern vocabulary usage, and current best practices for teaching this specific topic. Cite sources only inside the image_prompt or narrative when naturally useful — never fabricate URLs.'
      : '';

    const systemInstruction =
      `${BASE_SYSTEM}\n\n` +
      `PEDAGOGICAL FRAMEWORK (level: ${rawLevel || 'unspecified'} → ${methodology.label}):\n${methodology.instruction}\n\n` +
      `TASK MODE: ${promptType.toUpperCase()}\n${variantInstruction}` +
      groundingNote +
      `\n\nReturn ONLY a single valid JSON object matching the implicit lesson schema. No markdown fences, no commentary.`;

    const userPayload = JSON.stringify({
      lesson_data: body.lesson_data ?? {},
      user_prompt: body.user_prompt ?? '',
    });

    // 3. Build Gemini request. NOTE: googleSearch tool and structured output
    //    (responseSchema + JSON mime) are mutually exclusive in Gemini. When
    //    grounding is enabled we drop the schema and rely on prompt + tolerant
    //    JSON extraction. Otherwise we keep strict schema for max reliability.
    const generationConfig: Record<string, unknown> = {
      temperature: 0.85,
      maxOutputTokens: 8192,
    };
    const requestBody: Record<string, unknown> = {
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: userPayload }] }],
      generationConfig,
    };
    if (groundingEnabled) {
      requestBody.tools = [{ google_search: {} }];
    } else {
      generationConfig.response_mime_type = 'application/json';
      generationConfig.responseSchema = RESPONSE_SCHEMA;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'Gemini API request failed', status: geminiRes.status, detail: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await geminiRes.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';

    // Surface grounding citations if Gemini returned any.
    const groundingMeta = data?.candidates?.[0]?.groundingMetadata ?? null;
    const sources: Array<{ title?: string; uri?: string }> =
      (groundingMeta?.groundingChunks || [])
        .map((c: any) => c?.web)
        .filter(Boolean)
        .map((w: any) => ({ title: w.title, uri: w.uri })) || [];

    let parsed: unknown = null;
    try {
      parsed = extractJson(text);
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', e, text.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'Gemini returned non-JSON output', raw: text }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        prompt_type: promptType,
        content: parsed,
        methodology: {
          key: methodology.key,
          label: methodology.label,
          emoji: methodology.emoji,
          level: rawLevel,
        },
        grounded: groundingEnabled,
        sources,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('generate-lesson-content fatal:', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
