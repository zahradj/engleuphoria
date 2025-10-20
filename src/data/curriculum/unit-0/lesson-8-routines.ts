import { GameLessonData } from '@/types/gameLesson';

export const lesson8Routines: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  metadata: {
    CEFR: 'A1',
    ageGroup: '4-7',
    story_theme: 'A Day in the Life',
    learning_objectives: [
      'Name daily activities',
      'Tell time (basic hours)',
      'Sequence daily routines',
      'Use "I ___ in the morning/evening"'
    ],
    vocabulary: [
      { word: 'wake up', translation: 'просыпаться' },
      { word: 'brush teeth', translation: 'чистить зубы' },
      { word: 'eat breakfast', translation: 'завтракать' },
      { word: 'go to school', translation: 'идти в школу' },
      { word: 'play', translation: 'играть' },
      { word: 'sleep', translation: 'спать' }
    ],
    characters: [{ name: 'Clocky', role: 'time keeper' }]
  },
  slides: [
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Clocky',
        dialogue: "Tick tock! I'm Clocky! ⏰ Let's learn about your day!"
      }
    },
    {
      slide_type: 'vocabulary_preview',
      prompt: 'Daily Activities',
      phrases: ['wake up', 'brush teeth', 'eat breakfast', 'go to school', 'play', 'sleep']
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Morning Routine',
      phrases: ['wake up', 'brush teeth', 'eat breakfast']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'What time is it?',
      instructions: 'Match the clock to the activity',
      pairs: [
        { emoji: '🌅7:00', word: 'wake up' },
        { emoji: '☀️8:00', word: 'go to school' },
        { emoji: '🌆5:00', word: 'come home' },
        { emoji: '🌙9:00', word: 'sleep' }
      ]
    },
    {
      slide_type: 'picture_choice',
      prompt: 'What do you do first in the morning?',
      instructions: 'Choose the first activity'
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Evening Routine',
      phrases: ['do homework', 'eat dinner', 'take a bath', 'go to bed']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Put in Order!',
      instructions: 'Arrange the daily routine',
      pairs: [
        { emoji: '1️⃣', word: 'wake up' },
        { emoji: '2️⃣', word: 'eat breakfast' },
        { emoji: '3️⃣', word: 'go to school' },
        { emoji: '4️⃣', word: 'sleep' }
      ]
    },
    {
      slide_type: 'text_input',
      prompt: 'What do you do at night? 🌙',
      instructions: 'Type the activity'
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: '"I wake up in the morning"',
      instructions: 'Practice the full sentence!'
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Show me: Brush your teeth! 🦷',
      instructions: 'Pretend to brush!'
    },
    {
      slide_type: 'celebration',
      prompt: '🎉 You know your daily routine! ⏰',
      stars: 3,
      confetti: true,
      finalScore: true,
      nextLesson: 'lesson-9-shapes'
    }
  ]
};
