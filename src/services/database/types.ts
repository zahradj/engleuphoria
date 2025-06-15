
import { supabase } from '@/integrations/supabase/client';

// Types for the classroom system - Updated to match actual Supabase schema
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'teacher' | 'student';
  avatar_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  teacher_id: string;
  student_id: string;
  title: string;
  scheduled_at: string;
  duration: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  cost?: number;
  created_at: string;
  // Add missing fields that are expected by components
  room_id?: string;
  updated_at?: string;
  notes?: string;
  meeting_url?: string;
  teacher?: User;
  student?: User;
}

// Placeholder interfaces for features that need database tables
export interface ClassroomSession {
  id: string;
  lesson_id: string;
  room_id: string;
  teacher_connected: boolean;
  student_connected: boolean;
  started_at?: string;
  ended_at?: string;
  recording_url?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  message: string;
  message_type: 'text' | 'file' | 'system';
  created_at: string;
  user?: User;
}

// Helper function to check authentication
export const checkAuth = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};
