import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, lessonPrompt, level, ageGroup, hub, vocabularyCount } = await req.json();

    if (!topic || !hub) {
      return new Response(JSON.stringify({ error: "topic and hub are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const hubContext: Record<string, string> = {
      playground: "Young children (ages 4-8). Use simple, fun language. Vocabulary should be basic, concrete nouns/verbs/adjectives kids encounter daily. Include emojis. Activities should be playful (drag-drop, pop bubbles, matching pictures).",
      academy: "Teenagers (ages 12-17). Use relatable, modern language. Vocabulary can include abstract concepts. Activities: fill-in-blanks, sentence unscramble, speed quizzes.",
      professional: "Adults in business settings. Use formal, professional register. Vocabulary should be business/industry terms. Activities: case studies, business email writing, formal presentations.",
    };

    const systemPrompt = `You are an expert ESL curriculum designer. Generate a structured vocabulary and activity pack for a lesson.

CRITICAL RULES:
- The lesson prompt is the PRIMARY driver of all content. Every vocabulary word, grammar point, dialogue, and activity MUST directly relate to the lesson prompt.
- Generate vocabulary that students will actually use in the context described by the prompt.
- Grammar target must support the communicative goal of the lesson.
- Dialogues must simulate real scenarios described in the prompt.
- Activities must practice the specific skills mentioned in the prompt.

Hub context: ${hubContext[hub] || hubContext.playground}
CEFR Level: ${level}

You MUST return valid JSON with this EXACT structure (no markdown, no code blocks, just raw JSON):
{
  "vocabulary": [
    {
      "word": "string",
      "definition": "string (clear, age-appropriate definition)",
      "exampleSentence": "string (contextual sentence using the word)",
      "fillBlank": "string (same sentence with the word replaced by ____)",
      "imageKeywords": "string (descriptive keywords for generating an illustration of this word)",
      "emoji": "string (single relevant emoji)"
    }
  ],
  "grammarTarget": "string (specific grammar structure, e.g. 'Present Simple: I like / Do you like...?')",
  "grammarExamples": ["string (3-4 example sentences using the grammar in context)"],
  "warmUpQuestion": "string (engaging opening question related to the topic)",
  "objectives": ["string (4 specific, measurable learning objectives)"],
  "dialogueLines": ["string (6-8 lines of realistic dialogue practicing the lesson content)"],
  "gameDescription": "string (description of an interactive game/activity)",
  "productionTask": "string (creative output task for students)",
  "songOrChant": "string (short rhyme or chant for kids, empty string for teens/adults)"
}

Generate exactly ${vocabularyCount || 4} vocabulary items.`;

    const userPrompt = lessonPrompt
      ? `Topic: "${topic}"\n\nLesson Prompt (THIS IS THE MAIN INSTRUCTION - follow it closely):\n${lessonPrompt}`
      : `Topic: "${topic}"\n\nGenerate a comprehensive lesson pack about this topic with relevant vocabulary, grammar, and activities.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle possible markdown wrapping)
    let jsonStr = rawContent.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const topicPack = JSON.parse(jsonStr);

    // Validate structure
    if (!topicPack.vocabulary || !Array.isArray(topicPack.vocabulary) || topicPack.vocabulary.length === 0) {
      throw new Error("Invalid AI response: missing vocabulary array");
    }

    return new Response(JSON.stringify({ topicPack }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-lesson-content-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
