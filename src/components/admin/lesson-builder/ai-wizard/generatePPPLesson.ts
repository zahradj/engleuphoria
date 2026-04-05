import { v4 as uuidv4 } from 'uuid';
import { WizardFormData, GeneratedSlide, PPPLessonPlan, HubType, SlideVisuals, SlideInteraction, AnimationType } from './types';
import { HUB_CONFIGS, resolveHub, HubConfig } from './hubConfig';
import { supabase } from '@/integrations/supabase/client';

/* ──────────────────────────────────────────────────
   Topic-specific content banks
   ────────────────────────────────────────────────── */

export interface VocabEntry {
  word: string;
  definition: string;
  exampleSentence: string;
  fillBlank: string;
  imageKeywords: string;
  emoji?: string;
}

export interface TopicPack {
  vocabulary: VocabEntry[];
  grammarTarget: string;
  grammarExamples: string[];
  warmUpQuestion: string;
  warmUpSong?: string;
  objectives: string[];
  dialogueLines: string[];
  gameDescription: string;
  productionTask: string;
  songOrChant: string;
}

/* ── AI-Powered TopicPack Generation ── */

export async function generateTopicPackWithAI(
  topic: string,
  lessonPrompt: string | undefined,
  level: string,
  ageGroup: string,
  hub: HubConfig
): Promise<TopicPack> {
  const { data, error } = await supabase.functions.invoke('ai-lesson-content-generator', {
    body: {
      topic,
      lessonPrompt: lessonPrompt || '',
      level,
      ageGroup,
      hub: hub.hub,
      vocabularyCount: hub.vocabularyCount,
    },
  });

  if (error) {
    console.error('AI generation error:', error);
    throw new Error(error.message || 'Failed to generate lesson content');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.topicPack as TopicPack;
}

/* ── Image URL with hub-specific style ── */

function buildImageUrl(_keyword: string): string {
  return '';
}

function buildMediaPrompt(keyword: string, hub: HubConfig): string {
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
   Now uses AI-generated TopicPack
   ══════════════════════════════════════════════════════ */

export function buildPPPLessonFromPack(formData: WizardFormData, pack: TopicPack): PPPLessonPlan {
  const { topic, level, ageGroup, lessonPrompt } = formData;
  const hub = HUB_CONFIGS[resolveHub(ageGroup)];
  const slides: GeneratedSlide[] = [];
  let order = 0;

  const cefrMap: Record<string, string> = { beginner: 'Pre-A1 / A1', intermediate: 'B1', advanced: 'C1' };
  const cefrLevel = cefrMap[level] || 'A1';

  const promptContext = lessonPrompt
    ? `\n\n📋 Lesson Focus: ${lessonPrompt}`
    : '';

  const sanitizeTone = (text: string): string => {
    if (hub.hub !== 'professional' || !hub.forbiddenWords) return text;
    let result = text;
    hub.forbiddenWords.forEach(w => {
      result = result.replace(new RegExp(`\\b${w}\\b`, 'gi'), 'effective');
    });
    return result;
  };

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
  // SLIDE 1: HOOK
  // ═══════════════════════════════════════════════════
  if (hub.hub === 'playground') {
    slides.push(mkSlide('presentation', '🎬 Hook', 'hook', 'title',
      `✨ Let's Learn: ${topic}!`,
      `${topic} kids colorful claymation adventure`,
      { prompt: `Welcome, little learners! 🌟\n\nToday Pip has a SUPER adventure for you!\n\n${pack.warmUpQuestion}${promptContext}` },
      'Welcome students warmly. Play upbeat music. Introduce Pip and the lesson topic with maximum enthusiasm!',
      [topic, 'hook', 'introduction'],
      undefined, 'centered',
    ));
  } else if (hub.hub === 'academy') {
    slides.push(mkSlide('presentation', '🎯 Hook', 'hook', 'title',
      `🔥 ${topic} — Let's Go!`,
      `${topic} neon holographic 3d render teen`,
      { prompt: `Hey! 👋 Ready for something interesting?\n\n${pack.warmUpQuestion}\n\nLet's find out together...${promptContext}` },
      'Start with an engaging hook. Ask students to share first impressions.',
      [topic, 'hook', 'introduction'],
      undefined, 'centered',
    ));
  } else {
    slides.push(mkSlide('presentation', '📋 Hook', 'hook', 'title',
      `${topic} — Professional Context`,
      `${topic} corporate meeting cinematic professional`,
      { prompt: `Today's Focus: ${topic}\n\nObjective: ${pack.objectives[0]}\n\n${pack.warmUpQuestion}${promptContext}` },
      'Begin with a brief industry scenario. Ask participants to share their experience.',
      [topic, 'hook', 'introduction'],
      undefined, 'centered',
    ));
  }

  // OBJECTIVES
  slides.push(mkSlide('presentation', '🎯 Objectives', 'warmup', 'title',
    hub.hub === 'playground' ? '🎯 Today We Will Learn...' : hub.hub === 'academy' ? '🎯 Learning Goals' : '📋 Session Objectives',
    'learning objectives checklist',
    { prompt: pack.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n') },
    `Read each objective aloud. Level: ${cefrLevel}. Duration: 30 minutes. ${hub.tone}`,
    ['objectives', 'goals'],
    undefined, 'centered',
  ));

  // WARM-UP
  slides.push(mkSlide('presentation', '☀️ Warm-Up', 'warmup', 'roleplay',
    hub.hub === 'playground' ? '☀️ Warm-Up Time!' : hub.hub === 'academy' ? '💡 Quick Think' : '🔄 Warm-Up Discussion',
    `${topic} warm up activity`,
    { prompt: pack.warmUpQuestion },
    'Get students talking! Accept all answers. Build excitement.',
    ['warm-up', 'activation'],
    undefined, 'centered',
  ));

  // WARM-UP SONG (generated by AI)
  if (pack.warmUpSong && pack.warmUpSong.trim()) {
    slides.push(mkSlide('presentation', '🎵 Warm-Up Song', 'warmup', 'image',
      hub.hub === 'playground' ? '🎵 Let\'s Sing & Move!' : '🎵 Warm-Up Song',
      'kids singing music classroom cartoon colorful joyful',
      { prompt: pack.warmUpSong },
      'Sing/chant the warm-up song 2-3 times. Add clapping, stomping, or actions. Make it fun and energetic!',
      ['song', 'warm-up', 'music'],
      undefined, 'centered',
    ));
  }

  // MASCOT (Playground only)
  if (hub.mascot) {
    slides.push(mkSlide('presentation', '📖 Presentation', 'warmup', 'title',
      '🐣 Meet Pip!',
      'cute penguin mascot claymation vibrant 3d character',
      { prompt: 'Say hello to Pip! 🐣✨\nPip will help us learn today!\nWave to Pip and say: "Hello Pip!"' },
      'Introduce Pip the mascot. Have students wave and greet Pip.',
      ['pip', 'mascot', 'introduction'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // VOCABULARY SLIDES
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
      `Teach "${vocab.word}": 1) Show image. 2) Say word 3x (students repeat). 3) Explain: "${vocab.definition}". 4) Practice: "${vocab.exampleSentence}".`,
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
  // CORE CONCEPT — Grammar
  // ═══════════════════════════════════════════════════
  slides.push(mkSlide('presentation', '🎯 Core Concept', 'core_concept', 'title',
    hub.hub === 'playground'
      ? `🎯 Grammar: ${pack.grammarTarget}`
      : hub.hub === 'academy'
      ? `💡 Language Focus: ${pack.grammarTarget}`
      : `📐 Structure: ${pack.grammarTarget}`,
    `grammar rules education ${topic}`,
    { prompt: pack.grammarExamples.map(ex => `• ${ex}`).join('\n') },
    `Teach "${pack.grammarTarget}". Use contextual examples.`,
    ['grammar', pack.grammarTarget.toLowerCase()],
    undefined, 'centered',
  ));

  // Song/Chant (Playground only)
  if (hub.hub === 'playground' && pack.songOrChant) {
    slides.push(mkSlide('presentation', '🎵 Song', 'core_concept', 'image',
      '🎵 Let\'s Sing!',
      'kids singing music classroom cartoon claymation',
      { prompt: pack.songOrChant },
      'Sing/chant together 2-3 times. Add clapping or actions.',
      ['song', 'chant'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // PRACTICE PHASE — Dialogue
  // ═══════════════════════════════════════════════════
  slides.push(mkSlide('practice', '💬 Dialogue', 'dialogue', 'roleplay',
    hub.hub === 'playground' ? '💬 Talk with Pip!' : hub.hub === 'academy' ? '💬 Conversation Practice' : '💬 Professional Dialogue',
    `${topic} dialogue conversation`,
    { prompt: pack.dialogueLines.join('\n') },
    'Model the dialogue. Students practice in pairs. Monitor and provide feedback.',
    ['dialogue', 'speaking', 'practice'],
    undefined, 'split',
  ));

  // ═══════════════════════════════════════════════════
  // INTERACTIVE ACTIVITIES (Hub-specific)
  // ═══════════════════════════════════════════════════
  if (hub.hub === 'playground') {
    slides.push(mkSlide('practice', '🎮 Activity', 'activity', 'drag-drop',
      '🎯 Drag & Drop!',
      `${topic} drag drop game kids claymation`,
      {
        prompt: pack.gameDescription,
        dragItems: pack.vocabulary.map(v => ({ text: v.word, target: v.definition, emoji: v.emoji || '🔤', imageKeywords: v.imageKeywords })),
      },
      'Interactive drag & drop: students drag words to matching pictures.',
      ['drag-drop', 'activity', 'game'],
      'drag_and_drop_image', 'bento',
      buildInteraction('drag_and_drop_image', 'Drag each word to the matching picture!',
        pack.vocabulary.map(v => v.word), pack.vocabulary[0].word),
    ));

    slides.push(mkSlide('practice', '🎮 Activity', 'activity', 'matching',
      '🫧 Pop the Bubbles!',
      `${topic} bubbles floating cartoon kids`,
      {
        matchPairs: pack.vocabulary.map(v => ({ word: v.word, image: v.emoji || '🔤', imageKeywords: v.imageKeywords })),
      },
      'Pop the correct word bubbles! Tap the right words before they float away.',
      ['pop-bubble', 'game', 'practice'],
      'pop_the_word_bubble', 'centered',
      buildInteraction('pop_the_word_bubble', 'Pop the bubbles with the correct words!',
        pack.vocabulary.map(v => v.word), pack.vocabulary[0].word),
    ));
  } else if (hub.hub === 'academy') {
    pack.vocabulary.slice(0, 3).forEach((vocab, idx) => {
      slides.push(mkSlide('practice', '✏️ Activity', 'activity', 'fill-blank',
        `✏️ Fill the Gap ${idx + 1}`,
        vocab.imageKeywords,
        { sentence: vocab.fillBlank, blankWord: vocab.word },
        `Complete: "${vocab.fillBlank}" → Answer: "${vocab.word}".`,
        ['fill-blank', vocab.word.toLowerCase()],
        'fill_in_blanks', 'split',
        buildInteraction('fill_in_blanks', vocab.fillBlank, undefined, vocab.word),
      ));
    });

    const scrambleSentence = pack.grammarExamples[0] || `I have studied ${topic} before.`;
    const scrambledWords = scrambleSentence.split(' ').sort(() => Math.random() - 0.5);
    slides.push(mkSlide('practice', '🧩 Activity', 'activity', 'sorting',
      '🧩 Unscramble the Sentence!',
      'sentence puzzle neon 3d render',
      {
        prompt: `Rearrange these words:\n${scrambledWords.join(' / ')}`,
        options: scrambledWords,
        correctAnswer: scrambleSentence,
      },
      `Unscramble: "${scrambleSentence}".`,
      ['unscramble', 'sentence', 'grammar'],
      'sentence_unscramble', 'centered',
      buildInteraction('sentence_unscramble', 'Rearrange the words to form a correct sentence!',
        scrambledWords, scrambleSentence, { scrambled_words: scrambledWords }),
    ));

    const quizWord = pack.vocabulary[0];
    slides.push(mkSlide('practice', '❓ Activity', 'activity', 'quiz',
      '⚡ Speed Quiz!',
      'quiz question neon holographic teen',
      {
        quizQuestion: `What does "${quizWord.word}" mean?`,
        quizOptions: [
          { text: quizWord.definition, isCorrect: true },
          { text: pack.vocabulary.length > 1 ? pack.vocabulary[1].definition : 'Something unrelated', isCorrect: false },
          { text: pack.vocabulary.length > 2 ? pack.vocabulary[2].definition : 'A different concept', isCorrect: false },
          { text: 'None of the above', isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      },
      `Quiz: Correct answer is "${quizWord.definition}".`,
      ['quiz', 'assessment', 'speed'],
      'speed_quiz', 'centered',
      buildInteraction('speed_quiz', `What does "${quizWord.word}" mean?`,
        [quizWord.definition, 'Something unrelated', 'A different concept', 'None of the above'],
        quizWord.definition),
    ));
  } else {
    slides.push(mkSlide('practice', '📊 Activity', 'activity', 'roleplay',
      '📊 Case Study Analysis',
      `${topic} case study business corporate cinematic`,
      {
        prompt: `Scenario:\nA company is facing challenges with ${topic}. As a consultant, analyze the situation and recommend a course of action.\n\nConsider:\n• What are the key issues?\n• What data would you need?\n• What would you recommend?`,
        caseStudy: `A mid-size corporation needs to improve their ${topic} strategy.`,
      },
      'Present the case study. Give participants 5 minutes to analyze.',
      ['case-study', 'analysis', 'professional'],
      'case_study_analysis', 'split',
      buildInteraction('case_study_analysis', `Analyze the ${topic} case study and provide your recommendation.`),
    ));

    slides.push(mkSlide('practice', '📧 Activity', 'activity', 'roleplay',
      '📧 Business Email Response',
      `${topic} email business professional laptop`,
      {
        prompt: `You received this email from a client:\n\n"Dear Team,\n\nI would like to discuss our ${topic} strategy for Q3. Could you provide your analysis and recommendations by Friday?\n\nBest regards,\nSarah Chen"\n\nCompose a professional reply.`,
      },
      'Guide participants through email structure: greeting, acknowledgment, content, close.',
      ['email', 'writing', 'professional'],
      'business_email_reply', 'split',
      buildInteraction('business_email_reply', 'Compose a professional email reply.',
        undefined, undefined, { email_scenario: `Client requests ${topic} analysis for Q3.` }),
    ));

    pack.vocabulary.slice(0, 3).forEach((vocab, idx) => {
      slides.push(mkSlide('practice', '✏️ Activity', 'activity', 'fill-blank',
        `✏️ Complete the Statement ${idx + 1}`,
        vocab.imageKeywords,
        { sentence: vocab.fillBlank, blankWord: vocab.word },
        `Professional context: "${vocab.fillBlank}" → "${vocab.word}".`,
        ['fill-blank', vocab.word.toLowerCase()],
        'vocabulary_expansion', 'split',
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
      `Game: ${pack.gameDescription}\nKeep energy high!`,
      ['game', 'activity'],
      undefined, 'centered',
    ));
  }

  // ═══════════════════════════════════════════════════
  // PRODUCTION PHASE
  // ═══════════════════════════════════════════════════
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

  slides.push(mkSlide('production', '🎨 Creative', 'creative', 'image',
    hub.hub === 'playground' ? '🎨 Creative Time!' : hub.hub === 'academy' ? '🎨 Create Something!' : '📝 Written Task',
    `${topic} creative task`,
    { prompt: pack.productionTask },
    `Production task: ${pack.productionTask}. Give 5-7 minutes.`,
    ['creative', 'production', 'writing'],
    undefined, 'centered',
  ));

  // ═══════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════
  slides.push(mkSlide('production', '📋 Summary', 'summary', 'title',
    hub.hub === 'playground' ? '📋 What Did We Learn? 🌟' : hub.hub === 'academy' ? '📋 Key Takeaways' : '📋 Session Summary',
    'review summary checklist',
    { prompt: pack.objectives.map((o, i) => `${i + 1}. ✅ ${o}`).join('\n') },
    'Review each objective. Celebrate progress!',
    ['review', 'summary'],
    undefined, 'centered',
  ));

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
    'All answers valid. This builds metacognition.',
    ['self-assessment', 'xp', 'reward'],
    undefined, 'centered',
  ));

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

// Legacy synchronous wrapper (kept for backward compatibility but no longer used by wizard)
export function generatePPPLesson(formData: WizardFormData): PPPLessonPlan {
  // This is a fallback with a generic pack — the wizard now uses generateTopicPackWithAI + buildPPPLessonFromPack
  const hub = HUB_CONFIGS[resolveHub(formData.ageGroup)];
  const mainWord = formData.topic.split(' ').filter(w => w.length > 2)[0] || formData.topic;
  const cap = mainWord.charAt(0).toUpperCase() + mainWord.slice(1);
  
  const fallbackPack: TopicPack = {
    vocabulary: [
      { word: cap, definition: `A key word about ${formData.topic}`, exampleSentence: `I like ${mainWord}.`, fillBlank: `I like ____.`, imageKeywords: `${formData.topic} illustration`, emoji: '🌟' },
      { word: 'Learn', definition: 'To get new knowledge', exampleSentence: `Let's learn about ${formData.topic}!`, fillBlank: `Let's ____ about ${formData.topic}!`, imageKeywords: 'learning education', emoji: '📚' },
      { word: 'Practice', definition: 'To do something again and again to improve', exampleSentence: 'Practice makes perfect!', fillBlank: '____ makes perfect!', imageKeywords: 'practice training', emoji: '🎯' },
      { word: 'Understand', definition: 'To know the meaning of something', exampleSentence: `I understand ${formData.topic} now!`, fillBlank: `I ____ ${formData.topic} now!`, imageKeywords: 'understanding knowledge', emoji: '💡' },
    ],
    grammarTarget: 'Simple Present',
    grammarExamples: [`I like ${formData.topic}.`, `You learn about ${formData.topic}.`],
    warmUpQuestion: `What do you know about ${formData.topic}?`,
    objectives: [`Learn key vocabulary about ${formData.topic}`, 'Practice using new words in sentences', 'Complete interactive activities', 'Express ideas about the topic'],
    dialogueLines: [`A: What is ${formData.topic}?`, `B: ${formData.topic} is interesting!`, 'A: Tell me more.', 'B: Let me explain...'],
    gameDescription: `Match the ${formData.topic} vocabulary with their definitions!`,
    productionTask: `Create a short presentation about ${formData.topic} using the new vocabulary.`,
    songOrChant: '',
  };

  return buildPPPLessonFromPack(formData, fallbackPack);
}
