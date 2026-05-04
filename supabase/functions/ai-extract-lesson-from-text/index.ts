import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiFetch } from "../_shared/aiFetch.ts";
import { requireAuth } from "../_shared/authGuard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

/**
 * Convert raw text (article, story, transcript) into a fully-populated lesson
 * deck for either the Playground (kids) or Academy (teens/adults) creator.
 * Returns { slides: any[], title, level } — the SAME shape the creator's
 * setSlides() expects. The client navigates to the creator page and injects.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const auth = await requireAuth(req, { allowedRoles: ['admin', 'content_creator', 'teacher'] });
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.body), {
      status: auth.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { rawText, hub, level, title, slideCount } = await req.json();
    if (typeof rawText !== 'string' || rawText.trim().length < 60) {
      return new Response(JSON.stringify({ error: 'rawText must be at least 60 characters' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const targetHub: 'playground' | 'academy' = hub === 'playground' ? 'playground' : 'academy';
    const targetLevel = level || (targetHub === 'playground' ? 'A1' : 'B1');
    const count = Math.max(8, Math.min(40, Number(slideCount) || (targetHub === 'playground' ? 15 : 25)));

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) throw new Error('LOVABLE_API_KEY not configured');

    const academySchema = `Each slide is one of these shapes (block field is one of: warmup, vocab, reading, practice, grammar, production, wrapup):
- { "type":"intro", "block":"warmup", "title":string, "subtitle":string }
- { "type":"question", "block":"warmup", "prompt":string, "placeholder":string }
- { "type":"vocab", "block":"vocab", "prompt":string, "items":[{ "word":string, "definition":string, "example":string }] }
- { "type":"matching", "block":"vocab", "prompt":string, "pairs":[{ "left":string, "right":string }] }
- { "type":"reading_passage", "block":"reading", "title":string, "passage":string, "questions":[{ "q":string, "a":string }] }
- { "type":"listening", "block":"reading", "prompt":string, "transcript":string }
- { "type":"multiple", "block":"practice", "question":string, "options":string[], "correctIndex":number }
- { "type":"truefalse", "block":"practice", "statement":string, "answer":boolean }
- { "type":"grammar_pattern", "block":"grammar", "title":string, "pattern":string, "examples":string[] }
- { "type":"reflection", "block":"wrapup", "prompt":string }`;

    const playgroundSchema = `Each slide has: id, type, title, voice:{ text, autoPlay:true }. Types: intro, vocab_card, listen_repeat, matching, drag_drop, multiple_choice, song, story, reflection.
Examples:
- { "type":"intro", "title":string, "voice":{"text":string,"autoPlay":true} }
- { "type":"vocab_card", "word":string, "translation":string, "voice":{"text":string,"autoPlay":true} }
- { "type":"multiple_choice", "question":string, "options":string[], "correctIndex":number, "voice":{"text":string,"autoPlay":true} }
- { "type":"matching", "pairs":[{"left":string,"right":string}], "voice":{"text":string,"autoPlay":true} }`;

    const sys = `You are an expert ESL curriculum designer. Convert the user's raw text into a ready-to-teach ${targetHub === 'playground' ? '30-minute KIDS (ages 6-11)' : '60-minute TEENS/ADULTS'} lesson at CEFR ${targetLevel}.
Output exactly ${count} slides covering: warm-up → vocabulary → reading/listening → practice → production → wrap-up.

🏗️ SEQUENTIAL GENERATION PIPELINE — YOU MUST BUILD THIS LESSON IN STRICT CHRONOLOGICAL ORDER. Do not skip phases. Do not reorder them.
  Phase 1 — FOUNDATION: Choose 5 target vocabulary words (age & level appropriate) AND 1 core grammar rule (e.g. "Present Simple"). Lock these in _lesson_metadata.
  Phase 2 — FLESH: Write a single reading passage / dialogue (120-220 words) that HEAVILY USES all 5 vocabulary words from Phase 1 and demonstrates the Phase 1 grammar rule multiple times. Store the full text in _source_text.
  Phase 3 — JOINTS: Generate the interactive quiz slides (multiple_choice / truefalse / fill-in-the-blank). Every quiz answer MUST be directly verifiable from the Phase 2 _source_text. Never test on facts that are not in the passage.
  Phase 4 — PAINT: Now write all visual / image descriptions and the voice-over text strings. The slides[] array is generated LAST, pulling from Phases 1-3.

${targetHub === 'academy' ? academySchema : playgroundSchema}

Return STRICT JSON in this drafting format (no prose, no markdown):
{
  "_lesson_metadata": { "target_vocab": string[5], "core_grammar": string },
  "_source_text": string,
  "title": string,
  "level": "${targetLevel}",
  "slides": Slide[]
}`;

    const userMsg = `RAW TEXT:\n\n${rawText.slice(0, 8000)}\n\n${title ? `Suggested title: ${title}` : ''}`;

    const resp = await aiFetch(LOVABLE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: userMsg },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 12000,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`AI ${resp.status}: ${t.slice(0, 300)}`);
    }
    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }

    if (!Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      throw new Error('AI returned no slides');
    }

    return new Response(JSON.stringify({
      title: parsed.title || title || 'Untitled lesson',
      level: parsed.level || targetLevel,
      slides: parsed.slides,
      hub: targetHub,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ai-extract-lesson-from-text error:', err);
    return new Response(JSON.stringify({ error: true, message: (err as Error).message }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
