import React, { useState, useMemo, useCallback } from 'react';
import { Link2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MatchPair {
  left_part: string;
  right_part: string;
}

interface EditorialMatchHalvesProps {
  slide: any;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

export default function EditorialMatchHalves({ slide, onCorrect, onIncorrect }: EditorialMatchHalvesProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const pairs: MatchPair[] = Array.isArray(payload.pairs) ? payload.pairs : [];

  const shuffledRight = useMemo(() => {
    const rights = pairs.map(p => p.right_part);
    return rights.sort(() => Math.random() - 0.5);
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleRightClick = useCallback((right: string) => {
    if (selectedLeft === null || checked) return;
    setMatches(prev => ({ ...prev, [selectedLeft]: right }));
    setSelectedLeft(null);
  }, [selectedLeft, checked]);

  const handleCheck = useCallback(() => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    pairs.forEach((pair, i) => {
      const isCorrect = matches[i] === pair.right_part;
      newResults[i] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) onCorrect?.();
    else onIncorrect?.();
  }, [pairs, matches, onCorrect, onIncorrect]);

  if (pairs.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4">{slide.title}</h2>
        <p className="text-slate-600">{slide.description}</p>
        <p className="mt-8 text-sm text-amber-600 italic">Interactive data missing for this activity.</p>
      </div>
    );
  }

  const usedRights = new Set(Object.values(matches));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Match the Halves'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {/* Left column */}
        <div className="space-y-1.5">
          {pairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => !checked && setSelectedLeft(i)}
              className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedLeft === i
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : checked
                  ? results[i]
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-red-300 bg-red-50 text-red-700'
                  : matches[i]
                  ? 'border-slate-300 bg-slate-50 text-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {pair.left_part}
              {matches[i] && (
                <span className="block text-[10px] mt-0.5 text-slate-400">→ {matches[i]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-1.5">
          {shuffledRight.map((right, i) => (
            <button
              key={i}
              onClick={() => handleRightClick(right)}
              disabled={usedRights.has(right) || checked}
              className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                usedRights.has(right)
                  ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  : selectedLeft !== null
                  ? 'border-indigo-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {right}
            </button>
          ))}
        </div>
      </div>

      {!checked && Object.keys(matches).length === pairs.length && (
        <Button onClick={handleCheck} size="sm" className="self-center px-6">
          Check Matches
        </Button>
      )}
    </div>
  );
}
