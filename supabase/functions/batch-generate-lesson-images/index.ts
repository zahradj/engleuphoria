import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imagePrompts } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!imagePrompts || typeof imagePrompts !== 'object') {
      throw new Error('imagePrompts must be an object with slide IDs as keys');
    }

    const results: Record<string, string> = {};
    const errors: Record<string, string> = {};

    // Generate images for each slide
    for (const [slideId, prompt] of Object.entries(imagePrompts)) {
      try {
        console.log(`Generating image for ${slideId}...`);
        
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: `Generate an educational illustration for ESL students: ${prompt}. Style: colorful, friendly, child-appropriate, clear and simple.`
              }
            ],
            modalities: ["image", "text"]
          })
        });

        if (!response.ok) {
          if (response.status === 429) {
            errors[slideId] = "Rate limit exceeded";
            continue;
          }
          if (response.status === 402) {
            errors[slideId] = "Payment required";
            continue;
          }
          errors[slideId] = `API error: ${response.status}`;
          continue;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
          results[slideId] = imageUrl;
          console.log(`✓ Generated image for ${slideId}`);
        } else {
          errors[slideId] = "No image in response";
        }
      } catch (error) {
        console.error(`Error generating image for ${slideId}:`, error);
        errors[slideId] = error instanceof Error ? error.message : "Unknown error";
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        errors,
        totalRequested: Object.keys(imagePrompts).length,
        totalGenerated: Object.keys(results).length,
        totalFailed: Object.keys(errors).length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Batch image generation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
