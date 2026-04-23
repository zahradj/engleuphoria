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

export type RewardType = 'star' | 'sticker';
export interface RewardPayload {
  rewardType: RewardType;
  /** Optional emoji or sticker key (for 'sticker') */
  sticker?: string;
  /** Running star total when rewardType === 'star' (optional). */
  starCount?: number;
  /** True every 5th star — triggers the carnival celebration */
  isMilestone?: boolean;
  senderId: string;
  timestamp: number;
}

export type ToolName = 'dice';
export interface ToolActionPayload {
  tool: ToolName;
  /** Numeric result of the action — e.g. dice value 1-6 */
  result: number;
  senderId: string;
  timestamp: number;
}

export interface ChatBroadcastPayload {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  text: string;
  timestamp: number;
}

type StrokeListener = (stroke: WhiteboardStroke) => void;
type ScrollListener = (payload: { scrollPercentage: number; senderId: string }) => void;
type StageModeListener = (payload: { mode: StageMode; senderId: string }) => void;
type DrawingEnabledListener = (payload: { enabled: boolean; senderId: string }) => void;
type RewardListener = (payload: RewardPayload) => void;
type ToolActionListener = (payload: ToolActionPayload) => void;
type ChatListener = (payload: ChatBroadcastPayload) => void;

interface RoomChannel {
  channel: ReturnType<typeof supabase.channel>;
  ready: Promise<void>;
  strokeListeners: Set<StrokeListener>;
  scrollListeners: Set<ScrollListener>;
  stageModeListeners: Set<StageModeListener>;
  drawingEnabledListeners: Set<DrawingEnabledListener>;
  rewardListeners: Set<RewardListener>;
  toolActionListeners: Set<ToolActionListener>;
  chatListeners: Set<ChatListener>;
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
    const stageModeListeners = new Set<StageModeListener>();
    const drawingEnabledListeners = new Set<DrawingEnabledListener>();
    const rewardListeners = new Set<RewardListener>();
    const toolActionListeners = new Set<ToolActionListener>();
    const chatListeners = new Set<ChatListener>();

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
      })
      .on('broadcast', { event: 'stage_mode' }, (payload) => {
        stageModeListeners.forEach((cb) => cb(payload.payload as any));
      })
      .on('broadcast', { event: 'drawing_enabled' }, (payload) => {
        drawingEnabledListeners.forEach((cb) => cb(payload.payload as any));
      })
      .on('broadcast', { event: 'reward' }, (payload) => {
        rewardListeners.forEach((cb) => cb(payload.payload as RewardPayload));
      })
      .on('broadcast', { event: 'tool_action' }, (payload) => {
        toolActionListeners.forEach((cb) => cb(payload.payload as ToolActionPayload));
      })
      .on('broadcast', { event: 'chat_message' }, (payload) => {
        chatListeners.forEach((cb) => cb(payload.payload as ChatBroadcastPayload));
      });

    const ready = new Promise<void>((resolve) => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') resolve();
      });
    });

    const room: RoomChannel = {
      channel,
      ready,
      strokeListeners,
      scrollListeners,
      stageModeListeners,
      drawingEnabledListeners,
      rewardListeners,
      toolActionListeners,
      chatListeners,
      refCount: 0,
    };
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

  /** Broadcast which mode the unified Main Stage is showing (slide / web / blank). */
  async sendStageMode(roomId: string, mode: StageMode, senderId: string): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'stage_mode',
      payload: { mode, senderId },
    });
  }

  subscribeToStageMode(roomId: string, onMode: StageModeListener): () => void {
    const room = this.getRoom(roomId);
    room.stageModeListeners.add(onMode);
    room.refCount += 1;
    return () => this.release(roomId, () => room.stageModeListeners.delete(onMode));
  }

  /** Broadcast whether the transparent annotation overlay captures pointer events. */
  async sendDrawingEnabled(roomId: string, enabled: boolean, senderId: string): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'drawing_enabled',
      payload: { enabled, senderId },
    });
  }

  subscribeToDrawingEnabled(roomId: string, onChange: DrawingEnabledListener): () => void {
    const room = this.getRoom(roomId);
    room.drawingEnabledListeners.add(onChange);
    room.refCount += 1;
    return () => this.release(roomId, () => room.drawingEnabledListeners.delete(onChange));
  }

  private release(roomId: string, cleanup: () => void) {
    const channelName = `classroom_${roomId}`;
    const room = this.rooms.get(channelName);
    if (!room) return;
    cleanup();
    room.refCount = Math.max(0, room.refCount - 1);
    if (
      room.refCount === 0 &&
      room.strokeListeners.size === 0 &&
      room.scrollListeners.size === 0 &&
      room.stageModeListeners.size === 0 &&
      room.drawingEnabledListeners.size === 0
    ) {
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
