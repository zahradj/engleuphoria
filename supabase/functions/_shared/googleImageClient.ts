// Shared client for Google AI Studio image generation (Gemini 2.5 Flash Image / Nano Banana).
// Uses GEMINI_API_KEY directly — bypasses Lovable AI Gateway and its credit billing.

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
 * Generate a single image with Google's gemini-2.5-flash-image model.
 * Throws GoogleImageError with an appropriate HTTP status on failure.
 */
export async function generateGoogleImage(prompt: string): Promise<GoogleImageResult> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new GoogleImageError("GEMINI_API_KEY is not configured", 500);
  }
  if (!prompt || !prompt.trim()) {
    throw new GoogleImageError("Prompt is required", 400);
  }

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Google image API error", res.status, txt.slice(0, 500));
    // Map common Google statuses to friendly client statuses.
    if (res.status === 429) {
      throw new GoogleImageError("Rate limited by Google. Please try again shortly.", 429);
    }
    if (res.status === 403) {
      throw new GoogleImageError("Google API key rejected (check GEMINI_API_KEY permissions / billing).", 402);
    }
    throw new GoogleImageError(`Google image generation failed: ${txt.slice(0, 200)}`, 502);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = part?.inline_data ?? part?.inlineData;
    if (inline?.data) {
      const contentType: string = inline.mime_type ?? inline.mimeType ?? "image/png";
      const bytes = b64ToBytes(inline.data);
      const dataUrl = `data:${contentType};base64,${inline.data}`;
      return { bytes, contentType, dataUrl };
    }
  }

  console.error("Google image API: no inline image in response", JSON.stringify(data).slice(0, 500));
  throw new GoogleImageError("Google returned no image", 502);
}
