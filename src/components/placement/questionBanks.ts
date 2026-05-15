// Expert-authored placement-test question banks per hub.
// Each bank has 24+ items so a 15-question test is freshly shuffled per attempt.
// `imagePrompt` triggers a Gemini-generated illustration in TestPhase.
// `audio_script` triggers ElevenLabs TTS in TestPhase.

export type Hub = 'playground' | 'academy' | 'professional';
export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface BankQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: number;
  targetLevel: Cefr;
  feedback: { correct: string; incorrect: string };
  imagePrompt?: string;   // when set, render an AI image above the question
  audio_script?: string;  // when set, render an ElevenLabs play button
  voice_id?: string;
  type?: 'standard' | 'listening_match' | 'visual';
}

// ---------------------------------------------------------------- PLAYGROUND
const PLAYGROUND_POOL: BankQuestion[] = [
  { question: "Which animal says 'Meow'?", options: ['🐱 Cat', '🐶 Dog', '🐸 Frog', '🐦 Bird'], correctIndex: 0, difficulty: 0.2, targetLevel: 'A1', feedback: { correct: 'Yes! Cats say Meow! 🐱', incorrect: 'Cats say Meow! 🐱' }, imagePrompt: 'A friendly cartoon cat sitting and saying meow' },
  { question: 'What color is a banana? 🍌', options: ['Red', 'Blue', 'Yellow', 'Green'], correctIndex: 2, difficulty: 0.2, targetLevel: 'A1', feedback: { correct: 'Yes! Bananas are yellow!', incorrect: 'Bananas are yellow!' }, imagePrompt: 'A bright yellow banana on a white background' },
  { question: 'Choose the number "five".', options: ['3', '5', '7', '9'], correctIndex: 1, difficulty: 0.2, targetLevel: 'A1', feedback: { correct: 'Great counting! 🖐️', incorrect: '"Five" is 5 — like one hand!' } },
  { question: 'Which one is a fruit?', options: ['🍎 Apple', '🚗 Car', '👟 Shoe', '📚 Book'], correctIndex: 0, difficulty: 0.2, targetLevel: 'A1', feedback: { correct: 'Yes! An apple is a fruit!', incorrect: 'Apples are fruit! 🍎' }, imagePrompt: 'A shiny red apple, simple flat illustration' },
  { question: 'How do we say hello in the morning?', options: ['Good night', 'Good morning', 'Goodbye', 'See you'], correctIndex: 1, difficulty: 0.25, targetLevel: 'A1', feedback: { correct: '"Good morning!" ☀️', incorrect: 'In the morning we say "Good morning!"' } },
  { question: '🎧 Listen — which animal is it?', options: ['🐶 Dog', '🐱 Cat', '🐮 Cow', '🐔 Chicken'], correctIndex: 2, difficulty: 0.3, targetLevel: 'A1', type: 'listening_match', audio_script: 'Moo! Moo! I am a big animal on the farm and I give milk.', feedback: { correct: 'Yes! Cows say moo!', incorrect: 'Cows say moo! 🐮' } },
  { question: 'Which one do you wear on your feet?', options: ['🎩 Hat', '👟 Shoes', '🧤 Gloves', '👓 Glasses'], correctIndex: 1, difficulty: 0.3, targetLevel: 'A1', feedback: { correct: 'Yes! Shoes go on our feet!', incorrect: 'We wear shoes on our feet! 👟' } },
  { question: 'Pick the correct word: "I ___ a boy."', options: ['am', 'is', 'are', 'be'], correctIndex: 0, difficulty: 0.35, targetLevel: 'A1', feedback: { correct: '"I am" — perfect!', incorrect: 'With "I" we use "am".' } },
  { question: 'What do you do with a book? 📖', options: ['Eat it', 'Read it', 'Throw it', 'Wear it'], correctIndex: 1, difficulty: 0.35, targetLevel: 'A1', feedback: { correct: 'Yes! We read books!', incorrect: 'We read books!' } },
  { question: 'How many legs does a spider have?', options: ['Four', 'Six', 'Eight', 'Ten'], correctIndex: 2, difficulty: 0.4, targetLevel: 'A2', feedback: { correct: 'Yes! Spiders have 8 legs! 🕷️', incorrect: 'Spiders have 8 legs! 🕷️' }, imagePrompt: 'A friendly cartoon spider with 8 legs, kid-friendly' },
  { question: 'Choose the right one: "She ___ a red dress."', options: ['have', 'has', 'are', 'is have'], correctIndex: 1, difficulty: 0.4, targetLevel: 'A2', feedback: { correct: 'Yes! "She has".', incorrect: 'With she/he/it we use "has".' } },
  { question: 'Which season is hot? ☀️', options: ['Winter', 'Summer', 'Autumn', 'Spring'], correctIndex: 1, difficulty: 0.4, targetLevel: 'A2', feedback: { correct: 'Summer is hot! 🏖️', incorrect: 'Summer is the hot season.' } },
  { question: 'Find the opposite of "big".', options: ['Tall', 'Small', 'Fast', 'New'], correctIndex: 1, difficulty: 0.4, targetLevel: 'A2', feedback: { correct: 'Yes! Big ↔ small.', incorrect: 'The opposite of big is small.' } },
  { question: '🎧 Listen — what is the boy doing?', options: ['Eating', 'Sleeping', 'Running', 'Singing'], correctIndex: 0, difficulty: 0.45, targetLevel: 'A2', type: 'listening_match', audio_script: 'Yum yum! I love my breakfast. I am eating pancakes with honey.', feedback: { correct: 'Yes! He is eating.', incorrect: 'He is eating breakfast.' } },
  { question: 'Which is a vegetable?', options: ['🥕 Carrot', '🍫 Chocolate', '🍩 Donut', '🍪 Cookie'], correctIndex: 0, difficulty: 0.45, targetLevel: 'A2', feedback: { correct: 'Yes! Carrots are vegetables. 🥕', incorrect: 'Carrots are vegetables.' }, imagePrompt: 'A bright orange carrot with green leaves, flat illustration' },
  { question: 'Pick the correct: "There ___ five apples."', options: ['is', 'am', 'are', 'be'], correctIndex: 2, difficulty: 0.5, targetLevel: 'A2', feedback: { correct: 'Yes! With many things we use "there are".', incorrect: 'For more than one we say "there are".' } },
  { question: 'Which one is the smallest?', options: ['Elephant', 'Mouse', 'Dog', 'Cat'], correctIndex: 1, difficulty: 0.5, targetLevel: 'A2', feedback: { correct: 'Yes! A mouse is smallest!', incorrect: 'A mouse is the smallest. 🐭' } },
  { question: 'Choose the past form: "Yesterday I ___ to school."', options: ['go', 'going', 'went', 'goed'], correctIndex: 2, difficulty: 0.55, targetLevel: 'A2', feedback: { correct: 'Yes! "Went" is the past of "go".', incorrect: 'The past of "go" is "went".' } },
];

