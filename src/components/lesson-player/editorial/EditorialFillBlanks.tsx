import React, { useState, useCallback } from 'react';
import { PenLine, Check, X, RotateCcw, Lightbulb } from 'lucide-react';
import WhyWrongButton from './WhyWrongButton';
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
  const [showHints, setShowHints] = useState<boolean[]>(new Array(sentences.length).fill(false));

  const handleCheck = useCallback(() => {
    const newResults = sentences.map((s, i) =>
      answers[i].trim().toLowerCase() === s.correct_answer.trim().toLowerCase()
    );
    setResults(newResults);
    setChecked(true);
    if (newResults.every(Boolean)) onCorrect?.();
    else onIncorrect?.();
  }, [sentences, answers, onCorrect, onIncorrect]);

  const handleRetry = () => {
    setAnswers(new Array(sentences.length).fill(''));
    setChecked(false);
    setResults([]);
  };

  const toggleHint = (i: number) => {
    setShowHints(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  if (sentences.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4">{slide.title}</h2>
        <p className="text-slate-600">{slide.description}</p>
        <p className="mt-8 text-sm text-amber-600 italic">Interactive data missing for this activity.</p>
      </div>
    );
  }

  const score = checked ? results.filter(Boolean).length : 0;
  const allFilled = answers.every(a => a.trim().length > 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <PenLine className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
            {slide.title || 'Fill in the Blanks'}
          </h2>
          {slide.description && (
            <p className="mt-1 text-slate-500 text-base">{slide.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {sentences.map((sentence, i) => {
          const parts = sentence.text_with_blank.split('___');
          const hasHint = !!sentence.hint;

          return (
            <div
              key={i}
              className={`bg-white rounded-xl p-6 border transition-all ${
                checked
                  ? results[i]
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-red-200 bg-red-50/30'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {i + 1}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-1 text-lg text-slate-700 leading-relaxed mt-2">
                <span>{parts[0]}</span>
                <Input
                  value={answers[i]}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  disabled={checked}
                  className={`inline-block w-44 mx-1 text-center font-semibold text-base border-2 rounded-lg ${
                    checked
                      ? results[i]
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-red-400 bg-red-50 text-red-700 line-through'
                      : 'border-slate-300 focus:border-blue-400'
                  }`}
                  placeholder="type here…"
                />
                <span>{parts[1] || ''}</span>
              </div>

              {/* Hint toggle */}
              {hasHint && !checked && (
                <button
                  onClick={() => toggleHint(i)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHints[i] ? 'Hide hint' : 'Show hint'}
                </button>
              )}
              {hasHint && showHints[i] && !checked && (
                <p className="mt-1 text-xs text-blue-500 italic">💡 {sentence.hint}</p>
              )}

              {/* Feedback per sentence */}
              {checked && !results[i] && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  Correct answer: <strong className="ml-1">{sentence.correct_answer}</strong>
                </p>
              )}
              {checked && results[i] && (
                <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Correct!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        {!checked && (
          <Button onClick={handleCheck} className="px-10 py-3 text-base font-semibold" disabled={!allFilled}>
            Check All Answers
          </Button>
        )}
        {checked && (
          <>
            <div className={`rounded-xl px-6 py-3 font-semibold text-sm ${
              score === sentences.length
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {score === sentences.length
                ? '🎉 Perfect! All blanks filled correctly!'
                : `${score}/${sentences.length} correct`}
            </div>
            {score < sentences.length && (
              <Button variant="outline" onClick={handleRetry} className="gap-1.5">
                <RotateCcw className="w-4 h-4" /> Try Again
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
