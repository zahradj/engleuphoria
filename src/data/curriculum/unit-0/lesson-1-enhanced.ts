import { LessonSlides } from '@/types/slides';
import lessonIntroHero from '@/assets/lessons/unit-0-lesson-1-enhanced/lesson-intro-hero.png';
import characterMax from '@/assets/lessons/unit-0-lesson-1-enhanced/character-max.png';
import characterLily from '@/assets/lessons/unit-0-lesson-1-enhanced/character-lily.png';
import vocabHello from '@/assets/lessons/unit-0-lesson-1-enhanced/vocab-hello.png';
import vocabHi from '@/assets/lessons/unit-0-lesson-1-enhanced/vocab-hi.png';
import vocabName from '@/assets/lessons/unit-0-lesson-1-enhanced/vocab-name.png';
import vocabNice from '@/assets/lessons/unit-0-lesson-1-enhanced/vocab-nice.png';
import gameMatchBackground from '@/assets/lessons/unit-0-lesson-1-enhanced/game-match-background.png';
import celebrationComplete from '@/assets/lessons/unit-0-lesson-1-enhanced/celebration-complete.png';
import teacherHello from '@/assets/lessons/unit-0-lesson-1-new/teacher-hello.png';
import studentHello from '@/assets/lessons/unit-0-lesson-1-new/student-hello.png';
import characterAnna from '@/assets/lessons/unit-0-lesson-1-new/character-anna.png';
import characterTom from '@/assets/lessons/unit-0-lesson-1-new/character-tom.png';
import niceToMeetYou from '@/assets/lessons/unit-0-lesson-1-new/nice-to-meet-you.png';
import goodbyeWave from '@/assets/lessons/unit-0-lesson-1-new/goodbye-wave.png';

