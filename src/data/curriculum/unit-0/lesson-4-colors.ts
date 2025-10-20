import { GameLessonData } from '@/types/gameLesson';

export const lesson4Colors: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  metadata: {
    CEFR: 'A1',
    ageGroup: '4-7',
    story_theme: 'Rainbow Island Treasure Hunt',
    learning_objectives: [
      'Identify and name basic colors',
      'Match colors to objects',
      'Use "It\'s [color]" sentences',
      'Mix colors creatively'
    ],
    vocabulary: [
      { word: 'red', translation: 'красный' },
      { word: 'blue', translation: 'синий' },
      { word: 'yellow', translation: 'жёлтый' },
      { word: 'green', translation: 'зелёный' },
      { word: 'orange', translation: 'оранжевый' },
      { word: 'purple', translation: 'фиолетовый' }
    ],
    characters: [{ name: 'Parrot Pete', role: 'guide' }]
  },
  slides: [
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Parrot Pete',
        dialogue: "Hello! I'm Parrot Pete! 🦜 Let's find the Rainbow Treasure together!"
      }
    },
    {
      slide_type: 'vocabulary_preview',
      prompt: 'Colors We\'ll Learn Today',
      phrases: ['red', 'blue', 'yellow', 'green', 'orange', 'purple']
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Listen and repeat the colors!',
      phrases: ['red', 'blue', 'yellow']
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Which one is RED?',
      instructions: 'Click the red object!'
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'More colors!',
      phrases: ['green', 'orange', 'purple']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Match the colors!',
      instructions: 'Drag each emoji to its color word',
      pairs: [
        { emoji: '🍎', word: 'red' },
        { emoji: '🌊', word: 'blue' },
        { emoji: '☀️', word: 'yellow' },
        { emoji: '🌿', word: 'green' }
      ]
    },
    {
      slide_type: 'text_input',
      prompt: 'What color is this? 🍊',
      instructions: 'Type the color name'
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: 'Practice: "It\'s orange"',
      instructions: 'Say it with me!'
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Find something PURPLE!',
      instructions: 'Look around the rainbow island'
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Color Mixing Magic!',
      instructions: 'What colors make these?',
      pairs: [
        { emoji: '🔴+🔵', word: 'purple' },
        { emoji: '🔴+🟡', word: 'orange' },
        { emoji: '🔵+🟡', word: 'green' }
      ]
    },
    {
      slide_type: 'celebration',
      prompt: '🎉 You found the Rainbow Treasure! 🌈',
      stars: 3,
      confetti: true,
      finalScore: true,
      nextLesson: 'lesson-5-family'
    }
  ]
};
