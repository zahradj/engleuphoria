// 4-Skills ESL Curriculum Blueprint Generator
// Outputs: { curriculum_title, units: [{ unit_title, theme, lessons: [{ lesson_id, title, skill_focus, learning_objective }] }] }
// Migrated off Lovable AI — calls Google Gemini directly via GEMINI_API_KEY.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CEFR_RULES: Record<string, string> = {
  A1: "Absolute Beginner — present simple only, max 5-word sentences, ultra-concrete vocabulary, lots of repetition.",
  A2: "Elementary — present/past simple, present continuous, 'going to' future, daily-life vocabulary.",
  B1: "Intermediate — all past tenses, present perfect, first conditional, modals (should/must/might), opinions and plans.",
  B2: "Upper-Intermediate — all conditionals, passive, reported speech, abstract topics, collocations and phrasal verbs.",
  C1: "Advanced — inversion, cleft sentences, hedging, idioms, register shifts, academic and professional language.",
};

const SKILL_ROTATION = ["Grammar", "Vocabulary", "Reading/Listening", "Speaking"];
const VALID_SKILLS = ["Grammar", "Vocabulary", "Reading/Listening", "Speaking", "Review"];

// ── Dynamic Scope & Sequence: theme genre pools by CEFR band ────────────
// Hub names are NOT themes — these pools force diverse, age-appropriate
// genres regardless of which hub the user is generating for.
const GENRE_POOLS: Record<string, string[]> = {
  beginner: [
    "Space Adventure", "Magical Creatures", "Superheroes",
    "Under the Sea", "Robot Friends",
  ],
  intermediate: [
    "Detective Mystery", "Time Travel", "Sports Championship",
    "Jungle Survival", "Teen Drama",
  ],
  advanced: [
    "Business Negotiation", "Sci-Fi Cyberpunk", "Ethical Dilemma",
    "Global Tech Startup", "Historical Documentary",
  ],
};

function bandForCefr(cefr: string): "beginner" | "intermediate" | "advanced" {
  if (cefr === "A1") return "beginner";
  if (cefr === "A2" || cefr === "B1") return "intermediate";
  return "advanced"; // B2, C1, C2
}

function pickGenre(cefr: string): string {
  const pool = GENRE_POOLS[bandForCefr(cefr)];
  return pool[Math.floor(Math.random() * pool.length)];
}

