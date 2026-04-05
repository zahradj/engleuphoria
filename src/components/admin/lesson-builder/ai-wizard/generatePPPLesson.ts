import { v4 as uuidv4 } from 'uuid';
import { WizardFormData, GeneratedSlide, PPPLessonPlan, HubType, SlideVisuals, SlideInteraction, AnimationType } from './types';
import { HUB_CONFIGS, resolveHub, HubConfig } from './hubConfig';

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

/* ── Hub-specific topic packs ── */

const PLAYGROUND_TOPICS: Record<string, TopicPack> = {
  'hello pip': {
    vocabulary: [
      { word: 'Hello', definition: 'A greeting you say when you meet someone', exampleSentence: 'Hello! My name is Pip.', fillBlank: '____! My name is Pip.', imageKeywords: 'kids waving hello cartoon cute' },
      { word: 'Name', definition: 'What people call you', exampleSentence: 'My name is Anna.', fillBlank: 'My ____ is Anna.', imageKeywords: 'name tag cartoon kids colorful' },
      { word: 'Friend', definition: 'Someone you like and play with', exampleSentence: 'Pip is my friend.', fillBlank: 'Pip is my ____.', imageKeywords: 'kids friends cartoon hugging' },
      { word: 'Goodbye', definition: 'What you say when you leave', exampleSentence: 'Goodbye! See you tomorrow!', fillBlank: '____! See you tomorrow!', imageKeywords: 'kids waving goodbye cartoon cute' },
    ],
    grammarTarget: 'I am / You are (To Be)',
    grammarExamples: ['I am Pip.', 'You are my friend.', 'I am happy.', 'You are great!'],
    warmUpQuestion: 'Can you wave and say "Hello" to Pip? 👋🐣',
    objectives: ['Greet others using "Hello" and "Goodbye"', 'Introduce themselves: "My name is ___"', 'Use "I am" and "You are" in simple sentences', 'Identify and say 4 new vocabulary words'],
    dialogueLines: ['Pip: Hello! I am Pip! 🐣', 'Student: Hello! I am ___!', 'Pip: What is your name?', 'Student: My name is ___.', 'Pip: Nice to meet you! You are my friend!', 'Student: You are my friend too!'],
    gameDescription: '🎯 Pop the Bubble: Pop the bubbles with the correct greeting words! Tap "Hello" and "Goodbye" bubbles before they float away!',
    productionTask: 'Draw a picture of yourself and Pip. Write "Hello! My name is ___. I am ___." under your drawing. 🎨',
    songOrChant: '🎵 Hello, hello, what\'s your name?\nHello, hello, let\'s play a game!\nI am ___, you are ___,\nWe are friends, let\'s all have fun! 🎵',
  },
};

const ACADEMY_TOPICS: Record<string, TopicPack> = {};
const PROFESSIONAL_TOPICS: Record<string, TopicPack> = {};

