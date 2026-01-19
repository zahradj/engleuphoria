import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action, topic, system, level, level_id, cefr_level, lesson_type, unit_name, level_name } = body;

    console.log("n8n-bridge request:", { action, topic, system, level, cefr_level, lesson_type });

    if (action === "generate-lesson") {
      // Try n8n webhook first if configured
      if (n8nWebhookUrl) {
        console.log("Forwarding to n8n webhook:", n8nWebhookUrl);
        
        try {
          const n8nResponse = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic,
              system,
              level,
              level_id,
              cefr_level,
              lesson_type,
              unit_name,
              level_name,
            }),
          });

          if (n8nResponse.ok) {
            const n8nData = await n8nResponse.json();
            console.log("n8n response received");

            // Check if n8n returned actual lesson data
            if (n8nData.presentation && n8nData.title) {
              return new Response(
                JSON.stringify({ status: "success", data: n8nData, source: "n8n" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }
          console.log("n8n did not return valid lesson, falling back to AI");
        } catch (n8nError) {
          console.warn("n8n webhook error:", n8nError);
        }
      }

      // Use Lovable AI to generate the lesson
      if (!lovableApiKey) {
        console.error("LOVABLE_API_KEY not configured");
        return new Response(
          JSON.stringify({ error: "AI service not configured. Please add LOVABLE_API_KEY." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Generating lesson with Lovable AI...");
      
      const lesson = await generateLessonWithAI({
        topic,
        system,
        level,
        cefrLevel: cefr_level,
        lessonType: lesson_type,
        unitName: unit_name,
        levelName: level_name,
        apiKey: lovableApiKey,
      });

      return new Response(
        JSON.stringify({ 
          status: "success", 
          data: lesson,
          source: "lovable-ai",
          message: "Generated using Lovable AI"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("n8n-bridge error:", error);
    
    // Handle rate limits
    if (error instanceof Response && error.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle payment required
    if (error instanceof Response && error.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ============================================================================
// Lovable AI Lesson Generator
// ============================================================================

interface GenerateParams {
  topic: string;
  system: string;
  level: string;
  cefrLevel: string;
  lessonType?: string;
  unitName?: string;
  levelName?: string;
  apiKey: string;
}

async function generateLessonWithAI(params: GenerateParams) {
  const { topic, system, level, cefrLevel, lessonType, unitName, levelName, apiKey } = params;

  // Build system-specific context
  const systemContext = getSystemContext(system);
  const lessonTypeContext = getLessonTypeContext(lessonType || "Mechanic");

  const systemPrompt = `You are an expert ESL curriculum designer specializing in creating engaging, pedagogically sound lessons. 
You create complete PPP (Presentation-Practice-Production) lessons with 13 slides that are classroom-ready.

SYSTEM CONTEXT:
- Target System: ${systemContext.label} (${systemContext.visualStyle})
- Age Group: ${systemContext.ageGroup}
- Tone: ${systemContext.tone}
- Activity Style: ${systemContext.activities}

LESSON TYPE: ${lessonType || "Mechanic"}
${lessonTypeContext}

Always output valid JSON matching the exact schema provided.`;

  const userPrompt = `Create a complete 13-slide ESL lesson with the following specifications:

LESSON DETAILS:
- Topic: ${topic}
- Level: ${levelName || level} (${cefrLevel})
- Unit: ${unitName || "General"}
- System: ${system}
- Lesson Type: ${lessonType || "Mechanic"}

REQUIREMENTS:
1. Generate 4 vocabulary items with:
   - Word
   - IPA pronunciation (accurate phonetic transcription)
   - Clear, age-appropriate definition
   - Example sentence using the word in context

2. Create a grammar rule with:
   - Clear explanation of the rule
   - Pattern formula (e.g., "Subject + verb + object")
   - 4 example sentences
   - 3 common mistakes with corrections

3. Design 13 slides following PPP structure:
   PRESENTATION PHASE (Slides 1-6):
   - Slide 1: Title & Warmup (objectives, engaging question)
   - Slides 2-5: Vocabulary (one word per slide)
   - Slide 6: Grammar Focus (rule, pattern, examples)
   
   PRACTICE PHASE (Slides 7-11):
   - Slide 7: Controlled Practice (fill-in-the-blank exercises)
   - Slide 8: Dialogue (age-appropriate conversation)
   - Slide 9: Speaking Practice (guided speaking activity)
   - Slide 10: Interactive Game (matching, quiz, or drag-drop)
   - Slide 11: Quick Quiz (multiple choice assessment)
   
   PRODUCTION PHASE (Slides 12-13):
   - Slide 12: Creative Production Task
   - Slide 13: Summary & Homework

4. Include teacher notes for each slide with timing suggestions.

5. Make content age-appropriate for ${systemContext.ageGroup}:
   - ${system === "kids" ? "Use cartoon characters, games, colors, simple language" : ""}
   - ${system === "teen" ? "Reference social media, trending topics, peer interactions" : ""}
   - ${system === "adult" ? "Use professional scenarios, business contexts, formal registers" : ""}`;

  // Define the tool for structured output
  const tools = [
    {
      type: "function",
      function: {
        name: "create_ppp_lesson",
        description: "Create a complete PPP lesson with 13 slides, vocabulary, and grammar content",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Lesson title including topic and level" },
            system: { type: "string", description: "Target system: kids, teen, or adult" },
            cefrLevel: { type: "string", description: "CEFR level code" },
            slideCount: { type: "number", description: "Total number of slides (should be 13)" },
            estimatedDuration: { type: "number", description: "Estimated lesson duration in minutes" },
            slides: {
              type: "array",
              description: "Array of 13 lesson slides",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ["title", "vocabulary", "grammar", "practice", "dialogue", "speaking", "game", "quiz", "production", "summary"] },
                  title: { type: "string" },
                  phase: { type: "string", enum: ["presentation", "practice", "production"] },
                  phaseLabel: { type: "string" },
                  content: { type: "object", description: "Slide-specific content" },
                  teacherNotes: { type: "string" },
                  durationSeconds: { type: "number" },
                },
                required: ["id", "type", "title", "phase", "phaseLabel", "content", "teacherNotes", "durationSeconds"],
              },
            },
            presentation: {
              type: "object",
              properties: {
                hook_activity: { type: "string" },
                concept_check_questions: { type: "array", items: { type: "string" } },
                vocabulary: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      word: { type: "string" },
                      ipa: { type: "string" },
                      definition: { type: "string" },
                      example: { type: "string" },
                    },
                    required: ["word", "ipa", "definition", "example"],
                  },
                },
                grammar_rule: { type: "string" },
              },
              required: ["hook_activity", "vocabulary", "grammar_rule"],
            },
            practice: {
              type: "object",
              properties: {
                game_mechanic: { type: "string" },
                drill_sentences: { type: "array", items: { type: "string" } },
                exercises: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      answer: { type: "string" },
                      options: { type: "array", items: { type: "string" } },
                    },
                  },
                },
              },
              required: ["game_mechanic", "exercises"],
            },
            production: {
              type: "object",
              properties: {
                creative_task: { type: "string" },
                target_output: { type: "string" },
                peer_review: { type: "string" },
              },
              required: ["creative_task", "target_output"],
            },
          },
          required: ["title", "system", "cefrLevel", "slideCount", "slides", "presentation", "practice", "production"],
        },
      },
    },
  ];

  console.log("Calling Lovable AI Gateway...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: { type: "function", function: { name: "create_ppp_lesson" } },
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Gateway error:", response.status, errorText);
    
    if (response.status === 429) {
      throw new Response("Rate limit exceeded", { status: 429 });
    }
    if (response.status === 402) {
      throw new Response("Payment required", { status: 402 });
    }
    throw new Error(`AI generation failed: ${response.status}`);
  }

  const aiResponse = await response.json();
  console.log("AI response received:", JSON.stringify(aiResponse).substring(0, 500));

  // Check if AI Gateway returned an error in the response body
  if (aiResponse.error) {
    console.error("AI Gateway returned error:", aiResponse.error);
    throw new Error(`AI Gateway error: ${aiResponse.error.message || JSON.stringify(aiResponse.error)}`);
  }

  // Extract the tool call result
  const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
  
  // If no tool call, try to extract from content directly (some models return JSON in content)
  if (!toolCall) {
    const content = aiResponse.choices?.[0]?.message?.content;
    if (content) {
      console.log("Attempting to parse lesson from content...");
      try {
        // Try to extract JSON from the content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const lessonData = JSON.parse(jsonMatch[0]);
          if (lessonData.slides && lessonData.title) {
            console.log("Successfully parsed lesson from content");
            return lessonData;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse content as JSON:", parseError);
      }
    }
    console.error("Unexpected AI response format:", JSON.stringify(aiResponse).substring(0, 1000));
    throw new Error("AI did not return expected lesson format - no tool call or valid JSON content found");
  }

  if (toolCall.function.name !== "create_ppp_lesson") {
    console.error("Wrong tool called:", toolCall.function.name);
    throw new Error(`AI called wrong tool: ${toolCall.function.name}`);
  }

  const lessonData = JSON.parse(toolCall.function.arguments);
  
  // Validate minimum structure
  if (!lessonData.slides || lessonData.slides.length < 10) {
    console.warn("AI returned fewer slides than expected, lesson may be incomplete");
  }

  return lessonData;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getSystemContext(system: string) {
  switch (system) {
    case "kids":
      return {
        label: "Playground",
        visualStyle: "Cartoon / Vibrant",
        ageGroup: "children ages 5-10",
        tone: "playful, encouraging, simple",
        activities: "games, songs, coloring, puppets, movement",
      };
    case "teen":
      return {
        label: "The Academy",
        visualStyle: "Realistic / Social / Modern",
        ageGroup: "teenagers ages 11-17",
        tone: "casual, relatable, engaging",
        activities: "role-play, social media projects, debates, peer work",
      };
    case "adult":
    default:
      return {
        label: "The Hub",
        visualStyle: "Corporate / Minimalist / Professional",
        ageGroup: "adults ages 18+",
        tone: "professional, practical, business-focused",
        activities: "case studies, simulations, presentations, negotiations",
      };
  }
}

function getLessonTypeContext(lessonType: string) {
  switch (lessonType) {
    case "Mechanic":
      return `MECHANIC LESSON FOCUS:
- Heavy emphasis on grammar rules and patterns
- Drill exercises and controlled practice
- Clear explanations of language mechanics
- Multiple examples showing correct usage
- Error correction activities`;

    case "Context":
      return `CONTEXT LESSON FOCUS:
- Reading comprehension activities
- Authentic texts (articles, blog posts, stories)
- Vocabulary in context
- Comprehension questions
- Text analysis and discussion`;

    case "Application":
      return `APPLICATION LESSON FOCUS:
- Speaking and communication activities
- Role-plays and simulations
- Real-world scenarios
- Interactive pair/group work
- Fluency over accuracy`;

    case "Checkpoint":
      return `CHECKPOINT LESSON FOCUS:
- Mission-based assessment
- Creative production task
- Integration of all skills learned
- Portfolio-worthy output
- Self and peer evaluation`;

    default:
      return "";
  }
}
