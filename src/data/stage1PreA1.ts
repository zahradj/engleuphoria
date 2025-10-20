import { Unit } from '@/types/englishJourney';

export const STAGE_1_PRE_A1: Unit[] = [
  {
    id: "pre-a1-unit-1",
    unitNumber: 1,
    topic: "Hello!",
    keyVocabulary: ["hello", "goodbye", "name", "teacher", "friend"],
    grammarFocus: ["My name is...", "What's your name?"],
    functionLanguage: ["Greetings", "Introductions", "Farewells"],
    goal: "Greet and introduce self",
    
    listening: {
      description: "Listen to greetings and respond appropriately",
      tasks: [
        "Listen to 'Hello Song' and clap along",
        "Identify greeting words in audio clips",
        "Listen and point to the correct greeting picture"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Practice saying hello and introducing yourself",
      tasks: [
        "Choral repetition: Hello, My name is...",
        "Pair work: Greet your partner",
        "Circle time: Introduce yourself to the class"
      ],
      duration: 10
    },
    
    reading: {
      description: "Recognize greeting words and names",
      tasks: [
        "Match greeting words to pictures",
        "Read name tags with teacher support",
        "Picture book: 'Hello, Friends!'"
      ],
      duration: 7
    },
    
    writing: {
      description: "Trace and write simple greeting words",
      tasks: [
        "Trace 'Hello' and 'Goodbye'",
        "Write your own name with support",
        "Draw and label: My friend"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Teacher models greeting with puppet",
        "Show flashcards: hello, goodbye, friend",
        "Play 'Hello Song' with gestures"
      ],
      materials: ["Flashcards", "Hand puppet", "Hello Song audio"],
      teacherInstructions: "Use cheerful tone, exaggerated gestures, and positive reinforcement. Model each greeting multiple times before asking students to repeat."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Game: 'Pass the Ball Greetings' - say hello when catching",
        "Memory game: Match greeting words",
        "Role-play: Meet a new friend"
      ],
      materials: ["Soft ball", "Memory cards", "Name tags"],
      teacherInstructions: "Keep activities short and energetic. Praise every attempt. Use visual cues and gestures to support understanding."
    },
    
    production: {
      duration: 8,
      activities: [
        "Students walk around greeting classmates",
        "Create 'Hello' poster with drawings",
        "Show & tell: My name is... I like..."
      ],
      materials: ["Crayons", "Large paper", "Stickers"],
      teacherInstructions: "Encourage free expression. Accept approximations. Take photos for portfolio. Celebrate every child's contribution."
    },
    
    gamesActivities: [
      {
        id: "hello-memory",
        name: "Hello Memory Match",
        type: "memory",
        description: "Match greeting words to pictures",
        duration: 10
      },
      {
        id: "name-bingo",
        name: "Name Bingo",
        type: "interactive",
        description: "Listen for names and mark your bingo card",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Little Speaker 🌟", "Hello Master 👋"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m1", name: "Hello Flashcards", type: "flashcard", downloadable: true },
      { id: "m2", name: "Hello Song", type: "audio", downloadable: true },
      { id: "m3", name: "Name Tag Templates", type: "pdf", downloadable: true },
      { id: "m4", name: "Hello Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "This is the first unit - focus on creating a warm, welcoming atmosphere. Use lots of praise, gestures, and visual support. Keep instructions simple. Allow movement and play."
  },
  
  {
    id: "pre-a1-unit-2",
    unitNumber: 2,
    topic: "My Classroom",
    keyVocabulary: ["book", "pencil", "bag", "chair", "desk", "door", "window"],
    grammarFocus: ["It's a...", "I have a..."],
    functionLanguage: ["Identifying objects", "Classroom instructions"],
    goal: "Identify classroom objects and follow simple instructions",
    
    listening: {
      description: "Listen and identify classroom objects",
      tasks: [
        "Listen to 'Classroom Song'",
        "Simon Says with classroom objects",
        "Listen and touch the correct object"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Name classroom objects",
      tasks: [
        "Point and say: It's a book",
        "What's this? drill",
        "Show and tell: My pencil case"
      ],
      duration: 10
    },
    
    reading: {
      description: "Match words to classroom objects",
      tasks: [
        "Label the classroom poster",
        "Word-picture matching",
        "Read simple sentences: It's a desk"
      ],
      duration: 7
    },
    
    writing: {
      description: "Trace and copy classroom vocabulary",
      tasks: [
        "Trace: book, bag, chair",
        "Complete: I have a ___",
        "Draw and label your favorite classroom object"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Real object realia: Show actual classroom items",
        "Flashcard presentation with repetition",
        "Classroom tour: Point and name"
      ],
      materials: ["Real classroom objects", "Flashcards", "Pointer"],
      teacherInstructions: "Use Total Physical Response (TPR). Hold up real objects while saying the word. Have students touch and hold objects."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Game: 'Find the Object' scavenger hunt",
        "Pair work: Point and say",
        "Memory game: Classroom objects"
      ],
      materials: ["Object cards", "Classroom items", "Memory game cards"],
      teacherInstructions: "Make it kinesthetic - students should move, touch, and interact with objects. Keep energy high."
    },
    
    production: {
      duration: 8,
      activities: [
        "Create 'My Classroom' picture dictionary",
        "Walk and talk: Show me a...",
        "Classroom label project"
      ],
      materials: ["Paper", "Crayons", "Label stickers"],
      teacherInstructions: "Let students create personalized classroom dictionaries. Display their work proudly."
    },
    
    gamesActivities: [
      {
        id: "classroom-memory",
        name: "Classroom Memory",
        type: "memory",
        description: "Match object words to pictures",
        duration: 10
      },
      {
        id: "find-it",
        name: "Find It Fast!",
        type: "interactive",
        description: "Race to find and touch the named object",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Classroom Expert 📚"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m5", name: "Classroom Flashcards", type: "flashcard", downloadable: true },
      { id: "m6", name: "Classroom Song", type: "audio", downloadable: true },
      { id: "m7", name: "Label Templates", type: "pdf", downloadable: true },
      { id: "m8", name: "Classroom Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Use real objects whenever possible. This unit works well with hands-on activities. Consider creating a permanent labeled classroom."
  },
  
  {
    id: "pre-a1-unit-3",
    unitNumber: 3,
    topic: "Colors & Shapes",
    keyVocabulary: ["red", "blue", "yellow", "green", "circle", "square", "triangle"],
    grammarFocus: ["What color is it?", "It's..."],
    functionLanguage: ["Describing colors", "Identifying shapes"],
    goal: "Name colors and basic shapes",
    
    listening: {
      description: "Identify colors and shapes by listening",
      tasks: [
        "Color song with movements",
        "Listen and point to the color",
        "Shape sound game"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Say colors and shapes",
      tasks: [
        "What color is it? drill",
        "I spy colors game",
        "Describe your drawing"
      ],
      duration: 10
    },
    
    reading: {
      description: "Read color and shape words",
      tasks: [
        "Match color words to crayons",
        "Shape word recognition",
        "Read: The red circle"
      ],
      duration: 7
    },
    
    writing: {
      description: "Write color and shape words",
      tasks: [
        "Trace color words",
        "Color by word",
        "Draw and write: My favorite color is..."
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Color wheel presentation",
        "Shape flashcards with gestures (trace in air)",
        "Color mixing demonstration"
      ],
      materials: ["Color wheel", "Shape flashcards", "Colored paper"],
      teacherInstructions: "Make it multisensory - use colored objects, shape cutouts, and movement. Trace shapes in the air together."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Color sorting race",
        "Shape hunt in classroom",
        "Memory match: Colors and shapes"
      ],
      materials: ["Colored objects", "Shape cutouts", "Memory cards"],
      teacherInstructions: "Use lots of repetition through games. Encourage peer teaching."
    },
    
    production: {
      duration: 8,
      activities: [
        "Create color monster",
        "Shape collage project",
        "My favorite color presentation"
      ],
      materials: ["Construction paper", "Glue", "Safety scissors"],
      teacherInstructions: "Display all artwork. Encourage students to describe their creations using target language."
    },
    
    gamesActivities: [
      {
        id: "color-spin",
        name: "Color Wheel Spin",
        type: "interactive",
        description: "Spin and name the color",
        duration: 10
      },
      {
        id: "shape-match",
        name: "Shape Matching",
        type: "matching",
        description: "Match shapes to real objects",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Color Master 🌈", "Shape Star ⭐"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m9", name: "Color Flashcards", type: "flashcard", downloadable: true },
      { id: "m10", name: "Color Song", type: "audio", downloadable: true },
      { id: "m11", name: "Shape Templates", type: "pdf", downloadable: true },
      { id: "m12", name: "Color & Shape Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Very visual unit - use lots of colorful materials. Great opportunity for art integration."
  },
  
  {
    id: "pre-a1-unit-4",
    unitNumber: 4,
    topic: "Numbers & Toys",
    keyVocabulary: ["one", "two", "three", "four", "five", "ball", "doll", "car", "teddy"],
    grammarFocus: ["How many?", "I have..."],
    functionLanguage: ["Counting", "Describing toys"],
    goal: "Count to 10 and describe toys",
    
    listening: {
      description: "Listen and count",
      tasks: [
        "Number song 1-10",
        "Listen and show fingers",
        "How many toys? listening game"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Say numbers and toy names",
      tasks: [
        "Count aloud together",
        "I have... toy show and tell",
        "Number chain game"
      ],
      duration: 10
    },
    
    reading: {
      description: "Recognize number words",
      tasks: [
        "Match number words to digits",
        "Read counting books",
        "Toy picture labels"
      ],
      duration: 7
    },
    
    writing: {
      description: "Write numbers and toy words",
      tasks: [
        "Trace numbers 1-5",
        "Write: I have ___ toys",
        "Draw and count activity"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Number flashcards with objects",
        "Toy realia presentation",
        "Counting song with movements"
      ],
      materials: ["Number cards", "Toy collection", "Number song audio"],
      teacherInstructions: "Use manipulatives for counting. Bring real toys. Make counting physical and fun."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Counting game: Pass the toy",
        "How many? pair work",
        "Toy shop role-play"
      ],
      materials: ["Toys", "Play money", "Shopping basket"],
      teacherInstructions: "Lots of hands-on counting with real objects. Role-play builds confidence."
    },
    
    production: {
      duration: 8,
      activities: [
        "My toys poster: Draw and count",
        "Toy survey: How many students have...?",
        "Create number book"
      ],
      materials: ["Paper", "Crayons", "Toy pictures"],
      teacherInstructions: "Let students share about their own toys. Make it personal and engaging."
    },
    
    gamesActivities: [
      {
        id: "number-bingo",
        name: "Number Bingo",
        type: "interactive",
        description: "Listen and mark numbers",
        duration: 10
      },
      {
        id: "toy-memory",
        name: "Toy Memory",
        type: "memory",
        description: "Match toy pairs",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Counting Champion 🔢"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m13", name: "Number Flashcards 1-10", type: "flashcard", downloadable: true },
      { id: "m14", name: "Number Song", type: "audio", downloadable: true },
      { id: "m15", name: "Toy Picture Cards", type: "pdf", downloadable: true },
      { id: "m16", name: "Counting Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Counting is a core skill - lots of practice needed. Make it fun and repetitive."
  },
  
  {
    id: "pre-a1-unit-5",
    unitNumber: 5,
    topic: "My Family",
    keyVocabulary: ["mom", "dad", "sister", "brother", "grandmother", "grandfather", "baby"],
    grammarFocus: ["This is my...", "I love my..."],
    functionLanguage: ["Talking about family", "Showing affection"],
    goal: "Talk about family members",
    
    listening: {
      description: "Identify family members",
      tasks: [
        "Family song",
        "Listen and point to family photos",
        "Who is it? guessing game"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Introduce family members",
      tasks: [
        "This is my... presentation",
        "Family photo description",
        "I love my... sharing circle"
      ],
      duration: 10
    },
    
    reading: {
      description: "Read family words",
      tasks: [
        "Family tree labels",
        "Family story book",
        "Match family words to pictures"
      ],
      duration: 7
    },
    
    writing: {
      description: "Write about family",
      tasks: [
        "Trace family words",
        "Complete: This is my ___",
        "Draw and label your family"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Teacher's family photo presentation",
        "Family flashcards",
        "Family song with gestures"
      ],
      materials: ["Family photos", "Flashcards", "Family song audio"],
      teacherInstructions: "Be sensitive to diverse family structures. Use inclusive language. Share your own family to build connection."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Family tree matching",
        "Who's missing? memory game",
        "Family role-play"
      ],
      materials: ["Family tree template", "Memory cards", "Role-play props"],
      teacherInstructions: "Celebrate all family types. Focus on love and relationships, not structure."
    },
    
    production: {
      duration: 8,
      activities: [
        "Create My Family book",
        "Family photo presentation",
        "Family tree poster"
      ],
      materials: ["Paper", "Photos/drawings", "Glue", "Markers"],
      teacherInstructions: "This is personal - let students share what they're comfortable with. Display with pride."
    },
    
    gamesActivities: [
      {
        id: "family-match",
        name: "Family Matching",
        type: "matching",
        description: "Match family members to descriptions",
        duration: 10
      },
      {
        id: "family-bingo",
        name: "Family Bingo",
        type: "interactive",
        description: "Family member bingo game",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Family Star 👨‍👩‍👧‍👦"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m17", name: "Family Flashcards", type: "flashcard", downloadable: true },
      { id: "m18", name: "Family Song", type: "audio", downloadable: true },
      { id: "m19", name: "Family Tree Template", type: "pdf", downloadable: true },
      { id: "m20", name: "Family Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Sensitive topic - be inclusive of all family types. Focus on positive relationships."
  },
  
  {
    id: "pre-a1-unit-6",
    unitNumber: 6,
    topic: "Feelings",
    keyVocabulary: ["happy", "sad", "angry", "tired", "excited", "scared"],
    grammarFocus: ["I'm...", "Are you...?", "He's/She's..."],
    functionLanguage: ["Expressing emotions", "Asking about feelings"],
    goal: "Express and recognize feelings",
    
    listening: {
      description: "Identify feelings in voices",
      tasks: [
        "Feelings song",
        "Listen to tone - how do they feel?",
        "Story with emotions"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Express feelings",
      tasks: [
        "I'm happy/sad drill",
        "How do you feel today?",
        "Acting out emotions"
      ],
      duration: 10
    },
    
    reading: {
      description: "Read feeling words",
      tasks: [
        "Feeling faces matching",
        "Emotion story book",
        "Read: I'm happy"
      ],
      duration: 7
    },
    
    writing: {
      description: "Write about feelings",
      tasks: [
        "Trace feeling words",
        "Today I feel...",
        "Draw emotion faces and label"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Teacher models emotions with face",
        "Feeling face flashcards",
        "Emotion mirror game"
      ],
      materials: ["Emotion cards", "Mirror", "Feelings song"],
      teacherInstructions: "Model exaggerated facial expressions. Make it safe to express all feelings."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Emotion charades",
        "Feeling faces memory",
        "How does he/she feel? pictures"
      ],
      materials: ["Emotion cards", "Storybook", "Memory game"],
      teacherInstructions: "Validate all emotions. Use this for social-emotional learning too."
    },
    
    production: {
      duration: 8,
      activities: [
        "My feelings book",
        "Emotion wheel craft",
        "When I'm happy/sad presentation"
      ],
      materials: ["Paper plates", "Markers", "Craft supplies"],
      teacherInstructions: "Great opportunity for SEL integration. Celebrate emotional expression."
    },
    
    gamesActivities: [
      {
        id: "emotion-charades",
        name: "Emotion Charades",
        type: "role-play",
        description: "Act out and guess emotions",
        duration: 10
      },
      {
        id: "feeling-match",
        name: "Feeling Match",
        type: "matching",
        description: "Match faces to situations",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Feelings Friend 😊"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m21", name: "Emotion Flashcards", type: "flashcard", downloadable: true },
      { id: "m22", name: "Feelings Song", type: "audio", downloadable: true },
      { id: "m23", name: "Emotion Wheel Template", type: "pdf", downloadable: true },
      { id: "m24", name: "Feelings Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Important for emotional development. Create safe space for expression."
  },
  
  {
    id: "pre-a1-unit-7",
    unitNumber: 7,
    topic: "Food Time",
    keyVocabulary: ["apple", "banana", "milk", "bread", "water", "pizza", "cookie"],
    grammarFocus: ["I like...", "I don't like..."],
    functionLanguage: ["Expressing preferences", "Food requests"],
    goal: "Talk about food likes and dislikes",
    
    listening: {
      description: "Identify foods by listening",
      tasks: [
        "Food song",
        "Listen and point to foods",
        "Do you like...? comprehension"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Express food preferences",
      tasks: [
        "I like/don't like drill",
        "Food survey: Do you like...?",
        "Restaurant role-play"
      ],
      duration: 10
    },
    
    reading: {
      description: "Read food words",
      tasks: [
        "Menu reading",
        "Food labels matching",
        "I like pizza. story"
      ],
      duration: 7
    },
    
    writing: {
      description: "Write about favorite foods",
      tasks: [
        "Trace food words",
        "I like ___ worksheet",
        "Draw and write: My favorite food"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Food realia or plastic foods",
        "Flashcard presentation",
        "Food tasting (if possible)"
      ],
      materials: ["Food pictures", "Plastic food", "Food flashcards"],
      teacherInstructions: "Use real food pictures. Be aware of allergies and dietary restrictions."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Food memory game",
        "Restaurant role-play",
        "Food sorting: like/don't like"
      ],
      materials: ["Food cards", "Play dishes", "Menu props"],
      teacherInstructions: "Make it interactive and fun. Role-plays build confidence."
    },
    
    production: {
      duration: 8,
      activities: [
        "My favorite foods poster",
        "Class food survey",
        "Healthy plate project"
      ],
      materials: ["Paper", "Food pictures", "Glue"],
      teacherInstructions: "Connect to health education. Respect all food preferences."
    },
    
    gamesActivities: [
      {
        id: "food-memory",
        name: "Food Memory",
        type: "memory",
        description: "Match food pairs",
        duration: 10
      },
      {
        id: "restaurant-play",
        name: "Restaurant Play",
        type: "role-play",
        description: "Order food at restaurant",
        duration: 8
      }
    ],
    
    xpReward: 100,
    badges: ["Food Expert 🍎"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m25", name: "Food Flashcards", type: "flashcard", downloadable: true },
      { id: "m26", name: "Food Song", type: "audio", downloadable: true },
      { id: "m27", name: "Restaurant Menu Template", type: "pdf", downloadable: true },
      { id: "m28", name: "Food Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Fun, relatable topic. Great for role-plays. Be culturally sensitive."
  },
  
  {
    id: "pre-a1-unit-8",
    unitNumber: 8,
    topic: "Animals",
    keyVocabulary: ["cat", "dog", "fish", "bird", "rabbit", "lion", "elephant"],
    grammarFocus: ["It's a...", "I like..."],
    functionLanguage: ["Identifying animals", "Animal sounds"],
    goal: "Identify animals and make animal sounds",
    
    listening: {
      description: "Listen to animal sounds",
      tasks: [
        "Animal sounds guessing game",
        "Old MacDonald song",
        "Listen and identify animals"
      ],
      duration: 8
    },
    
    speaking: {
      description: "Name animals and sounds",
      tasks: [
        "Animal name drill",
        "What animal is it? game",
        "My favorite animal presentation"
      ],
      duration: 10
    },
    
    reading: {
      description: "Read animal words",
      tasks: [
        "Animal picture-word matching",
        "Animal story book",
        "Zoo labels reading"
      ],
      duration: 7
    },
    
    writing: {
      description: "Write animal words",
      tasks: [
        "Trace animal names",
        "Complete: I like ___",
        "Draw and label zoo animals"
      ],
      duration: 5
    },
    
    presentation: {
      duration: 10,
      activities: [
        "Animal flashcards with sounds",
        "Animal movement demonstration",
        "Animal song with actions"
      ],
      materials: ["Animal flashcards", "Animal sounds audio", "Stuffed animals"],
      teacherInstructions: "Make animal sounds together. Act like animals. Make it playful and active."
    },
    
    practice: {
      duration: 12,
      activities: [
        "Animal sounds game",
        "Zoo visit role-play",
        "Animal charades"
      ],
      materials: ["Animal cards", "Zoo props", "Animal masks"],
      teacherInstructions: "Lots of movement and sounds. Kids love acting like animals."
    },
    
    production: {
      duration: 8,
      activities: [
        "Create My Zoo book",
        "Animal mask craft",
        "Animal parade show"
      ],
      materials: ["Paper plates", "Craft materials", "Crayons"],
      teacherInstructions: "End with animal parade! Let students show off their animal knowledge."
    },
    
    gamesActivities: [
      {
        id: "animal-sounds",
        name: "Animal Sounds Match",
        type: "matching",
        description: "Match animals to their sounds",
        duration: 10
      },
      {
        id: "animal-charades",
        name: "Animal Charades",
        type: "role-play",
        description: "Act like animals",
        duration: 8
      }
    ],
    
    xpReward: 150,
    badges: ["Animal Expert 🦁", "Little Speaker Award 🌟"],
    estimatedDuration: 30,
    
    materials: [
      { id: "m29", name: "Animal Flashcards", type: "flashcard", downloadable: true },
      { id: "m30", name: "Animal Sounds Audio", type: "audio", downloadable: true },
      { id: "m31", name: "Zoo Map Template", type: "pdf", downloadable: true },
      { id: "m32", name: "Animal Worksheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Final unit of Stage 1! Celebrate completion. This is a fun, active unit that reviews key structures."
  }
];
