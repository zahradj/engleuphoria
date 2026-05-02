// Supabase Edge Function: ai-slide-game-generator
// Generates the `interactive_data` payload for a single Slide Studio game slide
// in the EXACT shape the player components expect (MCQ, drag_and_match, fill_in_the_gaps,
// flashcard, drawing_prompt). The client patches the result straight into the slide.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiFetch } from "../_shared/aiFetch.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type GameType =
  | 'multiple_choice'
  | 'drag_and_match'
  | 'fill_in_the_gaps'
  | 'flashcard'
  | 'drawing_prompt';

const TOOL_BY_TYPE: Record<GameType, any> = {
  multiple_choice: {
    name: 'build_multiple_choice',
    description: 'Build a single multiple-choice question with one correct answer.',
    parameters: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Clear, age-appropriate question.' },
        options: {
          type: 'array',
          minItems: 3,
          maxItems: 5,
          items: { type: 'string' },
          description: '3-5 distinct answer choices.',
        },
        correct_index: { type: 'integer', minimum: 0, description: '0-based index of the correct option.' },
        instruction: { type: 'string' },
      },
      required: ['question', 'options', 'correct_index'],
    },
  },
  drag_and_match: {
    name: 'build_drag_and_match',
    description: 'Build a drag-and-match game with 3-8 pairs of related items.',
    parameters: {
      type: 'object',
      properties: {
        instruction: { type: 'string', description: 'Short student-facing instruction (e.g. "Match the word to the picture").' },
        pairs: {
          type: 'array',
          minItems: 3,
          maxItems: 8,
          items: {
            type: 'object',
            properties: {
              left_item: { type: 'string', description: 'Left card text (usually the word).' },
              right_item: { type: 'string', description: 'Right card text (usually the meaning, translation, or matching item).' },
              left_thumbnail_keyword: { type: 'string', description: 'Single noun keyword for an optional left icon.' },
              right_thumbnail_keyword: { type: 'string', description: 'Single noun keyword for an optional right icon.' },
            },
            required: ['left_item', 'right_item'],
          },
        },
      },
      required: ['instruction', 'pairs'],
    },
  },
  fill_in_the_gaps: {
    name: 'build_fill_in_the_gaps',
    description: 'Build a single fill-in-the-blank sentence with one missing word and 2-3 distractors.',
    parameters: {
      type: 'object',
      properties: {
        instruction: { type: 'string' },
        sentence_before: { type: 'string', description: 'Text BEFORE the gap.' },
        sentence_after: { type: 'string', description: 'Text AFTER the gap. Include the trailing period.' },
        missing_word: { type: 'string' },
        distractors: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
      },
      required: ['instruction', 'sentence_before', 'sentence_after', 'missing_word', 'distractors'],
    },
  },
  flashcard: {
    name: 'build_flashcard',
    description: 'Build a single vocabulary flashcard.',
    parameters: {
      type: 'object',
      properties: {
        front: { type: 'string', description: 'Word or phrase on the front face.' },
        back: { type: 'string', description: 'Definition / translation / example on the back face.' },
      },
      required: ['front', 'back'],
    },
  },
  drawing_prompt: {
    name: 'build_drawing_prompt',
    description: 'Build a creative drawing prompt the student can sketch.',
    parameters: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Imaginative drawing instruction tied to the lesson.' },
      },
      required: ['prompt'],
    },
  },
};

