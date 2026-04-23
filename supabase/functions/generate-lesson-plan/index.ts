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
    const { hub, topic, targetGrammar, targetVocabulary, mode, previousSlideContent, prompt: userInjectPrompt, studentAge, lessonPrompt } = body;

    // Validate hub
    const validHubs = ["playground", "academy", "success"];
    if (!hub || !validHubs.includes(hub)) {
      return new Response(
        JSON.stringify({ error: "Invalid hub. Must be: playground, academy, or success" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // For full_deck mode, topic is required
    const generationMode = mode || "full_deck";
    if (generationMode === "full_deck" && (!topic || typeof topic !== "string" || topic.trim().length === 0)) {
      return new Response(
        JSON.stringify({ error: "Topic is required for full deck generation" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    if ((topic && topic.length > 500) || (targetGrammar && targetGrammar.length > 500) || (targetVocabulary && targetVocabulary.length > 500)) {
      return new Response(
        JSON.stringify({ error: "Input fields must be under 500 characters" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Hub-specific context
    let hubContext = "";
    let duration = 60;
    switch (hub) {
      case "playground":
        duration = 30;
        hubContext = `Hub: The Playground (Kids ages 5-11). Duration: EXACTLY 30 minutes.
Tone: HIGH-ENERGY, gamified, colorful, fun characters. Use simple vocabulary, short sentences, lots of repetition. Phonics focus is critical.
Video Song Channels: Super Simple Songs, Cocomelon, Maple Leaf Learning, Pinkfong, English Singsing.
Hub Colors: Primary #FE6A2F (Orange), Accent #FEFBDD (Yellow).`;
        break;
      case "academy":
        duration = 60;
        hubContext = `Hub: The Academy (Teens ages 12-17). Duration: EXACTLY 60 minutes.
Tone: Grammar-focused deep learning with engaging teen-relevant contexts. Challenge critical thinking. Balance accuracy and fluency.
Video Channels: BBC Learning English, English with Lucy, mmmEnglish, Learn English with TV Series.
Hub Colors: Primary #6B21A8 (Purple), Accent #F5F3FF (Lavender).`;
        break;
      case "success":
        duration = 60;
        hubContext = `Hub: The Success Hub (Professional Adults 18+). Duration: EXACTLY 60 minutes.
Tone: Professional coaching, business English, career-focused. Include role-play scenarios. Focus on professional vocabulary, idiomatic expressions, formal/informal register.
Video Channels: BBC Learning English, Business English Pod, English with Lucy, TED-Ed.
Hub Colors: Primary #059669 (Emerald Green), Accent #F0FDFA (Mint).`;
        break;
    }

    let systemPrompt: string;
    let userPrompt: string;

    if (generationMode === "single_slide") {
      // ─── SINGLE SLIDE INJECTION MODE ───
      systemPrompt = `You are the Engleuphoria Master Curriculum Designer. Generate a SINGLE slide for an ESL lesson.

${hubContext}

You must output ONLY a valid JSON object (not an array) with this exact schema:
{
  "slide_type": "title | video_song | vocabulary_image | grammar_presentation | interactive_practice",
  "headline": "The main large text for the slide",
  "body_text": "Secondary text or instructions",
  "video_url": "A real YouTube search URL if this is a video slide, otherwise null",
  "visual_search_keyword": "A specific 1-2 word keyword for fetching an educational illustration (e.g. 'classroom', 'airport_luggage', 'happy_student')",
  "teacher_notes": "Hidden scaffolding notes, CCQs, step-up/step-down instructions"
}

RULES:
- If asked for a quiz, use slide_type "interactive_practice" and put the questions in body_text as numbered items with options (A, B, C, D) and mark correct answers.
- For video slides, use https://www.youtube.com/results?search_query=ENCODED_TERMS format.
- The visual_search_keyword must be highly specific and relevant for finding educational imagery.
- teacher_notes MUST include scaffolding (step-up for fast finishers, step-down for struggling students).`;

      const prevContext = previousSlideContent ? `\nContext from the previous slide: ${JSON.stringify(previousSlideContent)}` : "";
      userPrompt = `${userInjectPrompt || "Create an engaging slide for this lesson."}${prevContext}\nHub: ${hub}, Topic: ${topic || "General English"}`;

    } else {
      // ─── FULL DECK MODE ───
      systemPrompt = `You are the Engleuphoria Master Curriculum Designer. Create a world-class, 7-to-10 slide ESL lesson deck.
Output ONLY a valid JSON object (no markdown, no code blocks).

${hubContext}

CRITICAL RULES:
1. Follow PPP methodology (Presentation, Practice, Production) strictly.
2. Duration: ${duration} minutes total.
3. For video_url fields, provide real YouTube search URLs: https://www.youtube.com/results?search_query=ENCODED_TERMS. Use famous ESL channels.
4. Every slide MUST have a visual_search_keyword — a highly specific 1-2 word keyword for fetching educational illustrations.
5. Practice slides MUST include BOTH Step-Down (struggling students) AND Step-Up (fast finishers) scaffolding.
6. Include Concept Check Questions (CCQs) in teacher_notes.
7. Include specific teacher scripts and interactive whiteboard activity descriptions.

You MUST return this exact JSON schema:
{
  "lesson_title": "A creative, engaging lesson title",
  "target_grammar": "The primary grammar/structure focus",
  "target_vocabulary": "Key vocabulary items (comma-separated)",
  "slides": [
    {
      "slide_type": "title | video_song | vocabulary_image | grammar_presentation | interactive_practice",
      "headline": "The main large text for the slide",
      "body_text": "Secondary text or detailed instructions",
      "video_url": "YouTube search URL or null",
      "visual_search_keyword": "Specific 1-2 word keyword for image search",
      "teacher_notes": "Hidden scaffolding, CCQs, step-up/step-down"
    }
  ]
}

SLIDE SEQUENCE RULES:
- Slide 1: Always "title" type — lesson title, objectives, and key vocabulary preview.
- Slide 2: Always "video_song" type — an engaging warm-up video from a popular ESL channel.
- Slides 3-4: "vocabulary_image" type — introduce target vocabulary with visual associations.
- Slides 5-6: "grammar_presentation" type — present the target grammar with clear examples and rules.
- Slides 7-8: "interactive_practice" type — controlled and semi-controlled practice activities.
- Slide 9: "interactive_practice" type — production/free practice activity.
- Slide 10 (optional): "title" type — lesson summary and homework assignment.`;

      userPrompt = `Create a complete lesson deck for:
Topic: "${topic.trim()}"${
        targetGrammar ? `\nTarget Grammar/Structure: ${targetGrammar.trim()}` : ""
      }${
        targetVocabulary ? `\nTarget Vocabulary: ${targetVocabulary.trim()}` : ""
      }${
        studentAge ? `\nStudent Age/Level: ${studentAge}` : ""
      }`;
    }

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
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errText);
      const status = geminiResponse.status === 429 ? 429 : geminiResponse.status === 402 ? 402 : 500;
      return new Response(
        JSON.stringify({ error: status === 429 ? "Rate limited. Please wait and try again." : status === 402 ? "Payment required." : "AI generation failed" }),
        { status, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", parseErr, rawText);
      return new Response(
        JSON.stringify({ error: "AI returned invalid JSON", raw: rawText }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    if (generationMode === "single_slide") {
      return new Response(
        JSON.stringify({ slide: parsedData, hub, mode: "single_slide" }),
        { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Full deck response — also build a legacy markdown version for backward compat
    const lessonPlan = `# ${parsedData.lesson_title || topic.trim()}

## 📋 Target Summary
- **Grammar:** ${parsedData.target_grammar || 'N/A'}
- **Vocabulary:** ${parsedData.target_vocabulary || 'N/A'}
- **Duration:** ${duration} minutes
- **Hub:** ${hub.charAt(0).toUpperCase() + hub.slice(1)}

${(parsedData.slides || []).map((s: any, i: number) => `### Slide ${i + 1}: ${s.headline}\n${s.body_text}\n\n*Teacher Notes: ${s.teacher_notes}*`).join('\n\n')}`;

    return new Response(
      JSON.stringify({
        lessonPlan,
        lessonData: parsedData,
        slides: parsedData.slides || [],
        lesson_title: parsedData.lesson_title,
        target_grammar: parsedData.target_grammar,
        target_vocabulary: parsedData.target_vocabulary,
        hub,
        topic: topic?.trim(),
        mode: "full_deck",
      }),
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
