// Shared client for AI image generation.
// Calls Google's Generative Language API directly using GEMINI_API_KEY.
// This bypasses the Lovable AI Gateway entirely so it does not consume
// Lovable AI credits. The legacy `imagen-3.0-generate-001:predict`
// endpoint has been retired by Google — do not reintroduce it.

const MODEL = "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

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
 * Generate a single image via Google Generative Language API (Gemini).
 * Throws GoogleImageError with an appropriate HTTP status on failure.
 * Name preserved for backwards compatibility with existing callers.
 */
export async function generateGoogleImage(prompt: string): Promise<GoogleImageResult> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new GoogleImageError("GEMINI_API_KEY is not configured", 500);
  }
  if (!prompt || !prompt.trim()) {
    throw new GoogleImageError("Prompt is required", 400);
  }

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Google Gemini image error", res.status, txt.slice(0, 500));
    if (res.status === 429) {
      throw new GoogleImageError("Rate limited by Google. Please retry shortly.", 429);
    }
    if (res.status === 401 || res.status === 403) {
      throw new GoogleImageError("GEMINI_API_KEY rejected by Google.", 401);
    }
    if (res.status === 400) {
      throw new GoogleImageError(`Bad request: ${txt.slice(0, 200)}`, 400);
    }
    throw new GoogleImageError(`Image generation failed: ${txt.slice(0, 200)}`, 502);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  let inline: { mimeType?: string; data?: string } | undefined;
  for (const p of parts) {
    const cand = p?.inlineData ?? p?.inline_data;
    if (cand?.data) {
      inline = { mimeType: cand.mimeType ?? cand.mime_type, data: cand.data };
      break;
    }
  }

  if (!inline?.data) {
    console.error("Gemini: no inline image in response", JSON.stringify(data).slice(0, 500));
    throw new GoogleImageError("Invalid response from Gemini (no image)", 502);
  }

  const contentType = inline.mimeType || "image/png";
  const bytes = b64ToBytes(inline.data);
  const dataUrl = `data:${contentType};base64,${inline.data}`;
  return { bytes, contentType, dataUrl };
}
