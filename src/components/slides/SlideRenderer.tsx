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
    </div>
  );
}
