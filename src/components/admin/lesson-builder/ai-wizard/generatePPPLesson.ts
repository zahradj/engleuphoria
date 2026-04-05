import { v4 as uuidv4 } from 'uuid';
import { WizardFormData, GeneratedSlide, PPPLessonPlan } from './types';

/* ──────────────────────────────────────────────────
   Topic-specific content banks
   ────────────────────────────────────────────────── */

interface VocabEntry {
  word: string;
  definition: string;
  exampleSentence: string;
  fillBlank: string;
  imageKeywords: string;
}

interface TopicPack {
  vocabulary: VocabEntry[];
  grammarTarget: string;
  grammarExamples: string[];
  warmUpQuestion: string;
  objectives: string[];
  dialogueLines: string[];
  gameDescription: string;
  productionTask: string;
  songOrChant: string;
}

const TOPIC_PACKS: Record<string, TopicPack> = {
  'hello pip': {
    vocabulary: [
      { word: 'Hello', definition: 'A greeting you say when you meet someone', exampleSentence: 'Hello! My name is Pip.', fillBlank: '____! My name is Pip.', imageKeywords: 'kids waving hello cartoon' },
      { word: 'Name', definition: 'What people call you', exampleSentence: 'My name is Anna.', fillBlank: 'My ____ is Anna.', imageKeywords: 'name tag cartoon kids' },
      { word: 'Friend', definition: 'Someone you like and play with', exampleSentence: 'Pip is my friend.', fillBlank: 'Pip is my ____.', imageKeywords: 'kids friends cartoon' },
      { word: 'Goodbye', definition: 'What you say when you leave', exampleSentence: 'Goodbye! See you tomorrow!', fillBlank: '____! See you tomorrow!', imageKeywords: 'kids waving goodbye cartoon' },
    ],
    grammarTarget: 'I am / You are (To Be)',
    grammarExamples: ['I am Pip.', 'You are my friend.', 'I am happy.', 'You are great!'],
    warmUpQuestion: 'Can you wave and say "Hello" to Pip? 👋',
    objectives: [
      'Greet others using "Hello" and "Goodbye"',
      'Introduce themselves: "My name is ___"',
      'Use "I am" and "You are" in simple sentences',
      'Identify and say 4 new vocabulary words',
    ],
    dialogueLines: [
      'Pip: Hello! I am Pip! 🐣',
      'Student: Hello! I am ___!',
      'Pip: What is your name?',
      'Student: My name is ___.',
      'Pip: Nice to meet you! You are my friend!',
      'Student: You are my friend too!',
    ],
    gameDescription: 'Name Ball Toss: Students toss a soft ball. When you catch it, say "Hello! My name is ___" and toss to the next friend.',
    productionTask: 'Draw a picture of yourself and Pip. Write "Hello! My name is ___. I am ___." under your drawing.',
    songOrChant: '🎵 Hello, hello, what\'s your name?\nHello, hello, let\'s play a game!\nI am ___, you are ___,\nWe are friends, let\'s all have fun! 🎵',
  },
};

