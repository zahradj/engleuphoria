import React from 'react';
import { motion, Variants } from 'framer-motion';
import { HubType, AnimationType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import PlaygroundDragDrop from './activities/PlaygroundDragDrop';
import PlaygroundMatchPictures from './activities/PlaygroundMatchPictures';
import PlaygroundPopBubble from './activities/PlaygroundPopBubble';
import AcademyQuiz from './activities/AcademyQuiz';
import AcademyFillBlanks from './activities/AcademyFillBlanks';
import AcademySentenceUnscramble from './activities/AcademySentenceUnscramble';
import ProCaseStudy from './activities/ProCaseStudy';
import ProAdvancedFill from './activities/ProAdvancedFill';
import ProBusinessEmail from './activities/ProBusinessEmail';
import WordBank from './activities/WordBank';
import TimeAttack from './activities/TimeAttack';
import VisualDictation from './activities/VisualDictation';
import ExecutiveChoice from './activities/ExecutiveChoice';
// Practice Layer Activities — Phonics
import PhonicsSlider from './activities/PhonicsSlider';
import PhonemeTap from './activities/PhonemeTap';
import SoundSort from './activities/SoundSort';
import MouthMirror from './activities/MouthMirror';
// Practice Layer Activities — Vocabulary
import SoundToLetter from './activities/SoundToLetter';
import WordBuilder from './activities/WordBuilder';
import PictureLabel from './activities/PictureLabel';
import OddOneOut from './activities/OddOneOut';
// Practice Layer Activities — Grammar
import GrammarBlocks from './activities/GrammarBlocks';
import ArticlePicker from './activities/ArticlePicker';
import SentenceTransform from './activities/SentenceTransform';
// Four-Skill Activities
import SoundSpotting from './activities/SoundSpotting';
import TactileTracing from './activities/TactileTracing';
import LetterHunt from './activities/LetterHunt';
import SoundTrigger from './activities/SoundTrigger';
// Slide types
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
  float: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: [0, -6, 0],
      transition: { y: { repeat: Infinity, duration: 3, ease: 'easeInOut' }, opacity: { duration: 0.4 } },
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
  glitch: {
    initial: { opacity: 0, x: -5, skewX: -2 },
    animate: {
      opacity: [0, 1, 0.8, 1],
      x: [-5, 3, -2, 0],
      skewX: [-2, 1, -1, 0],
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
  slide_fast: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  },
  neon_pulse: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: [1, 1.01, 1],
      transition: { scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' }, opacity: { duration: 0.3 } },
    },
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
    if (slide.slideType === 'activity' || slide.activityType) {
      return renderActivity();
    }

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

    // ── Cross-hub practice layer activities ──────────────────────
    // Phonics Layer
    if (actType === 'phonics_slider') return <PhonicsSlider slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'phoneme_tap') return <PhonemeTap slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'sound_sort') return <SoundSort slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'mouth_mirror') return <MouthMirror slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    // Vocabulary Layer
    if (actType === 'sound_to_letter') return <SoundToLetter slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'word_builder') return <WordBuilder slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'picture_label') return <PictureLabel slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'odd_one_out') return <OddOneOut slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    // Grammar Layer
    if (actType === 'grammar_blocks') return <GrammarBlocks slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'article_picker') return <ArticlePicker slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'sentence_transform') return <SentenceTransform slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    // Four-Skill Activities
    if (actType === 'sound_spotting') return <SoundSpotting slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'tactile_tracing') return <TactileTracing slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'letter_hunt') return <LetterHunt slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'sound_trigger') return <SoundTrigger slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

    // ── Cross-hub generic activities ─────────────────────────────
    if (actType === 'word_bank') return <WordBank slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

    switch (hub) {
      case 'playground':
        if (actType === 'visual_dictation') return <VisualDictation slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        if (actType === 'pop_the_word_bubble') return <PlaygroundPopBubble slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        if (actType === 'match_pictures' || actType === 'match_sound_to_picture') return <PlaygroundMatchPictures slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        return <PlaygroundDragDrop slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

      case 'academy':
        if (actType === 'time_attack' || actType === 'speed_quiz') return <TimeAttack slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        if (actType === 'sentence_unscramble') return <AcademySentenceUnscramble slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        if (actType === 'fill_in_blanks') return <WordBank slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        return <AcademyQuiz slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

      case 'professional':
        if (actType === 'executive_choice') return <ExecutiveChoice slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
        if (actType === 'business_email_reply') return <ProBusinessEmail slide={slide} onCorrect={onCorrectAnswer} onComplete={onComplete} />;
        if (actType === 'advanced_fill_blanks' || actType === 'vocabulary_expansion') return <ProAdvancedFill slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
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
      className="w-full flex items-center justify-center"
    >
      {renderContent()}
    </motion.div>
  );
}
