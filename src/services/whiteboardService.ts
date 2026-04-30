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

export type StageMode =
  | 'slide'
  | 'web'
  | 'blank'
  | 'native_game_flashcards'
  | 'native_game_memory'
  | 'native_game_sentence'
  | 'native_game_blanks';

/** Worksheet shape returned by the `generate-smart-worksheet` edge function. */
export interface SmartWorksheet {
  flashcards: Array<{ word: string; definition: string; example_sentence: string }>;
  memory_match: Array<{ pair_1: string; pair_2: string }>;
  sentence_builder: Array<{ full_sentence: string; scrambled_words: string[] }>;
  fill_in_blanks: Array<{ sentence_with_blank: string; correct_answer: string; distractors: string[] }>;
}

export type NativeGameType = 'flashcards' | 'memory' | 'sentence' | 'blanks';

export interface WorksheetLoadPayload {
  worksheet: SmartWorksheet;
  gameType: NativeGameType;
  /** Stable per-launch nonce so receivers know whether they've already applied this worksheet. */
  launchId: string;
  senderId: string;
  timestamp: number;
}

export interface GameStatePayload {
  gameType: NativeGameType;
  /** Game-specific state (chip order, flipped indices, selection, etc.) */
  state: Record<string, any>;
  senderId: string;
  timestamp: number;
}

export interface SlideCompletionPayload {
  slideIndex: number;
  slideId: string;
  /** Accuracy percentage 0-100 if applicable */
  accuracy?: number;
  /** Time spent on the slide in seconds */
  timeSpent?: number;
  senderId: string;
  senderName: string;
  timestamp: number;
}

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
type IframeLockListener = (payload: { isUnlocked: boolean; senderId: string }) => void;
type RewardListener = (payload: RewardPayload) => void;
type ToolActionListener = (payload: ToolActionPayload) => void;
type ChatListener = (payload: ChatBroadcastPayload) => void;
type WorksheetLoadListener = (payload: WorksheetLoadPayload) => void;
type GameStateListener = (payload: GameStatePayload) => void;

interface RoomChannel {
  channel: ReturnType<typeof supabase.channel>;
  ready: Promise<void>;
  currentStatus: string;
  statusListeners: Set<(status: string) => void>;
  strokeListeners: Set<StrokeListener>;
  scrollListeners: Set<ScrollListener>;
  stageModeListeners: Set<StageModeListener>;
  drawingEnabledListeners: Set<DrawingEnabledListener>;
  iframeLockListeners: Set<IframeLockListener>;
  rewardListeners: Set<RewardListener>;
  toolActionListeners: Set<ToolActionListener>;
  chatListeners: Set<ChatListener>;
  worksheetListeners: Set<WorksheetLoadListener>;
  gameStateListeners: Set<GameStateListener>;
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
    const iframeLockListeners = new Set<IframeLockListener>();
    const rewardListeners = new Set<RewardListener>();
    const toolActionListeners = new Set<ToolActionListener>();
    const chatListeners = new Set<ChatListener>();
    const worksheetListeners = new Set<WorksheetLoadListener>();
    const gameStateListeners = new Set<GameStateListener>();
    const statusListeners = new Set<(status: string) => void>();

    const channel = supabase
      .channel(channelName, { config: { broadcast: { self: false } } })
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
      .on('broadcast', { event: 'stage_change' }, (payload) => {
        stageModeListeners.forEach((cb) => cb(payload.payload as any));
      })
      .on('broadcast', { event: 'drawing_enabled' }, (payload) => {
        drawingEnabledListeners.forEach((cb) => cb(payload.payload as any));
      })
      .on('broadcast', { event: 'iframe_lock_state' }, (payload) => {
        iframeLockListeners.forEach((cb) => cb(payload.payload as any));
      })
      .on('broadcast', { event: 'reward' }, (payload) => {
        rewardListeners.forEach((cb) => cb(payload.payload as RewardPayload));
      })
      .on('broadcast', { event: 'give_star' }, (payload) => {
        rewardListeners.forEach((cb) => cb({
          rewardType: 'star',
          starCount: payload.payload?.starCount,
          isMilestone: payload.payload?.isMilestone,
          senderId: payload.payload?.senderId ?? 'unknown',
          timestamp: Date.now(),
        }));
      })
      .on('broadcast', { event: 'tool_action' }, (payload) => {
        toolActionListeners.forEach((cb) => cb(payload.payload as ToolActionPayload));
      })
      .on('broadcast', { event: 'chat_message' }, (payload) => {
        chatListeners.forEach((cb) => cb(payload.payload as ChatBroadcastPayload));
      })
      .on('broadcast', { event: 'worksheet_load' }, (payload) => {
        worksheetListeners.forEach((cb) => cb(payload.payload as WorksheetLoadPayload));
      })
      .on('broadcast', { event: 'game_state' }, (payload) => {
        gameStateListeners.forEach((cb) => cb(payload.payload as GameStatePayload));
      });

