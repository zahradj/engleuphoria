import React from 'react';
import { MessageSquare, Mic } from 'lucide-react';

interface EditorialRolePlayProps {
  slide: any;
  onCorrect?: () => void;
}

export default function EditorialRolePlay({ slide, onCorrect }: EditorialRolePlayProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const scenarioText = payload.scenario_text || slide?.description || '';
  const tips: string[] = Array.isArray(payload.tips) ? payload.tips : [];
  const keyPhrases: string[] = Array.isArray(payload.key_phrases) ? payload.key_phrases : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <MessageSquare className="w-8 h-8 text-pink-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Role Play'}
        </h2>
      </div>

      {/* Scenario Box */}
      {scenarioText && (
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Scenario</h3>
          <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">{scenarioText}</p>
        </div>
      )}

      {/* Key Phrases */}
      {keyPhrases.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Key Phrases to Use</h3>
          <div className="flex flex-wrap gap-3">
            {keyPhrases.map((phrase, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-200"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
          <h3 className="text-sm font-semibold text-amber-700 mb-3">💡 Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="mt-1 text-amber-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Voice Recording Prompt */}
      <div className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-white">
        <Mic className="w-6 h-6 text-slate-400" />
        <p className="text-slate-500 text-sm font-medium">🎤 Speak your response to the teacher</p>
      </div>
    </div>
  );
}
