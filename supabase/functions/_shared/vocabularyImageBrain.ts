/**
 * Vocabulary Image "Brain" — builds a fully-baked scene description for
 * vocabulary flashcard images, enforcing:
 *   1. Modesty Protocol (clothing + poses)
 *   2. Hub-specific clothing rules
 *   3. Age-appropriate art style per hub
 *   4. The 60% Branding Rule (50–60% of color area = hub primary family)
 *
 * The output of buildVocabularyPrompt() is the BASE scene prompt; the
 * generate-slide-image edge function still wraps it with applyHubStyle()
 * so the AI Art Director's house-style suffix remains in effect.
 */

import { normalizeArtHub, type ArtHub } from "./hubArtStyles.ts";

interface HubVisualRules {
  clothing: string;
  artStyle: string;
  brandColor: string;
  brandHex: string;
  brandFamily: string;
}

const RULES: Record<ArtHub, HubVisualRules> = {
  Playground: {
    clothing:
      "casual modest children's clothing — long t-shirts, full-length pants/shorts to the knee, simple dresses with sleeves; nothing tight or revealing",
    artStyle:
      "cute flat 2D cartoon / vector illustration in the spirit of a friendly children's picture book; rounded shapes, big expressive eyes, innocence and fun, joyful playful mood",
    brandColor: "warm orange (#FE6A2F) accented with sunny yellow (#FEFBDD)",
    brandHex: "#FE6A2F",
    brandFamily: "warm orange / yellow",
  },
  Academy: {
    clothing:
      "tidy school uniforms — button-up shirts, sweaters, knee-length skirts or trousers; modest, age-appropriate teen styling",
    artStyle:
      "modern comic / webtoon illustration with clean linework, relatable real-world teen scenarios (classroom, library, café, sports field); slice-of-life mood",
    brandColor: "rich purple (#6B21A8) with lavender (#F5F3FF)",
    brandHex: "#6B21A8",
    brandFamily: "purple / violet",
  },
  Success: {
    clothing:
      "business-casual professional attire — blazers, button-down shirts, modest blouses, tailored trousers or knee-length skirts; refined and respectful",
    artStyle:
      "professional editorial photography style, sleek and highly realistic, business and global scenarios (office, boardroom, airport lounge, conference)",
    brandColor: "emerald green (#059669) with mint (#F0FDFA)",
    brandHex: "#059669",
    brandFamily: "emerald / mint green",
  },
};

const MODESTY_PROTOCOL = [
  "[MODESTY PROTOCOL — STRICT, NON-NEGOTIABLE]",
  "• Clothing must be universally modest, professional, and respectful for an educational environment.",
  "• No tight, revealing, sheer, low-cut, midriff-baring, or culturally insensitive clothing.",
  "• Poses must be dignified and respectful — never suggestive, never provocative, never lying down in an intimate way.",
  "• No close physical contact between characters unless it is clearly familial or professional assistance (e.g. a teacher pointing to a book).",
  "• No alcohol, weapons, gambling, or mature themes.",
].join("\n");

export interface VocabularyBrainInput {
  vocabulary_word: string;
  example_sentence?: string;
  hub?: string;
}

export function buildVocabularyPrompt(input: VocabularyBrainInput): string {
  const hub = normalizeArtHub(input.hub);
  const rules = RULES[hub];
  const word = (input.vocabulary_word || "").trim();
  const sentence = (input.example_sentence || "").trim();

  return [
    `[VOCABULARY FLASHCARD IMAGE — focal word: "${word}"]`,
    sentence
      ? `Depict a clear, literal scene that visually teaches the meaning of "${word}", inspired by this example sentence: "${sentence}".`
      : `Depict a clear, literal scene that visually teaches the meaning of "${word}".`,
    `The word "${word}" must be the unmistakable visual focal point of the composition.`,
    "",
    `[ART STYLE — ${hub} Hub]`,
    rules.artStyle + ".",
    "",
    `[CHARACTER WARDROBE]`,
    `All characters wear ${rules.clothing}.`,
    "",
    MODESTY_PROTOCOL,
    "",
    `[60% BRANDING RULE — color distribution is mandatory]`,
    `50–60% of the total visible color area MUST be dominated by the ${hub} brand color family: ${rules.brandColor}.`,
    `Achieve this by coloring LARGE surfaces in that family — backgrounds (walls, sky, floor), large props (furniture, signage, vehicles), or character clothing — NOT only small accents.`,
    `The remaining 40–50% must be neutral tones (white, off-white, soft greys, warm beiges, natural skin tones) so the ${rules.brandFamily} dominance reads cleanly.`,
    `Avoid muddy or competing saturated colors that would dilute the ${rules.brandFamily} dominance.`,
    "",
    "No text, letters, numbers, or watermarks anywhere in the image. Centered, balanced composition, single clear subject.",
  ].join("\n");
}
