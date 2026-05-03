// Generate kid-friendly cartoon illustrations for Playground lessons.
// Uses the Lovable AI Gateway image-generation model and uploads PNGs to
// the public `playground_assets` Supabase Storage bucket. Returns a map of
// subject -> public URL. Cached by content hash to avoid regenerating
// the same subject twice.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STYLE_PROMPT =
  "Style: Highly cheerful, colorful, high-quality cartoon illustration. " +
  "Suitable for pre-school children. Friendly character design. Clean " +
  "background, centered subject, soft lighting. Absolutely no mature themes " +
  "or scary elements.";

const BUCKET = "playground_assets";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48) || "img";
}

async function hashSubject(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s.toLowerCase().trim());
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .slice(0, 6)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function dataUrlToBytes(url: string): { bytes: Uint8Array; mime: string } {
  const m = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) throw new Error("Invalid data URL from image model");
  const mime = m[1];
  const b64 = m[2];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, mime };
}

async function generateOne(
  subject: string,
  apiKey: string,
  supabase: ReturnType<typeof createClient>,
): Promise<{ subject: string; url: string }> {
  const safe = subject.trim().slice(0, 120);
  const hash = await hashSubject(safe);
  const path = `ai/${slugify(safe)}-${hash}.png`;

  // Cache check — public URL is deterministic.
  const { data: list } = await supabase.storage.from(BUCKET).list("ai", { search: `${slugify(safe)}-${hash}` });
  if (list && list.some((f) => f.name === `${slugify(safe)}-${hash}.png`)) {
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { subject, url: pub.publicUrl };
  }

  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [
        { role: "user", content: `${STYLE_PROMPT}\n\nSubject: ${safe}` },
      ],
    }),
  });
  if (!aiRes.ok) {
    const t = await aiRes.text();
    throw new Error(`Image gen ${aiRes.status}: ${t.slice(0, 200)}`);
  }
  const aiJson = await aiRes.json();
  const dataUrl: string | undefined =
    aiJson?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl) throw new Error("Image model returned no image");

  const { bytes, mime } = dataUrlToBytes(dataUrl);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: mime, upsert: true });
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { subject, url: pub.publicUrl };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { subjects } = await req.json();
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return new Response(JSON.stringify({ error: "subjects[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const capped: string[] = subjects.slice(0, 16).map((s: unknown) => String(s));
    const results = await Promise.allSettled(capped.map((s) => generateOne(s, apiKey, supabase)));
    const images = results
      .map((r, i) => (r.status === "fulfilled" ? r.value : { subject: capped[i], url: "" }))
      .filter((x) => x.url);

    return new Response(JSON.stringify({ images }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-playground-images error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
