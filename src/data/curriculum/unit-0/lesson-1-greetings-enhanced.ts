import { GameLessonData } from '@/types/gameLesson';

export const lesson1GreetingsEnhanced: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 25,
  metadata: {
    CEFR: 'A1',
    ageGroup: '4-7',
    story_theme: 'Meeting New Friends',
    learning_objectives: [
      'Greet others using "Hello" and "Hi"',
      'Introduce yourself: "My name is ___"',
      'Respond to introductions: "Nice to meet you!"',
      'Ask and answer: "What\'s your name?"'
    ],
    vocabulary: [
      { word: 'hello', translation: 'привет' },
      { word: 'hi', translation: 'привет' },
      { word: 'my name is', translation: 'меня зовут' },
      { word: 'nice to meet you', translation: 'приятно познакомиться' },
      { word: 'what\'s your name', translation: 'как тебя зовут' }
    ],
    characters: [
      { name: 'Anna', role: 'student', description: 'A cheerful girl with brown hair and blue eyes' },
      { name: 'Tom', role: 'student', description: 'A friendly boy with blonde hair and green eyes' },
      { name: 'Mia', role: 'student', description: 'An energetic girl with black hair and brown eyes' },
      { name: 'Leo', role: 'student', description: 'A happy boy with red hair and freckles' }
    ]
  },
  slides: [
    // Warm-up (2 min)
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Teacher Zahra',
        dialogue: "Hello! 👋 Welcome to English class! Today we'll learn how to say hello and introduce ourselves!"
      }
    },
    {
      slide_type: 'vocabulary_preview',
      prompt: 'Greetings We\'ll Learn',
      phrases: ['Hello!', 'Hi!', 'My name is ___', 'Nice to meet you!']
    },

    // Presentation (10 min)
    {
      slide_type: 'listen_repeat',
      prompt: 'Let\'s practice greetings!',
      instructions: 'Listen and repeat after me',
      phrases: ['Hello!', 'Hi!', 'Good morning!']
    },
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Anna',
        dialogue: "Hello! My name is Anna. Nice to meet you!"
      }
    },
    {
      slide_type: 'picture_choice',
      prompt: 'What\'s her name?',
      instructions: 'Click on the correct answer'
    },
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Tom',
        dialogue: "Hi! My name is Tom. Nice to meet you!"
      }
    },
    {
      slide_type: 'picture_choice',
      prompt: 'What\'s his name?',
      instructions: 'Click on the correct answer'
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: 'Say: "My name is ___"',
      instructions: 'Fill in with YOUR name and say it out loud!'
    },
    {
      slide_type: 'listen_repeat',
      prompt: 'Nice to Meet You!',
      instructions: 'Listen and repeat',
      phrases: ['Nice to meet you!', 'Nice to meet you, too!', 'How are you?']
    },

    // Practice (8 min)
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Mia',
        dialogue: "Hello! My name is Mia."
      }
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: 'You say: "Nice to meet you, Mia!"',
      instructions: 'Practice responding to introductions'
    },
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Leo',
        dialogue: "Hi! My name is Leo. What\'s your name?"
      }
    },
    {
      slide_type: 'text_input',
      prompt: 'You answer: "My name is ___"',
      instructions: 'Type your name or a pretend name'
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Match the Greetings!',
      instructions: 'Connect each greeting to its response',
      pairs: [
        { emoji: '👋 Hello!', word: 'Hi!' },
        { emoji: '😊 My name is Anna.', word: 'Nice to meet you!' },
        { emoji: '❓ What\'s your name?', word: 'My name is ___' },
        { emoji: '🤝 Nice to meet you!', word: 'Nice to meet you, too!' }
      ]
    },

    // Game (5 min)
    {
      slide_type: 'feelings_match',
      prompt: 'Find My Name! 🎮',
      instructions: 'Match each picture to their name',
      pairs: [
        { emoji: '👧', word: 'Anna' },
        { emoji: '👦', word: 'Tom' },
        { emoji: '👧🏻', word: 'Mia' },
        { emoji: '👦🏼', word: 'Leo' }
      ]
    },
    {
      slide_type: 'feelings_match',
      prompt: 'Match Character to Greeting!',
      instructions: 'Who said what?',
      pairs: [
        { emoji: '👧 Anna', word: 'Hello! My name is Anna.' },
        { emoji: '👦 Tom', word: 'Hi! My name is Tom.' },
        { emoji: '👧🏻 Mia', word: 'Hello! My name is Mia.' },
        { emoji: '👦🏼 Leo', word: 'Hi! My name is Leo.' }
      ]
    },

    // Wrap-up (5 min)
    {
      slide_type: 'text_input',
      prompt: 'Fill in the blank: Hello! My name is ______.',
      instructions: 'Type to complete the sentence'
    },
    {
      slide_type: 'text_input',
      prompt: 'Fill in the blank: Nice to ______ you!',
      instructions: 'What word is missing?'
    },
    {
      slide_type: 'pronunciation_shadow',
      prompt: 'Final Practice!',
      instructions: 'Say the full dialogue:\n"Hello! My name is (your name). Nice to meet you!"'
    },
    {
      slide_type: 'picture_choice',
      prompt: 'Draw Yourself! 🎨',
      instructions: 'Imagine drawing yourself and writing "My name is ___" below'
    },

    // Celebration
    {
      slide_type: 'celebration',
      prompt: '🎉 Amazing Job! You can introduce yourself in English! 🌟',
      stars: 3,
      confetti: true,
      finalScore: true,
      nextLesson: 'lesson-2-numbers'
    }
  ]
};
