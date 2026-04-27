// Generate a 15-20 slide progressive lesson via Lovable AI Gateway with strict tool-calling.
// The AI acts as a Master Curriculum Director: routes media (image vs video),
// enforces a 5-phase progressive arc, and forces divergent interactivity.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PHASES = ["Hook", "Presentation", "Practice", "Production", "Mission"] as const;
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
    } = body || {};

    if (!lesson_title) {
      return new Response(JSON.stringify({ error: "lesson_title is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are the EXPERT CURRICULUM DESIGNER for Engleuphoria — an elite ESL platform.
You are simultaneously: (1) a CEFR-aligned pedagogy expert, (2) a Multimodal Media Director, and (3) a gamification architect.
You are designing ONE classroom-ready 1-HOUR (≈60 minute) interactive session as a 20–25 slide deck.
Total slide count MUST be between 20 and 25 inclusive — never fewer than 20. A short deck is a FAILED deck.

═══════════════════════════════════════════════════════
RULE 1 — THE PROFESSIONAL 1-HOUR PPP ARC (MANDATORY)
═══════════════════════════════════════════════════════
The deck MUST follow this exact 5-phase progressive arc, in order:

• Phase 1 — HOOK / Real-Life Context (2–3 slides):
  Introduce the topic through a real-world artifact (a chat message, travel ticket, short dialogue, photo caption).
  Focus skills: Reading + Listening. slide_type "mascot_speech" or "flashcard".
• Phase 2 — PRESENTATION / Rules & Vocabulary (4–5 slides):
  Teach the core grammar rules and vocabulary clearly with high-quality visual examples.
  slide_type "mascot_speech" + "flashcard". Clean static "image" media.
• Phase 3 — CONTROLLED PRACTICE / Gamified (6–8 slides):
  Fast-paced active recall. MUST use a mix of "drag_and_match", "fill_in_the_gaps", and "multiple_choice".
  Focus skills: Grammar + Vocabulary.
• Phase 4 — FREER PRACTICE / Skill Blending (4–5 slides):
  Multi-skill blended tasks. e.g. read a short paragraph then answer comprehension; listen and reorder; write a caption.
  Use "multiple_choice", "fill_in_the_gaps", "drag_and_drop", "drawing_canvas".
• Phase 5 — FINAL MISSION / Production (2–3 slides):
  Real-world output task: the student WRITES a sentence or SOLVES a scenario based on what they learned
  (e.g., "Reply to this hotel email", "Write a 1-sentence message to your friend").
  Focus skills: Writing + Speaking. Use "drawing_canvas" (for handwriting/typing) or "drag_and_drop".

Phase totals must sum to 20–25. Distribution example: 3 + 5 + 7 + 5 + 3 = 23.

═══════════════════════════════════════════════════════
RULE 2 — SKILL TAGGING (MANDATORY for every slide)
═══════════════════════════════════════════════════════
Every slide MUST include a non-empty "target_skills" array drawn from:
["Reading", "Writing", "Listening", "Speaking", "Grammar", "Vocabulary"].
Across the FULL deck, AT LEAST 3 of the four CORE skills (Reading, Writing, Listening, Speaking) MUST appear.
A lesson that only drills Vocabulary + Grammar is a FAILED deck. Blend skills.

═══════════════════════════════════════════════════════
RULE 3 — AUDIO GATING (MANDATORY for every slide)
═══════════════════════════════════════════════════════
Every slide MUST include a boolean "requires_audio".
Set "requires_audio": true ONLY when audio is pedagogically essential:
  • Pronunciation modelling
  • Listening comprehension
  • Dialogue / conversation slides
  • Songs, chants, mascot greetings in the Hook
Set "requires_audio": false for pure grammar explanations, silent reading, drag-and-match vocab review,
fill-in-the-gaps grammar slides, and writing/production slides. Most Practice and Production slides
should be FALSE. Do not over-trigger audio — silence is a feature.

═══════════════════════════════════════════════════════
RULE 4 — SMART MEDIA ROUTING
═══════════════════════════════════════════════════════
For EVERY slide pick the best media_type for the visual_keyword:
• "image" — static nouns, adjectives, backgrounds for games, anything where motion would distract.
• "video" — action verbs, emotions, brain-breaks, hook energy.
If unsure, default to "image". Never miss a verb or emotion.

═══════════════════════════════════════════════════════
RULE 5 — DIVERGENT INTERACTIVITY (STRICTLY ENFORCED)
═══════════════════════════════════════════════════════
You are FORBIDDEN from placing two slides of the SAME slide_type back-to-back.
Constantly switch the student's physical action: Read → Listen → Click → Drag → Type → Speak.
Two consecutive "mascot_speech" slides allowed ONLY in the Hook phase.

═══════════════════════════════════════════════════════
RULE 6 — INTERACTIVE_DATA SHAPES (by slide_type)
═══════════════════════════════════════════════════════
• mascot_speech    → { "speech": string }
• multiple_choice  → { "question": string, "options": string[4], "correct_index": 0..3 }
• flashcard        → { "front": string, "back": string }
• drawing_canvas   → { "prompt": string }
• drag_and_drop    → { "instruction": string, "items": string[], "targets": string[], "pairs": [{"item": string, "target": string}] }
• drag_and_match   → { "instruction": string, "pairs": [{"left_item": string, "right_item": string, "left_thumbnail_keyword"?: string, "right_thumbnail_keyword"?: string}] }
                     // EXACTLY 3 pairs. Provide *_thumbnail_keyword (concrete noun, 1–3 words) for vocab pairs.
• fill_in_the_gaps → { "instruction": string, "sentence_parts": string[], "missing_word": string, "distractors": string[2..3] }

═══════════════════════════════════════════════════════
RULE 7 — MULTIMODAL MEDIA PROMPTS (always generate all three)
═══════════════════════════════════════════════════════
• "elevenlabs_script": Phonetic, kid-friendly TTS string under 120 chars.
• "image_generation_prompt": Detailed text-to-image prompt; end with "Vibrant flat illustration, solid pastel background, UI asset, no text, kid-friendly."
• "video_generation_prompt": 2–4s seamlessly looping motion; end with "seamless loop, solid pastel background, no text, no camera motion."

═══════════════════════════════════════════════════════
RULE 8 — GAMIFIED HOMEWORK MISSIONS (MANDATORY)
═══════════════════════════════════════════════════════
Generate EXACTLY 3 to 5 "homework_missions" — short app-style mini-games (Duolingo-style daily quests)
that recycle the lesson's TARGET VOCABULARY for asynchronous home practice.

Each mission MUST be one of:
• "memory_match"      → { mission_type, prompt, pairs: [{ term, match }] }   // 3–5 pairs
• "listen_and_choose" → { mission_type, prompt, target_word, options: string[3..4], correct_answer }
• "word_scramble"     → { mission_type, prompt, target_word, scrambled }

Rules: prompt is a short kid-friendly instruction. Vary mission_type. correct_answer ∈ options.
scrambled ≠ target_word (same letters, different order).

═══════════════════════════════════════════════════════
GENERAL TONE
═══════════════════════════════════════════════════════
Supportive, professional, joyful. Globally inclusive. CEFR-aligned. No placeholders, no mock content.
"content" = short on-slide text (1–3 sentences max), or empty if interactive_data carries the meaning.
"teacher_script" = 2–3 high-energy sentences for the teacher to read aloud.
Vary layout_style across the deck for visual rhythm.`;

    const userPrompt = `Lesson title: ${lesson_title}
Objective: ${objective ?? "(not provided)"}
Skill focus: ${skill_focus}
CEFR level: ${cefr_level}
Hub: ${hub}

Generate the dense 20–25 slide 1-hour PPP lesson now. Respect EVERY rule above:
the 5-phase arc, ≥20 slides, target_skills on every slide (≥3 of Reading/Writing/Listening/Speaking
across the deck), requires_audio set true ONLY when audio is pedagogically essential,
and 3–5 homework missions.`;

    const tool = {
      type: "function",
      function: {
        name: "emit_director_lesson",
        description:
          "Return a 20–25 slide 1-hour PPP lesson with target_skills + requires_audio per slide, plus 3–5 gamified homework missions.",
        parameters: {
          type: "object",
          properties: {
            slides: {
              type: "array",
              minItems: 20,
              maxItems: 25,
              items: {
                type: "object",
                properties: {
                  phase: { type: "string", enum: [...PHASES] },
                  slide_type: { type: "string", enum: [...SLIDE_TYPES] },
                  media_type: { type: "string", enum: [...MEDIA_TYPES] },
                  layout_style: { type: "string", enum: [...LAYOUTS] },
                  title: { type: "string" },
                  content: { type: "string" },
                  teacher_script: { type: "string" },
                  visual_keyword: { type: "string" },
                  elevenlabs_script: { type: "string" },
                  image_generation_prompt: { type: "string" },
                  video_generation_prompt: { type: "string" },
                  interactive_data_json: { type: "string" },
                  target_skills: {
                    type: "array",
                    minItems: 1,
                    items: { type: "string", enum: [...SKILLS] },
                  },
                  requires_audio: { type: "boolean" },
                },
                required: [
                  "phase",
                  "slide_type",
                  "media_type",
                  "layout_style",
                  "title",
                  "content",
                  "teacher_script",
                  "visual_keyword",
                  "elevenlabs_script",
                  "image_generation_prompt",
                  "video_generation_prompt",
                  "interactive_data_json",
                  "target_skills",
                  "requires_audio",
                ],
                additionalProperties: false,
              },
            },
            // 3–5 app-style mini-games for asynchronous homework. Sent to the AI as a
            // JSON string per item to keep the schema flat and avoid Gemini's strict
            // tool-schema validation issues with deeply-nested oneOf shapes.
            // Each element parses to one of the shapes documented in RULE 6.
            homework_missions: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: {
                type: "object",
                properties: {
                  mission_type: { type: "string", enum: [...MISSION_TYPES] },
                  prompt: { type: "string" },
                  // payload_json holds the type-specific fields (pairs / options /
                  // correct_answer / target_word / scrambled) as a stringified JSON
                  // object. We parse + validate it server-side below.
                  payload_json: { type: "string" },
                },
                required: ["mission_type", "prompt", "payload_json"],
                additionalProperties: false,
              },
            },
          },
          required: ["slides", "homework_missions"],
          additionalProperties: false,
        },
      },
    };

    async function callAI(): Promise<
      | { ok: true; slides: any[]; homework_missions: any[] }
      | { ok: false; status: number; detail: string }
    > {
      console.log("Sending payload to Gemini via Lovable AI Gateway...", { lesson_title, cefr_level, hub });
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "emit_director_lesson" } },
        }),
      });

      if (!aiResp.ok) {
        return { ok: false, status: aiResp.status, detail: await aiResp.text() };
      }

      const data = await aiResp.json();
      const argsRaw = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!argsRaw) {
        return { ok: false, status: 502, detail: "No tool_call in AI response" };
      }
      let parsedArgs: any;
      try {
        parsedArgs = JSON.parse(argsRaw);
      } catch (e) {
        return { ok: false, status: 502, detail: `Tool args JSON parse failed: ${(e as Error).message}` };
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
      return {
        id: crypto.randomUUID(),
        phase: s.phase,
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

    // ─── Homework missions: parse stringified payload + validate per-type shape ───
    const rawMissions: any[] = (aiResult as any).homework_missions ?? [];
    const homework_missions = rawMissions
      .map((m: any) => {
        let payload: any = {};
        if (m?.payload_json && typeof m.payload_json === "string") {
          try { payload = JSON.parse(m.payload_json); } catch { payload = {}; }
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
