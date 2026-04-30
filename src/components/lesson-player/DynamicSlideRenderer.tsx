import React from 'react';
import SpeakingPractice from './activities/SpeakingPractice';
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
// Director PPP interactive types
import DragAndMatch from './activities/DragAndMatch';
import FillInTheGaps from './activities/FillInTheGaps';
// Slide types
import SlideHook from './slides/SlideHook';
import SlideVocabulary from './slides/SlideVocabulary';
import SlideConcept from './slides/SlideConcept';
import SlideSummary from './slides/SlideSummary';
import SlideReadingSplit from './SlideReadingSplit';

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

const getSlidePayload = (slide: any) => slide?.interactive_data || slide?.content || {};

const getSlideText = (slide: any) => {
  const payload = getSlidePayload(slide);
  return typeof slide?.content === 'string'
    ? slide.content
    : payload.prompt || payload.text || payload.body || payload.description || slide?.teacher_script || '';
};

const getSlideMediaUrl = (slide: any) =>
  slide?.imageUrl || slide?.image_url || slide?.generated_image_url || slide?.custom_image_url || slide?.media_url || slide?.youtube_thumbnail;

const normalizePairs = (slide: any) => {
  const payload = getSlidePayload(slide);
  const rawPairs = payload.pairs || payload.matches || payload.items || slide?.pairs || [];
  return Array.isArray(rawPairs)
    ? rawPairs.map((pair: any) => ({
        left_item: pair.left_item || pair.left || pair.term || pair.word || pair.prompt || '',
        right_item: pair.right_item || pair.right || pair.match || pair.definition || pair.answer || '',
        left_thumbnail_url: pair.left_thumbnail_url || pair.leftImageUrl,
        right_thumbnail_url: pair.right_thumbnail_url || pair.rightImageUrl,
      })).filter((pair: any) => pair.left_item && pair.right_item)
    : [];
};

function LiveHeroMediaSlide({ slide }: { slide: any }) {
  const mediaUrl = getSlideMediaUrl(slide);
  const text = getSlideText(slide);
  return (
    <div className="w-full h-full min-h-[520px] grid gap-6 content-center p-6 text-center text-foreground">
      {mediaUrl && <img src={mediaUrl} alt={slide.title || 'Lesson visual'} className="mx-auto max-h-[320px] w-full max-w-3xl rounded-lg object-contain" loading="lazy" />}
      <div className="mx-auto max-w-3xl space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">{slide.title}</h1>
        {text && <p className="text-lg md:text-xl leading-relaxed text-muted-foreground whitespace-pre-line">{text}</p>}
      </div>
    </div>
  );
}

