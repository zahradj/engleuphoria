import { GameLessonData } from '@/types/gameLesson';

export const lesson6Animals: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  metadata: {
    CEFR: 'A1',
    ageGroup: '4-7',
    story_theme: 'Zoo Adventure',
    learning_objectives: [
      'Name common animals',
      'Match animals to their sounds',
      'Identify animal habitats',
      'Use "It can ___" for animal actions'
    ],
    vocabulary: [
      { word: 'dog', translation: 'собака' },
      { word: 'cat', translation: 'кошка' },
      { word: 'bird', translation: 'птица' },
      { word: 'fish', translation: 'рыба' },
      { word: 'lion', translation: 'лев' },
      { word: 'elephant', translation: 'слон' }
    ],
    characters: [{ name: 'Zookeeper Zara', role: 'guide' }]
  },
  slides: [
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Zookeeper Zara',
        dialogue: "Hi! I'm Zara! 👩‍🦰 Welcome to the zoo! Let's meet the animals!"
      }
    },
    {
      slide_type: 'vocabulary_preview',
      prompt: 'Animals at the Zoo',
      phrases: ['dog', 'cat', 'bird', 'fish', 'lion', 'elephant']
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Pet Animals',
      phrases: ['dog', 'cat', 'bird', 'fish']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Animal Sounds!',
      instructions: 'Match each animal to its sound',
      pairs: [
        { emoji: '🐕', word: 'woof' },
        { emoji: '🐈', word: 'meow' },
        { emoji: '🐦', word: 'tweet' },
        { emoji: '🦁', word: 'roar' }
      ]
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Which animal says "meow"?',
      instructions: 'Find the cat!'
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Wild Animals',
      phrases: ['lion', 'elephant', 'monkey', 'giraffe']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Where do they live?',
      instructions: 'Match animals to habitats',
      pairs: [
        { emoji: '🐠', word: 'water' },
        { emoji: '🐦', word: 'sky' },
        { emoji: '🦁', word: 'land' },
        { emoji: '🐵', word: 'trees' }
      ]
    },
    {
      slide_type: 'text_input',
      prompt: 'What animal is this? 🐘',
      instructions: 'Type its name'
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: '"The lion can roar"',
      instructions: 'Practice the sentence!'
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Move like a monkey! 🐵',
      instructions: 'Can you jump and swing?'
    },
    {
      slide_type: 'celebration',
      prompt: '🎉 You\'re an animal expert! 🦁',
      stars: 3,
      confetti: true,
      finalScore: true,
      nextLesson: 'lesson-7-food'
    }
  ]
};
