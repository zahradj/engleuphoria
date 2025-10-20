import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characterDescription, characterName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`🎨 Generating image for ${characterName} using Gemini...`);

    // Enhanced prompt for better Gemini image generation
    const prompt = `Create a high-quality cartoon character illustration for a children's English learning app:

CHARACTER: ${characterName}
DESCRIPTION: ${characterDescription}

STYLE REQUIREMENTS:
- Simple, friendly cartoon style suitable for ages 4-7
- Bright, vibrant colors with high contrast
- Large, expressive eyes and warm, welcoming smile
- Clean, smooth lines with no texture
- Solid white or light pastel background
- Character should be centered and facing forward
- Full body view or upper body portrait
- Professional children's book illustration quality

AVOID: realistic details, scary features, dark colors, complex backgrounds

Generate a single, clear image of this character.`;

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
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini image generation error:", response.status, errorText);
      
      // Handle rate limiting
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("❌ No image URL in response:", JSON.stringify(data));
      throw new Error("No image generated - check Gemini API response format");
    }

    console.log(`✅ Image generated successfully for ${characterName}`);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-character-image:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
