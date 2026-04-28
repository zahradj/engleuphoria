// Orchestrator: walks every slide in a deck and, in parallel batches, generates
// either an AI image (with the hub Art Director suffix) or fetches a safe
// YouTube video — based on the slide's `requires_video` flag.
//
// Voiceovers are intentionally NOT generated here (they're handled per-slide
// by the existing generate-slide-voiceover button, since voice is expensive
// and often slide-specific).
//
// Returns a per-slide map: { [slideId]: { custom_image_url? | youtube_video_id? | error? } }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SlideJob {
  id: string;
  slide_type?: string;
  title?: string;
  visual_keyword?: string;
  image_generation_prompt?: string;
  requires_video?: boolean;
  youtube_query?: string;
  custom_image_url?: string;
  custom_video_url?: string;
  youtube_video_id?: string;
}

interface SlideResult {
  slideId: string;
  custom_image_url?: string;
  youtube_video_id?: string;
  youtube_embed_url?: string;
  youtube_title?: string;
  youtube_thumbnail?: string;
  skipped?: boolean;
  error?: string;
}

const PARALLEL = 3; // throttle so we don't hammer the AI gateway / YouTube quota.

async function processBatches<T, R>(
  items: T[],
  size: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const settled = await Promise.all(batch.map((it) => worker(it)));
    out.push(...settled);
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lessonId, hub, slides, overwrite = false } = await req.json() as {
      lessonId?: string;
      hub?: string;
      slides?: SlideJob[];
      overwrite?: boolean;
    };
    if (!Array.isArray(slides) || !slides.length) {
      return new Response(JSON.stringify({ error: "slides[] is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const worker = async (slide: SlideJob): Promise<SlideResult> => {
      try {
        const wantsVideo = !!slide.requires_video && !!(slide.youtube_query || "").trim();
        const wantsImage = !wantsVideo && !!(
          slide.image_generation_prompt || slide.visual_keyword || slide.title
        );

        // Skip if asset already exists and overwrite is false.
        if (!overwrite) {
          if (wantsVideo && slide.youtube_video_id) return { slideId: slide.id, skipped: true };
          if (wantsImage && slide.custom_image_url) return { slideId: slide.id, skipped: true };
        }

        if (wantsVideo) {
          const { data, error } = await admin.functions.invoke("fetch-youtube-video", {
            body: { query: slide.youtube_query, hub },
          });
          if (error) throw new Error(error.message);
          if (!data?.videoId) throw new Error("No video returned");
          return {
            slideId: slide.id,
            youtube_video_id: data.videoId,
            youtube_embed_url: data.embed_url,
            youtube_title: data.title,
            youtube_thumbnail: data.thumbnail,
          };
        }

        if (wantsImage) {
          const prompt = (slide.image_generation_prompt || slide.visual_keyword || slide.title || "").trim();
          const { data, error } = await admin.functions.invoke("generate-slide-image", {
            body: { prompt, lessonId, slideId: slide.id, hub },
          });
          if (error) throw new Error(error.message);
          if (!data?.url) throw new Error("No image URL returned");
          return { slideId: slide.id, custom_image_url: data.url };
        }

        return { slideId: slide.id, skipped: true };
      } catch (e) {
        return { slideId: slide.id, error: (e as Error).message };
      }
    };

    const results = await processBatches(slides, PARALLEL, worker);

    const summary = {
      total: results.length,
      images: results.filter((r) => r.custom_image_url).length,
      videos: results.filter((r) => r.youtube_video_id).length,
      skipped: results.filter((r) => r.skipped).length,
      errors: results.filter((r) => r.error).length,
    };

    return new Response(JSON.stringify({ results, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-all-media error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