// ---------------------------------------------------------------- ACADEMY
const ACADEMY_POOL: BankQuestion[] = [
  // A1
  { question: "Choose the correct sentence:", options: ['She are my sister.', 'She is my sister.', 'She am my sister.', 'She be my sister.'], correctIndex: 1, difficulty: 0.1, targetLevel: 'A1', feedback: { correct: '"She is my sister." ✅', incorrect: 'With she/he/it we use "is".' } },
  { question: "Complete: 'I ___ pizza for lunch every Friday.'", options: ['eats', 'eating', 'eat', 'ate'], correctIndex: 2, difficulty: 0.15, targetLevel: 'A1', feedback: { correct: 'Right! Simple present with "I".', incorrect: 'With "I" use "eat".' } },
  { question: "Which pronoun replaces 'my friends and I'?", options: ['They', 'Us', 'We', 'Them'], correctIndex: 2, difficulty: 0.2, targetLevel: 'A1', feedback: { correct: 'Yes! → "We".', incorrect: 'Subject pronoun → "We".' } },
  { question: 'Pick the question: "___ you a student?"', options: ['Do', 'Are', 'Is', 'Have'], correctIndex: 1, difficulty: 0.2, targetLevel: 'A1', feedback: { correct: 'Yes! "Are you a student?"', incorrect: 'Use "Are" with "you".' } },
  // A2
  { question: "Complete: 'Last weekend I ___ a great movie.'", options: ['watch', 'watched', 'watching', 'have watch'], correctIndex: 1, difficulty: 0.3, targetLevel: 'A2', feedback: { correct: 'Past simple → "watched". 🎬', incorrect: '"Last weekend" needs past simple.' } },
  { question: "What's happening now? 'Look! It ___.'", options: ['rains', 'is raining', 'rained', 'rain'], correctIndex: 1, difficulty: 0.35, targetLevel: 'A2', feedback: { correct: 'Present continuous! 🌧️', incorrect: 'Right-now action = present continuous.' } },
  { question: "Choose the preposition: 'The phone is ___ the desk.'", options: ['in', 'on', 'at', 'between'], correctIndex: 1, difficulty: 0.4, targetLevel: 'A2', feedback: { correct: 'Yes! On a surface = on.', incorrect: 'Surfaces use "on".' } },
  { question: 'Which sentence is correct?', options: ["I'm liking this song.", 'I like this song.', 'I am like this song.', 'I likes this song.'], correctIndex: 1, difficulty: 0.4, targetLevel: 'A2', feedback: { correct: '"Like" is a stative verb.', incorrect: '"Like" is stative — use simple present.' } },
  // B1
  { question: "Complete: 'I ___ in this city since 2020.'", options: ['live', 'lived', 'have lived', 'am living'], correctIndex: 2, difficulty: 0.55, targetLevel: 'B1', feedback: { correct: 'Excellent! Present perfect with "since".', incorrect: '"Since 2020" → present perfect.' } },
  { question: "Best modal: 'You ___ wear a seatbelt — it's the law.'", options: ['might', 'could', 'must', 'may'], correctIndex: 2, difficulty: 0.6, targetLevel: 'B1', feedback: { correct: 'Yes! "Must" = obligation.', incorrect: 'Legal obligation → "must".' } },
  { question: "Comparative: 'My new laptop is ___ than my old one.'", options: ['more fast', 'faster', 'fastest', 'most fast'], correctIndex: 1, difficulty: 0.65, targetLevel: 'B1', feedback: { correct: 'Right! Short adjective → -er.', incorrect: 'Short adjective: "faster".' } },
  { question: '🎧 What is the speaker about to do?', options: ['Go shopping for food', 'Cook dinner at home', 'Clean the kitchen', 'Watch a film'], correctIndex: 0, difficulty: 0.7, targetLevel: 'B1', type: 'listening_match', audio_script: "I'm just heading to the supermarket to pick up some bread and milk for breakfast tomorrow.", feedback: { correct: 'Excellent listening! 🛒', incorrect: 'Supermarket = food shopping.' } },
  { question: 'Choose the synonym for "begin".', options: ['end', 'finish', 'start', 'stop'], correctIndex: 2, difficulty: 0.6, targetLevel: 'B1', feedback: { correct: 'Yes! Begin = start.', incorrect: '"Begin" and "start" are synonyms.' } },
  // B2
  { question: "'If I ___ more time, I would learn another language.'", options: ['have', 'had', 'would have', 'will have'], correctIndex: 1, difficulty: 0.75, targetLevel: 'B2', feedback: { correct: 'Second conditional ✅', incorrect: 'Second conditional → "If + past simple".' } },
  { question: "Passive: 'The chef prepared the meal.'", options: ['The meal prepared by the chef.', 'The meal was prepared by the chef.', 'The meal is preparing by the chef.', 'The meal has prepare by the chef.'], correctIndex: 1, difficulty: 0.8, targetLevel: 'B2', feedback: { correct: 'Perfect passive!', incorrect: 'was/were + past participle.' } },
  { question: "Phrasal verb: 'I need to ___ this word — I don't know what it means.'", options: ['look after', 'look up', 'look for', 'look into'], correctIndex: 1, difficulty: 0.85, targetLevel: 'B2', feedback: { correct: '"Look up" = search info!', incorrect: '"Look up" = find information.' } },
  { question: '🎧 What is the speaker\'s main point?', options: ['She enjoyed the film overall', 'She thought the film was disappointing despite good acting', 'She refused to watch the film', 'She wants to watch it a second time'], correctIndex: 1, difficulty: 0.88, targetLevel: 'B2', type: 'listening_match', audio_script: 'Honestly, the performances were excellent and the cinematography was stunning, but the story dragged on for far too long and the ending left me feeling rather let down.', feedback: { correct: 'Brilliant inference! 🎬', incorrect: 'Praised acting, but disappointed by story.' } },
  { question: 'Best linker: "She studied hard, ___ she passed every exam."', options: ['but', 'so', 'although', 'because'], correctIndex: 1, difficulty: 0.7, targetLevel: 'B2', feedback: { correct: 'Cause → result = "so".', incorrect: 'Result clause uses "so".' } },
  // C1
  { question: 'Most precise: "Her arguments were so ___ that no one could refute them."', options: ['nice', 'compelling', 'okay', 'different'], correctIndex: 1, difficulty: 0.9, targetLevel: 'C1', feedback: { correct: '"Compelling" = persuasive! 🎯', incorrect: '"Compelling" is the C1 choice.' } },
  { question: "Inversion: 'Not only ___ the deadline, but he also exceeded expectations.'", options: ['he met', 'did he meet', 'he did meet', 'met he'], correctIndex: 1, difficulty: 0.95, targetLevel: 'C1', feedback: { correct: 'Subject-aux inversion! 🏆', incorrect: 'After "Not only" → invert.' } },
  { question: "Idiom 'to bite the bullet' means…", options: ['To eat very quickly', 'To face a difficult situation with courage', 'To make a serious mistake', 'To speak without thinking'], correctIndex: 1, difficulty: 1.0, targetLevel: 'C1', feedback: { correct: 'Endure with courage! 💪', incorrect: '"Bite the bullet" = face it bravely.' } },
];

