/**
 * Backwards-compat shim: lifts legacy single-item activity slides
 * (error_detection / correction / fill_blank) into the new `items[]` shape.
 *
 * Old:  { type: 'error_detection', sentence, wrongIndex }
 * New:  { type: 'error_detection', items: [{ sentence, wrongIndex }] }
 */

export interface ErrorDetectionItem { sentence: string; wrongIndex: number }
export interface CorrectionItem { wrong: string; answer: string }
export interface FillBlankItem { before: string; answer: string; after: string }

export function getErrorDetectionItems(slide: any): ErrorDetectionItem[] {
  if (Array.isArray(slide?.items) && slide.items.length) {
    return slide.items.map((it: any) => ({
      sentence: String(it.sentence ?? ''),
      wrongIndex: Number(it.wrongIndex ?? 0),
    }));
  }
  if (slide?.sentence != null) {
    return [{ sentence: String(slide.sentence), wrongIndex: Number(slide.wrongIndex ?? 0) }];
  }
  return [];
}

export function getCorrectionItems(slide: any): CorrectionItem[] {
  if (Array.isArray(slide?.items) && slide.items.length) {
    return slide.items.map((it: any) => ({
      wrong: String(it.wrong ?? ''),
      answer: String(it.answer ?? ''),
    }));
  }
  if (slide?.wrong != null || slide?.answer != null) {
    return [{ wrong: String(slide.wrong ?? ''), answer: String(slide.answer ?? '') }];
  }
  return [];
}

export function getFillBlankItems(slide: any): FillBlankItem[] {
  if (Array.isArray(slide?.items) && slide.items.length) {
    return slide.items.map((it: any) => ({
      before: String(it.before ?? ''),
      answer: String(it.answer ?? ''),
      after: String(it.after ?? ''),
    }));
  }
  if (slide?.before != null || slide?.answer != null || slide?.after != null) {
    return [{
      before: String(slide.before ?? ''),
      answer: String(slide.answer ?? ''),
      after: String(slide.after ?? ''),
    }];
  }
  return [];
}
