import { LessonSlides } from '@/types/slides';

export const placementTest2: LessonSlides = {
  version: '2.0',
  theme: 'default',
  durationMin: 25,
  total_slides: 25,
  metadata: {
    CEFR: 'A1-C2',
    module: 0,
    lesson: 0,
    targets: ['placement', 'assessment', 'level_determination'],
    weights: {
      accuracy: 80,
      fluency: 20
    }
  },
  slides: [
    // Slide 1 - Welcome Screen
    {
      id: 'welcome',
      type: 'warmup',
      prompt: 'Welcome to the English Adventure Test! 🚀',
      instructions: 'Answer questions, earn badges, and discover your level.',
      media: {
        type: 'image',
        url: 'ai-generated',
        alt: 'Cheerful explorer character with backpack, compass, and map, embarking on an adventure, colorful educational illustration',
        autoGenerate: true
      },
      audio: {
        text: 'Welcome to the English Adventure Test! Answer questions, earn badges, and discover your level.',
        autoGenerate: true
      }
    },
    
    // Slide 2 - Practice (Confidence Builder)
    {
      id: 'practice',
      type: 'drag_drop',
      prompt: 'Practice: Match words with pictures',
      instructions: 'Drag each word to its matching picture',
      dragDropItems: [
        { id: 'dog', text: 'dog', targetId: 'dog-pic' },
        { id: 'cat', text: 'cat', targetId: 'cat-pic' },
        { id: 'sun', text: 'sun', targetId: 'sun-pic' },
        { id: 'book', text: 'book', targetId: 'book-pic' }
      ],
      dragDropTargets: [
        { id: 'dog-pic', text: '🐶', acceptsItemIds: ['dog'] },
        { id: 'cat-pic', text: '🐱', acceptsItemIds: ['cat'] },
        { id: 'sun-pic', text: '☀️', acceptsItemIds: ['sun'] },
        { id: 'book-pic', text: '📖', acceptsItemIds: ['book'] }
      ]
    },

    // Slide 3 - A1 Listening
    {
      id: 'a1-listening',
      type: 'listening_comprehension',
      prompt: 'Listen and choose the correct picture',
      instructions: 'Click play and select the picture that matches what you hear',
      media: {
        type: 'image',
        url: 'ai-generated',
        alt: 'Three simple illustrations: a boy age 7, a girl, and a dog, educational style for children',
        autoGenerate: true
      },
      audio: {
        text: 'This is a boy. He is seven years old.',
        autoGenerate: true
      },
      options: [
        { id: 'boy', text: '👦 Boy', isCorrect: true },
        { id: 'girl', text: '👧 Girl', isCorrect: false },
        { id: 'dog', text: '🐶 Dog', isCorrect: false }
      ],
      correct: 'boy'
    },

    // Slide 4 - A2 Listening
    {
      id: 'a2-listening',
      type: 'listening_comprehension',
      prompt: 'Listen and choose what you hear',
      media: {
        type: 'image',
        url: 'ai-generated',
        alt: 'Girl reading a book under a tree, peaceful park scene, educational illustration',
        autoGenerate: true
      },
      audio: {
        text: 'The girl is reading under the tree.',
        autoGenerate: true
      },
      options: [
        { id: 'running', text: 'Girl running', isCorrect: false },
        { id: 'reading', text: 'Girl reading under tree', isCorrect: true },
        { id: 'boy-ball', text: 'Boy with ball', isCorrect: false }
      ],
      correct: 'reading'
    },

    // Slide 5 - B1 Listening
    {
      id: 'b1-listening',
      type: 'listening_comprehension',
      prompt: 'Listen and choose the correct time',
      media: {
        type: 'image',
        url: 'ai-generated',
        alt: 'Train station platform with clock showing different times, educational illustration',
        autoGenerate: true
      },
      audio: {
        text: 'What time is the train? The train arrives at five thirty.',
        autoGenerate: true
      },
      options: [
        { id: 'three', text: '🕒 3:00', isCorrect: false },
        { id: 'five-thirty', text: '🕔 5:30', isCorrect: true },
        { id: 'ten', text: '🕙 10:00', isCorrect: false }
      ],
      correct: 'five-thirty'
    },

    // Slide 6 - A1 Reading
    {
      id: 'a1-reading',
      type: 'accuracy_mcq',
      prompt: 'Read and answer the question',
      instructions: 'My name is Anna. I am 8.',
      media: {
        type: 'image',
        url: 'ai-generated',
        alt: 'Happy girl named Anna, age 8, smiling portrait, educational illustration',
        autoGenerate: true
      },
      audio: {
        text: 'My name is Anna. I am eight years old.',
        autoGenerate: true
      },
      options: [
        { id: 'six', text: '6', isCorrect: false },
        { id: 'eight', text: '8', isCorrect: true },
        { id: 'ten', text: '10', isCorrect: false }
      ],
      correct: 'eight'
    },

    // Slide 7 - A2 Reading
    {
      id: 'a2-reading',
      type: 'match',
      prompt: 'Read the story and match sentences to pictures',
      instructions: 'Tom wakes up at 7. He eats breakfast and goes to school at 8.',
      matchPairs: [
        { id: 'wake', left: 'wakes up', right: '🛏️' },
        { id: 'eat', left: 'eats breakfast', right: '🍽️' },
        { id: 'school', left: 'goes to school', right: '🏫' }
      ]
    },

    // Slide 8 - B1 Reading
    {
      id: 'b1-reading',
      type: 'accuracy_mcq',
      prompt: 'Read and answer the question',
      instructions: 'Maria loves swimming and cycling. She doesn\'t like basketball.',
      options: [
        { id: 'swimming', text: 'Swimming', isCorrect: false },
        { id: 'cycling', text: 'Cycling', isCorrect: false },
        { id: 'basketball', text: 'Basketball', isCorrect: true }
      ],
      correct: 'basketball'
    },

    // Slide 9 - B2 Reading
    {
      id: 'b2-reading',
      type: 'accuracy_mcq',
      prompt: 'Read the article and answer',
      instructions: 'Recycling helps reduce waste in our environment. It saves natural resources and reduces pollution. Many cities now have recycling programs to help citizens dispose of materials properly.',
      options: [
        { id: 'saves-money', text: 'Saves money', isCorrect: false },
        { id: 'reduces-waste', text: 'Reduces waste and protects environment', isCorrect: true },
        { id: 'creates-jobs', text: 'Creates new jobs', isCorrect: false }
      ],
      correct: 'reduces-waste'
    },

    // Slide 10 - A1 Grammar
    {
      id: 'a1-grammar',
      type: 'accuracy_mcq',
      prompt: 'Choose the correct word',
      instructions: 'I ___ a student.',
      options: [
        { id: 'am', text: 'am', isCorrect: true },
        { id: 'is', text: 'is', isCorrect: false },
        { id: 'are', text: 'are', isCorrect: false }
      ],
      correct: 'am'
    },

    // Slide 11 - A1 Vocabulary
    {
      id: 'a1-vocabulary',
      type: 'match',
      prompt: 'Match words with pictures',
      matchPairs: [
        { id: 'school', left: 'school', right: '🏫' },
        { id: 'apple', left: 'apple', right: '🍎' },
        { id: 'bus', left: 'bus', right: '🚌' }
      ]
    },

    // Slide 12 - A2 Grammar
    {
      id: 'a2-grammar',
      type: 'accuracy_mcq',
      prompt: 'Choose the correct past tense',
      instructions: 'Yesterday I ___ to school.',
      options: [
        { id: 'go', text: 'go', isCorrect: false },
        { id: 'goes', text: 'goes', isCorrect: false },
        { id: 'went', text: 'went', isCorrect: true }
      ],
      correct: 'went'
    },

    // Slide 13 - B1 Vocabulary
    {
      id: 'b1-vocabulary',
      type: 'match',
      prompt: 'Match synonyms',
      matchPairs: [
        { id: 'happy', left: 'happy', right: 'glad' },
        { id: 'angry', left: 'angry', right: 'mad' },
        { id: 'big', left: 'big', right: 'large' }
      ]
    },

    // Slide 14 - B2 Grammar
    {
      id: 'b2-grammar',
      type: 'cloze',
      prompt: 'Complete the conditional sentence',
      clozeText: 'If I _____ (study), I will pass the exam.',
      clozeGaps: [
        { id: 'gap1', correctAnswers: ['study'], options: ['study', 'studied', 'studying', 'will study'] }
      ]
    },

    // Slide 15 - C1 Vocabulary
    {
      id: 'c1-vocabulary',
      type: 'accuracy_mcq',
      prompt: 'Choose the most appropriate word',
      instructions: 'The scientist presented a highly ___ report.',
      options: [
        { id: 'precise', text: 'precise', isCorrect: true },
        { id: 'tiny', text: 'tiny', isCorrect: false },
        { id: 'boring', text: 'boring', isCorrect: false }
      ],
      correct: 'precise'
    },

    // Slide 16 - A2 Writing
    {
      id: 'a2-writing',
      type: 'cloze',
      prompt: 'Complete the sentences about yourself',
      clozeText: 'My name is _____. I live in _____. I like _____.',
      clozeGaps: [
        { id: 'name', correctAnswers: ['[any name]'] },
        { id: 'place', correctAnswers: ['[any place]'] },
        { id: 'hobby', correctAnswers: ['[any hobby]'] }
      ]
    },

    // Slide 17 - B1 Writing
    {
      id: 'b1-writing',
      type: 'controlled_output',
      prompt: 'Write an invitation (20-30 words)',
      instructions: 'Invite your friend to your birthday party. Include day, time, and place.'
    },

    // Slide 18 - B2 Writing
    {
      id: 'b2-writing',
      type: 'controlled_output',
      prompt: 'Write a complaint email (50 words)',
      instructions: 'Write to a shop about a broken phone you bought. Ask for replacement or refund.'
    },

    // Slide 19 - C1-C2 Writing
    {
      id: 'c1-writing',
      type: 'controlled_output',
      prompt: 'Write your opinion (80-100 words)',
      instructions: 'Should students use mobile phones in class? Give your opinion with reasons.'
    },

    // Slide 20 - C1 Reading
    {
      id: 'c1-reading',
      type: 'accuracy_mcq',
      prompt: 'Read the academic text and answer',
      instructions: 'Climate change represents one of the most significant challenges facing humanity. Scientific evidence overwhelmingly demonstrates that rising global temperatures are primarily caused by human activities, particularly the emission of greenhouse gases from fossil fuel combustion.',
      options: [
        { id: 'natural', text: 'Climate change is natural', isCorrect: false },
        { id: 'human-caused', text: 'Climate change is caused by human activity', isCorrect: true },
        { id: 'unclear', text: 'The cause is unclear', isCorrect: false }
      ],
      correct: 'human-caused'
    },

    // Slide 21 - C1 Listening
    {
      id: 'c1-listening',
      type: 'listening_comprehension',
      prompt: 'Listen to the lecture and answer',
      media: {
        type: 'image',
        url: 'ai-generated',
        alt: 'Teenager using smartphone at night with moon visible, educational illustration about sleep patterns',
        autoGenerate: true
      },
      audio: {
        text: 'Recent studies show that social media usage among teenagers significantly affects their sleep patterns. The blue light from screens and constant notifications disrupt the natural sleep cycle.',
        autoGenerate: true
      },
      options: [
        { id: 'addiction', text: 'It causes addiction', isCorrect: false },
        { id: 'sleep', text: 'It affects sleep patterns', isCorrect: true },
        { id: 'grades', text: 'It improves grades', isCorrect: false }
      ],
      correct: 'sleep'
    },

    // Slide 22 - C2 Grammar
    {
      id: 'c2-grammar',
      type: 'sentence_builder',
      prompt: 'Reorder the words to make a correct sentence',
      instructions: 'Use all the words to create a grammatically correct sentence',
      options: [
        { id: 'rarely', text: 'Rarely' },
        { id: 'he', text: 'he' },
        { id: 'seen', text: 'seen' },
        { id: 'such', text: 'such' },
        { id: 'has', text: 'has' },
        { id: 'brilliance', text: 'brilliance' }
      ],
      correct: ['Rarely', 'has', 'he', 'seen', 'such', 'brilliance']
    },

    // Slide 23 - C2 Vocabulary
    {
      id: 'c2-vocabulary',
      type: 'accuracy_mcq',
      prompt: 'Choose the correct collocation',
      instructions: 'Deeply ___',
      options: [
        { id: 'concerned', text: 'concerned', isCorrect: true },
        { id: 'water', text: 'water', isCorrect: false },
        { id: 'colorful', text: 'colorful', isCorrect: false }
      ],
      correct: 'concerned'
    },

    // Slide 24 - Results Calculation (Hidden)
    {
      id: 'calculation',
      type: 'review_consolidation',
      prompt: 'Calculating your results...',
      instructions: 'Please wait while we analyze your performance.'
    },

    // Slide 25 - Placement Report
    {
      id: 'results',
      type: 'exit_check',
      prompt: '🎉 Congratulations! Your Results:',
      instructions: 'Based on your performance, here is your English level and recommendations.'
    }
  ]
};