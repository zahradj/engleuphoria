import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── Style Presets ────────────────────────────────────────────────
const STYLE_PRESETS: Record<string, { prefix: string; suffix: string; negative: string }> = {
  flat2d: {
    prefix: 'Professional 2D flat vector illustration for a children\'s educational app. Use the Professional Flat 2.0 style: clean bold lines, solid colors with subtle layering, white background (#FFFFFF), isolated object, Engleuphoria Navy accents.',
    suffix: 'high quality, clean composition, educational',
    negative: 'No 3D, no render, no depth, no shadows, no gradients, no photorealism, no fuzzy textures, no messy lines, no background scenery, no blender, no 3ds max, no Octane Render, no Unreal Engine.',
  },
  educational: {
    prefix: 'clean educational illustration, simple and clear, perfect for learning, professional style',
    suffix: 'high quality illustration for English language learning',
    negative: '',
  },
  cartoon: {
    prefix: 'colorful cartoon style, friendly and engaging, suitable for children',
    suffix: 'high quality illustration for English language learning',
    negative: '',
  },
  minimalist: {
    prefix: 'minimal line art, clean and simple, modern design',
    suffix: 'high quality illustration for English language learning',
    negative: '',
  },
  realistic: {
    prefix: 'photorealistic style, high quality and detailed',
    suffix: 'high quality illustration for English language learning',
    negative: '',
  },
  'hand-drawn': {
    prefix: 'hand-drawn sketch style, artistic and creative',
    suffix: 'high quality illustration for English language learning',
    negative: '',
  },
  cinematic: {
    prefix: 'cinematic professional illustration, dramatic lighting, high-end production quality',
    suffix: 'high quality, 8k resolution',
    negative: '',
  },
  editorial: {
    prefix: 'Minimalist editorial photography, luxury corporate aesthetic, shot on 35mm Leica, natural soft lighting, neutral tones',
    suffix: 'high-end professional stock style',
    negative: '',
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style = 'educational', negativePrompt, aspectRatio = '1:1' } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('Lovable API key not found');
      return new Response(
        JSON.stringify({ error: 'Lovable API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resolve style preset
    const preset = STYLE_PRESETS[style] || STYLE_PRESETS.educational;
    
    // Build enhanced prompt with style prefix, user prompt, suffix, and negative constraints
    let enhancedPrompt = `${preset.prefix}. ${prompt}, ${preset.suffix}`;
    
    // Append negative prompt constraints
    const allNegative = [preset.negative, negativePrompt].filter(Boolean).join(' ');
    if (allNegative) {
      enhancedPrompt += `. NEGATIVE: ${allNegative}`;
    }

    console.log('Generating image with style:', style, '| Prompt:', enhancedPrompt.slice(0, 200));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Lovable AI error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image', details: errorData }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('Invalid response from Gemini:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Lovable AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Image generated successfully with style:', style);

    return new Response(
      JSON.stringify({ imageUrl, prompt: enhancedPrompt, style, aspectRatio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-image-generation function:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
