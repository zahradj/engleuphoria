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

    const validHubs = ["playground", "academy", "success"];
    if (!hub || !validHubs.includes(hub)) {
      return new Response(
        JSON.stringify({ error: "Invalid hub. Must be: playground, academy, or success" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

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

    let hubContext = "";
    let duration = 60;
    switch (hub) {
      case "playground":
        duration = 30;
        hubContext = `Hub: The Playground (Kids ages 4-9). Duration: EXACTLY 30 minutes.
Tone: HIGH-ENERGY, gamified, colorful, fun characters. Use simple vocabulary, very short sentences (max 6 words), lots of repetition. Phonics focus is critical.
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

    const SCHEMA_BLOCK = `Each slide MUST follow this exact schema:
{
  "ppp_stage": "Warm-Up | Presentation | Practice | Production | Review",
  "slide_type": "title | video_song | vocabulary_image | grammar_presentation | interactive_quiz | speaking_prompt | concept_check",
  "headline": "The main large text shown to the student",
  "body_text": "Secondary text, instructions, or quiz options",
  "video_url": "A real YouTube URL (https://www.youtube.com/results?search_query=...) or null",
  "visual_search_keyword": "1-2 word keyword for auto-fetching a background image (e.g. 'yesterday_calendar')",
  "teacher_notes": {
    "script": "Exactly what the teacher should say out loud",
    "ccq": ["Concept Check Question 1", "Concept Check Question 2"],
    "step_down": "How to simplify this slide for a struggling student",
    "step_up": "How to extend this slide for a fast finisher"
  }
}`;

    let systemPrompt: string;
    let userPrompt: string;

    if (generationMode === "single_slide") {
      systemPrompt = `You are the Engleuphoria Master Curriculum Designer. Generate a SINGLE slide for an ESL lesson using the PPP (Presentation, Practice, Production) methodology.

${hubContext}

Output ONLY a valid JSON object (not an array) matching this schema. No markdown, no code blocks.

${SCHEMA_BLOCK}

RULES:
- For video slides, use https://www.youtube.com/results?search_query=ENCODED_TERMS format with real ESL channel terms.
- The visual_search_keyword must be highly specific (e.g. 'happy_student', 'airport_luggage').
- teacher_notes MUST be a nested object — never a plain string.`;

      const prevContext = previousSlideContent ? `\nContext from the previous slide: ${JSON.stringify(previousSlideContent)}` : "";
      userPrompt = `${userInjectPrompt || "Create an engaging slide for this lesson."}${prevContext}\nHub: ${hub}, Topic: ${topic || "General English"}`;

    } else {
      systemPrompt = `You are the Engleuphoria Master Curriculum Designer. Create a world-class 8-to-10 slide ESL lesson deck strictly following the PPP (Presentation, Practice, Production) methodology with deep scaffolding.

${hubContext}

Output ONLY a valid JSON object (no markdown, no code blocks) matching this schema:
{
  "lesson_title": "A creative, engaging lesson title",
  "target_grammar": "The primary grammar/structure focus",
  "target_vocabulary": "Key vocabulary items (comma-separated)",
  "slides": [ /* array of slide objects */ ]
}

${SCHEMA_BLOCK}

CRITICAL RULES:
1. Strict PPP flow. Use ppp_stage values: Warm-Up → Presentation → Practice → Production → Review.
2. Duration: ${duration} minutes total.
3. Every slide MUST have BOTH a real YouTube URL (when relevant) AND a specific visual_search_keyword.
4. teacher_notes is ALWAYS an object with script, ccq (array), step_down, step_up. Never a plain string.
5. Use real famous ESL channels (BBC Learning English, English with Lucy, Super Simple Songs, etc.) for video URLs.

REQUIRED SLIDE SEQUENCE:
- Slide 1 — ppp_stage "Warm-Up", slide_type "title": lesson title + objectives.
- Slide 2 — ppp_stage "Warm-Up", slide_type "video_song": YouTube warm-up video.
- Slides 3-4 — ppp_stage "Presentation", slide_type "vocabulary_image" or "grammar_presentation": introduce target language with visuals + clear teacher script.
- Slides 5-7 — ppp_stage "Practice", slide_type "interactive_quiz": controlled & semi-controlled practice. Step-Up / Step-Down REQUIRED in teacher_notes.
- Slide 8 — ppp_stage "Production", slide_type "speaking_prompt": free production task with CCQs in teacher_notes.
- Slide 9 (optional) — ppp_stage "Review", slide_type "concept_check": exit ticket.`;

      userPrompt = `Create a complete PPP lesson deck for:
Topic: "${topic.trim()}"${
        targetGrammar ? `\nTarget Grammar/Structure: ${targetGrammar.trim()}` : ""
      }${
        targetVocabulary ? `\nTarget Vocabulary: ${targetVocabulary.trim()}` : ""
      }${
        studentAge ? `\nStudent Age/Level: ${studentAge}` : ""
      }${
        hub === "playground"
          ? `\n\nIMPORTANT — PLAYGROUND HUB AUDIENCE: Students are 4 to 9 years old. Use ultra-simple vocabulary, very short sentences (max 6 words), lots of repetition, songs, chants, and visual cues. Avoid abstract grammar terms — teach patterns through examples and play. Tone must be warm, playful, and encouraging.`
          : ""
      }${
        lessonPrompt ? `\n\nAdditional context & instructions from the curriculum:\n${lessonPrompt.trim()}` : ""
      }`;
    }

    // Call Google Gemini API with exponential backoff (handles 429/503)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const geminiBody = JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const MAX_RETRIES = 3;
    const BASE_DELAY_MS = 2000;
    let aiResponse: Response | null = null;
    let lastErrText = "";

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      aiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: geminiBody,
      });

      if (aiResponse.ok) break;

      lastErrText = await aiResponse.text();
      console.error(`Gemini attempt ${attempt + 1}/${MAX_RETRIES} failed:`, aiResponse.status, lastErrText);

      // Retry only on 429 (rate limit) or 503 (overloaded)
      if (aiResponse.status === 429 || aiResponse.status === 503) {
        if (attempt < MAX_RETRIES - 1) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
      } else {
        // Non-retryable error — break immediately
        break;
      }
    }

    if (!aiResponse || !aiResponse.ok) {
      const isOverload = aiResponse?.status === 429 || aiResponse?.status === 503;
      return new Response(
        JSON.stringify({
          error: true,
          message: isOverload
            ? "The AI curriculum engine is currently overloaded. Please try generating the lesson again in 10 seconds."
            : "AI generation failed. Please try again.",
          details: lastErrText,
        }),
        { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }


    const aiData = await aiResponse.json();
    const rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      console.error("Empty Gemini response:", JSON.stringify(aiData));
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", parseErr, rawText);
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

    const lessonPlan = `# ${parsedData.lesson_title || topic.trim()}

## 📋 Target Summary
- **Grammar:** ${parsedData.target_grammar || 'N/A'}
- **Vocabulary:** ${parsedData.target_vocabulary || 'N/A'}
- **Duration:** ${duration} minutes
- **Hub:** ${hub.charAt(0).toUpperCase() + hub.slice(1)}

${(parsedData.slides || []).map((s: any, i: number) => {
  const tn = s.teacher_notes;
  const notesStr = typeof tn === 'object' && tn
    ? `Script: ${tn.script || ''}\nCCQs: ${(tn.ccq || []).join('; ')}\nStep-Down: ${tn.step_down || ''}\nStep-Up: ${tn.step_up || ''}`
    : (tn || '');
  return `### Slide ${i + 1} [${s.ppp_stage || ''}]: ${s.headline}\n${s.body_text}\n\n*Teacher Notes:*\n${notesStr}`;
}).join('\n\n')}`;

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
