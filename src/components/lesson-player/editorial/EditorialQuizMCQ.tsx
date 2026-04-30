import React, { useState } from 'react';
import { HelpCircle, Check, X } from 'lucide-react';

interface EditorialQuizMCQProps {
  slide: any;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function EditorialQuizMCQ({ slide, onCorrect, onIncorrect }: EditorialQuizMCQProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const question = payload.question || slide?.title || '';
  const options: string[] = Array.isArray(payload.options) ? payload.options : [];
  const correctIndex = typeof payload.correct_index === 'number' ? payload.correct_index : 0;

  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const handleSelect = (i: number) => {
    if (checked) return;
    setSelected(i);
    setChecked(true);
    if (i === correctIndex) onCorrect?.();
    else onIncorrect?.();
  };

  if (options.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4">{slide.title}</h2>
        <p className="text-slate-600">{slide.description}</p>
        <p className="mt-8 text-sm text-amber-600 italic">Interactive data missing for this activity.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <HelpCircle className="w-8 h-8 text-sky-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Quiz'}
        </h2>
      </div>

      {question && question !== slide.title && (
        <p className="text-xl text-slate-700 font-medium leading-relaxed">{question}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correctIndex;
          let classes = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm cursor-pointer';
          
          if (checked) {
            if (isCorrect) {
              classes = 'border-emerald-400 bg-emerald-50 text-emerald-700';
            } else if (isSelected && !isCorrect) {
              classes = 'border-red-400 bg-red-50 text-red-700';
            } else {
              classes = 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={checked}
              className={`flex items-start gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all ${classes}`}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                {LETTERS[i]}
              </span>
              <span className="text-base font-medium pt-1">{opt}</span>
              {checked && isCorrect && <Check className="ml-auto w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />}
              {checked && isSelected && !isCorrect && <X className="ml-auto w-5 h-5 text-red-500 flex-shrink-0 mt-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
