
// Build & Use Curriculum Data - A1 and A2 Levels
// Based on systematic progression for rapid comprehension and sentence-building confidence

export interface CurriculumUnit {
  id: string;
  theme: string;
  grammar: string;
  vocabulary: string[];
  objectives: string;
  skills: string[];
  duration: number; // in minutes
  activities: {
    listening: string;
    vocabulary: string;
    grammar: string;
    speaking: string;
    writing: string;
    game: string;
  };
  finalProject?: string;
  rapidComprehension: string;
  sentenceBuilding: string[];
}

export const A1_CURRICULUM: CurriculumUnit[] = [
  {
    id: 'a1-unit-1',
    theme: 'All About Me',
    grammar: 'Verb be + subject pronouns',
    vocabulary: ['name', 'country', 'age', 'feeling', 'nationality', 'language', 'job', 'student'],
    objectives: 'Introduce yourself, say where you\'re from, express basic feelings',
    skills: ['Listening', 'Speaking', 'Grammar', 'Vocabulary'],
    duration: 90,
    activities: {
      listening: 'Listen to introductions and identify key information',
      vocabulary: 'Match countries with nationalities using visual cards',
      grammar: 'Build sentences with "I am/You are" patterns',
      speaking: 'Speed dating introductions - meet 5 classmates',
      writing: 'Complete personal information form',
      game: 'Guess Who? - describing people game'
    },
    rapidComprehension: 'Visual nationality map + audio matching for instant recognition',
    sentenceBuilding: [
      'I am [name]',
      'I am from [country]',
      'I am [age] years old',
      'I feel [emotion]'
    ]
  },
  {
    id: 'a1-unit-2',
    theme: 'My Family & Friends',
    grammar: 'Possessive adjectives (my, your, his, her)',
    vocabulary: ['mother', 'father', 'sister', 'brother', 'friend', 'grandmother', 'grandfather', 'pet'],
    objectives: 'Talk about your family, describe relationships, say who people are',
    skills: ['Speaking', 'Vocabulary', 'Grammar', 'Reading'],
    duration: 90,
    activities: {
      listening: 'Family tree descriptions - draw while listening',
      vocabulary: 'Family photo storytelling with emotion anchors',
      grammar: 'Possessive pattern drilling with family photos',
      speaking: 'Family interview - ask and answer about families',
      writing: 'Write 5 sentences about your family',
      game: 'Family tree race - build family trees faster'
    },
    rapidComprehension: 'Visual family tree + possessive pattern recognition',
    sentenceBuilding: [
      'My [family member] is [description]',
      'His name is [name]',
      'Her job is [job]',
      'This is my [relationship]'
    ]
  },
  {
    id: 'a1-unit-3',
    theme: 'Daily Life',
    grammar: 'Present Simple (I/you) + time expressions',
    vocabulary: ['wake up', 'eat', 'go', 'work', 'study', 'sleep', 'watch', 'morning', 'afternoon', 'evening'],
    objectives: 'Describe your daily routine, tell the time, sequence daily activities',
    skills: ['Listening', 'Speaking', 'Writing', 'Grammar'],
    duration: 90,
    activities: {
      listening: 'Daily routine story - sequence pictures while listening',
      vocabulary: 'Action verb charades with time expressions',
      grammar: 'Present simple pattern building with daily actions',
      speaking: 'Daily routine interview exchange',
      writing: 'Write your daily schedule',
      game: 'Daily routine memory chain - add one action'
    },
    rapidComprehension: 'Clock visualization + action sequence cards',
    sentenceBuilding: [
      'I wake up at [time]',
      'I [action] in the [time period]',
      'I go to [place] at [time]',
      'You [action] every day'
    ]
  },
  {
    id: 'a1-unit-4',
    theme: 'School Life',
    grammar: 'There is/are + articles (a/an/the)',
    vocabulary: ['classroom', 'teacher', 'student', 'book', 'pen', 'desk', 'board', 'computer', 'subject'],
    objectives: 'Describe a classroom, ask what\'s in a room, talk about school subjects',
    skills: ['Speaking', 'Vocabulary', 'Grammar', 'Reading'],
    duration: 90,
    activities: {
      listening: 'Classroom description - identify objects and locations',
      vocabulary: 'School supplies scavenger hunt',
      grammar: 'There is/are pattern practice with classroom objects',
      speaking: 'Describe your ideal classroom',
      writing: 'Write about your favorite subject',
      game: 'Classroom memory game - what\'s missing?'
    },
    rapidComprehension: 'Classroom visual tour + object identification',
    sentenceBuilding: [
      'There is a [object] in the [place]',
      'There are [number] [objects] on the [surface]',
      'The [object] is [color/description]',
      'My favorite subject is [subject]'
    ]
  },
  {
    id: 'a1-unit-5',
    theme: 'My House',
    grammar: 'Prepositions of place (in, on, under, next to)',
    vocabulary: ['kitchen', 'bedroom', 'bathroom', 'living room', 'sofa', 'table', 'bed', 'chair', 'window'],
    objectives: 'Describe your home, say where things are, give location information',
    skills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    duration: 90,
    activities: {
      listening: 'Home tour audio - draw room layout',
      vocabulary: 'Furniture placement game with kinesthetic movement',
      grammar: 'Preposition pattern practice with real objects',
      speaking: 'Describe your dream house',
      writing: 'Draw and describe your bedroom',
      game: 'Hide and seek - Where is the object?'
    },
    rapidComprehension: 'Room layout visualization + preposition gesture cues',
    sentenceBuilding: [
      'The [object] is [preposition] the [place]',
      'My [room] has a [furniture]',
      'I sleep in my [room]',
      'The [object] is next to the [object]'
    ]
  },
  {
    id: 'a1-unit-6',
    theme: 'What I Like',
    grammar: 'Like/don\'t like + -ing verbs',
    vocabulary: ['reading', 'swimming', 'cooking', 'dancing', 'singing', 'playing', 'watching', 'listening', 'sport'],
    objectives: 'Express preferences, talk about hobbies, say what you like or dislike',
    skills: ['Speaking', 'Listening', 'Writing', 'Vocabulary'],
    duration: 90,
    activities: {
      listening: 'Hobby interviews - match people with preferences',
      vocabulary: 'Action hobby miming with emotional anchoring',
      grammar: 'Like + gerund pattern building',
      speaking: 'Hobby speed dating - find common interests',
      writing: 'Write about your top 3 hobbies',
      game: 'Hobby bingo - find someone who likes...'
    },
    rapidComprehension: 'Hobby action cards + preference emotion mapping',
    sentenceBuilding: [
      'I like [activity + ing]',
      'I don\'t like [activity + ing]',
      'My hobby is [activity + ing]',
      'Do you like [activity + ing]?'
    ]
  },
  {
    id: 'a1-unit-7',
    theme: 'Around Town',
    grammar: 'Can/can\'t + directions',
    vocabulary: ['bank', 'hospital', 'shop', 'restaurant', 'park', 'street', 'left', 'right', 'straight', 'bus'],
    objectives: 'Ask for and give directions, say what you can do, describe locations',
    skills: ['Speaking', 'Listening', 'Grammar', 'Reading'],
    duration: 90,
    activities: {
      listening: 'Direction following - trace route on map',
      vocabulary: 'Town buildings matching with kinesthetic movement',
      grammar: 'Can/can\'t ability and permission practice',
      speaking: 'Tourist information role-play',
      writing: 'Write directions from school to your house',
      game: 'Treasure hunt - follow directions to find treasure'
    },
    rapidComprehension: 'Interactive town map + direction gesture system',
    sentenceBuilding: [
      'I can [action]',
      'You can\'t [action] here',
      'Go [direction] and turn [direction]',
      'The [place] is next to the [place]'
    ]
  },
  {
    id: 'a1-unit-8',
    theme: 'Food & Drinks',
    grammar: 'Count/uncount nouns + some/any',
    vocabulary: ['apple', 'bread', 'water', 'coffee', 'chicken', 'rice', 'hungry', 'thirsty', 'breakfast', 'lunch'],
    objectives: 'Order food, talk about meals, express hunger and thirst',
    skills: ['Speaking', 'Listening', 'Vocabulary', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Restaurant orders - check correct items',
      vocabulary: 'Food tasting with sensory anchoring',
      grammar: 'Count vs uncount sorting with some/any patterns',
      speaking: 'Restaurant role-play ordering',
      writing: 'Write your favorite meal recipe',
      game: 'Food memory - I went shopping and bought...'
    },
    rapidComprehension: 'Food category visualization + count/uncount sorting',
    sentenceBuilding: [
      'I want some [food]',
      'Can I have [food/drink]?',
      'I don\'t have any [food]',
      'I\'m hungry/thirsty'
    ]
  },
  {
    id: 'a1-unit-9',
    theme: 'People & Clothes',
    grammar: 'Present continuous + adjectives',
    vocabulary: ['shirt', 'pants', 'dress', 'shoes', 'hat', 'tall', 'short', 'young', 'old', 'beautiful'],
    objectives: 'Describe people and clothing, talk about appearance',
    skills: ['Speaking', 'Vocabulary', 'Grammar', 'Listening'],
    duration: 90,
    activities: {
      listening: 'People descriptions - match description to photo',
      vocabulary: 'Fashion show with adjective anchoring',
      grammar: 'Present continuous pattern practice with clothing',
      speaking: 'Describe your family photos',
      writing: 'Describe what you\'re wearing today',
      game: 'Guess who? - clothing and appearance description'
    },
    rapidComprehension: 'Visual appearance chart + clothing category system',
    sentenceBuilding: [
      'He/she is wearing [clothing]',
      'He/she is [adjective]',
      'The [person] has [description]',
      'I am wearing [clothing] today'
    ]
  },
  {
    id: 'a1-unit-10',
    theme: 'Free Time',
    grammar: 'Present continuous vs present simple',
    vocabulary: ['playing', 'studying', 'working', 'relaxing', 'usually', 'now', 'today', 'always', 'sometimes'],
    objectives: 'Contrast habitual actions with current actions, describe what\'s happening now',
    skills: ['Grammar', 'Speaking', 'Listening', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Action contrast - habitual vs now happening',
      vocabulary: 'Action timeline with frequency adverbs',
      grammar: 'Tense contrast pattern building',
      speaking: 'What do you usually do vs what are you doing now?',
      writing: 'Compare your weekday vs weekend routine',
      game: 'Action switch - change from habitual to current action'
    },
    rapidComprehension: 'Timeline visualization + action comparison charts',
    sentenceBuilding: [
      'I usually [action] but today I\'m [action + ing]',
      'Right now I\'m [action + ing]',
      'I always [action] on [day]',
      'What are you doing now?'
    ]
  },
  {
    id: 'a1-unit-11',
    theme: 'Health & Feelings',
    grammar: 'Should/shouldn\'t + feeling adjectives',
    vocabulary: ['headache', 'tired', 'sick', 'happy', 'sad', 'angry', 'doctor', 'medicine', 'rest', 'exercise'],
    objectives: 'Express feelings and health problems, give and receive advice',
    skills: ['Speaking', 'Vocabulary', 'Grammar', 'Listening'],
    duration: 90,
    activities: {
      listening: 'Health problems and advice matching',
      vocabulary: 'Emotion and health charades with kinesthetic cues',
      grammar: 'Should/shouldn\'t advice pattern practice',
      speaking: 'Doctor-patient role-play',
      writing: 'Write health advice for common problems',
      game: 'Advice chain - pass the advice around the circle'
    },
    rapidComprehension: 'Emotion face charts + health problem visual cues',
    sentenceBuilding: [
      'I feel [adjective]',
      'You should [action]',
      'You shouldn\'t [action]',
      'I have a [health problem]'
    ]
  },
  {
    id: 'a1-unit-12',
    theme: 'Let\'s Travel',
    grammar: 'Past simple (was/were) + basic past verbs',
    vocabulary: ['trip', 'vacation', 'hotel', 'airplane', 'train', 'visited', 'went', 'saw', 'country', 'city'],
    objectives: 'Talk about past trips, describe travel experiences, use basic past tense',
    skills: ['Speaking', 'Grammar', 'Writing', 'Listening'],
    duration: 90,
    activities: {
      listening: 'Travel stories - sequence events chronologically',
      vocabulary: 'Travel memory anchoring with sensory recall',
      grammar: 'Past tense pattern building with travel verbs',
      speaking: 'Share your best travel memory',
      writing: 'Write a postcard from your dream destination',
      game: 'Travel storytelling circle - add to the story'
    },
    rapidComprehension: 'Travel timeline visualization + past tense pattern charts',
    sentenceBuilding: [
      'I was in [place] last [time]',
      'I went to [place]',
      'I saw [thing/place]',
      'It was [adjective]'
    ],
    finalProject: '"All About Me" interactive portfolio with writing, voice recordings, and image slides'
  }
];

