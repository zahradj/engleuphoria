// Plan a Lesson Blueprint via Google Gemini.
// Given Topic + CEFR level + Hub, the AI selects 5 vocabulary words +
// 1 grammar structure + 1 phonics focus that the slide generator MUST use
// consistently across the lesson.
// Returns: { vocabulary: string[5], grammar: string, target_phonics: {...}, rationale?: string }
import { buildStudioSystemPrompt } from "../_shared/studioPersona.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = 'gemini-1.5-flash';

function tolerantJsonParse(raw: string): any | null {
  if (!raw) return null;
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  try { return JSON.parse(cleaned); } catch { /* try slice */ }
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try { return JSON.parse(cleaned.slice(first, last + 1)); } catch { /* give up */ }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { topic, cefr_level = 'A1', hub = 'academy', interests, specific_needs, target_grammar, previous_topics } =
      await req.json().catch(() => ({}));

    if (!topic || typeof topic !== 'string') {
      return new Response(JSON.stringify({ error: 'topic is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const phonicsGuidance =
      hub === 'playground'
        ? `Choose a SYNTHETIC PHONICS focus that is directly derivable from the chosen vocabulary (e.g., vocab "cat / bat / hat" → "Short /a/"; vocab "cake / bake / lake" → "Magic e / long /eɪ/"; "ship / chip" → "/ʃ/ vs /tʃ/ digraph"). Provide both a kid-friendly focus label AND the IPA symbol.`
        : hub === 'success'
        ? `Choose an EXECUTIVE PRONUNCIATION focus tied to the vocabulary — word stress patterns (e.g. "Stress on -tion endings"), connected speech, or business intonation. Avoid kids' phonics.`
        : `Choose a PRONUNCIATION ACCURACY focus tied to the vocabulary — common teen problem sounds (e.g. "/v/ vs /w/", "th- digraph", "schwa in unstressed syllables").`;

    const audience =
      hub === 'playground'
        ? 'young children (ages 5-10), playful and concrete'
        : hub === 'success'
        ? 'adult professionals, business / workplace context'
        : 'teenagers (ages 11-17), modern and relatable';

    const anchor = [
      interests ? `STUDENT INTERESTS (creative anchor): ${interests}` : '',
      specific_needs ? `SPECIFIC NEEDS / GOALS: ${specific_needs}` : '',
    ].filter(Boolean).join('\n');

    const studioPersona = buildStudioSystemPrompt({
      role: 'pedagogue',
      cefr: cefr_level,
      hub,
      ageGroup: hub === 'playground' ? 'kids' : hub === 'academy' ? 'teens' : 'adults',
      targetGrammar: target_grammar,
      previousTopics: Array.isArray(previous_topics) ? previous_topics.slice(0, 10) : undefined,
      outputContract: 'Return ONE JSON object with shape { vocabulary: string[5], grammar: string, target_phonics: { focus, sound_ipa, grapheme, example_words[] }, rationale?: string }. No markdown.',
    });

    const system = `${studioPersona}

You are also a Senior ESL Curriculum Designer.
Given a TOPIC and a CEFR level, you select:
  • exactly 5 target vocabulary words (single words or 2-word collocations)
  • exactly 1 target grammar structure (e.g. "Simple Past", "Present Continuous", "Modal: should")
  • exactly 1 target phonics / pronunciation focus
The selection MUST be appropriate for ${audience} at CEFR ${cefr_level}.
Vocabulary must be tightly themed to the topic — not generic filler.
Grammar must be one a teacher could plausibly drill in 30-60 minutes alongside that vocabulary.

PHONICS RULES:
${phonicsGuidance}
The phonics focus MUST be derivable from the chosen vocabulary; pick 2-3 of those vocabulary words as "example_words" that contain the target sound.
${anchor ? `\nWhen choosing vocabulary, gently bias toward terms that resonate with the following:\n${anchor}` : ''}

FRAMEWORK CHOICE:
You ALSO pick a pedagogical framework that best fits the topic + audience:
  • "Discovery"  — best for tricky grammar (inductive: meet-in-context → guess-rule → formalize).
  • "TaskBased"  — best for adult/professional learners (try-and-fail → toolbox → succeed).
  • "Immersion"  — best for young learners / beginners (visual vocab → story → comprehension → guided production).
For Playground default to "Immersion"; for Success default to "TaskBased"; for Academy choose freely.

LESSON STRUCTURE:
Emit an ordered \`lesson_structure\` array (8-14 entries) selecting from these phases:
  ["Vocabulary","Reading","Comprehension","Grammar","Speaking","Writing"]
and these slide_type hints:
  ["mascot_speech","flashcard","multiple_choice","drag_and_drop","drag_and_match","fill_in_the_gaps","drawing_canvas"]
The order of phases MUST follow the framework you picked. Repeat phases as needed (e.g. Vocabulary may appear 2-3 times).

Return ONLY a single valid JSON object with this exact shape (no markdown, no commentary):
{
  "vocabulary": ["word1","word2","word3","word4","word5"],
  "grammar": "Grammar structure name",
  "target_phonics": {
    "focus": "Kid/teacher-friendly label",
    "sound_ipa": "/x/",
    "grapheme": "letter or pattern",
    "example_words": ["w1","w2","w3"]
  },
  "pedagogical_framework": "Discovery" | "TaskBased" | "Immersion",
  "framework_rationale": "One short sentence why this framework fits.",
  "phases": ["Vocabulary","Reading", ...],
  "lesson_structure": [
    { "phase": "Vocabulary", "slide_type": "flashcard", "note": "intro 5 words" },
    { "phase": "Vocabulary", "slide_type": "drag_and_match", "note": "match word↔picture" }
  ],
  "rationale": "Short explanation of vocabulary/grammar choice"
}`;

    const userMsg = `TOPIC: ${topic}\nCEFR LEVEL: ${cefr_level}\nHUB: ${hub}\n${anchor}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { role: 'system', parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error('[plan-lesson-blueprint] Gemini error', resp.status, t);
      return new Response(JSON.stringify({ error: 'Gemini API error', detail: t }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';
    const parsed = tolerantJsonParse(text);

    if (!parsed?.vocabulary || !parsed?.grammar) {
      console.error('[plan-lesson-blueprint] invalid output', text.slice(0, 400));
      throw new Error('AI did not return a valid blueprint');
    }
    parsed.vocabulary = (parsed.vocabulary as string[]).slice(0, 5);
    while (parsed.vocabulary.length < 5) parsed.vocabulary.push('');

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[plan-lesson-blueprint]', e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
