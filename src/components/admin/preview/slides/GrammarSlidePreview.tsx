import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface GrammarSlidePreviewProps {
  slide: {
    title?: string;
    content?: {
      rule?: string;
      pattern?: string;
      examples?: string[];
      commonMistakes?: string[];
      explanation?: string;
    };
  };
}

export function GrammarSlidePreview({ slide }: GrammarSlidePreviewProps) {
  const { rule, pattern, examples, commonMistakes, explanation } = slide.content || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-foreground">
          {slide.title || 'Grammar Focus'}
        </h2>
      </div>

      {rule && (
        <div className="bg-primary/10 rounded-xl p-6 border-l-4 border-primary">
          <h3 className="font-semibold text-foreground mb-2">Rule</h3>
          <p className="text-foreground text-lg">{rule}</p>
        </div>
      )}

      {pattern && (
        <div className="bg-muted rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-2">Pattern</h3>
          <code className="text-lg font-mono text-primary bg-primary/10 px-3 py-1 rounded">
            {pattern}
          </code>
        </div>
      )}

      {explanation && (
        <p className="text-muted-foreground">{explanation}</p>
      )}

      {examples && examples.length > 0 && (
        <div className="bg-green-500/10 rounded-xl p-5">
          <h3 className="font-semibold text-green-700 mb-3">Examples</h3>
          <ul className="space-y-2">
            {examples.map((example, idx) => (
              <li key={idx} className="flex items-start gap-2 text-foreground">
                <span className="text-green-600 font-bold">✓</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {commonMistakes && commonMistakes.length > 0 && (
        <div className="bg-red-500/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="font-semibold text-red-700">Common Mistakes</h3>
          </div>
          <ul className="space-y-2">
            {commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2 text-foreground">
                <span className="text-red-600 font-bold">✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
