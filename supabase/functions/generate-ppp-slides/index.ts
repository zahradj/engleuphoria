// Generate a 15-20 slide progressive lesson via Lovable AI Gateway with strict tool-calling.
// The AI acts as a Master Curriculum Director: routes media (image vs video),
// enforces a 5-phase progressive arc, and forces divergent interactivity.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PHASES = ["Hook", "Input", "Practice", "Production", "Reward"] as const;
const SLIDE_TYPES = [
  "mascot_speech",
  "multiple_choice",
  "drawing_canvas",
  "drag_and_drop",
  "flashcard",
] as const;
const MEDIA_TYPES = ["image", "video"] as const;
const LAYOUTS = ["split_left", "split_right", "center_card", "full_background"] as const;

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

    const systemPrompt = `You are the MASTER CURRICULUM DIRECTOR for Engleuphoria — an elite ESL platform for kids and teens.
You are simultaneously: (1) a CEFR-aligned pedagogy expert, (2) a Multimodal Media Director, and (3) a gamification designer.
You are designing ONE 30-minute classroom-ready lesson as a 15–20 slide deck. Total slide count MUST be between 15 and 20 inclusive.

═══════════════════════════════════════════════════════
RULE 1 — THE PROGRESSIVE & SYSTEMATIC 30-MIN ARC (MANDATORY)
═══════════════════════════════════════════════════════
The deck MUST follow this exact 5-phase progressive arc, in order, with these slide counts:

• Phase 1 — HOOK (Slides 1–2, exactly 2 slides):
  High-energy welcome. media_type MUST be "video" for at least one. Upbeat audio. slide_type = "mascot_speech".
• Phase 2 — INPUT (Slides 3–6, exactly 4 slides):
  Introduce new vocabulary/structures. Use "mascot_speech" + "flashcard". Clean static "image" media. The mascot models the word; the flashcard shows it.
• Phase 3 — PRACTICE (Slides 7–12, exactly 6 slides):
  Fast-paced active recall. Use "multiple_choice" and "flashcard". Mostly "image" media; "video" allowed for action verbs.
• Phase 4 — PRODUCTION (Slides 13–17, exactly 5 slides):
  Creative divergent output. Use "drawing_canvas" and "drag_and_drop". The student CREATES — they don't just click.
• Phase 5 — REWARD (Slides 18–20, exactly 3 slides):
  Massive review game (one final multiple_choice OR drag_and_drop) + a celebration. The final slide MUST be a "mascot_speech" with media_type "video" (celebration animation).

Total: 2 + 4 + 6 + 5 + 3 = 20 slides. You may compress Practice or Production by 1 slide each if pedagogically justified, but never below 15 total.

═══════════════════════════════════════════════════════
RULE 2 — SMART MEDIA ROUTING (MANDATORY for every slide)
═══════════════════════════════════════════════════════
You are the Media Director. For EVERY slide, choose the absolute best media_type for the visual_keyword:

• Rule A — USE "image" when:
  - Teaching a static Noun (apple, chair, mountain)
  - Teaching an Adjective describing a static quality (red, tall, soft)
  - Generating a background for a Drag-and-Drop, Drawing Canvas, or Flashcard game
  - Any slide where motion would distract from the learning target

• Rule B — USE "video" when:
  - Teaching an Action / Verb (running, jumping, eating, swimming)
  - Teaching an Emotion (happy, surprised, scared) — facial micro-animation matters
  - Creating a Brain Break / Dance Break / Celebration slide
  - The Hook slides (energy is the goal)

If unsure, default to "image" — but never miss a verb or emotion.

═══════════════════════════════════════════════════════
RULE 3 — DIVERGENT INTERACTIVITY (STRICTLY ENFORCED)
═══════════════════════════════════════════════════════
You are FORBIDDEN from placing two slides of the SAME slide_type back-to-back.
The student must constantly switch physical action: Look → Listen → Click → Drag → Draw → Speak → Celebrate.
After every "multiple_choice", the next slide MUST be a different type. Same for "drawing_canvas", "drag_and_drop", and "flashcard".
Two consecutive "mascot_speech" slides are allowed ONLY in the Hook phase (slides 1–2).

═══════════════════════════════════════════════════════
RULE 4 — INTERACTIVE_DATA SHAPES (by slide_type)
═══════════════════════════════════════════════════════
• mascot_speech    → { "speech": string }                    // what the mascot says aloud
• multiple_choice  → { "question": string, "options": string[4], "correct_index": 0..3 }
• flashcard        → { "front": string, "back": string }
• drawing_canvas   → { "prompt": string }                    // "Draw an apple!"
• drag_and_drop    → { "instruction": string, "items": string[], "targets": string[], "pairs": [{"item": string, "target": string}] }

═══════════════════════════════════════════════════════
RULE 5 — MULTIMODAL MEDIA PROMPTS (generate ALL THREE for every slide)
═══════════════════════════════════════════════════════
• "elevenlabs_script": Exact phonetic, kid-friendly TTS string. Under 120 chars. High energy.
• "image_generation_prompt": Highly detailed prompt for text-to-image. Always end with: "Vibrant 3D cartoon illustration, flat solid pastel background, UI game asset, no text, kid-friendly, joyful."
• "video_generation_prompt": Prompt for a 2–4s SEAMLESSLY LOOPING animation. End with: "seamless loop, solid pastel background, no text, no camera motion." Subtle motion only.

═══════════════════════════════════════════════════════
GENERAL TONE
═══════════════════════════════════════════════════════
Supportive, professional, joyful. Globally inclusive. CEFR-aligned. No placeholders.
"content" = short on-slide text (1–3 sentences max), or empty if interactive_data carries the meaning.
"teacher_script" = 2–3 high-energy sentences for the teacher to read aloud.
Vary layout_style across the deck for visual rhythm.`;

    const userPrompt = `Lesson title: ${lesson_title}
Objective: ${objective ?? "(not provided)"}
Skill focus: ${skill_focus}
CEFR level: ${cefr_level}
Hub: ${hub}

Generate the 15–20 slide progressive lesson now. Respect every rule above.`;

    // Use JSON mode (response_format) instead of tool-calling — Google AI Studio
    // rejects complex tool schemas via the OpenAI-compatible endpoint, but reliably
    // honors response_format: json_object when the prompt requests strict JSON.
    const jsonInstructions = `\n\n══════════════════════════════════════════\nOUTPUT FORMAT — STRICT JSON ONLY\n══════════════════════════════════════════\nReturn a single JSON object — no markdown fences, no commentary.\nShape:\n{\n  "slides": [\n    {\n      "phase": "Hook" | "Input" | "Practice" | "Production" | "Reward",\n      "slide_type": "mascot_speech" | "multiple_choice" | "drawing_canvas" | "drag_and_drop" | "flashcard",\n      "media_type": "image" | "video",\n      "layout_style": "split_left" | "split_right" | "center_card" | "full_background",\n      "title": string,\n      "content": string,\n      "teacher_script": string,\n      "visual_keyword": string,\n      "elevenlabs_script": string,\n      "image_generation_prompt": string,\n      "video_generation_prompt": string,\n      "interactive_data": object\n    }\n  ]\n}\nEvery slide MUST contain every field. interactive_data shape depends on slide_type as defined in RULE 4.`;

    async function callAI(): Promise<{ ok: true; slides: any[] } | { ok: false; status: number; detail: string }> {
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-5-mini",
          messages: [
            { role: "system", content: "Return JSON only." },
            { role: "user", content: "Return {\"slides\": [{\"title\": \"hello\"}]}" },
          ],
        }),
      });

      if (!aiResp.ok) {
        return { ok: false, status: aiResp.status, detail: await aiResp.text() };
      }

      const data = await aiResp.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text || typeof text !== "string") {
        return { ok: false, status: 502, detail: "No content in AI response" };
      }
      // Strip stray markdown fences just in case.
      const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      let parsedArgs: any;
      try {
        parsedArgs = JSON.parse(cleaned);
      } catch (e) {
        return { ok: false, status: 502, detail: `JSON parse failed: ${(e as Error).message}` };
      }
      if (!parsedArgs || !Array.isArray(parsedArgs.slides) || parsedArgs.slides.length === 0) {
        return { ok: false, status: 502, detail: "Validation failed: missing slides[]" };
      }
      return { ok: true, slides: parsedArgs.slides };
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

    const slides = rawSlides.map((s: any) => ({
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
      interactive_data: (() => {
        if (s.interactive_data && typeof s.interactive_data === "object") return s.interactive_data;
        if (typeof s.interactive_data_json === "string") {
          try { return JSON.parse(s.interactive_data_json); } catch { return {}; }
        }
        return {};
      })(),
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
