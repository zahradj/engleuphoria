import { WebRTCVideoService } from './webrtcVideoService';

export interface VideoParticipant {
  id: string;
  name: string;
  stream: MediaStream;
  isSpeaking: boolean;
  audioLevel: number;
}

class RealTimeVideoService {
  private webrtcService: WebRTCVideoService;
  private participants = new Map<string, VideoParticipant>();
  private onParticipantsChangeCallback: ((participants: VideoParticipant[]) => void) | null = null;

  constructor() {
    this.webrtcService = new WebRTCVideoService();
    
    this.webrtcService.setOnParticipantsUpdate((remoteStreams) => {
      this.updateParticipantsFromStreams(remoteStreams);
    });
  }

  private updateParticipantsFromStreams(remoteStreams: Map<string, MediaStream>) {
    const newParticipants = new Map<string, VideoParticipant>();

    remoteStreams.forEach((stream, userId) => {
      const existingParticipant = this.participants.get(userId);
      newParticipants.set(userId, {
        id: userId,
        name: existingParticipant?.name || `User ${userId.substring(0, 8)}`,
        stream,
        isSpeaking: existingParticipant?.isSpeaking || false,
        audioLevel: existingParticipant?.audioLevel || 0
      });
    });

    this.participants = newParticipants;
    this.notifyParticipantsChange();
  }

  async joinVideoRoom(roomId: string, userId: string, localStream: MediaStream): Promise<void> {
    console.log(`🎥 Joining video room ${roomId} as ${userId}`);
    await this.webrtcService.joinRoom(roomId, userId, localStream);
  }

  leaveVideoRoom(): void {
    console.log(`🚪 Leaving video room`);
    this.webrtcService.leaveRoom();
    this.participants.clear();
    this.notifyParticipantsChange();
  }

  getParticipants(): VideoParticipant[] {
    return Array.from(this.participants.values());
  }

  onParticipantsChange(callback: (participants: VideoParticipant[]) => void): void {
    this.onParticipantsChangeCallback = callback;
  }

  private notifyParticipantsChange(): void {
    if (this.onParticipantsChangeCallback) {
      this.onParticipantsChangeCallback(this.getParticipants());
    }
  }

  updateParticipantName(userId: string, name: string): void {
    const participant = this.participants.get(userId);
    if (participant) {
      participant.name = name;
      this.notifyParticipantsChange();
    }
  }

  updateSpeakingStatus(userId: string, isSpeaking: boolean, audioLevel: number = 0): void {
    const participant = this.participants.get(userId);
    if (participant) {
      participant.isSpeaking = isSpeaking;
      participant.audioLevel = audioLevel;
      this.notifyParticipantsChange();
    }
  }
}

export const realTimeVideoService = new RealTimeVideoService();
