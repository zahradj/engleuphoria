export interface AIGeneratedTopic {
  id: string;
  topic_text: string;
  category: string;
  cefr_level: string;
  keywords: string[];
  context_prompts: Record<string, any>;
  difficulty_score: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export interface SpeakingGroup {
  id: string;
  group_name: string;
  cefr_level: string;
  max_participants: number;
  current_participants: number;
  session_duration: number;
  topic_category?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpeakingClassroomSession {
  id: string;
  student_id: string;
  group_id?: string;
  topic_id?: string;
  generated_topic?: string;
  session_type: 'guided' | 'free_flow' | 'structured';
  difficulty_level?: string;
  total_questions: number;
  questions_answered: number;
  avg_response_time?: number;
  vocabulary_used: string[];
  session_metadata: Record<string, any>;
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface SpeakingGroupSession {
  id: string;
  group_id: string;
  session_topic: string;
  ai_facilitator_prompt?: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  session_status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  participant_count: number;
  session_metadata: Record<string, any>;
  created_at: string;
}

export interface SpeakingQuestion {
  id: string;
  session_id?: string;
  group_session_id?: string;
  question_text: string;
  question_type: 'opening' | 'follow_up' | 'deep_dive' | 'wrap_up';
  student_response?: string;
  ai_analysis: Record<string, any>;
  response_time_seconds?: number;
  created_at: string;
}

export interface SpeakingGroupParticipant {
  id: string;
  group_id: string;
  session_id?: string;
  student_id: string;
  joined_at: string;
  left_at?: string;
  participation_score: number;
  speaking_time_seconds: number;
  questions_asked: number;
  questions_answered: number;
  ai_feedback: Record<string, any>;
}

export interface StudentSpeakingProfile {
  id: string;
  student_id: string;
  current_cefr_level: string;
  confidence_level: 'low' | 'medium' | 'high';
  preferred_topics: string[];
  speaking_goals: string[];
  availability_schedule: Record<string, any>;
  personality_type: 'introvert' | 'extrovert' | 'ambivert';
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  updated_at: string;
  created_at: string;
}

export interface AITopicSuggestion {
  topic: string;
  category: string;
  difficulty: number;
  keywords: string[];
  context: string;
  estimated_duration: number;
}

export interface AIQuestionResponse {
  question: string;
  type: 'opening' | 'follow_up' | 'deep_dive' | 'wrap_up';
  context: string;
  suggested_responses?: string[];
  conversation_tips?: string[];
  acknowledgment?: string;
  full_response?: string;
  question_id?: string;
}

export interface ClassroomAnalytics {
  session_id: string;
  speaking_time: number;
  vocabulary_count: number;
  fluency_score: number;
  confidence_level: number;
  improvement_areas: string[];
  achievements: string[];
}

export interface GroupRecommendation {
  group: SpeakingGroup;
  compatibility_score: number;
  reasons: string[];
  optimal_time_slots: string[];
}