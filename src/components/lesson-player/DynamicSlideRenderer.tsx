import React from 'react';
import { motion, Variants } from 'framer-motion';
import { HubType, AnimationType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import PlaygroundDragDrop from './activities/PlaygroundDragDrop';
import PlaygroundMatchPictures from './activities/PlaygroundMatchPictures';
import AcademyQuiz from './activities/AcademyQuiz';
import AcademyFillBlanks from './activities/AcademyFillBlanks';
import ProCaseStudy from './activities/ProCaseStudy';
import ProAdvancedFill from './activities/ProAdvancedFill';
import SlideHook from './slides/SlideHook';
import SlideVocabulary from './slides/SlideVocabulary';
import SlideConcept from './slides/SlideConcept';
import SlideSummary from './slides/SlideSummary';

const ANIMATION_VARIANTS: Record<string, Variants> = {
  bounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      y: [0, -8, 0],
      transition: { y: { repeat: Infinity, duration: 2, ease: 'easeInOut' }, opacity: { duration: 0.4 }, scale: { duration: 0.4 } },
    },
  },
  zoom_in: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
  },
  wiggle: {
    initial: { opacity: 0, rotate: -5 },
    animate: {
      opacity: 1,
      rotate: [0, 3, -3, 2, -2, 0],
      transition: { rotate: { repeat: Infinity, duration: 3, ease: 'easeInOut' }, opacity: { duration: 0.3 } },
    },
  },
  smooth_slide: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
  fade_up: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  },
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
  },
};

interface DynamicSlideRendererProps {
  slide: GeneratedSlide;
  hub: HubType;
  onCorrectAnswer: () => void;
  onIncorrectAnswer?: () => void;
  onComplete?: () => void;
}

export default function DynamicSlideRenderer({
  slide,
  hub,
  onCorrectAnswer,
  onIncorrectAnswer,
  onComplete,
}: DynamicSlideRendererProps) {
  const config = HUB_CONFIGS[hub];
  const animKey = slide.animation || config.defaultAnimation;
  const variants = ANIMATION_VARIANTS[animKey] || ANIMATION_VARIANTS.none;

  const renderContent = () => {
    // Activity slides use hub-specific components
    if (slide.slideType === 'activity' || slide.activityType) {
      return renderActivity();
    }

    // Content slides
    switch (slide.slideType) {
      case 'hook':
      case 'warmup':
        return <SlideHook slide={slide} hub={hub} />;
      case 'vocabulary':
        return <SlideVocabulary slide={slide} hub={hub} />;
      case 'core_concept':
      case 'dialogue':
        return <SlideConcept slide={slide} hub={hub} />;
      case 'summary':
      case 'goodbye':
      case 'review':
        return <SlideSummary slide={slide} hub={hub} />;
      default:
        return renderActivity() || <SlideHook slide={slide} hub={hub} />;
    }
  };

  const renderActivity = () => {
    const actType = slide.activityType || slide.type;

    switch (hub) {
      case 'playground':
        if (actType === 'match_pictures') {
          return <PlaygroundMatchPictures slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        }
        return <PlaygroundDragDrop slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

      case 'academy':
        if (actType === 'fill_in_blanks') {
          return <AcademyFillBlanks slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        }
        return <AcademyQuiz slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

      case 'professional':
        if (actType === 'advanced_fill_blanks') {
          return <ProAdvancedFill slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        }
        return <ProCaseStudy slide={slide} onCorrect={onCorrectAnswer} onComplete={onComplete} />;

      default:
        return <PlaygroundDragDrop slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
  };

  return (
    <motion.div
      key={slide.id}
      variants={variants}
      initial="initial"
      animate="animate"
      className="w-full h-full flex items-center justify-center"
      style={{ background: config.colorPalette.background, color: config.colorPalette.text }}
    >
      {renderContent()}
    </motion.div>
  );
}
