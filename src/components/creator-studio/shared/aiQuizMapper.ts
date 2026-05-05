// Maps generic AI quiz_slides into hub-specific slide objects.
// Hub Slide types differ slightly: Playground is flat; Academy/Success include `block`.
type Hub = 'playground' | 'academy' | 'success';

interface AIQuizSlide {
  type: 'multiple' | 'truefalse' | 'fill' | 'discussion';
  question?: string;
  statement?: string;
  text?: string;
  prompt?: string;
  options?: string[];
  answer?: string;
  answer_bool?: boolean;
}

export function mapAIQuizSlide(q: AIQuizSlide, hub: Hub): any {
  const block = hub === 'success' ? 'practice' : hub === 'academy' ? 'practice' : undefined;
  switch (q.type) {
    case 'multiple': {
      const base: any = {
        type: 'multiple',
        question: q.question || q.prompt || 'Question?',
        options: q.options && q.options.length ? q.options : ['A', 'B', 'C'],
        answer: q.answer || (q.options?.[0] ?? 'A'),
      };
      return block ? { ...base, block } : base;
    }
    case 'truefalse': {
      const base: any = {
        type: 'truefalse',
        statement: q.statement || q.question || q.prompt || 'Statement.',
        answer: typeof q.answer_bool === 'boolean' ? q.answer_bool : (q.answer || '').toLowerCase().startsWith('t'),
      };
      return block ? { ...base, block } : base;
    }
    case 'fill': {
      if (hub === 'playground') {
        return {
          type: 'fill',
          text: q.text || q.prompt || 'My name is ____',
          answer: q.answer || '',
        };
      }
      // academy/success use fill_blank with before/after
      const raw = q.text || q.prompt || 'Sentence ____ here.';
      const idx = raw.indexOf('____');
      const before = idx >= 0 ? raw.slice(0, idx).trim() : raw;
      const after = idx >= 0 ? raw.slice(idx + 4).trim() : '';
      return {
        type: 'fill_blank',
        block,
        prompt: 'Fill in the blank.',
        before,
        after,
        answer: q.answer || '',
      };
    }
    case 'discussion': {
      // Map to closest open-ended type per hub
      if (hub === 'playground') {
        return { type: 'intro', title: 'Discuss', text: q.prompt || q.question || 'Talk about it.' };
      }
      if (hub === 'academy') {
        return { type: 'opinion', block, prompt: q.prompt || q.question || 'What do you think?' };
      }
      return { type: 'reflection', block, prompt: q.prompt || q.question || 'Reflect on this scenario.' };
    }
  }
}

export function mapAIQuizSlides(quiz: AIQuizSlide[] | undefined, hub: Hub): any[] {
  if (!Array.isArray(quiz)) return [];
  return quiz.map((q) => mapAIQuizSlide(q, hub)).filter(Boolean);
}
