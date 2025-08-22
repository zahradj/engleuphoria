import { LessonSlides } from '@/types/slides';

export const sampleInteractiveSlides: LessonSlides = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 15,
  slides: [
    {
      id: 'intro-1',
      type: 'warmup',
      prompt: 'Welcome to Interactive Learning!',
      instructions: 'Today we will practice vocabulary with fun activities.',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500',
        alt: 'Students learning together',
        imagePrompt: 'Diverse group of students learning English in a bright classroom'
      }
    },
    {
      id: 'match-animals',
      type: 'match',
      prompt: 'Match the Animals with Their Sounds',
      instructions: 'Connect each animal with the sound it makes.',
      matchPairs: [
        {
          id: 'cat',
          left: 'Cat',
          right: 'Meow',
          leftImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200',
          rightImage: undefined
        },
        {
          id: 'dog',
          left: 'Dog', 
          right: 'Woof',
          leftImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
          rightImage: undefined
        },
        {
          id: 'cow',
          left: 'Cow',
          right: 'Moo',
          leftImage: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=200',
          rightImage: undefined
        },
        {
          id: 'bird',
          left: 'Bird',
          right: 'Tweet',
          leftImage: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200',
          rightImage: undefined
        }
      ],
      timeLimit: 120
    },
    {
      id: 'drag-rooms',
      type: 'drag_drop',
      prompt: 'Sort Items by Room',
      instructions: 'Drag each item to the correct room where you would typically find it.',
      dragDropItems: [
        { id: 'bed', text: 'Bed', targetId: 'bedroom' },
        { id: 'stove', text: 'Stove', targetId: 'kitchen' },
        { id: 'sofa', text: 'Sofa', targetId: 'living-room' },
        { id: 'shower', text: 'Shower', targetId: 'bathroom' },
        { id: 'fridge', text: 'Refrigerator', targetId: 'kitchen' },
        { id: 'tv', text: 'Television', targetId: 'living-room' }
      ],
      dragDropTargets: [
        {
          id: 'bedroom',
          text: 'Bedroom',
          acceptsItemIds: ['bed'],
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100'
        },
        {
          id: 'kitchen', 
          text: 'Kitchen',
          acceptsItemIds: ['stove', 'fridge'],
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100'
        },
        {
          id: 'living-room',
          text: 'Living Room', 
          acceptsItemIds: ['sofa', 'tv'],
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100'
        },
        {
          id: 'bathroom',
          text: 'Bathroom',
          acceptsItemIds: ['shower'],
          image: 'https://images.unsplash.com/photo-1584622781564-1d987db7c1a2?w=100'
        }
      ],
      timeLimit: 180
    },
    {
      id: 'cloze-story',
      type: 'cloze',
      prompt: 'Complete the Story',
      instructions: 'Fill in the gaps with the correct words to complete the story.',
      clozeText: 'Yesterday, I [gap1] to the park with my [gap2]. The weather was [gap3] and sunny. We [gap4] on the grass and had a [gap5]. Many families were [gap6] the same thing. It was a [gap7] day!',
      clozeGaps: [
        {
          id: 'gap1',
          correctAnswers: ['went', 'walked'],
          options: ['went', 'go', 'goes', 'going']
        },
        {
          id: 'gap2', 
          correctAnswers: ['family', 'friends', 'dog', 'cat'],
          options: ['family', 'friends', 'teacher', 'book']
        },
        {
          id: 'gap3',
          correctAnswers: ['warm', 'nice', 'beautiful'],
          options: ['warm', 'cold', 'rainy', 'snowy']
        },
        {
          id: 'gap4',
          correctAnswers: ['sat', 'played'],
          options: ['sat', 'stand', 'jump', 'run']
        },
        {
          id: 'gap5',
          correctAnswers: ['picnic', 'lunch'],
          options: ['picnic', 'dinner', 'breakfast', 'snack']
        },
        {
          id: 'gap6',
          correctAnswers: ['doing'],
          options: ['doing', 'making', 'having', 'getting']
        },
        {
          id: 'gap7',
          correctAnswers: ['wonderful', 'great', 'perfect', 'amazing'],
          options: ['wonderful', 'terrible', 'boring', 'sad']
        }
      ],
      timeLimit: 300
    },
    {
      id: 'mcq-practice',
      type: 'accuracy_mcq',
      prompt: 'Choose the Correct Answer',
      instructions: 'Select the best option to complete the sentence.',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
        alt: 'Person thinking',
        imagePrompt: 'Person thinking with question marks around them'
      },
      options: [
        { id: 'a', text: 'She is going to the library.', isCorrect: true },
        { id: 'b', text: 'She are going to the library.', isCorrect: false },
        { id: 'c', text: 'She go to the library.', isCorrect: false },
        { id: 'd', text: 'She going to the library.', isCorrect: false }
      ],
      correct: 'a',
      timeLimit: 60
    },
    {
      id: 'review',
      type: 'review_consolidation', 
      prompt: 'Great Job!',
      instructions: 'You have completed all the interactive activities. Remember to practice these words and patterns in real conversations.',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        alt: 'Celebration',
        imagePrompt: 'Celebration with confetti and happy people learning'
      }
    }
  ],
  metadata: {
    CEFR: 'A2',
    module: 1,
    lesson: 3,
    targets: ['vocabulary matching', 'room items', 'past tense', 'sentence completion'],
    weights: {
      accuracy: 70,
      fluency: 30
    }
  }
};