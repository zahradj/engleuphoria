export interface LessonContent {
  id: string;
  title: string;
  duration: number;
  objectives: string[];
  vocabulary: string[];
  grammar: string[];
  skills: string[];
  description: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: LessonContent[];
}

export interface CEFRLevel {
  level: 'Pre-Starter' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  description: string;
  units: Unit[];
}

export const CURRICULUM_STRUCTURE: CEFRLevel[] = [
  {
    level: 'Pre-Starter',
    title: 'Level 1 – Pre-Starter (Pre-A1/A1) Foundations',
    description: 'Duration: ~10 units × 4 lessons each (≈ 40 lessons, 30 min each) | Method: Presentation → Practice → Production → Review',
    units: [
      {
        id: 'pre-starter-unit-1',
        title: 'Unit 1 – Family & Friends',
        description: 'Introduction to family members and basic relationships',
        lessons: [
          {
            id: 'ps-u1-l1',
            title: 'This is my brother / sister',
            duration: 30,
            objectives: ['Use "to be" with family members', 'Introduce family basics', 'Practice family vocabulary'],
            vocabulary: ['brother', 'sister', 'family', 'this is'],
            grammar: ['to be + family basics'],
            skills: ['Speaking', 'Listening', 'Vocabulary'],
            description: 'Introduction to family members using "to be" verb and basic family vocabulary'
          },
          {
            id: 'ps-u1-l2',
            title: 'Mother, father, grandparents',
            duration: 30,
            objectives: ['Expand family vocabulary', 'Learn plurals', 'Practice family introductions'],
            vocabulary: ['mother', 'father', 'grandparents', 'grandmother', 'grandfather'],
            grammar: ['Plurals with family members'],
            skills: ['Speaking', 'Listening', 'Grammar'],
            description: 'Extended family vocabulary with plural forms and family relationships'
          },
          {
            id: 'ps-u1-l3',
            title: 'I have got / I haven\'t got a brother',
            duration: 30,
            objectives: ['Use "have got" structure', 'Make positive and negative sentences', 'Talk about family members'],
            vocabulary: ['have got', 'haven\'t got', 'a', 'an'],
            grammar: ['have got affirmative and negative'],
            skills: ['Speaking', 'Grammar', 'Sentence construction'],
            description: 'Introduction to "have got" for possession with family context'
          },
          {
            id: 'ps-u1-l4',
            title: 'Review Game – My Family Tree',
            duration: 30,
            objectives: ['Review family vocabulary', 'Practice family introductions', 'Consolidate grammar'],
            vocabulary: ['All unit vocabulary'],
            grammar: ['to be + have got review'],
            skills: ['Speaking', 'Listening', 'Games', 'Role-play'],
            description: 'Interactive review through matching, role-play, and chant activities'
          }
        ]
      },
      {
        id: 'pre-starter-unit-2',
        title: 'Unit 2 – My Classroom',
        description: 'Classroom objects and basic questions',
        lessons: [
          {
            id: 'ps-u2-l1',
            title: 'This is a book / pen / bag',
            duration: 30,
            objectives: ['Name classroom objects', 'Use "this is" structure', 'Practice classroom vocabulary'],
            vocabulary: ['book', 'pen', 'bag', 'desk', 'chair', 'board'],
            grammar: ['to be with classroom objects'],
            skills: ['Speaking', 'Listening', 'Vocabulary'],
            description: 'Introduction to classroom objects using "this is" structure'
          },
          {
            id: 'ps-u2-l2',
            title: 'These are my pencils',
            duration: 30,
            objectives: ['Use plural forms', 'Practice "these are"', 'Expand classroom vocabulary'],
            vocabulary: ['pencils', 'books', 'bags', 'these are', 'my'],
            grammar: ['Plurals + these are structure'],
            skills: ['Speaking', 'Grammar', 'Vocabulary'],
            description: 'Plural forms of classroom objects with "these are" structure'
          },
          {
            id: 'ps-u2-l3',
            title: 'What\'s this? It\'s a …',
            duration: 30,
            objectives: ['Ask and answer questions', 'Use "What\'s this?"', 'Practice classroom dialogue'],
            vocabulary: ['What\'s this?', 'It\'s a', 'question', 'answer'],
            grammar: ['Questions + answers with classroom objects'],
            skills: ['Speaking', 'Listening', 'Question formation'],
            description: 'Question and answer practice with classroom objects'
          },
          {
            id: 'ps-u2-l4',
            title: 'Review Quiz – Classroom Hunt',
            duration: 30,
            objectives: ['Review classroom vocabulary', 'Practice questions and answers', 'Play classroom games'],
            vocabulary: ['All unit vocabulary'],
            grammar: ['All unit grammar structures'],
            skills: ['Speaking', 'Listening', 'Games', 'Recognition'],
            description: 'Interactive review with find & match activities and classroom bingo'
          }
        ]
      },
      {
        id: 'pre-starter-unit-3',
        title: 'Unit 3 – My Colors & Numbers',
        description: 'Colors, numbers, and basic counting',
        lessons: [
          {
            id: 'ps-u3-l1',
            title: 'Colors chant',
            duration: 30,
            objectives: ['Learn basic colors', 'Practice pronunciation', 'Use phonics focus'],
            vocabulary: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'orange'],
            grammar: ['Color adjectives'],
            skills: ['Speaking', 'Listening', 'Phonics', 'Chanting'],
            description: 'Introduction to colors through chants with phonics focus'
          },
          {
            id: 'ps-u3-l2',
            title: 'Numbers 1–10',
            duration: 30,
            objectives: ['Count to 10', 'Learn number words', 'Practice counting chants'],
            vocabulary: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            grammar: ['Numbers + plurals'],
            skills: ['Speaking', 'Listening', 'Counting', 'Chanting'],
            description: 'Numbers 1-10 with counting practice and musical chants'
          },
          {
            id: 'ps-u3-l3',
            title: 'How many? I have got 3 books',
            duration: 30,
            objectives: ['Use numbers in context', 'Ask "How many?"', 'Practice counting objects'],
            vocabulary: ['How many?', 'I have got', 'numbers with objects'],
            grammar: ['Numbers in context with have got'],
            skills: ['Speaking', 'Grammar', 'Counting', 'Question formation'],
            description: 'Using numbers in real contexts with "have got" structure'
          },
          {
            id: 'ps-u3-l4',
            title: 'Review Game – Rainbow Numbers Race',
            duration: 30,
            objectives: ['Review colors and numbers', 'Practice counting', 'Play interactive games'],
            vocabulary: ['All colors and numbers'],
            grammar: ['All unit structures'],
            skills: ['Speaking', 'Listening', 'Games', 'Recognition'],
            description: 'Fun review combining colors and numbers through racing activities'
          }
        ]
      },
      {
        id: 'pre-starter-unit-4',
        title: 'Unit 4 – Daily Routines (Part 1)',
        description: 'Basic daily activities and routines',
        lessons: [
          {
            id: 'ps-u4-l1',
            title: 'I wake up / I go to school',
            duration: 30,
            objectives: ['Learn basic daily activities', 'Use simple present tense', 'Practice routine vocabulary'],
            vocabulary: ['wake up', 'go to school', 'get up', 'eat breakfast'],
            grammar: ['Simple present + daily activities'],
            skills: ['Speaking', 'Listening', 'Grammar'],
            description: 'Introduction to daily routines using simple present tense with pictures'
          },
          {
            id: 'ps-u4-l2',
            title: 'Breakfast, lunch, dinner',
            duration: 30,
            objectives: ['Learn meal times', 'Practice daily meals vocabulary', 'Use time expressions'],
            vocabulary: ['breakfast', 'lunch', 'dinner', 'morning', 'afternoon', 'evening'],
            grammar: ['Time expressions with meals'],
            skills: ['Speaking', 'Listening', 'Time concepts'],
            description: 'Daily meals vocabulary with time expressions and routines'
          },
          {
            id: 'ps-u4-l3',
            title: 'My day',
            duration: 30,
            objectives: ['Sequence daily activities', 'Practice simple writing', 'Describe your day'],
            vocabulary: ['first', 'then', 'after', 'finally', 'my day'],
            grammar: ['Sequencing with daily routines'],
            skills: ['Speaking', 'Writing', 'Sequencing'],
            description: 'Sequencing daily activities with simple writing practice'
          },
          {
            id: 'ps-u4-l4',
            title: 'Review – My Day Wheel',
            duration: 30,
            objectives: ['Review daily routines', 'Practice acting out activities', 'Consolidate vocabulary'],
            vocabulary: ['All unit vocabulary'],
            grammar: ['All unit structures'],
            skills: ['Speaking', 'Acting', 'Games', 'Movement'],
            description: 'Interactive review with spinning wheel and acting out daily routines'
          }
        ]
      },
      {
        id: 'pre-starter-unit-5',
        title: 'Unit 5 – Daily Routines (Part 2)',
        description: 'Evening routines and home activities',
        lessons: [
          {
            id: 'ps-u5-l1',
            title: 'I play / I watch TV',
            duration: 30,
            objectives: ['Learn home activities', 'Practice leisure vocabulary', 'Use activity verbs'],
            vocabulary: ['play', 'watch TV', 'read', 'listen to music', 'draw'],
            grammar: ['Simple present with activities'],
            skills: ['Speaking', 'Listening', 'Vocabulary'],
            description: 'Home and leisure activities vocabulary with simple present tense'
          },
          {
            id: 'ps-u5-l2',
            title: 'I go to bed / I sleep',
            duration: 30,
            objectives: ['Learn evening routines', 'Practice bedtime vocabulary', 'Use evening activities'],
            vocabulary: ['go to bed', 'sleep', 'brush teeth', 'take a bath', 'say goodnight'],
            grammar: ['Evening routines with simple present'],
            skills: ['Speaking', 'Listening', 'Routines'],
            description: 'Evening and bedtime routines with related vocabulary'
          },
          {
            id: 'ps-u5-l3',
            title: 'What do you do?',
            duration: 30,
            objectives: ['Ask about daily routines', 'Answer routine questions', 'Practice dialogue'],
            vocabulary: ['What do you do?', 'I...', 'Do you...?', 'Yes, I do / No, I don\'t'],
            grammar: ['Questions about routines + short answers'],
            skills: ['Speaking', 'Listening', 'Question formation', 'Dialogue'],
            description: 'Question and answer practice about daily routines and activities'
          },
          {
            id: 'ps-u5-l4',
            title: 'Review – Routine Bingo',
            duration: 30,
            objectives: ['Review all routine vocabulary', 'Practice guessing games', 'Act out activities'],
            vocabulary: ['All routine vocabulary'],
            grammar: ['All routine structures'],
            skills: ['Speaking', 'Listening', 'Games', 'Acting'],
            description: 'Interactive bingo game with guessing and acting out routine activities'
          }
        ]
      },
      {
        id: 'pre-starter-unit-6',
        title: 'Unit 6 – My World: Animals',
        description: 'Animals, pets, and expressing likes/dislikes',
        lessons: [
          {
            id: 'ps-u6-l1',
            title: 'This is a cat / dog',
            duration: 30,
            objectives: ['Learn animal names', 'Practice animal vocabulary', 'Use "this is" with animals'],
            vocabulary: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'mouse', 'horse', 'cow'],
            grammar: ['This is + animals'],
            skills: ['Speaking', 'Listening', 'Vocabulary', 'Recognition'],
            description: 'Introduction to common animals using "this is" structure'
          },
          {
            id: 'ps-u6-l2',
            title: 'I like / I don\'t like dogs',
            duration: 30,
            objectives: ['Express likes and dislikes', 'Use like/don\'t like', 'Practice preferences'],
            vocabulary: ['like', 'don\'t like', 'love', 'favourite'],
            grammar: ['I like/don\'t like + animals'],
            skills: ['Speaking', 'Grammar', 'Expression of opinion'],
            description: 'Expressing preferences about animals using like/don\'t like'
          },
          {
            id: 'ps-u6-l3',
            title: 'My pet',
            duration: 30,
            objectives: ['Talk about pets', 'Create simple sentences', 'Practice mini-project'],
            vocabulary: ['pet', 'my pet', 'name', 'cute', 'big', 'small'],
            grammar: ['My pet is... / I have a pet'],
            skills: ['Speaking', 'Writing', 'Project work'],
            description: 'Mini-project about pets with simple sentence construction'
          },
          {
            id: 'ps-u6-l4',
            title: 'Review – Animal Safari Game',
            duration: 30,
            objectives: ['Review animal vocabulary', 'Practice animal sounds', 'Play guessing games'],
            vocabulary: ['All animal vocabulary'],
            grammar: ['All unit structures'],
            skills: ['Speaking', 'Listening', 'Games', 'Sound effects'],
            description: 'Interactive safari game with animal guessing and sound effects'
          }
        ]
      },
      {
        id: 'pre-starter-unit-7',
        title: 'Unit 7 – My Body & Clothes',
        description: 'Body parts, clothing, and describing appearance',
        lessons: [
          {
            id: 'ps-u7-l1',
            title: 'Head, eyes, nose …',
            duration: 30,
            objectives: ['Learn body parts', 'Practice body vocabulary', 'Use body part chants'],
            vocabulary: ['head', 'eyes', 'nose', 'mouth', 'ears', 'hands', 'feet', 'hair'],
            grammar: ['Body parts with articles'],
            skills: ['Speaking', 'Listening', 'Chanting', 'Physical recognition'],
            description: 'Body parts vocabulary with chants and physical movements'
          },
          {
            id: 'ps-u7-l2',
            title: 'T-shirt, shoes, dress …',
            duration: 30,
            objectives: ['Learn clothing vocabulary', 'Practice clothes names', 'Use clothing basics'],
            vocabulary: ['t-shirt', 'shoes', 'dress', 'trousers', 'socks', 'hat', 'coat', 'shirt'],
            grammar: ['Clothing vocabulary with articles'],
            skills: ['Speaking', 'Listening', 'Vocabulary', 'Recognition'],
            description: 'Basic clothing vocabulary and clothing identification'
          },
          {
            id: 'ps-u7-l3',
            title: 'What are you wearing?',
            duration: 30,
            objectives: ['Ask about clothing', 'Describe what you\'re wearing', 'Practice clothing dialogue'],
            vocabulary: ['What are you wearing?', 'I\'m wearing', 'wearing', 'today'],
            grammar: ['Present continuous for clothing'],
            skills: ['Speaking', 'Listening', 'Role-play', 'Description'],
            description: 'Question and answer practice about clothing with role-play activities'
          },
          {
            id: 'ps-u7-l4',
            title: 'Review – Dress the Puppet',
            duration: 30,
            objectives: ['Review body parts and clothes', 'Practice dressing activities', 'Interactive dress-up'],
            vocabulary: ['All body parts and clothing'],
            grammar: ['All unit structures'],
            skills: ['Speaking', 'Listening', 'Interactive play', 'Recognition'],
            description: 'Interactive dress-up game combining body parts and clothing vocabulary'
          }
        ]
      },
      {
        id: 'pre-starter-unit-8',
        title: 'Unit 8 – My House & Things',
        description: 'House rooms, furniture, and prepositions of place',
        lessons: [
          {
            id: 'ps-u8-l1',
            title: 'This is my room',
            duration: 30,
            objectives: ['Learn house vocabulary', 'Practice room names', 'Use house basics'],
            vocabulary: ['room', 'bed', 'chair', 'table', 'door', 'window', 'house', 'my room'],
            grammar: ['This is my... with house vocabulary'],
            skills: ['Speaking', 'Listening', 'Vocabulary', 'Description'],
            description: 'Introduction to house and room vocabulary using "this is my" structure'
          },
          {
            id: 'ps-u8-l2',
            title: 'In the kitchen / bathroom',
            duration: 30,
            objectives: ['Expand house vocabulary', 'Learn room-specific items', 'Practice house areas'],
            vocabulary: ['kitchen', 'bathroom', 'living room', 'fridge', 'sink', 'toilet', 'sofa'],
            grammar: ['In the... + room vocabulary'],
            skills: ['Speaking', 'Listening', 'Vocabulary', 'Location'],
            description: 'Expanding house vocabulary with specific rooms and their items'
          },
          {
            id: 'ps-u8-l3',
            title: 'Where is it? It\'s in the …',
            duration: 30,
            objectives: ['Learn prepositions of place', 'Ask about location', 'Practice where questions'],
            vocabulary: ['Where is it?', 'It\'s in', 'on', 'under', 'next to', 'in front of'],
            grammar: ['Prepositions of place with house items'],
            skills: ['Speaking', 'Listening', 'Spatial awareness', 'Question formation'],
            description: 'Prepositions of place for describing location of objects in the house'
          },
          {
            id: 'ps-u8-l4',
            title: 'Review – House Treasure Hunt',
            duration: 30,
            objectives: ['Review house vocabulary', 'Practice location descriptions', 'Play finding games'],
            vocabulary: ['All house vocabulary and prepositions'],
            grammar: ['All unit structures'],
            skills: ['Speaking', 'Listening', 'Games', 'Problem solving'],
            description: 'Interactive treasure hunt game to find objects around the house'
          }
        ]
      },
      {
        id: 'pre-starter-unit-9',
        title: 'Unit 9 – My Friends & Playtime',
        description: 'Friends, sports, toys, and social interaction',
        lessons: [
          {
            id: 'ps-u9-l1',
            title: 'Hello, my friend',
            duration: 30,
            objectives: ['Review greetings', 'Practice friendship vocabulary', 'Connect family and friends'],
            vocabulary: ['friend', 'hello', 'my friend', 'nice to meet you', 'goodbye'],
            grammar: ['Greetings review + friend vocabulary'],
            skills: ['Speaking', 'Listening', 'Social skills', 'Greetings'],
            description: 'Review of greetings with introduction to friendship vocabulary'
          },
          {
            id: 'ps-u9-l2',
            title: 'We play football',
            duration: 30,
            objectives: ['Learn sports vocabulary', 'Practice toy names', 'Use "we" structure'],
            vocabulary: ['football', 'basketball', 'tennis', 'ball', 'toy', 'game', 'play', 'we'],
            grammar: ['We + activity verbs'],
            skills: ['Speaking', 'Listening', 'Vocabulary', 'Group activities'],
            description: 'Sports and toys vocabulary with "we" structure for group activities'
          },
          {
            id: 'ps-u9-l3',
            title: 'Pair-work game: "Find someone who …"',
            duration: 30,
            objectives: ['Practice pair work', 'Use finding activities', 'Practice social interaction'],
            vocabulary: ['Find someone who...', 'Do you...?', 'Yes, I do', 'No, I don\'t'],
            grammar: ['Questions + short answers in context'],
            skills: ['Speaking', 'Listening', 'Social interaction', 'Pair work'],
            description: 'Interactive pair work activity to practice questions and social skills'
          },
          {
            id: 'ps-u9-l4',
            title: 'Review – Friendship Quiz Show',
            duration: 30,
            objectives: ['Review all friendship vocabulary', 'Practice team work', 'Quiz challenge'],
            vocabulary: ['All unit vocabulary'],
            grammar: ['All unit structures'],
            skills: ['Speaking', 'Listening', 'Team work', 'Competition'],
            description: 'Team-based quiz show challenge reviewing friendship and play vocabulary'
          }
        ]
      },
      {
        id: 'pre-starter-unit-10',
        title: 'Unit 10 – Big Review: My English World',
        description: 'Comprehensive review of all units with final project',
        lessons: [
          {
            id: 'ps-u10-l1',
            title: 'Review family, classroom, colors, numbers',
            duration: 30,
            objectives: ['Review Units 1-3', 'Consolidate early vocabulary', 'Practice basic structures'],
            vocabulary: ['Family, classroom, colors, numbers vocabulary'],
            grammar: ['to be, have got, this is, these are'],
            skills: ['Speaking', 'Listening', 'Review', 'Consolidation'],
            description: 'Comprehensive review of the first three units with consolidation activities'
          },
          {
            id: 'ps-u10-l2',
            title: 'Review routines, animals, clothes, house',
            duration: 30,
            objectives: ['Review Units 4-8', 'Consolidate middle vocabulary', 'Practice complex structures'],
            vocabulary: ['Routines, animals, clothes, house vocabulary'],
            grammar: ['Simple present, like/don\'t like, prepositions'],
            skills: ['Speaking', 'Listening', 'Review', 'Integration'],
            description: 'Comprehensive review of units 4-8 with integration of vocabulary and grammar'
          },
          {
            id: 'ps-u10-l3',
            title: 'Show & Tell project: "This is my world"',
            duration: 30,
            objectives: ['Present personal project', 'Use all learned vocabulary', 'Practice presentation skills'],
            vocabulary: ['All course vocabulary'],
            grammar: ['All course structures'],
            skills: ['Speaking', 'Presentation', 'Creativity', 'Confidence'],
            description: 'Student presentation project showcasing all learned English in personal context'
          },
          {
            id: 'ps-u10-l4',
            title: 'Final Review Game – My English Adventure',
            duration: 30,
            objectives: ['Complete course review', 'Celebrate achievements', 'Escape room challenge'],
            vocabulary: ['All course vocabulary'],
            grammar: ['All course structures'],
            skills: ['Speaking', 'Listening', 'Problem solving', 'Teamwork'],
            description: 'Escape room style final review game celebrating English learning journey'
          }
        ]
      }
    ]
  },
  {
    level: 'A1',
    title: 'A1 - Beginner',
    description: 'Basic communication, greetings, simple phrases',
    units: [
      {
        id: 'a1-unit-1',
        title: 'Getting Started',
        description: 'Basic introductions and personal information',
        lessons: [
          {
            id: 'a1-u1-l1',
            title: 'Nice to Meet You',
            duration: 45,
            objectives: ['Introduce yourself', 'Ask for personal information', 'Use formal and informal greetings'],
            vocabulary: ['name', 'age', 'nationality', 'occupation', 'address', 'phone number', 'email'],
            grammar: ['Present simple of "be"', 'Question words (what, where, how)'],
            skills: ['Speaking', 'Listening', 'Writing'],
            description: 'Comprehensive introduction to personal information and formal introductions'
          },
          // ... 9 more lessons for A1 Unit 1
          {
            id: 'a1-u1-l10',
            title: 'Review and Practice',
            duration: 45,
            objectives: ['Review unit vocabulary', 'Practice conversations', 'Self-assessment'],
            vocabulary: ['All unit vocabulary'],
            grammar: ['All unit grammar'],
            skills: ['All skills'],
            description: 'Comprehensive review of unit 1 content'
          }
        ]
      }
      // ... 4 more units for A1 (simplified for space)
    ]
  },
  {
    level: 'A2',
    title: 'A2 - Elementary',
    description: 'Simple conversations, past/present tense, daily activities',
    units: [
      {
        id: 'a2-unit-1',
        title: 'Daily Routines',
        description: 'Talking about everyday activities and habits',
        lessons: [
          {
            id: 'a2-u1-l1',
            title: 'My Daily Schedule',
            duration: 45,
            objectives: ['Describe daily routines', 'Use time expressions', 'Talk about frequency'],
            vocabulary: ['daily activities', 'time expressions', 'frequency adverbs'],
            grammar: ['Present simple for habits', 'Time prepositions', 'Adverbs of frequency'],
            skills: ['Speaking', 'Listening', 'Writing', 'Reading'],
            description: 'Learn to describe daily routines and schedules'
          }
          // ... 9 more lessons
        ]
      }
      // ... 4 more units for A2
    ]
  },
  {
    level: 'B1',
    title: 'B1 - Intermediate',
    description: 'Complex conversations, expressing opinions, future plans',
    units: [
      {
        id: 'b1-unit-1',
        title: 'Life Experiences',
        description: 'Talking about past experiences and achievements',
        lessons: [
          {
            id: 'b1-u1-l1',
            title: 'Have You Ever...?',
            duration: 45,
            objectives: ['Talk about life experiences', 'Use present perfect', 'Ask about experiences'],
            vocabulary: ['life experiences', 'achievements', 'travel', 'adventure'],
            grammar: ['Present perfect', 'Ever/never', 'For/since'],
            skills: ['Speaking', 'Listening', 'Writing', 'Reading'],
            description: 'Learn to discuss life experiences using present perfect'
          }
          // ... 9 more lessons
        ]
      }
      // ... 4 more units for B1
    ]
  },
  {
    level: 'B2',
    title: 'B2 - Upper-Intermediate',
    description: 'Detailed discussions, abstract topics, nuanced communication',
    units: [
      {
        id: 'b2-unit-1',
        title: 'Global Issues',
        description: 'Discussing world problems and solutions',
        lessons: [
          {
            id: 'b2-u1-l1',
            title: 'Environmental Challenges',
            duration: 45,
            objectives: ['Discuss environmental issues', 'Express opinions', 'Propose solutions'],
            vocabulary: ['environment', 'climate change', 'sustainability', 'conservation'],
            grammar: ['Complex conditionals', 'Passive voice', 'Modal verbs for speculation'],
            skills: ['Speaking', 'Listening', 'Writing', 'Reading', 'Critical thinking'],
            description: 'Explore environmental issues and discuss potential solutions'
          }
          // ... 9 more lessons
        ]
      }
      // ... 5 more units for B2
    ]
  },
  {
    level: 'C1',
    title: 'C1 - Advanced',
    description: 'Sophisticated language use, complex texts, academic/professional contexts',
    units: [
      {
        id: 'c1-unit-1',
        title: 'Academic Writing',
        description: 'Advanced writing skills for academic purposes',
        lessons: [
          {
            id: 'c1-u1-l1',
            title: 'Essay Structure and Argumentation',
            duration: 45,
            objectives: ['Structure academic essays', 'Develop arguments', 'Use academic vocabulary'],
            vocabulary: ['academic discourse', 'argumentation', 'critical analysis'],
            grammar: ['Complex sentence structures', 'Nominalization', 'Discourse markers'],
            skills: ['Writing', 'Reading', 'Critical thinking', 'Research'],
            description: 'Master academic writing conventions and argumentation'
          }
          // ... 9 more lessons
        ]
      }
      // ... 5 more units for C1
    ]
  },
  {
    level: 'C2',
    title: 'C2 - Proficiency',
    description: 'Near-native fluency, literary texts, complex academic discourse',
    units: [
      {
        id: 'c2-unit-1',
        title: 'Literary Analysis',
        description: 'Analyzing literature and complex texts',
        lessons: [
          {
            id: 'c2-u1-l1',
            title: 'Narrative Techniques',
            duration: 45,
            objectives: ['Analyze narrative techniques', 'Discuss literary devices', 'Critique writing styles'],
            vocabulary: ['literary terminology', 'narrative analysis', 'stylistic devices'],
            grammar: ['Advanced stylistic features', 'Register variation', 'Rhetorical devices'],
            skills: ['Reading', 'Writing', 'Critical analysis', 'Literary interpretation'],
            description: 'Analyze complex literary works and narrative techniques'
          }
          // ... 9 more lessons
        ]
      }
      // ... 5 more units for C2
    ]
  }
];