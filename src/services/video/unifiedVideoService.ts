import { VideoService, VideoServiceConfig, VideoServiceCallbacks } from '../videoService';

export interface UnifiedVideoConfig extends VideoServiceConfig {
  enableRecording?: boolean;
  enableScreenShare?: boolean;
  maxParticipants?: number;
}

export interface ParticipantInfo {
  id: string;
  displayName: string;
  name: string;
  stream?: MediaStream;
  isMuted: boolean;
  isCameraOff: boolean;
  isVideoOff: boolean;
  isTeacher: boolean;
  role: 'teacher' | 'student';
  isHandRaised: boolean;
  joinTime: Date;
}

export class UnifiedVideoService extends VideoService {
  private localStream: MediaStream | null = null;
  private participants: Map<string, ParticipantInfo> = new Map();
  private connected = false;
  private isRecording = false;
  private connectionQuality = 'good';
  private enhancedConfig: UnifiedVideoConfig;

  constructor(config: UnifiedVideoConfig, callbacks: VideoServiceCallbacks = {}) {
    super(config, callbacks);
    this.enhancedConfig = config;
  }

  async initialize(): Promise<void> {
    try {
      console.log('🎥 Unified: Initializing video service...');
      
      // Get user media with optimized settings
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('✅ Unified: Local media obtained successfully');
      this.callbacks.onLocalStreamChanged?.(this.localStream);
      
    } catch (error) {
      console.error('❌ Unified: Failed to get media:', error);
      
      // Try audio-only fallback
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        console.log('⚠️ Unified: Audio-only mode activated');
        this.callbacks.onLocalStreamChanged?.(this.localStream);
      } catch (audioError) {
        console.error('❌ Unified: Even audio failed:', audioError);
        this.callbacks.onError?.('Failed to access camera and microphone');
        throw audioError;
      }
    }
  }

  async joinRoom(): Promise<void> {
    try {
      console.log('🚪 Unified: Joining room:', this.config.roomName);
      
      // Simulate connection process with realistic timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.connected = true;
      this.callbacks.onConnectionStatusChanged?.(true);
      
      // Add current user as participant
      this.participants.set('local', {
        id: 'local',
        displayName: this.config.displayName,
        name: this.config.displayName,
        stream: this.localStream || undefined,
        isMuted: false,
        isCameraOff: !this.localStream?.getVideoTracks().length,
        isVideoOff: !this.localStream?.getVideoTracks().length,
        isTeacher: this.config.displayName?.includes('teacher') || false,
        role: this.config.displayName?.includes('teacher') ? 'teacher' : 'student',
        isHandRaised: false,
        joinTime: new Date()
      });
      
      console.log('✅ Unified: Successfully joined room');
      
    } catch (error) {
      console.error('❌ Unified: Failed to join room:', error);
      this.callbacks.onError?.('Failed to join classroom');
      throw error;
    }
  }

  async leaveRoom(): Promise<void> {
    console.log('🚪 Unified: Leaving room...');
    
    this.connected = false;
    this.participants.clear();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Unified: Stopped ${track.kind} track`);
      });
      this.localStream = null;
    }
    
    this.callbacks.onConnectionStatusChanged?.(false);
    console.log('✅ Unified: Left room successfully');
  }

  async toggleMicrophone(): Promise<boolean> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const isMuted = !audioTrack.enabled;
        
        // Update participant info
        const localParticipant = this.participants.get('local');
        if (localParticipant) {
          localParticipant.isMuted = isMuted;
        }
        
        console.log(`🎤 Unified: Microphone ${isMuted ? 'muted' : 'unmuted'}`);
        return isMuted;
      }
    }
    return false;
  }

  async toggleCamera(): Promise<boolean> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const isCameraOff = !videoTrack.enabled;
        
        // Update participant info
        const localParticipant = this.participants.get('local');
        if (localParticipant) {
          localParticipant.isCameraOff = isCameraOff;
          localParticipant.isVideoOff = isCameraOff;
        }
        
        console.log(`📹 Unified: Camera ${isCameraOff ? 'off' : 'on'}`);
        return isCameraOff;
      }
    }
    return false;
  }

  async startRecording(): Promise<boolean> {
    if (!this.enhancedConfig.enableRecording) {
      console.warn('🎬 Unified: Recording not enabled');
      return false;
    }
    
    console.log('🎬 Unified: Starting recording...');
    this.isRecording = true;
    return true;
  }

  async stopRecording(): Promise<boolean> {
    console.log('🎬 Unified: Stopping recording...');
    this.isRecording = false;
    return true;
  }

  async startScreenShare(): Promise<boolean> {
    if (!this.enhancedConfig.enableScreenShare) {
      console.warn('🖥️ Unified: Screen sharing not enabled');
      return false;
    }
    
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      console.log('🖥️ Unified: Screen sharing started');
      // In a real implementation, this would replace the video track
      return true;
    } catch (error) {
      console.error('🖥️ Unified: Failed to start screen share:', error);
      return false;
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStreams(): Map<string, MediaStream> {
    const remoteStreams = new Map<string, MediaStream>();
    this.participants.forEach((participant, id) => {
      if (id !== 'local' && participant.stream) {
        remoteStreams.set(id, participant.stream);
      }
    });
    return remoteStreams;
  }

  getParticipants(): ParticipantInfo[] {
    return Array.from(this.participants.values());
  }

  getConnectionQuality(): string {
    return this.connectionQuality;
  }

  isRecordingActive(): boolean {
    return this.isRecording;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async raiseHand(): Promise<boolean> {
    console.log('✋ Unified: Hand raised');
    return true;
  }

  dispose(): void {
    this.leaveRoom();
  }

  // Additional utility methods
  getLocalParticipant(): ParticipantInfo | undefined {
    return this.participants.get('local');
  }

  updateConnectionQuality(quality: 'excellent' | 'good' | 'fair' | 'poor'): void {
    this.connectionQuality = quality;
  }
}