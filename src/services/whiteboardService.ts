
import { supabase } from '@/lib/supabase';

export interface WhiteboardStroke {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  strokeData: {
    points: Array<{ x: number; y: number }>;
    color: string;
    width: number;
    tool: 'pen' | 'highlighter' | 'eraser';
  };
  timestamp: number;
}

export interface WhiteboardState {
  strokes: WhiteboardStroke[];
  currentPage: number;
  totalPages: number;
  backgroundImage?: string;
}

class WhiteboardService {
  private listeners: Map<string, (stroke: WhiteboardStroke) => void> = new Map();
  private channels: Map<string, any> = new Map();

  async saveStroke(roomId: string, stroke: Omit<WhiteboardStroke, 'id'>): Promise<void> {
    try {
      // For now, we'll use real-time channels for immediate sync
      // In production, you might also want to persist to database
      const channel = this.getOrCreateChannel(roomId);
      
      await channel.send({
        type: 'broadcast',
        event: 'whiteboard_stroke',
        payload: {
          ...stroke,
          id: `${Date.now()}-${Math.random()}`
        }
      });
    } catch (error) {
      console.error('Failed to save whiteboard stroke:', error);
      throw error;
    }
  }

  subscribeToStrokes(roomId: string, onStroke: (stroke: WhiteboardStroke) => void): () => void {
    const channelName = `whiteboard_${roomId}`;
    
    // Clean up existing channel if it exists
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName));
    }

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'whiteboard_stroke' }, (payload) => {
        onStroke(payload.payload as WhiteboardStroke);
      })
      .on('broadcast', { event: 'whiteboard_clear' }, () => {
        // Handle whiteboard clear event
        onStroke({
          id: 'clear',
          roomId,
          userId: 'system',
          userName: 'System',
          strokeData: {
            points: [],
            color: 'transparent',
            width: 0,
            tool: 'eraser'
          },
          timestamp: Date.now()
        });
      })
      .subscribe();

    this.channels.set(channelName, channel);

    // Store listener for cleanup
    this.listeners.set(roomId, onStroke);

    // Return cleanup function
    return () => {
      if (this.channels.has(channelName)) {
        supabase.removeChannel(this.channels.get(channelName));
        this.channels.delete(channelName);
      }
      this.listeners.delete(roomId);
    };
  }

  async clearWhiteboard(roomId: string): Promise<void> {
    try {
      const channel = this.getOrCreateChannel(roomId);
      
      await channel.send({
        type: 'broadcast',
        event: 'whiteboard_clear',
        payload: { roomId, timestamp: Date.now() }
      });
    } catch (error) {
      console.error('Failed to clear whiteboard:', error);
      throw error;
    }
  }

  async changeBackground(roomId: string, backgroundImage: string): Promise<void> {
    try {
      const channel = this.getOrCreateChannel(roomId);
      
      await channel.send({
        type: 'broadcast',
        event: 'whiteboard_background',
        payload: { roomId, backgroundImage, timestamp: Date.now() }
      });
    } catch (error) {
      console.error('Failed to change whiteboard background:', error);
      throw error;
    }
  }

  private getOrCreateChannel(roomId: string) {
    const channelName = `whiteboard_${roomId}`;
    
    if (!this.channels.has(channelName)) {
      const channel = supabase.channel(channelName);
      this.channels.set(channelName, channel);
      return channel;
    }
    
    return this.channels.get(channelName);
  }

  disconnect(roomId: string) {
    const channelName = `whiteboard_${roomId}`;
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName));
      this.channels.delete(channelName);
    }
    this.listeners.delete(roomId);
  }
}

export const whiteboardService = new WhiteboardService();
