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
    } = body;

    const safeUnits = Math.max(1, Math.min(10, Number(unit_count) || 4));
    const safeLessons = Math.max(2, Math.min(8, Number(lessons_per_unit) || 4));
    const cefrRule = CEFR_RULES[cefr_level] || CEFR_RULES.A2;
    const variationSeed = Math.random().toString(36).slice(2, 10);

    const cleanTheme = String(theme_hint || "").trim();
    const hasTheme = cleanTheme.length > 0;

    const systemPrompt = `You are an elite ESL Curriculum Director. Generate a progressive, high-energy 4-skills English curriculum.

CEFR LEVEL CONSTRAINT: ${cefr_level} — ${cefrRule}
AGE GROUP: ${age_group}
HUB: ${hub}

THEME RULE:
- If a Core Theme is provided, base the units around it and progress logically across them.
- If the Core Theme is empty, you MUST invent a highly engaging, age-appropriate, and creative theme yourself based on the requested CEFR Level and Age Group.

REQUIREMENTS:
1. Every unit MUST have a single engaging central theme.
2. Within each unit, lessons MUST systematically rotate through skill focuses in order: Grammar → Vocabulary → Reading/Listening → Speaking.
3. CRITICAL — Spaced repetition: the FINAL lesson of EVERY unit MUST have skill_focus = "Review". No exceptions.
4. Lesson titles must be specific and engaging.
5. Each objective must be a single concrete observable outcome ("Students will be able to...").
6. Themes must progress logically across units.
7. Variation seed: ${variationSeed} — use this to differ from past outputs.

Return STRICT JSON only.`;

    const userPrompt = `Generate a curriculum with:
- ${safeUnits} units
- ${safeLessons} lessons per unit (the LAST lesson of each unit MUST be a "Review")
- Skill rotation for non-review lessons: ${SKILL_ROTATION.join(" → ")}
${hasTheme ? `- Core theme/topic: "${cleanTheme}"` : "- Core theme/topic: (none provided — invent a creative, age-appropriate one yourself)"}

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

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const aiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.85,
          // Big enough for up to 10 units × 8 lessons.
          // gemini-2.5-flash silently consumes "thinking" tokens out of this
          // budget, so 4096 truncates mid-JSON. 16k is safe.
          maxOutputTokens: 16384,
          // Disable hidden chain-of-thought so the entire budget goes to JSON.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Gemini error:", aiResponse.status, errText);
      const status = aiResponse.status === 429 ? 429 : 500;
      const msg =
        aiResponse.status === 429
          ? "Gemini rate limit reached. Please wait a moment and try again."
          : "AI generation failed.";
      return new Response(
        JSON.stringify({ error: msg, details: errText.slice(0, 500) }),
        { status, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const j = await aiResponse.json();
    const candidate = j?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const rawText = (candidate?.content?.parts?.[0]?.text || "").trim();

    if (finishReason && finishReason !== "STOP") {
      console.error("Gemini finishReason non-STOP:", finishReason, "text length:", rawText.length);
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e, "finishReason:", finishReason, "len:", rawText.length, rawText.slice(0, 500));
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

    // Inject UUIDs, numbering, and enforce skill rotation + Review-last rule
    const units = (parsed.units || []).slice(0, safeUnits).map((u: any, uIdx: number) => {
      const rawLessons = (u.lessons || []).slice(0, safeLessons);
      const lessons = rawLessons.map((l: any, idx: number) => {
        const isLast = idx === rawLessons.length - 1;
        let skill_focus: string;
        if (isLast) {
          skill_focus = "Review"; // hard rule: last lesson is always Review
        } else {
          const expectedSkill = SKILL_ROTATION[idx % SKILL_ROTATION.length];
          const aiSkill = normalizeSkill(String(l.skill_focus || ""));
          skill_focus =
            aiSkill && aiSkill !== "Review" && VALID_SKILLS.includes(aiSkill)
              ? aiSkill
              : expectedSkill;
        }
        const objective = String(l.objective || l.learning_objective || "");
        return {
          lesson_id: uuid(),
          lesson_number: idx + 1,
          title: String(l.title || `Lesson ${idx + 1}`),
          skill_focus,
          objective,
          // back-compat for older consumers
          learning_objective: objective,
        };
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
        units,
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
