import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WarmupSlide } from './types/WarmupSlide';
import { VocabularySlide } from './types/VocabularySlide';
import { GrammarSlide } from './types/GrammarSlide';
import { InteractiveSlide } from './types/InteractiveSlide';
import { ControlledPracticeSlide } from './types/ControlledPracticeSlide';
import { DefaultSlide } from './types/DefaultSlide';
import { CharacterIntroSlide } from './types/CharacterIntroSlide';
import { DialoguePracticeSlide } from './types/DialoguePracticeSlide';
import { ListeningComprehensionSlide } from './types/ListeningComprehensionSlide';
import { SpeakingPracticeSlide } from './types/SpeakingPracticeSlide';
import { SentenceBuilderSlide } from './types/SentenceBuilderSlide';
import { PhonicsSlide } from './types/PhonicsSlide';
import { EndQuizSlide } from './types/EndQuizSlide';
import { RewardsSlide } from './types/RewardsSlide';
import { SlideTheme } from './SlideTheme';
import { motion } from 'framer-motion';
import { SpinningWheelActivity } from './activities/SpinningWheelActivity';
import { SortingGame } from './activities/SortingGame';

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
  const renderSlideContent = () => {
    const type = slide.type?.toLowerCase();

    switch (type) {
      case 'character_intro':
        return <CharacterIntroSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'warmup':
      case 'title':
        return <WarmupSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'vocabulary_preview':
      case 'vocabulary':
      case 'vocab':
        return <VocabularySlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'phonics':
        return <PhonicsSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'grammar_focus':
      case 'target_language':
      case 'grammar':
        return <GrammarSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'dialogue':
      case 'dialogue_practice':
        return <DialoguePracticeSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'listening':
      case 'listening_comprehension':
        return <ListeningComprehensionSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'speaking':
      case 'speaking_practice':
        return <SpeakingPracticeSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'sentence_builder':
        return <SentenceBuilderSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'quiz':
      case 'end_quiz':
        return <EndQuizSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'rewards':
      case 'celebration':
        return <RewardsSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'drag_drop':
      case 'match':
      case 'memory':
      case 'accuracy_mcq':
        return <InteractiveSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'controlled_practice':
      case 'point_and_say':
        return <ControlledPracticeSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'spinning_wheel':
      case 'spin':
        return <SpinningWheelActivity slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      case 'sorting':
      case 'sort':
        return <SortingGame slide={slide} slideNumber={slideNumber} onNext={onNext} />;
      
      default:
        return <DefaultSlide slide={slide} slideNumber={slideNumber} onNext={onNext} />;
    }
  };

  return (
    <SlideTheme type={slide.type}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        {renderSlideContent()}
        {slide.teacherTips && slide.teacherTips.length > 0 && (
          <TeacherTipsPanel tips={slide.teacherTips} />
        )}
      </motion.div>
    </SlideTheme>
  );
}