function LiveVocabularyGrid({ slide, hub }: { slide: any; hub: HubType }) {
  const config = HUB_CONFIGS[hub];
  const payload = getSlidePayload(slide);
  const words = payload.words || payload.vocabulary || payload.vocab_list || payload.items || [];
  const entries = Array.isArray(words) ? words : [];
  return (
    <div className="w-full min-h-[520px] p-6 flex flex-col justify-center gap-6 text-foreground">
      <h2 className="text-3xl md:text-4xl font-bold text-center" style={{ color: config.colorPalette.primary }}>{slide.title || 'Vocabulary'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
        {entries.map((entry: any, index: number) => {
          const item = typeof entry === 'string' ? { word: entry } : entry;
          const imageUrl = item.imageUrl || item.image_url || item.thumbnail_url;
          return (
            <div key={`${item.word || item.term || index}`} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              {imageUrl && <img src={imageUrl} alt={item.word || item.term || 'Vocabulary image'} className="mb-3 h-32 w-full rounded-md object-cover" loading="lazy" />}
              <h3 className="text-xl font-bold">{item.word || item.term || item.title}</h3>
              {(item.definition || item.meaning) && <p className="mt-1 text-sm text-muted-foreground">{item.definition || item.meaning}</p>}
              {item.sentence && <p className="mt-3 text-sm italic text-foreground/80">“{item.sentence}”</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveGrammarExplanation({ slide, hub }: { slide: any; hub: HubType }) {
  const config = HUB_CONFIGS[hub];
  const payload = getSlidePayload(slide);
  const examples = payload.examples || payload.sample_sentences || [];
  return (
    <div className="w-full min-h-[520px] p-8 flex items-center justify-center text-foreground">
      <article className="w-full max-w-4xl space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ color: config.colorPalette.primary }}>{slide.title || 'Grammar Focus'}</h2>
        {(payload.rule || payload.pattern) && <div className="rounded-lg border border-border bg-muted p-5 text-2xl font-bold">{payload.rule || payload.pattern}</div>}
        {(payload.explanation || getSlideText(slide)) && <p className="text-lg md:text-xl leading-relaxed text-muted-foreground whitespace-pre-line">{payload.explanation || getSlideText(slide)}</p>}
        {Array.isArray(examples) && examples.length > 0 && (
          <div className="grid gap-3">
            {examples.map((example: any, index: number) => <div key={index} className="rounded-md border border-border bg-card p-4 text-lg">{typeof example === 'string' ? example : example.text || example.sentence}</div>)}
          </div>
        )}
      </article>
    </div>
  );
}

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
    // ── 6-Step Blueprint: Reading phase always uses split-screen layout ──
    // The AI guarantees passages > 100 words are split across multiple Reading
    // slides, and wraps target vocab in **bold** markdown for highlighting.
    const lessonPhase = (slide as any).lesson_phase as string | undefined;
    if (lessonPhase === 'Reading') {
      return <SlideReadingSplit slide={slide as any} />;
    }

    // ── 6-Step Blueprint: Speaking phase uses VoiceRecorder grading ──
    if (lessonPhase === 'Speaking' && (slide as any).requires_audio) {
      const target = (slide as any).interactive_data?.speech?.target_sentence
        || (slide as any).content
        || (slide as any).title
        || '';
      return (
        <SpeakingPractice
          targetSentence={target}
          hub={hub === 'professional' ? 'success' : hub as any}
          context={(slide as any).teacher_script}
          lessonId={(slide as any).lesson_id}
          slideId={slide.id}
          onComplete={() => onCorrectAnswer()}
        />
      );
    }

    // ── Director PPP interactive types (highest priority) ─────────
    // The generate-ppp-slides edge function emits slide_type = 'drag_and_match' | 'fill_in_the_gaps'.
    const directorType = (slide as any).slide_type || (slide as any).activityType || (slide as any).type;
    if (directorType === 'hero_media') {
      return <LiveHeroMediaSlide slide={slide} />;
    }
    if (directorType === 'vocab_list') {
      return <LiveVocabularyGrid slide={slide} hub={hub} />;
    }
    if (directorType === 'grammar_explanation') {
      return <LiveGrammarExplanation slide={slide} hub={hub} />;
    }
    if (directorType === 'match_halves') {
      const matchSlide = { ...slide, slide_type: 'drag_and_match', activityType: 'drag_and_match', interactive_data: { ...getSlidePayload(slide), pairs: normalizePairs(slide) } };
      return <DragAndMatch slide={matchSlide as GeneratedSlide} hub={hub} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (directorType === 'drag_and_match') {
      return <DragAndMatch slide={slide} hub={hub} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (directorType === 'fill_in_the_gaps') {
      return <FillInTheGaps slide={slide} hub={hub} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }

    // ── Skill-flag routing ────────────────────────────────────────
    // If the slide has explicit skill flags, route to the corresponding component
    if (slide.has_writing && slide.activityType === 'tactile_tracing') {
      return <TactileTracing slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (slide.has_writing && slide.activityType === 'letter_hunt') {
      return <LetterHunt slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (slide.has_listening && slide.activityType === 'sound_spotting') {
      return <SoundSpotting slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (slide.has_listening && slide.activityType === 'sound_trigger') {
      return <SoundTrigger slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (slide.has_grammar_blocks && slide.activityType === 'grammar_blocks') {
      return <GrammarBlocks slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }
    if (slide.has_phonics && slide.activityType === 'phonics_slider') {
      return <PhonicsSlider slide={slide} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    }

    // ── Activity type routing ─────────────────────────────────────
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
    if (actType === 'drag_and_match') return <DragAndMatch slide={slide} hub={hub} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;
    if (actType === 'fill_in_the_gaps') return <FillInTheGaps slide={slide} hub={hub} onCorrect={onCorrectAnswer} onIncorrect={onIncorrectAnswer} />;

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
      initial={{ x: 60, opacity: 0, scale: 0.98 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -60, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="w-full h-full flex items-center justify-center"
    >
      {renderContent()}
    </motion.div>
  );
}
