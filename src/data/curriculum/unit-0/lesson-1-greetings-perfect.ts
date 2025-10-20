import { GameLessonData } from '@/types/gameLesson';

export const lesson1GreetingsPerfect: GameLessonData = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  metadata: {
    CEFR: 'Pre-A1',
    ageGroup: '4-7 years',
    story_theme: 'Making New Friends at School',
    learning_objectives: [
      'Greet others using "Hello" and "Hi"',
      'Introduce yourself: "My name is ___"',
      'Respond to introductions: "Nice to meet you!"',
      'Ask and answer: "What\'s your name?"'
    ],
    vocabulary: [
      { word: 'hello', definition: 'A greeting', example: 'Hello! How are you?' },
      { word: 'hi', definition: 'An informal greeting', example: 'Hi! Nice to meet you.' },
      { word: 'my name is', definition: 'Introduction phrase', example: 'My name is Anna.' },
      { word: 'nice to meet you', definition: 'Polite response', example: 'Nice to meet you!' }
    ],
    characters: [
      { name: 'Teacher Zahra', role: 'teacher', personality: 'patient, encouraging', type: 'friendly_teacher' },
      { name: 'Anna', role: 'student', personality: 'cheerful, helpful', type: 'student_friend' },
      { name: 'Tom', role: 'student', personality: 'sporty, confident', type: 'student_friend' },
      { name: 'Mia', role: 'student', personality: 'energetic, creative', type: 'student_friend' },
      { name: 'Leo', role: 'student', personality: 'curious, kind', type: 'student_friend' }
    ]
  },
  slides: [
    // PRESENTATION PHASE (10 minutes) - Slides 1-10
    
    // Slide 1: Warm-Up
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Teacher Zahra',
        dialogue: 'Hello! Welcome to English class! Today we will learn how to introduce ourselves and make new friends! Are you ready? 👋'
      }
    },
    
    // Slide 2: Story Context
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Teacher Zahra',
        dialogue: 'Today we will meet 4 new friends at school! Let\'s learn their names and practice saying hello!'
      }
    },
    
    // Slide 3: Vocabulary Preview
    {
      slide_type: 'vocabulary_preview',
      phrases: [
        'Hello! 👋',
        'Hi! 😊',
        'My name is ___ 📛',
        'Nice to meet you! 🤝',
        'What\'s your name? ❓'
      ]
    },
    
    // Slide 4: Listen & Repeat - Greetings
    {
      slide_type: 'listen_repeat',
      phrases: ['Hello!', 'Hi!', 'Good morning!']
    },
    
    // Slide 5: Listen & Repeat - Introductions
    {
      slide_type: 'listen_repeat',
      phrases: ['My name is Teacher Zahra', 'My name is ___', 'What\'s your name?']
    },
    
    // Slide 6: Meet Anna
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Anna',
        dialogue: 'Hello! My name is Anna. I love to help my friends. Nice to meet you!'
      }
    },
    
    // Slide 7: Quiz - Anna's Name
    {
      slide_type: 'quiz',
      prompt: 'What\'s her name?',
      options: ['Anna', 'Emma', 'Sophia', 'Mia'],
      correctAnswer: 'Anna'
    },
    
    // Slide 8: Meet Tom
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Tom',
        dialogue: 'Hi! My name is Tom. I like sports and playing outside. Nice to meet you!'
      }
    },
    
    // Slide 9: Quiz - Tom's Name
    {
      slide_type: 'quiz',
      prompt: 'What\'s his name?',
      options: ['Jack', 'Tom', 'Leo', 'Max'],
      correctAnswer: 'Tom'
    },
    
    // Slide 10: Student Introduction Practice
    {
      slide_type: 'text_input',
      prompt: 'Now it\'s your turn! What\'s your name?',
      instructions: 'Type: My name is ___'
    },
    
    // PRACTICE PHASE (12 minutes) - Slides 11-17
    
    // Slide 11: Meet Mia
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Mia',
        dialogue: 'Hello! My name is Mia. I love art and drawing. What\'s your name?'
      }
    },
    
    // Slide 12: Response Practice
    {
      slide_type: 'pronunciation_shadow',
      phrases: ['Nice to meet you, Mia!']
    },
    
    // Slide 13: Meet Leo
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Leo',
        dialogue: 'Hi! My name is Leo. I like to read books and learn new things. Nice to meet you!'
      }
    },
    
    // Slide 14: Interactive Dialogue
    {
      slide_type: 'text_input',
      prompt: 'Leo asks: What\'s your name?',
      instructions: 'Type your full introduction: My name is ___'
    },
    
    // Slide 15: Feelings Match Game
    {
      slide_type: 'feelings_match',
      pairs: [
        { emoji: '👋', word: 'Hello' },
        { emoji: '😊', word: 'Hi' },
        { emoji: '📛', word: 'My name' },
        { emoji: '🤝', word: 'Nice to meet you' }
      ]
    },
    
    // Slide 16: Character Memory Game
    {
      slide_type: 'picture_choice',
      prompt: 'Can you remember all our new friends?',
      instructions: 'Match each face to the correct name!'
    },
    
    // Slide 17: Who Said What Quiz
    {
      slide_type: 'quiz',
      prompt: '"I love art and drawing!" - Who said this?',
      options: ['Anna', 'Tom', 'Mia', 'Leo'],
      correctAnswer: 'Mia'
    },
    
    // PRODUCTION PHASE (6 minutes) - Slides 18-20
    
    // Slide 18: Role-Play Practice
    {
      slide_type: 'character_introduction',
      character: {
        name: 'Anna',
        dialogue: 'Let\'s practice together! I\'ll greet you, and you respond. Ready?'
      }
    },
    
    // Slide 19: Fill in the Blanks
    {
      slide_type: 'text_input',
      prompt: 'Complete the sentence:',
      instructions: 'Hello! My _____ is [Your Name].'
    },
    
    // Slide 20: Create Your Character
    {
      slide_type: 'text_input',
      prompt: 'Draw yourself and write your name!',
      instructions: 'My name is ___. I like ___.'
    },
    
    // WRAP-UP PHASE (2 minutes) - Slides 21-23
    
    // Slide 21: Quick Recap
    {
      slide_type: 'quiz',
      prompt: 'How do you greet someone?',
      options: ['Hello / Hi', 'Goodbye', 'Thank you', 'Sorry'],
      correctAnswer: 'Hello / Hi'
    },
    
    // Slide 22: Full Dialogue Practice
    {
      slide_type: 'pronunciation_shadow',
      phrases: [
        'Hello!',
        'Hi! My name is ___',
        'My name is Anna. Nice to meet you!',
        'Nice to meet you, too!'
      ]
    },
    
    // Slide 23: Celebration
    {
      slide_type: 'celebration',
      stars: 5,
      confetti: true,
      finalScore: true,
      nextLesson: 'Numbers 1-10'
    }
  ]
};