// Tiny UUIDv4 generator (no external deps)
function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      cefr_level = "A2",
      age_group = "teens",
      unit_count = 4,
      lessons_per_unit = 4,
      theme_hint = "",
      hub = "academy",
      previous_topics = [],
    } = body;

    const safeUnits = Math.max(1, Math.min(10, Number(unit_count) || 4));
    const safeLessons = Math.max(2, Math.min(8, Number(lessons_per_unit) || 4));
    const cefrRule = CEFR_RULES[cefr_level] || CEFR_RULES.A2;
    const variationSeed = Math.random().toString(36).slice(2, 10);

    const cleanTheme = String(theme_hint || "").trim();
    const hasTheme = cleanTheme.length > 0;

    // Phase 2: Dynamic theme genre — only when user did NOT supply a theme.
    const chosenGenre = hasTheme ? null : pickGenre(cefr_level);

    // Phase 3: Anti-repetition — sanitize previous_topics input.
    const prevTopics: string[] = Array.isArray(previous_topics)
      ? previous_topics.map((t: any) => String(t || "").trim()).filter(Boolean).slice(0, 10)
      : [];

    const systemPrompt = `You are an elite ESL Curriculum Director and Expert Pedagogue. Generate a progressive, high-energy 4-skills English curriculum.

CEFR LEVEL CONSTRAINT: ${cefr_level} — ${cefrRule}
AGE GROUP: ${age_group}
HUB: ${hub}

CRITICAL — ANTI-LITERAL RULE:
The hub names (Playground, Academy, Success) indicate AGE and PROFICIENCY LEVEL only.
DO NOT generate literal lessons about playgrounds, schools, academies, or workplaces
unless the user's Core Theme explicitly requests them. Themes must be diverse, vivid,
imaginative, and unrelated to the hub's name.

THEME RULE:
- If a Core Theme is provided, base every unit around it and progress logically across units.
- If a Required Lesson Genre is provided below, you MUST build all units inside that genre,
  inventing distinct sub-themes per unit (still avoid the hub-name literal trap).
- Themes must progress logically across units (sub-topic → sub-topic, never repeating).

REQUIREMENTS:
1. Every unit MUST have a single engaging central theme.
2. Within each unit, lessons MUST systematically rotate through skill focuses in order: Grammar → Vocabulary → Reading/Listening → Speaking.
3. CRITICAL — Spaced repetition: the FINAL lesson of EVERY unit MUST have skill_focus = "Review". No exceptions.
4. Lesson titles must be specific, vivid, and age-appropriate (more mature as CEFR rises).
5. Each objective must be a single concrete observable outcome ("Students will be able to...").
6. Variation seed: ${variationSeed} — use this to differ from past outputs.

PER-LESSON STRUCTURED BLUEPRINT — MANDATORY:
Every lesson MUST include these structured fields (the downstream Unified Lesson Generator depends on them):
- communication_goal: ONE sentence describing the real-world task students will accomplish (derived from objective; concrete, observable).
- grammar_focus: array of 1–2 specific grammar structures appropriate to the CEFR level.
- vocabulary_focus: array of 6–${hub === "playground" ? 8 : hub === "academy" ? 14 : 16} target vocabulary items tied to the unit theme. Hub vocab cap: Playground 8, Academy 14, Success 16. Stay within cap.
- pronunciation_focus: array of 1–3 sounds/patterns relevant to the vocabulary_focus and CEFR level.
- phonics_focus: array of 0–3 phoneme/grapheme correspondences (only for Playground hub at Pre-A1/A1/A2; leave empty otherwise).
- review_targets: array of titles from EARLIER lessons in the same unit whose vocabulary/grammar will be recycled (empty for lesson 1).
- game_targets: array of 1–3 vocabulary items (drawn from vocabulary_focus) suitable for interactive mini-games.
- homework_targets: array of 1–3 vocabulary items (drawn from vocabulary_focus) suitable for at-home reinforcement.
- story_arc: ONE short sentence tying this lesson to the unit's narrative arc.

${prevTopics.length > 0 ? `ANTI-REPETITION — ABSOLUTELY FORBIDDEN:
You MUST NOT reuse any of the following themes, primary vocabulary, storylines, or settings
from the user's recent lessons: ${JSON.stringify(prevTopics)}.
Every unit theme and lesson title must be 100% original and semantically distinct from
that list. Do not paraphrase, swap synonyms, or relocate the same plot.` : ""}

Return STRICT JSON only.`;

    const userPrompt = `Generate a curriculum with:
- ${safeUnits} units
- ${safeLessons} lessons per unit (the LAST lesson of each unit MUST be a "Review")
- Skill rotation for non-review lessons: ${SKILL_ROTATION.join(" → ")}
${hasTheme
  ? `- Core theme/topic (user-supplied, mandatory): "${cleanTheme}"`
  : `- Required Lesson Genre (auto-selected for this CEFR band): "${chosenGenre}"
