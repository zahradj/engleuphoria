export const lesson3Colors = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  slides: [
    // Scene 1: Welcome
    {
      id: 'slide-1',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: "Let's explore the wonderful world of colors! 🌈"
      }
    },
    
    // Scene 2: Primary Colors
    {
      id: 'slide-2',
      type: 'vocabulary_preview',
      prompt: 'Primary Colors',
      instructions: 'These are the most important colors!'
    },
    {
      id: 'slide-3',
      type: 'listen_repeat',
      prompt: 'Say the Colors!',
      phrases: ['Red', 'Blue', 'Yellow']
    },
    {
      id: 'slide-4',
      type: 'celebration',
      stars: 1,
      message: 'You know the primary colors! 🎨'
    },

    // Scene 3: More Colors
    {
      id: 'slide-5',
      type: 'vocabulary_preview',
      prompt: 'More Beautiful Colors',
      instructions: 'Let\'s learn even more colors!'
    },
    {
      id: 'slide-6',
      type: 'listen_repeat',
      prompt: 'Colorful Words!',
      phrases: ['Green', 'Orange', 'Purple', 'Pink']
    },
    {
      id: 'slide-7',
      type: 'celebration',
      stars: 2,
      message: 'Amazing! You\'re a color expert! 🌟'
    },

    // Scene 4: Favorite Color
    {
      id: 'slide-8',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: 'My favorite color is green! What is your favorite color?'
      }
    },
    {
      id: 'slide-9',
      type: 'text_input',
      prompt: 'Type your favorite color',
      instructions: 'Write: "My favorite color is ___"'
    },
    {
      id: 'slide-10',
      type: 'celebration',
      stars: 3,
      message: 'That\'s a beautiful color! 🎨'
    },

    // Scene 5: Color Quiz
    {
      id: 'slide-11',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: 'Let\'s test your color knowledge!'
      }
    },
    {
      id: 'slide-12',
      type: 'picture_choice',
      prompt: 'What color is the sky?',
      instructions: 'Think about a sunny day',
      options: [
        { id: 'opt-1', text: 'Blue', isCorrect: true },
        { id: 'opt-2', text: 'Green', isCorrect: false },
        { id: 'opt-3', text: 'Yellow', isCorrect: false }
      ]
    },
    {
      id: 'slide-13',
      type: 'picture_choice',
      prompt: 'What color is grass?',
      instructions: 'Look outside!',
      options: [
        { id: 'opt-1', text: 'Red', isCorrect: false },
        { id: 'opt-2', text: 'Green', isCorrect: true },
        { id: 'opt-3', text: 'Purple', isCorrect: false }
      ]
    },
    {
      id: 'slide-14',
      type: 'picture_choice',
      prompt: 'Mix red and yellow, what do you get?',
      instructions: 'Think about mixing colors',
      options: [
        { id: 'opt-1', text: 'Purple', isCorrect: false },
        { id: 'opt-2', text: 'Orange', isCorrect: true },
        { id: 'opt-3', text: 'Green', isCorrect: false }
      ]
    },
    {
      id: 'slide-15',
      type: 'celebration',
      stars: 5,
      confetti: true,
      message: '🏆 Color Champion!',
      finalScore: true,
      nextLesson: 'Lesson 4: Animals'
    }
  ],
  metadata: {
    CEFR: 'Pre-A1',
    ageGroup: '5-8 years',
    targets: [
      'Learn basic color names',
      'Describe favorite colors',
      'Identify colors in the environment',
      'Understand color mixing basics'
    ],
    vocabulary: [
      { word: 'Red', definition: 'The color of an apple', example: 'The ball is red.' },
      { word: 'Blue', definition: 'The color of the sky', example: 'I like blue.' },
      { word: 'Yellow', definition: 'The color of the sun', example: 'A yellow flower.' },
      { word: 'Green', definition: 'The color of grass', example: 'Green leaves.' }
    ],
    characters: [
      {
        name: 'Panda',
        type: 'friendly_teacher',
        personality: 'Creative, colorful',
        role: 'Color guide'
      }
    ]
  }
};
