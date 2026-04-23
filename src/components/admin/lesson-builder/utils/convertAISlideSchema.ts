import { v4 as uuidv4 } from 'uuid';
import type { Slide, CanvasElementData, SlideType } from '../types';

export interface AISlideSchema {
  slide_type: string;
  headline: string;
  body_text: string;
  video_url: string | null;
  visual_search_keyword: string;
  teacher_notes: string;
}

const SLIDE_TYPE_MAP: Record<string, SlideType> = {
  title: 'image',
  video_song: 'video',
  vocabulary_image: 'image',
  grammar_presentation: 'image',
  interactive_practice: 'quiz',
};

/**
 * Converts an array of AI-generated slide schemas into our internal Slide format
 * with canvas elements for headline, body text, video embeds, and image placeholders.
 */
export function convertAISlidesToCanvasSlides(aiSlides: AISlideSchema[]): Slide[] {
  return aiSlides.map((aiSlide, index) => {
    const slideType = SLIDE_TYPE_MAP[aiSlide.slide_type] || 'image';
    const elements: CanvasElementData[] = [];
    let zIndex = 1;

    // Background shape
    elements.push({
      id: uuidv4(),
      elementType: 'shape',
      x: 0, y: 0,
      width: 1920, height: 1080,
      rotation: 0,
      zIndex: zIndex++,
      content: { shape: 'rounded', fill: '#f8fafc', opacity: 0.95 },
    });

    // Headline text element
    if (aiSlide.headline) {
      elements.push({
        id: uuidv4(),
        elementType: 'text',
        x: 100, y: 60,
        width: 1720, height: 120,
        rotation: 0,
        zIndex: zIndex++,
        content: {
          text: aiSlide.headline,
          fontSize: 56,
          bold: true,
          italic: false,
          align: 'center',
          color: '#1e293b',
        },
      });
    }

    // Body text element
    if (aiSlide.body_text) {
      const bodyY = aiSlide.video_url ? 200 : 240;
      const bodyH = aiSlide.video_url ? 200 : 500;
      elements.push({
        id: uuidv4(),
        elementType: 'text',
        x: 100, y: bodyY,
        width: aiSlide.video_url ? 800 : 1720,
        height: bodyH,
        rotation: 0,
        zIndex: zIndex++,
        content: {
          text: aiSlide.body_text,
          fontSize: 24,
          bold: false,
          italic: false,
          align: 'left',
          color: '#334155',
        },
      });
    }

    // Video element
    if (aiSlide.video_url) {
      elements.push({
        id: uuidv4(),
        elementType: 'video',
        x: 960, y: 200,
        width: 860, height: 484,
        rotation: 0,
        zIndex: zIndex++,
        content: {
          src: aiSlide.video_url,
          autoplay: false,
        },
      });
    }

    // Image placeholder using visual_search_keyword
    if (!aiSlide.video_url && aiSlide.visual_search_keyword) {
      elements.push({
        id: uuidv4(),
        elementType: 'image',
        x: 1100, y: 300,
        width: 700, height: 500,
        rotation: 0,
        zIndex: zIndex++,
        content: {
          src: `https://source.unsplash.com/700x500/?${encodeURIComponent(aiSlide.visual_search_keyword)}`,
          alt: aiSlide.visual_search_keyword,
          keyword: aiSlide.visual_search_keyword,
        },
      });
    }

    return {
      id: uuidv4(),
      order: index,
      type: slideType,
      teacherNotes: aiSlide.teacher_notes || '',
      keywords: aiSlide.visual_search_keyword ? [aiSlide.visual_search_keyword] : [],
      title: aiSlide.headline || `Slide ${index + 1}`,
      videoUrl: aiSlide.video_url || undefined,
      canvasElements: elements,
    } as Slide;
  });
}

/**
 * Converts a single AI slide schema into a Slide.
 */
export function convertSingleAISlide(aiSlide: AISlideSchema, order: number): Slide {
  return convertAISlidesToCanvasSlides([{ ...aiSlide }]).map(s => ({ ...s, order }))[0];
}
