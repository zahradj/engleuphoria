import { SpeakingScenario, SpeakingProgress, SpeakingSession } from '@/types/speaking';

// Mock speaking scenarios for demo mode
export const demoSpeakingScenarios: SpeakingScenario[] = [
  {
    id: 'demo-1',
    name: 'Ordering Coffee',
    type: 'role_play',
    cefr_level: 'A1',
    description: 'Practice ordering coffee at a café',
    prompt: 'You are at a coffee shop. Order your favorite drink and ask about the price.',
    context_instructions: 'The AI will be a friendly barista. Use polite language and simple present tense.',
    expected_duration: 120,
    difficulty_rating: 1,
    tags: ['coffee', 'ordering', 'basic'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    name: 'Introducing Yourself',
    type: 'random_questions',
    cefr_level: 'A1',
    description: 'Practice basic self-introduction',
    prompt: 'Tell me about yourself. What is your name? Where are you from? What do you like to do?',
    context_instructions: 'Answer the questions about yourself using simple sentences.',
    expected_duration: 150,
    difficulty_rating: 1,
    tags: ['introduction', 'personal', 'basic'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-3',
    name: 'Describing a Picture',
    type: 'picture_talk',
    cefr_level: 'A2',
    description: 'Describe what you see in a picture',
    prompt: 'Look at this picture of a park. Describe what you can see. What are people doing?',
    context_instructions: 'Use present continuous tense to describe actions. Mention colors, objects, and activities.',
    expected_duration: 180,
    difficulty_rating: 2,
    tags: ['description', 'vocabulary', 'present continuous'],
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Demo speaking progress
export const getDemoSpeakingProgress = (): SpeakingProgress => {
  const stored = localStorage.getItem('demo_speaking_progress');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultProgress: SpeakingProgress = {
    id: 'demo-progress-1',
    student_id: 'demo-student',
    current_cefr_level: 'A1',
    total_speaking_time: 1800, // 30 minutes
    total_sessions: 5,
    current_streak: 2,
    longest_streak: 3,
    speaking_xp: 250,
    badges_earned: ['first_session', 'five_sessions'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  localStorage.setItem('demo_speaking_progress', JSON.stringify(defaultProgress));
  return defaultProgress;
};

// Demo speaking sessions
export const getDemoSpeakingSessions = (): SpeakingSession[] => {
  const stored = localStorage.getItem('demo_speaking_sessions');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultSessions: SpeakingSession[] = [
    {
      id: 'demo-session-1',
      student_id: 'demo-student',
      session_type: 'role_play',
      scenario_name: 'Ordering Coffee',
      cefr_level: 'A1',
      duration_seconds: 180,
      xp_earned: 50,
      overall_rating: 4,
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      completed_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'demo-session-2',
      student_id: 'demo-student',
      session_type: 'random_questions',
      scenario_name: 'Introducing Yourself',
      cefr_level: 'A1',
      duration_seconds: 240,
      xp_earned: 60,
      overall_rating: 5,
      created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      completed_at: new Date(Date.now() - 43200000).toISOString()
    }
  ];
  
  localStorage.setItem('demo_speaking_sessions', JSON.stringify(defaultSessions));
  return defaultSessions;
};

// Update demo progress
export const updateDemoProgress = (sessionData: any) => {
  const progress = getDemoSpeakingProgress();
  const updatedProgress = {
    ...progress,
    total_speaking_time: progress.total_speaking_time + sessionData.duration_seconds,
    total_sessions: progress.total_sessions + 1,
    speaking_xp: progress.speaking_xp + sessionData.xp_earned,
    current_streak: progress.current_streak + 1,
    longest_streak: Math.max(progress.longest_streak, progress.current_streak + 1),
    updated_at: new Date().toISOString()
  };
  
  localStorage.setItem('demo_speaking_progress', JSON.stringify(updatedProgress));
  return updatedProgress;
};

// Add demo session
export const addDemoSession = (sessionData: any) => {
  const sessions = getDemoSpeakingSessions();
  const newSession: SpeakingSession = {
    id: `demo-session-${Date.now()}`,
    student_id: 'demo-student',
    session_type: sessionData.session_type,
    scenario_name: sessionData.scenario_name,
    cefr_level: sessionData.cefr_level,
    duration_seconds: sessionData.duration_seconds,
    xp_earned: sessionData.xp_earned,
    overall_rating: sessionData.overall_rating || 4,
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString()
  };
  
  const updatedSessions = [newSession, ...sessions];
  localStorage.setItem('demo_speaking_sessions', JSON.stringify(updatedSessions));
  return newSession;
};

// Get today's speaking time for demo
export const getDemoTodaysSpeakingTime = (): number => {
  const sessions = getDemoSpeakingSessions();
  const today = new Date().toISOString().split('T')[0];
  
  return sessions
    .filter(session => session.completed_at?.startsWith(today))
    .reduce((total, session) => total + session.duration_seconds, 0);
};
