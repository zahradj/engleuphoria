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
    const { action, topic, system, level, level_id, cefr_level } = body;

    console.log("n8n-bridge request:", { action, topic, system, level, cefr_level });

    if (action === "generate-lesson") {
      if (!n8nWebhookUrl) {
        // If n8n webhook is not configured, use the built-in AI lesson generator
        console.log("n8n webhook not configured, using built-in generator");
        
        const lesson = generateMockLesson(topic, system, level, cefr_level);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            data: lesson,
            message: "Generated using built-in generator (n8n not configured)"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Try to forward to n8n webhook
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
          }),
        });

        if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text();
          console.warn("n8n webhook failed, falling back to built-in generator:", n8nResponse.status, errorText);
          
          // Fall back to built-in generator when n8n fails
          const lesson = generateMockLesson(topic, system, level, cefr_level);
          return new Response(
            JSON.stringify({ 
              status: "success", 
              data: lesson,
              message: `Generated using built-in generator (n8n returned ${n8nResponse.status})`
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const n8nData = await n8nResponse.json();
        console.log("n8n response:", n8nData);

        // Check if n8n returned actual lesson data or just an async confirmation
        if (n8nData.message === "Workflow was started" || !n8nData.presentation) {
          // n8n is async, fall back to built-in generator
          console.log("n8n webhook is async, using built-in generator as fallback");
          const lesson = generateMockLesson(topic, system, level, cefr_level);
          
          return new Response(
            JSON.stringify({ 
              status: "success", 
              data: lesson,
              message: "Generated using built-in generator (n8n workflow is async)"
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ status: "success", data: n8nData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (n8nError) {
        console.warn("n8n webhook error, falling back to built-in generator:", n8nError);
        
        // Fall back to built-in generator when n8n is unreachable
        const lesson = generateMockLesson(topic, system, level, cefr_level);
        return new Response(
          JSON.stringify({ 
            status: "success", 
            data: lesson,
            message: "Generated using built-in generator (n8n unreachable)"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("n8n-bridge error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Built-in lesson generator for when n8n is not configured
function generateMockLesson(topic: string, system: string, level: string, cefrLevel: string) {
  const baseLesson = {
    system,
    title: `${topic} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
  };

  if (system === "kids") {
    return {
      ...baseLesson,
      presentation: {
        hook_activity: `Show colorful flashcards with examples of ${topic}. Use puppets or toys to demonstrate the concept in a fun way.`,
        concept_check_questions: [
          `Can you show me an example of ${topic}?`,
          "What do you see in the picture?",
          "Can you point to the correct one?",
        ],
      },
      practice: {
        game_mechanic: `Drag-and-drop matching game where students match ${topic} examples with pictures. Include sound effects and star rewards for correct answers.`,
        drill_sentences: [
          `I am learning about ${topic}.`,
          "Look at the colorful examples!",
          "Can you do it too?",
        ],
      },
      production: {
        creative_task: `Draw a picture showing ${topic} and describe it to the class using the new words.`,
        target_output: `Students should be able to identify and use basic ${topic} structures in simple sentences.`,
      },
    };
  }

  if (system === "teens") {
    return {
      ...baseLesson,
      presentation: {
        context_scenario: `Imagine you're texting your friend about your weekend plans. How would you use ${topic} in your messages? Look at this Instagram post example...`,
        grammar_rule: `${topic} is used when we want to describe actions or situations in a specific context. Pay attention to the structure and when to use it.`,
      },
      practice: {
        fill_in_the_blank: [
          { sentence: `She ____ (study) for the exam right now.`, answer: "is studying" },
          { sentence: `They ____ (not/watch) TV at the moment.`, answer: "aren't watching" },
        ],
        error_correction: [
          { sentence: "He don't like pizza.", correction: "He doesn't like pizza." },
          { sentence: "She is work now.", correction: "She is working now." },
        ],
      },
      production: {
        roleplay_prompt: `You're planning a party with your friends. Use ${topic} to discuss what everyone is bringing and doing.`,
        challenge: `Create a short TikTok script using at least 5 examples of ${topic}.`,
      },
    };
  }

  // Adults/Business
  return {
    ...baseLesson,
    presentation: {
      business_case: `"Dear Team, I am writing to inform you about the upcoming changes... We are currently reviewing the proposals and will be implementing new procedures." - Notice how ${topic} is used professionally.`,
      function_explanation: `In business English, ${topic} helps convey professionalism and clarity. It's essential for formal communication, reports, and presentations.`,
    },
    practice: {
      sentence_transformation: [
        { original: "Send the report.", professional: "Could you please send the report at your earliest convenience?" },
        { original: "I need this now.", professional: "I would appreciate it if you could prioritize this request." },
      ],
    },
    production: {
      simulation_task: `Draft a professional email using ${topic} to request a meeting with a potential client. Include appropriate greetings and closings.`,
      discussion_questions: [
        `How does ${topic} change the tone of business communication?`,
        "When is it appropriate to use formal vs. informal language?",
      ],
    },
  };
}
