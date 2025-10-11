import { LessonSlides } from '@/types/slides';
import helloGreeting from '@/assets/lessons/unit-0-lesson-1/hello-greeting.png';
import hiGreeting from '@/assets/lessons/unit-0-lesson-1/hi-greeting.png';
import goodbyeGreeting from '@/assets/lessons/unit-0-lesson-1/goodbye-greeting.png';
import spidermanIntro from '@/assets/lessons/unit-0-lesson-1/spiderman-intro.png';
import spongebobIntro from '@/assets/lessons/unit-0-lesson-1/spongebob-intro.png';
import antImage from '@/assets/lessons/unit-0-lesson-1/ant-image.png';
import antWord from '@/assets/lessons/unit-0-lesson-1/ant-word.png';
import appleImage from '@/assets/lessons/unit-0-lesson-1/apple-image.png';
import appleWord from '@/assets/lessons/unit-0-lesson-1/apple-word.png';

export const lesson0_1: LessonSlides = {
  version: "2.0",
  theme: "mist-blue",
  durationMin: 30,
  total_slides: 22,
  metadata: {
    CEFR: "Pre-A1",
    module: 0,
    lesson: 1,
    targets: [
      "Learn personal introductions",
      "Practice basic greetings",
      "Use 'My name is...' structure",
      "Learn polite expressions"
    ],
    weights: {
      accuracy: 60,
      fluency: 40
    }
  },
  slides: [
    {
      id: "slide-1",
      type: "warmup",
      prompt: "My name is ____. Nice to meet you!",
      instructions: "Welcome to your first English lesson! Today we'll learn how to introduce ourselves.",
      media: {
        type: "image",
        url: helloGreeting,
        alt: "Friendly hello greeting illustration"
      },
      tags: ["introduction", "warmup"],
      xpReward: 5
    },
    {
      id: "slide-2",
      type: "vocabulary_preview",
      prompt: "Basic Greetings: Hello vs Hi",
      instructions: "Click on each greeting to hear how to say it!",
      media: {
        type: "image",
        url: hiGreeting,
        alt: "Hi greeting illustration"
      },
      interactiveElements: {
        type: "click-to-reveal",
        items: [
          { word: "Hello", pronunciation: "/həˈloʊ/", usage: "Formal greeting" },
          { word: "Hi", pronunciation: "/haɪ/", usage: "Informal greeting" }
        ]
      },
      tags: ["vocabulary", "greetings"],
      xpReward: 5
    },
    {
      id: "slide-3",
      type: "vocabulary_preview",
      prompt: "Letter A - Ant and Apple",
      instructions: "Let's learn the letter A! Match the word to the picture.",
      media: {
        type: "image",
        url: antImage,
        alt: "Ant illustration for letter A"
      },
      interactiveElements: {
        type: "matching",
        pairs: [
          { word: "Ant", image: antWord },
          { word: "Apple", image: appleWord }
        ]
      },
      tags: ["alphabet", "phonics", "vocabulary"],
      xpReward: 10
    },
    {
      id: "slide-4",
      type: "vocabulary_preview",
      prompt: "Today's Vocabulary",
      instructions: "Click each card to see and hear the word.",
      interactiveElements: {
        type: "flashcards",
        cards: [
          "Hello",
          "Hi",
          "Goodbye",
          "My name is",
          "What's your name?",
          "Nice to meet you"
        ]
      },
      tags: ["vocabulary", "preview"],
      xpReward: 5
    },
    {
      id: "slide-5",
      type: "target_language",
      prompt: "Learning Objectives",
      instructions: "By the end of this lesson, you will be able to:",
      content: [
        "✓ Greet people in English",
        "✓ Introduce yourself",
        "✓ Say your name",
        "✓ Be polite when meeting new people"
      ],
      tags: ["objectives"],
      xpReward: 0
    },
    {
      id: "slide-6",
      type: "target_language",
      prompt: "Meet SpongeBob!",
      instructions: "SpongeBob will teach us how to introduce ourselves. Click to hear him speak.",
      media: {
        type: "image",
        url: spongebobIntro,
        alt: "SpongeBob introducing himself"
      },
      content: ["My name is SpongeBob"],
      interactiveElements: {
        type: "audio-playback",
        text: "My name is SpongeBob"
      },
      tags: ["character", "introduction", "pattern"],
      xpReward: 5
    },
    {
      id: "slide-7",
      type: "target_language",
      prompt: "Meet Spider-Man!",
      instructions: "Now Spider-Man will introduce himself too!",
      media: {
        type: "image",
        url: spidermanIntro,
        alt: "Spider-Man introducing himself"
      },
      content: [
        "Spider-Man: Hello! My name is Spider-Man.",
        "Friend: Hi! My name is Peter. Nice to meet you!",
        "Spider-Man: Nice to meet you too!"
      ],
      interactiveElements: {
        type: "dialogue",
        lines: 3
      },
      tags: ["character", "dialogue", "pattern"],
      xpReward: 5
    },
    {
      id: "slide-8",
      type: "controlled_practice",
      prompt: "Your Turn: My name is ____",
      instructions: "Type your name to complete the sentence.",
      interactiveElements: {
        type: "fill-blank",
        template: "My name is ____.",
        correctAnswerType: "any-text"
      },
      tags: ["practice", "writing", "introduction"],
      xpReward: 10
    },
    {
      id: "slide-9",
      type: "controlled_practice",
      prompt: "Asking Names: What's your name?",
      instructions: "Match the questions to the correct answers.",
      interactiveElements: {
        type: "matching",
        pairs: [
          { question: "What's your name?", answer: "My name is Sarah." },
          { question: "Hello! My name is Tom.", answer: "Hi Tom! Nice to meet you!" }
        ]
      },
      tags: ["practice", "questions", "matching"],
      xpReward: 10
    },
    {
      id: "slide-10",
      type: "communicative_task",
      prompt: "Dialogue Practice",
      instructions: "Let's practice a full conversation! Choose Person A or Person B.",
      content: [
        "Person A: Hello! My name is ____. What's your name?",
        "Person B: Hi! My name is ____. Nice to meet you!",
        "Person A: Nice to meet you too!"
      ],
      interactiveElements: {
        type: "role-play",
        roles: ["Person A", "Person B"]
      },
      tags: ["dialogue", "speaking", "practice"],
      xpReward: 15
    },
    {
      id: "slide-11",
      type: "match",
      prompt: "Greeting Match Game",
      instructions: "Match each greeting word to its picture. You have 60 seconds!",
      interactiveElements: {
        type: "timed-matching",
        timeLimit: 60,
        pairs: [
          { word: "Hello", image: helloGreeting },
          { word: "Hi", image: hiGreeting },
          { word: "Goodbye", image: goodbyeGreeting }
        ]
      },
      tags: ["game", "matching", "vocabulary"],
      xpReward: 15
    },
    {
      id: "slide-12",
      type: "target_language",
      prompt: "Nice to meet you!",
      instructions: "We say 'Nice to meet you!' when we meet someone for the first time.",
      content: [
        "When do we say this?",
        "✓ Meeting someone new",
        "✓ First time introduction",
        "✗ Seeing a friend again"
      ],
      tags: ["polite", "expressions", "culture"],
      xpReward: 5
    },
    {
      id: "slide-13",
      type: "controlled_practice",
      prompt: "Fill in the Blanks",
      instructions: "Complete the sentences with the correct word.",
      interactiveElements: {
        type: "fill-blank-multiple",
        sentences: [
          { template: "___ name is Sarah", answer: "My" },
          { template: "What's your ___?", answer: "name" },
          { template: "Nice to ___ you!", answer: "meet" }
        ]
      },
      tags: ["practice", "grammar", "writing"],
      xpReward: 15
    },
    {
      id: "slide-14",
      type: "listening_comprehension",
      prompt: "Listening Activity",
      instructions: "Listen to 3 mini-dialogues. Who says their name?",
      interactiveElements: {
        type: "listening-quiz",
        dialogues: [
          { text: "Hi! My name is Emma.", question: "Who introduced themselves?", answer: "Emma" },
          { text: "Hello! I'm John. What's your name?", question: "Who asked for a name?", answer: "John" },
          { text: "Nice to meet you, Lisa!", question: "What is the person's name?", answer: "Lisa" }
        ]
      },
      tags: ["listening", "comprehension", "names"],
      xpReward: 15
    },
    {
      id: "slide-15",
      type: "communicative_task",
      prompt: "Speaking Practice",
      instructions: "Look in the mirror and introduce yourself to your teacher!",
      content: [
        "Template:",
        "Hello! My name is ____.",
        "Nice to meet you!"
      ],
      interactiveElements: {
        type: "speaking-prompt",
        recordingAvailable: true
      },
      tags: ["speaking", "production", "practice"],
      xpReward: 10
    },
    {
      id: "slide-16",
      type: "drag_drop",
      prompt: "Spinning Wheel: What's Your Name?",
      instructions: "Spin the wheel and introduce yourself as that character!",
      interactiveElements: {
        type: "spinning-wheel",
        options: [
          "SpongeBob",
          "Spider-Man",
          "Elsa",
          "Mario",
          "Pikachu",
          "Woody"
        ]
      },
      tags: ["game", "fun", "speaking"],
      xpReward: 10
    },
    {
      id: "slide-17",
      type: "match",
      prompt: "Memory Card Game",
      instructions: "Match the greeting pairs. Flip cards to find matches!",
      interactiveElements: {
        type: "memory-cards",
        pairs: [
          { card1: "Hello", card2: "Hi" },
          { card1: "My name is...", card2: "What's your name?" },
          { card1: "Nice to meet you", card2: "Nice to meet you too" }
        ]
      },
      tags: ["game", "memory", "matching"],
      xpReward: 15
    },
    {
      id: "slide-18",
      type: "drag_drop",
      prompt: "Dialogue Builder",
      instructions: "Drag the sentences into the correct order to build a conversation.",
      interactiveElements: {
        type: "sentence-order",
        sentences: [
          "Hello! My name is Tom.",
          "Hi Tom! My name is Sarah.",
          "Nice to meet you, Sarah!",
          "Nice to meet you too!",
          "How are you?",
          "I'm fine, thank you!"
        ]
      },
      tags: ["game", "dialogue", "sequencing"],
      xpReward: 20
    },
    {
      id: "slide-19",
      type: "accuracy_mcq",
      prompt: "Quick Quiz",
      instructions: "Answer these 5 questions to test your knowledge!",
      interactiveElements: {
        type: "multiple-choice-quiz",
        questions: [
          {
            question: "What does 'My name is' mean?",
            options: ["My age is", "I am called", "My friend is"],
            correctAnswer: 1
          },
          {
            question: "When do we say 'Nice to meet you'?",
            options: ["Meeting someone new", "Saying goodbye", "Asking for help"],
            correctAnswer: 0
          },
          {
            question: "Which greeting is more formal?",
            options: ["Hi", "Hello", "Hey"],
            correctAnswer: 1
          },
          {
            question: "Fill in: Hello! ___ name is Tom.",
            options: ["Your", "My", "His"],
            correctAnswer: 1
          },
          {
            question: "Choose the polite response:",
            options: ["Bye", "Nice to meet you too", "What?"],
            correctAnswer: 1
          }
        ]
      },
      tags: ["quiz", "assessment", "review"],
      xpReward: 25
    },
    {
      id: "slide-20",
      type: "review_consolidation",
      prompt: "Goodbye!",
      instructions: "Great job today! Remember to practice at home.",
      media: {
        type: "image",
        url: goodbyeGreeting,
        alt: "Goodbye greeting illustration"
      },
      content: [
        "Goodbye! See you later!",
        "Practice saying: Hello, My name is ___, Nice to meet you!"
      ],
      tags: ["closing", "farewell"],
      xpReward: 5
    },
    {
      id: "slide-21",
      type: "review_consolidation",
      prompt: "What We Learned Today",
      instructions: "Let's review everything we learned!",
      content: [
        "✓ Greetings: Hello, Hi, Goodbye",
        "✓ 'My name is ____'",
        "✓ 'What's your name?'",
        "✓ 'Nice to meet you!'",
        "✓ Letter A: Ant, Apple"
      ],
      interactiveElements: {
        type: "achievement-unlock",
        badge: "Greetings Master"
      },
      tags: ["summary", "review", "achievement"],
      xpReward: 10
    },
    {
      id: "slide-22",
      type: "review_consolidation",
      prompt: "Homework & Practice",
      instructions: "Keep practicing to become an English expert!",
      content: [
        "📝 Homework:",
        "1. Introduce yourself to 3 people",
        "2. Draw yourself with a speech bubble: 'My name is ____'",
        "3. Say 'Hello' and 'Goodbye' to your family",
        "",
        "🎯 Next Lesson: How old are you?"
      ],
      tags: ["homework", "practice", "preview"],
      xpReward: 0
    }
  ],
  slideOrder: [
    "slide-1", "slide-2", "slide-3", "slide-4", "slide-5", "slide-6",
    "slide-7", "slide-8", "slide-9", "slide-10", "slide-11", "slide-12",
    "slide-13", "slide-14", "slide-15", "slide-16", "slide-17", "slide-18",
    "slide-19", "slide-20", "slide-21", "slide-22"
  ],
  lastModified: new Date().toISOString()
};