function buildSystemPrompt(opts: {
  gameType: GameType;
  hub?: string;
  cefrLevel?: string;
  pairCount?: number;
}) {
  const audience =
    opts.hub === 'Playground'
      ? 'children aged 4-9 (Playground hub) — use very simple words, concrete nouns, vivid imagery, and a playful tone.'
      : opts.hub === 'Academy'
      ? 'teenagers aged 10-17 (Academy hub) — use age-appropriate, relevant contexts.'
      : 'adult learners (Professional hub) — use real-world / workplace contexts.';

  const sizeLine =
    opts.gameType === 'drag_and_match' && opts.pairCount
      ? `Generate EXACTLY ${opts.pairCount} pairs.`
      : '';

  return `You are an expert ESL game designer.
Audience: ${audience}
CEFR level: ${opts.cefrLevel ?? 'A1'}.

Design rules:
- Pedagogically sound, age-appropriate, culturally inclusive.
- Use real lesson vocabulary / grammar — NEVER placeholders like "Option A".
- Distractors must be plausible but clearly wrong.
- Keep wording short and student-friendly.
${sizeLine}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const body = await req.json();
    const gameType = body.gameType as GameType;
    const lessonContext: string = body.lessonContext ?? '';
    const slideTitle: string = body.slideTitle ?? '';
    const visualKeyword: string = body.visualKeyword ?? '';
    const userPrompt: string = body.userPrompt ?? '';
    const hub: string | undefined = body.hub;
    const cefrLevel: string | undefined = body.cefrLevel;
    const pairCount: number | undefined = body.pairCount;

    if (!gameType || !TOOL_BY_TYPE[gameType]) {
      return new Response(JSON.stringify({ error: 'Unsupported gameType' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tool = {
      type: 'function',
      function: TOOL_BY_TYPE[gameType],
    };

    const userContent = `
Lesson context (vocab / grammar / topic):
${lessonContext || '(none provided)'}

Slide title: ${slideTitle || '(untitled)'}
Visual keyword: ${visualKeyword || '(none)'}
Teacher's instructions: ${userPrompt || '(none — generate the most useful game for this slide)'}

Now produce the game by calling the function "${tool.function.name}".
`.trim();

    const response = await aiFetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: buildSystemPrompt({ gameType, hub, cefrLevel, pairCount }) },
          { role: 'user', content: userContent },
        ],
        tools: [tool],
        tool_choice: { type: 'function', function: { name: tool.function.name } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error('AI gateway error:', status, text);
      if (status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again shortly.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Add funds in Workspace > Usage.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('No tool call in AI response');

    const args = JSON.parse(toolCall.function.arguments);

    // Normalize to the EXACT interactive_data shape each player component expects.
    let interactive_data: Record<string, unknown>;
    switch (gameType) {
      case 'multiple_choice': {
        const options = Array.isArray(args.options) ? args.options.map((o: any) => String(o)).filter(Boolean) : [];
        const correct = Math.max(0, Math.min(options.length - 1, Number(args.correct_index ?? 0)));
        interactive_data = {
          question: String(args.question ?? '').trim(),
          options,
          correct_index: correct,
          ...(args.instruction ? { instruction: String(args.instruction) } : {}),
        };
        break;
      }
      case 'drag_and_match': {
        const pairs = Array.isArray(args.pairs)
          ? args.pairs
              .map((p: any) => ({
                left_item: String(p.left_item ?? '').trim(),
                right_item: String(p.right_item ?? '').trim(),
                left_thumbnail_keyword: p.left_thumbnail_keyword ? String(p.left_thumbnail_keyword) : undefined,
                right_thumbnail_keyword: p.right_thumbnail_keyword ? String(p.right_thumbnail_keyword) : undefined,
              }))
              .filter((p: any) => p.left_item && p.right_item)
          : [];
        interactive_data = {
          instruction: String(args.instruction ?? 'Match each word to its meaning.').trim(),
          pairs,
        };
        break;
      }
      case 'fill_in_the_gaps': {
        const distractors = Array.isArray(args.distractors)
          ? args.distractors.map((d: any) => String(d)).filter(Boolean).slice(0, 3)
          : [];
        interactive_data = {
          instruction: String(args.instruction ?? 'Fill in the gap!').trim(),
          sentence_parts: [String(args.sentence_before ?? ''), String(args.sentence_after ?? '')],
          missing_word: String(args.missing_word ?? '').trim(),
          distractors,
        };
        break;
      }
      case 'flashcard': {
        interactive_data = {
          front: String(args.front ?? '').trim(),
          back: String(args.back ?? '').trim(),
        };
        break;
      }
      case 'drawing_prompt': {
        interactive_data = { prompt: String(args.prompt ?? '').trim() };
        break;
      }
    }

    return new Response(JSON.stringify({ gameType, interactive_data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ai-slide-game-generator error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
