
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
  private connectionAttempts = 0;
  private maxConnectionAttempts = 3;

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
    if (this.initialized) {
      console.log('🎥 RealTime: Already initialized');
      return;
    }

    try {
      console.log('🎥 RealTime: Initializing video service...');
      
      // Get user media first
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });
        console.log('🎥 RealTime: Video and audio obtained');
      } catch (error) {
        // Fallback to audio only
        console.warn('🎥 RealTime: Video failed, trying audio only:', error);
        try {
          this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: true
          });
          console.log('🎥 RealTime: Audio only obtained');
        } catch (audioError) {
          console.error('🎥 RealTime: No media access:', audioError);
          throw new Error('Camera and microphone access required');
        }
      }
      
      this.localMediaStream = this.localStream;
      this.initialized = true;
      
      console.log('🎥 RealTime: Local media obtained');
      this.callbacks.onLocalStreamChanged?.(this.localStream);
      
    } catch (error) {
      console.error('🎥 RealTime: Failed to get media:', error);
      this.callbacks.onError?.('Failed to access camera/microphone. Please allow permissions and try again.');
      throw error;
    }
  }

  async joinRoom(): Promise<void> {
    if (this.connected) {
      console.log('🎥 RealTime: Already connected');
      return;
    }

    if (!this.initialized) {
      await this.initialize();
    }

    try {
      console.log('🎥 RealTime: Joining room...');
      this.connectionAttempts++;
      
      // Simulate WebSocket connection for signaling
      const wsUrl = `wss://demo-signaling.lovable.app/room/${this.config.roomName}`;
      console.log('🎥 RealTime: Connecting to signaling server...');
      
      // For demo purposes, simulate successful connection
      setTimeout(() => {
        this.connected = true;
        this.connectionAttempts = 0;
        this.callbacks.onConnectionStatusChanged?.(true);
        console.log('🎥 RealTime: Successfully connected to room');
        
        // Simulate a participant joining after connection
        if (this.config.displayName.toLowerCase().includes('teacher')) {
          // Add a mock student
          setTimeout(() => {
            this.addMockParticipant('student-mock', 'Mock Student', 'student');
          }, 2000);
        } else {
          // Add a mock teacher
          setTimeout(() => {
            this.addMockParticipant('teacher-mock', 'Mock Teacher', 'teacher');
          }, 2000);
        }
      }, 1500);
      
    } catch (error) {
      console.error('🎥 RealTime: Failed to join room:', error);
      if (this.connectionAttempts < this.maxConnectionAttempts) {
        console.log(`🎥 RealTime: Retrying connection (${this.connectionAttempts}/${this.maxConnectionAttempts})`);
        setTimeout(() => this.joinRoom(), 2000);
      } else {
        this.callbacks.onError?.('Failed to join room after multiple attempts');
        throw error;
      }
    }
  }

  private addMockParticipant(id: string, name: string, role: 'teacher' | 'student') {
    const participant: ParticipantData = {
      id,
      displayName: name,
      role,
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      connectionQuality: 'good'
    };
    
    this.participants.set(id, participant);
    this.callbacks.onParticipantJoined?.(id, name);
    console.log('🎥 RealTime: Mock participant added:', name);
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
      this.localMediaStream = null;
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
    if (!this.connected) return false;
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
    if (!this.connected) return false;
    console.log('✋ RealTime: Hand raised');
    return true;
  }

  async startScreenShare(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      console.log('🖥️ RealTime: Screen sharing started');
      
      // In a real implementation, you'd replace the video track
      screenStream.getVideoTracks()[0].onended = () => {
        console.log('🖥️ RealTime: Screen sharing stopped');
      };
      
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
