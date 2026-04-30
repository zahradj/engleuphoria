import React from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialVocabListProps {
  slide: any;
}

export default function EditorialVocabList({ slide }: EditorialVocabListProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const words: string[] = Array.isArray(payload.words) ? payload.words
    : Array.isArray(payload.vocabulary) ? payload.vocabulary
    : Array.isArray(payload.vocab_list) ? payload.vocab_list
    : [];
  const examples: string[] = Array.isArray(payload.examples) ? payload.examples : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-start gap-3">
        <BookOpen className="w-8 h-8 text-indigo-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Vocabulary'}
        </h2>
      </div>

      {slide.description && (
        <p className="text-lg text-slate-600 leading-relaxed">{slide.description}</p>
      )}

      {/* Word Pills */}
      {words.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {words.map((word, i) => (
            <span
              key={i}
              className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200"
            >
              {typeof word === 'string' ? word : (word as any)?.word || (word as any)?.term || ''}
            </span>
          ))}
        </div>
      )}

      {/* Example Sentences */}
      {examples.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Examples</h3>
          {examples.map((ex, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-base text-slate-700 italic">
              "{typeof ex === 'string' ? ex : (ex as any)?.sentence || (ex as any)?.text || ''}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
