// deno-lint-ignore-file no-explicit-any
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const HUB_RULES: Record<string, { quizMin: number; quizMax: number; types: string[]; tone: string }> = {
  playground: {
    quizMin: 2,
    quizMax: 2,
    types: ['multiple', 'truefalse'],
    tone: 'Playful, age 5-9, simple A1 words, very short sentences (max 8 words). Use emojis and concrete imagery.',
  },
  academy: {
    quizMin: 3,
    quizMax: 4,
    types: ['truefalse', 'fill', 'multiple'],
    tone: 'Teen voice, A2-B2, 1-3 sentences per page, relatable scenarios.',
  },
  success: {
    quizMin: 4,
    quizMax: 5,
    types: ['multiple', 'discussion'],
    tone: 'Adult/professional, B2-C2, case-study style, analytical questions, real-world workplace scenarios.',
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { prompt, target_vocab = [], cefr_level = 'A1', hub_type = 'playground' } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'prompt is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const rules = HUB_RULES[hub_type] || HUB_RULES.playground;
    const vocabList = Array.isArray(target_vocab) ? target_vocab.filter(Boolean).slice(0, 12) : [];

    const systemPrompt = [
      `You are an English curriculum author. Generate a short illustrated story for the ${hub_type.toUpperCase()} hub at CEFR ${cefr_level}.`,
      `Tone: ${rules.tone}`,
      `Story rules: 3-5 pages, each page 1-3 sentences, narrative arc with a small problem and resolution.`,
      vocabList.length ? `You MUST naturally weave in these vocabulary words: ${vocabList.join(', ')}.` : '',
      `Then produce ${rules.quizMin}-${rules.quizMax} comprehension quiz slides using ONLY these types: ${rules.types.join(', ')}.`,
      `For each quiz item, the answer MUST be derivable directly from the story text. Do NOT invent facts.`,
      `For 'discussion' (open-ended), set answer to "" and provide a "prompt" that references story events.`,
    ].filter(Boolean).join('\n');

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Story topic / prompt: ${prompt}` },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'emit_storybook',
            description: 'Return the storybook pages and comprehension quiz slides',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                pages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      page_number: { type: 'integer' },
                      text: { type: 'string' },
                      image_prompt: { type: 'string', description: 'Concise illustration brief, 8-15 words' },
                    },
                    required: ['page_number', 'text', 'image_prompt'],
                  },
                },
                quiz_slides: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', enum: ['multiple', 'truefalse', 'fill', 'discussion'] },
                      question: { type: 'string' },
                      statement: { type: 'string' },
                      text: { type: 'string' },
                      prompt: { type: 'string' },
                      options: { type: 'array', items: { type: 'string' } },
                      answer: { type: 'string' },
                      answer_bool: { type: 'boolean' },
                    },
                    required: ['type'],
                  },
                },
              },
              required: ['title', 'pages', 'quiz_slides'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'emit_storybook' } },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error('AI gateway error', aiRes.status, t);
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Rate limited, please retry shortly.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'Add credits in Settings > Workspace > Usage.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error('AI gateway error');
    }

    const data = await aiRes.json();
    const tc = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) throw new Error('AI returned no structured payload');
    const args = JSON.parse(tc.function.arguments);

    const pages = (args.pages || []).map((p: any, i: number) => ({
      page_number: p.page_number ?? i + 1,
      text: String(p.text || ''),
      image_prompt: p.image_prompt || '',
      image_url: '',
      audio_url: '',
    }));

    return new Response(JSON.stringify({
      title: args.title || 'Story',
      pages,
      quiz_slides: args.quiz_slides || [],
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error('generate-storybook error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
