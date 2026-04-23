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

export type StageMode = 'slide' | 'web' | 'blank';

type StrokeListener = (stroke: WhiteboardStroke) => void;
type ScrollListener = (payload: { scrollPercentage: number; senderId: string }) => void;
type StageModeListener = (payload: { mode: StageMode; senderId: string }) => void;
type DrawingEnabledListener = (payload: { enabled: boolean; senderId: string }) => void;

interface RoomChannel {
  channel: ReturnType<typeof supabase.channel>;
  ready: Promise<void>;
  strokeListeners: Set<StrokeListener>;
  scrollListeners: Set<ScrollListener>;
  stageModeListeners: Set<StageModeListener>;
  drawingEnabledListeners: Set<DrawingEnabledListener>;
  refCount: number;
}

class WhiteboardService {
  private rooms: Map<string, RoomChannel> = new Map();

  /**
   * Get (or create) a single SUBSCRIBED realtime channel per room.
   * Critical: Supabase requires `.subscribe()` before `.send()` will deliver.
   */
  private getRoom(roomId: string): RoomChannel {
    const channelName = `classroom_${roomId}`;
    const existing = this.rooms.get(channelName);
    if (existing) return existing;

    const strokeListeners = new Set<StrokeListener>();
    const scrollListeners = new Set<ScrollListener>();

    const channel = supabase
      .channel(channelName, { config: { broadcast: { self: false, ack: false } } })
      .on('broadcast', { event: 'whiteboard_stroke' }, (payload) => {
        const stroke = payload.payload as WhiteboardStroke;
        strokeListeners.forEach((cb) => cb(stroke));
      })
      .on('broadcast', { event: 'whiteboard_clear' }, () => {
        strokeListeners.forEach((cb) =>
          cb({
            id: 'clear',
            roomId,
            userId: 'system',
            userName: 'System',
            strokeData: { points: [], color: 'transparent', width: 0, tool: 'eraser' },
            timestamp: Date.now(),
          })
        );
      })
      .on('broadcast', { event: 'web_scroll' }, (payload) => {
        scrollListeners.forEach((cb) => cb(payload.payload as any));
      });

    const ready = new Promise<void>((resolve) => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') resolve();
      });
    });

    const room: RoomChannel = { channel, ready, strokeListeners, scrollListeners, refCount: 0 };
    this.rooms.set(channelName, room);
    return room;
  }

  async saveStroke(roomId: string, stroke: Omit<WhiteboardStroke, 'id'>): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'whiteboard_stroke',
      payload: { ...stroke, id: `${Date.now()}-${Math.random()}` },
    });
  }

  async clearWhiteboard(roomId: string): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'whiteboard_clear',
      payload: { roomId, timestamp: Date.now() },
    });
  }

  /**
   * Sync the parent-wrapper scroll position of embedded web content.
   * Cross-origin iframes can't be scrolled directly — caller must wrap
   * the iframe in a scrollable div and broadcast that wrapper's scroll %.
   */
  async sendScroll(roomId: string, scrollPercentage: number, senderId: string): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'web_scroll',
      payload: { scrollPercentage, senderId },
    });
  }

  subscribeToStrokes(roomId: string, onStroke: StrokeListener): () => void {
    const room = this.getRoom(roomId);
    room.strokeListeners.add(onStroke);
    room.refCount += 1;
    return () => this.release(roomId, () => room.strokeListeners.delete(onStroke));
  }

  subscribeToScroll(roomId: string, onScroll: ScrollListener): () => void {
    const room = this.getRoom(roomId);
    room.scrollListeners.add(onScroll);
    room.refCount += 1;
    return () => this.release(roomId, () => room.scrollListeners.delete(onScroll));
  }

  private release(roomId: string, cleanup: () => void) {
    const channelName = `classroom_${roomId}`;
    const room = this.rooms.get(channelName);
    if (!room) return;
    cleanup();
    room.refCount = Math.max(0, room.refCount - 1);
    if (room.refCount === 0 && room.strokeListeners.size === 0 && room.scrollListeners.size === 0) {
      supabase.removeChannel(room.channel);
      this.rooms.delete(channelName);
    }
  }

  async changeBackground(roomId: string, backgroundImage: string): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'whiteboard_background',
      payload: { roomId, backgroundImage, timestamp: Date.now() },
    });
  }

  disconnect(roomId: string) {
    const channelName = `classroom_${roomId}`;
    const room = this.rooms.get(channelName);
    if (room) {
      supabase.removeChannel(room.channel);
      this.rooms.delete(channelName);
    }
  }
}

export const whiteboardService = new WhiteboardService();
