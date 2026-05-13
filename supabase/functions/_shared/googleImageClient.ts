// Shared client for AI image generation.
// Routes through the Lovable AI Gateway (Nano Banana / gemini-2.5-flash-image).
// The legacy Google Imagen 3 endpoint (`imagen-3.0-generate-001:predict`)
// has been retired by Google and now returns 404 — do not reintroduce it.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-image";

export class GoogleImageError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface GoogleImageResult {
  bytes: Uint8Array;
  contentType: string;
  /** data:<mime>;base64,<...> — convenient for callers that need a data URL */
  dataUrl: string;
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Generate a single image via the Lovable AI Gateway.
 * Throws GoogleImageError with an appropriate HTTP status on failure.
 * Name preserved for backwards compatibility with existing callers.
 */
export async function generateGoogleImage(prompt: string): Promise<GoogleImageResult> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    throw new GoogleImageError("LOVABLE_API_KEY is not configured", 500);
  }
  if (!prompt || !prompt.trim()) {
    throw new GoogleImageError("Prompt is required", 400);
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Lovable AI Gateway image error", res.status, txt.slice(0, 500));
    if (res.status === 429) {
      throw new GoogleImageError("Rate limited. Please try again shortly.", 429);
    }
    if (res.status === 402) {
      throw new GoogleImageError("AI credits exhausted. Add credits in Workspace → Usage.", 402);
    }
    if (res.status === 401 || res.status === 403) {
      throw new GoogleImageError("LOVABLE_API_KEY rejected by AI Gateway.", 402);
    }
    throw new GoogleImageError(`Image generation failed: ${txt.slice(0, 200)}`, 502);
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  const imageUrl: string | undefined =
    message?.images?.[0]?.image_url?.url ??
    message?.images?.[0]?.url ??
    undefined;

  if (!imageUrl || !imageUrl.startsWith("data:")) {
    console.error("AI Gateway: no image in response", JSON.stringify(data).slice(0, 500));
    throw new GoogleImageError("Invalid response from AI Gateway (no image)", 502);
  }

  // Parse data URL: data:<mime>;base64,<payload>
  const commaIdx = imageUrl.indexOf(",");
  const header = imageUrl.slice(5, commaIdx); // strip leading "data:"
  const b64 = imageUrl.slice(commaIdx + 1);
  const contentType = header.split(";")[0] || "image/png";
  const bytes = b64ToBytes(b64);
  const dataUrl = imageUrl;
  return { bytes, contentType, dataUrl };
}