export const A2_CURRICULUM: CurriculumUnit[] = [
  {
    id: 'a2-unit-1',
    theme: 'Yesterday',
    grammar: 'Past simple (regular verbs)',
    vocabulary: ['walked', 'talked', 'played', 'worked', 'studied', 'watched', 'listened', 'cooked', 'cleaned', 'yesterday'],
    objectives: 'Talk about what you did yesterday, use regular past simple verbs confidently',
    skills: ['Speaking', 'Grammar', 'Listening', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Yesterday\'s activities - order events chronologically',
      vocabulary: 'Past action miming with time anchoring',
      grammar: 'Regular past tense pattern building and pronunciation',
      speaking: 'Yesterday interview chain',
      writing: 'Write your yesterday diary entry',
      game: 'Past tense bingo - find someone who [past action] yesterday'
    },
    rapidComprehension: 'Action timeline + regular past tense pattern recognition',
    sentenceBuilding: [
      'Yesterday I [past verb]',
      'I [past verb] at [time]',
      'Did you [base verb] yesterday?',
      'I didn\'t [base verb] yesterday'
    ]
  },
  {
    id: 'a2-unit-2',
    theme: 'Special Days',
    grammar: 'Past simple (irregular verbs)',
    vocabulary: ['went', 'had', 'saw', 'ate', 'came', 'got', 'made', 'took', 'birthday', 'celebration', 'holiday'],
    objectives: 'Talk about celebrations and special events, master irregular past verbs',
    skills: ['Speaking', 'Grammar', 'Vocabulary', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Holiday stories - identify irregular past verbs',
      vocabulary: 'Celebration memory anchoring with emotional contrast',
      grammar: 'Irregular past tense drilling with story context',
      speaking: 'Special day storytelling',
      writing: 'Write about your best birthday ever',
      game: 'Irregular verb memory race'
    },
    rapidComprehension: 'Celebration visual map + irregular verb pattern charts',
    sentenceBuilding: [
      'I went to [place] for [event]',
      'We had [food/experience]',
      'I saw [person/thing]',
      'It was a special day because...'
    ]
  },
  {
    id: 'a2-unit-3',
    theme: 'Daily Challenges',
    grammar: 'Adverbs of frequency + question formation',
    vocabulary: ['always', 'usually', 'often', 'sometimes', 'rarely', 'never', 'problem', 'difficult', 'easy', 'challenge'],
    objectives: 'Talk about habits and routines, express frequency, discuss daily challenges',
    skills: ['Speaking', 'Grammar', 'Listening', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Frequency survey - mark how often people do activities',
      vocabulary: 'Frequency line with kinesthetic positioning',
      grammar: 'Question formation with frequency adverbs',
      speaking: 'Daily habits interview',
      writing: 'Write about your weekly routine',
      game: 'Frequency guessing game - how often do you...?'
    },
    rapidComprehension: 'Frequency timeline + question pattern visualization',
    sentenceBuilding: [
      'I [frequency] [action]',
      'How often do you [action]?',
      'Do you [frequency] [action]?',
      'I find [activity] [adjective]'
    ]
  },
  {
    id: 'a2-unit-4',
    theme: 'Future Plans',
    grammar: 'Be going to + future time expressions',
    vocabulary: ['tomorrow', 'next week', 'next month', 'plan', 'hope', 'dream', 'goal', 'future', 'probably', 'definitely'],
    objectives: 'Talk about future plans and intentions, express probability',
    skills: ['Speaking', 'Grammar', 'Writing', 'Listening'],
    duration: 90,
    activities: {
      listening: 'Future plans matching - who is going to do what?',
      vocabulary: 'Future pacing with goal visualization',
      grammar: 'Going to pattern building with time expressions',
      speaking: 'Weekend plans discussion',
      writing: 'Write your 5-year plan',
      game: 'Future plans guessing game'
    },
    rapidComprehension: 'Future timeline visualization + intention mapping',
    sentenceBuilding: [
      'I\'m going to [action] [time]',
      'Are you going to [action]?',
      'I\'m probably going to [action]',
      'My plan is to [action]'
    ]
  },
  {
    id: 'a2-unit-5',
    theme: 'Helping Out',
    grammar: 'Should/shouldn\'t for advice + household vocabulary',
    vocabulary: ['clean', 'wash', 'help', 'tidy', 'organize', 'advice', 'suggestion', 'housework', 'chores', 'responsibility'],
    objectives: 'Give and receive advice, talk about household responsibilities, offer help',
    skills: ['Speaking', 'Grammar', 'Listening', 'Vocabulary'],
    duration: 90,
    activities: {
      listening: 'Problem and advice matching',
      vocabulary: 'Household chore action practice',
      grammar: 'Should/shouldn\'t advice pattern drilling',
      speaking: 'Advice exchange role-play',
      writing: 'Write advice column responses',
      game: 'Advice spinning wheel - give advice for different situations'
    },
    rapidComprehension: 'Problem-solution visual mapping + advice pattern charts',
    sentenceBuilding: [
      'You should [action]',
      'I think you should [action]',
      'Can you help me [action]?',
      'I need to [action]'
    ]
  },
  {
    id: 'a2-unit-6',
    theme: 'Let\'s Compare',
    grammar: 'Comparative adjectives (-er, more)',
    vocabulary: ['bigger', 'smaller', 'better', 'worse', 'more expensive', 'more interesting', 'than', 'compare', 'different', 'similar'],
    objectives: 'Compare people, places, and things using comparative forms',
    skills: ['Speaking', 'Grammar', 'Vocabulary', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Comparison descriptions - choose the correct item',
      vocabulary: 'Comparative anchoring with visual contrast',
      grammar: 'Comparative pattern building with real objects',
      speaking: 'Compare your hometown with another city',
      writing: 'Compare two of your friends',
      game: 'Comparison chain - A is bigger than B, B is bigger than C...'
    },
    rapidComprehension: 'Visual comparison charts + comparative pattern recognition',
    sentenceBuilding: [
      '[A] is [comparative] than [B]',
      '[A] is more [adjective] than [B]',
      'Which is [comparative]?',
      'I think [A] is [comparative]'
    ]
  },
  {
    id: 'a2-unit-7',
    theme: 'School Rules',
    grammar: 'Have to/don\'t have to + obligation',
    vocabulary: ['rules', 'uniform', 'homework', 'test', 'schedule', 'obligation', 'permission', 'allowed', 'forbidden', 'must'],
    objectives: 'Talk about rules and obligations, express what\'s necessary and optional',
    skills: ['Speaking', 'Grammar', 'Listening', 'Writing'],
    duration: 90,
    activities: {
      listening: 'School rules identification - tick necessary vs optional',
      vocabulary: 'Rule categories with obligation anchoring',
      grammar: 'Have to pattern practice with school context',
      speaking: 'School rules discussion and comparison',
      writing: 'Write rules for your ideal classroom',
      game: 'Rule or not rule? - decide if statements are obligations'
    },
    rapidComprehension: 'Rule category visualization + obligation pattern charts',
    sentenceBuilding: [
      'I have to [action]',
      'You don\'t have to [action]',
      'Do I have to [action]?',
      'The rule is [statement]'
    ]
  },
  {
    id: 'a2-unit-8',
    theme: 'Nature',
    grammar: 'Present continuous vs present simple in context',
    vocabulary: ['animals', 'trees', 'flowers', 'weather', 'seasons', 'environment', 'nature', 'beautiful', 'peaceful', 'wild'],
    objectives: 'Describe nature and environmental situations, contrast ongoing vs habitual actions',
    skills: ['Speaking', 'Grammar', 'Vocabulary', 'Listening'],
    duration: 90,
    activities: {
      listening: 'Nature documentary - identify ongoing vs habitual animal behaviors',
      vocabulary: 'Nature visualization with sensory anchoring',
      grammar: 'Tense contrast in nature contexts',
      speaking: 'Describe your favorite place in nature',
      writing: 'Write about environmental problems',
      game: 'Nature action contrast - habitual vs happening now'
    },
    rapidComprehension: 'Nature scene analysis + tense contrast visualization',
    sentenceBuilding: [
      'The [animal] usually [action] but now it\'s [action + ing]',
      'In [season], [nature] is [adjective]',
      'Look! The [animal] is [action + ing]',
      'Nature is [adjective]'
    ]
  },
  {
    id: 'a2-unit-9',
    theme: 'My Weekend',
    grammar: 'Past continuous + while/when',
    vocabulary: ['relaxing', 'sleeping', 'watching', 'reading', 'weekend', 'interrupted', 'suddenly', 'while', 'during', 'peaceful'],
    objectives: 'Describe interrupted past actions, talk about weekend activities in progress',
    skills: ['Speaking', 'Grammar', 'Listening', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Weekend story interruptions - identify what was happening when',
      vocabulary: 'Weekend activity anchoring with relaxation cues',
      grammar: 'Past continuous pattern building with interruptions',
      speaking: 'Weekend story sharing with while/when',
      writing: 'Write about a weekend interruption story',
      game: 'Interrupted action charades'
    },
    rapidComprehension: 'Timeline interruption visualization + past continuous patterns',
    sentenceBuilding: [
      'I was [action + ing] when [interruption]',
      'While I was [action + ing], [event] happened',
      'Yesterday at [time] I was [action + ing]',
      'What were you doing when...?'
    ]
  },
  {
    id: 'a2-unit-10',
    theme: 'Big Events',
    grammar: 'Present perfect (ever/never) + experience',
    vocabulary: ['ever', 'never', 'before', 'experience', 'travel', 'try', 'meet', 'visit', 'amazing', 'incredible'],
    objectives: 'Talk about life experiences, use present perfect for indefinite past',
    skills: ['Speaking', 'Grammar', 'Listening', 'Writing'],
    duration: 90,
    activities: {
      listening: 'Experience interviews - check who has done what',
      vocabulary: 'Experience anchoring with emotional memories',
      grammar: 'Present perfect pattern building with ever/never',
      speaking: 'Life experience exchange',
      writing: 'Write about your most amazing experience',
      game: 'Experience bingo - find someone who has...'
    },
    rapidComprehension: 'Experience mapping + present perfect pattern recognition',
    sentenceBuilding: [
      'I have [past participle]',
      'Have you ever [past participle]?',
      'I have never [past participle]',
      'My best experience was [experience]'
    ],
    finalProject: 'Create a comic strip or short story about your life (past, present, and future)'
  }
];
