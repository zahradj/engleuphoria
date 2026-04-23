import { corsHeaders } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { hub, topic, targetGrammar, targetVocabulary } = body;

    // Validate inputs
    const validHubs = ["playground", "academy", "success"];
    if (!hub || !validHubs.includes(hub)) {
      return new Response(
        JSON.stringify({ error: "Invalid hub. Must be: playground, academy, or success" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }
    if (topic.length > 500 || (targetGrammar && targetGrammar.length > 500) || (targetVocabulary && targetVocabulary.length > 500)) {
      return new Response(
        JSON.stringify({ error: "Input fields must be under 500 characters" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Build hub-specific context
    let hubContext = "";
    switch (hub) {
      case "playground":
        hubContext = `This is for The Playground Hub (Kids ages 5-11).
- Duration: 30 minutes across 20-25 interactive slides
- Style: HIGH-ENERGY, gamified, colorful, fun characters
- Include at least 2 interactive games (drag-and-drop, spinning wheel, matching pairs)
- Use simple vocabulary, short sentences, lots of repetition
- Include a warm-up song/chant and a cool-down activity
- Phonics focus is important for this age group`;
        break;
      case "academy":
        hubContext = `This is for The Academy Hub (Teens ages 12-17).
- Duration: 60 minutes across 20-25 interactive slides
- Style: Grammar-focused deep learning with engaging teen-relevant contexts
- Include structured grammar explanations with clear examples
- Activities should challenge critical thinking and real-world application
- Include peer discussion prompts and collaborative exercises
- Balance accuracy and fluency practice`;
        break;
      case "success":
        hubContext = `This is for The Success Hub (Professional Adults 18+).
- Duration: 60 minutes across 20-25 interactive slides  
- Style: Professional coaching, business English, career-focused
- Include role-play scenarios (job interviews, meetings, presentations)
- Focus on professional vocabulary, idiomatic expressions, formal/informal register
- Activities should simulate real workplace communication
- Include self-reflection and goal-setting components`;
        break;
    }

    const systemPrompt = `You are an expert curriculum designer for Engleuphoria, a premium English language learning platform. 

Create a structured lesson plan based on the PPP method (Presentation, Practice, Production).

${hubContext}

LESSON STRUCTURE (PPP Method):
## 📋 Lesson Overview
- Title, objectives, CEFR alignment, duration, materials needed

## 🎯 Presentation Phase (25% of lesson time)
- Teacher-led introduction of new language
- Context setting with visuals/story
- Clear grammar/vocabulary presentation with examples
- Comprehension check questions

## 💪 Practice Phase (50% of lesson time)  
- Controlled practice activities (fill-in-the-blank, matching, multiple choice)
- Semi-controlled practice (guided conversations, sentence building)
- At least 2 interactive/gamified activities
- Error correction strategies

## 🚀 Production Phase (25% of lesson time)
- Free practice / communicative activities
- Real-world application tasks
- Student-led conversations or presentations
- Assessment / exit ticket

## 📝 Teacher Notes
- Differentiation strategies
- Common errors to watch for
- Extension activities for fast finishers
- Homework suggestions

Format the entire response in clean Markdown with headers, bullet points, and numbered lists. Make it classroom-ready for teachers.`;

    const userPrompt = `Create a lesson plan for the topic: "${topic.trim()}"${
      targetGrammar ? `\nTarget Grammar/Structure: ${targetGrammar.trim()}` : ""
    }${
      targetVocabulary ? `\nTarget Vocabulary: ${targetVocabulary.trim()}` : ""
    }`;

    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errText);
      const status = geminiResponse.status === 429 ? 429 : 500;
      return new Response(
        JSON.stringify({ error: status === 429 ? "Rate limited. Please wait and try again." : "AI generation failed" }),
        { status, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    const lessonPlan =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!lessonPlan) {
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ lessonPlan, hub, topic: topic.trim() }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
