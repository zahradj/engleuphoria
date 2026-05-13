// Shared client for Google AI Studio image generation (Imagen 3).
// Uses GEMINI_API_KEY directly — bypasses Lovable AI Gateway and its credit billing.

const MODEL = "imagen-3.0-generate-001";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict`;

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
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Google Imagen API error", res.status, txt.slice(0, 500));
    if (res.status === 429) {
      throw new GoogleImageError("Rate limited by Google. Please try again shortly.", 429);
    }
    if (res.status === 403) {
      throw new GoogleImageError("Google API key rejected (check GEMINI_API_KEY permissions / billing).", 402);
    }
    throw new GoogleImageError(`Google image generation failed: ${txt.slice(0, 200)}`, 502);
  }

  const data = await res.json();
  const prediction = data?.predictions?.[0];
  const b64 = prediction?.bytesBase64Encoded;
  if (!b64) {
    console.error("Imagen API: no image in response", JSON.stringify(data).slice(0, 500));
    throw new GoogleImageError("Invalid response from Google Imagen API", 502);
  }
  const contentType: string = prediction?.mimeType ?? "image/png";
  const bytes = b64ToBytes(b64);
  const dataUrl = `data:${contentType};base64,${b64}`;
  return { bytes, contentType, dataUrl };
}
