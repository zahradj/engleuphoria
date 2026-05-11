import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGoogleImage, GoogleImageError } from "../_shared/googleImageClient.ts";

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

    console.log(`🎨 Generating image for ${characterName} via Google AI Studio...`);

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

    try {
      const { dataUrl } = await generateGoogleImage(prompt);
      console.log(`✅ Image generated successfully for ${characterName}`);
      return new Response(
        JSON.stringify({ imageUrl: dataUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (e) {
      const err = e as GoogleImageError;
      const status = err.status ?? 500;
      console.error("❌ Google image generation error:", status, err.message);
      return new Response(
        JSON.stringify({ error: err.message }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in generate-character-image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