export const lesson0_1_enhanced: LessonSlides = {
  version: '2.0',
  theme: "default",
  durationMin: 30,
  total_slides: 25,
  metadata: {
    CEFR: "Pre-A1",
    module: 0,
    lesson: 1,
    targets: [
      "Students can greet people with Hello, Hi, and Goodbye",
      "Students can introduce themselves using 'My name is...'",
      "Students can respond with 'Nice to meet you'",
      "Students can recognize and use basic greeting vocabulary",
      "Students can participate in simple greeting dialogues"
    ],
    weights: {
      accuracy: 0.5,
      fluency: 0.5,
    },
  },
  slides: [
    // SECTION 1: HOOK & INTRO (Slides 1-3, 3 min)
    {
      id: "slide-1",
      type: "warmup",
      prompt: "🌟 Welcome to English Adventure! 🌟",
      instructions: "Get ready to learn how to say HELLO in English! Let's make new friends together!",
      media: {
        type: 'image',
        url: lessonIntroHero,
        alt: "Welcome to English class"
      },
      audio: {
        text: "Welcome to English Adventure! Today we're going to learn how to say hello and introduce ourselves. Are you ready? Let's begin!",
      },
      xpReward: 10,
      tags: ["intro", "motivation"],
    },
    {
      id: "slide-2",
      type: "vocabulary_preview",
      prompt: "👫 Meet Your New Friends! 👫",
      instructions: "These are your English-speaking friends. Let's learn their names!",
      options: [
        { id: "1", text: "👧 Anna" },
        { id: "2", text: "👦 Tom" },
        { id: "3", text: "🙋‍♂️ Max" },
        { id: "4", text: "🙋‍♀️ Lily" },
      ],
      audio: {
        text: "Today you'll meet new friends! This is Anna, Tom, Max, and Lily. They're all excited to learn English with you!",
      },
      xpReward: 5,
      tags: ["characters", "introduction"],
    },
    {
      id: "slide-3",
      type: "target_language",
      prompt: "🎯 What We'll Learn Today",
      instructions: "By the end of this lesson, you will be able to:",
      content: `
📌 Say HELLO and HI to people
📌 Say GOODBYE when leaving
📌 Introduce yourself: "My name is..."
📌 Respond: "Nice to meet you!"
📌 Have a simple greeting conversation
      `,
      audio: {
        text: "Today you will learn five important things. You'll learn to say hello and hi, to say goodbye, to tell people your name, to say nice to meet you, and to have a simple conversation!",
      },
      xpReward: 5,
      tags: ["goals", "targets"],
    },

    // SECTION 2: VOCABULARY INTRODUCTION (Slides 4-10, 7 min)
    {
      id: "slide-4",
      type: "vocabulary_preview",
      prompt: "👋 Word 1: HELLO",
      instructions: "Wave your hand and say: HELLO!",
      media: {
        type: 'image',
        url: vocabHello,
        alt: "Hello with sun and stars"
      },
      audio: {
        text: "HELLO! Can you wave your hand and say HELLO? Great job! We use HELLO when we meet someone. Let's practice together: HELLO!",
      },
      vocabulary: ["hello"],
      xpReward: 10,
      tags: ["vocabulary", "tpr"],
    },
    {
      id: "slide-5",
      type: "vocabulary_preview",
      prompt: "👋 Word 2: HI",
      instructions: "Wave both hands and say: HI!",
      media: {
        type: 'image',
        url: vocabHi,
        alt: "Hi with waving hands"
      },
      audio: {
        text: "HI! This is another way to say hello! Wave both hands and say HI! HI is more casual and friendly. Let's say it together: HI!",
      },
      vocabulary: ["hi"],
      xpReward: 10,
      tags: ["vocabulary", "tpr"],
    },
    {
      id: "slide-6",
      type: "vocabulary_preview",
      prompt: "👋 Word 3: GOODBYE",
      instructions: "Wave goodbye and say: GOODBYE!",
      media: {
        type: 'image',
        url: goodbyeWave,
        alt: "Goodbye wave"
      },
      audio: {
        text: "GOODBYE! We say goodbye when we leave. Can you wave and say GOODBYE? Perfect! Now let's say it together: GOODBYE!",
      },
      vocabulary: ["goodbye"],
      xpReward: 10,
      tags: ["vocabulary", "tpr"],
    },
    {
      id: "slide-7",
      type: "vocabulary_preview",
      prompt: "📛 Word 4: NAME",
      instructions: "Point to yourself and say: My NAME!",
      media: {
        type: 'image',
        url: vocabName,
        alt: "Name with name tag"
      },
      audio: {
        text: "NAME! Your name is what people call you. Point to yourself and say: my NAME! Everyone has a name. What's your name?",
      },
      vocabulary: ["name"],
      xpReward: 10,
      tags: ["vocabulary", "tpr"],
    },
    {
      id: "slide-8",
      type: "vocabulary_preview",
      prompt: "👤 Word 5: I",
      instructions: "Point to yourself for 'I'",
      content: "**I** = ME! Point to yourself!",
      audio: {
        text: "I means YOU! Point to yourself. When you talk about yourself, you say I. For example: I am happy. I like cookies. Can you point to yourself and say I?",
      },
      vocabulary: ["I"],
      xpReward: 5,
      tags: ["vocabulary", "tpr"],
    },
    {
      id: "slide-9",
      type: "vocabulary_preview",
      prompt: "👉 Word 6: YOU",
      instructions: "Point to someone else for 'YOU'",
      content: "**YOU** = Another person! Point to a friend!",
      audio: {
        text: "YOU means another person! Point to someone else. When you talk to someone, you say YOU. For example: You are nice. Can you point to someone and say YOU?",
      },
      vocabulary: ["you"],
      xpReward: 5,
      tags: ["vocabulary", "tpr"],
    },
    {
      id: "slide-10",
      type: "vocabulary_preview",
      prompt: "💖 Word 7: NICE",
      instructions: "Give a thumbs up for 'NICE'!",
      media: {
        type: 'image',
        url: vocabNice,
        alt: "Nice with happy emoji"
      },
      audio: {
        text: "NICE! Nice means good, pleasant, friendly! Give a big thumbs up and say NICE! When you meet someone, you can say: Nice to meet you! Let's say it: NICE!",
      },
      vocabulary: ["nice"],
      xpReward: 10,
      tags: ["vocabulary", "tpr"],
    },

    // SECTION 3: PATTERN INTRODUCTION (Slides 11-13, 5 min)
    {
      id: "slide-11",
      type: "target_language",
      prompt: "📝 Pattern: 'My name is...'",
      instructions: "Watch Max introduce himself!",
      content: `
**Max says:**
"Hello! My name is Max."

**Pattern:** My name is [YOUR NAME].
      `,
      media: {
        type: 'image',
        url: characterMax,
        alt: "Max introducing himself"
      },
      audio: {
        text: "Listen to Max. He says: Hello! My name is Max. You can use this pattern too! Just say: My name is, and then say your name. Let me say it slowly: My... name... is... Max.",
      },
      vocabulary: ["my", "name", "is"],
      xpReward: 10,
      tags: ["pattern", "introduction"],
    },
    {
      id: "slide-12",
      type: "target_language",
      prompt: "💬 Response: 'Nice to meet you!'",
      instructions: "Listen to the response!",
      content: `
**Max:** "Hello! My name is Max."
**Lily:** "Nice to meet you, Max!"

**Pattern:** Nice to meet you!
      `,
      audio: {
        text: "Now listen to Lily's response. Max says: Hello, my name is Max. And Lily says: Nice to meet you, Max! This is a polite way to respond when you meet someone new.",
      },
      vocabulary: ["nice", "meet", "you"],
      xpReward: 10,
      tags: ["pattern", "response"],
    },
    {
      id: "slide-13",
      type: "listening_comprehension",
      prompt: "👂 Full Dialogue Practice",
      instructions: "Listen to the complete conversation!",
      content: `
**Anna:** "Hi! My name is Anna."
**Tom:** "Hello, Anna! My name is Tom. Nice to meet you!"
**Anna:** "Nice to meet you too, Tom!"
      `,
      audio: {
        text: "Now listen to Anna and Tom having a full conversation. Anna says: Hi! My name is Anna. Tom says: Hello Anna! My name is Tom. Nice to meet you! And Anna responds: Nice to meet you too, Tom! Can you hear all the words we learned?",
      },
      xpReward: 15,
      tags: ["dialogue", "listening"],
    },

    // SECTION 4: GAMIFICATION ZONE 1 (Slides 14-17, 5 min)
    {
      id: "slide-14",
      type: "match",
      prompt: "🎮 Memory Match Game!",
      instructions: "Match each character with their name!",
      matchPairs: [
        { id: "1", left: "👧 Girl with long hair", right: "Anna" },
        { id: "2", left: "👦 Boy with short hair", right: "Tom" },
        { id: "3", left: "🙋‍♂️ Boy in blue shirt", right: "Max" },
        { id: "4", left: "🙋‍♀️ Girl in yellow dress", right: "Lily" },
      ],
      audio: {
        text: "Let's play a matching game! Can you match each character with their correct name? Think carefully and have fun!",
      },
      gameConfig: {
        theme: "playground",
        difficulty: "easy",
        lives: 3,
        soundEffects: true,
      },
      xpReward: 20,
      tags: ["game", "memory", "matching"],
    },
    {
      id: "slide-15",
      type: "fast_match",
      prompt: "⚡ Fast Match Challenge!",
      instructions: "Match the English words to the pictures as fast as you can!",
      options: [
        { id: "1", text: "HELLO", isCorrect: true },
        { id: "2", text: "GOODBYE", isCorrect: true },
        { id: "3", text: "NAME", isCorrect: true },
        { id: "4", text: "NICE", isCorrect: true },
      ],
      audio: {
        text: "Time for a speed challenge! Match each word to the correct picture as quickly as you can! Ready, set, go!",
      },
      gameConfig: {
        theme: "playground",
        difficulty: "easy",
        timeBonus: true,
      },
      xpReward: 15,
      tags: ["game", "speed", "vocabulary"],
    },
    {
      id: "slide-16",
      type: "drag_drop",
      prompt: "🎯 Drag & Drop Names!",
      instructions: "Drag each name to the correct character!",
      dragDropItems: [
        { id: "anna", text: "Anna", targetId: "target-anna" },
        { id: "tom", text: "Tom", targetId: "target-tom" },
        { id: "max", text: "Max", targetId: "target-max" },
        { id: "lily", text: "Lily", targetId: "target-lily" },
      ],
      dragDropTargets: [
        { id: "target-anna", text: "👧", acceptsItemIds: ["anna"] },
        { id: "target-tom", text: "👦", acceptsItemIds: ["tom"] },
        { id: "target-max", text: "🙋‍♂️", acceptsItemIds: ["max"] },
        { id: "target-lily", text: "🙋‍♀️", acceptsItemIds: ["lily"] },
      ],
      audio: {
        text: "Now let's drag and drop! Can you drag each name to the correct character? Take your time and think carefully!",
      },
      xpReward: 15,
      tags: ["game", "drag-drop", "names"],
    },
    {
      id: "slide-17",
      type: "match",
      prompt: "💬 Match Greetings & Responses!",
      instructions: "Match each greeting with the correct response!",
      matchPairs: [
        { id: "1", left: "Hello!", right: "Hi there!" },
        { id: "2", left: "What's your name?", right: "My name is..." },
        { id: "3", left: "Nice to meet you!", right: "Nice to meet you too!" },
        { id: "4", left: "Goodbye!", right: "Bye! See you!" },
      ],
      media: {
        type: 'image',
        url: gameMatchBackground,
        alt: "Game background"
      },
      audio: {
        text: "Can you match each greeting with the correct response? Think about what we learned and make the connections!",
      },
      xpReward: 15,
      tags: ["game", "matching", "dialogue"],
    },

    // SECTION 5: CONTROLLED PRACTICE (Slides 18-20, 5 min)
    {
      id: "slide-18",
      type: "sentence_builder",
      prompt: "✏️ Build Your Sentence!",
      instructions: "Complete the sentence: My name is ____",
      content: "Drag the words to build: **My name is [YOUR NAME]**",
      audio: {
        text: "Now it's your turn! Can you complete the sentence? My name is... and then add your own name! Type your name to complete the sentence.",
      },
      xpReward: 20,
      tags: ["practice", "sentence-building", "production"],
    },
    {
      id: "slide-19",
      type: "cloze",
      prompt: "📝 Fill in the Gap!",
      instructions: "Choose the correct word to complete the sentence.",
      content: "____! My name is Max.",
      clozeGaps: [
        {
          id: "gap1",
          correctAnswers: ["Hello"],
          options: ["Hello", "Goodbye", "Thank you"],
        },
      ],
      audio: {
        text: "Fill in the blank! What word should go here? Blank! My name is Max. Should we say Hello, Goodbye, or Thank you? Choose the correct answer!",
      },
      xpReward: 10,
      tags: ["practice", "cloze", "grammar"],
    },
    {
      id: "slide-20",
      type: "accuracy_mcq",
      prompt: "✅ Multiple Choice Practice",
      instructions: "Choose the BEST way to introduce yourself:",
      options: [
        { id: "1", text: "My name is Tom.", isCorrect: true },
        { id: "2", text: "Your name is Tom.", isCorrect: false },
        { id: "3", text: "His name is Tom.", isCorrect: false },
        { id: "4", text: "Name is Tom.", isCorrect: false },
      ],
      audio: {
        text: "Which is the best way to introduce yourself? Look at all four options and choose the correct sentence!",
      },
      xpReward: 10,
      tags: ["practice", "mcq", "accuracy"],
    },

    // SECTION 6: GAMIFICATION ZONE 2 (Slides 21-22, 3 min)
    {
      id: "slide-21",
      type: "fast_match",
      prompt: "🫧 Bubble Pop Vocabulary!",
      instructions: "Pop the bubbles with greeting words! Avoid the wrong words!",
      options: [
        { id: "1", text: "HELLO", isCorrect: true },
        { id: "2", text: "HI", isCorrect: true },
        { id: "3", text: "GOODBYE", isCorrect: true },
        { id: "4", text: "NICE", isCorrect: true },
        { id: "5", text: "APPLE", isCorrect: false },
        { id: "6", text: "CAT", isCorrect: false },
      ],
      audio: {
        text: "Bubble pop time! Pop all the bubbles that have greeting words! Be careful and don't pop the wrong words! Ready, go!",
      },
      gameConfig: {
        theme: "ocean",
        difficulty: "easy",
        soundEffects: true,
        targetScore: 50,
      },
      xpReward: 25,
      tags: ["game", "bubble-pop", "speed"],
    },
    {
      id: "slide-22",
      type: "fast_match",
      prompt: "🌧️ Word Rain Challenge!",
      instructions: "Catch the falling greeting words! Don't catch the wrong ones!",
      options: [
        { id: "1", text: "Hello", isCorrect: true },
        { id: "2", text: "Hi", isCorrect: true },
        { id: "3", text: "Name", isCorrect: true },
        { id: "4", text: "Nice", isCorrect: true },
        { id: "5", text: "Dog", isCorrect: false },
        { id: "6", text: "Book", isCorrect: false },
      ],
      audio: {
        text: "Word rain challenge! Catch only the greeting words as they fall! Avoid the other words! How many can you catch?",
      },
      gameConfig: {
        theme: "fantasy",
        difficulty: "easy",
        lives: 3,
        soundEffects: true,
      },
      xpReward: 25,
      tags: ["game", "word-rain", "speed"],
    },

    // SECTION 7: PRODUCTION & ROLEPLAY (Slide 23, 3 min)
    {
      id: "slide-23",
      type: "communicative_task",
      prompt: "🎭 Roleplay Time!",
      instructions: "Practice the full greeting conversation! Choose a partner and introduce yourself!",
      content: `
**Person A:** "Hello! My name is ____. What's your name?"
**Person B:** "Hi! My name is ____. Nice to meet you!"
**Person A:** "Nice to meet you too!"

Now practice with Anna, Tom, Max, or Lily!
      `,
      audio: {
        text: "It's roleplay time! Practice introducing yourself to each character. Say: Hello! My name is... and your name. Then they will respond. Let's practice together!",
      },
      xpReward: 20,
      tags: ["roleplay", "production", "speaking"],
    },

    // SECTION 8: REVIEW & CELEBRATION (Slides 24-25, 2 min)
    {
      id: "slide-24",
      type: "review_consolidation",
      prompt: "📚 Vocabulary Review",
      instructions: "Let's review all the words we learned today!",
      content: `
✅ **HELLO** - Say when you meet someone
✅ **HI** - Casual greeting
✅ **GOODBYE** - Say when you leave
✅ **NAME** - What people call you
✅ **I** - Yourself
✅ **YOU** - Another person
✅ **NICE** - Good, pleasant

**Phrases:**
✅ "My name is..."
✅ "Nice to meet you!"
      `,
      audio: {
        text: "Great job today! Let's review everything we learned. We learned to say Hello, Hi, and Goodbye. We learned about names, I, you, and nice. We can now introduce ourselves and respond politely. You did an amazing job!",
      },
      xpReward: 10,
      tags: ["review", "consolidation"],
    },
    {
      id: "slide-25",
      type: "exit_check",
      prompt: "🎉 Congratulations! You Did It! 🎉",
      instructions: "You completed the Greetings & Introductions lesson!",
      content: `
## 🏆 Achievements Unlocked:

✨ **Greeting Master** - You can say Hello, Hi, and Goodbye!
✨ **Introduction Expert** - You can introduce yourself!
✨ **Polite Responder** - You know how to say "Nice to meet you!"
✨ **Vocabulary Champion** - You learned 7+ new words!
✨ **Game Winner** - You completed all the fun activities!

**Total XP Earned:** 270 points! 🌟

**You're ready for the next adventure!**
      `,
      media: {
        type: 'image',
        url: celebrationComplete,
        alt: "Celebration with confetti and trophy"
      },
      audio: {
        text: "Congratulations! You completed the lesson! You learned how to greet people, introduce yourself, and have a simple conversation. You earned 270 experience points and unlocked many achievements! You're an English superstar! Great job and see you in the next lesson!",
      },
      xpReward: 30,
      tags: ["celebration", "exit", "completion"],
    },
  ],
};
