import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WarmupSlide } from './types/WarmupSlide';
import { VocabularySlide } from './types/VocabularySlide';
import { GrammarSlide } from './types/GrammarSlide';
import { InteractiveSlide } from './types/InteractiveSlide';
import { DefaultSlide } from './types/DefaultSlide';

interface SlideRendererProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

function TeacherTipsPanel({ tips }: { tips?: string[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  if (!tips || tips.length === 0) return null;
  
  return (
    <div className="mt-4 border rounded-lg bg-muted/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/70 transition-colors rounded-lg"
      >
        <span>💡 Teacher Tips ({tips.length})</span>
        <span className="text-muted-foreground">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="p-3 space-y-2 border-t">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-2 text-sm">
              <span className="text-primary">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SlideRenderer({ slide, slideNumber, onNext }: SlideRendererProps) {
  const renderSlideByType = () => {
    const type = slide.type?.toLowerCase();

    switch (type) {
      case 'warmup':
      case 'title':
        return <WarmupSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'vocabulary_preview':
      case 'vocabulary':
      case 'vocab':
        return <VocabularySlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'grammar_focus':
      case 'target_language':
      case 'grammar':
        return <GrammarSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'drag_drop':
      case 'match':
      case 'sentence_builder':
      case 'memory':
      case 'quiz':
      case 'accuracy_mcq':
        return <InteractiveSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      default:
        return <DefaultSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {renderSlideByType()}
      <TeacherTipsPanel tips={slide.teacherTips} />
    </div>
  );
}