function getDefaultTopicPack(topic: string, hub: HubConfig): TopicPack {
  const mainWord = topic.split(' ').filter(w => w.length > 2)[0] || topic;
  const cap = mainWord.charAt(0).toUpperCase() + mainWord.slice(1);

  if (hub.hub === 'professional') {
    return {
      vocabulary: [
        { word: cap, definition: `A key professional term related to ${topic}`, exampleSentence: `We need to discuss ${mainWord} in the meeting.`, fillBlank: `We need to discuss ____ in the meeting.`, imageKeywords: `${topic} professional business office corporate meeting` },
        { word: 'Strategy', definition: 'A plan of action to achieve a goal', exampleSentence: `Our ${topic} strategy is effective.`, fillBlank: `Our ${topic} ____ is effective.`, imageKeywords: `business strategy planning ${topic} professional boardroom` },
        { word: 'Outcome', definition: 'The result of an action or process', exampleSentence: 'The outcome was positive.', fillBlank: 'The ____ was positive.', imageKeywords: `business results graph ${topic} analytics` },
        { word: 'Stakeholder', definition: 'A person with interest in a business', exampleSentence: 'We must inform the stakeholders.', fillBlank: 'We must inform the ____.', imageKeywords: `business meeting stakeholders ${topic} conference` },
        { word: 'Implement', definition: 'To put a plan into action', exampleSentence: `Let's implement the new ${topic} policy.`, fillBlank: `Let's ____ the new ${topic} policy.`, imageKeywords: `business implementation ${topic} workflow office` },
      ],
      grammarTarget: 'Formal register: Modal verbs for suggestions',
      grammarExamples: [`We should consider the ${topic} implications.`, 'Could you elaborate on that point?', 'We might want to revisit the strategy.'],
      warmUpQuestion: `What are the key challenges in ${topic} for your organization?`,
      objectives: [`Master 5 professional terms related to ${topic}`, 'Use modal verbs for formal suggestions', 'Analyze a case study scenario', 'Compose a professional email response'],
      dialogueLines: [`Manager: Let's discuss the ${topic} report.`, 'Employee: I have some insights to share.', 'Manager: What do you recommend?', 'Employee: We should consider ___.'],
      gameDescription: `Business Email Reply: Read the scenario about ${topic} and compose a professional email response using the target vocabulary.`,
      productionTask: `Write a brief executive summary (3-4 sentences) recommending a ${topic} strategy for your organization.`,
      songOrChant: '',
    };
  }

  if (hub.hub === 'academy') {
    return {
      vocabulary: [
        { word: cap, definition: `A key term about ${topic}`, exampleSentence: `${cap} is an interesting topic to study.`, fillBlank: `____ is an interesting topic to study.`, imageKeywords: `${topic} 3d render holographic neon` },
        { word: 'Analyze', definition: 'To examine something in detail', exampleSentence: `Let's analyze this ${topic} example.`, fillBlank: `Let's ____ this ${topic} example.`, imageKeywords: `analysis 3d render neon holographic` },
        { word: 'Context', definition: 'The circumstances around an event', exampleSentence: 'Context helps us understand meaning.', fillBlank: '____ helps us understand meaning.', imageKeywords: `context puzzle pieces 3d neon` },
        { word: 'Perspective', definition: 'A point of view', exampleSentence: 'Everyone has a different perspective.', fillBlank: 'Everyone has a different ____.', imageKeywords: `perspective viewpoint 3d render neon` },
        { word: 'Express', definition: 'To communicate thoughts or feelings', exampleSentence: `Express your ideas about ${topic}.`, fillBlank: `____ your ideas about ${topic}.`, imageKeywords: `expression communication 3d neon teen` },
      ],
      grammarTarget: 'Present Perfect: Have/Has + Past Participle',
      grammarExamples: [`I have studied ${topic} before.`, 'She has completed the assignment.', 'They have discussed the topic.'],
      warmUpQuestion: `What's the first thing that comes to mind when you hear "${topic}"? 🤔`,
      objectives: [`Learn 5 key terms related to ${topic}`, 'Use Present Perfect in context', 'Unscramble sentences with new vocabulary', 'Express opinions using new vocabulary'],
      dialogueLines: [`A: Have you heard about ${topic}?`, 'B: Yes, I have! It\'s really interesting.', 'A: What\'s your perspective?', 'B: I think ___.'],
      gameDescription: `Sentence Unscramble: Rearrange the scrambled words to form correct sentences about ${topic}. Race against the clock! ⏱️`,
      productionTask: `Create a short social media post about ${topic} using at least 3 new vocabulary words. Be creative! 📱`,
      songOrChant: '',
    };
  }

  // Playground default
  return {
    vocabulary: [
      { word: cap, definition: `A key word about ${topic}`, exampleSentence: `I like ${mainWord}.`, fillBlank: `I like ____.`, imageKeywords: `${topic} cartoon illustration cute kids claymation` },
      { word: 'Learn', definition: 'To get new knowledge', exampleSentence: `Let's learn about ${topic}!`, fillBlank: `Let's ____ about ${topic}!`, imageKeywords: `kids learning cartoon colorful claymation` },
      { word: 'Play', definition: 'To do something for enjoyment', exampleSentence: `${topic} is great to play with!`, fillBlank: `${topic} is great to ____ with!`, imageKeywords: `kids playing cartoon vibrant claymation` },
      { word: 'Great', definition: 'Very good, wonderful', exampleSentence: 'You did a great job!', fillBlank: 'You did a ____ job!', imageKeywords: `thumbs up cartoon kids celebration claymation` },
    ],
    grammarTarget: 'I am / You are',
    grammarExamples: [`I like ${topic}.`, `You are learning about ${topic}.`],
    warmUpQuestion: `What do you know about ${topic}? Tell Pip! 🐣`,
    objectives: [`Learn 4 new words about ${topic}`, `Use simple sentences about ${topic}`, 'Practice speaking with a partner', `Complete a drag & drop activity about ${topic}`],
    dialogueLines: [`Pip: Today we learn about ${topic}! 🐣`, `Student: I like ${topic}!`, `Pip: What is your favorite ${mainWord}?`, 'Student: My favorite is ___.'],
    gameDescription: `🎯 Pop the Bubble: Pop the bubbles with the correct ${topic} words before they float away!`,
    productionTask: `Draw your favorite thing about ${topic} and tell the class about it using "I like ___" and "This is a ___."`,
    songOrChant: `🎵 ${topic}, ${topic}, let's have a blast!\n${topic}, ${topic}, everyone!\nI can say it, you can too,\n${topic}, ${topic}, me and you! 🎵`,
  };
}

