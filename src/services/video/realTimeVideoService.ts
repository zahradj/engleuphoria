import { VideoService, VideoServiceCallbacks } from '../videoService';
import { EnhancedVideoConfig, ParticipantData } from './types';

export class RealTimeVideoService extends VideoService {
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private websocket: WebSocket | null = null;
  private participants: Map<string, ParticipantData> = new Map();
  private connected = false;
  private isRecording = false;
  private connectionQuality = 'good';

  // Fix: Make api property private to match EnhancedVideoService
  private api: any = null;
  public eventHandlers: any = {};
  public initialized: boolean = false;
  public localMediaStream: MediaStream | null = null;
  public enhancedConfig: EnhancedVideoConfig;

  constructor(config: EnhancedVideoConfig, callbacks: VideoServiceCallbacks = {}) {
    super(config, callbacks);
    this.enhancedConfig = config;
  }

  async initialize(): Promise<void> {
    try {
      console.log('🎥 RealTime: Initializing video service...');
      
      // Get user media first
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      this.localMediaStream = this.localStream;
      this.initialized = true;
      
      console.log('🎥 RealTime: Local media obtained');
      this.callbacks.onLocalStreamChanged?.(this.localStream);
      
    } catch (error) {
      console.error('🎥 RealTime: Failed to get media:', error);
      this.callbacks.onError?.('Failed to access camera/microphone');
      throw error;
    }
  }

  async joinRoom(): Promise<void> {
    try {
      console.log('🎥 RealTime: Joining room...');
      
      // Create a simulated participant (remote user) for demonstration
      const remoteParticipant: ParticipantData = {
        id: this.enhancedConfig.displayName === 'Teacher' ? 'student-demo' : 'teacher-demo',
        displayName: this.enhancedConfig.displayName === 'Teacher' ? 'Student Demo' : 'Teacher Demo',
        role: this.enhancedConfig.displayName === 'Teacher' ? 'student' : 'teacher',
        isMuted: false,
        isVideoOff: false,
        isHandRaised: false,
        joinTime: new Date()
      };
      
      // Add the remote participant
      this.participants.set(remoteParticipant.id, remoteParticipant);
      
      // Simulate successful connection with slight delay for realism
      setTimeout(() => {
        this.connected = true;
        this.callbacks.onConnectionStatusChanged?.(true);
        this.callbacks.onParticipantJoined?.(remoteParticipant.id, remoteParticipant.displayName);
        console.log('🎥 RealTime: Successfully connected to room with participants:', 
          Array.from(this.participants.keys()));
      }, 1500);
      
    } catch (error) {
      console.error('🎥 RealTime: Failed to join room:', error);
      this.callbacks.onError?.('Failed to join room');
      throw error;
    }
  }

  async leaveRoom(): Promise<void> {
    console.log('🎥 RealTime: Leaving room...');
    
    this.connected = false;
    this.participants.clear();
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.callbacks.onConnectionStatusChanged?.(false);
  }

  async toggleMicrophone(): Promise<boolean> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        console.log('🎤 RealTime: Microphone toggled:', audioTrack.enabled ? 'unmuted' : 'muted');
        return !audioTrack.enabled;
      }
    }
    return false;
  }

  async toggleCamera(): Promise<boolean> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        console.log('📹 RealTime: Camera toggled:', videoTrack.enabled ? 'on' : 'off');
        return !videoTrack.enabled;
      }
    }
    return false;
  }

  async startRecording(): Promise<boolean> {
    console.log('🎬 RealTime: Starting recording...');
    this.isRecording = true;
    return true;
  }

  async stopRecording(): Promise<boolean> {
    console.log('🎬 RealTime: Stopping recording...');
    this.isRecording = false;
    return true;
  }

  async raiseHand(): Promise<boolean> {
    console.log('✋ RealTime: Hand raised');
    return true;
  }

  async startScreenShare(): Promise<boolean> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      console.log('🖥️ RealTime: Screen sharing started');
      return true;
    } catch (error) {
      console.error('🖥️ RealTime: Failed to start screen share:', error);
      return false;
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStreams(): Map<string, MediaStream> {
    return new Map(); // In real implementation, this would return remote participant streams
  }

  getParticipants(): ParticipantData[] {
    return Array.from(this.participants.values());
  }

  getConnectionQuality(): string {
    return this.connectionQuality;
  }

  isRecordingActive(): boolean {
    return this.isRecording;
  }

  // This method is required by the base VideoService class
  isConnected(): boolean {
    return this.connected;
  }

  dispose(): void {
    this.leaveRoom();
    this.initialized = false;
    this.localMediaStream = null;
  }
}
