/**
 * The "AI Art Director" — a single source of truth for the visual style
 * applied to every image generated for a lesson, keyed by hub.
 *
 * Used by:
 *   • generate-ppp-slides   → asks the AI to write detailed, on-style prompts
 *   • generate-all-media    → appends the suffix to every prompt before sending
 *                             it to the image-generation model
 *   • fetch-youtube-video   → drives SafeSearch + duration filters
 */

export type ArtHub = "Playground" | "Academy" | "Success";

export interface HubArtProfile {
  /** Short tag used in UI badges. */
  label: string;
  /** Style suffix appended to EVERY image prompt for this hub. */
  style_suffix: string;
  /** Negative prompt fragment to keep the look consistent. */
  negative: string;
  /** YouTube safe-search level — strict for Playground. */
  safe_search: "strict" | "moderate" | "none";
  /** Preferred clip length (seconds) when filtering YouTube results. */
  max_video_seconds: number;
}

export const HUB_ART_PROFILES: Record<ArtHub, HubArtProfile> = {
  Playground: {
    label: "Claymation Kids",
    style_suffix:
      "Friendly 3D claymation children's-book illustration, soft pastel palette, " +
      "rounded shapes, big expressive eyes, plush textures, gentle rim lighting, " +
      "centered composition on a clean solid pastel background, no text, no watermarks, " +
      "kid-safe, age 4-9.",
    negative:
      "no scary content, no realistic photography, no weapons, no horror, " +
      "no sharp edges, no dark themes, no text overlay.",
    safe_search: "strict",
    max_video_seconds: 240,
  },
  Academy: {
    label: "Modern Flat Vector",
    style_suffix:
      "Premium modern flat vector illustration, bold clean lines, vibrant teen-friendly " +
      "colour palette (purples, teals, accent corals), subtle depth via flat layered shapes, " +
      "isometric where appropriate, clean composition on a soft gradient background, " +
      "no text, no watermarks, age 10-16.",
    negative:
      "no childish claymation, no photorealism, no clutter, no text overlay.",
    safe_search: "moderate",
    max_video_seconds: 480,
  },
  Success: {
    label: "Editorial Cinematic",
    style_suffix:
      "Editorial cinematic photography, luxury corporate aesthetic, shot on 35mm Leica, " +
      "natural soft directional lighting, neutral sophisticated tones (charcoal, ivory, " +
      "subtle emerald), shallow depth of field, premium magazine quality, no text, " +
      "no watermarks, professional adult audience.",
    negative:
      "no cartoons, no childish illustration, no neon, no clutter, no text overlay.",
    safe_search: "moderate",
    max_video_seconds: 600,
  },
};

export function normalizeArtHub(input?: string): ArtHub {
  const v = (input || "").toLowerCase().trim();
  if (v === "playground" || v === "kids" || v === "children") return "Playground";
  if (v === "success" || v === "professional" || v === "adults" || v === "adult") return "Success";
  return "Academy";
}

/** Append the hub's house-style to any AI image prompt. */
export function applyHubStyle(prompt: string, hub: ArtHub): string {
  const profile = HUB_ART_PROFILES[hub];
  const cleaned = (prompt || "").trim().replace(/\s+/g, " ");
  return `${cleaned}. ${profile.style_suffix} NEGATIVE: ${profile.negative}`;
}
