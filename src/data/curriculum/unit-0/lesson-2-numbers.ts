export const lesson2Numbers = {
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
        dialogue: "Welcome back! Today we'll learn numbers 1-10! 🔢"
      }
    },
    {
      id: 'slide-2',
      type: 'text_input',
      prompt: 'What is your name?',
      instructions: 'Type your name to continue'
    },
    
    // Scene 2: Number Introduction
    {
      id: 'slide-3',
      type: 'vocabulary_preview',
      prompt: 'Numbers 1-5',
      instructions: 'Let\'s learn the first five numbers!'
    },
    {
      id: 'slide-4',
      type: 'listen_repeat',
      prompt: 'Listen and Count!',
      phrases: ['One', 'Two', 'Three', 'Four', 'Five']
    },
    {
      id: 'slide-5',
      type: 'celebration',
      stars: 1,
      message: 'Great counting! 🎉'
    },

    // Scene 3: Numbers 6-10
    {
      id: 'slide-6',
      type: 'vocabulary_preview',
      prompt: 'Numbers 6-10',
      instructions: 'Now let\'s learn five more numbers!'
    },
    {
      id: 'slide-7',
      type: 'listen_repeat',
      prompt: 'Keep Counting!',
      phrases: ['Six', 'Seven', 'Eight', 'Nine', 'Ten']
    },
    {
      id: 'slide-8',
      type: 'celebration',
      stars: 2,
      message: 'You can count to 10! 🌟'
    },

    // Scene 4: Age Question
    {
      id: 'slide-9',
      type: 'character_introduction',
      character: {
        name: 'Panda',
        dialogue: 'I am 8 years old. How old are you?'
      }
    },
    {
      id: 'slide-10',
      type: 'text_input',
      prompt: 'Type your age',
      instructions: 'Type a number: "I am ___ years old"'
    },
    {
      id: 'slide-11',
      type: 'celebration',
      stars: 3,
      message: 'Perfect! Now we know your age! 🎂'
    },

    // Scene 5: Quiz
    {
      id: 'slide-12',
      type: 'picture_choice',
      prompt: 'What comes after 5?',
      instructions: 'Choose the correct number',
      options: [
        { id: 'opt-1', text: 'Four', isCorrect: false },
        { id: 'opt-2', text: 'Six', isCorrect: true },
        { id: 'opt-3', text: 'Seven', isCorrect: false }
      ]
    },
    {
      id: 'slide-13',
      type: 'picture_choice',
      prompt: 'How many fingers on one hand?',
      instructions: 'Count carefully!',
      options: [
        { id: 'opt-1', text: 'Four', isCorrect: false },
        { id: 'opt-2', text: 'Five', isCorrect: true },
        { id: 'opt-3', text: 'Six', isCorrect: false }
      ]
    },
    {
      id: 'slide-14',
      type: 'celebration',
      stars: 5,
      confetti: true,
      message: '🏆 Number Master!',
      finalScore: true,
      nextLesson: 'Lesson 3: Colors'
    }
  ],
  metadata: {
    CEFR: 'Pre-A1',
    ageGroup: '5-8 years',
    targets: [
      'Learn numbers 1-10',
      'Practice asking and answering "How old are you?"',
      'Count objects',
      'Use numbers in simple sentences'
    ],
    vocabulary: [
      { word: 'One', definition: 'The number 1', example: 'I have one apple.' },
      { word: 'Two', definition: 'The number 2', example: 'Two cats.' },
      { word: 'Three', definition: 'The number 3', example: 'Three birds.' },
      { word: 'How old are you?', definition: 'Question to ask someone\'s age', example: 'How old are you? I am 7.' }
    ],
    characters: [
      {
        name: 'Panda',
        type: 'friendly_teacher',
        personality: 'Patient, encouraging',
        role: 'Number teacher'
      }
    ]
  }
};
