export interface SlideContent {
  id: string;
  type: string;
  prompt: string;
  instructions: string;
  interactiveElements?: string[];
  teacherNotes?: string;
  accessibility: {
    screenReaderText: string;
    highContrast: boolean;
    largeText: boolean;
  };
}

export const createUniversalSlideContent = (lesson: {
  title: string;
  vocabulary: string[];
  grammar: string[];
  objectives: string[];
  level: string;
  topic: string;
}): SlideContent[] => {
  
  return [
    // ========== WARM-UP (2-3 SLIDES) ==========
    {
      id: "slide-1",
      type: "warmup",
      prompt: `Welcome to ${lesson.title}!`,
      instructions: `Let's start with an energizing warm-up! Look around the room and greet your classmates. Try using different ways to say hello!`,
      interactiveElements: [
        "Wave to 3 different people",
        "Say 'Good morning/afternoon' to someone",
        "Give a friendly smile and nod"
      ],
      teacherNotes: "Encourage students to move around and interact. Create a welcoming atmosphere.",
      accessibility: {
        screenReaderText: "Warm-up greeting activity to start the lesson",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-2", 
      type: "warmup",
      prompt: "Quick Brain Warm-up",
      instructions: `Think about what you already know about ${lesson.topic}. Share one word or idea with a partner!`,
      interactiveElements: [
        "Think for 30 seconds",
        "Share with your neighbor", 
        "Listen to their idea too"
      ],
      teacherNotes: "This activates prior knowledge and gets students thinking about the topic.",
      accessibility: {
        screenReaderText: "Brain activation exercise about today's topic",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-3",
      type: "warmup", 
      prompt: "Energy Check!",
      instructions: "How are you feeling today? Show me with your body! Stand up if you're excited, sit if you're calm, stretch if you're tired!",
      interactiveElements: [
        "Stand up for excited",
        "Sit down for calm",
        "Stretch for tired"
      ],
      teacherNotes: "Physical movement helps gauge student energy and engagement levels.",
      accessibility: {
        screenReaderText: "Physical energy check-in activity",
        highContrast: false,
        largeText: false
      }
    },

    // ========== INTRODUCTION (2 SLIDES) ==========
    {
      id: "slide-4",
      type: "vocabulary_preview",
      prompt: `Today's Lesson: ${lesson.title}`,
      instructions: `Today we will learn about ${lesson.topic}. By the end of this lesson, you will be able to: ${lesson.objectives.join(', ')}`,
      interactiveElements: [
        "Read objectives together",
        "Ask questions if unclear",
        "Think about why this is useful"
      ],
      teacherNotes: "Make sure students understand what they will achieve today.",
      accessibility: {
        screenReaderText: "Lesson objectives and goals overview",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-5",
      type: "target_language",
      prompt: "What We'll Discover Today",
      instructions: `Key words: ${lesson.vocabulary.slice(0, 6).join(', ')}. Grammar focus: ${lesson.grammar[0] || 'sentence patterns'}. Get ready for an exciting learning journey!`,
      interactiveElements: [
        "Listen to key vocabulary",
        "Repeat new words",
        "Ask about pronunciation"
      ],
      teacherNotes: "Preview helps students mentally prepare for new content.",
      accessibility: {
        screenReaderText: "Preview of key vocabulary and grammar",
        highContrast: false,
        largeText: false
      }
    },

    // ========== PRESENTATION/INPUT (5-6 SLIDES) ==========
    {
      id: "slide-6",
      type: "vocabulary_preview",
      prompt: "New Vocabulary",
      instructions: `Let's learn these important words: ${lesson.vocabulary.join(', ')}. Listen carefully and repeat after me. Notice the pronunciation and meaning.`,
      interactiveElements: [
        "Listen to each word",
        "Repeat pronunciation",
        "Ask about meanings"
      ],
      teacherNotes: "Use gestures, images, or real objects to make vocabulary memorable.",
      accessibility: {
        screenReaderText: "New vocabulary presentation with pronunciation practice",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-7",
      type: "vocabulary_preview",
      prompt: "Vocabulary in Context", 
      instructions: `See how we use these words: "${lesson.vocabulary[0] || 'word'}" appears in sentences like these. Context helps us understand meaning better.`,
      interactiveElements: [
        "Read example sentences",
        "Identify the new words",
        "Guess meanings from context"
      ],
      teacherNotes: "Provide 2-3 clear example sentences for each key vocabulary word.",
      accessibility: {
        screenReaderText: "Vocabulary words shown in context sentences",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-8",
      type: "grammar_focus",
      prompt: "Grammar Focus",
      instructions: `Today's grammar pattern: ${lesson.grammar[0] || 'sentence structure'}. Look at these examples and notice the pattern.`,
      interactiveElements: [
        "Observe the pattern",
        "Compare different examples", 
        "Ask clarification questions"
      ],
      teacherNotes: "Start with simple, clear examples. Build complexity gradually.",
      accessibility: {
        screenReaderText: "Grammar pattern introduction with examples",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-9",
      type: "sentence_builder",
      prompt: "Building Sentences",
      instructions: "Let's build sentences together using our new vocabulary and grammar. Watch how the pieces fit together!",
      interactiveElements: [
        "Follow sentence construction",
        "Suggest words for blanks",
        "Create variations together"
      ],
      teacherNotes: "Guide students through sentence construction step by step.",
      accessibility: {
        screenReaderText: "Interactive sentence building demonstration",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-10",
      type: "listening_comprehension",
      prompt: "Listen and Learn",
      instructions: "Listen to these examples. Pay attention to pronunciation, intonation, and how the words sound together.",
      interactiveElements: [
        "Listen actively",
        "Notice pronunciation",
        "Identify key words"
      ],
      teacherNotes: "Play audio slowly first, then at natural speed. Repeat as needed.",
      accessibility: {
        screenReaderText: "Listening comprehension with pronunciation focus",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-11",
      type: "pronunciation_shadow",
      prompt: "Pronunciation Practice",
      instructions: "Your turn! Repeat after me. Focus on clear pronunciation and natural rhythm. Don't worry about being perfect - practice makes progress!",
      interactiveElements: [
        "Repeat chorally",
        "Practice individually",
        "Help each other"
      ],
      teacherNotes: "Encourage attempts. Provide gentle correction and lots of positive reinforcement.",
      accessibility: {
        screenReaderText: "Student pronunciation practice session",
        highContrast: false,
        largeText: false
      }
    },

    // ========== GUIDED PRACTICE (4-5 SLIDES) ==========
    {
      id: "slide-12",
      type: "accuracy_mcq",
      prompt: "Fill in the Blanks",
      instructions: "Complete these sentences using our new vocabulary. Choose the best word for each blank. Think about meaning and grammar!",
      interactiveElements: [
        "Read each sentence",
        "Choose the best option",
        "Explain your choice"
      ],
      teacherNotes: "Provide immediate feedback. Discuss why other options don't fit.",
      accessibility: {
        screenReaderText: "Fill-in-the-blank exercise with vocabulary",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-13",
      type: "picture_choice",
      prompt: "Match Words and Meanings",
      instructions: "Connect each word with its correct meaning or picture. Use the context clues we learned earlier!",
      interactiveElements: [
        "Look at each option",
        "Make connections",
        "Discuss matches"
      ],
      teacherNotes: "Use clear, culturally appropriate images. Allow discussion between students.",
      accessibility: {
        screenReaderText: "Vocabulary matching exercise with visual aids",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-14",
      type: "transform",
      prompt: "Sentence Ordering",
      instructions: "Put these words in the correct order to make sentences. Remember our grammar pattern!",
      interactiveElements: [
        "Read all the words",
        "Think about word order",
        "Build the sentence step by step"
      ],
      teacherNotes: "Start with shorter sentences. Provide hints about sentence structure.",
      accessibility: {
        screenReaderText: "Sentence ordering and construction activity",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-15",
      type: "error_fix",
      prompt: "Find and Fix Mistakes",
      instructions: "These sentences have small errors. Can you spot them and fix them? Use your new grammar knowledge!",
      interactiveElements: [
        "Read carefully",
        "Identify errors",
        "Suggest corrections"
      ],
      teacherNotes: "Use common learner errors. Explain why the correction is needed.",
      accessibility: {
        screenReaderText: "Error identification and correction exercise",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-16",
      type: "labeling",
      prompt: "Drag and Drop Practice",
      instructions: "Drag the correct words to complete these sentences. Think about grammar and meaning!",
      interactiveElements: [
        "Read the incomplete sentences",
        "Consider each word option",
        "Drag to correct positions"
      ],
      teacherNotes: "This reinforces both vocabulary and grammar patterns simultaneously.",
      accessibility: {
        screenReaderText: "Interactive drag and drop sentence completion",
        highContrast: false,
        largeText: false
      }
    },

    // ========== GAMIFIED ACTIVITIES (3-4 SLIDES) ==========
    {
      id: "slide-17",
      type: "controlled_practice", 
      prompt: "Quick Quiz Challenge!",
      instructions: "Fast-paced quiz time! Answer quickly and have fun. Don't worry about mistakes - this is practice!",
      interactiveElements: [
        "Answer quickly",
        "Celebrate correct answers",
        "Learn from mistakes"
      ],
      teacherNotes: "Keep it light and fun. Focus on participation over perfection.",
      accessibility: {
        screenReaderText: "Quick-fire quiz with immediate feedback",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-18",
      type: "controlled_practice",
      prompt: "Spinning Wheel Q&A",
      instructions: "Spin the wheel and answer the question that appears! Everyone gets a turn. Support each other!",
      interactiveElements: [
        "Wait for your turn",
        "Answer confidently", 
        "Cheer for classmates"
      ],
      teacherNotes: "Ensure questions match current lesson content. Keep energy high and positive.",
      accessibility: {
        screenReaderText: "Interactive spinning wheel question game",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-19",
      type: "roleplay_setup",
      prompt: "Mini Role-Play Setup",
      instructions: "Get ready for role-play! You'll practice using today's vocabulary and grammar in real situations.",
      interactiveElements: [
        "Read your role",
        "Think about your character",
        "Prepare what to say"
      ],
      teacherNotes: "Give clear, simple role descriptions. Allow preparation time.",
      accessibility: {
        screenReaderText: "Role-play activity preparation and setup",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-20",
      type: "fluency_sprint",
      prompt: "Speed Challenge",
      instructions: "How quickly can you use all the new words in sentences? Go for fluency over perfection!",
      interactiveElements: [
        "Use new vocabulary",
        "Speak with confidence",
        "Keep talking flowing"
      ],
      teacherNotes: "Emphasize fluency and confidence. Time should encourage speaking, not stress.",
      accessibility: {
        screenReaderText: "Fluency-building speed speaking exercise",
        highContrast: false,
        largeText: false
      }
    },

    // ========== COMMUNICATION PRACTICE (3-4 SLIDES) ==========
    {
      id: "slide-21",
      type: "communicative_task",
      prompt: "Pair Work Practice",
      instructions: "Work with a partner! Take turns asking and answering questions using today's new language. Help each other!",
      interactiveElements: [
        "Find a partner",
        "Take turns speaking",
        "Give helpful feedback"
      ],
      teacherNotes: "Monitor pairs and provide support. Encourage natural conversation flow.",
      accessibility: {
        screenReaderText: "Paired conversation practice activity",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-22",
      type: "picture_description",
      prompt: "Ask and Answer",
      instructions: "Look at the pictures and ask your partner questions. Answer their questions too. Use our new vocabulary!",
      interactiveElements: [
        "Ask about the pictures",
        "Answer partner's questions",
        "Use new vocabulary"
      ],
      teacherNotes: "Provide interesting, discussion-worthy images. Circulate to assist with vocabulary.",
      accessibility: {
        screenReaderText: "Picture-based question and answer activity",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-23",
      type: "roleplay_setup",
      prompt: "Real-Life Role-Play",
      instructions: "Now practice the role-play we prepared! Act out the situation using everything you've learned today.",
      interactiveElements: [
        "Act out your role",
        "Respond naturally",
        "Use today's language"
      ],
      teacherNotes: "Encourage creativity within the language framework. Focus on communication success.",
      accessibility: {
        screenReaderText: "Real-life scenario role-play performance",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-24",
      type: "communicative_task",
      prompt: "Group Discussion",
      instructions: "Share your thoughts with the whole class! What did you learn? What was interesting? What questions do you have?",
      interactiveElements: [
        "Share your experience",
        "Ask questions",
        "Listen to others"
      ],
      teacherNotes: "Create a supportive environment for sharing. Validate all contributions.",
      accessibility: {
        screenReaderText: "Whole-class discussion and reflection",
        highContrast: false,
        largeText: false
      }
    },

    // ========== REVIEW & WRAP-UP (2-3 SLIDES) ==========
    {
      id: "slide-25",
      type: "review_consolidation",
      prompt: "Today's Key Learning",
      instructions: `Let's review what we accomplished! New vocabulary: ${lesson.vocabulary.slice(0, 4).join(', ')}. Grammar: ${lesson.grammar[0] || 'sentence patterns'}. Great job everyone!`,
      interactiveElements: [
        "Recall new words",
        "Review grammar pattern",
        "Celebrate learning"
      ],
      teacherNotes: "Highlight major accomplishments. Reinforce key learning points.",
      accessibility: {
        screenReaderText: "Lesson summary and key learning review",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-26",
      type: "exit_check",
      prompt: "Quick Exit Check",
      instructions: "Before we finish, show me what you learned! Can you use one new word in a sentence? Can you ask a question using today's grammar?",
      interactiveElements: [
        "Use a new word",
        "Make a sentence",
        "Ask a question"
      ],
      teacherNotes: "This helps assess learning and gives closure to the lesson.",
      accessibility: {
        screenReaderText: "Final learning assessment and demonstration",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-27",
      type: "review_consolidation",
      prompt: "Keep Learning!",
      instructions: `Homework: Practice using today's vocabulary with family or friends. Try to use ${lesson.vocabulary[0] || 'new words'} in real conversations this week!`,
      interactiveElements: [
        "Write down homework",
        "Ask questions about practice",
        "Plan how to practice"
      ],
      teacherNotes: "Provide practical, achievable homework that reinforces today's learning.",
      accessibility: {
        screenReaderText: "Homework assignment and continued practice guidance",
        highContrast: false,
        largeText: false
      }
    }
  ];
};

// Example usage for different lessons:
export const sampleLessons = {
  greetings: {
    title: "Greetings and Introductions",
    vocabulary: ["hello", "hi", "goodbye", "bye", "please", "thank you", "nice to meet you"],
    grammar: ["Simple present with 'be'", "Personal pronouns"],
    objectives: ["Use basic greetings", "Introduce yourself", "Ask simple questions"],
    level: "A1",
    topic: "social interactions"
  },
  
  family: {
    title: "Family Members",
    vocabulary: ["mother", "father", "sister", "brother", "grandmother", "grandfather", "family"],
    grammar: ["Possessive adjectives", "Simple present"],
    objectives: ["Name family members", "Describe family relationships", "Talk about family"],
    level: "A1", 
    topic: "family relationships"
  },
  
  colors: {
    title: "Colors and Descriptions",
    vocabulary: ["red", "blue", "green", "yellow", "black", "white", "color"],
    grammar: ["Adjectives before nouns", "This/that"],
    objectives: ["Name basic colors", "Describe objects", "Express preferences"],
    level: "A1",
    topic: "colors and descriptions"
  }
};