function getTopicPack(topic: string, hub: HubConfig): TopicPack {
  const key = topic.toLowerCase().trim();
  const hubPacks = hub.hub === 'playground' ? PLAYGROUND_TOPICS
    : hub.hub === 'academy' ? ACADEMY_TOPICS
    : PROFESSIONAL_TOPICS;
  return hubPacks[key] || getDefaultTopicPack(topic, hub);
}

/* ── Image URL with hub-specific style ── */

function buildImageUrl(_keyword: string): string {
  // No longer using picsum.photos placeholders.
  // Images are generated via Gemini AI after lesson structure is created.
  return '';
}

function buildMediaPrompt(keyword: string, hub: HubConfig): string {
  // Contextually relevant prompt following Master Orchestrator rules
  return `${keyword}, ${hub.imageStyleSuffix}`;
}

function pickAnimation(hub: HubConfig, index: number): AnimationType {
  const anims = hub.animations;
  return anims[index % anims.length];
}

function buildVisuals(keyword: string, hub: HubConfig, index: number, layout: 'split' | 'centered' | 'bento' = 'split'): SlideVisuals {
  return {
    image_prompt: buildMediaPrompt(keyword, hub),
    animation_style: pickAnimation(hub, index),
    layout,
  };
}

function buildInteraction(type: string, question?: string, options?: string[], correctAnswer?: string, extra?: Record<string, any>): SlideInteraction {
  return {
    type,
    data: {
      question,
      options,
      correct_answer: correctAnswer,
      ...extra,
    },
  };
}

/* ══════════════════════════════════════════════════════
   MAIN GENERATOR — Hub-Adaptive PPP Lesson
   Follows the Master Orchestrator schema
   ══════════════════════════════════════════════════════ */

