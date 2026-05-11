import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGoogleImage, GoogleImageError } from "../_shared/googleImageClient.ts";

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

    if (!imagePrompts || typeof imagePrompts !== 'object') {
      throw new Error('imagePrompts must be an object with slide IDs as keys');
    }

    const results: Record<string, string> = {};
    const errors: Record<string, string> = {};

    for (const [slideId, rawPrompt] of Object.entries(imagePrompts)) {
      const prompt = `Generate an educational illustration for ESL students: ${rawPrompt}. Style: colorful, friendly, child-appropriate, clear and simple.`;
      try {
        console.log(`Generating image for ${slideId}...`);
        const { dataUrl } = await generateGoogleImage(prompt);
        results[slideId] = dataUrl;
        console.log(`✓ Generated image for ${slideId}`);
      } catch (e) {
        const err = e as GoogleImageError;
        errors[slideId] = err.message ?? 'Unknown error';
        console.error(`Error generating image for ${slideId}:`, errors[slideId]);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        errors,
        totalRequested: Object.keys(imagePrompts).length,
        totalGenerated: Object.keys(results).length,
        totalFailed: Object.keys(errors).length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Batch image generation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
