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
    title: 'Pre-Starter (Pre-A1)',
    description: 'Absolute beginner level for children/adults with zero English',
    units: [
      {
        id: 'pre-starter-unit-1',
        title: 'First Words',
        description: 'Basic vocabulary and simple greetings',
        lessons: [
          {
            id: 'ps-u1-l1',
            title: 'Hello and Goodbye',
            duration: 30,
            objectives: ['Greet people', 'Say goodbye', 'Recognize basic words'],
            vocabulary: ['hello', 'goodbye', 'yes', 'no', 'please', 'thank you'],
            grammar: ['Simple greetings'],
            skills: ['Listening', 'Speaking'],
            description: 'First introduction to English greetings and polite words'
          },
          {
            id: 'ps-u1-l2',
            title: 'Numbers 1-10',
            duration: 30,
            objectives: ['Count to 10', 'Recognize number words', 'Use numbers in simple contexts'],
            vocabulary: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            grammar: ['Number formation'],
            skills: ['Listening', 'Speaking'],
            description: 'Learning basic numbers and how to count'
          },
          {
            id: 'ps-u1-l3',
            title: 'Colors',
            duration: 30,
            objectives: ['Name basic colors', 'Describe objects by color', 'Follow color instructions'],
            vocabulary: ['red', 'blue', 'yellow', 'green', 'black', 'white', 'pink', 'orange'],
            grammar: ['Basic adjectives'],
            skills: ['Listening', 'Speaking', 'Visual recognition'],
            description: 'Introduction to basic colors and their names'
          },
          {
            id: 'ps-u1-l4',
            title: 'My Name',
            duration: 30,
            objectives: ['Say your name', 'Ask for names', 'Introduce yourself'],
            vocabulary: ['name', 'my', 'your', 'I am', 'you are'],
            grammar: ['Personal pronouns', 'Be verb (simple)'],
            skills: ['Speaking', 'Listening'],
            description: 'Learning to introduce yourself and ask for names'
          },
          {
            id: 'ps-u1-l5',
            title: 'Animals',
            duration: 30,
            objectives: ['Name common animals', 'Make animal sounds', 'Recognize animal pictures'],
            vocabulary: ['cat', 'dog', 'bird', 'fish', 'elephant', 'lion', 'cow', 'pig'],
            grammar: ['This is a...'],
            skills: ['Listening', 'Speaking', 'Visual recognition'],
            description: 'Introduction to common animals and their names'
          },
          {
            id: 'ps-u1-l6',
            title: 'Family',
            duration: 30,
            objectives: ['Name family members', 'Point to family in pictures', 'Talk about your family'],
            vocabulary: ['mother', 'father', 'sister', 'brother', 'baby', 'grandma', 'grandpa'],
            grammar: ['This is my...'],
            skills: ['Speaking', 'Listening'],
            description: 'Learning family member names and relationships'
          },
          {
            id: 'ps-u1-l7',
            title: 'Body Parts',
            duration: 30,
            objectives: ['Name body parts', 'Point to body parts', 'Follow body movement instructions'],
            vocabulary: ['head', 'eyes', 'nose', 'mouth', 'hands', 'feet', 'ears', 'hair'],
            grammar: ['I have...', 'You have...'],
            skills: ['Listening', 'Speaking', 'Physical movement'],
            description: 'Learning basic body parts and simple descriptions'
          },
          {
            id: 'ps-u1-l8',
            title: 'Food',
            duration: 30,
            objectives: ['Name basic foods', 'Express food likes/dislikes', 'Use food vocabulary'],
            vocabulary: ['apple', 'banana', 'bread', 'milk', 'water', 'cake', 'rice', 'egg'],
            grammar: ['I like...', 'I don\'t like...'],
            skills: ['Speaking', 'Listening'],
            description: 'Introduction to basic food vocabulary and preferences'
          },
          {
            id: 'ps-u1-l9',
            title: 'Toys and Objects',
            duration: 30,
            objectives: ['Name common toys', 'Describe objects', 'Use possessive words'],
            vocabulary: ['ball', 'doll', 'car', 'book', 'pen', 'bag', 'chair', 'table'],
            grammar: ['My...', 'Your...', 'It is...'],
            skills: ['Speaking', 'Listening', 'Visual recognition'],
            description: 'Learning names of everyday objects and toys'
          },
          {
            id: 'ps-u1-l10',
            title: 'Review and Games',
            duration: 30,
            objectives: ['Review all vocabulary', 'Play simple games', 'Demonstrate understanding'],
            vocabulary: ['All previous vocabulary'],
            grammar: ['All previous structures'],
            skills: ['Speaking', 'Listening', 'Games'],
            description: 'Fun review of all learned vocabulary through games and activities'
          }
        ]
      },
      {
        id: 'pre-starter-unit-2',
        title: 'Simple Actions',
        description: 'Basic verbs and action words',
        lessons: [
          {
            id: 'ps-u2-l1',
            title: 'Actions: Run, Jump, Walk',
            duration: 30,
            objectives: ['Name basic actions', 'Perform actions', 'Follow action commands'],
            vocabulary: ['run', 'jump', 'walk', 'sit', 'stand', 'stop', 'go', 'come'],
            grammar: ['Simple imperatives'],
            skills: ['Listening', 'Speaking', 'Physical movement'],
            description: 'Learning basic action verbs through movement'
          },
          {
            id: 'ps-u2-l2',
            title: 'I Can',
            duration: 30,
            objectives: ['Express abilities', 'Use "can"', 'Talk about what you can do'],
            vocabulary: ['can', 'swim', 'dance', 'sing', 'read', 'write', 'draw', 'play'],
            grammar: ['I can...', 'Can you...?'],
            skills: ['Speaking', 'Listening'],
            description: 'Introduction to expressing abilities with "can"'
          },
          {
            id: 'ps-u2-l3',
            title: 'Feelings',
            duration: 30,
            objectives: ['Express feelings', 'Recognize emotions', 'Ask about feelings'],
            vocabulary: ['happy', 'sad', 'angry', 'tired', 'hungry', 'thirsty', 'hot', 'cold'],
            grammar: ['I am...', 'Are you...?'],
            skills: ['Speaking', 'Listening', 'Emotional expression'],
            description: 'Learning to express and recognize basic emotions'
          },
          {
            id: 'ps-u2-l4',
            title: 'Weather',
            duration: 30,
            objectives: ['Describe weather', 'Use weather words', 'Talk about what you see outside'],
            vocabulary: ['sunny', 'rainy', 'cloudy', 'windy', 'snow', 'hot', 'cold', 'nice'],
            grammar: ['It is...', 'The weather is...'],
            skills: ['Speaking', 'Listening', 'Observation'],
            description: 'Basic weather vocabulary and descriptions'
          },
          {
            id: 'ps-u2-l5',
            title: 'Clothes',
            duration: 30,
            objectives: ['Name clothing items', 'Describe what you wear', 'Talk about colors of clothes'],
            vocabulary: ['shirt', 'pants', 'dress', 'shoes', 'hat', 'coat', 'socks', 'glasses'],
            grammar: ['I wear...', 'This is a...'],
            skills: ['Speaking', 'Listening', 'Visual recognition'],
            description: 'Learning clothing vocabulary and descriptions'
          },
          {
            id: 'ps-u2-l6',
            title: 'At Home',
            duration: 30,
            objectives: ['Name rooms in house', 'Describe home activities', 'Use location words'],
            vocabulary: ['house', 'room', 'kitchen', 'bedroom', 'bathroom', 'door', 'window', 'bed'],
            grammar: ['In the...', 'This is the...'],
            skills: ['Speaking', 'Listening'],
            description: 'Basic home vocabulary and room names'
          },
          {
            id: 'ps-u2-l7',
            title: 'Transportation',
            duration: 30,
            objectives: ['Name vehicles', 'Talk about how you travel', 'Use movement verbs'],
            vocabulary: ['car', 'bus', 'train', 'plane', 'bike', 'walk', 'ride', 'drive'],
            grammar: ['I go by...', 'I take the...'],
            skills: ['Speaking', 'Listening'],
            description: 'Introduction to transportation vocabulary'
          },
          {
            id: 'ps-u2-l8',
            title: 'School Things',
            duration: 30,
            objectives: ['Name school objects', 'Talk about school activities', 'Use classroom language'],
            vocabulary: ['school', 'teacher', 'student', 'book', 'pencil', 'paper', 'desk', 'board'],
            grammar: ['At school...', 'In my bag...'],
            skills: ['Speaking', 'Listening'],
            description: 'Basic school vocabulary and classroom objects'
          },
          {
            id: 'ps-u2-l9',
            title: 'Big and Small',
            duration: 30,
            objectives: ['Describe size', 'Compare objects', 'Use descriptive words'],
            vocabulary: ['big', 'small', 'long', 'short', 'tall', 'little', 'huge', 'tiny'],
            grammar: ['It is big', 'This is small'],
            skills: ['Speaking', 'Listening', 'Comparison'],
            description: 'Learning size and comparison vocabulary'
          },
          {
            id: 'ps-u2-l10',
            title: 'Unit Review',
            duration: 30,
            objectives: ['Review all unit vocabulary', 'Practice conversations', 'Play review games'],
            vocabulary: ['All unit vocabulary'],
            grammar: ['All unit grammar'],
            skills: ['Speaking', 'Listening', 'Games'],
            description: 'Comprehensive review of unit vocabulary and structures'
          }
        ]
      },
      {
        id: 'pre-starter-unit-3',
        title: 'Daily Life',
        description: 'Everyday activities and routines',
        lessons: [
          {
            id: 'ps-u3-l1',
            title: 'Morning Routine',
            duration: 30,
            objectives: ['Describe morning activities', 'Use time words', 'Talk about daily habits'],
            vocabulary: ['wake up', 'get up', 'brush teeth', 'wash face', 'eat breakfast', 'morning', 'early', 'late'],
            grammar: ['I wake up', 'In the morning'],
            skills: ['Speaking', 'Listening', 'Sequencing'],
            description: 'Learning morning routine vocabulary and activities'
          },
          {
            id: 'ps-u3-l2',
            title: 'At School',
            duration: 30,
            objectives: ['Talk about school day', 'Use school vocabulary', 'Describe learning activities'],
            vocabulary: ['learn', 'study', 'listen', 'speak', 'practice', 'homework', 'lesson', 'class'],
            grammar: ['At school I...', 'We learn...'],
            skills: ['Speaking', 'Listening'],
            description: 'School activities and learning vocabulary'
          },
          {
            id: 'ps-u3-l3',
            title: 'Playtime',
            duration: 30,
            objectives: ['Talk about play activities', 'Use play vocabulary', 'Express enjoyment'],
            vocabulary: ['play', 'fun', 'game', 'toy', 'friend', 'together', 'laugh', 'enjoy'],
            grammar: ['I play with...', 'We have fun'],
            skills: ['Speaking', 'Listening', 'Social interaction'],
            description: 'Play and recreational activity vocabulary'
          },
          {
            id: 'ps-u3-l4',
            title: 'Meals',
            duration: 30,
            objectives: ['Talk about meals', 'Use meal vocabulary', 'Express hunger and thirst'],
            vocabulary: ['breakfast', 'lunch', 'dinner', 'hungry', 'thirsty', 'eat', 'drink', 'delicious'],
            grammar: ['I eat...', 'For breakfast...'],
            skills: ['Speaking', 'Listening'],
            description: 'Meals and eating vocabulary'
          },
          {
            id: 'ps-u3-l5',
            title: 'Evening Activities',
            duration: 30,
            objectives: ['Describe evening routine', 'Use evening vocabulary', 'Talk about rest'],
            vocabulary: ['evening', 'night', 'bath', 'story', 'sleep', 'tired', 'bed', 'dream'],
            grammar: ['In the evening...', 'I go to bed'],
            skills: ['Speaking', 'Listening'],
            description: 'Evening routine and bedtime vocabulary'
          },
          {
            id: 'ps-u3-l6',
            title: 'Days of the Week',
            duration: 30,
            objectives: ['Name days of week', 'Talk about weekly activities', 'Use day vocabulary'],
            vocabulary: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'today'],
            grammar: ['Today is...', 'On Monday...'],
            skills: ['Speaking', 'Listening', 'Time concepts'],
            description: 'Days of the week and weekly routines'
          },
          {
            id: 'ps-u3-l7',
            title: 'Help at Home',
            duration: 30,
            objectives: ['Talk about helping', 'Use helping vocabulary', 'Express willingness to help'],
            vocabulary: ['help', 'clean', 'tidy', 'put away', 'carry', 'good', 'helpful', 'kind'],
            grammar: ['I help...', 'I can help'],
            skills: ['Speaking', 'Listening', 'Responsibility'],
            description: 'Helping and household responsibility vocabulary'
          },
          {
            id: 'ps-u3-l8',
            title: 'Special Days',
            duration: 30,
            objectives: ['Talk about celebrations', 'Use celebration vocabulary', 'Express excitement'],
            vocabulary: ['birthday', 'party', 'present', 'cake', 'special', 'celebrate', 'happy', 'exciting'],
            grammar: ['My birthday...', 'We celebrate...'],
            skills: ['Speaking', 'Listening', 'Cultural awareness'],
            description: 'Celebrations and special occasions vocabulary'
          },
          {
            id: 'ps-u3-l9',
            title: 'Being Polite',
            duration: 30,
            objectives: ['Use polite language', 'Show good manners', 'Be respectful'],
            vocabulary: ['please', 'thank you', 'sorry', 'excuse me', 'polite', 'kind', 'nice', 'respect'],
            grammar: ['Please...', 'Thank you for...'],
            skills: ['Speaking', 'Listening', 'Social skills'],
            description: 'Politeness and good manners vocabulary'
          },
          {
            id: 'ps-u3-l10',
            title: 'Final Review',
            duration: 30,
            objectives: ['Review all vocabulary', 'Practice conversations', 'Demonstrate progress'],
            vocabulary: ['All course vocabulary'],
            grammar: ['All course structures'],
            skills: ['Speaking', 'Listening', 'Review'],
            description: 'Final review of all Pre-Starter content'
          }
        ]
      },
      {
        id: 'pre-starter-unit-4',
        title: 'Fun and Games',
        description: 'Entertainment and recreational activities',
        lessons: [
          {
            id: 'ps-u4-l1',
            title: 'Playground Fun',
            duration: 30,
            objectives: ['Name playground equipment', 'Talk about outdoor play', 'Use action verbs'],
            vocabulary: ['playground', 'swing', 'slide', 'climb', 'run around', 'outside', 'fresh air', 'exercise'],
            grammar: ['I like to...', 'Let\'s...'],
            skills: ['Speaking', 'Listening', 'Physical activity'],
            description: 'Playground vocabulary and outdoor activities'
          },
          {
            id: 'ps-u4-l2',
            title: 'Indoor Games',
            duration: 30,
            objectives: ['Name indoor activities', 'Talk about rainy day fun', 'Use game vocabulary'],
            vocabulary: ['inside', 'puzzle', 'blocks', 'cards', 'board game', 'quiet', 'calm', 'concentrate'],
            grammar: ['We can play...', 'This is...'],
            skills: ['Speaking', 'Listening', 'Problem solving'],
            description: 'Indoor games and quiet activities'
          },
          {
            id: 'ps-u4-l3',
            title: 'Music and Dancing',
            duration: 30,
            objectives: ['Talk about music', 'Move to rhythm', 'Express musical enjoyment'],
            vocabulary: ['music', 'song', 'dance', 'rhythm', 'beat', 'loud', 'quiet', 'beautiful'],
            grammar: ['I love...', 'The music is...'],
            skills: ['Speaking', 'Listening', 'Rhythm', 'Movement'],
            description: 'Music and dance vocabulary and activities'
          },
          {
            id: 'ps-u4-l4',
            title: 'Art and Creativity',
            duration: 30,
            objectives: ['Talk about art activities', 'Use art vocabulary', 'Express creativity'],
            vocabulary: ['draw', 'paint', 'color', 'picture', 'beautiful', 'creative', 'artist', 'imagination'],
            grammar: ['I can draw...', 'This picture is...'],
            skills: ['Speaking', 'Listening', 'Creativity'],
            description: 'Art and creative activity vocabulary'
          },
          {
            id: 'ps-u4-l5',
            title: 'Sports and Exercise',
            duration: 30,
            objectives: ['Name simple sports', 'Talk about exercise', 'Use movement vocabulary'],
            vocabulary: ['sport', 'ball', 'kick', 'throw', 'catch', 'team', 'exercise', 'healthy'],
            grammar: ['I can...', 'We play...'],
            skills: ['Speaking', 'Listening', 'Physical coordination'],
            description: 'Basic sports and exercise vocabulary'
          },
          {
            id: 'ps-u4-l6',
            title: 'Nature Walk',
            duration: 30,
            objectives: ['Talk about nature', 'Describe outdoor observations', 'Use nature vocabulary'],
            vocabulary: ['tree', 'flower', 'grass', 'sky', 'sun', 'cloud', 'nature', 'beautiful'],
            grammar: ['I see...', 'Look at the...'],
            skills: ['Speaking', 'Listening', 'Observation'],
            description: 'Nature vocabulary and outdoor exploration'
          },
          {
            id: 'ps-u4-l7',
            title: 'Sharing and Taking Turns',
            duration: 30,
            objectives: ['Practice sharing', 'Take turns politely', 'Use social vocabulary'],
            vocabulary: ['share', 'turn', 'wait', 'patient', 'fair', 'together', 'kind', 'gentle'],
            grammar: ['Your turn', 'Can I have...?'],
            skills: ['Speaking', 'Listening', 'Social skills'],
            description: 'Social skills and cooperation vocabulary'
          },
          {
            id: 'ps-u4-l8',
            title: 'Show and Tell',
            duration: 30,
            objectives: ['Present something special', 'Listen to others', 'Ask simple questions'],
            vocabulary: ['show', 'tell', 'special', 'interesting', 'question', 'answer', 'listen', 'watch'],
            grammar: ['This is my...', 'I want to show...'],
            skills: ['Speaking', 'Listening', 'Presentation'],
            description: 'Presentation skills and sharing experiences'
          },
          {
            id: 'ps-u4-l9',
            title: 'Party Time',
            duration: 30,
            objectives: ['Talk about celebrations', 'Use party vocabulary', 'Express joy'],
            vocabulary: ['party', 'celebrate', 'happy', 'fun', 'friends', 'together', 'special', 'memory'],
            grammar: ['We are celebrating...', 'This is fun!'],
            skills: ['Speaking', 'Listening', 'Social interaction'],
            description: 'Celebration and party vocabulary'
          },
          {
            id: 'ps-u4-l10',
            title: 'Graduation Day',
            duration: 30,
            objectives: ['Celebrate completion', 'Review progress', 'Look forward to next level'],
            vocabulary: ['graduate', 'finish', 'complete', 'proud', 'learn', 'progress', 'next', 'ready'],
            grammar: ['I finished...', 'I learned...'],
            skills: ['Speaking', 'Listening', 'Reflection'],
            description: 'Celebration of learning achievements and progress'
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