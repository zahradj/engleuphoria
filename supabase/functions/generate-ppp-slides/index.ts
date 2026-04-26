// Generate a 6-slide PPP lesson via Lovable AI Gateway with strict tool-calling.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PHASES = ["Warm-up", "Presentation", "Practice", "Production", "Review"] as const;
const SLIDE_TYPES = ["text_image", "multiple_choice", "drawing_prompt"] as const;

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

    const systemPrompt = `You are an elite ESL Curriculum Director designing a single 30-minute classroom-ready lesson.
Build a 6-slide arc following the Scaffolded Mastery PPP method:
1) Warm-up (hook, 1 slide)
2) Presentation (input, 1–2 slides)
3) Practice (controlled, 1–2 slides)
4) Production (free output, 1 slide)
5) Review (quick check, 1 slide)

Rules:
- Total slides MUST equal 6.
- Use multiple_choice for at least one Practice slide; drawing_prompt fits Warm-up or Production well; text_image otherwise.
- For multiple_choice, "content" MUST be a JSON string of {"question": string, "options": string[4], "answer": string}.
- For text_image and drawing_prompt, "content" is short instructional text in plain English (1–3 sentences max).
- "teacher_script" is 2–3 high-energy sentences for the teacher to read aloud.
- "visual_keyword" is 1–2 vivid English words for an Unsplash image search.
- Tone: supportive, professional, joyful. Globally inclusive examples. CEFR-aligned.`;

    const userPrompt = `Lesson title: ${lesson_title}
Objective: ${objective ?? "(not provided)"}
Skill focus: ${skill_focus}
CEFR level: ${cefr_level}
Hub: ${hub}

Generate the 6 slides now.`;

    const tool = {
      type: "function",
      function: {
        name: "emit_ppp_slides",
        description: "Return a 6-slide PPP lesson.",
        parameters: {
          type: "object",
          properties: {
            slides: {
              type: "array",
              minItems: 6,
              maxItems: 6,
              items: {
                type: "object",
                properties: {
                  phase: { type: "string", enum: [...PHASES] },
                  slide_type: { type: "string", enum: [...SLIDE_TYPES] },
                  title: { type: "string" },
                  content: { type: "string" },
                  teacher_script: { type: "string" },
                  visual_keyword: { type: "string" },
                },
                required: ["phase", "slide_type", "title", "content", "teacher_script", "visual_keyword"],
                additionalProperties: false,
              },
            },
          },
          required: ["slides"],
          additionalProperties: false,
        },
      },
    };

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
        tool_choice: { type: "function", function: { name: "emit_ppp_slides" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = call?.function?.arguments;
    if (!argsRaw) {
      console.error("No tool call in AI response", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "AI did not return slides" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = JSON.parse(argsRaw);
    const slides = (parsed.slides ?? []).map((s: any) => ({
      id: crypto.randomUUID(),
      phase: s.phase,
      slide_type: s.slide_type,
      title: s.title,
      content: s.content,
      teacher_script: s.teacher_script,
      visual_keyword: s.visual_keyword,
    }));

    return new Response(JSON.stringify({ slides }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ppp-slides error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
