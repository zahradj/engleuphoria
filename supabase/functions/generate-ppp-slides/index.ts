// Generate a 15-20 slide progressive lesson via Lovable AI Gateway with strict tool-calling.
// The AI acts as a Master Curriculum Director: routes media (image vs video),
// enforces a 5-phase progressive arc, and forces divergent interactivity.
//
// Hub-aware (Playground / Academy / Success) and framework-aware (the blueprint's
// `phases[]` array dictates lesson_phase order, not a hardcoded sequence).
import {
  buildPhaseSequenceBlock,
  buildSlideHubBlock,
  isPhase,
  normalizeHub,
  type LessonPhase,
} from "../_shared/hubProfiles.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PHASES = ["Hook", "Presentation", "Practice", "Production", "Mission"] as const;
// 6-Step Integrated Skills Blueprint — every slide MUST be tagged with one of these.
const LESSON_PHASES = [
  "Vocabulary",
  "Reading",
  "Comprehension",
  "Grammar",
  "Speaking",
  "Writing",
] as const;
const SLIDE_TYPES = [
  "mascot_speech",
  "multiple_choice",
  "drawing_canvas",
  "drag_and_drop",
  "flashcard",
  "drag_and_match",
  "fill_in_the_gaps",
] as const;
const MEDIA_TYPES = ["image", "video"] as const;
const LAYOUTS = ["split_left", "split_right", "center_card", "full_background"] as const;
const MISSION_TYPES = ["memory_match", "listen_and_choose", "word_scramble"] as const;
const SKILLS = ["Reading", "Writing", "Listening", "Speaking", "Grammar", "Vocabulary"] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      lesson_title,
      objective,
      skill_focus = "Vocabulary",
      cefr_level = "A1",
      hub = "academy",
      target_hub, // ← preferred new field; falls back to `hub`
      blueprint, // ← Approved Blueprint (optional). When present, treated as ground truth.
    } = body || {};

    // Allow the title to fall back to blueprint.lesson_title when caller omits it.
    const effectiveTitle: string | undefined = lesson_title || blueprint?.lesson_title;
    if (!effectiveTitle) {
      return new Response(JSON.stringify({ error: "lesson_title is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const resolvedHub = normalizeHub(target_hub ?? blueprint?.target_hub ?? hub);
    const hubBlock = buildSlideHubBlock(resolvedHub, cefr_level);

    // Phase sequence — driven by the blueprint when present, else fall back to the
    // legacy 6-step Integrated Skills order.
    const blueprintPhases: LessonPhase[] = Array.isArray(blueprint?.phases)
      ? blueprint!.phases.filter(isPhase)
      : [];
    const usingDynamicPhases = blueprintPhases.length >= 4;
    const dynamicPhaseBlock = usingDynamicPhases
      ? buildPhaseSequenceBlock(blueprintPhases, blueprint?.pedagogical_framework)
      : "";

    const systemPrompt = `You are the EXPERT CURRICULUM DESIGNER for Engleuphoria — an elite ESL platform.
You design ONE classroom-ready 1-HOUR (≈60 minute) deeply COHESIVE interactive lesson as a 20–25 slide deck.
Total slide count MUST be between 20 and 25 inclusive — never fewer than 20.

You think like a chess master 5 moves ahead. The vocabulary you teach in Phase 1 MUST appear in
the reading passage in Phase 2. The grammar rule you extract in Phase 4 MUST be required in
Phase 5 speaking and Phase 6 writing prompts. Every slide is part of one woven story.

═══════════════════════════════════════════════════════
RULE 1 — THE 6-STEP INTEGRATED SKILLS BLUEPRINT (STRICT ORDER, MANDATORY)
═══════════════════════════════════════════════════════
The deck MUST follow this EXACT 6-phase sequence, in order. Every slide MUST be tagged with
"lesson_phase" matching one of: "Vocabulary" | "Reading" | "Comprehension" | "Grammar" | "Speaking" | "Writing".

• Phase 1 — VOCABULARY INTRO  (3–4 slides, lesson_phase = "Vocabulary")
  Introduce 5–8 target words (the TARGET LEXICON). Each must include a clear definition + an example sentence.
  End the phase with at least ONE quick check: a "drag_and_match" or "multiple_choice" slide to verify recognition.
  slide_type mix: "flashcard", "mascot_speech", "drag_and_match", "multiple_choice".

• Phase 2 — CONTEXTUAL READING  (1–3 slides, lesson_phase = "Reading")
  A reading passage (article, story, dialogue, email, message thread) that NATURALLY incorporates the
  Phase 1 TARGET LEXICON. Every Phase-1 vocabulary word MUST appear at least once in the reading.
  IMPORTANT: If the total reading text exceeds 100 words, split it across MULTIPLE consecutive
  Reading slides (e.g., paragraph-by-paragraph). Never put a wall of text on a single slide.
  Wrap every TARGET LEXICON word in the reading text with **double asterisks** (markdown bold)
  so the renderer can highlight them for the student. Example: "She **ordered** a coffee."
  slide_type: "mascot_speech" or "flashcard". layout_style should be "split_left" for reading slides.

• Phase 3 — COMPREHENSION CHECK  (3–4 slides, lesson_phase = "Comprehension")
  Gamified questions that test understanding of the Phase 2 reading.
  Use a mix of "fill_in_the_gaps" and "multiple_choice". No two same slide_type back-to-back.

• Phase 4 — GRAMMAR FOCUS  (4–5 slides, lesson_phase = "Grammar")
  Extract ONE grammar rule actually used in the Phase 2 reading. First explain the rule clearly
  (mascot_speech / flashcard). Then drill with controlled practice: "drag_and_match" (matching tense
  forms), "fill_in_the_gaps" (rule application), or "multiple_choice".

• Phase 5 — SPEAKING / DISCUSSION  (2–3 slides, lesson_phase = "Speaking")
  Open-ended speaking prompts or roleplay scenarios that REQUIRE the student to use BOTH the
  Phase-1 target lexicon AND the Phase-4 grammar rule. set requires_audio = true on these slides.
  slide_type: "mascot_speech" (with prompt in interactive_data) or "drawing_canvas".

• Phase 6 — WRITING & HOMEWORK MISSIONS  (2–3 slides, lesson_phase = "Writing")
  Final production. The student WRITES (drawing_canvas or fill_in_the_gaps with longer answers)
  using the target lexicon + grammar in a real-world scenario (reply to an email, write a caption,
  send a message). The 3–5 homework_missions reinforce the same TARGET LEXICON.

Phase totals MUST sum to 20–25. Distribution example: 4 + 2 + 4 + 5 + 3 + 3 = 21.

═══════════════════════════════════════════════════════
RULE 2 — SKILL TAGGING (MANDATORY for every slide)
═══════════════════════════════════════════════════════
Every slide MUST include a non-empty "target_skills" array drawn from:
["Reading", "Writing", "Listening", "Speaking", "Grammar", "Vocabulary"].
Across the FULL deck, AT LEAST 3 of the four CORE skills (Reading, Writing, Listening, Speaking) MUST appear.

═══════════════════════════════════════════════════════
RULE 3 — AUDIO GATING (MANDATORY for every slide)
═══════════════════════════════════════════════════════
Every slide MUST include a boolean "requires_audio".
true ONLY for: pronunciation modelling, listening comprehension, dialogue, songs, and Phase-5 Speaking prompts.
false for: silent reading, drag-and-match, fill-in-the-gaps, grammar explanation, writing.

═══════════════════════════════════════════════════════
RULE 4 — SMART MEDIA ROUTING
═══════════════════════════════════════════════════════
For EVERY slide pick the best media_type for the visual_keyword:
• "image" — static nouns, adjectives, reading-supportive scene art, backgrounds for games.
• "video" — action verbs, emotions, brain-breaks, hook energy.
If unsure, default to "image".

═══════════════════════════════════════════════════════
RULE 5 — DIVERGENT INTERACTIVITY
═══════════════════════════════════════════════════════
You are FORBIDDEN from placing two slides of the SAME slide_type back-to-back, EXCEPT consecutive
"mascot_speech" slides inside the Reading phase (multi-slide passages) or the Vocabulary phase (intros).

═══════════════════════════════════════════════════════
RULE 6 — INTERACTIVE_DATA SHAPES (by slide_type)
═══════════════════════════════════════════════════════
• mascot_speech    → { "speech": string }
• multiple_choice  → { "question": string, "options": string[4], "correct_index": 0..3 }
• flashcard        → { "front": string, "back": string }
• drawing_canvas   → { "prompt": string }
• drag_and_drop    → { "instruction": string, "items": string[], "targets": string[], "pairs": [{"item": string, "target": string}] }
• drag_and_match   → { "instruction": string, "pairs": [{"left_item": string, "right_item": string, "left_thumbnail_keyword"?: string, "right_thumbnail_keyword"?: string}] }
                     // EXACTLY 3 pairs.
• fill_in_the_gaps → { "instruction": string, "sentence_parts": string[], "missing_word": string, "distractors": string[2..3] }

For EVERY interactive slide (multiple_choice, drag_and_match, fill_in_the_gaps, drag_and_drop) you
MUST also include a top-level "hint_text": short kid-friendly hint (≤ 90 chars) revealed after the
student's first wrong answer. Never spoil the answer outright — guide them. Example for a past
tense gap: "Past tense often ends in -ed."

═══════════════════════════════════════════════════════
RULE 7 — MULTIMODAL MEDIA PROMPTS
═══════════════════════════════════════════════════════
• "elevenlabs_script": Phonetic, kid-friendly TTS string under 120 chars.
• "image_generation_prompt": Detailed text-to-image prompt; end with "Vibrant flat illustration, solid pastel background, UI asset, no text, kid-friendly."
• "video_generation_prompt": 2–4s seamlessly looping motion; end with "seamless loop, solid pastel background, no text, no camera motion."

═══════════════════════════════════════════════════════
RULE 8 — GAMIFIED HOMEWORK MISSIONS (MANDATORY)
═══════════════════════════════════════════════════════
Generate EXACTLY 3 to 5 "homework_missions" that recycle the Phase-1 TARGET LEXICON.
Each mission MUST be one of:
• "memory_match"      → { mission_type, prompt, pairs: [{ term, match }] }   // 3–5 pairs
• "listen_and_choose" → { mission_type, prompt, target_word, options: string[3..4], correct_answer }
• "word_scramble"     → { mission_type, prompt, target_word, scrambled }
Vary mission_type. correct_answer ∈ options. scrambled ≠ target_word.

═══════════════════════════════════════════════════════
GENERAL TONE
═══════════════════════════════════════════════════════
Supportive, professional, joyful. CEFR-aligned. No placeholders.
"content" = short on-slide text (1–3 sentences max). For Reading slides, "content" carries the
passage paragraph (with **bold** target words).
"teacher_script" = 2–3 high-energy sentences for the teacher to read aloud.

${hubBlock}

${dynamicPhaseBlock ? dynamicPhaseBlock + "\n\nThe DYNAMIC PHASE SEQUENCE above OVERRIDES the default 6-step order in RULE 1 — follow the dynamic order instead, but keep all other RULE 1 phase requirements (vocab counts, reading word coverage, grammar drilling, etc.)." : ""}`;

    // ── BLUEPRINT GROUND-TRUTH BLOCK (only when caller supplied a blueprint) ──
    let blueprintBlock = "";
    if (blueprint && typeof blueprint === "object") {
      const vocabList = Array.isArray(blueprint.target_vocabulary)
        ? blueprint.target_vocabulary
            .filter((v: any) => v && typeof v.word === "string" && v.word.trim())
            .map((v: any) => {
              const def = v.definition ? ` — ${v.definition}` : "";
              const ex = v.example ? `  e.g. "${v.example}"` : "";
              return `  • ${v.word}${def}${ex}`;
            })
            .join("\n")
        : "";
      blueprintBlock = `

═══════════════════════════════════════════════════════
APPROVED BLUEPRINT — TREAT AS GROUND TRUTH
═══════════════════════════════════════════════════════
The teacher has reviewed and approved this plan. You MUST NOT invent additional vocabulary
words or substitute the grammar rule with a different one.

TARGET LEXICON (Phase 1 must teach EXACTLY these words, in this order — every word must
also appear at least once, wrapped in **bold**, inside the Phase-2 reading passage):
${vocabList}

TARGET GRAMMAR RULE (Phase 4 must teach this and ONLY this):
  "${blueprint.target_grammar_rule ?? ""}"
${blueprint.grammar_explanation ? `Teacher rationale: ${blueprint.grammar_explanation}` : ""}

READING DIRECTION (Phase 2 passage MUST follow this summary — same genre, scenario, characters):
  ${blueprint.reading_passage_summary ?? ""}

FINAL MISSION (Phase 5/6 production MUST end with this exact task):
  ${blueprint.final_speaking_mission ?? ""}
`;
    }

    const userPrompt = `Lesson title: ${effectiveTitle}
Objective: ${objective ?? "(not provided)"}
Skill focus: ${skill_focus}
CEFR level: ${cefr_level}
Hub: ${hub}
${blueprintBlock}
Generate the dense 20–25 slide 1-hour lesson NOW following the 6-Step Integrated Skills Blueprint
EXACTLY (Vocabulary → Reading → Comprehension → Grammar → Speaking → Writing). Every slide MUST be
tagged with lesson_phase. The Phase-2 reading passage MUST reuse Phase-1 vocabulary (wrapped in
**bold**), and Phase 5 + 6 MUST require both the lexicon and the Phase-4 grammar rule.`;


    // JSON-mode contract appended to the system prompt. We avoid Gemini's
    // tool-calling structured-output validator entirely (it caps schema
    // "states" and rejects our 16-field × 20-25 item shape). Instead we
    // ask for a single JSON object and validate server-side.
    const jsonContract = `

═══════════════════════════════════════════════════════
OUTPUT FORMAT (STRICT)
═══════════════════════════════════════════════════════
Respond with a SINGLE valid JSON object — no prose, no markdown, no code fences.
Top-level shape:
{
  "slides": [ /* 20–25 slide objects */ ],
  "homework_missions": [ /* 3–5 mission objects */ ]
}

Each slide object MUST have these keys:
  "phase": "Hook" | "Presentation" | "Practice" | "Production" | "Mission",
  "lesson_phase": "Vocabulary" | "Reading" | "Comprehension" | "Grammar" | "Speaking" | "Writing",
  "slide_type": "mascot_speech" | "multiple_choice" | "drawing_canvas" | "drag_and_drop" | "flashcard" | "drag_and_match" | "fill_in_the_gaps",
  "media_type": "image" | "video",
  "layout_style": "split_left" | "split_right" | "center_card" | "full_background",
  "title": string,
  "content": string,
  "teacher_script": string,
  "visual_keyword": string,
  "elevenlabs_script": string,
  "image_generation_prompt": string,
  "video_generation_prompt": string,
  "interactive_data": object,  // shape per RULE 6 (NOT stringified)
  "hint_text": string,         // required for interactive slides
  "target_skills": string[],   // ≥1 of Reading/Writing/Listening/Speaking/Grammar/Vocabulary
  "requires_audio": boolean

Each homework mission object MUST have:
  "mission_type": "memory_match" | "listen_and_choose" | "word_scramble",
  "prompt": string,
  // PLUS the type-specific keys directly on the object:
  // memory_match → "pairs": [{"term":string,"match":string}]   (3–5 pairs)
  // listen_and_choose → "target_word":string, "options":string[3..4], "correct_answer":string
  // word_scramble → "target_word":string, "scrambled":string

Return ONLY the JSON object.`;

    async function callAI(): Promise<
      | { ok: true; slides: any[]; homework_missions: any[] }
      | { ok: false; status: number; detail: string }
    > {
      console.log("Sending payload to Gemini via Lovable AI Gateway...", { lesson_title: effectiveTitle, cefr_level, hub, hasBlueprint: !!blueprint });
      // NOTE: We deliberately omit `response_format` and `tools`. The Lovable
      // gateway converts both into a Gemini responseSchema that exceeds the
      // provider's "schema states" limit for our 16-field × 20–25 item shape.
      // The prompt itself instructs Gemini to emit a single JSON object; we
      // strip any code fences and parse defensively below.
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt + jsonContract },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!aiResp.ok) {
        return { ok: false, status: aiResp.status, detail: await aiResp.text() };
      }

      const data = await aiResp.json();
      const raw = data?.choices?.[0]?.message?.content;
      if (!raw || typeof raw !== "string") {
        return { ok: false, status: 502, detail: "No content in AI response" };
      }
      // Extract the largest {...} block — handles code fences and any
      // leading/trailing prose the model might emit.
      let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      let parsedArgs: any;
      try {
        parsedArgs = JSON.parse(cleaned);
      } catch (e) {
        return { ok: false, status: 502, detail: `JSON parse failed: ${(e as Error).message}` };
      }
      if (!parsedArgs || !Array.isArray(parsedArgs.slides) || parsedArgs.slides.length === 0) {
        return { ok: false, status: 502, detail: "Validation failed: missing slides[]" };
      }
      const homework = Array.isArray(parsedArgs.homework_missions) ? parsedArgs.homework_missions : [];
      return { ok: true, slides: parsedArgs.slides, homework_missions: homework };
    }

    let aiResult = await callAI();
    if (!aiResult.ok && aiResult.status === 502) {
      // One automatic retry on validation/structural failures.
      console.warn("First AI call failed validation — retrying once.", aiResult.detail);
      aiResult = await callAI();
    }

    if (!aiResult.ok) {
      if (aiResult.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResult.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      console.error("AI gateway error:", aiResult.status, aiResult.detail);
      return new Response(JSON.stringify({ error: "AI gateway error", detail: aiResult.detail }), {
        status: aiResult.status >= 500 ? 502 : aiResult.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawSlides: any[] = aiResult.slides;

    // Post-process: enforce divergent interactivity (no two same slide_type back-to-back, except Hook).
    for (let i = 1; i < rawSlides.length; i++) {
      const prev = rawSlides[i - 1];
      const curr = rawSlides[i];
      const inHook = prev?.phase === "Hook" && curr?.phase === "Hook";
      if (!inHook && prev?.slide_type && curr?.slide_type === prev.slide_type) {
        console.warn(
          `Director violation at slide ${i + 1}: ${curr.slide_type} repeated. Consider regenerating.`,
        );
      }
    }

    const CORE_SKILLS = new Set(["Reading", "Writing", "Listening", "Speaking"]);
    const slides = rawSlides.map((s: any) => {
      const rawSkills: string[] = Array.isArray(s.target_skills)
        ? s.target_skills.filter((x: any) => typeof x === "string")
        : [];
      const target_skills = rawSkills.length > 0 ? rawSkills : ["Vocabulary"];
      // Audio gate: trust the AI's boolean; if missing, infer conservatively (only true for Listening/Speaking).
      const requires_audio = typeof s.requires_audio === "boolean"
        ? s.requires_audio
        : target_skills.some((k) => k === "Listening" || k === "Speaking");
      const lesson_phase = (LESSON_PHASES as readonly string[]).includes(s.lesson_phase)
        ? s.lesson_phase
        : "Vocabulary";
      return {
        id: crypto.randomUUID(),
        phase: s.phase,
        lesson_phase,
        slide_type: s.slide_type,
        media_type: s.media_type ?? "image",
        layout_style: s.layout_style ?? "center_card",
        title: s.title,
        content: s.content,
        teacher_script: s.teacher_script,
        visual_keyword: s.visual_keyword,
        elevenlabs_script: s.elevenlabs_script ?? "",
        image_generation_prompt: s.image_generation_prompt ?? "",
        video_generation_prompt: s.video_generation_prompt ?? "",
        target_skills,
        requires_audio,
        hint_text: typeof s.hint_text === "string" ? s.hint_text : "",
        interactive_data: (() => {
          if (s.interactive_data && typeof s.interactive_data === "object") return s.interactive_data;
          if (typeof s.interactive_data_json === "string") {
            try { return JSON.parse(s.interactive_data_json); } catch { return {}; }
          }
          return {};
        })(),
      };
    });

    // Deck-level validation: at least 3 distinct CORE skills used, and ≥20 slides.
    const coreSkillsUsed = new Set<string>();
    for (const s of slides) {
      for (const k of s.target_skills) if (CORE_SKILLS.has(k)) coreSkillsUsed.add(k);
    }
    if (slides.length < 20) {
      console.warn(`Density violation: deck has ${slides.length} slides (<20). 1-hour target missed.`);
    }
    if (coreSkillsUsed.size < 3) {
      console.warn(
        `Skill-blend violation: only ${coreSkillsUsed.size} of 4 core skills covered (${[...coreSkillsUsed].join(", ")}). Need ≥3.`,
      );
    }

    // 6-Step Blueprint validation: all 6 lesson_phases must appear, in non-decreasing order.
    const phasesPresent = new Set(slides.map((s) => s.lesson_phase));
    const missing = LESSON_PHASES.filter((p) => !phasesPresent.has(p));
    if (missing.length) {
      console.warn(`Blueprint violation: missing lesson_phase(s): ${missing.join(", ")}`);
    }
    const phaseOrderIndex = (p: string) => LESSON_PHASES.indexOf(p as any);
    for (let i = 1; i < slides.length; i++) {
      if (phaseOrderIndex(slides[i].lesson_phase) < phaseOrderIndex(slides[i - 1].lesson_phase)) {
        console.warn(
          `Blueprint order violation at slide ${i + 1}: ${slides[i].lesson_phase} after ${slides[i - 1].lesson_phase}.`,
        );
      }
    }

    // ─── Homework missions: parse stringified payload + validate per-type shape ───
    const rawMissions: any[] = (aiResult as any).homework_missions ?? [];
    const homework_missions = rawMissions
      .map((m: any) => {
        // Prefer direct keys on the mission (new JSON-mode shape).
        // Fall back to legacy payload_json string if the model returns it.
        let payload: any = m ?? {};
        if (m?.payload_json && typeof m.payload_json === "string") {
          try { payload = { ...payload, ...JSON.parse(m.payload_json) }; } catch { /* keep payload */ }
        }
        const base = {
          id: crypto.randomUUID(),
          mission_type: m?.mission_type,
          prompt: m?.prompt ?? "",
        };
        switch (m?.mission_type) {
          case "memory_match": {
            const pairs = Array.isArray(payload.pairs)
              ? payload.pairs.filter((p: any) => p?.term && p?.match)
              : [];
            return pairs.length >= 2 ? { ...base, pairs } : null;
          }
          case "listen_and_choose": {
            const options = Array.isArray(payload.options) ? payload.options.filter((o: any) => typeof o === "string") : [];
            const target = typeof payload.target_word === "string" ? payload.target_word : "";
            const correct = typeof payload.correct_answer === "string" ? payload.correct_answer : target;
            if (!target || options.length < 2 || !options.includes(correct)) return null;
            return { ...base, target_word: target, options, correct_answer: correct };
          }
          case "word_scramble": {
            const target = typeof payload.target_word === "string" ? payload.target_word : "";
            let scrambled = typeof payload.scrambled === "string" ? payload.scrambled : "";
            if (!target) return null;
            // Self-heal: if scrambled is missing or equals target, shuffle locally.
            if (!scrambled || scrambled.toLowerCase() === target.toLowerCase()) {
              const arr = target.split("");
              for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
              }
              scrambled = arr.join("");
              if (scrambled.toLowerCase() === target.toLowerCase()) scrambled = target.split("").reverse().join("");
            }
            return { ...base, target_word: target, scrambled };
          }
          default:
            return null;
        }
      })
      .filter(Boolean);

    if (homework_missions.length < 3) {
      console.warn(
        `Director returned only ${homework_missions.length} valid homework missions (need 3-5). Returning what we have.`,
      );
    }

    // ── Blueprint coverage validation: every approved word must appear in a Phase-1 slide ──
    if (blueprint && Array.isArray(blueprint.target_vocabulary)) {
      const phase1Text = slides
        .filter((s: any) => s.lesson_phase === "Vocabulary")
        .map((s: any) => `${s.title ?? ""} ${s.content ?? ""} ${s.teacher_script ?? ""} ${JSON.stringify(s.interactive_data ?? {})}`)
        .join(" ")
        .toLowerCase();
      const missing: string[] = blueprint.target_vocabulary
        .map((v: any) => (typeof v?.word === "string" ? v.word.trim() : ""))
        .filter((w: string) => w && !phase1Text.includes(w.toLowerCase()));
      if (missing.length > 0) {
        console.warn("Blueprint vocabulary coverage gap:", missing);
        return new Response(
          JSON.stringify({
            error: `Generated lesson skipped these target words in Phase 1: ${missing.join(", ")}. Please regenerate.`,
            missing,
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(JSON.stringify({ slides, homework_missions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error("generate-ppp-slides error:", err.message, err.stack);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
