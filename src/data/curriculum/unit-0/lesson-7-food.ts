import { GameLessonData } from '@/types/gameLesson';

export const lesson7Food: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  metadata: {
    CEFR: 'A1',
    ageGroup: '4-7',
    story_theme: 'Restaurant Kitchen',
    learning_objectives: [
      'Name common foods',
      'Categorize foods (fruits, vegetables, desserts)',
      'Express preferences (I like/don\'t like)',
      'Practice food vocabulary in context'
    ],
    vocabulary: [
      { word: 'apple', translation: 'яблоко' },
      { word: 'banana', translation: 'банан' },
      { word: 'carrot', translation: 'морковь' },
      { word: 'pizza', translation: 'пицца' },
      { word: 'ice cream', translation: 'мороженое' },
      { word: 'bread', translation: 'хлеб' }
    ],
    characters: [{ name: 'Chef Carlo', role: 'chef' }]
  },
  slides: [
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Chef Carlo',
        dialogue: "Ciao! I'm Chef Carlo! 👨‍🍳 Let's cook and learn about food!"
      }
    },
    {
      slide_type: 'vocabulary_preview',
      prompt: 'Food Words',
      phrases: ['apple', 'banana', 'carrot', 'pizza', 'ice cream', 'bread']
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Fruits',
      phrases: ['apple', 'banana', 'orange', 'grape']
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Sort the Food!',
      instructions: 'Put each food in the right category',
      pairs: [
        { emoji: '🍎', word: 'fruit' },
        { emoji: '🥕', word: 'vegetable' },
        { emoji: '🍕', word: 'main dish' },
        { emoji: '🍦', word: 'dessert' }
      ]
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Find the BANANA',
      instructions: 'Click on the yellow fruit!'
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Vegetables',
      phrases: ['carrot', 'tomato', 'broccoli']
    },
    {
      slide_type: 'text_input',
      prompt: 'What food is this? 🥕',
      instructions: 'Type the name'
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: '"I like pizza"',
      instructions: 'Say what you like!'
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Menu Reading',
      instructions: 'Match the food to the picture',
      pairs: [
        { emoji: '🍕', word: 'pizza' },
        { emoji: '🍔', word: 'burger' },
        { emoji: '🍝', word: 'pasta' },
        { emoji: '🍰', word: 'cake' }
      ]
    },
    {
      slide_type: 'picture_choice',
      prompt: 'What do you want for dessert?',
      instructions: 'Choose ice cream or cake!'
    },
    {
      slide_type: 'celebration',
      prompt: '🎉 You\'re a food expert! 🍽️',
      stars: 3,
      confetti: true,
      finalScore: true,
      nextLesson: 'lesson-8-routines'
    }
  ]
};
