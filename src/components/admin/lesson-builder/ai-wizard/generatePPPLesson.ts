import { v4 as uuidv4 } from 'uuid';
import { WizardFormData, GeneratedSlide, PPPLessonPlan } from './types';

// Topic-specific vocabulary maps for common lesson topics
const topicVocabulary: Record<string, string[]> = {
  'zoo animals': ['elephant', 'lion', 'giraffe', 'monkey'],
  'solar system': ['mars', 'jupiter', 'saturn', 'moon'],
  'food': ['apple', 'pizza', 'bread', 'cheese'],
  'weather': ['sun', 'rain', 'cloud', 'snow'],
  'transportation': ['car', 'bus', 'airplane', 'train'],
  'family': ['mother', 'father', 'sister', 'brother'],
  'colors': ['red', 'blue', 'green', 'yellow'],
  'body parts': ['head', 'hand', 'foot', 'eye'],
  'classroom': ['desk', 'book', 'pencil', 'teacher'],
  'sports': ['soccer', 'basketball', 'tennis', 'swimming'],
};

// Get vocabulary words for a topic
function getVocabularyForTopic(topic: string): string[] {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Check if we have predefined vocabulary
  for (const [key, words] of Object.entries(topicVocabulary)) {
    if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
      return words.slice(0, 3); // Return first 3 words
    }
  }
  
  // Generate generic vocabulary based on topic words
  const topicWords = normalizedTopic.split(' ').filter(w => w.length > 2);
  if (topicWords.length >= 3) {
    return topicWords.slice(0, 3);
  }
  
  // Default vocabulary items related to the topic
  return [
    `${normalizedTopic} item 1`,
    `${normalizedTopic} item 2`,
    `${normalizedTopic} item 3`,
  ];
}

// Build Unsplash URL with style modifications based on age group
function buildImageUrl(keyword: string, ageGroup: string): string {
  let styleKeywords = '';
  
  switch (ageGroup) {
    case 'kids':
      styleKeywords = ',illustration,cartoon,colorful';
      break;
    case 'teens':
      styleKeywords = ',modern,vibrant';
      break;
    case 'adults':
      styleKeywords = ',professional,minimal';
      break;
  }
  
  const searchQuery = encodeURIComponent(`${keyword}${styleKeywords}`);
  return `https://source.unsplash.com/1600x900/?${searchQuery}`;
}

// Generate vocabulary definitions
function getDefinition(word: string): string {
  const definitions: Record<string, string> = {
    elephant: 'A very large animal with a long trunk and big ears',
    lion: 'A large wild cat with golden fur',
    giraffe: 'The tallest animal with a very long neck',
    monkey: 'A clever animal that climbs trees',
    mars: 'The red planet, fourth from the sun',
    jupiter: 'The largest planet in our solar system',
    saturn: 'A planet famous for its beautiful rings',
    moon: 'Earth\'s natural satellite that shines at night',
  };
  
  return definitions[word.toLowerCase()] || `A ${word} - learn more about this in class!`;
}

// Generate a sample sentence with blank
function getSentenceWithBlank(word: string): { sentence: string; blankWord: string } {
  const sentences: Record<string, string> = {
    elephant: 'The ____ has a long trunk and big ears.',
    lion: 'The ____ is called the king of the jungle.',
    giraffe: 'The ____ has a very long neck.',
    monkey: 'The ____ loves to climb trees.',
    mars: '____ is called the Red Planet.',
    jupiter: '____ is the biggest planet in our solar system.',
    saturn: '____ has beautiful rings around it.',
    moon: 'The ____ shines bright at night.',
  };
  
  return {
    sentence: sentences[word.toLowerCase()] || `The ____ is very interesting to learn about.`,
    blankWord: word,
  };
}

