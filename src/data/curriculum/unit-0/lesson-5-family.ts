import { GameLessonData } from '@/types/gameLesson';

export const lesson5Family: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  metadata: {
    CEFR: 'A1',
    ageGroup: '4-7',
    story_theme: 'Photo Album Story',
    learning_objectives: [
      'Name family members',
      'Use "This is my ___" structure',
      'Describe family relationships',
      'Practice possessive pronouns (my, your)'
    ],
    vocabulary: [
      { word: 'mother', translation: 'мама' },
      { word: 'father', translation: 'папа' },
      { word: 'sister', translation: 'сестра' },
      { word: 'brother', translation: 'брат' },
      { word: 'grandmother', translation: 'бабушка' },
      { word: 'grandfather', translation: 'дедушка' }
    ],
    characters: [{ name: 'Grandma Rose', role: 'storyteller' }]
  },
  slides: [
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Grandma Rose',
        dialogue: "Hello dear! 👵 Let me show you my family photo album!"
      }
    },
    {
      slide_type: 'vocabulary_preview',
      prompt: 'Family Members',
      phrases: ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather']
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Parents',
      phrases: ['mother', 'father', 'mom', 'dad']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Match Family Members',
      instructions: 'Connect the emoji to the word',
      pairs: [
        { emoji: '👩', word: 'mother' },
        { emoji: '👨', word: 'father' },
        { emoji: '👧', word: 'sister' },
        { emoji: '👦', word: 'brother' }
      ]
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: 'Say: "This is my mother"',
      instructions: 'Point and say it!'
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Grandparents',
      phrases: ['grandmother', 'grandfather', 'grandma', 'grandpa']
    },
    {
      slide_type: 'text_input',
      prompt: 'Who is this? 👵',
      instructions: 'Type the family member'
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Find the SISTER',
      instructions: 'Click on the sister in the photo'
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Family Tree',
      instructions: 'Build the family tree',
      pairs: [
        { emoji: '👵👴', word: 'grandparents' },
        { emoji: '👨👩', word: 'parents' },
        { emoji: '👧👦', word: 'children' }
      ]
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: '"I love my family"',
      instructions: 'Say it with feeling! ❤️'
    },
    {
      slide_type: 'celebration',
      prompt: '🎉 You learned about family! 👨‍👩‍👧‍👦',
      stars: 3,
      confetti: true,
      finalScore: true,
      nextLesson: 'lesson-6-animals'
    }
  ]
};
