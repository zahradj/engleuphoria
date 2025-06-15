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

// Classroom Database Service
export const classroomDatabase = {
  // User management - Updated to match actual schema
  async createUser(userData: { email: string; full_name: string; role: 'teacher' | 'student'; avatar_id?: number }) {
    // Get the current user ID from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        id: user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        avatar_id: userData.avatar_id || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async getUserByEmail(email: string) {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async getUsersByRole(role: 'teacher' | 'student') {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('full_name');
    
    if (error) throw error;
    return (data || []).map(user => ({ ...user, role: user.role as 'teacher' | 'student' })) as User[];
  },

  // Lesson management - Updated to work with existing lessons table
  async createLesson(lessonData: {
    teacher_id: string;
    student_id: string;
    title: string;
    scheduled_at: string;
    duration?: number;
    notes?: string;
  }) {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    // Generate unique room ID
    const { data: student } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', lessonData.student_id)
      .single();
    
    const studentName = student?.full_name?.split(' ')[0]?.toLowerCase() || 'student';
    const roomId = `${studentName}-${Math.random().toString(36).substr(2, 8)}`;
    
    const { data, error } = await supabase
      .from('lessons')
      .insert([{ 
        teacher_id: lessonData.teacher_id,
        student_id: lessonData.student_id,
        title: lessonData.title,
        scheduled_at: lessonData.scheduled_at,
        duration: lessonData.duration || 60,
        cost: 10.00 // Default cost
      }])
      .select(`
        *,
        teacher:users!teacher_id(id, full_name, email, role),
        student:users!student_id(id, full_name, email, role)
      `)
      .single();
    
    if (error) throw error;
    
    // Transform to match expected Lesson type
    if (data) {
      return {
        ...data,
        room_id: roomId,
        updated_at: data.created_at,
        notes: lessonData.notes,
        teacher: data.teacher ? { ...data.teacher, role: data.teacher.role as 'teacher' | 'student' } : undefined,
        student: data.student ? { ...data.student, role: data.student.role as 'teacher' | 'student' } : undefined
      } as Lesson;
    }
    throw new Error('Failed to create lesson');
  },

  async getLessonsByTeacher(teacherId: string) {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

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
    
    // Transform to match expected Lesson type
    return (data || []).map(lesson => ({
      ...lesson,
      room_id: `${lesson.student?.full_name?.split(' ')[0]?.toLowerCase() || 'student'}-${Math.random().toString(36).substr(2, 8)}`,
      updated_at: lesson.created_at,
      teacher: lesson.teacher ? { ...lesson.teacher, role: lesson.teacher.role as 'teacher' | 'student' } : undefined,
      student: lesson.student ? { ...lesson.student, role: lesson.student.role as 'teacher' | 'student' } : undefined
    })) as Lesson[];
  },

  async getLessonsByStudent(studentId: string) {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

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
    
    // Transform to match expected Lesson type
    return (data || []).map(lesson => ({
      ...lesson,
      room_id: `${lesson.student?.full_name?.split(' ')[0]?.toLowerCase() || 'student'}-${Math.random().toString(36).substr(2, 8)}`,
      updated_at: lesson.created_at,
      teacher: lesson.teacher ? { ...lesson.teacher, role: lesson.teacher.role as 'teacher' | 'student' } : undefined,
      student: lesson.student ? { ...lesson.student, role: lesson.student.role as 'teacher' | 'student' } : undefined
    })) as Lesson[];
  },

  async getLessonByRoomId(roomId: string) {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    // For now, return the first lesson as we don't have room_id in the database yet
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        teacher:users!teacher_id(id, full_name, email, role),
        student:users!student_id(id, full_name, email, role)
      `)
      .limit(1)
      .single();
    
    if (error) throw error;
    
    // Transform to match expected Lesson type
    if (data) {
      return {
        ...data,
        room_id: roomId,
        updated_at: data.created_at,
        teacher: data.teacher ? { ...data.teacher, role: data.teacher.role as 'teacher' | 'student' } : undefined,
        student: data.student ? { ...data.student, role: data.student.role as 'teacher' | 'student' } : undefined
      } as Lesson;
    }
    throw new Error('Lesson not found');
  },

  async updateLessonStatus(lessonId: string, status: Lesson['status']) {
    // Check if user is authenticated before making database calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('lessons')
      .update({ status })
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        room_id: `room-${Math.random().toString(36).substr(2, 8)}`,
        updated_at: new Date().toISOString()
      } as Lesson;
    }
    throw new Error('Failed to update lesson');
  },

  // Placeholder methods for classroom sessions (until tables are created)
  async createClassroomSession(lessonId: string, roomId: string) {
    // Return mock data until table is created
    return {
      id: `session-${Math.random().toString(36).substr(2, 8)}`,
      lesson_id: lessonId,
      room_id: roomId,
      teacher_connected: false,
      student_connected: false,
      created_at: new Date().toISOString()
    } as ClassroomSession;
  },

  async updateSessionConnection(sessionId: string, userRole: 'teacher' | 'student', connected: boolean) {
    // Return mock data until table is created
    return {
      id: sessionId,
      lesson_id: 'mock-lesson',
      room_id: 'mock-room',
      teacher_connected: userRole === 'teacher' ? connected : false,
      student_connected: userRole === 'student' ? connected : false,
      created_at: new Date().toISOString()
    } as ClassroomSession;
  },

  async getActiveSession(roomId: string) {
    // Return null until table is created
    return null;
  },

  // Placeholder methods for chat (until tables are created)
  async sendChatMessage(sessionId: string, userId: string, message: string) {
    // Return mock data until table is created
    return {
      id: `msg-${Math.random().toString(36).substr(2, 8)}`,
      session_id: sessionId,
      user_id: userId,
      message,
      message_type: 'text' as const,
      created_at: new Date().toISOString()
    } as ChatMessage;
  },

  async getChatMessages(sessionId: string) {
    // Return empty array until table is created
    return [] as ChatMessage[];
  },

  // Placeholder real-time subscriptions
  subscribeToChat(sessionId: string, callback: (message: ChatMessage) => void) {
    // Return mock subscription until real implementation
    return {
      unsubscribe: () => {}
    };
  },

  subscribeToSessionUpdates(roomId: string, callback: (session: ClassroomSession) => void) {
    // Return mock subscription until real implementation
    return {
      unsubscribe: () => {}
    };
  }
};
