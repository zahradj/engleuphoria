import React, { useState, useCallback } from 'react';
import { PenLine, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlankSentence {
  text_with_blank: string;
  hint?: string;
  correct_answer: string;
}

interface EditorialFillBlanksProps {
  slide: any;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

export default function EditorialFillBlanks({ slide, onCorrect, onIncorrect }: EditorialFillBlanksProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const sentences: BlankSentence[] = Array.isArray(payload.sentences) ? payload.sentences : [];
  
  const [answers, setAnswers] = useState<string[]>(new Array(sentences.length).fill(''));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleCheck = useCallback(() => {
    const newResults = sentences.map((s, i) =>
      answers[i].trim().toLowerCase() === s.correct_answer.trim().toLowerCase()
    );
    setResults(newResults);
    setChecked(true);
    if (newResults.every(Boolean)) onCorrect?.();
    else onIncorrect?.();
  }, [sentences, answers, onCorrect, onIncorrect]);

  if (sentences.length === 0) {
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
        <PenLine className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Fill in the Blanks'}
        </h2>
      </div>

      <div className="space-y-6">
        {sentences.map((sentence, i) => {
          const parts = sentence.text_with_blank.split('___');
          return (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-1 text-lg text-slate-700">
                {parts[0]}
                <Input
                  value={answers[i]}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[i] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  disabled={checked}
                  className={`inline-block w-40 mx-1 text-center font-semibold ${
                    checked
                      ? results[i]
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                      : ''
                  }`}
                  placeholder="..."
                />
                {parts[1] || ''}
              </div>
              {sentence.hint && !checked && (
                <p className="mt-2 text-xs text-slate-400 italic">💡 {sentence.hint}</p>
              )}
              {checked && !results[i] && (
                <p className="mt-2 text-sm text-red-600">
                  <X className="inline w-3 h-3 mr-1" />
                  Correct answer: <strong>{sentence.correct_answer}</strong>
                </p>
              )}
              {checked && results[i] && (
                <p className="mt-2 text-sm text-emerald-600">
                  <Check className="inline w-3 h-3 mr-1" /> Correct!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!checked && (
        <Button onClick={handleCheck} className="self-center px-8" disabled={answers.some(a => !a.trim())}>
          Check All Answers
        </Button>
      )}
    </div>
  );
}