- No user theme was provided — invent vivid sub-themes inside the "${chosenGenre}" genre.`}

Return ONLY the JSON object.`;


    // Gemini responseSchema — note: NO `additionalProperties` (unsupported by Gemini API).
    const responseSchema = {
      type: "object",
      properties: {
        curriculum_title: { type: "string" },
        units: {
          type: "array",
          items: {
            type: "object",
            properties: {
              unit_number: { type: "integer" },
              unit_title: { type: "string" },
              theme: { type: "string" },
              lessons: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    lesson_number: { type: "integer" },
                    title: { type: "string" },
                    skill_focus: {
                      type: "string",
                      enum: ["Grammar", "Vocabulary", "Reading/Listening", "Speaking", "Review"],
                    },
                    objective: { type: "string" },
                    communication_goal: { type: "string" },
                    grammar_focus: { type: "array", items: { type: "string" } },
                    vocabulary_focus: { type: "array", items: { type: "string" } },
                    pronunciation_focus: { type: "array", items: { type: "string" } },
                    phonics_focus: { type: "array", items: { type: "string" } },
                    review_targets: { type: "array", items: { type: "string" } },
                    game_targets: { type: "array", items: { type: "string" } },
                    homework_targets: { type: "array", items: { type: "string" } },
                    story_arc: { type: "string" },
                  },
                  required: ["lesson_number", "title", "skill_focus", "objective"],
                },
              },
            },
            required: ["unit_number", "unit_title", "theme", "lessons"],
          },
        },
      },
      required: ["curriculum_title", "units"],
    };

    const buildRequestBody = (compact: boolean) =>
      JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: compact
                ? systemPrompt +
                  "\n\nCOMPACT MODE: Keep every string under 90 characters. Limit vocabulary_focus to 6 items, grammar_focus to 1 item, pronunciation_focus to 1 item, review_targets to 2 items. Omit story_arc."
                : systemPrompt,
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.85,
          maxOutputTokens: 32768,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

    const TRANSIENT = new Set([429, 500, 502, 503, 504]);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function callGemini(model: string, body: string): Promise<{ ok: true; data: any } | { ok: false; status: number; text: string }> {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const delays = [1500, 3000, 6000];
      let lastStatus = 0;
      let lastText = "";
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });
          if (r.ok) return { ok: true, data: await r.json() };
          lastStatus = r.status;
          lastText = await r.text();
          console.error(`Gemini ${model} attempt ${attempt + 1} → ${r.status}`, lastText.slice(0, 200));
          if (!TRANSIENT.has(r.status)) return { ok: false, status: r.status, text: lastText };
        } catch (e) {
          lastStatus = 0;
          lastText = String(e);
          console.error(`Gemini ${model} attempt ${attempt + 1} threw:`, e);
        }
        if (attempt < 2) await sleep(delays[attempt] + Math.floor(Math.random() * 400));
      }
      return { ok: false, status: lastStatus, text: lastText };
    }

    let geminiResult = await callGemini("gemini-2.5-flash", buildRequestBody(false));
    if (!geminiResult.ok && TRANSIENT.has(geminiResult.status)) {
      console.warn("Primary model exhausted, falling back to gemini-2.0-flash");
      geminiResult = await callGemini("gemini-2.0-flash", buildRequestBody(false));
    }

    if (!geminiResult.ok) {
      const isOverload = TRANSIENT.has(geminiResult.status);
      if (isOverload) {
        // Graceful payload — HTTP 200 so the client's handleAIResponse shows
        // the friendly amber "AI overloaded — Retry" toast instead of throwing.
        return new Response(
          JSON.stringify({
            error: true,
            message: "The AI curriculum engine is overloaded. Please retry in ~10 seconds.",
          }),
          { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "AI generation failed.", details: geminiResult.text.slice(0, 500) }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    let j = geminiResult.data;
    let candidate = j?.candidates?.[0];
    let finishReason = candidate?.finishReason;
    let rawText = (candidate?.content?.parts?.[0]?.text || "").trim();

    if (finishReason && finishReason !== "STOP") {
      console.error("Gemini finishReason non-STOP:", finishReason, "text length:", rawText.length);
    }

    const tryParse = (s: string): any | null => {
      try { return JSON.parse(s); } catch { return null; }
    };
    let parsed: any = tryParse(rawText);

    // Retry once in compact mode when AI ran out of tokens or returned invalid JSON.
    if ((!parsed || finishReason === "MAX_TOKENS") && (finishReason === "MAX_TOKENS" || !parsed)) {
      console.warn("Retrying generate-curriculum-blueprint in COMPACT mode (finishReason=", finishReason, ")");
      const retry = await callGemini("gemini-2.5-flash", buildRequestBody(true));
      if (retry.ok) {
        j = retry.data;
        candidate = j?.candidates?.[0];
        finishReason = candidate?.finishReason;
        rawText = (candidate?.content?.parts?.[0]?.text || "").trim();
        parsed = tryParse(rawText);
      }
    }

    if (!parsed) {
      console.error("Failed to parse Gemini JSON after retry. finishReason:", finishReason, "len:", rawText.length, rawText.slice(0, 500));
      const hint =
        finishReason === "MAX_TOKENS"
          ? "AI response was cut off (token limit). Try fewer units/lessons."
          : "AI returned invalid JSON. Please retry.";
      return new Response(
        JSON.stringify({ error: hint, finishReason, raw: rawText.slice(0, 1000) }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    // Lightweight runtime validation (tool-calling already enforces shape;
    // this guards against missing top-level keys).
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.units)) {
      return new Response(
        JSON.stringify({ error: "Blueprint missing 'units' array." }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    // Normalize a skill string to one of VALID_SKILLS
    const normalizeSkill = (raw: string): string => {
      const v = (raw || "").toLowerCase();
      if (v.startsWith("rev")) return "Review";
      if (v.startsWith("gram")) return "Grammar";
      if (v.startsWith("voc")) return "Vocabulary";
      if (v.startsWith("speak") || v.startsWith("role")) return "Speaking";
      if (v.includes("read") || v.includes("listen")) return "Reading/Listening";
      return "";
    };

    const VOCAB_CAP: Record<string, number> = { playground: 8, academy: 14, success: 16 };
    const vocabCap = VOCAB_CAP[String(hub).toLowerCase()] ?? 14;

    const asStrArr = (v: any, cap = 32): string[] =>
      Array.isArray(v)
        ? v
            .map((x) => String(x || "").trim())
            .filter(Boolean)
            .slice(0, cap)
        : [];

    // Inject UUIDs, numbering, enforce skill rotation, Review-last rule,
    // and pass through the enriched structured-blueprint fields with caps.
    const units = (parsed.units || []).slice(0, safeUnits).map((u: any, uIdx: number) => {
      const rawLessons = (u.lessons || []).slice(0, safeLessons);
      const unitTitlesSoFar: string[] = [];
      const lessons = rawLessons.map((l: any, idx: number) => {
        const isLast = idx === rawLessons.length - 1;
        let skill_focus: string;
        if (isLast) {
          skill_focus = "Review";
        } else {
          const expectedSkill = SKILL_ROTATION[idx % SKILL_ROTATION.length];
          const aiSkill = normalizeSkill(String(l.skill_focus || ""));
          skill_focus =
            aiSkill && aiSkill !== "Review" && VALID_SKILLS.includes(aiSkill)
              ? aiSkill
              : expectedSkill;
        }
        const objective = String(l.objective || l.learning_objective || "");
        const title = String(l.title || `Lesson ${idx + 1}`);
        const vocabulary_focus = asStrArr(l.vocabulary_focus, vocabCap);
        const review_targets =
          asStrArr(l.review_targets, 8).length > 0
            ? asStrArr(l.review_targets, 8)
            : unitTitlesSoFar.slice(); // default: every prior lesson in unit
        const game_targets = asStrArr(l.game_targets, 3);
        const homework_targets = asStrArr(l.homework_targets, 3);

        const enriched = {
          lesson_id: uuid(),
          lesson_number: idx + 1,
          title,
          skill_focus,
          objective,
          learning_objective: objective, // back-compat
          // ── Enriched structured blueprint ─────────────────────────
          communication_goal: String(l.communication_goal || objective || "").trim(),
          grammar_focus: asStrArr(l.grammar_focus, 4),
          vocabulary_focus,
          pronunciation_focus: asStrArr(l.pronunciation_focus, 4),
          phonics_focus:
            String(hub).toLowerCase() === "playground"
              ? asStrArr(l.phonics_focus, 4)
              : [],
          review_targets,
          adaptive_profile: {
            difficulty_tier: 3,
            scaffolding_boost: 0,
            pacing_hint: "maintain",
          },
          story_state: {
            theme: String(u.theme || "General English"),
            arc: String(l.story_arc || `Unit ${uIdx + 1} · Lesson ${idx + 1}`),
            characters: [],
          },
          game_targets: game_targets.length ? game_targets : vocabulary_focus.slice(0, 3),
          homework_targets: homework_targets.length
            ? homework_targets
            : vocabulary_focus.slice(0, 3),
        };
        unitTitlesSoFar.push(title);
        return enriched;
      });
      return {
        unit_number: uIdx + 1,
        unit_title: String(u.unit_title || `Unit ${uIdx + 1}`),
        theme: String(u.theme || "General English"),
        lessons,
      };
    });

    return new Response(
      JSON.stringify({
        curriculum_title: String(parsed.curriculum_title || "English Curriculum"),
        cefr_level,
        age_group,
        hub,
        chosen_genre: chosenGenre,
        previous_topics_count: prevTopics.length,
        units,
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error", details: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
