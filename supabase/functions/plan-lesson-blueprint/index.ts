// Plan a Lesson Blueprint: given Topic + CEFR level + Hub, the AI selects 5
// vocabulary words + 1 grammar structure that the slide generator MUST use
// consistently across the lesson. Returns:
//   { vocabulary: string[5], grammar: string, rationale?: string }
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, cefr_level = "A1", hub = "academy" } = await req.json().catch(() => ({}));
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const audience =
      hub === "playground"
        ? "young children (ages 5-10), playful and concrete"
        : hub === "success"
        ? "adult professionals, business / workplace context"
        : "teenagers (ages 11-17), modern and relatable";

    const system = `You are a Senior ESL Curriculum Designer.
Given a TOPIC and a CEFR level, you select:
  • exactly 5 target vocabulary words (single words or 2-word collocations)
  • exactly 1 target grammar structure (e.g. "Simple Past", "Present Continuous", "Modal: should")
The selection MUST be appropriate for ${audience} at CEFR ${cefr_level}.
Vocabulary must be tightly themed to the topic — not generic filler.
Grammar must be one a teacher could plausibly drill in 30-60 minutes alongside that vocabulary.
Return ONLY via the supplied function tool.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: `TOPIC: ${topic}\nCEFR LEVEL: ${cefr_level}\nHUB: ${hub}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_blueprint",
              description: "Emit the lesson blueprint",
              parameters: {
                type: "object",
                properties: {
                  vocabulary: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 5,
                    maxItems: 5,
                  },
                  grammar: { type: "string" },
                  rationale: { type: "string" },
                },
                required: ["vocabulary", "grammar"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_blueprint" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("[plan-lesson-blueprint] AI error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await resp.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = typeof args === "string" ? JSON.parse(args) : args;
    if (!parsed?.vocabulary || !parsed?.grammar) {
      throw new Error("AI did not return a valid blueprint");
    }
    // Hard-clamp to 5
    parsed.vocabulary = (parsed.vocabulary as string[]).slice(0, 5);
    while (parsed.vocabulary.length < 5) parsed.vocabulary.push("");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[plan-lesson-blueprint]", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
