import { LessonSlides } from '@/types/slides';

export const a1M1L1Greetings: LessonSlides = {
  version: '2.0',
  theme: 'default',
  durationMin: 30,
  total_slides: 20,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 1,
    targets: [
      'Students can greet politely (Hello, Hi, Goodbye)',
      'Students can ask and answer "What\'s your name?"',
      'Students can say their age using "I am … years old"'
    ],
    weights: {
      accuracy: 0.7,
      fluency: 0.3
    }
  },
  slides: [
    {
      id: 'warmup-01',
      type: 'warmup',
      prompt: 'Welcome to our lesson! Let\'s learn how to greet people in English.',
      instructions: 'Watch the teacher wave hello!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Cartoon teacher waving at children',
        imagePrompt: 'cartoon teacher avatar waving at children in classroom, bright and friendly colors, light green and sky blue theme'
      },
      accessibility: {
        screenReaderText: 'A friendly cartoon teacher is waving hello to welcome students'
      }
    },
    {
      id: 'vocab-preview-01',
      type: 'vocabulary_preview',
      prompt: 'These are today\'s magic words!',
      instructions: 'Listen and repeat each word.',
      options: [
        { id: 'hello', text: 'Hello', image: '/placeholder.svg' },
        { id: 'hi', text: 'Hi', image: '/placeholder.svg' },
        { id: 'goodbye', text: 'Goodbye', image: '/placeholder.svg' },
        { id: 'name', text: 'Name', image: '/placeholder.svg' },
        { id: 'age', text: 'Age', image: '/placeholder.svg' }
      ]
    },
    {
      id: 'input-story-01',
      type: 'target_language',
      prompt: 'Meet Anna and Sam! They are meeting for the first time.',
      instructions: 'Watch how they greet each other.',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Comic strip of two kids meeting',
        imagePrompt: 'comic strip style illustration of two friendly kids meeting for the first time in classroom, speech bubbles showing greetings, bright cartoon style with light green and sky blue colors'
      }
    },
    {
      id: 'listening-01',
      type: 'listening_comprehension',
      prompt: 'Listen to Anna introduce herself.',
      instructions: 'What does Anna say?',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Audio of Anna speaking'
      },
      options: [
        { id: 'opt1', text: 'Hello! My name is Anna.', isCorrect: true },
        { id: 'opt2', text: 'Goodbye! My name is Anna.', isCorrect: false },
        { id: 'opt3', text: 'Hi! My age is Anna.', isCorrect: false }
      ],
      correct: 'opt1'
    },
    {
      id: 'drag-drop-01',
      type: 'drag_drop',
      prompt: 'Match the greetings with the right pictures!',
      instructions: 'Drag each word to its matching picture.',
      dragDropItems: [
        { id: 'hello-word', text: 'Hello', targetId: 'hello-pic' },
        { id: 'goodbye-word', text: 'Goodbye', targetId: 'goodbye-pic' }
      ],
      dragDropTargets: [
        { 
          id: 'hello-pic', 
          text: 'Kids waving', 
          acceptsItemIds: ['hello-word'],
          image: '/placeholder.svg'
        },
        { 
          id: 'goodbye-pic', 
          text: 'Kids saying bye', 
          acceptsItemIds: ['goodbye-word'],
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'pronunciation-01',
      type: 'pronunciation_shadow',
      prompt: 'Let\'s practice saying "Hello" clearly!',
      instructions: 'Listen and repeat after me.',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Hello pronunciation'
      }
    },
    {
      id: 'grammar-focus-01',
      type: 'grammar_focus',
      prompt: 'Learn to say "My name is..." and "I am ... years old"',
      instructions: 'Watch how we make these sentences.',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Grammar pattern illustration',
        imagePrompt: 'friendly cartoon illustration showing sentence patterns "My name is..." and "I am ... years old" with colorful text bubbles and kids'
      }
    },
    {
      id: 'sentence-builder-01',
      type: 'sentence_builder',
      prompt: 'Build the sentence: "My name is Sam"',
      instructions: 'Put the words in the correct order.',
      options: [
        { id: 'my', text: 'My' },
        { id: 'name', text: 'name' },
        { id: 'is', text: 'is' },
        { id: 'sam', text: 'Sam' }
      ],
      correct: ['my', 'name', 'is', 'sam']
    },
    {
      id: 'mcq-01',
      type: 'accuracy_mcq',
      prompt: 'Complete: Hello! ___ your name?',
      instructions: 'Choose the correct word.',
      options: [
        { id: 'what', text: 'What\'s', isCorrect: true },
        { id: 'where', text: 'Where\'s', isCorrect: false },
        { id: 'when', text: 'When\'s', isCorrect: false }
      ],
      correct: 'what'
    },
    {
      id: 'mcq-02',
      type: 'accuracy_mcq',
      prompt: 'Complete: I ___ eight years old.',
      instructions: 'Choose the correct word.',
      options: [
        { id: 'am', text: 'am', isCorrect: true },
        { id: 'is', text: 'is', isCorrect: false },
        { id: 'are', text: 'are', isCorrect: false }
      ],
      correct: 'am'
    },
    {
      id: 'controlled-practice-01',
      type: 'controlled_practice',
      prompt: 'Practice introducing yourself!',
      instructions: 'Say: "Hello! My name is [your name]. I am [your age] years old."',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Practice speaking',
        imagePrompt: 'encouraging cartoon character with speech bubble showing introduction pattern, bright and motivating colors'
      }
    },
    {
      id: 'roleplay-01',
      type: 'roleplay_setup',
      prompt: 'Role Play: Meeting a New Friend',
      instructions: 'Practice greeting and introducing yourself to a new classmate.',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Two avatars meeting',
        imagePrompt: 'two friendly cartoon avatars facing each other with speech bubbles, classroom background, light green and sky blue theme'
      }
    },
    {
      id: 'communicative-task-01',
      type: 'communicative_task',
      prompt: 'Interview Game: Find someone who...',
      instructions: 'Ask your classmates their names and ages to complete the task.',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Interview activity',
        imagePrompt: 'cartoon kids talking to each other with question marks and speech bubbles, interactive and engaging style'
      }
    },
    {
      id: 'picture-description-01',
      type: 'picture_description',
      prompt: 'Describe what you see!',
      instructions: 'Tell me about the people in this picture. Are they saying hello or goodbye?',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'People greeting scene',
        imagePrompt: 'cartoon scene of people greeting each other in different situations - at school, at home, in park, bright friendly colors'
      }
    },
    {
      id: 'micro-input-01',
      type: 'micro_input',
      prompt: 'Quick Check: Greetings',
      instructions: 'Match the time of day with the right greeting.',
      options: [
        { id: 'morning', text: 'Good morning', isCorrect: true },
        { id: 'evening', text: 'Good evening', isCorrect: false }
      ]
    },
    {
      id: 'fluency-sprint-01',
      type: 'fluency_sprint',
      prompt: 'Speed Round: Introductions!',
      instructions: 'Introduce yourself as many times as you can in 60 seconds!',
      timeLimit: 60,
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Timer and speaking',
        imagePrompt: 'energetic cartoon timer with speaking mouth and sound waves, motivational and exciting style'
      }
    },
    {
      id: 'match-01',
      type: 'match',
      prompt: 'Match the greeting with the response!',
      instructions: 'Connect each greeting with its best response.',
      matchPairs: [
        { id: 'pair1', left: 'Hello!', right: 'Hi there!' },
        { id: 'pair2', left: 'What\'s your name?', right: 'My name is Anna.' },
        { id: 'pair3', left: 'How old are you?', right: 'I am 8 years old.' }
      ]
    },
    {
      id: 'cloze-01',
      type: 'cloze',
      prompt: 'Fill in the missing words!',
      instructions: 'Complete the conversation.',
      clozeText: 'Hello! My {name} is Sam. I {am} 7 years old. What\'s {your} name?',
      clozeGaps: [
        { id: 'gap1', correctAnswers: ['name'] },
        { id: 'gap2', correctAnswers: ['am'] },
        { id: 'gap3', correctAnswers: ['your'] }
      ]
    },
    {
      id: 'review-01',
      type: 'review_consolidation',
      prompt: 'Let\'s review what we learned today!',
      instructions: 'Can you remember our magic words for greetings?',
      options: [
        { id: 'hello', text: 'Hello' },
        { id: 'hi', text: 'Hi' },
        { id: 'goodbye', text: 'Goodbye' },
        { id: 'name', text: 'My name is...' },
        { id: 'age', text: 'I am ... years old' }
      ]
    },
    {
      id: 'exit-check-01',
      type: 'exit_check',
      prompt: 'Great job today! Show me what you learned.',
      instructions: 'Introduce yourself one more time using everything we practiced.',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Celebration with trophy',
        imagePrompt: 'golden trophy with stars and confetti, congratulatory message, bright celebratory colors with light green and sky blue theme'
      },
      accessibility: {
        screenReaderText: 'Congratulations! You completed the greetings lesson successfully.'
      }
    }
  ]
};