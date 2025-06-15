import { supabase } from '@/lib/supabase';

// Types for the classroom system
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'teacher' | 'student';
  avatar_url?: string;
  timezone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  room_id: string;
  teacher_id: string;
  student_id: string;
  title: string;
  scheduled_at: string;
  duration: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meeting_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  teacher?: User;
  student?: User;
}

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

// Classroom Database Service
export const classroomDatabase = {
  // User management
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    // Get the current user ID from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('users')
      .insert([{ ...userData, id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUsersByRole(role: 'teacher' | 'student') {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true)
      .order('full_name');
    
    if (error) throw error;
    return data;
  },

  // Lesson management
  async createLesson(lessonData: {
    teacher_id: string;
    student_id: string;
    title: string;
    scheduled_at: string;
    duration?: number;
    notes?: string;
  }) {
    // Generate unique room ID
    const { data: student } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', lessonData.student_id)
      .single();
    
    const studentName = student?.full_name.split(' ')[0].toLowerCase() || 'student';
    const roomId = `${studentName}-${Math.random().toString(36).substr(2, 8)}`;
    
    const { data, error } = await supabase
      .from('lessons')
      .insert([{ ...lessonData, room_id: roomId }])
      .select(`
        *,
        teacher:users!teacher_id(id, full_name, email, role),
        student:users!student_id(id, full_name, email, role)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getLessonsByTeacher(teacherId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        teacher:users!teacher_id(id, full_name, email, role),
        student:users!student_id(id, full_name, email, role)
      `)
      .eq('teacher_id', teacherId)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLessonsByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        teacher:users!teacher_id(id, full_name, email, role),
        student:users!student_id(id, full_name, email, role)
      `)
      .eq('student_id', studentId)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLessonByRoomId(roomId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        teacher:users!teacher_id(id, full_name, email, role),
        student:users!student_id(id, full_name, email, role)
      `)
      .eq('room_id', roomId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateLessonStatus(lessonId: string, status: Lesson['status']) {
    const { data, error } = await supabase
      .from('lessons')
      .update({ status })
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Classroom session management
  async createClassroomSession(lessonId: string, roomId: string) {
    const { data, error } = await supabase
      .from('classroom_sessions')
      .insert([{ lesson_id: lessonId, room_id: roomId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSessionConnection(sessionId: string, userRole: 'teacher' | 'student', connected: boolean) {
    const updateField = userRole === 'teacher' ? 'teacher_connected' : 'student_connected';
    const updateData: any = { [updateField]: connected };
    
    // If connecting for the first time and no start time, set it
    if (connected) {
      const { data: session } = await supabase
        .from('classroom_sessions')
        .select('started_at')
        .eq('id', sessionId)
        .single();
      
      if (!session?.started_at) {
        updateData.started_at = new Date().toISOString();
      }
    }
    
    const { data, error } = await supabase
      .from('classroom_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getActiveSession(roomId: string) {
    const { data, error } = await supabase
      .from('classroom_sessions')
      .select('*')
      .eq('room_id', roomId)
      .is('ended_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
    return data;
  },

  // Chat management
  async sendChatMessage(sessionId: string, userId: string, message: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        session_id: sessionId,
        user_id: userId,
        message,
        message_type: 'text'
      }])
      .select(`
        *,
        user:users(id, full_name, role)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getChatMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:users(id, full_name, role)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Real-time subscriptions
  subscribeToChat(sessionId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  },

  subscribeToSessionUpdates(roomId: string, callback: (session: ClassroomSession) => void) {
    return supabase
      .channel(`session-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'classroom_sessions',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          callback(payload.new as ClassroomSession);
        }
      )
      .subscribe();
  }
};
