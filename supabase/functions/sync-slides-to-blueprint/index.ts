// Rewrites an existing slide deck so its text and quiz questions exclusively
// use the supplied vocabulary words and grammar structure. Slide TYPES,
// ORDER, and structural fields (image_url, media_url, audio_url, options
// arity, etc.) MUST be preserved — only natural-language text fields change.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { slides, vocabulary, grammar, hub = "academy", cefr_level = "A1" } =
      await req.json().catch(() => ({}));

    if (!Array.isArray(slides) || slides.length === 0) {
      return new Response(JSON.stringify({ error: "slides[] is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(vocabulary) || !grammar) {
      return new Response(JSON.stringify({ error: "vocabulary[] and grammar are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const system = `You are a Senior ESL Editor for the Engleuphoria platform (${hub} hub, CEFR ${cefr_level}).
You will receive an array of lesson slides as JSON. Rewrite their text-bearing fields so that:
  • Every slide uses ONLY these target vocabulary words: ${vocabulary.join(", ")}
  • Every grammatically structured sentence uses this grammar: "${grammar}"
HARD RULES:
  • Preserve each slide's "type" exactly.
  • Preserve array lengths (e.g. options/pairs arity stays the same).
  • Preserve all media URL / image / audio / video / asset fields verbatim.
  • Preserve the "answer" being a member of "options" when applicable.
  • Keep voice.text in sync with the new on-screen text.
  • Do NOT add or remove slides.
Return ONLY via the supplied function tool with the FULL rewritten slides array (same length, same order).`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: `SLIDES:\n${JSON.stringify(slides)}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_slides",
              description: "Emit the rewritten slides array.",
              parameters: {
                type: "object",
                properties: { slides: { type: "array", items: { type: "object" } } },
                required: ["slides"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_slides" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("[sync-slides-to-blueprint] AI error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await resp.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = typeof args === "string" ? JSON.parse(args) : args;
    if (!parsed?.slides || !Array.isArray(parsed.slides)) {
      throw new Error("AI did not return slides");
    }
    if (parsed.slides.length !== slides.length) {
      console.warn("[sync] length mismatch", parsed.slides.length, "vs", slides.length);
    }
    return new Response(JSON.stringify({ slides: parsed.slides }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[sync-slides-to-blueprint]", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
