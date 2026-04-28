// Generate a structured Lesson Blueprint via Lovable AI Gateway.
// Step 1 of the Blueprint-First architecture: the teacher reviews and edits
// this plan BEFORE the full 20+ slide deck is produced by generate-ppp-slides.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      topic,
      target_audience,
      cefr_level = "A2",
      hub = "academy",
      skill_focus = "Mixed Skills",
      source_material = "",
      source_url = "",
    } = body || {};

    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!target_audience || typeof target_audience !== "string") {
      return new Response(JSON.stringify({ error: "target_audience is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an EXPERT ESL CURRICULUM PLANNER for Engleuphoria.
Your job is to draft a COHESIVE 1-hour lesson BLUEPRINT — the structured plan that a teacher
will review and edit BEFORE the full 20-slide deck is generated.

Hard rules:
• target_vocabulary MUST contain 5–8 distinct words tightly tied to the topic. Each item needs a
  short definition (≤ 12 words) and one natural example sentence (≤ 18 words) using the word.
• target_grammar_rule MUST be ONE focused, teachable structure (e.g. "Past Simple regular verbs",
  "Comparative adjectives with -er/than", "Modal 'should' for advice"). Never list multiple rules.
• grammar_explanation: 1–2 sentence teacher-facing rationale explaining when/why students use it.
• reading_passage_summary: 2–4 sentences describing the Phase-2 passage (genre, scenario, characters)
  WITHOUT writing the passage itself. The passage will reuse every target_vocabulary word.
• final_speaking_mission: ONE concrete production task (≤ 30 words) that requires both the lexicon
  AND the grammar rule. Example: "Tell your partner about the last trip you took, using at least
  three new words and three Past Simple verbs."
• lesson_title: short, vivid, classroom-ready (≤ 60 chars).

CEFR-align everything to ${cefr_level}. Tone: warm, professional, joyful. No placeholders.`;

    const userPrompt = `Topic: ${topic}
Target audience: ${target_audience}
CEFR level: ${cefr_level}
Hub: ${hub}
Skill focus: ${skill_focus}

Draft the lesson blueprint now.`;

    // Tool-calling for guaranteed structured output. The schema is small
    // enough to stay well under Gemini's response-schema complexity ceiling.
    const tool = {
      type: "function",
      function: {
        name: "emit_blueprint",
        description: "Return the structured lesson blueprint.",
        parameters: {
          type: "object",
          properties: {
            lesson_title: { type: "string" },
            target_vocabulary: {
              type: "array",
              minItems: 5,
              maxItems: 8,
              items: {
                type: "object",
                properties: {
                  word: { type: "string" },
                  definition: { type: "string" },
                  example: { type: "string" },
                },
                required: ["word", "definition", "example"],
                additionalProperties: false,
              },
            },
            target_grammar_rule: { type: "string" },
            grammar_explanation: { type: "string" },
            reading_passage_summary: { type: "string" },
            final_speaking_mission: { type: "string" },
          },
          required: [
            "lesson_title",
            "target_vocabulary",
            "target_grammar_rule",
            "grammar_explanation",
            "reading_passage_summary",
            "final_speaking_mission",
          ],
          additionalProperties: false,
        },
      },
    } as const;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "emit_blueprint" } },
      }),
    });

    if (!aiResp.ok) {
      const detail = await aiResp.text();
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      console.error("Blueprint AI gateway error:", aiResp.status, detail);
      return new Response(JSON.stringify({ error: "AI gateway error", detail }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = toolCall?.function?.arguments;
    if (!argsRaw) {
      console.error("No tool_call in blueprint response:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "AI did not return a structured blueprint." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let blueprint: any;
    try {
      blueprint = typeof argsRaw === "string" ? JSON.parse(argsRaw) : argsRaw;
    } catch (e) {
      return new Response(
        JSON.stringify({ error: `Could not parse blueprint JSON: ${(e as Error).message}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Defensive sanity checks before returning.
    if (
      !blueprint.lesson_title ||
      !Array.isArray(blueprint.target_vocabulary) ||
      blueprint.target_vocabulary.length < 3 ||
      !blueprint.target_grammar_rule ||
      !blueprint.reading_passage_summary ||
      !blueprint.final_speaking_mission
    ) {
      return new Response(
        JSON.stringify({ error: "Blueprint missing required fields. Please retry." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ blueprint }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blueprint error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
