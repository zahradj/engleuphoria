
export interface SpeakingSession {
  id: string;
  student_id: string;
  session_type: 'role_play' | 'picture_talk' | 'random_questions';
  scenario_name: string;
  cefr_level: string;
  duration_seconds: number;
  xp_earned: number;
  pronunciation_score?: number;
  grammar_score?: number;
  fluency_score?: number;
  overall_rating?: number;
  feedback_notes?: string;
  completed_at: string;
  created_at: string;
}

export interface SpeakingProgress {
  id: string;
  student_id: string;
  total_speaking_time: number;
  total_sessions: number;
  current_streak: number;
  longest_streak: number;
  last_practice_date?: string;
  current_cefr_level: string;
  speaking_xp: number;
  badges_earned: string[];
  updated_at: string;
  created_at: string;
}

export interface SpeakingScenario {
  id: string;
  name: string;
  type: 'role_play' | 'picture_talk' | 'random_questions';
  cefr_level: string;
  description: string;
  prompt: string;
  context_instructions?: string;
  expected_duration: number;
  difficulty_rating: number;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  feedback?: MessageFeedback;
}

export interface MessageFeedback {
  pronunciation_score?: number;
  grammar_suggestions?: string[];
  alternative_phrases?: string[];
  rating: number; // 1-5 stars
  encouragement: string;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob?: Blob;
  transcript?: string;
}

export interface SpeakingBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earnedAt?: string;
}
