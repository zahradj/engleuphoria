import { LessonSlides } from "@/types/slides";

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
      "Introduce themselves using 'My name is …'",
      "Greet and respond to greetings",
      "Recognize basic words for introductions and farewells"
    ],
    weights: { accuracy: 60, fluency: 40 }
  },
  slides: [
    {
      id: "slide-1",
      type: "warmup",
      prompt: "My name is ____. Nice to meet you!",
      instructions: "Welcome! Today we will learn how to introduce ourselves in English.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Colorful classroom scene with diverse children waving hello, educational cartoon style, friendly and welcoming, bright colors",
        autoGenerate: true,
        alt: "Children waving hello in a classroom"
      },
      audio: {
        text: "Welcome! Today we will learn how to say hello and introduce ourselves!",
        autoGenerate: true
      },
      accessibility: {
        screenReaderText: "Lesson title: My name is blank. Nice to meet you!",
        highContrast: true,
        largeText: true
      }
    },
    {
      id: "slide-2",
      type: "warmup",
      prompt: "Hello Song 🎵",
      instructions: "Let's warm up! Listen and repeat the greetings.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Group of happy children singing with musical notes, educational illustration, simple and clear",
        autoGenerate: true,
        alt: "Children singing together"
      },
      audio: {
        text: "Hello! Hi! Goodbye! Let's sing together!",
        autoGenerate: true
      }
    },
    {
      id: "slide-3",
      type: "vocabulary_preview",
      prompt: "Practice Time!",
      instructions: "Click each greeting to hear it. Can you say it too?",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Three colorful speech bubbles with Hello, Hi, and Goodbye, educational style",
        autoGenerate: true,
        alt: "Speech bubbles with greetings"
      },
      vocabulary: ["Hello", "Hi", "Goodbye"]
    },
    {
      id: "slide-4",
      type: "target_language",
      prompt: "What will we learn today?",
      instructions: "These are our learning goals for today's lesson.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Three checkmarks with icons representing speaking, greeting, and meeting, colorful and educational",
        autoGenerate: true,
        alt: "Learning objectives with checkmarks"
      },
      content: [
        "✓ Say 'My name is...'",
        "✓ Use Hello, Hi, and Goodbye",
        "✓ Meet new friends"
      ]
    },
    {
      id: "slide-5",
      type: "vocabulary_preview",
      prompt: "Hello!",
      instructions: "This is how we greet people. Listen and repeat.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Large friendly HELLO text with smiling sun and waving hand, educational style, high contrast, simple design",
        autoGenerate: true,
        alt: "Hello greeting with sun"
      },
      audio: {
        text: "Hello",
        autoGenerate: true
      },
      vocabulary: ["Hello"]
    },
    {
      id: "slide-6",
      type: "vocabulary_preview",
      prompt: "Hi!",
      instructions: "Another way to say hello. Listen and repeat.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Casual HI text with friendly children waving, cartoon style, colorful and engaging",
        autoGenerate: true,
        alt: "Hi greeting with children"
      },
      audio: {
        text: "Hi",
        autoGenerate: true
      },
      vocabulary: ["Hi"]
    },
    {
      id: "slide-7",
      type: "vocabulary_preview",
      prompt: "Goodbye!",
      instructions: "How we say farewell. Listen and repeat.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "GOODBYE text with waving hand and sunset, warm colors, educational style",
        autoGenerate: true,
        alt: "Goodbye farewell"
      },
      audio: {
        text: "Goodbye",
        autoGenerate: true
      },
      vocabulary: ["Goodbye"]
    },
    {
      id: "slide-8",
      type: "target_language",
      prompt: "Meet the Teacher",
      instructions: "Listen to how the teacher introduces herself.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Friendly female teacher character pointing to whiteboard, educational cartoon style, professional and warm",
        autoGenerate: true,
        alt: "Teacher introducing herself"
      },
      audio: {
        text: "Hello! My name is Zahra. Nice to meet you!",
        autoGenerate: true
      },
      content: "My name is Zahra."
    },
    {
      id: "slide-9",
      type: "controlled_practice",
      prompt: "Character Introduction: SpongeBob",
      instructions: "Listen to SpongeBob introduce himself!",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "SpongeBob character in educational style, clean simple illustration, waving and smiling, child-friendly",
        autoGenerate: true,
        alt: "SpongeBob waving hello"
      },
      audio: {
        text: "Hello! My name is SpongeBob. Nice to meet you!",
        autoGenerate: true
      }
    },
    {
      id: "slide-10",
      type: "controlled_practice",
      prompt: "Character Introduction: Spider-Man",
      instructions: "Listen to Spider-Man introduce himself!",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Spider-Man character in educational style, friendly pose, child-appropriate, simple design, waving",
        autoGenerate: true,
        alt: "Spider-Man waving hello"
      },
      audio: {
        text: "Hello! My name is Spider-Man. Nice to meet you!",
        autoGenerate: true
      }
    },
    {
      id: "slide-11",
      type: "cloze",
      prompt: "Your Turn!",
      instructions: "Complete the sentence with your name.",
      clozeText: "My name is _____.",
      clozeGaps: [
        { id: "gap-1", correctAnswers: ["[student name]"] }
      ],
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Blank name tag with pencil, colorful and inviting, educational style",
        autoGenerate: true,
        alt: "Name tag for student"
      }
    },
    {
      id: "slide-12",
      type: "controlled_practice",
      prompt: "What's your name?",
      instructions: "Practice asking and answering.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Two children talking to each other, speech bubbles, friendly cartoon style",
        autoGenerate: true,
        alt: "Children asking names"
      },
      audio: {
        text: "What's your name?",
        autoGenerate: true
      },
      content: "What's your name? - My name is ___."
    },
    {
      id: "slide-13",
      type: "roleplay_setup",
      prompt: "Role-Play Setup",
      instructions: "Let's practice a conversation! You can be Student A or Student B.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Two children with role badges labeled A and B, educational illustration",
        autoGenerate: true,
        alt: "Role play setup"
      }
    },
    {
      id: "slide-14",
      type: "communicative_task",
      prompt: "Dialogue A: Teacher and Student",
      instructions: "Practice this conversation with your teacher.",
      content: [
        "Teacher: Hello!",
        "Student: Hello!",
        "Teacher: My name is Zahra. What's your name?",
        "Student: My name is [your name].",
        "Teacher: Nice to meet you!",
        "Student: Nice to meet you, too!"
      ],
      audio: {
        text: "Hello! My name is Zahra. What's your name?",
        autoGenerate: true
      }
    },
    {
      id: "slide-15",
      type: "communicative_task",
      prompt: "Dialogue B: Student to Student",
      instructions: "Practice with a classmate or imagine meeting a new friend.",
      content: [
        "Student A: Hi!",
        "Student B: Hi!",
        "Student A: My name is Anna. What's your name?",
        "Student B: My name is Tom.",
        "Student A: Nice to meet you, Tom!",
        "Student B: Nice to meet you too, Anna!"
      ]
    },
    {
      id: "slide-16",
      type: "match",
      prompt: "Match the Pictures!",
      instructions: "Match each picture to the correct greeting.",
      matchPairs: [
        { id: "pair-1", left: "👋 Waving hand", right: "Hello" },
        { id: "pair-2", left: "🙂 Smiling face", right: "Hi" },
        { id: "pair-3", left: "👋 Goodbye wave", right: "Goodbye" }
      ],
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Colorful matching game layout with cards, educational style",
        autoGenerate: true,
        alt: "Matching game cards"
      }
    },
    {
      id: "slide-17",
      type: "match",
      prompt: "Match Names to Introductions",
      instructions: "Match each character to their introduction.",
      matchPairs: [
        { id: "pair-1", left: "SpongeBob", right: "My name is SpongeBob" },
        { id: "pair-2", left: "Spider-Man", right: "My name is Spider-Man" },
        { id: "pair-3", left: "Zahra", right: "My name is Zahra" }
      ]
    },
    {
      id: "slide-18",
      type: "vocabulary_preview",
      prompt: "Letter A: Phonics Fun 🅰️",
      instructions: "Let's learn the letter A! Listen and repeat.",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Large letter A with ant and apple illustrations, educational phonics style, clear and colorful, child-friendly",
        autoGenerate: true,
        alt: "Letter A with ant and apple"
      },
      audio: {
        text: "A is for Ant. A is for Apple.",
        autoGenerate: true
      },
      vocabulary: ["Ant", "Apple"]
    },
    {
      id: "slide-19",
      type: "drag_drop",
      prompt: "Find My Name! 🎮",
      instructions: "Drag each name to the correct character.",
      dragDropItems: [
        { id: "name-1", text: "SpongeBob", targetId: "char-1" },
        { id: "name-2", text: "Spider-Man", targetId: "char-2" },
        { id: "name-3", text: "Zahra", targetId: "char-3" }
      ],
      dragDropTargets: [
        { id: "char-1", text: "Character 1", acceptsItemIds: ["name-1"] },
        { id: "char-2", text: "Character 2", acceptsItemIds: ["name-2"] },
        { id: "char-3", text: "Character 3", acceptsItemIds: ["name-3"] }
      ],
      gameConfig: {
        theme: "playground",
        difficulty: "easy",
        timeBonus: true
      }
    },
    {
      id: "slide-20",
      type: "drag_drop",
      prompt: "Spinning Wheel Game! 🎡",
      instructions: "Spin the wheel and say hello to the character!",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Colorful spinning wheel with character names, game show style, bright and fun",
        autoGenerate: true,
        alt: "Spinning wheel game"
      },
      gameConfig: {
        theme: "fantasy",
        difficulty: "easy"
      },
      gameWords: ["SpongeBob", "Spider-Man", "Zahra", "Anna", "Tom"]
    },
    {
      id: "slide-21",
      type: "review_consolidation",
      prompt: "Great Job! 🎉",
      instructions: "Let's review what we learned today!",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Happy celebration scene with confetti and stars, children cheering, colorful and joyful",
        autoGenerate: true,
        alt: "Celebration with confetti"
      },
      content: [
        "✓ We learned to say Hello, Hi, and Goodbye",
        "✓ We can introduce ourselves: My name is...",
        "✓ We practiced with SpongeBob and Spider-Man",
        "✓ We learned Letter A: Ant and Apple"
      ],
      audio: {
        text: "Excellent work today! You learned how to introduce yourself in English!",
        autoGenerate: true
      }
    },
    {
      id: "slide-22",
      type: "exit_check",
      prompt: "Homework & Next Lesson",
      instructions: "Practice at home and get ready for our next adventure!",
      media: {
        type: "image",
        url: "placeholder",
        imagePrompt: "Homework checklist with pencil and stars, encouraging and friendly style",
        autoGenerate: true,
        alt: "Homework checklist"
      },
      content: [
        "Practice saying 'My name is...' to family members",
        "Draw yourself and write 'My name is [your name]'",
        "Find 3 things that start with the letter A",
        "Next time: Numbers 1-10 and Colors!"
      ]
    }
  ]
};
