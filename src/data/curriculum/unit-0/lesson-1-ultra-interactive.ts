import { LessonSlides } from '@/types/slides';
import classroomPartyHero from '@/assets/lessons/unit-0-lesson-1-ultra/classroom-party-hero.png';
import teacherAvatar from '@/assets/lessons/unit-0-lesson-1-ultra/teacher-avatar-animated.png';
import theaterStage from '@/assets/lessons/unit-0-lesson-1-ultra/theater-stage.png';
import gameShowSet from '@/assets/lessons/unit-0-lesson-1-ultra/game-show-set.png';
import raceTrack from '@/assets/lessons/unit-0-lesson-1-ultra/race-track.png';
import constructionTheme from '@/assets/lessons/unit-0-lesson-1-ultra/construction-theme.png';
import underwaterOcean from '@/assets/lessons/unit-0-lesson-1-ultra/underwater-ocean.png';
import whackAMoleBoard from '@/assets/lessons/unit-0-lesson-1-ultra/whack-a-mole-board.png';
import celebrationFireworks from '@/assets/lessons/unit-0-lesson-1-ultra/celebration-fireworks.png';
import vocabHello from '@/assets/lessons/unit-0-lesson-1-ultra/vocab-hello-animated.png';
import vocabHi from '@/assets/lessons/unit-0-lesson-1-ultra/vocab-hi-animated.png';
import vocabGoodbye from '@/assets/lessons/unit-0-lesson-1-ultra/vocab-goodbye-animated.png';
import vocabName from '@/assets/lessons/unit-0-lesson-1-ultra/vocab-name-animated.png';
import vocabNice from '@/assets/lessons/unit-0-lesson-1-ultra/vocab-nice-animated.png';
import handWave from '@/assets/lessons/unit-0-lesson-1-ultra/animated-hand-wave.png';

