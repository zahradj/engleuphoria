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
    let duration = 60;
    switch (hub) {
      case "playground":
        duration = 30;
        hubContext = `Hub: The Playground (Kids ages 5-11). Duration: EXACTLY 30 minutes. 
Tone: HIGH-ENERGY, gamified, colorful, fun characters. Use simple vocabulary, short sentences, lots of repetition. Phonics focus is critical.
Video Song Channels: Super Simple Songs, Cocomelon, Maple Leaf Learning, Pinkfong, English Singsing.`;
        break;
      case "academy":
        duration = 60;
        hubContext = `Hub: The Academy (Teens ages 12-17). Duration: EXACTLY 60 minutes.
Tone: Grammar-focused deep learning with engaging teen-relevant contexts. Challenge critical thinking. Balance accuracy and fluency.
Video Song Channels: BBC Learning English, English with Lucy, mmmEnglish, Learn English with TV Series.`;
        break;
      case "success":
        duration = 60;
        hubContext = `Hub: The Success Hub (Professional Adults 18+). Duration: EXACTLY 60 minutes.
Tone: Professional coaching, business English, career-focused. Include role-play scenarios. Focus on professional vocabulary, idiomatic expressions, formal/informal register.
Video Song Channels: BBC Learning English, Business English Pod, English with Lucy, TED-Ed.`;
        break;
    }

    const systemPrompt = `You are the Engleuphoria Curriculum AI — a Master ESL Curriculum Architect. You must return a valid JSON object. Do not use markdown code blocks or any text outside the JSON.

${hubContext}

CRITICAL RULES:
1. Generate a world-class, minute-by-minute lesson plan based on the PPP method (Presentation, Practice, Production).
2. Strictly follow the duration: ${duration} minutes total.
3. For the video_url field, you MUST generate a real, accurate YouTube search URL for a highly popular ESL video song or animated story that matches the lesson topic. Use the format: https://www.youtube.com/results?search_query=ENCODED_SEARCH_TERMS. Rely on famous channels like Super Simple Songs, Cocomelon, English Singsing, BBC Learning English, or Maple Leaf Learning to ensure relevance.
4. The "practice" field MUST include BOTH a "Step-Down" method (if the student is struggling) AND a "Step-Up" extension (if the student finishes early). This scaffolding is CRITICAL.
5. Include Concept Check Questions (CCQs) in the practice section.
6. Include specific teacher scripts and interactive whiteboard activity descriptions.

You MUST return ONLY a valid JSON object with this exact schema:
{
  "lesson_title": "string - A creative, engaging lesson title",
  "target_grammar": "string - The primary grammar/structure focus",
  "target_vocabulary": "string - Key vocabulary items (comma-separated)",
  "video_url": "string - YouTube search URL for a relevant ESL video",
  "video_search_title": "string - The exact search title the teacher should use to find the video",
  "warm_up": "string - Detailed warm-up activity (3-5 mins) including the video song integration with specific timestamps and interaction prompts",
  "presentation": "string - Detailed Presentation phase with teacher scripts, flashcard/whiteboard activities, and comprehension checks (${hub === 'playground' ? '7' : '15'} mins)",
  "practice": "string - Detailed Practice phase with controlled & semi-controlled activities, CCQs, interactive games, STEP-DOWN scaffolding for struggling students, and STEP-UP extensions for fast finishers (${hub === 'playground' ? '10' : '25'} mins)",
  "production": "string - Detailed Production phase with free practice, real-world application tasks, and student-led activities (${hub === 'playground' ? '7' : '12'} mins)",
  "homework": "string - A specific post-lesson review task for the student dashboard",
  "teacher_notes": "string - Differentiation strategies, common errors to watch for, and extension activities"
}`;

    const userPrompt = `Create a lesson plan for the topic: "${topic.trim()}"${
      targetGrammar ? `\nTarget Grammar/Structure: ${targetGrammar.trim()}` : ""
    }${
      targetVocabulary ? `\nTarget Vocabulary: ${targetVocabulary.trim()}` : ""
    }`;

    // Call Gemini API with JSON response format
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
          responseMimeType: "application/json",
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
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response
    let lessonData;
    try {
      lessonData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", parseErr, rawText);
      // Fallback: return raw text as markdown
      return new Response(
        JSON.stringify({ lessonPlan: rawText, lessonData: null, hub, topic: topic.trim() }),
        { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Build a formatted Markdown version from the structured data
    const lessonPlan = `# ${lessonData.lesson_title || topic.trim()}

## 📋 Target Summary
- **Grammar:** ${lessonData.target_grammar || 'N/A'}
- **Vocabulary:** ${lessonData.target_vocabulary || 'N/A'}
- **Duration:** ${duration} minutes
- **Hub:** ${hub.charAt(0).toUpperCase() + hub.slice(1)}

## 🎵 Video Song Integration
🔗 [Search Video](${lessonData.video_url || '#'})
**Search Title:** ${lessonData.video_search_title || 'N/A'}

## 🎯 Warm-Up (${hub === 'playground' ? '3-5' : '5'} mins)
${lessonData.warm_up || ''}

## 📖 Presentation Phase (${hub === 'playground' ? '7' : '15'} mins)
${lessonData.presentation || ''}

## 💪 Practice Phase (${hub === 'playground' ? '10' : '25'} mins)
${lessonData.practice || ''}

## 🚀 Production Phase (${hub === 'playground' ? '7' : '12'} mins)
${lessonData.production || ''}

## 📝 Homework / Review Task
${lessonData.homework || ''}

## 👩‍🏫 Teacher Notes
${lessonData.teacher_notes || ''}`;

    return new Response(
      JSON.stringify({ lessonPlan, lessonData, hub, topic: topic.trim() }),
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
