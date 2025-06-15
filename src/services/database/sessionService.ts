
import { ClassroomSession } from './types';

// Placeholder methods for classroom sessions (until tables are created)
export const sessionService = {
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

  subscribeToSessionUpdates(roomId: string, callback: (session: ClassroomSession) => void) {
    // Return mock subscription until real implementation
    return {
      unsubscribe: () => {}
    };
  }
};