export const lesson0_1_ultraInteractive: LessonSlides = {
  version: '2.0',
  theme: 'default',
  durationMin: 30,
  metadata: {
    CEFR: 'Pre-A1',
    module: 0,
    lesson: 1,
    targets: [
      'Greet people using Hello, Hi, and Goodbye',
      'Introduce yourself using "My name is..."',
      'Respond to introductions with "Nice to meet you"',
      'Use basic pronouns I and You in context'
    ],
    weights: {
      accuracy: 0.6,
      fluency: 0.4
    }
  },
  slides: [
    // PRESENTATION PHASE (Slides 1-9)
    {
      id: 'slide-1',
      type: 'warmup',
      prompt: '🌟 Welcome to English Adventure! 🌟',
      instructions: "Let's Learn to Say HELLO!",
      media: {
        type: 'image',
        url: classroomPartyHero,
        alt: 'Classroom celebration with happy children'
      },
      xpReward: 5,
      tags: ['warmup', 'introduction']
    },
    {
      id: 'slide-2',
      type: 'character_introduction',
      prompt: 'Hi! My name is Teacher Emma!',
      instructions: 'Click to hear my greeting!',
      media: {
        type: 'image',
        url: teacherAvatar,
        alt: 'Friendly teacher character'
      },
      audio: { url: '/audio/teacher-intro.mp3', text: 'Hi! My name is Teacher Emma!' },
      xpReward: 5,
      tags: ['character', 'greeting']
    },
    {
      id: 'slide-3',
      type: 'vocabulary_preview',
      prompt: 'HELLO',
      instructions: 'Wave your hand! 👋',
      media: {
        type: 'image',
        url: vocabHello,
        alt: 'Hello word with sun character'
      },
      audio: { text: 'Hello', autoGenerate: true },
      vocabulary: ['hello'],
      xpReward: 5,
      tags: ['vocabulary', 'tpr', 'greeting']
    },
    {
      id: 'slide-4',
      type: 'vocabulary_preview',
      prompt: 'HI',
      instructions: 'Wave both hands! 👋👋',
      media: {
        type: 'image',
        url: vocabHi,
        alt: 'Hi word with waving hands'
      },
      audio: { text: 'Hi', autoGenerate: true },
      vocabulary: ['hi'],
      xpReward: 5,
      tags: ['vocabulary', 'tpr', 'greeting']
    },
    {
      id: 'slide-5',
      type: 'vocabulary_preview',
      prompt: 'GOODBYE',
      instructions: 'Wave goodbye! 👋',
      media: {
        type: 'image',
        url: vocabGoodbye,
        alt: 'Goodbye word with waving hand'
      },
      audio: { text: 'Goodbye', autoGenerate: true },
      vocabulary: ['goodbye'],
      xpReward: 5,
      tags: ['vocabulary', 'tpr', 'farewell']
    },
    {
      id: 'slide-6',
      type: 'vocabulary_preview',
      prompt: 'NAME',
      instructions: 'Point to your name tag! 👈',
      media: {
        type: 'image',
        url: vocabName,
        alt: 'Name word with name tag'
      },
      audio: { text: 'Name', autoGenerate: true },
      vocabulary: ['name'],
      xpReward: 5,
      tags: ['vocabulary', 'tpr', 'identity']
    },
    {
      id: 'slide-7',
      type: 'vocabulary_preview',
      prompt: 'NICE',
      instructions: 'Give a thumbs up! 👍',
      media: {
        type: 'image',
        url: vocabNice,
        alt: 'Nice word with thumbs up'
      },
      audio: { text: 'Nice', autoGenerate: true },
      vocabulary: ['nice'],
      xpReward: 5,
      tags: ['vocabulary', 'tpr', 'emotion']
    },
    {
      id: 'slide-7a',
      type: 'vocabulary_preview',
      prompt: 'Letter A – /æ/',
      instructions: 'Say the sound: /æ/ like in "apple" 🍎',
      media: {
        type: 'image',
        url: vocabHello,
        alt: 'Letter A with apple'
      },
      audio: { text: 'a', autoGenerate: true },
      vocabulary: ['a'],
      xpReward: 5,
      tags: ['vocabulary', 'phonics', 'letters']
    },
    {
      id: 'slide-7b',
      type: 'vocabulary_preview',
      prompt: 'Letter B – /b/',
      instructions: 'Say the sound: /b/ like in "ball" ⚽',
      media: {
        type: 'image',
        url: vocabHi,
        alt: 'Letter B with ball'
      },
      audio: { text: 'b', autoGenerate: true },
      vocabulary: ['b'],
      xpReward: 5,
      tags: ['vocabulary', 'phonics', 'letters']
    },
    {
      id: 'slide-8',
      type: 'target_language',
      prompt: 'My name is...',
      instructions: 'This is how we introduce ourselves! Pattern: My name is ___.',
      media: {
        type: 'image',
        url: teacherAvatar,
        alt: 'Teacher showing introduction pattern'
      },
      audio: { url: '/audio/pattern-intro.mp3', text: 'My name is' },
      xpReward: 10,
      tags: ['pattern', 'introduction']
    },
    {
      id: 'slide-9',
      type: 'target_language',
      prompt: 'Nice to meet you!',
      instructions: 'This is what we say when meeting someone. Response: Nice to meet you!',
      audio: { url: '/audio/nice-to-meet.mp3', text: 'Nice to meet you!' },
      xpReward: 10,
      tags: ['pattern', 'response']
    },

    // PRACTICE PHASE - GAME ZONE 1 (Slides 10-14)
    {
      id: 'slide-10',
      type: 'match',
      prompt: 'Match the Greetings!',
      instructions: 'Connect the words that go together',
      matchPairs: [
        { id: 'pair-1', left: 'Hello!', right: 'Hi!' },
        { id: 'pair-2', left: 'My name is...', right: 'Nice to meet you!' },
        { id: 'pair-3', left: 'Goodbye!', right: 'See you later!' }
      ],
      xpReward: 30,
      tags: ['game', 'matching', 'comprehension']
    },
    {
      id: 'slide-11',
      type: 'fast_match',
      prompt: 'Whack-a-Word!',
      instructions: 'Click only the greeting words!',
      media: {
        type: 'image',
        url: whackAMoleBoard,
        alt: 'Whack-a-mole game board'
      },
      options: [
        { id: 'opt-1', text: 'Hello', isCorrect: true },
        { id: 'opt-2', text: 'Hi', isCorrect: true },
        { id: 'opt-3', text: 'Goodbye', isCorrect: true },
        { id: 'opt-4', text: 'Nice', isCorrect: true },
        { id: 'opt-5', text: 'Cat', isCorrect: false },
        { id: 'opt-6', text: 'Run', isCorrect: false },
        { id: 'opt-7', text: 'Blue', isCorrect: false }
      ],
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy'
      },
      xpReward: 25,
      tags: ['game', 'speed', 'vocabulary']
    },
    {
      id: 'slide-12',
      type: 'drag_drop',
      prompt: 'Sort the Words!',
      instructions: 'Drag words into Greetings or Names',
      dragDropItems: [
        { id: 'item-1', text: 'Hello', targetId: 'target-1' },
        { id: 'item-2', text: 'Hi', targetId: 'target-1' },
        { id: 'item-3', text: 'Emma', targetId: 'target-2' },
        { id: 'item-4', text: 'Tom', targetId: 'target-2' },
        { id: 'item-5', text: 'Goodbye', targetId: 'target-1' }
      ],
      dragDropTargets: [
        { id: 'target-1', text: 'Greetings', acceptsItemIds: ['item-1', 'item-2', 'item-5'] },
        { id: 'target-2', text: 'Names', acceptsItemIds: ['item-3', 'item-4'] }
      ],
      xpReward: 20,
      tags: ['game', 'drag-drop', 'categorization']
    },
    {
      id: 'slide-13',
      type: 'bubble_pop',
      prompt: 'Pop the Greeting Bubbles!',
      instructions: 'Click bubbles with greeting words only!',
      media: {
        type: 'image',
        url: underwaterOcean,
        alt: 'Underwater ocean scene'
      },
      options: [
        { id: 'opt-1', text: 'Hello', isCorrect: true },
        { id: 'opt-2', text: 'Hi', isCorrect: true },
        { id: 'opt-3', text: 'Goodbye', isCorrect: true },
        { id: 'opt-4', text: 'Nice', isCorrect: true },
        { id: 'opt-5', text: 'Name', isCorrect: false },
        { id: 'opt-6', text: 'Cat', isCorrect: false },
        { id: 'opt-7', text: 'Book', isCorrect: false }
      ],
      gameConfig: {
        theme: 'ocean',
        difficulty: 'easy',
        targetScore: 50
      },
      xpReward: 35,
      tags: ['game', 'bubble-pop', 'vocabulary']
    },
    {
      id: 'slide-14',
      type: 'fast_match',
      prompt: 'Spin the Greeting Wheel!',
      instructions: 'Say the phrase that appears!',
      options: [
        { id: 'opt-1', text: 'Hello', isCorrect: true },
        { id: 'opt-2', text: 'Hi', isCorrect: true },
        { id: 'opt-3', text: 'Goodbye', isCorrect: true },
        { id: 'opt-4', text: 'My name is...', isCorrect: true },
        { id: 'opt-5', text: 'Nice to meet you', isCorrect: true },
        { id: 'opt-6', text: 'Name', isCorrect: true }
      ],
      xpReward: 20,
      tags: ['game', 'spinning-wheel', 'speaking']
    },

    // CONTROLLED PRODUCTION (Slides 15-17)
    {
      id: 'slide-15',
      type: 'sentence_builder',
      prompt: 'Build Your Introduction!',
      instructions: 'Drag the words to complete the sentence',
      media: {
        type: 'image',
        url: constructionTheme,
        alt: 'Construction theme background'
      },
      xpReward: 25,
      tags: ['sentence-building', 'grammar', 'production']
    },
    {
      id: 'slide-16',
      type: 'cloze',
      prompt: 'Fill the Gap!',
      instructions: 'Choose the correct word',
      media: {
        type: 'image',
        url: gameShowSet,
        alt: 'Game show background'
      },
      clozeText: '[gap1]! My name is Max.',
      clozeGaps: [
        {
          id: 'gap1',
          correctAnswers: ['Hello'],
          options: ['Hello', 'Goodbye', 'Thank you']
        }
      ],
      xpReward: 15,
      tags: ['cloze', 'comprehension', 'vocabulary']
    },
    {
      id: 'slide-17',
      type: 'picture_choice',
      prompt: 'Choose the Correct Greeting!',
      instructions: 'Which sentence matches the picture?',
      media: {
        type: 'image',
        url: raceTrack,
        alt: 'Race track background'
      },
      options: [
        { id: 'opt-1', text: 'My name is Tom', isCorrect: true },
        { id: 'opt-2', text: 'Goodbye everyone', isCorrect: false },
        { id: 'opt-3', text: 'See you later', isCorrect: false }
      ],
      xpReward: 15,
      tags: ['multiple-choice', 'comprehension']
    },

    // PRODUCTION PHASE (Slides 18-19)
    {
      id: 'slide-18',
      type: 'roleplay_setup',
      prompt: 'Role-Play Time!',
      instructions: 'Practice the conversation with your partner',
      media: {
        type: 'image',
        url: theaterStage,
        alt: 'Theater stage for roleplay'
      },
      xpReward: 30,
      tags: ['roleplay', 'speaking', 'production']
    },
    {
      id: 'slide-19',
      type: 'communicative_task',
      prompt: 'Free Conversation Practice',
      instructions: 'Walk around and greet 3 classmates using everything you learned',
      xpReward: 30,
      tags: ['production', 'speaking', 'fluency']
    },

    // REVIEW & CELEBRATION (Slides 20-21)
    {
      id: 'slide-20',
      type: 'review_consolidation',
      prompt: 'Vocabulary Review',
      instructions: 'Let\'s review all the words we learned!',
      xpReward: 15,
      tags: ['review', 'vocabulary']
    },
    {
      id: 'slide-21',
      type: 'celebration',
      prompt: '🎉 AMAZING JOB! 🎉',
      instructions: 'You completed the lesson!',
      media: {
        type: 'image',
        url: celebrationFireworks,
        alt: 'Celebration with fireworks'
      },
      xpReward: 50,
      tags: ['celebration', 'completion']
    }
  ]
};
