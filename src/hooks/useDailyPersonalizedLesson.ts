import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DailyWord {
  word: string;
  definition: string;
  example: string;
  pronunciation?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface DailyLesson {
  title: string;
  theme: string;
  vocabularySpotlight: DailyWord[];
  quiz: QuizQuestion[];
}

interface StudentContext {
  studentLevel: string;
  cefrLevel: string;
  interests: string[];
  lastMistake: string;
}

// Cache key pattern: daily-lesson-{userId}-{date}
const getCacheKey = (userId: string) =>
  `daily-lesson-${userId}-${new Date().toISOString().split('T')[0]}`;

function buildLesson(ctx: StudentContext): DailyLesson {
  const { studentLevel, interests, cefrLevel, lastMistake } = ctx;

  const interestTopic = interests?.[0] || 'everyday life';
  const mistake = lastMistake || 'verb tenses';

  // Generate contextual title
  const levelTitles: Record<string, string[]> = {
    playground: [
      `Let's Learn Colors with ${interestTopic}!`,
      `Action Words in ${interestTopic} World`,
      `Amazing Animals & Adjectives`,
    ],
    academy: [
      `Mastering Future Tense through ${interestTopic}`,
      `${interestTopic} Slang & Grammar Upgrade`,
      `Real Talk: ${interestTopic} Vocabulary`,
    ],
    professional: [
      `Business Negotiation & ${interestTopic}`,
      `Professional Tone for ${interestTopic} Contexts`,
      `Advanced ${interestTopic} Discourse Patterns`,
    ],
  };

  const titles = levelTitles[studentLevel] || levelTitles['academy'];
  const title = titles[new Date().getDay() % titles.length];

  // Vocabulary by level
  const vocabSets: Record<string, DailyWord[]> = {
    playground: [
      { word: 'bright', definition: 'Full of light or colour', example: 'The sun is bright today!', pronunciation: '/braɪt/' },
      { word: 'leap', definition: 'To jump high', example: 'The frog can leap very far.', pronunciation: '/liːp/' },
      { word: 'giggle', definition: 'A small happy laugh', example: 'She gave a little giggle.', pronunciation: '/ˈɡɪɡ.əl/' },
      { word: 'cozy', definition: 'Warm and comfortable', example: 'The blanket is so cozy!', pronunciation: '/ˈkoʊ.zi/' },
      { word: 'whisper', definition: 'To speak very softly', example: 'Please whisper in the library.', pronunciation: '/ˈwɪs.pər/' },
    ],
    academy: [
      { word: 'hustle', definition: 'Work hard with energy and urgency', example: 'You have to hustle to reach your goals.', pronunciation: '/ˈhʌs.əl/' },
      { word: 'vibe', definition: 'The general feeling of a place or situation', example: 'This place has a great vibe.', pronunciation: '/vaɪb/' },
      { word: 'iconic', definition: 'Widely admired and recognized', example: 'That sneaker is iconic in streetwear.', pronunciation: '/aɪˈkɒn.ɪk/' },
      { word: 'negotiate', definition: 'To discuss to reach an agreement', example: 'They negotiated a better deal.', pronunciation: '/nɪˈɡoʊ.ʃi.eɪt/' },
      { word: 'momentum', definition: 'Energy that keeps things moving forward', example: 'Build momentum with small wins.', pronunciation: '/məˈmen.təm/' },
    ],
    professional: [
      { word: 'leverage', definition: 'Use something to maximum advantage', example: 'We can leverage this partnership.', pronunciation: '/ˈlev.ər.ɪdʒ/' },
      { word: 'articulate', definition: 'Express clearly and effectively', example: 'She articulated the strategy well.', pronunciation: '/ɑːˈtɪk.jʊ.lət/' },
      { word: 'synergy', definition: 'Combined effort greater than the sum of parts', example: 'There is great synergy between departments.', pronunciation: '/ˈsɪn.ər.dʒi/' },
      { word: 'pivot', definition: 'Change direction strategically', example: 'The company decided to pivot its model.', pronunciation: '/ˈpɪv.ət/' },
      { word: 'stakeholder', definition: 'A person with an interest in a project', example: 'All stakeholders must be informed.', pronunciation: '/ˈsteɪk.hoʊl.dər/' },
    ],
  };

  const vocab = vocabSets[studentLevel] || vocabSets['academy'];

  // Quiz by level — addresses last mistake theme
  const quizSets: Record<string, QuizQuestion[]> = {
    playground: [
      {
        id: 1,
        question: 'What is the opposite of "bright"?',
        options: ['Dark', 'Happy', 'Fast', 'Big'],
        correctIndex: 0,
      },
      {
        id: 2,
        question: 'Which word means "to jump high"?',
        options: ['Swim', 'Leap', 'Crawl', 'Roll'],
        correctIndex: 1,
      },
      {
        id: 3,
        question: 'Fill in the blank: "The blanket is very ___."',
        options: ['Loud', 'Cozy', 'Angry', 'Heavy'],
        correctIndex: 1,
      },
    ],
    academy: [
      {
        id: 1,
        question: `"She ___ (hustle) every day to achieve her dreams." (Past tense — fixes: ${mistake})`,
        options: ['hustle', 'hustles', 'hustled', 'hustling'],
        correctIndex: 2,
      },
      {
        id: 2,
        question: 'Which is the most professional way to say "I think this is a good idea"?',
        options: ['It slaps fr.', 'I personally believe this approach has merit.', 'This vibes.', 'Kinda works I guess.'],
        correctIndex: 1,
      },
      {
        id: 3,
        question: '"Build ___ with small wins." (Choose the correct word)',
        options: ['noise', 'momentum', 'chaos', 'stress'],
        correctIndex: 1,
      },
    ],
    professional: [
      {
        id: 1,
        question: `"To ___ our resources effectively" — choose the correct word (fixes: ${mistake})`,
        options: ['waste', 'leverage', 'ignore', 'delay'],
        correctIndex: 1,
      },
      {
        id: 2,
        question: '"All ___ must approve the budget." What word fits best?',
        options: ['bystanders', 'strangers', 'stakeholders', 'employees'],
        correctIndex: 2,
      },
      {
        id: 3,
        question: 'Which sentence is most formally articulate?',
        options: [
          'We need to change stuff up.',
          'The company will pivot its core strategy to address market shifts.',
          'Things are not working so we pivot.',
          'Let us pivot because of issues.',
        ],
        correctIndex: 1,
      },
    ],
  };

  const quiz = quizSets[studentLevel] || quizSets['academy'];

  return {
    title,
    theme: interestTopic,
    vocabularySpotlight: vocab,
    quiz,
  };
}

export function useDailyPersonalizedLesson() {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [fluencyScore, setFluencyScore] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      setLoading(true);

      // Check cache first
      const cacheKey = getCacheKey(user.id);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setLesson(parsed.lesson);
          setCompleted(parsed.completed || false);
          setLoading(false);
          return;
        } catch {}
      }

      // Fetch student context from DB
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('student_level, cefr_level, interests, mistake_history, fluency_score')
        .eq('user_id', user.id)
        .maybeSingle();

      const mistakeHistory = (profile?.mistake_history as any[]) || [];
      const lastMistake = mistakeHistory.length > 0
        ? (mistakeHistory[mistakeHistory.length - 1]?.error || 'verb tenses')
        : 'verb tenses';

      const ctx: StudentContext = {
        studentLevel: profile?.student_level || 'academy',
        cefrLevel: profile?.cefr_level || 'A2',
        interests: (profile?.interests as string[]) || ['everyday life'],
        lastMistake,
      };

      const built = buildLesson(ctx);
      setLesson(built);
      setFluencyScore(profile?.fluency_score ?? 0);

      // Cache it
      localStorage.setItem(cacheKey, JSON.stringify({ lesson: built, completed: false }));
      setLoading(false);
    };

    load();
  }, [user?.id]);

  const markComplete = useCallback(async () => {
    if (!user?.id || completed) return;

    setCompleted(true);

    // Increment fluency_score by 1
    const { data: current } = await supabase
      .from('student_profiles')
      .select('fluency_score')
      .eq('user_id', user.id)
      .maybeSingle();

    const newScore = (current?.fluency_score ?? 0) + 1;

    await supabase
      .from('student_profiles')
      .update({ fluency_score: newScore })
      .eq('user_id', user.id);

    setFluencyScore(newScore);

    // Update cache
    const cacheKey = getCacheKey(user.id);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        localStorage.setItem(cacheKey, JSON.stringify({ ...parsed, completed: true }));
      } catch {}
    }
  }, [user?.id, completed]);

  return { lesson, loading, completed, fluencyScore, markComplete };
}