function getDefaultTopicPack(topic: string, level: string, ageGroup: string): TopicPack {
  const words = topic.split(' ').filter(w => w.length > 2);
  const mainWord = words[0] || topic;

  return {
    vocabulary: [
      { word: mainWord.charAt(0).toUpperCase() + mainWord.slice(1), definition: `A key word about ${topic}`, exampleSentence: `I like ${mainWord}.`, fillBlank: `I like ____.`, imageKeywords: `${topic} cartoon illustration` },
      { word: 'Learn', definition: 'To get new knowledge', exampleSentence: `Let's learn about ${topic}!`, fillBlank: `Let's ____ about ${topic}!`, imageKeywords: 'kids learning cartoon' },
      { word: 'Fun', definition: 'Something enjoyable', exampleSentence: `${topic} is fun!`, fillBlank: `${topic} is ____!`, imageKeywords: 'kids having fun cartoon' },
      { word: 'Great', definition: 'Very good, wonderful', exampleSentence: 'You did a great job!', fillBlank: 'You did a ____ job!', imageKeywords: 'thumbs up cartoon kids' },
    ],
    grammarTarget: level === 'beginner' ? 'I am / You are' : 'Simple Present',
    grammarExamples: [`I like ${topic}.`, `You are learning about ${topic}.`, `This is a ${mainWord}.`],
    warmUpQuestion: `What do you know about ${topic}? Tell Pip! 🐣`,
    objectives: [
      `Learn 4 new words about ${topic}`,
      `Use simple sentences about ${topic}`,
      `Practice speaking with a partner`,
      `Complete a fun activity about ${topic}`,
    ],
    dialogueLines: [
      `Pip: Today we learn about ${topic}! 🐣`,
      `Student: I like ${topic}!`,
      `Pip: What is your favorite ${mainWord}?`,
      `Student: My favorite is ___.`,
    ],
    gameDescription: `Point & Say: Teacher shows pictures about ${topic}. Students point and say the word as fast as they can!`,
    productionTask: `Draw your favorite thing about ${topic} and tell the class about it using "I like ___" and "This is a ___."`,
    songOrChant: `🎵 ${topic}, ${topic}, let's have fun!\n${topic}, ${topic}, everyone!\nI can say it, you can too,\n${topic}, ${topic}, me and you! 🎵`,
  };
}

function getTopicPack(topic: string, level: string, ageGroup: string): TopicPack {
  const key = topic.toLowerCase().trim();
  return TOPIC_PACKS[key] || getDefaultTopicPack(topic, level, ageGroup);
}

/* ──────────────────────────────────────────────────
   Image URL helper (picsum with deterministic seeds)
   ────────────────────────────────────────────────── */

function buildImageUrl(keyword: string): string {
  const seed = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://picsum.photos/seed/${seed}/1600/900`;
}

/* ──────────────────────────────────────────────────
   Main generator — Produces 20-25 structured slides
   following the PPP (Presentation-Practice-Production)
   methodology with proper objectives and layout
   ────────────────────────────────────────────────── */

