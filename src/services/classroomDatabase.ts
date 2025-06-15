
// Re-export all services and types from the new modular structure
export * from './database/types';
export { userService } from './database/userService';
export { lessonService } from './database/lessonService';
export { sessionService } from './database/sessionService';
export { chatService } from './database/chatService';

// Main classroom database service that combines all services
import { userService } from './database/userService';
import { lessonService } from './database/lessonService';
import { sessionService } from './database/sessionService';
import { chatService } from './database/chatService';

export const classroomDatabase = {
  // User management
  createUser: userService.createUser,
  getUserByEmail: userService.getUserByEmail,
  getUsersByRole: userService.getUsersByRole,

  // Lesson management
  createLesson: lessonService.createLesson,
  getLessonsByTeacher: lessonService.getLessonsByTeacher,
  getLessonsByStudent: lessonService.getLessonsByStudent,
  getLessonByRoomId: lessonService.getLessonByRoomId,
  updateLessonStatus: lessonService.updateLessonStatus,

  // Session management
  createClassroomSession: sessionService.createClassroomSession,
  updateSessionConnection: sessionService.updateSessionConnection,
  getActiveSession: sessionService.getActiveSession,
  subscribeToSessionUpdates: sessionService.subscribeToSessionUpdates,

  // Chat management
  sendChatMessage: chatService.sendChatMessage,
  getChatMessages: chatService.getChatMessages,
  subscribeToChat: chatService.subscribeToChat
};
