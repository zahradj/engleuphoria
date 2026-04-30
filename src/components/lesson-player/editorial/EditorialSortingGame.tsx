import React, { useState, useCallback } from 'react';
import { ArrowDownUp, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortingItem {
  word: string;
  correct_category: string;
}

interface EditorialSortingGameProps {
  slide: any;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

export default function EditorialSortingGame({ slide, onCorrect, onIncorrect }: EditorialSortingGameProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const categories: string[] = Array.isArray(payload.categories) ? payload.categories : [];
  const items: SortingItem[] = Array.isArray(payload.items) ? payload.items : [];
  
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleDrop = useCallback((word: string, category: string) => {
    setPlacements(prev => ({ ...prev, [word]: category }));
  }, []);

  const handleCheck = useCallback(() => {
    const newResults: Record<string, boolean> = {};
    let allCorrect = true;
    items.forEach(item => {
      const isCorrect = placements[item.word] === item.correct_category;
      newResults[item.word] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) onCorrect?.();
    else onIncorrect?.();
  }, [items, placements, onCorrect, onIncorrect]);

  if (categories.length === 0 || items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4">{slide.title}</h2>
        <p className="text-slate-600">{slide.description}</p>
        <p className="mt-8 text-sm text-amber-600 italic">Interactive data missing for this activity.</p>
      </div>
    );
  }

  const unplaced = items.filter(item => !placements[item.word]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <ArrowDownUp className="w-8 h-8 text-emerald-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Sort the Words'}
        </h2>
      </div>

      {/* Unplaced words */}
      {unplaced.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {unplaced.map((item, i) => (
            <span
              key={i}
              className="bg-white text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200 cursor-grab shadow-sm hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', item.word)}
            >
              {item.word}
            </span>
          ))}
        </div>
      )}

      {/* Category drop zones */}
      <div className={`grid gap-6 ${categories.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
        {categories.map(cat => {
          const catItems = items.filter(item => placements[item.word] === cat);
          return (
            <div
              key={cat}
              className="border-2 border-dashed border-slate-300 rounded-xl p-6 min-h-[120px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const word = e.dataTransfer.getData('text/plain');
                if (word) handleDrop(word, cat);
              }}
            >
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {catItems.map((item, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      checked
                        ? results[item.word]
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.word}
                    {checked && (results[item.word] ? <Check className="inline w-3 h-3 ml-1" /> : <X className="inline w-3 h-3 ml-1" />)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!checked && Object.keys(placements).length === items.length && (
        <Button onClick={handleCheck} className="self-center px-8">
          Check Answers
        </Button>
      )}
    </div>
  );
}
