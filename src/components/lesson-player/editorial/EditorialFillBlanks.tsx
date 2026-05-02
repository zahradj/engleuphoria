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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <PenLine className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-800 leading-tight">
            {slide.title || 'Fill in the Blanks'}
          </h2>
          {slide.description && (
            <p className="mt-0.5 text-slate-500 text-xs">{slide.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {sentences.map((sentence, i) => {
          const parts = sentence.text_with_blank.split('___');
          const hasHint = !!sentence.hint;

          return (
            <div
              key={i}
              className={`bg-white rounded-lg px-3 py-2 border transition-all ${
                checked
                  ? results[i]
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-red-200 bg-red-50/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-700 leading-relaxed">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {i + 1}
                </span>
                <span>{parts[0]}</span>
                <Input
                  value={answers[i]}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  disabled={checked}
                  className={`inline-block w-32 h-8 mx-1 text-center font-semibold text-sm border-2 rounded-md ${
                    checked
                      ? results[i]
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-red-400 bg-red-50 text-red-700 line-through'
                      : 'border-slate-300 focus:border-blue-400'
                  }`}
                  placeholder="type…"
                />
                <span>{parts[1] || ''}</span>

                {hasHint && !checked && (
                  <button
                    onClick={() => toggleHint(i)}
                    className="ml-auto inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <Lightbulb className="w-3 h-3" />
                    {showHints[i] ? 'hide' : 'hint'}
                  </button>
                )}
              </div>

              {hasHint && showHints[i] && !checked && (
                <p className="mt-1 text-[11px] text-blue-500 italic">💡 {sentence.hint}</p>
              )}

              {checked && !results[i] && (
                <div className="mt-1.5">
                  <p className="text-[11px] text-red-600 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Correct: <strong className="ml-1">{sentence.correct_answer}</strong>
                  </p>
                  <WhyWrongButton
                    questionText={sentence.text_with_blank}
                    correctAnswer={sentence.correct_answer}
                    userAnswer={answers[i]}
                  />
                </div>
              )}
              {checked && results[i] && (
                <p className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Correct!
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3">
        {!checked && (
          <Button onClick={handleCheck} className="px-6 py-2 text-sm font-semibold" disabled={!allFilled}>
            Check All Answers
          </Button>
        )}
        {checked && (
          <>
            <div className={`rounded-lg px-4 py-2 font-semibold text-xs ${
              score === sentences.length
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {score === sentences.length
                ? '🎉 Perfect!'
                : `${score}/${sentences.length} correct`}
            </div>
            {score < sentences.length && (
              <Button variant="outline" size="sm" onClick={handleRetry} className="gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Try Again
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
