// generate-homework — AI Edge Function
// Reads a Lesson Blueprint and generates a 3-part homework assignment
// (matching_quiz, fill_in_the_blank, speaking_prompt) saved to homework_assignments.content.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { aiFetch } from "../_shared/aiFetch.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { lesson_id, blueprint, title, due_date } = body || {};

    // Resolve blueprint
    let bp = blueprint || null;
    let resolvedTitle = title || "Homework";
    if (!bp && lesson_id) {
      const { data: lesson } = await supabase
        .from("curriculum_lessons")
        .select("title, vocabulary_list, grammar_pattern, phonics_focus, content")
        .eq("id", lesson_id)
        .maybeSingle();
      if (lesson) {
        resolvedTitle = lesson.title || resolvedTitle;
        bp = {
          vocabulary: lesson.vocabulary_list || [],
          grammar: lesson.grammar_pattern || "",
          phonics: lesson.phonics_focus || "",
          ...(lesson.content as any || {}),
        };
      }
    }

    if (!bp || (!bp.vocabulary && !bp.grammar && !bp.target_phonics && !bp.phonics)) {
      return new Response(JSON.stringify({ error: "No blueprint or vocabulary/grammar provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const vocabArr = Array.isArray(bp.vocabulary) ? bp.vocabulary : (bp.target_vocabulary || []);
    const grammar = bp.grammar || bp.grammar_focus || "";
    const phonics = bp.target_phonics || bp.phonics || "";

    const systemPrompt =
      `You are an expert ESL homework designer. Based on the provided lesson blueprint (vocabulary, grammar, phonics), ` +
      `generate a JSON object for a 3-part homework assignment for an independent study session of ~15 minutes. ` +
      `The student must reuse the EXACT vocabulary and grammar pattern from the blueprint. ` +
      `Return ONLY raw JSON in this exact shape — no markdown, no commentary:\n` +
      `{\n` +
      `  "matching_quiz": [ { "term": "string", "definition": "string" } ],   // 5 pairs from the vocabulary\n` +
      `  "fill_in_the_blank": [ { "sentence": "string with ____", "answer": "string" } ],   // 5 sentences using the grammar\n` +
      `  "speaking_prompt": "One short, vivid sentence the student should say aloud, using today's grammar + at least one vocab word."\n` +
      `}`;

    const userPrompt = `Lesson title: ${resolvedTitle}
Vocabulary: ${JSON.stringify(vocabArr)}
Grammar focus: ${grammar}
Phonics focus: ${phonics}`;

    const aiRes = await aiFetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI gateway error ${aiRes.status}`, detail: errText.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const ai = await aiRes.json();
    const content = ai.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(JSON.stringify({ error: "AI returned empty response", detail: JSON.stringify(ai).slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let raw = typeof content === "string" ? content.trim() : String(content);
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    let homework: any;
    try { homework = JSON.parse(raw); } catch (e) {
      return new Response(JSON.stringify({ error: "AI returned invalid JSON", detail: raw.slice(0, 400) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Save to homework_assignments
    const insertRow: Record<string, unknown> = {
      teacher_id: user.id,
      lesson_id: lesson_id || null,
      title: `Homework: ${resolvedTitle}`,
      description: homework.speaking_prompt || "Auto-generated homework",
      instructions: "Complete the matching quiz, fill in the blanks, and record your speaking challenge.",
      points: 10,
      due_date: due_date || null,
      status: "draft",
      content: homework,
      source: "ai-generated",
    };
    const { data: saved, error: saveErr } = await supabase
      .from("homework_assignments")
      .insert(insertRow)
      .select()
      .single();
    if (saveErr) {
      return new Response(JSON.stringify({ error: "Failed to save homework", detail: saveErr.message, homework }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, homework, assignment: saved }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
