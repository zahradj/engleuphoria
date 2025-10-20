export const lesson1GameIntro = {
  version: '2.0',
  theme: 'game',
  durationMin: 30,
  slides: [
    // Scene 1: Welcome & Greeting (slides 1-3)
    {
      id: 'slide-1',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: "Hello! Welcome to English class! I'm so excited to meet you! 🐼"
      }
    },
    {
      id: 'slide-2',
      type: 'text_input',
      prompt: "What's your name?",
      instructions: 'Type your name below to get started!'
    },
    {
      id: 'slide-3',
      type: 'celebration',
      stars: 1,
      confetti: false
    },

    // Scene 2: Introduction Practice (slides 4-7)
    {
      id: 'slide-4',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: 'My name is Panda. Nice to meet you!'
      }
    },
    {
      id: 'slide-5',
      type: 'vocabulary_preview',
      prompt: 'Learn: "My name is..."',
      instructions: 'This is how we introduce ourselves in English'
    },
    {
      id: 'slide-6',
      type: 'text_input',
      prompt: 'Now you try!',
      instructions: 'Type: "My name is ____"'
    },
    {
      id: 'slide-7',
      type: 'celebration',
      stars: 2,
      message: 'Perfect introduction!'
    },

    // Scene 3: Feelings Match Game (slides 8-11)
    {
      id: 'slide-8',
      type: 'vocabulary_preview',
      prompt: 'New Words: Feelings!',
      instructions: 'We can use these words to describe how we feel'
    },
    {
      id: 'slide-9',
      type: 'feelings_match',
      prompt: 'Match the Feelings!',
      instructions: 'Click an emoji, then click the matching word'
    },
    {
      id: 'slide-10',
      type: 'celebration',
      stars: 3,
      message: 'Amazing! You know your feelings! 😄'
    },

    // Scene 4: Listen & Repeat (slides 12-15)
    {
      id: 'slide-11',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: "Let's practice some important phrases together!"
      }
    },
    {
      id: 'slide-12',
      type: 'listen_repeat',
      prompt: 'Listen and Repeat',
      phrases: ['Hello!', 'Hi!', 'Nice to meet you!', 'Goodbye!']
    },
    {
      id: 'slide-13',
      type: 'celebration',
      stars: 4,
      message: 'Your pronunciation is great! 🎉'
    },

    // Scene 5: Mini Quiz (slides 16-19)
    {
      id: 'slide-14',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: "Time for a fun quiz! Let's see what you remember!"
      }
    },
    {
      id: 'slide-15',
      type: 'picture_choice',
      prompt: 'What do you say when you meet someone?',
      instructions: 'Choose the correct answer',
      options: [
        { id: 'opt-1', text: 'Nice to meet you!', isCorrect: true },
        { id: 'opt-2', text: 'Goodbye!', isCorrect: false },
        { id: 'opt-3', text: 'My name is sad', isCorrect: false }
      ]
    },
    {
      id: 'slide-16',
      type: 'picture_choice',
      prompt: 'What does "Hello" mean?',
      instructions: 'Choose the greeting',
      options: [
        { id: 'opt-1', text: 'A way to say goodbye', isCorrect: false },
        { id: 'opt-2', text: 'A way to greet someone', isCorrect: true },
        { id: 'opt-3', text: 'A type of food', isCorrect: false }
      ]
    },
    {
      id: 'slide-17',
      type: 'celebration',
      stars: 5,
      confetti: true,
      message: '🎊 Perfect Score! You are amazing!'
    },

    // Scene 6: Goodbye & Final Celebration (slides 20-21)
    {
      id: 'slide-18',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: 'Goodbye! You did an incredible job today! See you in the next lesson! 🌟'
      }
    },
    {
      id: 'slide-19',
      type: 'celebration',
      stars: 5,
      finalScore: true,
      confetti: true,
      message: '🏆 Lesson Complete!',
      nextLesson: 'Lesson 2: How old are you?'
    }
  ],
  metadata: {
    CEFR: 'Pre-A1',
    ageGroup: '5-8 years',
    targets: [
      'Learn personal introductions ("My name is …")',
      'Practice basic greetings ("Hello", "Hi", "Nice to meet you")',
      'Practice answering and asking "What\'s your name?"',
      'Identify and respond to feelings (happy, sad, good)',
      'Develop listening, speaking, reading, and writing skills'
    ],
    vocabulary: [
      { word: 'Hello', definition: 'A greeting', example: 'Hello! How are you?' },
      { word: 'Hi', definition: 'An informal greeting', example: 'Hi there!' },
      { word: 'Goodbye', definition: 'A farewell', example: 'Goodbye! See you later!' },
      { word: 'Name', definition: 'What you are called', example: 'My name is Alex.' },
      { word: 'Happy', definition: 'Feeling joyful', example: 'I am happy today!' },
      { word: 'Sad', definition: 'Feeling unhappy', example: 'She looks sad.' },
      { word: 'Nice to meet you', definition: 'A polite greeting when meeting someone', example: 'Nice to meet you, John!' }
    ],
    characters: [
      {
        name: 'Panda',
        type: 'friendly_teacher',
        personality: 'Warm, encouraging, patient',
        role: 'Main teacher character who guides students through the lesson'
      }
    ],
    story_theme: 'Meeting new friends and learning basic English greetings',
    weights: {
      accuracy: 60,
      fluency: 40
    }
  }
};
