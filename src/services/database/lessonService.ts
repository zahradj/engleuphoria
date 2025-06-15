
import { supabase } from '@/integrations/supabase/client';
import { Lesson, checkAuth } from './types';

export const lessonService = {
  async createLesson(lessonData: {
    teacher_id: string;
    student_id: string;
    title: string;
    scheduled_at: string;
    duration?: number;
    notes?: string;
  }) {
    await checkAuth();

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
    await checkAuth();

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
    await checkAuth();

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
    await checkAuth();

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
    await checkAuth();

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
  }
};
