/**
 * Hub-specific Image Style Matrix.
 * Drives the "Image Style" selector in the Generate Lesson Modal AND
 * is appended to every Imagen / Gemini-Image prompt downstream.
 */
import type { Hub } from './GenerateLessonModal';

export interface ImageStyleOption {
  /** Stable id sent to the backend. */
  id: string;
  /** Human label shown in the dropdown. */
  label: string;
  /** Strict suffix appended to the Google Imagen prompt to enforce the look. */
  promptSuffix: string;
}

export const IMAGE_STYLES_BY_HUB: Record<Hub, ImageStyleOption[]> = {
  playground: [
    {
      id: 'cheerful-cartoon',
      label: '🎨 Cheerful Cartoon',
      promptSuffix:
        'rendered in an authentic, flawless cheerful western cartoon style — bold black outlines, vibrant primary colours, simple shapes, friendly rounded characters, child-appropriate, no scary elements, pure white background',
    },
    {
      id: 'kawaii-anime',
      label: '🌸 Kawaii Anime',
      promptSuffix:
        'rendered in an authentic, flawless kawaii Japanese anime style — large sparkling eyes, pastel palette, soft cel-shading, super-deformed chibi proportions, child-friendly, pure white background',
    },
    {
      id: 'claymation',
      label: '🧱 Claymation',
      promptSuffix:
        'rendered in an authentic, flawless claymation style — soft plasticine textures, tactile fingerprint detail, gentle studio lighting, stop-motion charm, child-friendly, pure white background',
    },
  ],
  academy: [
    {
      id: 'modern-vector',
      label: '🖥 Modern Vector Art',
      promptSuffix:
        'rendered in an authentic, flawless modern flat vector illustration style — clean geometric shapes, confident colour blocking, subtle gradients, sleek editorial composition, white background',
    },
    {
      id: 'stylized-manga',
      label: '🗡 Stylized Manga',
      promptSuffix:
        'rendered in an authentic, flawless contemporary manga style — crisp ink line art, dynamic panel composition, expressive character design, halftone shading, age-appropriate teen aesthetic',
    },
    {
      id: 'cinematic-painting',
      label: '🎬 Cinematic Digital Painting',
      promptSuffix:
        'rendered in an authentic, flawless cinematic digital painting style — dramatic rim lighting, painterly brushwork, rich colour grading, concept-art quality, age-appropriate teen aesthetic',
    },
  ],
  success: [
    {
      id: 'professional-photo',
      label: '📷 Professional Photography',
      promptSuffix:
        'captured as authentic, flawless professional editorial photography — shot on a 35mm full-frame camera, natural soft lighting, neutral corporate tones, shallow depth of field, premium business aesthetic',
    },
    {
      id: 'realistic-3d',
      label: '🧊 Realistic 3D Render',
      promptSuffix:
        'rendered as an authentic, flawless realistic 3D render — physically-based materials, soft global illumination, subtle depth of field, premium product-visualisation quality',
    },
    {
      id: 'minimalist-stock',
      label: '🪄 Minimalist Stock Art',
      promptSuffix:
        'rendered as authentic, flawless minimalist stock illustration — restrained palette, generous whitespace, single focal subject, modern corporate aesthetic, clean and timeless',
    },
  ],
};

export const DEFAULT_IMAGE_STYLE_ID: Record<Hub, string> = {
  playground: 'cheerful-cartoon',
  academy: 'modern-vector',
  success: 'professional-photo',
};

export const getImageStyle = (hub: Hub, id?: string | null): ImageStyleOption => {
  const list = IMAGE_STYLES_BY_HUB[hub] || IMAGE_STYLES_BY_HUB.academy;
  return list.find((s) => s.id === id) ?? list.find((s) => s.id === DEFAULT_IMAGE_STYLE_ID[hub]) ?? list[0];
};
