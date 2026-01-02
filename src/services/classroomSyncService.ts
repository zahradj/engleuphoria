import { supabase } from '@/lib/supabase';

export interface ClassroomSession {
  id: string;
  roomId: string;
  teacherId: string;
  currentSlideIndex: number;
  lessonTitle: string;
  lessonSlides: Array<{ id: string; title: string; imageUrl?: string; type?: string; quizQuestion?: string; quizOptions?: Array<{ id: string; text: string; isCorrect: boolean }>; pollQuestion?: string; pollOptions?: Array<{ id: string; text: string }> }>;
  activeTool: string;
  studentCanDraw: boolean;
  sessionStatus: string;
  quizActive: boolean;
  quizLocked: boolean;
  quizRevealAnswer: boolean;
  currentQuizSlideId: string | null;
  pollActive: boolean;
  pollShowResults: boolean;
  currentPollSlideId: string | null;
}

export interface SessionUpdate {
  currentSlideIndex?: number;
  activeTool?: string;
  studentCanDraw?: boolean;
  lessonSlides?: Array<{ id: string; title: string; imageUrl?: string }>;
  lessonTitle?: string;
  quizActive?: boolean;
  quizLocked?: boolean;
  quizRevealAnswer?: boolean;
  currentQuizSlideId?: string | null;
  pollActive?: boolean;
  pollShowResults?: boolean;
  currentPollSlideId?: string | null;
}

class ClassroomSyncService {
  private channels: Map<string, any> = new Map();

  async createOrUpdateSession(
    roomId: string,
    teacherId: string,
    lessonData: {
      title: string;
      slides: Array<{ id: string; title: string; imageUrl?: string }>;
    }
  ): Promise<ClassroomSession | null> {
    try {
      // Check for existing active session
      const { data: existing } = await supabase
        .from('classroom_sessions')
        .select('*')
        .eq('room_id', roomId)
        .eq('session_status', 'active')
        .single();

      if (existing) {
        // Update existing session
        const { data, error } = await supabase
          .from('classroom_sessions')
          .update({
            lesson_title: lessonData.title,
            lesson_slides: lessonData.slides,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return this.mapToSession(data);
      }

      // Create new session
      const { data, error } = await supabase
        .from('classroom_sessions')
        .insert({
          room_id: roomId,
          teacher_id: teacherId,
          lesson_title: lessonData.title,
          lesson_slides: lessonData.slides,
          current_slide_index: 0,
          active_tool: 'pointer',
          student_can_draw: false,
          session_status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapToSession(data);
    } catch (error) {
      console.error('Failed to create/update session:', error);
      return null;
    }
  }

  async getActiveSession(roomId: string): Promise<ClassroomSession | null> {
    try {
      const { data, error } = await supabase
        .from('classroom_sessions')
        .select('*')
        .eq('room_id', roomId)
        .eq('session_status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return this.mapToSession(data);
    } catch (error) {
      console.error('Failed to get active session:', error);
      return null;
    }
  }

  async updateSession(roomId: string, updates: SessionUpdate): Promise<void> {
    try {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (updates.currentSlideIndex !== undefined) {
        updateData.current_slide_index = updates.currentSlideIndex;
      }
      if (updates.activeTool !== undefined) {
        updateData.active_tool = updates.activeTool;
      }
      if (updates.studentCanDraw !== undefined) {
        updateData.student_can_draw = updates.studentCanDraw;
      }
      if (updates.lessonSlides !== undefined) {
        updateData.lesson_slides = updates.lessonSlides;
      }
      if (updates.lessonTitle !== undefined) {
        updateData.lesson_title = updates.lessonTitle;
      }
      if (updates.quizActive !== undefined) {
        updateData.quiz_active = updates.quizActive;
      }
      if (updates.quizLocked !== undefined) {
        updateData.quiz_locked = updates.quizLocked;
      }
      if (updates.quizRevealAnswer !== undefined) {
        updateData.quiz_reveal_answer = updates.quizRevealAnswer;
      }
      if (updates.currentQuizSlideId !== undefined) {
        updateData.current_quiz_slide_id = updates.currentQuizSlideId;
      }
      if (updates.pollActive !== undefined) {
        updateData.poll_active = updates.pollActive;
      }
      if (updates.pollShowResults !== undefined) {
        updateData.poll_show_results = updates.pollShowResults;
      }
      if (updates.currentPollSlideId !== undefined) {
        updateData.current_poll_slide_id = updates.currentPollSlideId;
      }

      const { error } = await supabase
        .from('classroom_sessions')
        .update(updateData)
        .eq('room_id', roomId)
        .eq('session_status', 'active');

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  }

  async endSession(roomId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('classroom_sessions')
        .update({
          session_status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('room_id', roomId)
        .eq('session_status', 'active');

      if (error) throw error;
    } catch (error) {
      console.error('Failed to end session:', error);
      throw error;
    }
  }

  subscribeToSession(
    roomId: string,
    onUpdate: (session: ClassroomSession) => void
  ): () => void {
    const channelName = `classroom_session_${roomId}`;

    // Clean up existing channel
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName));
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'classroom_sessions',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const session = this.mapToSession(payload.new);
          if (session) {
            onUpdate(session);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      if (this.channels.has(channelName)) {
        supabase.removeChannel(this.channels.get(channelName));
        this.channels.delete(channelName);
      }
    };
  }

  private mapToSession(data: any): ClassroomSession {
    return {
      id: data.id,
      roomId: data.room_id,
      teacherId: data.teacher_id,
      currentSlideIndex: data.current_slide_index || 0,
      lessonTitle: data.lesson_title || 'Untitled Lesson',
      lessonSlides: data.lesson_slides || [],
      activeTool: data.active_tool || 'pointer',
      studentCanDraw: data.student_can_draw || false,
      sessionStatus: data.session_status,
      quizActive: data.quiz_active || false,
      quizLocked: data.quiz_locked || false,
      quizRevealAnswer: data.quiz_reveal_answer || false,
      currentQuizSlideId: data.current_quiz_slide_id || null,
      pollActive: data.poll_active || false,
      pollShowResults: data.poll_show_results || false,
      currentPollSlideId: data.current_poll_slide_id || null
    };
  }

  disconnect(roomId: string) {
    const channelName = `classroom_session_${roomId}`;
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName));
      this.channels.delete(channelName);
    }
  }
}

export const classroomSyncService = new ClassroomSyncService();
