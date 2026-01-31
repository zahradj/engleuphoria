import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { level, cefrLevel, interests, weakAreas, learningStyle, weeklyGoal, mistakeHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const levelDescriptions: Record<string, string> = {
      playground: "young children aged 4-10, using simple words, fun topics, and playful language with emojis",
      academy: "teenagers aged 11-17, using contemporary topics, social media references, and trendy language",
      professional: "adult professionals, focusing on business English, formal communication, and career-relevant vocabulary",
    };

    const learningStyleActivities: Record<string, string> = {
      visual: "diagrams, flashcards, charts, videos, color-coding, and visual mnemonics",
      auditory: "podcasts, pronunciation drills, listening exercises, discussions, and audio content",
      kinesthetic: "role-play, interactive games, drag-and-drop exercises, typing practice, and movement activities",
    };

    const levelDescription = levelDescriptions[level] || levelDescriptions.professional;
    const interestsList = interests?.length > 0 ? interests.join(', ') : 'general topics';
    const weakAreasList = weakAreas?.length > 0 ? weakAreas.join(', ') : 'no specific weak areas identified';
    const styleDescription = learningStyle ? learningStyleActivities[learningStyle] : 'mixed activities';
    const goalContext = weeklyGoal ? `Their weekly goal is: "${weeklyGoal}".` : '';
    
    // Extract words from mistake history for review
    const mistakeWords = mistakeHistory?.length > 0 
      ? mistakeHistory.slice(0, 5).map((m: any) => m.word).join(', ')
      : '';
    const mistakeContext = mistakeWords 
      ? `Include review of these words they previously got wrong: ${mistakeWords}.`
      : '';

    const systemPrompt = `You are an expert ESL lesson designer. Create engaging, personalized English lessons that match the student's level, interests, and learning style. Always return valid JSON.`;

    const userPrompt = `Create a personalized 15-minute English lesson for ${levelDescription}.

Student Details:
- CEFR Level: ${cefrLevel || 'A2'}
- Interests: ${interestsList}
- Learning Style: ${learningStyle || 'mixed'} (prioritize ${styleDescription})
- Areas needing improvement: ${weakAreasList}
${goalContext}
${mistakeContext}

Instructions:
1. Generate a compelling topic related to their interests${weeklyGoal ? ' that aligns with their weekly goal when possible' : ''}
2. Create 5 vocabulary words with IPA pronunciation, definitions, and example sentences
3. Design an interactive quest/activity that matches their learning style
${mistakeWords ? '4. Include at least 1-2 words from their mistake history for review' : ''}

Return ONLY this JSON structure (no markdown, no explanation):
{
  "topic": "Engaging topic title",
  "tagline": "Short catchy subtitle (max 10 words)",
  "vocabulary": [
    {
      "word": "example",
      "ipa": "/ɪɡˈzɑːmpəl/",
      "definition": "a thing characteristic of its kind",
      "example": "This is a good example of the word.",
      "isReview": false
    }
  ],
  "quest": {
    "title": "Quest title",
    "description": "Clear instructions for the interactive activity",
    "type": "dialogue"
  },
  "estimatedMinutes": 15,
  "learningStyleFocus": "${learningStyle || 'mixed'}"
}

Quest types: dialogue, quiz, writing, or listening. Choose the most appropriate for both the topic AND the student's learning style.`;

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
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits depleted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let lesson;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      lesson = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON in AI response");
    }

    // Validate the lesson structure
    if (!lesson.topic || !lesson.vocabulary || !lesson.quest) {
      throw new Error("Incomplete lesson structure");
    }

    return new Response(
      JSON.stringify({ success: true, lesson }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-daily-lesson error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});