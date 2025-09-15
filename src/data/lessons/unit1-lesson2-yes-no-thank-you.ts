import { LessonSlides } from '@/types/slides';

export const unit1Lesson2YesNoThankYou: LessonSlides = {
  version: '2.0',
  theme: 'sage-sand',
  durationMin: 35,
  total_slides: 22,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 2,
    targets: [
      'Use yes, no, thank you appropriately',
      'Say mini-sentences: "Yes, please" and "No, thank you"',
      'Recognize and write letter Bb',
      'Participate in puppet dialogues and games'
    ],
    weights: {
      accuracy: 0.6,
      fluency: 0.4
    }
  },
  slides: [
    {
      id: 'warmup-review',
      type: 'warmup',
      prompt: '👋 Hello Again! Ready for Lesson 2?',
      instructions: 'Say "Hello, I am [your name]" to review!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Friendly welcome back illustration',
        imagePrompt: 'cheerful cartoon teacher welcoming students back with "Lesson 2" banner'
      }
    },
    {
      id: 'vocab-yes-no-thanks',
      type: 'vocabulary_preview',
      prompt: '✨ New Magic Words!',
      instructions: 'Listen and repeat these powerful words!',
      options: [
        { id: 'yes', text: 'Yes', image: '/placeholder.svg' },
        { id: 'no', text: 'No', image: '/placeholder.svg' },
        { id: 'thank-you', text: 'Thank you', image: '/placeholder.svg' },
        { id: 'please', text: 'Please', image: '/placeholder.svg' }
      ],
      vocabulary: ['yes', 'no', 'thank you', 'please'],
      gameConfig: {
        theme: 'forest',
        difficulty: 'easy',
        soundEffects: true
      }
    },
    {
      id: 'phonics-bb',
      type: 'tpr_phonics',
      prompt: '🎈 Letter Bb - Balloon Fun!',
      instructions: 'Bounce like a ball while saying "Bbb for Balloon!"',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Big letter B with balloon graphics',
        imagePrompt: 'large colorful letter B with bouncing balloons, educational phonics style'
      },
      vocabulary: ['balloon', 'ball', 'butterfly', 'banana']
    },
    {
      id: 'target-mini-sentences',
      type: 'target_language',
      prompt: '🗣️ Mini-Sentences Power!',
      instructions: 'Watch how to use "Yes, please" and "No, thank you"',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Comic showing polite responses',
        imagePrompt: 'comic strip showing children using "Yes, please" and "No, thank you" politely'
      }
    },
    {
      id: 'puppet-dialogue-1',
      type: 'listening_comprehension',
      prompt: '🎭 Puppet Show Time!',
      instructions: 'Listen to Puppet Pete ask: "Do you want a cookie?"',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Puppet Pete asking about cookie'
      },
      options: [
        { id: 'puppet1', text: 'Yes, please!', isCorrect: true },
        { id: 'puppet2', text: 'No, thank you!', isCorrect: true },
        { id: 'puppet3', text: 'Hello, goodbye!', isCorrect: false }
      ]
    },
    {
      id: 'yes-no-jump-game',
      type: 'fast_match',
      prompt: '🦘 Yes/No Jump Challenge!',
      instructions: 'Jump LEFT for YES, Jump RIGHT for NO!',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        targetScore: 5,
        soundEffects: true,
        powerUps: true
      },
      options: [
        { id: 'jump1', text: 'Do you like ice cream?', isCorrect: true },
        { id: 'jump2', text: 'Do you like vegetables?', isCorrect: true },
        { id: 'jump3', text: 'Do you like to play?', isCorrect: true }
      ]
    },
    {
      id: 'matching-icons',
      type: 'match',
      prompt: '🔗 Match Words to Pictures!',
      instructions: 'Connect each word with its matching picture!',
      matchPairs: [
        { 
          id: 'match1', 
          left: 'Yes', 
          right: '👍',
          leftImage: '/placeholder.svg',
          rightImage: '/placeholder.svg'
        },
        { 
          id: 'match2', 
          left: 'No', 
          right: '👎',
          leftImage: '/placeholder.svg',
          rightImage: '/placeholder.svg'
        },
        { 
          id: 'match3', 
          left: 'Thank you', 
          right: '🙏',
          leftImage: '/placeholder.svg',
          rightImage: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'puppet-dialogue-cards',
      type: 'picture_choice',
      prompt: '🎭 Puppet Dialogue Cards!',
      instructions: 'Which puppet is saying "Thank you"?',
      options: [
        { id: 'card1', text: 'Puppet saying thank you', image: '/placeholder.svg', isCorrect: true },
        { id: 'card2', text: 'Puppet saying hello', image: '/placeholder.svg', isCorrect: false },
        { id: 'card3', text: 'Puppet saying goodbye', image: '/placeholder.svg', isCorrect: false }
      ]
    },
    {
      id: 'sentence-builder-please',
      type: 'sentence_builder',
      prompt: '🔧 Build Polite Sentences!',
      instructions: 'Make: "Yes + please" or "No + thank + you"',
      options: [
        { id: 'build1', text: 'Yes' },
        { id: 'build2', text: 'please' },
        { id: 'build3', text: 'No' },
        { id: 'build4', text: 'thank' },
        { id: 'build5', text: 'you' }
      ]
    },
    {
      id: 'pronunciation-practice',
      type: 'pronunciation_shadow',
      prompt: '🗣️ Polite Pronunciation!',
      instructions: 'Repeat clearly: "Yes, PLEASE! No, THANK you!"',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Polite phrases pronunciation'
      }
    },
    {
      id: 'listening-responses',
      type: 'listening_comprehension',
      prompt: '👂 Listen for Responses!',
      instructions: 'What is the polite answer?',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Question asking for response'
      },
      options: [
        { id: 'response1', text: 'Yes, please!', isCorrect: true },
        { id: 'response2', text: 'Yes, goodbye!', isCorrect: false },
        { id: 'response3', text: 'Hello, please!', isCorrect: false }
      ]
    },
    {
      id: 'mcq-polite',
      type: 'accuracy_mcq',
      prompt: '❓ Choose the Polite Response!',
      instructions: 'Someone offers you candy. What do you say?',
      options: [
        { id: 'polite1', text: 'Yes, please!', isCorrect: true },
        { id: 'polite2', text: 'No, thank you!', isCorrect: true },
        { id: 'polite3', text: 'Maybe later, hello!', isCorrect: false }
      ]
    },
    {
      id: 'drag-drop-responses',
      type: 'drag_drop',
      prompt: '🎯 Drag the Right Response!',
      instructions: 'Match each question with a polite answer!',
      dragDropItems: [
        { id: 'resp-yes', text: 'Yes, please!', targetId: 'quest-want' },
        { id: 'resp-no', text: 'No, thank you!', targetId: 'quest-more' }
      ],
      dragDropTargets: [
        { 
          id: 'quest-want',
          text: 'Do you want some?',
          acceptsItemIds: ['resp-yes'],
          image: '/placeholder.svg'
        },
        { 
          id: 'quest-more',
          text: 'Do you want more?',
          acceptsItemIds: ['resp-no'],
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'letter-b-trace',
      type: 'labeling',
      prompt: '✏️ Trace Letter Bb!',
      instructions: 'Follow the dots to write the letter B!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Letter B tracing worksheet',
        imagePrompt: 'dotted line letter B for tracing practice with balloon illustration'
      }
    },
    {
      id: 'bubble-pop-b-words',
      type: 'bubble_pop',
      prompt: '🫧 Pop the "B" Words!',
      instructions: 'Pop bubbles with words that start with "B"!',
      gameConfig: {
        theme: 'ocean',
        difficulty: 'easy',
        targetScore: 6,
        soundEffects: true
      },
      vocabulary: ['balloon', 'ball', 'butterfly', 'banana', 'book', 'bird']
    },
    {
      id: 'controlled-practice-polite',
      type: 'controlled_practice',
      prompt: '🎯 Polite Practice Time!',
      instructions: 'Practice saying "Yes, please" and "No, thank you" clearly!',
      timeLimit: 30
    },
    {
      id: 'memory-polite-words',
      type: 'memory_flip',
      prompt: '🧠 Memory - Polite Words!',
      instructions: 'Find the matching polite word pairs!',
      gameConfig: {
        theme: 'forest',
        difficulty: 'easy',
        targetScore: 4,
        soundEffects: true
      },
      matchPairs: [
        { id: 'mem1', left: 'Yes', right: 'Yes' },
        { id: 'mem2', left: 'No', right: 'No' },
        { id: 'mem3', left: 'Please', right: 'Please' },
        { id: 'mem4', left: 'Thank you', right: 'Thank you' }
      ]
    },
    {
      id: 'roleplay-polite',
      type: 'roleplay_setup',
      prompt: '🎭 Polite Role-Play!',
      instructions: 'Partner A: Offer something. Partner B: Respond politely with "Yes, please" or "No, thank you"!',
      gameConfig: {
        theme: 'forest',
        difficulty: 'easy'
      }
    },
    {
      id: 'word-rain-polite',
      type: 'word_rain',
      prompt: '🌧️ Catch the Polite Words!',
      instructions: 'Catch falling words: yes, no, please, thank you!',
      gameConfig: {
        theme: 'forest',
        difficulty: 'easy',
        targetScore: 8,
        timeBonus: true
      },
      vocabulary: ['yes', 'no', 'please', 'thank', 'you']
    },
    {
      id: 'communicative-task-polite',
      type: 'communicative_task',
      prompt: '💬 Real Polite Talk!',
      instructions: 'Ask 3 classmates "Do you want...?" and respond politely!',
      timeLimit: 90
    },
    {
      id: 'chant-yes-no',
      type: 'pronunciation_shadow',
      prompt: '📢 Yes/No Chant!',
      instructions: 'Chant: "Yes, please! No, thank you! Polite words help me through!"',
      timeLimit: 25
    },
    {
      id: 'review-lesson2',
      type: 'review_consolidation',
      prompt: '⭐ Lesson 2 Complete!',
      instructions: 'We learned: Yes, No, Please, Thank you, and Letter Bb!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Lesson 2 completion celebration',
        imagePrompt: 'colorful celebration showing yes, no, please, thank you words with letter B and stars'
      }
    }
  ]
};