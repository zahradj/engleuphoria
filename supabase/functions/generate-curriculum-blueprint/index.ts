// 4-Skills ESL Curriculum Blueprint Generator
// Outputs: { curriculum_title, units: [{ unit_title, theme, lessons: [{ lesson_id, title, skill_focus, learning_objective }] }] }

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
    const apiKey = Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
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
- If the Core Theme is empty, you MUST invent a highly engaging, age-appropriate, and creative theme yourself based on the requested CEFR Level and Age Group. Pick something fresh and motivating (e.g. for kids: "Dinosaur Detectives", for teens: "Esports & Streaming Culture", for adults: "Career Power Moves"). Do not default to bland topics like "General English".

REQUIREMENTS:
1. Every unit MUST have a single engaging central theme (e.g. "Travel Adventures", "Tech & Social Media", "Career Confidence").
2. Within each unit, lessons MUST systematically rotate through these skill focuses in order:
   1) Grammar  2) Vocabulary  3) Reading/Listening  4) Speaking
   (If more than 4 non-review lessons in a unit, cycle through them again.)
3. CRITICAL — Spaced repetition: the FINAL lesson of EVERY unit MUST have skill_focus = "Review". No exceptions.
4. Lesson titles must be specific and engaging — NOT generic ("Grammar Lesson 1" is forbidden).
5. Each objective must be a single concrete, observable outcome ("Students will be able to...").
6. Themes must progress logically across units (build complexity, don't repeat).
7. Variation seed: ${variationSeed} — use this to differ from past outputs.

OUTPUT STRICT JSON ONLY (no markdown, no code fences) matching this schema EXACTLY:
{
  "curriculum_title": "string — engaging title for the whole course",
  "units": [
    {
      "unit_number": number,
      "unit_title": "string",
      "theme": "string — the central theme of this unit",
      "lessons": [
        {
          "lesson_number": number,
          "title": "string — specific & engaging lesson title",
          "skill_focus": "Grammar | Vocabulary | Reading/Listening | Speaking | Review",
          "objective": "string — one observable outcome"
        }
      ]
    }
  ]
}`;

    const userPrompt = `Generate a curriculum with:
- ${safeUnits} units
- ${safeLessons} lessons per unit (the LAST lesson of each unit MUST be a "Review")
- Skill rotation for non-review lessons: ${SKILL_ROTATION.join(" → ")}
${hasTheme ? `- Core theme/topic: "${cleanTheme}"` : "- Core theme/topic: (none provided — invent a creative, age-appropriate one yourself)"}

Return ONLY the JSON object.`;

    // Use Lovable AI Gateway (Gemini via gateway) — fall back to direct Gemini if needed
    const useLovableGateway = !!Deno.env.get("LOVABLE_API_KEY");
    let aiResponse: Response;
    let rawText = "";

    if (useLovableGateway) {
      aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.85,
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("AI gateway error:", aiResponse.status, errText);
        return new Response(
          JSON.stringify({
            error: aiResponse.status === 429
              ? "Rate limit reached. Please wait a moment and try again."
              : "AI generation failed.",
            details: errText,
          }),
          { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }
      const j = await aiResponse.json();
      rawText = j?.choices?.[0]?.message?.content || "";
    } else {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      aiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.85,
            maxOutputTokens: 4096,
          },
        }),
      });
      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        return new Response(
          JSON.stringify({ error: "AI generation failed", details: errText }),
          { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }
      const j = await aiResponse.json();
      rawText = j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    // Strip markdown fences defensively
    rawText = rawText.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse JSON:", e, rawText.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "AI returned invalid JSON", raw: rawText.slice(0, 1000) }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
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
