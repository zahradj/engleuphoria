// Generate lesson content via Google AI Studio (Gemini API)
// Routes: prompt_type -> targeted system instruction
// Returns: strict JSON (slides[] or blueprint object)

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
  lesson_data?: Record<string, unknown>;
  user_prompt?: string;
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

    const systemInstruction = `${BASE_SYSTEM}\n\nTASK MODE: ${promptType.toUpperCase()}\n${variantInstruction}\n\nReturn ONLY valid JSON matching the supplied schema. No markdown, no commentary.`;

    const userPayload = JSON.stringify({
      lesson_data: body.lesson_data ?? {},
      user_prompt: body.user_prompt ?? '',
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userPayload }] }],
        generationConfig: {
          temperature: 0.85,
          response_mime_type: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          maxOutputTokens: 8192,
        },
      }),
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

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', e, text.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'Gemini returned non-JSON output', raw: text }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, prompt_type: promptType, content: parsed }),
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
