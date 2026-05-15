// generate-homework — Smart Homework AI
// Reads the Lesson Blueprint + Hub config and emits a strict 3-activity
// JSON payload consumed by <HomeworkPlayer />.
//
// Activities (in order):
//   1. activity_1_recognition  — Listen & Match
//   2. activity_2_syntax       — Sentence Scramble (drag & drop)
//   3. activity_3_production   — Voice Challenge (roleplay)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { aiFetch } from "../_shared/aiFetch.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Hub = "playground" | "academy" | "success";

const HUB_RULES: Record<Hub, string> = {
  playground:
    'AUDIENCE: kids aged 4-9. Tone: enthusiastic, magical, simple. CEFR: Pre-A1 to A2. ' +
    'Sentences must be ≤6 words. Use concrete nouns and physical verbs only. No abstract ideas, no business themes.',
  academy:
    'AUDIENCE: teenagers aged 10-15. Tone: engaging, relevant, slightly informal. CEFR: A2 to B2. ' +
    'Sentences may be 6-10 words. Use everyday teen contexts (school, sport, tech, friends).',
  success:
    'AUDIENCE: adult professionals. Tone: formal, sophisticated, business-oriented. CEFR: B1 to C2. ' +
    'Sentences may be 8-14 words and may use intermediate idioms or business collocations.',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization header" }, 401);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const {
      lesson_id,
      blueprint,
      title,
      due_date,
      hub: rawHub,
      image_style,
      assigned_student_id,
    } = (body || {}) as Record<string, any>;

    const hub: Hub = (["playground", "academy", "success"].includes(rawHub) ? rawHub : "academy") as Hub;

    let bp = blueprint || null;
    let resolvedTitle = title || "Homework";
    let resolvedImageStyle: string | null = image_style || null;

    if (!bp && lesson_id) {
      const { data: lesson } = await supabase
        .from("curriculum_lessons")
        .select("title, vocabulary_list, grammar_pattern, phonics_focus, content, image_style")
        .eq("id", lesson_id)
        .maybeSingle();
      if (lesson) {
        resolvedTitle = lesson.title || resolvedTitle;
        resolvedImageStyle = resolvedImageStyle || (lesson as any).image_style || null;
        bp = {
          vocabulary: lesson.vocabulary_list || [],
          grammar: lesson.grammar_pattern || "",
          phonics: lesson.phonics_focus || "",
          ...((lesson.content as any) || {}),
        };
      }
    }

    if (!bp || (!bp.vocabulary && !bp.target_vocabulary && !bp.grammar)) {
      return json({ error: "No blueprint or vocabulary/grammar provided" }, 400);
    }

    // Normalise vocabulary into plain strings for the prompt
    const rawVocab = Array.isArray(bp.vocabulary)
      ? bp.vocabulary
      : (bp.target_vocabulary || []);
    const vocabStrings: string[] = rawVocab
      .map((v: any) => (typeof v === "string" ? v : v?.word || v?.term || ""))
      .filter((v: string) => v && v.trim().length > 0)
      .slice(0, 8);

    if (vocabStrings.length < 3) {
      return json({ error: "Need at least 3 vocabulary items to generate homework" }, 400);
    }

    const grammar = bp.grammar || bp.grammar_focus || bp.target_grammar_rule || "";
    const phonics = bp.target_phonics || bp.phonics || bp.phonics_focus || "";

    const systemPrompt =
      `You are an expert ESL homework game designer for the ${hub.toUpperCase()} hub. ` +
      `${HUB_RULES[hub]} ` +
      `Reuse the EXACT lesson vocabulary and grammar pattern. Do NOT introduce new vocabulary. ` +
      `\nCRITICAL OUTPUT FORMAT — return ONLY this raw JSON object, no markdown, no commentary:\n` +
      `{\n` +
      `  "activity_1_recognition": {\n` +
      `    "instructions": "string — short kid/teen/adult-appropriate instructions",\n` +
      `    "items": [\n` +
      `      {\n` +
      `        "audio_text": "string — the word/short phrase the student will HEAR (one of the vocabulary words)",\n` +
      `        "correct_answer": "string — same as audio_text",\n` +
      `        "wrong_options": ["string","string","string"]\n` +
      `      }\n` +
      `      // 4-5 items total, each using a different vocabulary word\n` +
      `    ]\n` +
      `  },\n` +
      `  "activity_2_syntax": {\n` +
      `    "instructions": "string",\n` +
      `    "items": [\n` +
      `      {\n` +
      `        "scrambled_words": ["array of word tokens in shuffled order"],\n` +
      `        "correct_order": "string — the full correct sentence with normal punctuation"\n` +
      `      }\n` +
      `      // EXACTLY 3 sentences. Each sentence MUST follow the target grammar pattern AND ` +
      `       use at least one target vocabulary word.\n` +
      `    ]\n` +
      `  },\n` +
      `  "activity_3_production": {\n` +
      `    "instructions": "string",\n` +
      `    "prompt": "string — a single short roleplay or contextual speaking prompt appropriate for the hub",\n` +
      `    "target_words_to_detect": ["string", "string"],\n` +
      `    "example_response": "string — a model sentence showing what a strong answer sounds like"\n` +
      `  }\n` +
      `}\n` +
      `Rules: scrambled_words must contain the SAME tokens (case-sensitive, punctuation stripped) as ` +
      `correct_order split on spaces, just shuffled. target_words_to_detect must be 2-3 words drawn from the vocabulary list.`;

    const userPrompt =
      `Lesson title: ${resolvedTitle}\n` +
      `Hub: ${hub}\n` +
      `Vocabulary (REUSE EXACTLY): ${JSON.stringify(vocabStrings)}\n` +
      `Grammar focus: ${grammar || "(none — focus only on vocabulary recognition for this hub)"}\n` +
      `Phonics / pronunciation focus: ${phonics || "(none)"}\n`;

    const aiRes = await aiFetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000,
      }),
    });

    // Soft-fail: never bubble a hard 502 to the client. Return 200 with
    // { success:false, retryable:true, … } so the SDK does not swallow the body.
    if (!aiRes.ok) {
      const errText = await aiRes.text();
      const retryable = aiRes.status === 429 || aiRes.status === 402 || aiRes.status >= 500;
      return json({
        success: false,
        retryable,
        error: aiRes.status === 402
          ? "AI credits exhausted — please add credits or try again shortly."
          : `AI service unavailable (status ${aiRes.status})`,
        detail: errText.slice(0, 800),
      });
    }
    const ai = await aiRes.json();
    const content = ai?.choices?.[0]?.message?.content;
    if (!content) {
      return json({
        success: false,
        retryable: true,
        error: "AI returned an empty response. Please retry.",
        detail: JSON.stringify(ai).slice(0, 600),
      });
    }

    let raw = typeof content === "string" ? content.trim() : String(content);
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    let homework: any;
    try {
      homework = JSON.parse(raw);
    } catch (_e) {
      // Repair attempt: extract the first balanced {...} block before giving up.
      const firstBrace = raw.indexOf("{");
      const lastBrace = raw.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        try {
          homework = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
        } catch (_e2) {
          /* fall through */
        }
      }
      if (!homework) {
        return json({
          success: false,
          retryable: true,
          error: "AI returned malformed JSON. Please retry.",
          detail: raw.slice(0, 600),
        });
      }
    }

    // ── Validate the 3-activity shape ───────────────────────────
    const a1 = homework?.activity_1_recognition;
    const a2 = homework?.activity_2_syntax;
    const a3 = homework?.activity_3_production;
    const valid =
      a1 && Array.isArray(a1.items) && a1.items.length >= 3 &&
      a2 && Array.isArray(a2.items) && a2.items.length >= 1 &&
      a3 && typeof a3.prompt === "string";
    if (!valid) {
      return json({
        success: false,
        retryable: true,
        error: "AI response did not match the expected 3-activity schema. Please retry.",
        detail: typeof homework === "object" ? JSON.stringify(homework).slice(0, 600) : String(homework).slice(0, 600),
      });
    }

    // Enrich for the player
    homework.meta = {
      hub,
      lesson_id: lesson_id || null,
      title: resolvedTitle,
      vocabulary: vocabStrings,
      grammar,
      phonics,
      image_style: resolvedImageStyle,
    };

    // ── Persist ────────────────────────────────────────────────
    const insertRow: Record<string, unknown> = {
      teacher_id: user.id,
      lesson_id: lesson_id || null,
      assigned_student_id: assigned_student_id || null,
      title: `Homework: ${resolvedTitle}`,
      description: a3?.prompt || "Auto-generated interactive homework",
      instructions:
        "Complete all three activities: Listen & Match, Sentence Scramble, and the Voice Challenge.",
      points: 50,
      due_date: due_date || null,
      status: "draft",
      content: homework,
      source: "ai-generated",
      image_style: resolvedImageStyle,
    };
    const { data: saved, error: saveErr } = await supabase
      .from("homework_assignments")
      .insert(insertRow)
      .select()
      .single();
    if (saveErr) {
      // Some columns (assigned_student_id / image_style) may be missing in older schemas — retry without them.
      const retryRow = { ...insertRow };
      delete retryRow.assigned_student_id;
      delete retryRow.image_style;
      const retry = await supabase.from("homework_assignments").insert(retryRow).select().single();
      if (retry.error) {
        return json({ error: "Failed to save homework", detail: retry.error.message, homework }, 500);
      }
      return json({ success: true, homework, assignment: retry.data });
    }

    return json({ success: true, homework, assignment: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ success: false, error: message }, 500);
  }
});