export function generatePPPLesson(formData: WizardFormData): PPPLessonPlan {
  const { topic, level, ageGroup } = formData;
  const pack = getTopicPack(topic, level, ageGroup);
  const slides: GeneratedSlide[] = [];
  let order = 0;

  const cefrMap: Record<string, string> = { beginner: 'Pre-A1 / A1', intermediate: 'B1', advanced: 'C1' };
  const cefrLevel = cefrMap[level] || 'A1';

  // ═══════════════════════════════════════════════════
  // WARM-UP (Slides 1-3)
  // ═══════════════════════════════════════════════════

  // 1. Title Slide
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '🎬 Welcome',
    type: 'title',
    title: `Let's Learn: ${topic}!`,
    imageUrl: buildImageUrl(`${topic} kids colorful`),
    imageKeywords: `${topic} kids`,
    teacherNotes: 'Welcome students warmly. Play upbeat music as they settle in. Introduce the lesson topic with enthusiasm.',
    keywords: [topic, 'introduction'],
  });

  // 2. Objectives Slide
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '🎯 Objectives',
    type: 'title',
    title: '🎯 Today We Will Learn...',
    imageUrl: buildImageUrl('learning objectives checklist'),
    imageKeywords: 'objectives checklist',
    content: {
      prompt: pack.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n'),
    },
    teacherNotes: `Read each objective aloud. Use gestures to illustrate meaning. Level: ${cefrLevel}. Duration: 30 minutes.`,
    keywords: ['objectives', 'goals'],
  });

  // 3. Warm-Up Activity
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '☀️ Warm-Up',
    type: 'roleplay',
    title: '☀️ Warm-Up Time!',
    imageUrl: buildImageUrl('kids warm up activity fun'),
    imageKeywords: 'warm-up fun',
    content: { prompt: pack.warmUpQuestion },
    teacherNotes: 'Get students talking! Ask the warm-up question. Accept all answers. Build excitement for the lesson. Use TPR (Total Physical Response).',
    keywords: ['warm-up', 'activation'],
  });

  // ═══════════════════════════════════════════════════
  // PRESENTATION PHASE (Slides 4-11): Introduce vocabulary & grammar
  // ═══════════════════════════════════════════════════

  // 4. Meet Pip / Topic Introduction
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '📖 Presentation',
    type: 'title',
    title: `🐣 Meet Pip!`,
    imageUrl: buildImageUrl('cute baby chick mascot cartoon'),
    imageKeywords: 'pip mascot chick',
    content: { prompt: 'Say hello to Pip! Pip will help us learn today! 🐣✨' },
    teacherNotes: 'Introduce Pip the mascot. Have students wave and say "Hello Pip!" Use Pip puppet/image throughout the lesson.',
    keywords: ['pip', 'mascot', 'introduction'],
  });

  // 5-8. Vocabulary Slides (one per word)
  pack.vocabulary.forEach((vocab, idx) => {
    slides.push({
      id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '📖 Presentation',
      type: 'vocabulary',
      title: `📝 New Word ${idx + 1}: ${vocab.word}`,
      imageUrl: buildImageUrl(vocab.imageKeywords),
      imageKeywords: vocab.imageKeywords,
      content: {
        word: vocab.word,
        definition: vocab.definition,
        sentence: vocab.exampleSentence,
      },
      teacherNotes: `Teach "${vocab.word}": 1) Show the image. 2) Say the word 3 times (students repeat). 3) Explain: "${vocab.definition}". 4) Practice sentence: "${vocab.exampleSentence}". Use gestures and TPR.`,
      keywords: [vocab.word.toLowerCase(), 'vocabulary'],
    });
  });

  // 9. Vocabulary Review — Quick Flash
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '📖 Presentation',
    type: 'image',
    title: '⚡ Quick Flash Review!',
    imageUrl: buildImageUrl('flashcard review game kids'),
    imageKeywords: 'flashcard review',
    content: {
      prompt: `Flash each word:\n${pack.vocabulary.map(v => `• ${v.word}`).join('\n')}\n\nStudents shout the word as fast as they can!`,
    },
    teacherNotes: 'Show each word image quickly. Students call out the word. Speed up each round. This builds automaticity and is fun for kids!',
    keywords: ['review', 'flashcards'],
  });

  // 10. Grammar Target Slide
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '📖 Presentation',
    type: 'title',
    title: `🎯 Grammar: ${pack.grammarTarget}`,
    imageUrl: buildImageUrl('grammar rules kids colorful'),
    imageKeywords: 'grammar rules',
    content: {
      prompt: pack.grammarExamples.map(ex => `• ${ex}`).join('\n'),
    },
    teacherNotes: `Teach the grammar pattern "${pack.grammarTarget}". Use the board to show the structure. Practice with choral drilling. Point to students for "You are" and yourself for "I am".`,
    keywords: ['grammar', pack.grammarTarget.toLowerCase()],
  });

  // 11. Song / Chant
  slides.push({
    id: uuidv4(), order: order++, phase: 'presentation', phaseLabel: '📖 Presentation',
    type: 'image',
    title: '🎵 Let\'s Sing!',
    imageUrl: buildImageUrl('kids singing music classroom cartoon'),
    imageKeywords: 'kids singing',
    content: { prompt: pack.songOrChant },
    teacherNotes: 'Sing/chant together 2-3 times. Add clapping or actions. This reinforces vocabulary and grammar through music — great for young learners!',
    keywords: ['song', 'chant', 'music'],
  });

  // ═══════════════════════════════════════════════════
  // PRACTICE PHASE (Slides 12-18): Controlled & guided practice
  // ═══════════════════════════════════════════════════

  // 12. Dialogue Practice
  slides.push({
    id: uuidv4(), order: order++, phase: 'practice', phaseLabel: '✏️ Practice',
    type: 'roleplay',
    title: '💬 Dialogue with Pip',
    imageUrl: buildImageUrl('kids talking dialogue cartoon'),
    imageKeywords: 'dialogue practice',
    content: { prompt: pack.dialogueLines.join('\n') },
    teacherNotes: 'Model the dialogue with Pip. Then students practice in pairs. Walk around and listen. Correct gently. Praise effort!',
    keywords: ['dialogue', 'speaking', 'practice'],
  });

  // 13-14. Fill in the Blank (one per vocab word pair)
  pack.vocabulary.slice(0, 2).forEach((vocab, idx) => {
    slides.push({
      id: uuidv4(), order: order++, phase: 'practice', phaseLabel: '✏️ Practice',
      type: 'fill-blank',
      title: `✏️ Fill the Gap ${idx + 1}`,
      imageUrl: buildImageUrl(vocab.imageKeywords),
      imageKeywords: vocab.imageKeywords,
      content: {
        sentence: vocab.fillBlank,
        blankWord: vocab.word,
      },
      teacherNotes: `Students complete: "${vocab.fillBlank}" → Answer: "${vocab.word}". Read the sentence aloud first. Have students write/say the answer.`,
      keywords: ['fill-blank', vocab.word.toLowerCase()],
    });
  });

  // 15. Matching Activity
  slides.push({
    id: uuidv4(), order: order++, phase: 'practice', phaseLabel: '✏️ Practice',
    type: 'matching',
    title: '🔗 Match the Words!',
    imageUrl: buildImageUrl('matching game kids activity'),
    imageKeywords: 'matching game',
    content: {
      matchPairs: pack.vocabulary.map(v => ({
        word: v.word,
        image: buildImageUrl(v.imageKeywords),
      })),
    },
    teacherNotes: 'Students match each word to the correct picture. Can be done on the board, with cards, or on screen. Time it for excitement!',
    keywords: ['matching', 'game', 'practice'],
  });

  // 16. Sorting Activity
  slides.push({
    id: uuidv4(), order: order++, phase: 'practice', phaseLabel: '✏️ Practice',
    type: 'image',
    title: '📦 Sort It Out!',
    imageUrl: buildImageUrl('sorting activity kids categories'),
    imageKeywords: 'sorting categories',
    content: {
      prompt: `Sort these into the right category:\n\n"I am ___" vs "You are ___"\n\n${pack.grammarExamples.map(e => `• ${e}`).join('\n')}`,
    },
    teacherNotes: 'Students categorize sentences by "I am" or "You are". Use two columns on the board. Students come up and place sentences.',
    keywords: ['sorting', 'grammar', 'practice'],
  });

  // 17. Game Slide
  slides.push({
    id: uuidv4(), order: order++, phase: 'practice', phaseLabel: '🎮 Game Time',
    type: 'roleplay',
    title: '🎮 Game Time!',
    imageUrl: buildImageUrl('kids playing game classroom fun'),
    imageKeywords: 'classroom game',
    content: { prompt: pack.gameDescription },
    teacherNotes: `Game: ${pack.gameDescription}\n\nKeep energy high! Give points or stickers. Make sure every student participates at least once.`,
    keywords: ['game', 'activity', 'fun'],
  });

  // 18. Quiz — Check Understanding
  const quizWord = pack.vocabulary[0];
  slides.push({
    id: uuidv4(), order: order++, phase: 'practice', phaseLabel: '✏️ Practice',
    type: 'quiz',
    title: '❓ Quick Quiz!',
    imageUrl: buildImageUrl('quiz question kids cartoon'),
    imageKeywords: 'quiz question',
    content: {
      quizQuestion: `What does "${quizWord.word}" mean?`,
      quizOptions: [
        { text: quizWord.definition, isCorrect: true },
        { text: 'A type of food', isCorrect: false },
        { text: 'A color', isCorrect: false },
        { text: 'A number', isCorrect: false },
      ].sort(() => Math.random() - 0.5),
    },
    teacherNotes: `Quiz to check comprehension. Correct answer: "${quizWord.definition}". Celebrate correct answers! Gently guide wrong answers.`,
    keywords: ['quiz', 'assessment'],
  });

  // ═══════════════════════════════════════════════════
  // PRODUCTION PHASE (Slides 19-23): Free practice & creative output
  // ═══════════════════════════════════════════════════

  // 19. Speaking Practice — Roleplay
  slides.push({
    id: uuidv4(), order: order++, phase: 'production', phaseLabel: '🎤 Production',
    type: 'roleplay',
    title: '🎤 Your Turn to Talk!',
    imageUrl: buildImageUrl('kids presenting speaking classroom'),
    imageKeywords: 'kids speaking',
    content: {
      prompt: `Use these words to talk to your partner:\n${pack.vocabulary.map(v => `✅ ${v.word}`).join('\n')}\n\nTry to use "${pack.grammarTarget}" in your sentences!`,
    },
    teacherNotes: 'Free speaking practice. Students work in pairs using all target vocabulary and grammar. Monitor and note common errors for feedback.',
    keywords: ['speaking', 'production', 'fluency'],
  });

  // 20. Creative Task
  slides.push({
    id: uuidv4(), order: order++, phase: 'production', phaseLabel: '🎤 Production',
    type: 'image',
    title: '🎨 Creative Time!',
    imageUrl: buildImageUrl('kids drawing creative art classroom'),
    imageKeywords: 'kids creating art',
    content: { prompt: pack.productionTask },
    teacherNotes: `Production task: ${pack.productionTask}\n\nGive students 5-7 minutes. Walk around and help with writing. Ask students to share their work.`,
    keywords: ['creative', 'production', 'writing'],
  });

  // 21. Show & Tell
  slides.push({
    id: uuidv4(), order: order++, phase: 'production', phaseLabel: '🎤 Production',
    type: 'roleplay',
    title: '🌟 Show & Tell!',
    imageUrl: buildImageUrl('kids show and tell classroom'),
    imageKeywords: 'show and tell',
    content: { prompt: 'Stand up and share your work with the class!\n\nStart with: "Hello! My name is ___. I am ___."' },
    teacherNotes: 'Students present their creative work. Encourage full sentences. Clap after each presentation. Give feedback and stars/stickers.',
    keywords: ['presentation', 'speaking', 'production'],
  });

  // 22. Review & Wrap-Up
  slides.push({
    id: uuidv4(), order: order++, phase: 'production', phaseLabel: '📋 Review',
    type: 'title',
    title: '📋 What Did We Learn?',
    imageUrl: buildImageUrl('review checklist kids learning'),
    imageKeywords: 'review learning',
    content: {
      prompt: pack.objectives.map((o, i) => `${i + 1}. ✅ ${o}`).join('\n'),
    },
    teacherNotes: 'Review each objective. Ask students: "Can you do this now?" Thumbs up/down. Celebrate their progress!',
    keywords: ['review', 'assessment', 'objectives'],
  });

  // 23. Self-Assessment
  slides.push({
    id: uuidv4(), order: order++, phase: 'production', phaseLabel: '📋 Review',
    type: 'quiz',
    title: '⭐ How Did You Do?',
    imageUrl: buildImageUrl('self assessment stars kids'),
    imageKeywords: 'self assessment',
    content: {
      quizQuestion: 'How well did you learn today?',
      quizOptions: [
        { text: '⭐⭐⭐ I can do it perfectly!', isCorrect: true },
        { text: '⭐⭐ I can do it with some help', isCorrect: true },
        { text: '⭐ I need more practice', isCorrect: true },
      ],
    },
    teacherNotes: 'Self-assessment: all answers are valid. This builds metacognition. Note students who chose ⭐ for extra support next time.',
    keywords: ['self-assessment', 'reflection'],
  });

  // 24. Goodbye Slide
  slides.push({
    id: uuidv4(), order: order++, phase: 'production', phaseLabel: '👋 Goodbye',
    type: 'title',
    title: '👋 Great Job! See You Next Time!',
    imageUrl: buildImageUrl('kids waving goodbye happy cartoon'),
    imageKeywords: 'goodbye kids',
    content: { prompt: `Goodbye, everyone! You are AMAZING! 🌟\n\nPip says: "See you next time, friends!" 🐣💛` },
    teacherNotes: 'Celebrate the lesson! High-fives, stickers, or stamps. Remind them of homework if any. Sing the goodbye song.',
    keywords: ['goodbye', 'celebration'],
  });

  return {
    topic,
    level,
    ageGroup,
    slides,
    generatedAt: new Date().toISOString(),
  };
}