// Generate quiz question based on vocabulary
function generateQuizQuestion(vocabulary: string[], topic: string): {
  question: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer: string;
} {
  const word = vocabulary[0];
  
  // Topic-specific questions
  const questions: Record<string, { q: string; correct: string; wrong: string[] }> = {
    mars: { q: 'Which planet is red?', correct: 'Mars', wrong: ['Jupiter', 'Saturn', 'Venus'] },
    elephant: { q: 'Which animal has a long trunk?', correct: 'Elephant', wrong: ['Lion', 'Giraffe', 'Monkey'] },
    lion: { q: 'Which animal is called the king of the jungle?', correct: 'Lion', wrong: ['Elephant', 'Tiger', 'Bear'] },
    jupiter: { q: 'Which is the largest planet?', correct: 'Jupiter', wrong: ['Mars', 'Earth', 'Saturn'] },
  };
  
  const questionData = questions[word.toLowerCase()] || {
    q: `What did we learn about ${topic}?`,
    correct: vocabulary[0],
    wrong: ['Option A', 'Option B', 'Option C'],
  };
  
  const options = [
    { text: questionData.correct, isCorrect: true },
    ...questionData.wrong.map(w => ({ text: w, isCorrect: false })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    question: questionData.q,
    options,
    correctAnswer: questionData.correct,
  };
}

export function generatePPPLesson(formData: WizardFormData): PPPLessonPlan {
  const { topic, level, ageGroup } = formData;
  const vocabulary = getVocabularyForTopic(topic);
  const slides: GeneratedSlide[] = [];
  let order = 0;

  // ========== PHASE 1: PRESENTATION (Intro) ==========
  
  // Slide 1: Title Card
  slides.push({
    id: uuidv4(),
    order: order++,
    phase: 'presentation',
    phaseLabel: 'Presentation',
    type: 'title',
    title: `Let's Learn About ${topic}!`,
    imageUrl: buildImageUrl(topic, ageGroup),
    imageKeywords: topic,
    teacherNotes: `Welcome students to today's lesson about ${topic}. Start with an engaging question to activate prior knowledge.`,
    keywords: [topic, 'introduction', 'warm-up'],
  });
  
  // Slides 2-4: Vocabulary Slides
  vocabulary.forEach((word, index) => {
    slides.push({
      id: uuidv4(),
      order: order++,
      phase: 'presentation',
      phaseLabel: 'Presentation',
      type: 'vocabulary',
      title: word.charAt(0).toUpperCase() + word.slice(1),
      imageUrl: buildImageUrl(word, ageGroup),
      imageKeywords: word,
      content: {
        word: word.charAt(0).toUpperCase() + word.slice(1),
        definition: getDefinition(word),
      },
      teacherNotes: `Introduce "${word}" - have students repeat the word 3 times. Ask if anyone has seen a ${word} before.`,
      keywords: [word, 'vocabulary', topic],
    });
  });

  // ========== PHASE 2: PRACTICE (Interactive) ==========
  
  // Slide 5: Matching Game
  slides.push({
    id: uuidv4(),
    order: order++,
    phase: 'practice',
    phaseLabel: 'Practice',
    type: 'matching',
    title: 'Matching Game',
    imageUrl: buildImageUrl(`${topic} collage`, ageGroup),
    imageKeywords: `${topic} collage`,
    content: {
      matchPairs: vocabulary.slice(0, 3).map(word => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        image: buildImageUrl(word, ageGroup),
      })),
    },
    teacherNotes: 'Interactive matching activity - students match words to pictures. Can be done individually or in pairs.',
    keywords: ['matching', 'game', 'practice', topic],
  });
  
  // Slide 6: Fill in the Blank
  const blankData = getSentenceWithBlank(vocabulary[0]);
  slides.push({
    id: uuidv4(),
    order: order++,
    phase: 'practice',
    phaseLabel: 'Practice',
    type: 'fill-blank',
    title: 'Fill in the Blank',
    imageUrl: buildImageUrl(vocabulary[0], ageGroup),
    imageKeywords: vocabulary[0],
    content: {
      sentence: blankData.sentence,
      blankWord: blankData.blankWord,
    },
    teacherNotes: `Students complete the sentence. The answer is "${blankData.blankWord}". Encourage full sentence responses.`,
    keywords: ['fill-blank', 'writing', 'practice', topic],
  });

  // ========== PHASE 3: PRODUCTION (Speaking) ==========
  
  // Slide 7: Roleplay/Speaking Scenario
  slides.push({
    id: uuidv4(),
    order: order++,
    phase: 'production',
    phaseLabel: 'Production',
    type: 'roleplay',
    title: 'Speaking Activity',
    imageUrl: buildImageUrl(`${topic} scene`, ageGroup),
    imageKeywords: `${topic} scene`,
    content: {
      prompt: `Look at the picture and describe what you see. Use the words we learned: ${vocabulary.join(', ')}.`,
    },
    teacherNotes: 'Production phase - students speak freely using target vocabulary. Provide scaffolding as needed. Focus on fluency over accuracy.',
    keywords: ['speaking', 'production', 'fluency', topic],
  });

  // Bonus: Quiz slide
  const quizData = generateQuizQuestion(vocabulary, topic);
  slides.push({
    id: uuidv4(),
    order: order++,
    phase: 'production',
    phaseLabel: 'Production',
    type: 'quiz',
    title: 'Quick Quiz',
    imageUrl: buildImageUrl('quiz question mark', ageGroup),
    imageKeywords: 'quiz',
    content: {
      quizQuestion: quizData.question,
      quizOptions: quizData.options,
    },
    teacherNotes: `Quiz question to check understanding. Correct answer: ${quizData.correctAnswer}`,
    keywords: ['quiz', 'assessment', topic],
  });

  return {
    topic,
    level,
    ageGroup,
    slides,
    generatedAt: new Date().toISOString(),
  };
}
