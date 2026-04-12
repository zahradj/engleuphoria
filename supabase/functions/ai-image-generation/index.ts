import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const PICSART_BASE = 'https://api.picsart.io/tools/1.0';

/**
 * Calls Picsart background removal API.
 * Returns the transparent-cutout URL, or null on failure.
 */
async function picsartRemoveBg(imageUrl: string, apiKey: string): Promise<string | null> {
  try {
    console.log('Picsart: removing background...');
    const form = new FormData();
    form.append('image_url', imageUrl);
    form.append('output_type', 'cutout');
    form.append('format', 'PNG');
    form.append('bg_blur', '0');

    const res = await fetch(`${PICSART_BASE}/removebg`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-Picsart-API-Key': apiKey,
      },
      body: form,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Picsart removebg failed:', res.status, errText);
      return null;
    }

    const data = await res.json();
    const url = data?.data?.url;
    if (url) console.log('✓ Background removed via Picsart');
    return url || null;
  } catch (err) {
    console.error('Picsart removebg error:', err);
    return null;
  }
}

/**
 * Calls Picsart upscale API.
 * Returns the enhanced URL, or null on failure.
 */
async function picsartUpscale(imageUrl: string, apiKey: string, factor = 2): Promise<string | null> {
  try {
    console.log(`Picsart: upscaling ${factor}x...`);
    const form = new FormData();
    form.append('image_url', imageUrl);
    form.append('upscale_factor', String(Math.min(factor, 4)));
    form.append('format', 'PNG');

    const res = await fetch(`${PICSART_BASE}/upscale`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-Picsart-API-Key': apiKey,
      },
      body: form,
    });

    if (!res.ok) {
      console.warn('Picsart upscale failed:', res.status);
      return null;
    }

    const data = await res.json();
    const url = data?.data?.url;
    if (url) console.log('✓ Image upscaled via Picsart');
    return url || null;
  } catch (err) {
    console.error('Picsart upscale error:', err);
    return null;
  }
}

/**
 * Uploads a remote image to Supabase Storage and returns its public URL.
 */
async function persistToStorage(
  imageUrl: string,
  bucketName: string,
  storagePath: string,
): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      console.warn('Supabase credentials missing, skipping storage persist');
      return null;
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Download the image
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;
    const blob = await imgRes.blob();

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    console.log('✓ Persisted to storage:', storagePath);
    return publicData.publicUrl;
  } catch (err) {
    console.error('Storage persist error:', err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      prompt,
      style = 'educational',
      negativePrompt,
      aspectRatio = '1:1',
      postProcess = false,
      persist = false,
      storagePath,
    } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'Lovable API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── 1. Generate image via Gemini ─────────────────────────────
    const preset = STYLE_PRESETS[style] || STYLE_PRESETS.educational;
    let enhancedPrompt = `${preset.prefix}. ${prompt}, ${preset.suffix}`;
    const allNegative = [preset.negative, negativePrompt].filter(Boolean).join(' ');
    if (allNegative) {
      enhancedPrompt += `. NEGATIVE: ${allNegative}`;
    }

    console.log('Generating image | style:', style, '| prompt:', enhancedPrompt.slice(0, 200));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{ role: 'user', content: enhancedPrompt }],
        modalities: ['image', 'text'],
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
    let imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'No image returned from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✓ AI image generated');
    let picsartApplied = false;

    // ── 2. Picsart Post-Processing (if enabled) ─────────────────
    if (postProcess) {
      const picsartKey = Deno.env.get('PICSART_API_KEY');
      if (picsartKey) {
        // For base64 data URLs, we need to upload first to get a real URL
        let processableUrl = imageUrl;
        if (imageUrl.startsWith('data:')) {
          // Persist base64 to storage first so Picsart can access it
          const tempPath = `temp/picsart_${Date.now()}.png`;
          const tempUrl = await persistToStorage(imageUrl, 'lesson-assets', tempPath);
          if (tempUrl) processableUrl = tempUrl;
        }

        // Step A: Remove background
        const bgRemovedUrl = await picsartRemoveBg(processableUrl, picsartKey);
        if (bgRemovedUrl) {
          imageUrl = bgRemovedUrl;
          picsartApplied = true;

          // Step B: Upscale (2x for crisp edges)
          const upscaledUrl = await picsartUpscale(imageUrl, picsartKey, 2);
          if (upscaledUrl) {
            imageUrl = upscaledUrl;
          }
        }
      } else {
        console.warn('PICSART_API_KEY not set, skipping post-processing');
      }
    }

    // ── 3. Persist to Supabase Storage (if requested) ───────────
    let publicUrl: string | null = null;
    if (persist && storagePath) {
      publicUrl = await persistToStorage(imageUrl, 'lesson-assets', storagePath);
    }

    return new Response(
      JSON.stringify({
        imageUrl: publicUrl || imageUrl,
        prompt: enhancedPrompt,
        style,
        aspectRatio,
        picsartApplied,
        persisted: !!publicUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-image-generation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