export function generatePPPLesson(formData: WizardFormData): PPPLessonPlan {
  const { topic, level, ageGroup } = formData;
  const hub = HUB_CONFIGS[resolveHub(ageGroup)];
  const pack = getTopicPack(topic, hub);
  const slides: GeneratedSlide[] = [];
  let order = 0;

  const cefrMap: Record<string, string> = { beginner: 'Pre-A1 / A1', intermediate: 'B1', advanced: 'C1' };
  const cefrLevel = cefrMap[level] || 'A1';

  // Helper — enforces professional tone
  const sanitizeTone = (text: string): string => {
    if (hub.hub !== 'professional' || !hub.forbiddenWords) return text;
    let result = text;
    hub.forbiddenWords.forEach(w => {
      result = result.replace(new RegExp(`\\b${w}\\b`, 'gi'), 'effective');
    });
    return result;
  };

  // Helper to create a slide with required fields + visuals/interaction
  const mkSlide = (
    phase: GeneratedSlide['phase'],
    phaseLabel: string,
    slideType: GeneratedSlide['slideType'],
    type: GeneratedSlide['type'],
    title: string,
    imgKeywords: string,
    content: GeneratedSlide['content'],
    teacherNotes: string,
    keywords: string[],
    activityType?: GeneratedSlide['activityType'],
    layout: 'split' | 'centered' | 'bento' = 'split',
    interaction?: SlideInteraction,
  ): GeneratedSlide => {
    const idx = order;
    return {
      id: uuidv4(),
      order: order++,
      phase,
      phaseLabel,
      slideType,
      type,
      title: sanitizeTone(title),
      imageUrl: buildImageUrl(imgKeywords),
      imageKeywords: imgKeywords,
      mediaPrompt: buildMediaPrompt(imgKeywords, hub),
      mediaType: hub.mediaType,
      animation: pickAnimation(hub, idx),
      activityType,
      visuals: buildVisuals(imgKeywords, hub, idx, layout),
      interaction,
      content: content ? {
        ...content,
        prompt: content.prompt ? sanitizeTone(content.prompt) : undefined,
      } : undefined,
      teacherNotes: sanitizeTone(teacherNotes),
      keywords,
    };
  };

  // ═══════════════════════════════════════════════════
  // SLIDE 1: HOOK — Introduce objective with engaging scenario
  // ═══════════════════════════════════════════════════
  if (hub.hub === 'playground') {
    slides.push(mkSlide('presentation', '🎬 Hook', 'hook', 'title',
      `✨ Let's Learn: ${topic}!`,
      `${topic} kids colorful claymation adventure`,
      { prompt: `Welcome, little learners! 🌟\n\nToday Pip has a SUPER adventure for you!\n\n${pack.warmUpQuestion}` },
      'Welcome students warmly. Play upbeat music. Introduce Pip and the lesson topic with maximum enthusiasm! Use puppets or plushies if available.',
      [topic, 'hook', 'introduction'],
      undefined, 'centered',
    ));
  } else if (hub.hub === 'academy') {
    slides.push(mkSlide('presentation', '🎯 Hook', 'hook', 'title',
      `🔥 ${topic} — Let's Go!`,
      `${topic} neon holographic 3d render teen`,
      { prompt: `Hey! 👋 Ready for something interesting?\n\n${pack.warmUpQuestion}\n\nLet's find out together...` },
      'Start with an engaging hook. Ask students to share first impressions. Use relatable examples from social media or pop culture.',
      [topic, 'hook', 'introduction'],
      undefined, 'centered',
    ));
  } else {
    slides.push(mkSlide('presentation', '📋 Hook', 'hook', 'title',
      `${topic} — Professional Context`,
      `${topic} corporate meeting cinematic professional`,
      { prompt: `Today's Focus: ${topic}\n\nObjective: ${pack.objectives[0]}\n\n${pack.warmUpQuestion}` },
      'Begin with a brief industry scenario. Ask participants to share their experience. Keep it focused and results-oriented.',
      [topic, 'hook', 'introduction'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // OBJECTIVES SLIDE
  // ═══════════════════════════════════════════════════
  slides.push(mkSlide('presentation', '🎯 Objectives', 'warmup', 'title',
    hub.hub === 'playground' ? '🎯 Today We Will Learn...' : hub.hub === 'academy' ? '🎯 Learning Goals' : '📋 Session Objectives',
    'learning objectives checklist',
    { prompt: pack.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n') },
    `Read each objective aloud. Level: ${cefrLevel}. Duration: 30 minutes. ${hub.tone}`,
    ['objectives', 'goals'],
    undefined, 'centered',
  ));

  // ═══════════════════════════════════════════════════
  // WARM-UP ACTIVITY
  // ═══════════════════════════════════════════════════
  slides.push(mkSlide('presentation', '☀️ Warm-Up', 'warmup', 'roleplay',
    hub.hub === 'playground' ? '☀️ Warm-Up Time!' : hub.hub === 'academy' ? '💡 Quick Think' : '🔄 Warm-Up Discussion',
    `${topic} warm up activity`,
    { prompt: pack.warmUpQuestion },
    'Get students talking! Accept all answers. Build excitement. Use TPR for kids.',
    ['warm-up', 'activation'],
    undefined, 'centered',
  ));

  // ═══════════════════════════════════════════════════
  // MASCOT / INTRO (Playground only)
  // ═══════════════════════════════════════════════════
  if (hub.mascot) {
    slides.push(mkSlide('presentation', '📖 Presentation', 'warmup', 'title',
      '🐣 Meet Pip!',
      'cute penguin mascot claymation vibrant 3d character',
      { prompt: 'Say hello to Pip! 🐣✨\nPip will help us learn today!\nWave to Pip and say: "Hello Pip!"' },
      'Introduce Pip the mascot. Have students wave and greet Pip. Use a puppet or toy if available.',
      ['pip', 'mascot', 'introduction'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // SLIDE 2 (TYPE): VOCABULARY — 3-5 key words
  // ═══════════════════════════════════════════════════
  pack.vocabulary.slice(0, hub.vocabularyCount).forEach((vocab, idx) => {
    slides.push(mkSlide('presentation', '📖 Vocabulary', 'vocabulary', 'vocabulary',
      hub.hub === 'playground'
        ? `📝 New Word ${idx + 1}: ${vocab.word} ✨`
        : hub.hub === 'academy'
        ? `📝 Key Term ${idx + 1}: ${vocab.word}`
        : `📝 Term ${idx + 1}: ${vocab.word}`,
      vocab.imageKeywords,
      { word: vocab.word, definition: vocab.definition, sentence: vocab.exampleSentence },
      `Teach "${vocab.word}": 1) Show image. 2) Say word 3x (students repeat). 3) Explain: "${vocab.definition}". 4) Practice: "${vocab.exampleSentence}". ${hub.hub === 'playground' ? 'Use gestures and TPR.' : hub.hub === 'academy' ? 'Relate to teen context.' : 'Use professional scenarios.'}`,
      [vocab.word.toLowerCase(), 'vocabulary'],
      undefined, 'split',
    ));
  });

  // Vocabulary review
  slides.push(mkSlide('presentation', '📖 Vocabulary', 'vocabulary', 'image',
    hub.hub === 'playground' ? '⚡ Quick Flash Review!' : hub.hub === 'academy' ? '⚡ Speed Round!' : '📋 Vocabulary Review',
    'flashcard review game',
    { prompt: `Review:\n${pack.vocabulary.map(v => `• ${v.word} — ${v.definition}`).join('\n')}` },
    hub.hub === 'playground' ? 'Flash each word quickly. Students shout the answer!' : 'Quick review of all terms before moving to grammar.',
    ['review', 'flashcards'],
    undefined, 'centered',
  ));

  // ═══════════════════════════════════════════════════
  // SLIDE 3 (TYPE): CORE CONCEPT — Grammar / Speaking rule
  // ═══════════════════════════════════════════════════
  slides.push(mkSlide('presentation', '🎯 Core Concept', 'core_concept', 'title',
    hub.hub === 'playground'
      ? `🎯 Grammar: ${pack.grammarTarget}`
      : hub.hub === 'academy'
      ? `💡 Language Focus: ${pack.grammarTarget}`
      : `📐 Structure: ${pack.grammarTarget}`,
    `grammar rules education ${topic}`,
    { prompt: pack.grammarExamples.map(ex => `• ${ex}`).join('\n') },
    `Teach "${pack.grammarTarget}". ${hub.hub === 'playground' ? 'Use the board, drilling, and gestures.' : hub.hub === 'academy' ? 'Use examples from teen life.' : 'Use workplace scenarios.'}`,
    ['grammar', pack.grammarTarget.toLowerCase()],
    undefined, 'centered',
  ));

  // Song/Chant (Playground) or Additional Example (others)
  if (hub.hub === 'playground' && pack.songOrChant) {
    slides.push(mkSlide('presentation', '🎵 Song', 'core_concept', 'image',
      '🎵 Let\'s Sing!',
      'kids singing music classroom cartoon claymation',
      { prompt: pack.songOrChant },
      'Sing/chant together 2-3 times. Add clapping or actions. Reinforces vocabulary!',
      ['song', 'chant'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // PRACTICE PHASE — Dialogue + Controlled Practice
  // ═══════════════════════════════════════════════════

  // Dialogue
  slides.push(mkSlide('practice', '💬 Dialogue', 'dialogue', 'roleplay',
    hub.hub === 'playground' ? '💬 Talk with Pip!' : hub.hub === 'academy' ? '💬 Conversation Practice' : '💬 Professional Dialogue',
    `${topic} dialogue conversation`,
    { prompt: pack.dialogueLines.join('\n') },
    'Model the dialogue. Students practice in pairs. Monitor and provide feedback.',
    ['dialogue', 'speaking', 'practice'],
    undefined, 'split',
  ));

  // ═══════════════════════════════════════════════════
  // SLIDE 4 (TYPE): INTERACTIVE ACTIVITIES
  // Hub-specific permitted activities
  // ═══════════════════════════════════════════════════

  if (hub.hub === 'playground') {
    // Drag & Drop Image Activity
    slides.push(mkSlide('practice', '🎮 Activity', 'activity', 'drag-drop',
      '🎯 Drag & Drop!',
      `${topic} drag drop game kids claymation`,
      {
        prompt: pack.gameDescription,
        dragItems: pack.vocabulary.map(v => ({ text: v.word, target: v.definition })),
      },
      'Interactive drag & drop: students drag words to matching pictures. Help younger students as needed.',
      ['drag-drop', 'activity', 'game'],
      'drag_and_drop_image',
      'bento',
      buildInteraction('drag_and_drop_image', 'Drag each word to the matching picture!',
        pack.vocabulary.map(v => v.word), pack.vocabulary[0].word),
    ));

    // Pop the Word Bubble
    slides.push(mkSlide('practice', '🎮 Activity', 'activity', 'matching',
      '🫧 Pop the Bubbles!',
      `${topic} bubbles floating cartoon kids`,
      {
        matchPairs: pack.vocabulary.map(v => ({ word: v.word, image: buildImageUrl(v.imageKeywords) })),
      },
      'Pop the correct word bubbles! Tap the right words before they float away. Stars for correct pops!',
      ['pop-bubble', 'game', 'practice'],
      'pop_the_word_bubble',
      'centered',
      buildInteraction('pop_the_word_bubble', 'Pop the bubbles with the correct words!',
        pack.vocabulary.map(v => v.word), pack.vocabulary[0].word),
    ));
  } else if (hub.hub === 'academy') {
    // Fill in the Blanks
    pack.vocabulary.slice(0, 3).forEach((vocab, idx) => {
      slides.push(mkSlide('practice', '✏️ Activity', 'activity', 'fill-blank',
        `✏️ Fill the Gap ${idx + 1}`,
        vocab.imageKeywords,
        { sentence: vocab.fillBlank, blankWord: vocab.word },
        `Complete: "${vocab.fillBlank}" → Answer: "${vocab.word}".`,
        ['fill-blank', vocab.word.toLowerCase()],
        'fill_in_blanks',
        'split',
        buildInteraction('fill_in_blanks', vocab.fillBlank, undefined, vocab.word),
      ));
    });

    // Sentence Unscramble
    const scrambleSentence = pack.grammarExamples[0] || `I have studied ${topic} before.`;
    const scrambledWords = scrambleSentence.split(' ').sort(() => Math.random() - 0.5);
    slides.push(mkSlide('practice', '🧩 Activity', 'activity', 'sorting',
      '🧩 Unscramble the Sentence!',
      `sentence puzzle neon 3d render`,
      {
        prompt: `Rearrange these words:\n${scrambledWords.join(' / ')}`,
        options: scrambledWords,
        correctAnswer: scrambleSentence,
      },
      `Unscramble: "${scrambleSentence}". Students drag words into correct order.`,
      ['unscramble', 'sentence', 'grammar'],
      'sentence_unscramble',
      'centered',
      buildInteraction('sentence_unscramble', 'Rearrange the words to form a correct sentence!',
        scrambledWords, scrambleSentence, { scrambled_words: scrambledWords }),
    ));

    // Speed Quiz
    const quizWord = pack.vocabulary[0];
    slides.push(mkSlide('practice', '❓ Activity', 'activity', 'quiz',
      '⚡ Speed Quiz!',
      'quiz question neon holographic teen',
      {
        quizQuestion: `What does "${quizWord.word}" mean?`,
        quizOptions: [
          { text: quizWord.definition, isCorrect: true },
          { text: 'Something unrelated', isCorrect: false },
          { text: 'A different concept', isCorrect: false },
          { text: 'None of the above', isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      },
      `Quiz: Correct answer is "${quizWord.definition}". Discuss why other options are wrong.`,
      ['quiz', 'assessment', 'speed'],
      'speed_quiz',
      'centered',
      buildInteraction('speed_quiz', `What does "${quizWord.word}" mean?`,
        [quizWord.definition, 'Something unrelated', 'A different concept', 'None of the above'],
        quizWord.definition),
    ));
  } else {
    // Professional: Case Study Analysis
    slides.push(mkSlide('practice', '📊 Activity', 'activity', 'roleplay',
      '📊 Case Study Analysis',
      `${topic} case study business corporate cinematic`,
      {
        prompt: `Scenario:\nA company is facing challenges with ${topic}. As a consultant, analyze the situation and recommend a course of action.\n\nConsider:\n• What are the key issues?\n• What data would you need?\n• What would you recommend?`,
        caseStudy: `A mid-size corporation needs to improve their ${topic} strategy. Revenue is declining 15% YoY.`,
      },
      'Present the case study. Give participants 5 minutes to analyze. Discuss in small groups, then share with the class.',
      ['case-study', 'analysis', 'professional'],
      'case_study_analysis',
      'split',
      buildInteraction('case_study_analysis', `Analyze the ${topic} case study and provide your recommendation.`),
    ));

    // Business Email Reply
    slides.push(mkSlide('practice', '📧 Activity', 'activity', 'roleplay',
      '📧 Business Email Response',
      `${topic} email business professional laptop`,
      {
        prompt: `You received this email from a client:\n\n"Dear Team,\n\nI would like to discuss our ${topic} strategy for Q3. Could you provide your analysis and recommendations by Friday?\n\nBest regards,\nSarah Chen"\n\nCompose a professional reply.`,
      },
      'Guide participants through email structure: greeting, acknowledgment, content, close. Review formal register.',
      ['email', 'writing', 'professional'],
      'business_email_reply',
      'split',
      buildInteraction('business_email_reply', 'Compose a professional email reply.',
        undefined, undefined, { email_scenario: `Client requests ${topic} analysis for Q3.` }),
    ));

    // Vocabulary Expansion
    pack.vocabulary.slice(0, 3).forEach((vocab, idx) => {
      slides.push(mkSlide('practice', '✏️ Activity', 'activity', 'fill-blank',
        `✏️ Complete the Statement ${idx + 1}`,
        vocab.imageKeywords,
        { sentence: vocab.fillBlank, blankWord: vocab.word },
        `Professional context: "${vocab.fillBlank}" → "${vocab.word}".`,
        ['fill-blank', vocab.word.toLowerCase()],
        'vocabulary_expansion',
        'split',
        buildInteraction('vocabulary_expansion', vocab.fillBlank, undefined, vocab.word),
      ));
    });
  }

  // Game (Playground & Academy)
  if (hub.hub !== 'professional') {
    slides.push(mkSlide('practice', '🎮 Game Time', 'game', 'roleplay',
      hub.hub === 'playground' ? '🎮 Game Time!' : '🎮 Challenge Time!',
      `${topic} game activity`,
      { prompt: pack.gameDescription },
      `Game: ${pack.gameDescription}\nKeep energy high! Award points.`,
      ['game', 'activity'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // PRODUCTION PHASE — Free Practice & Output
  // ═══════════════════════════════════════════════════

  // Speaking/Presentation
  slides.push(mkSlide('production', '🎤 Production', 'speaking', 'roleplay',
    hub.hub === 'playground' ? '🎤 Your Turn to Talk!' : hub.hub === 'academy' ? '🎤 Express Yourself!' : '🎤 Professional Presentation',
    `${topic} speaking presenting`,
    {
      prompt: hub.hub === 'playground'
        ? `Use these words to talk to your partner:\n${pack.vocabulary.map(v => `✅ ${v.word}`).join('\n')}\n\nTry to use "${pack.grammarTarget}"!`
        : hub.hub === 'academy'
        ? `Share your opinion about ${topic} using at least 3 new terms.\n\nStructure:\n1. State your view\n2. Give a reason\n3. Use an example`
        : `Present a 2-minute recommendation on ${topic} to the group.\n\nUse formal register and include:\n• Key terminology\n• Modal verbs for suggestions\n• A clear conclusion`,
    },
    'Free speaking practice. Monitor and note errors for feedback later.',
    ['speaking', 'production', 'fluency'],
    undefined, 'centered',
  ));

  // Creative Task
  slides.push(mkSlide('production', '🎨 Creative', 'creative', 'image',
    hub.hub === 'playground' ? '🎨 Creative Time!' : hub.hub === 'academy' ? '🎨 Create Something!' : '📝 Written Task',
    `${topic} creative task`,
    { prompt: pack.productionTask },
    `Production task: ${pack.productionTask}. Give 5-7 minutes.`,
    ['creative', 'production', 'writing'],
    undefined, 'centered',
  ));

  // ═══════════════════════════════════════════════════
  // SLIDE 5 (TYPE): SUMMARY — Recap + XP reward
  // ═══════════════════════════════════════════════════

  // Review
  slides.push(mkSlide('production', '📋 Summary', 'summary', 'title',
    hub.hub === 'playground' ? '📋 What Did We Learn? 🌟' : hub.hub === 'academy' ? '📋 Key Takeaways' : '📋 Session Summary',
    'review summary checklist',
    { prompt: pack.objectives.map((o, i) => `${i + 1}. ✅ ${o}`).join('\n') },
    'Review each objective. Celebrate progress!',
    ['review', 'summary'],
    undefined, 'centered',
  ));

  // Self-Assessment / XP Reward
  slides.push(mkSlide('production', '⭐ XP Reward', 'summary', 'quiz',
    hub.hub === 'playground' ? '⭐ You Earned XP! How Did You Do?' : hub.hub === 'academy' ? '🏆 Rate Your Progress' : '📊 Self-Assessment',
    'achievement reward stars celebration',
    {
      quizQuestion: hub.hub === 'playground' ? 'How well did you learn today?' : hub.hub === 'academy' ? 'How confident do you feel?' : 'Rate your understanding:',
      quizOptions: hub.hub === 'playground'
        ? [
            { text: '⭐⭐⭐ I can do it perfectly! (+30 XP)', isCorrect: true },
            { text: '⭐⭐ I can do it with some help (+20 XP)', isCorrect: true },
            { text: '⭐ I need more practice (+10 XP)', isCorrect: true },
          ]
        : [
            { text: 'Confident — I can use this independently', isCorrect: true },
            { text: 'Getting there — I need a bit more practice', isCorrect: true },
            { text: 'Need review — I\'d like to revisit this', isCorrect: true },
          ],
    },
    'All answers valid. This builds metacognition. Note students needing support.',
    ['self-assessment', 'xp', 'reward'],
    undefined, 'centered',
  ));

  // Goodbye
  slides.push(mkSlide('production', '👋 Goodbye', 'goodbye', 'title',
    hub.hub === 'playground' ? '👋 Great Job! See You Next Time! 🌟' : hub.hub === 'academy' ? '✌️ See You Next Time!' : '👋 Thank You — See You Next Session',
    `${topic} goodbye farewell`,
    {
      prompt: hub.hub === 'playground'
        ? 'Goodbye, everyone! You are INCREDIBLE! 🌟\n\nPip says: "See you next time, friends!" 🐣💛\n\n+50 XP earned! 🎉'
        : hub.hub === 'academy'
        ? 'Great work today! 🔥\n\nKeep practicing — you\'re making real progress!\n\n+40 XP earned! 🏆'
        : `Thank you for today's session on ${topic}.\n\nKey takeaway: Apply what you learned in your next meeting.\n\nSession complete. ✓`,
    },
    hub.hub === 'playground' ? 'Celebrate! High-fives, stickers, or stamps.' : 'Thank participants. Assign follow-up if needed.',
    ['goodbye', 'celebration'],
    undefined, 'centered',
  ));

  return {
    lessonMeta: {
      title: `${topic} — ${hub.label} Lesson`,
      hub: hub.hub,
      level: cefrLevel,
      estimatedMinutes: 30,
    },
    topic,
    level,
    ageGroup,
    slides,
    generatedAt: new Date().toISOString(),
  };
}
