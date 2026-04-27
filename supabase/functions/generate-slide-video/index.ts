// Generate an AI video clip via fal.ai (Veo 3 Fast text-to-video) and upload
// the resulting MP4 to the public `lesson-assets` bucket. Returns a CDN URL.
//
// fal.ai uses an async queue: submit → poll status → fetch result.
// Veo 3 Fast typically returns in 30-60s for a 5-8s clip.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "lesson-assets";
const FAL_MODEL = "fal-ai/veo3/fast"; // Google Veo 3 Fast — text→video
const POLL_INTERVAL_MS = 3_000;
const MAX_POLL_MS = 180_000; // 3 minutes hard cap

interface FalQueueSubmitResponse {
  request_id: string;
  status_url: string;
  response_url: string;
}

interface FalStatusResponse {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  logs?: Array<{ message: string }>;
}

interface FalVeoResult {
  video?: { url: string; content_type?: string };
  // Older shape for some fal models
  videos?: Array<{ url: string }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, lessonId, slideId } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return jsonResponse({ error: "Prompt is required" }, 400);
    }

    const FAL_KEY = Deno.env.get("FAL_KEY");
    if (!FAL_KEY) {
      return jsonResponse({ error: "FAL_KEY not configured" }, 500);
    }

    // 1. Submit job to fal queue
    const submitRes = await fetch(`https://queue.fal.run/${FAL_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        aspect_ratio: "16:9",
        duration: "8s",
        generate_audio: false,
      }),
    });

    if (!submitRes.ok) {
      const txt = await submitRes.text();
      console.error("fal submit error:", submitRes.status, txt);
      return jsonResponse(
        { error: "Video provider rejected the request", details: txt },
        submitRes.status === 401 ? 500 : 502,
      );
    }

    const submit = (await submitRes.json()) as FalQueueSubmitResponse;
    if (!submit.request_id) {
      return jsonResponse({ error: "Video provider returned no request id" }, 502);
    }

    // 2. Poll status until COMPLETED / FAILED / timeout
    const statusUrl = `https://queue.fal.run/${FAL_MODEL}/requests/${submit.request_id}/status`;
    const resultUrl = `https://queue.fal.run/${FAL_MODEL}/requests/${submit.request_id}`;
    const startedAt = Date.now();
    let status: FalStatusResponse["status"] = "IN_QUEUE";

    while (Date.now() - startedAt < MAX_POLL_MS) {
      await sleep(POLL_INTERVAL_MS);
      const sRes = await fetch(statusUrl, {
        headers: { Authorization: `Key ${FAL_KEY}` },
      });
      if (!sRes.ok) {
        const txt = await sRes.text();
        console.error("fal status error:", sRes.status, txt);
        continue;
      }
      const s = (await sRes.json()) as FalStatusResponse;
      status = s.status;
      if (status === "COMPLETED") break;
      if (status === "FAILED") {
        return jsonResponse(
          { error: "Video generation failed at provider", details: s.logs },
          502,
        );
      }
    }

    if (status !== "COMPLETED") {
      return jsonResponse(
        { error: "Video generation timed out. Please try again." },
        504,
      );
    }

    // 3. Fetch the result payload
    const rRes = await fetch(resultUrl, {
      headers: { Authorization: `Key ${FAL_KEY}` },
    });
    if (!rRes.ok) {
      const txt = await rRes.text();
      console.error("fal result error:", rRes.status, txt);
      return jsonResponse({ error: "Failed to fetch video result", details: txt }, 502);
    }
    const result = (await rRes.json()) as FalVeoResult;
    const videoUrl = result.video?.url ?? result.videos?.[0]?.url;
    if (!videoUrl) {
      console.error("fal result missing video url:", JSON.stringify(result).slice(0, 500));
      return jsonResponse({ error: "Provider returned no video URL" }, 502);
    }

    // 4. Download MP4 bytes
    const mp4Res = await fetch(videoUrl);
    if (!mp4Res.ok) {
      return jsonResponse({ error: "Failed to download generated video" }, 502);
    }
    const bytes = new Uint8Array(await mp4Res.arrayBuffer());
    const contentType = mp4Res.headers.get("content-type") || "video/mp4";

    // 5. Upload to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const safeLesson = (lessonId || "draft").toString().replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeSlide = (slideId || crypto.randomUUID()).toString().replace(/[^a-zA-Z0-9_-]/g, "_");
    const path = `studio/${safeLesson}/ai-video-${safeSlide}-${Date.now()}.mp4`;

    const { error: upErr } = await admin.storage.from(BUCKET).upload(path, bytes, {
      contentType,
      upsert: true,
      cacheControl: "3600",
    });
    if (upErr) {
      console.error("Upload error:", upErr);
      return jsonResponse({ error: "Storage upload failed", details: upErr.message }, 500);
    }

    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
    return jsonResponse({ url: pub.publicUrl, path }, 200);
  } catch (err) {
    console.error("generate-slide-video fatal:", err);
    return jsonResponse({ error: (err as Error).message || "Unexpected error" }, 500);
  }
});

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
