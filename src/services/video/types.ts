
export interface EnhancedVideoConfig {
  roomName: string;
  displayName: string;
  enableRecording?: boolean;
  enableScreenShare?: boolean;
  maxParticipants?: number;
  domain?: string;
}

export interface ParticipantData {
  id: string;
  displayName: string;
  role: 'teacher' | 'student';
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised?: boolean;
  connectionQuality?: string;
}

export interface VideoCallbacks {
  onConnectionStatusChanged?: (connected: boolean) => void;
  onParticipantJoined?: (id: string, name: string) => void;
  onParticipantLeft?: (id: string) => void;
  onError?: (error: string) => void;
  onLocalStreamChanged?: (stream: MediaStream | null) => void;
}
