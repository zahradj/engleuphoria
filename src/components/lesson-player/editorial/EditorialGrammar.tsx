import React from 'react';
import { Pen } from 'lucide-react';

interface EditorialGrammarProps {
  slide: any;
}

export default function EditorialGrammar({ slide }: EditorialGrammarProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const ruleText = payload.rule_text || payload.rule || payload.pattern || '';
  const commonSignals = payload.common_signals || '';
  const examples: any[] = Array.isArray(payload.examples) ? payload.examples
    : Array.isArray(payload.sample_sentences) ? payload.sample_sentences
    : [];
  const explanation = payload.explanation || slide?.description || '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-start gap-3">
        <Pen className="w-8 h-8 text-violet-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Grammar Focus'}
        </h2>
      </div>

      {/* Rule Box */}
      {ruleText && (
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 font-mono text-sm text-slate-800 whitespace-pre-wrap">
          {ruleText}
        </div>
      )}

      {explanation && (
        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{explanation}</p>
      )}

      {/* Common Signals */}
      {commonSignals && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm font-semibold text-amber-700 mb-1">Common Signals</p>
          <p className="text-sm text-amber-800">{commonSignals}</p>
        </div>
      )}

      {/* Examples */}
      {examples.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 space-y-3">
          {examples.map((ex, i) => (
            <p key={i} className="font-mono text-sm text-slate-700">
              {typeof ex === 'string' ? ex : ex?.text || ex?.sentence || ''}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
