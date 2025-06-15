
import { ChatMessage } from './types';

// Placeholder methods for chat (until tables are created)
export const chatService = {
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

  subscribeToChat(sessionId: string, callback: (message: ChatMessage) => void) {
    // Return mock subscription until real implementation
    return {
      unsubscribe: () => {}
    };
  }
};
