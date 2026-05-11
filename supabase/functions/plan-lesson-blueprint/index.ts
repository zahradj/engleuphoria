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

    // CEFR-tiered phonics rules — TIER WINS over hub flavoring.
    const cefrUpper = String(cefr_level).toUpperCase();
    const tier: 'A' | 'B' | 'C' =
      ['PRE-A1', 'A1'].includes(cefrUpper) ? 'A' :
      ['A2', 'B1'].includes(cefrUpper) ? 'B' : 'C';

    const tierRule =
      tier === 'A'
        ? `TIER A — Synthetic Phonics (Pre-A1 / A1). Pick a single-phoneme focus, CVC blend, or simple digraph (sh, ch, th, ck). e.g. "Short A /æ/", "Digraph /ʃ/ (sh)", "CVC blend C-A-T". Provide IPA + grapheme + 3 example_words from the chosen vocabulary.`
        : tier === 'B'
        ? `TIER B — Minimal Pairs / Tricky Sounds (A2 / B1). Pick a minimal pair, a tricky consonant cluster, OR a silent letter pattern. e.g. "Minimal pair /ɪ/ vs /iː/ (ship/sheep)", "Cluster /spr/ (spring/spray)", "Silent K (knee/know)". Provide IPA + a short pattern label + 2-3 contrasting example_words drawn from the vocabulary.`
        : `TIER C — Suprasegmentals (B2 / C1 / C2). Pick word stress, sentence stress, intonation, linking, elision, or weak forms. e.g. "Noun↔verb stress shift (RE-cord vs re-CORD)", "Elision in connected speech (next door → /neks dɔː/)", "Rising intonation in yes/no questions". Provide a clear pattern label + IPA where relevant + 2-3 example phrases drawn from the vocabulary.`;

    const hubFlavor =
      hub === 'playground'
        ? `Use kid-friendly labels alongside the IPA.`
        : hub === 'success'
        ? `Frame the focus for adult professionals (workplace / business contexts). Avoid kids' phonics labels.`
        : `Frame the focus for teenagers — modern, relatable examples.`;

    const phonicsGuidance = `${tierRule}\n${hubFlavor}\n⚠️ target_phonics is REQUIRED at every level — never return an empty object.`;

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

    const isPreA1 = String(cefr_level).toLowerCase() === 'pre-a1';

    const preA1Override = isPreA1 ? `

⚠️ PRE-A1 OVERRIDE — STRICT (overrides any conflicting rule below).
Audience: 4-5 year-old true beginners and PRE-READERS.
- DO NOT generate grammar rules or full sentences. Set "grammar" to an empty string.
- "vocabulary" MUST be EXACTLY 3 phonetically-decodable CVC words tied to ONE phonics focus
  (e.g. for /æ/ → ["cat","mat","hat"]; for /m/ → ["mat","mom","map"]).
- "target_phonics" MUST be a single phoneme focus with IPA + grapheme + the same 3 example words.
- "pedagogical_framework" MUST be "Immersion" (no Discovery/TaskBased).
- "lesson_structure" entries may use ONLY these slide_type hints:
  ["flashcard","multiple_choice","drag_and_match","drawing_canvas","tracing_canvas","spinner_wheel"].
- All "phase" values should be "Vocabulary" (no Grammar/Reading/Comprehension/Writing phases).
` : '';

    const system = `${studioPersona}${preA1Override}

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
          maxOutputTokens: 2048,
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

    // ── Normalize merged Slide-Studio fields with hub-aware defaults ──
    const FRAMEWORK_DEFAULTS: Record<string, string[]> = {
      Discovery: ['Reading', 'Comprehension', 'Grammar', 'Vocabulary', 'Speaking', 'Writing'],
      TaskBased: ['Speaking', 'Vocabulary', 'Grammar', 'Reading', 'Comprehension', 'Writing'],
      Immersion: ['Vocabulary', 'Reading', 'Comprehension', 'Speaking', 'Grammar', 'Writing'],
    };
    const VALID_FRAMEWORKS = new Set(['Discovery', 'TaskBased', 'Immersion']);
    const VALID_PHASES = new Set(['Vocabulary', 'Reading', 'Comprehension', 'Grammar', 'Speaking', 'Writing']);
    const hubDefaultFramework =
      hub === 'playground' ? 'Immersion' : hub === 'success' ? 'TaskBased' : 'Discovery';
    if (!VALID_FRAMEWORKS.has(parsed.pedagogical_framework)) {
      parsed.pedagogical_framework = hubDefaultFramework;
    }
    let phases: string[] = Array.isArray(parsed.phases)
      ? parsed.phases.filter((p: unknown) => typeof p === 'string' && VALID_PHASES.has(p))
      : [];
    if (phases.length === 0) phases = FRAMEWORK_DEFAULTS[parsed.pedagogical_framework];
    parsed.phases = phases;
    if (!Array.isArray(parsed.lesson_structure) || parsed.lesson_structure.length === 0) {
      const defaultSlideType =
        hub === 'playground' ? 'flashcard' : hub === 'success' ? 'mascot_speech' : 'multiple_choice';
      parsed.lesson_structure = phases.map((p: string) => ({ phase: p, slide_type: defaultSlideType }));
    } else {
      parsed.lesson_structure = parsed.lesson_structure
        .filter((e: any) => e && typeof e === 'object' && VALID_PHASES.has(e.phase))
        .slice(0, 20);
    }
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
