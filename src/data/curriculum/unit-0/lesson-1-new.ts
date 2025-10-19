import { LessonSlides } from '@/types/slides';
import teacherHello from '@/assets/lessons/unit-0-lesson-1-new/teacher-hello.png';
import studentHello from '@/assets/lessons/unit-0-lesson-1-new/student-hello.png';
import niceToMeetYou from '@/assets/lessons/unit-0-lesson-1-new/nice-to-meet-you.png';
import characterAnna from '@/assets/lessons/unit-0-lesson-1-new/character-anna.png';
import characterTom from '@/assets/lessons/unit-0-lesson-1-new/character-tom.png';
import goodbyeWave from '@/assets/lessons/unit-0-lesson-1-new/goodbye-wave.png';

export const lesson0_1_new: LessonSlides = {
  version: "2.0",
  theme: "mist-blue",
  durationMin: 30,
  total_slides: 20,
  metadata: {
    CEFR: "Pre-A1",
    module: 0,
    lesson: 1,
    targets: [
      "Introduce themselves using 'My name is...'",
      "Greet and respond to greetings",
      "Recognize and use basic words for introductions and farewells"
    ],
    weights: {
      accuracy: 60,
      fluency: 40
    }
  },
  slides: [
    // === STAGE 1: WARM-UP (5 min) - Hello Song / Greeting Game ===
    {
      id: "slide-1",
      type: "warmup",
      prompt: "🌟 Welcome! Let's Learn to Say Hello!",
      instructions: "Watch and wave! Let's practice our greetings together.",
      media: {
        type: "image",
        url: teacherHello,
        alt: "Friendly teacher waving hello"
      },
      audio: {
        text: "Hello! Welcome to our lesson! Today we will learn how to say hello and introduce ourselves!"
      },
      tags: ["warmup", "greeting"],
      xpReward: 5
    },
    {
      id: "slide-2",
      type: "vocabulary_preview",
      prompt: "Hello! 👋",
      instructions: "Listen and repeat: Hello!",
      media: {
        type: "image",
        url: teacherHello,
        alt: "Teacher saying hello"
      },
      audio: {
        text: "Hello! Now you try. Say Hello!"
      },
      tags: ["vocabulary", "greeting"],
      xpReward: 5
    },
    {
      id: "slide-3",
      type: "vocabulary_preview",
      prompt: "Hi! 👋",
      instructions: "Listen and repeat: Hi!",
      media: {
        type: "image",
        url: studentHello,
        alt: "Student saying hi"
      },
      audio: {
        text: "Hi! Now you try. Say Hi!"
      },
      tags: ["vocabulary", "greeting"],
      xpReward: 5
    },
    {
      id: "slide-4",
      type: "vocabulary_preview",
      prompt: "Goodbye! 👋",
      instructions: "Listen and repeat: Goodbye!",
      media: {
        type: "image",
        url: goodbyeWave,
        alt: "Character waving goodbye"
      },
      audio: {
        text: "Goodbye! Now you try. Say Goodbye!"
      },
      tags: ["vocabulary", "farewell"],
      xpReward: 5
    },

    // === STAGE 2: PRESENTATION (7 min) - Learn and Repeat ===
    {
      id: "slide-5",
      type: "target_language",
      prompt: "Learning Objectives",
      instructions: "By the end of this lesson, you will be able to:",
      content: [
        "✓ Introduce yourself using 'My name is...'",
        "✓ Greet people and respond to greetings",
        "✓ Say goodbye politely",
        "✓ Use these words: Hello, Hi, Goodbye, Name, I, You, Nice"
      ],
      tags: ["objectives"],
      xpReward: 0
    },
    {
      id: "slide-6",
      type: "target_language",
      prompt: "My name is... 📛",
      instructions: "Listen to the teacher introduce herself!",
      media: {
        type: "image",
        url: teacherHello,
        alt: "Teacher introducing herself"
      },
      content: ["My name is Zahra."],
      audio: {
        text: "Hello! My name is Zahra. What's your name?"
      },
      tags: ["introduction", "pattern"],
      xpReward: 5
    },
    {
      id: "slide-7",
      type: "target_language",
      prompt: "Nice to meet you! 🤝",
      instructions: "This is how we greet new people!",
      media: {
        type: "image",
        url: niceToMeetYou,
        alt: "Two characters meeting"
      },
      content: [
        "Person 1: Hello! My name is Anna.",
        "Person 2: Hi! My name is Tom. Nice to meet you!",
        "Person 1: Nice to meet you, too!"
      ],
      audio: {
        text: "Hello! My name is Anna. Hi! My name is Tom. Nice to meet you! Nice to meet you, too!"
      },
      tags: ["dialogue", "pattern"],
      xpReward: 10
    },
    {
      id: "slide-8",
      type: "target_language",
      prompt: "Meet Anna! 👧",
      instructions: "Anna will introduce herself. Listen!",
      media: {
        type: "image",
        url: characterAnna,
        alt: "Character Anna with name tag"
      },
      content: ["Hello! My name is Anna."],
      audio: {
        text: "Hello! My name is Anna. Nice to meet you!"
      },
      tags: ["character", "introduction"],
      xpReward: 5
    },
    {
      id: "slide-9",
      type: "target_language",
      prompt: "Meet Tom! 👦",
      instructions: "Tom will introduce himself. Listen!",
      media: {
        type: "image",
        url: characterTom,
        alt: "Character Tom with name tag"
      },
      content: ["Hi! My name is Tom."],
      audio: {
        text: "Hi! My name is Tom. Nice to meet you!"
      },
      tags: ["character", "introduction"],
      xpReward: 5
    },

    // === STAGE 3: PRACTICE (8 min) - Pair Practice / Role-Play ===
    {
      id: "slide-10",
      type: "controlled_practice",
      prompt: "Your Turn! My name is ____",
      instructions: "Complete the sentence with YOUR name!",
      interactiveElements: {
        type: "fill-blank",
        template: "My name is ____.",
        correctAnswerType: "any-text"
      },
      audio: {
        text: "Now it's your turn! Type your name to complete the sentence: My name is..."
      },
      tags: ["practice", "writing", "introduction"],
      xpReward: 15
    },
    {
      id: "slide-11",
      type: "controlled_practice",
      prompt: "Let's Practice! 🗣️",
      instructions: "Choose the correct response!",
      options: [
        { id: "opt-1", text: "My name is Anna.", isCorrect: true },
        { id: "opt-2", text: "Your name is Anna.", isCorrect: false },
        { id: "opt-3", text: "Her name is Anna.", isCorrect: false }
      ],
      correct: "opt-1",
      media: {
        type: "image",
        url: characterAnna,
        alt: "Anna introducing herself"
      },
      audio: {
        text: "Anna says: My name is Anna. Which sentence is correct?"
      },
      tags: ["practice", "multiple-choice"],
      xpReward: 10
    },
    {
      id: "slide-12",
      type: "communicative_task",
      prompt: "Role-Play: Meeting Someone New 🤝",
      instructions: "Practice this conversation!",
      content: [
        "Person A: Hello!",
        "Person B: Hi!",
        "Person A: My name is ____. What's your name?",
        "Person B: My name is ____. Nice to meet you!",
        "Person A: Nice to meet you, too!"
      ],
      audio: {
        text: "Let's practice together! Listen to the conversation, then try it yourself!"
      },
      tags: ["role-play", "dialogue"],
      xpReward: 15
    },
    {
      id: "slide-13",
      type: "controlled_practice",
      prompt: "Match the Greeting! 🎯",
      instructions: "Match each question to the correct answer!",
      interactiveElements: {
        type: "matching",
        pairs: [
          { question: "What's your name?", answer: "My name is Sarah." },
          { question: "Hello!", answer: "Hi!" },
          { question: "Nice to meet you!", answer: "Nice to meet you, too!" }
        ]
      },
      audio: {
        text: "Match each greeting with the correct response!"
      },
      tags: ["practice", "matching"],
      xpReward: 15
    },

    // === STAGE 4: GAME (5 min) - Find My Name! / Matching Game ===
    {
      id: "slide-14",
      type: "quiz_multiple_choice",
      prompt: "🎮 Game Time: Who Am I?",
      instructions: "Look at the picture and choose the correct name!",
      media: {
        type: "image",
        url: characterAnna,
        alt: "Character Anna"
      },
      options: [
        { id: "opt-1", text: "Anna", isCorrect: true },
        { id: "opt-2", text: "Tom", isCorrect: false },
        { id: "opt-3", text: "Zahra", isCorrect: false }
      ],
      correct: "opt-1",
      audio: {
        text: "Hello! My name is Anna. Can you find my name?"
      },
      tags: ["game", "quiz"],
      xpReward: 10
    },
    {
      id: "slide-15",
      type: "quiz_multiple_choice",
      prompt: "🎮 Game Time: Who Am I?",
      instructions: "Look at the picture and choose the correct name!",
      media: {
        type: "image",
        url: characterTom,
        alt: "Character Tom"
      },
      options: [
        { id: "opt-1", text: "Anna", isCorrect: false },
        { id: "opt-2", text: "Tom", isCorrect: true },
        { id: "opt-3", text: "Zahra", isCorrect: false }
      ],
      correct: "opt-2",
      audio: {
        text: "Hi! My name is Tom. Can you find my name?"
      },
      tags: ["game", "quiz"],
      xpReward: 10
    },
    {
      id: "slide-16",
      type: "quiz_multiple_choice",
      prompt: "🎮 Complete the Sentence!",
      instructions: "Choose the correct word to complete the greeting!",
      options: [
        { id: "opt-1", text: "Hello", isCorrect: true },
        { id: "opt-2", text: "Goodbye", isCorrect: false },
        { id: "opt-3", text: "Thank you", isCorrect: false }
      ],
      correct: "opt-1",
      content: ["____! My name is Anna."],
      audio: {
        text: "Complete the sentence! ... My name is Anna. Which greeting word should go first?"
      },
      tags: ["game", "fill-blank"],
      xpReward: 10
    },

    // === STAGE 5: WRAP-UP & WRITING (5 min) ===
    {
      id: "slide-17",
      type: "controlled_practice",
      prompt: "📝 Fill in the Blanks!",
      instructions: "Complete these sentences!",
      content: [
        "Hello! My name is ____.",
        "Nice to meet you!",
        "Goodbye!"
      ],
      interactiveElements: {
        type: "fill-blank",
        template: "Hello! My name is ____.",
        correctAnswerType: "any-text"
      },
      audio: {
        text: "Let's review! Complete these sentences with your name!"
      },
      tags: ["review", "writing"],
      xpReward: 10
    },
    {
      id: "slide-18",
      type: "vocabulary_preview",
      prompt: "📚 Vocabulary Review",
      instructions: "Let's review all the words we learned!",
      content: [
        "Hello - A formal greeting",
        "Hi - An informal greeting",
        "Goodbye - A farewell",
        "Name - What you are called",
        "I - Refers to yourself",
        "You - Refers to another person",
        "Nice - Pleasant and friendly"
      ],
      audio: {
        text: "Great job! Let's review the seven words we learned today: Hello, Hi, Goodbye, Name, I, You, and Nice!"
      },
      tags: ["vocabulary", "review"],
      xpReward: 10
    },
    {
      id: "slide-19",
      type: "exit_check",
      prompt: "✅ Check Your Learning!",
      instructions: "Can you do these things now?",
      content: [
        "✓ I can say: Hello! Hi!",
        "✓ I can say: My name is ____.",
        "✓ I can say: Nice to meet you!",
        "✓ I can say: Goodbye!"
      ],
      audio: {
        text: "Let's check what we learned! Can you do all these things now?"
      },
      tags: ["assessment", "review"],
      xpReward: 5
    },
    {
      id: "slide-20",
      type: "exit_check",
      prompt: "🎉 Great Job! Lesson Complete!",
      instructions: "You did amazing! Keep practicing!",
      media: {
        type: "image",
        url: niceToMeetYou,
        alt: "Celebration - lesson complete"
      },
      content: [
        "You learned 7 new words!",
        "You can now introduce yourself!",
        "You can greet people in English!",
        "Keep practicing: Hello! My name is ____. Nice to meet you!"
      ],
      audio: {
        text: "Excellent work! You completed the lesson! Now you can introduce yourself in English. Great job! Goodbye and see you next time!"
      },
      tags: ["completion", "celebration"],
      xpReward: 20
    }
  ]
};
