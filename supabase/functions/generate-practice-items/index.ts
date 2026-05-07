// Generates N additional practice items for an activity slide
// (error_detection / correction / fill_blank), aligned with the lesson blueprint.
// Uses Lovable AI Gateway with tool-calling for typed JSON output.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type SlideType = 'error_detection' | 'correction' | 'fill_blank';

interface Body {
  slide_type: SlideType;
  count?: number;
  existing_items?: any[];
  blueprint?: {
    vocabulary?: string[];
    grammar?: string;
    title?: string;
  };
  hub?: 'playground' | 'academy' | 'success';
  cefr_level?: string;
}

const TOOL_BY_TYPE: Record<SlideType, any> = {
  error_detection: {
    name: 'add_error_detection_items',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sentence: { type: 'string', description: 'A sentence containing exactly ONE wrong word.' },
              wrongIndex: { type: 'integer', description: '0-based index of the wrong word when sentence is split by whitespace.' },
            },
            required: ['sentence', 'wrongIndex'],
            additionalProperties: false,
          },
        },
      },
      required: ['items'],
      additionalProperties: false,
    },
  },
  correction: {
    name: 'add_correction_items',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              wrong: { type: 'string' },
              answer: { type: 'string' },
            },
            required: ['wrong', 'answer'],
            additionalProperties: false,
          },
        },
      },
      required: ['items'],
      additionalProperties: false,
    },
  },
  fill_blank: {
    name: 'add_fill_blank_items',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              before: { type: 'string', description: 'Text before the blank.' },
              answer: { type: 'string', description: 'The single word/phrase that goes in the blank.' },
              after: { type: 'string', description: 'Text after the blank.' },
            },
            required: ['before', 'answer', 'after'],
            additionalProperties: false,
          },
        },
      },
      required: ['items'],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    const { slide_type, count = 3, existing_items = [], blueprint = {}, hub = 'academy', cefr_level = 'A2' } = body;

    if (!slide_type || !TOOL_BY_TYPE[slide_type]) {
      return new Response(JSON.stringify({ error: 'invalid slide_type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const vocab = (blueprint.vocabulary || []).join(', ') || '—';
    const grammar = blueprint.grammar || '—';

    const system = `You are an ESL curriculum designer creating intensive practice items.
Hub: ${hub} | CEFR: ${cefr_level}
Lesson title: ${blueprint.title || '—'}
Target vocabulary: ${vocab}
Target grammar rule: ${grammar}

Rules:
- Generate exactly ${count} NEW practice items.
- Reuse the target vocabulary and target grammar.
- Vary the subjects (he/she/they/we/the kids/etc.) to keep it fresh.
- Do NOT repeat any of the existing items below.
- Match the CEFR level — short, clean, natural English.`;

    const user = `Existing items (do not duplicate):\n${JSON.stringify(existing_items, null, 2)}\n\nSlide type: ${slide_type}\nReturn ${count} new items via the tool.`;

    const tool = TOOL_BY_TYPE[slide_type];

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        tools: [{ type: 'function', function: tool }],
        tool_choice: { type: 'function', function: { name: tool.name } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit. Please retry in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: 'Lovable AI credits exhausted.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await resp.text();
      console.error('AI gateway error', resp.status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = call?.function?.arguments;
    let items: any[] = [];
    try {
      items = JSON.parse(typeof args === 'string' ? args : JSON.stringify(args || {})).items || [];
    } catch (e) {
      console.error('parse error', e, args);
    }

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-practice-items error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
