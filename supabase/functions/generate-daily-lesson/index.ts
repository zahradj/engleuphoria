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
    const { level, cefrLevel, interests, weakAreas } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const levelDescriptions: Record<string, string> = {
      playground: "young children aged 4-10, using simple words, fun topics, and playful language with emojis",
      academy: "teenagers aged 11-17, using contemporary topics, social media references, and trendy language",
      professional: "adult professionals, focusing on business English, formal communication, and career-relevant vocabulary",
    };

    const levelDescription = levelDescriptions[level] || levelDescriptions.professional;
    const interestsList = interests?.length > 0 ? interests.join(', ') : 'general topics';
    const weakAreasList = weakAreas?.length > 0 ? weakAreas.join(', ') : 'no specific weak areas identified';

    const systemPrompt = `You are an expert ESL lesson designer. Create engaging, personalized English lessons that match the student's level and interests. Always return valid JSON.`;

    const userPrompt = `Create a personalized 15-minute English lesson for ${levelDescription}.

Student Details:
- CEFR Level: ${cefrLevel || 'A2'}
- Interests: ${interestsList}
- Areas needing improvement: ${weakAreasList}

Generate a lesson with:
1. A compelling topic related to their interests
2. 5 vocabulary words with IPA pronunciation, definitions, and example sentences
3. An interactive quest/activity

Return ONLY this JSON structure (no markdown, no explanation):
{
  "topic": "Engaging topic title",
  "tagline": "Short catchy subtitle (max 10 words)",
  "vocabulary": [
    {
      "word": "example",
      "ipa": "/ɪɡˈzɑːmpəl/",
      "definition": "a thing characteristic of its kind",
      "example": "This is a good example of the word."
    }
  ],
  "quest": {
    "title": "Quest title",
    "description": "Clear instructions for the interactive activity",
    "type": "dialogue"
  },
  "estimatedMinutes": 15
}

Quest types: dialogue, quiz, writing, or listening. Choose the most appropriate for the topic.`;

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
