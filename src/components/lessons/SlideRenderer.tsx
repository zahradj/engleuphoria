import React from 'react';
import { Slide } from '@/types/slides';
import { WarmUpSlide } from './slides/WarmUpSlide';
import { VocabularyPreviewSlide } from './slides/VocabularyPreviewSlide';
import { TargetLanguageSlide } from './slides/TargetLanguageSlide';
import { ListeningComprehensionSlide } from './slides/ListeningComprehensionSlide';
import { DragDropSlide } from './slides/DragDropSlide';
import { SentenceBuilderSlide } from './slides/SentenceBuilderSlide';
import { MatchSlide } from './slides/MatchSlide';
import { PronunciationSlide } from './slides/PronunciationSlide';
import { RolePlaySlide } from './slides/RolePlaySlide';
import { TPRPhonicsSlide } from './slides/TPRPhonicsSlide';
import { FastMatchSlide } from './slides/FastMatchSlide';
import { PictureChoiceSlide } from './slides/PictureChoiceSlide';
import { ClozeSlide } from './slides/ClozeSlide';
import { ControlledPracticeSlide } from './slides/ControlledPracticeSlide';
import { ExitCheckSlide } from './slides/ExitCheckSlide';
import { BubblePopSlide } from './slides/BubblePopSlide';
import { CharacterIntroSlide } from './slides/CharacterIntroSlide';
import { CelebrationSlide } from './slides/CelebrationSlide';
import { TextInputSlide } from './slides/TextInputSlide';
import { FeelingsMatchSlide } from './slides/FeelingsMatchSlide';
import { ListenAndRepeatSlide } from './slides/ListenAndRepeatSlide';
import { AudioPlayer } from '@/components/slides/media/AudioPlayer';

interface SlideRendererProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function SlideRenderer({ slide, onComplete, onNext }: SlideRendererProps) {
  const renderSlide = () => {
    switch (slide.type) {
      case 'warmup':
        return <WarmUpSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'vocabulary_preview':
        return <VocabularyPreviewSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'target_language':
        return <TargetLanguageSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'listening_comprehension':
        return <ListeningComprehensionSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'drag_drop':
        return <DragDropSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'sentence_builder':
        return <SentenceBuilderSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'match':
        return <MatchSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'pronunciation_shadow':
        return <PronunciationSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'roleplay_setup':
        return <RolePlaySlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'tpr_phonics':
        return <TPRPhonicsSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'fast_match':
        return <FastMatchSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'picture_choice':
        return <PictureChoiceSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'cloze':
        return <ClozeSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'controlled_practice':
        return <ControlledPracticeSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'exit_check':
        return <ExitCheckSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'bubble_pop':
        return <BubblePopSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'character_introduction':
        return <CharacterIntroSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'celebration':
        return <CelebrationSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'spinning_wheel':
        return <FastMatchSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'text_input':
        return <TextInputSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'feelings_match':
        return <FeelingsMatchSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      case 'listen_repeat':
        return <ListenAndRepeatSlide slide={slide} onComplete={onComplete} onNext={onNext} />;
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">{slide.prompt}</h2>
            <p className="text-muted-foreground">{slide.instructions}</p>
            {slide.media?.url && (
              <img 
                src={slide.media.url} 
                alt={slide.media.alt || slide.prompt}
                className="mx-auto mt-4 max-w-md rounded-lg"
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderSlide()}
      {slide.audio && (
        <div className="container mx-auto px-4 mt-6 flex justify-center">
          <AudioPlayer audio={slide.audio} />
        </div>
      )}
    </div>
  );
}