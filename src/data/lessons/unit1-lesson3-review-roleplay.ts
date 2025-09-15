import { LessonSlides } from '@/types/slides';

export const unit1Lesson3ReviewRoleplay: LessonSlides = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 30,
  total_slides: 20,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 3,
    targets: [
      'Review all Unit 1 greetings and polite words',
      'Demonstrate phonics Aa-Bb knowledge',
      'Complete self-introduction confidently',
      'Participate in interactive review games'
    ],
    weights: {
      accuracy: 0.5,
      fluency: 0.5
    }
  },
  slides: [
    {
      id: 'warmup-unit-review',
      type: 'warmup',
      prompt: '🌟 Unit 1 Review Time!',
      instructions: 'Let\'s celebrate everything we\'ve learned together!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Unit 1 celebration banner',
        imagePrompt: 'festive banner showing "Unit 1 Review" with all learned words floating around: hello, hi, bye, yes, no, please, thank you'
      },
      gameConfig: {
        theme: 'fantasy',
        difficulty: 'easy',
        soundEffects: true,
        backgroundMusic: true
      }
    },
    {
      id: 'vocabulary-parade',
      type: 'vocabulary_preview',
      prompt: '🎪 Vocabulary Parade!',
      instructions: 'Look at all our amazing words marching by!',
      options: [
        { id: 'hello', text: 'Hello', image: '/placeholder.svg' },
        { id: 'hi', text: 'Hi', image: '/placeholder.svg' },
        { id: 'bye', text: 'Bye', image: '/placeholder.svg' },
        { id: 'yes', text: 'Yes', image: '/placeholder.svg' },
        { id: 'no', text: 'No', image: '/placeholder.svg' },
        { id: 'please', text: 'Please', image: '/placeholder.svg' },
        { id: 'thank-you', text: 'Thank you', image: '/placeholder.svg' }
      ],
      vocabulary: ['hello', 'hi', 'bye', 'yes', 'no', 'please', 'thank you']
    },
    {
      id: 'phonics-aa-bb-chant',
      type: 'pronunciation_shadow',
      prompt: '🎵 Aa-Bb Phonics Chant!',
      instructions: 'Sing along: "A is for Apple, B is for Ball, We know our letters, big and small!"',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Letters A and B with apple and ball',
        imagePrompt: 'colorful letters A and B with apple and ball illustrations, musical notes around them'
      }
    },
    {
      id: 'self-intro-practice',
      type: 'controlled_practice',
      prompt: '🎤 Self-Introduction Star!',
      instructions: 'Say confidently: "Hello! I am [your name]. Nice to meet you!"',
      timeLimit: 20,
      gameConfig: {
        theme: 'fantasy',
        difficulty: 'easy'
      }
    },
    {
      id: 'spin-speak-wheel',
      type: 'controlled_practice',
      prompt: '🎡 Spin & Speak Wheel!',
      instructions: 'Spin the wheel and say what appears! Ready?',
      gameConfig: {
        theme: 'fantasy',
        difficulty: 'easy',
        soundEffects: true,
        powerUps: true
      },
      options: [
        { id: 'spin1', text: 'Say "Hello!"' },
        { id: 'spin2', text: 'Say "Yes, please!"' },
        { id: 'spin3', text: 'Say "No, thank you!"' },
        { id: 'spin4', text: 'Say your name!' },
        { id: 'spin5', text: 'Say "Goodbye!"' },
        { id: 'spin6', text: 'Say "Thank you!"' }
      ]
    },
    {
      id: 'greeting-bingo',
      type: 'fast_match',
      prompt: '🎯 Greeting Bingo Challenge!',
      instructions: 'Listen and mark the greeting words you hear!',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        targetScore: 5,
        soundEffects: true
      },
      options: [
        { id: 'bingo1', text: 'Hello', isCorrect: true },
        { id: 'bingo2', text: 'Yes', isCorrect: true },
        { id: 'bingo3', text: 'Thank you', isCorrect: true },
        { id: 'bingo4', text: 'Bye', isCorrect: true },
        { id: 'bingo5', text: 'Please', isCorrect: true }
      ]
    },
    {
      id: 'memory-master-review',
      type: 'memory_flip',
      prompt: '🧠 Memory Master Review!',
      instructions: 'Find all the matching word pairs from Unit 1!',
      gameConfig: {
        theme: 'fantasy',
        difficulty: 'medium',
        targetScore: 6,
        soundEffects: true
      },
      matchPairs: [
        { id: 'mem1', left: 'Hello', right: 'Hello' },
        { id: 'mem2', left: 'Yes', right: 'Yes' },
        { id: 'mem3', left: 'No', right: 'No' },
        { id: 'mem4', left: 'Please', right: 'Please' },
        { id: 'mem5', left: 'Thank you', right: 'Thank you' },
        { id: 'mem6', left: 'Bye', right: 'Bye' }
      ]
    },
    {
      id: 'listening-review',
      type: 'listening_comprehension',
      prompt: '👂 Super Listening Challenge!',
      instructions: 'Listen to this conversation. What do you hear?',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Review conversation audio'
      },
      options: [
        { id: 'listen1', text: 'Hello and goodbye', isCorrect: true },
        { id: 'listen2', text: 'Yes and no', isCorrect: false },
        { id: 'listen3', text: 'Please and thank you', isCorrect: false }
      ]
    },
    {
      id: 'drag-drop-conversation',
      type: 'drag_drop',
      prompt: '💬 Build a Perfect Conversation!',
      instructions: 'Drag the words to complete this friendly chat!',
      dragDropItems: [
        { id: 'conv1', text: 'Hello', targetId: 'start' },
        { id: 'conv2', text: 'Thank you', targetId: 'end' },
        { id: 'conv3', text: 'Yes, please', targetId: 'middle' }
      ],
      dragDropTargets: [
        { 
          id: 'start',
          text: '___! I am Tom.',
          acceptsItemIds: ['conv1'],
          image: '/placeholder.svg'
        },
        { 
          id: 'middle',
          text: 'Do you want to play? ___!',
          acceptsItemIds: ['conv3'],
          image: '/placeholder.svg'
        },
        { 
          id: 'end',
          text: 'Here you go! ___!',
          acceptsItemIds: ['conv2'],
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'picture-story-review',
      type: 'picture_choice',
      prompt: '📖 Picture Story Review!',
      instructions: 'Which picture shows a polite greeting?',
      options: [
        { id: 'story1', text: 'Children greeting each other', image: '/placeholder.svg', isCorrect: true },
        { id: 'story2', text: 'Children running away', image: '/placeholder.svg', isCorrect: false },
        { id: 'story3', text: 'Children sleeping', image: '/placeholder.svg', isCorrect: false }
      ]
    },
    {
      id: 'roleplay-2-friends',
      type: 'roleplay_setup',
      prompt: '🎭 Introduce Yourself to 2 Friends!',
      instructions: 'Role-play: Meet 2 new friends. Use all your polite words!',
      gameConfig: {
        theme: 'playground',
        difficulty: 'medium'
      },
      timeLimit: 120
    },
    {
      id: 'treasure-hunt-words',
      type: 'treasure_hunt',
      prompt: '💎 Word Treasure Hunt!',
      instructions: 'Find the hidden greeting treasures around the room!',
      gameConfig: {
        theme: 'fantasy',
        difficulty: 'easy',
        targetScore: 7,
        soundEffects: true,
        powerUps: true
      },
      vocabulary: ['hello', 'hi', 'bye', 'yes', 'no', 'please', 'thank you']
    },
    {
      id: 'sentence-complete-review',
      type: 'cloze',
      prompt: '🔤 Complete the Sentences!',
      instructions: 'Fill in the missing words!',
      clozeText: '___ ! I am Sarah. ___ to meet you! Do you want to play? ___, please!',
      clozeGaps: [
        { id: 'gap1', correctAnswers: ['Hello', 'Hi'] },
        { id: 'gap2', correctAnswers: ['Nice'] },
        { id: 'gap3', correctAnswers: ['Yes'] }
      ]
    },
    {
      id: 'aa-bb-review',
      type: 'match',
      prompt: '🔤 Letters Aa-Bb Review!',
      instructions: 'Match each letter with its special word!',
      matchPairs: [
        { 
          id: 'letter1', 
          left: 'A', 
          right: 'Apple',
          leftImage: '/placeholder.svg',
          rightImage: '/placeholder.svg'
        },
        { 
          id: 'letter2', 
          left: 'B', 
          right: 'Ball',
          leftImage: '/placeholder.svg',
          rightImage: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'word-rain-review',
      type: 'word_rain',
      prompt: '🌧️ Catch All Unit 1 Words!',
      instructions: 'Catch every word we learned in Unit 1!',
      gameConfig: {
        theme: 'fantasy',
        difficulty: 'medium',
        targetScore: 12,
        timeBonus: true
      },
      vocabulary: ['hello', 'hi', 'bye', 'yes', 'no', 'please', 'thank', 'you', 'apple', 'ball']
    },
    {
      id: 'communicative-final',
      type: 'communicative_task',
      prompt: '💬 Final Communication Challenge!',
      instructions: 'Have a complete conversation using ALL Unit 1 words with a partner!',
      timeLimit: 180
    },
    {
      id: 'pronunciation-graduation',
      type: 'pronunciation_shadow',
      prompt: '🎓 Graduation Pronunciation!',
      instructions: 'Say clearly: "Hello! I am [name]. Yes, please! No, thank you! Goodbye!"',
      timeLimit: 30
    },
    {
      id: 'accuracy-final-check',
      type: 'accuracy_mcq',
      prompt: '✅ Final Knowledge Check!',
      instructions: 'What\'s the BEST way to introduce yourself?',
      options: [
        { id: 'final1', text: 'Hello! I am [name]. Nice to meet you!', isCorrect: true },
        { id: 'final2', text: 'Goodbye! I am [name]. Thank you!', isCorrect: false },
        { id: 'final3', text: 'Yes! I am [name]. No please!', isCorrect: false }
      ]
    },
    {
      id: 'celebration-review',
      type: 'review_consolidation',
      prompt: '🎉 Unit 1 Masters!',
      instructions: 'Congratulations! You\'ve mastered Unit 1: Hello English! 🌟',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Unit 1 completion celebration with confetti',
        imagePrompt: 'grand celebration with confetti, stars, and all Unit 1 words floating in a victory banner: Hello English Masters!'
      }
    }
  ]
};