    const ready = new Promise<void>((resolve) => {
      channel.subscribe((status) => {
        room.currentStatus = status;
        statusListeners.forEach((cb) => cb(status));
        if (status === 'SUBSCRIBED') resolve();
      });
    });

    const room: RoomChannel = {
      channel,
      ready,
      currentStatus: 'CONNECTING',
      statusListeners,
      strokeListeners,
      scrollListeners,
      stageModeListeners,
      drawingEnabledListeners,
      iframeLockListeners,
      rewardListeners,
      toolActionListeners,
      chatListeners,
      worksheetListeners,
      gameStateListeners,
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

  /** Broadcast whether the student is allowed to interact directly with the embedded iframe. */
  async sendIframeLockState(roomId: string, isUnlocked: boolean, senderId: string): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'iframe_lock_state',
      payload: { isUnlocked, senderId },
    });
  }

  subscribeToIframeLockState(roomId: string, onChange: IframeLockListener): () => void {
    const room = this.getRoom(roomId);
    room.iframeLockListeners.add(onChange);
    room.refCount += 1;
    return () => this.release(roomId, () => room.iframeLockListeners.delete(onChange));
  }

  /** Broadcast a teacher reward (star or sticker) so the student animates instantly. */
  async sendReward(
    roomId: string,
    reward: Omit<RewardPayload, 'timestamp'>
  ): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'reward',
      payload: { ...reward, timestamp: Date.now() } satisfies RewardPayload,
    });
  }

  subscribeToRewards(roomId: string, onReward: RewardListener): () => void {
    const room = this.getRoom(roomId);
    room.rewardListeners.add(onReward);
    room.refCount += 1;
    return () => this.release(roomId, () => room.rewardListeners.delete(onReward));
  }

  /** Broadcast an interactive tool result (e.g. dice roll) — the result is computed
   *  by the sender so every receiver renders the SAME number. */
  async sendToolAction(
    roomId: string,
    action: Omit<ToolActionPayload, 'timestamp'>
  ): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'tool_action',
      payload: { ...action, timestamp: Date.now() } satisfies ToolActionPayload,
    });
  }

  subscribeToToolActions(roomId: string, onAction: ToolActionListener): () => void {
    const room = this.getRoom(roomId);
    room.toolActionListeners.add(onAction);
    room.refCount += 1;
    return () => this.release(roomId, () => room.toolActionListeners.delete(onAction));
  }

  /** Broadcast a chat message instantly (in addition to DB persistence). */
  async sendChatMessage(
    roomId: string,
    message: Omit<ChatBroadcastPayload, 'timestamp'>
  ): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: { ...message, timestamp: Date.now() } satisfies ChatBroadcastPayload,
    });
  }

  subscribeToChatMessages(roomId: string, onMessage: ChatListener): () => void {
    const room = this.getRoom(roomId);
    room.chatListeners.add(onMessage);
    room.refCount += 1;
    return () => this.release(roomId, () => room.chatListeners.delete(onMessage));
  }

  /** Broadcast a freshly-generated Smart Worksheet so the student loads the same data instantly. */
  async sendWorksheet(roomId: string, payload: Omit<WorksheetLoadPayload, 'timestamp'>): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'worksheet_load',
      payload: { ...payload, timestamp: Date.now() } satisfies WorksheetLoadPayload,
    });
  }

  subscribeToWorksheet(roomId: string, onLoad: WorksheetLoadListener): () => void {
    const room = this.getRoom(roomId);
    room.worksheetListeners.add(onLoad);
    room.refCount += 1;
    return () => this.release(roomId, () => room.worksheetListeners.delete(onLoad));
  }

  /** Broadcast incremental in-game state (e.g. flipped card, current sentence index). */
  async sendGameState(roomId: string, payload: Omit<GameStatePayload, 'timestamp'>): Promise<void> {
    const room = this.getRoom(roomId);
    await room.ready;
    await room.channel.send({
      type: 'broadcast',
      event: 'game_state',
      payload: { ...payload, timestamp: Date.now() } satisfies GameStatePayload,
    });
  }

  subscribeToGameState(roomId: string, onState: GameStateListener): () => void {
    const room = this.getRoom(roomId);
    room.gameStateListeners.add(onState);
    room.refCount += 1;
    return () => this.release(roomId, () => room.gameStateListeners.delete(onState));
  }

  subscribeToStatus(roomId: string, onStatus: (status: string) => void): () => void {
    const room = this.getRoom(roomId);
    room.statusListeners.add(onStatus);
    onStatus(room.currentStatus);
    room.refCount += 1;
    return () => this.release(roomId, () => room.statusListeners.delete(onStatus));
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
      room.drawingEnabledListeners.size === 0 &&
      room.iframeLockListeners.size === 0 &&
      room.rewardListeners.size === 0 &&
      room.toolActionListeners.size === 0 &&
      room.chatListeners.size === 0 &&
      room.worksheetListeners.size === 0 &&
      room.gameStateListeners.size === 0 &&
      room.statusListeners.size === 0
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