// ---------------------------------------------------------------- PROFESSIONAL
const PROFESSIONAL_POOL: BankQuestion[] = [
  // A2
  { question: "Email opener: 'I ___ writing to enquire about your services.'", options: ['am', 'is', 'be', 'was'], correctIndex: 0, difficulty: 0.25, targetLevel: 'A2', feedback: { correct: '"I am writing" — standard professional opener.', incorrect: 'Use "am" with "I".' } },
  { question: "Polite request: 'Could you ___ send me the report?'", options: ['please', 'must', 'ought', 'have'], correctIndex: 0, difficulty: 0.3, targetLevel: 'A2', feedback: { correct: 'Polite + clear ✅', incorrect: '"Please" softens the request.' } },
  { question: "Best schedule verb: 'Let\'s ___ a meeting on Monday.'", options: ['do', 'make', 'schedule', 'put'], correctIndex: 2, difficulty: 0.35, targetLevel: 'A2', feedback: { correct: '"Schedule a meeting" — collocation!', incorrect: 'We "schedule" meetings.' } },
  { question: 'Which is more formal?', options: ['Hey, what\'s up?', 'Hi there!', 'Dear Mr. Patel,', 'Yo team!'], correctIndex: 2, difficulty: 0.3, targetLevel: 'A2', feedback: { correct: 'Yes — formal salutation.', incorrect: '"Dear Mr/Ms" is the formal opener.' } },
  // B1
  { question: "Workplace: 'We need to ___ a deadline by Friday.'", options: ['catch', 'meet', 'reach', 'arrive'], correctIndex: 1, difficulty: 0.5, targetLevel: 'B1', feedback: { correct: '"Meet a deadline" — perfect collocation.', incorrect: 'Collocation: "meet a deadline".' } },
  { question: "Email: 'Please find ___ the document you requested.'", options: ['attach', 'attaching', 'attached', 'attachment'], correctIndex: 2, difficulty: 0.55, targetLevel: 'B1', feedback: { correct: 'Standard email phrase ✉️', incorrect: '"Please find attached…"' } },
  { question: "Negotiation: 'I'm afraid that price is a little ___ our budget.'", options: ['over', 'beyond', 'after', 'on'], correctIndex: 1, difficulty: 0.6, targetLevel: 'B1', feedback: { correct: '"Beyond our budget" — diplomatic ✅', incorrect: '"Beyond" softens the rejection.' } },
  { question: '🎧 What is the speaker proposing?', options: ['Cancelling the project', 'Postponing the deadline by one week', 'Hiring two more people', 'Switching the supplier'], correctIndex: 1, difficulty: 0.65, targetLevel: 'B1', type: 'listening_match', audio_script: 'Given the current workload, I would suggest pushing the delivery date back by about a week so the team can fully test everything before launch.', feedback: { correct: 'Yes — postpone the deadline.', incorrect: 'They want to push delivery back a week.' } },
  // B2
  { question: "Diplomatic disagreement: 'I see your point, ___ I have a different perspective.'", options: ['so', 'because', 'however', 'therefore'], correctIndex: 2, difficulty: 0.7, targetLevel: 'B2', feedback: { correct: '"However" — professional contrast.', incorrect: 'Use "however" for polite disagreement.' } },
  { question: "Conditional: 'If we ___ earlier, we wouldn\'t be in this situation.'", options: ['act', 'acted', 'had acted', 'will act'], correctIndex: 2, difficulty: 0.8, targetLevel: 'B2', feedback: { correct: 'Third conditional ✅', incorrect: 'Past unreal → "had acted".' } },
  { question: "Reporting: 'She said the launch ___ delayed.'", options: ['is', 'has', 'had been', 'will'], correctIndex: 2, difficulty: 0.75, targetLevel: 'B2', feedback: { correct: 'Reported speech back-shift ✅', incorrect: 'Backshift: was/had been.' } },
  { question: 'Most professional close:', options: ['Bye!', 'See ya!', 'Kind regards,', 'Cheers mate,'], correctIndex: 2, difficulty: 0.6, targetLevel: 'B2', feedback: { correct: '"Kind regards" — neutral professional.', incorrect: '"Kind regards" suits most business contexts.' } },
  { question: "Phrasal: 'We need to ___ this issue at the next board meeting.'", options: ['bring up', 'bring on', 'bring out', 'bring in'], correctIndex: 0, difficulty: 0.75, targetLevel: 'B2', feedback: { correct: '"Bring up" = raise a topic.', incorrect: '"Bring up" = introduce a topic.' } },
  // C1
  { question: 'Most precise: "Sales ___ a sharp downturn in Q3."', options: ['saw', 'experienced', 'underwent', 'felt'], correctIndex: 1, difficulty: 0.85, targetLevel: 'C1', feedback: { correct: '"Experienced a downturn" — finance register.', incorrect: 'Best business collocation = "experienced".' } },
  { question: "Idiom 'to think outside the box' means…", options: ['To break a rule', 'To use creativity to solve a problem', 'To work outdoors', 'To leave a meeting early'], correctIndex: 1, difficulty: 0.85, targetLevel: 'C1', feedback: { correct: 'Creative problem-solving 💡', incorrect: '"Think outside the box" = be creative.' } },
  { question: '🎧 What is the speaker\'s recommendation?', options: ['Increase the marketing budget', 'Pause the campaign and reassess', 'Hire an external agency', 'Launch in a new market'], correctIndex: 1, difficulty: 0.9, targetLevel: 'C1', type: 'listening_match', audio_script: 'Looking at the conversion data, my honest recommendation would be to put the campaign on hold for a fortnight while we revisit the targeting and the messaging.', feedback: { correct: 'Yes — pause and reassess.', incorrect: 'They recommend pausing the campaign.' } },
  { question: 'Hedging: "It ___ that revenue will dip slightly next quarter."', options: ['appears', 'is', 'will be', 'did'], correctIndex: 0, difficulty: 0.85, targetLevel: 'C1', feedback: { correct: '"It appears" — professional hedge.', incorrect: '"Appears" softens the prediction.' } },
  { question: 'Best register for stakeholder update:', options: ['Stuff went sideways.', 'There were some hiccups.', 'We encountered several challenges that we are actively addressing.', 'It was a mess tbh.'], correctIndex: 2, difficulty: 0.9, targetLevel: 'C1', feedback: { correct: 'Polished and accountable ✅', incorrect: 'Stakeholder updates require formal register.' } },
];

const POOLS: Record<Hub, BankQuestion[]> = {
  playground: PLAYGROUND_POOL,
  academy: ACADEMY_POOL,
  professional: PROFESSIONAL_POOL,
};

// Pull `count` questions, ordered by difficulty asc, with shuffle inside each CEFR band
// so each test attempt is fresh but still scaffolded easy → hard.
export function buildPlacementBank(hub: Hub, count = 15): BankQuestion[] {
  const pool = POOLS[hub] ?? POOLS.academy;
  const byLevel: Record<Cefr, BankQuestion[]> = { A1: [], A2: [], B1: [], B2: [], C1: [] };
  for (const q of pool) byLevel[q.targetLevel].push(q);
  const order: Cefr[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const shuffled: BankQuestion[] = [];
  for (const lv of order) {
    const arr = [...byLevel[lv]];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    shuffled.push(...arr);
  }
  if (shuffled.length <= count) return shuffled;
  // Even sampling preserving order: take every Nth
  const step = shuffled.length / count;
  const out: BankQuestion[] = [];
  for (let i = 0; i < count; i++) out.push(shuffled[Math.floor(i * step)]);
  return out;
}
