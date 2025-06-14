
import { VideoService, VideoServiceCallbacks } from '../videoService';
import { EnhancedVideoConfig, ParticipantData } from './types';
import { JitsiApiLoader } from './jitsiApiLoader';
import { JitsiEventHandlers } from './jitsiEventHandlers';
import { JitsiConfigBuilder } from './jitsiConfig';

export class EnhancedVideoService extends VideoService {
  private api: any = null;
  private eventHandlers: JitsiEventHandlers;
  private connectionQuality = 'good';
  private initialized = false;

  constructor(config: EnhancedVideoConfig, callbacks: VideoServiceCallbacks = {}) {
    super(config, callbacks);
    this.eventHandlers = new JitsiEventHandlers(callbacks);
  }

  private get enhancedConfig(): EnhancedVideoConfig {
    return this.config as EnhancedVideoConfig;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('Enhanced video service already initialized');
      return;
    }

    console.log('Enhanced: Initializing video service...');
    try {
      await JitsiApiLoader.loadJitsiApi();
      this.initialized = true;
      console.log('Enhanced: Video service initialized successfully');
    } catch (error) {
      console.error('Enhanced: Failed to initialize video service:', error);
      this.callbacks.onError?.('Failed to initialize video service');
      throw error;
    }
  }

  async joinRoom(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Video service not initialized');
    }

    if (this.api) {
      console.log('Already connected to room');
      return;
    }

    try {
      console.log('Enhanced: Joining room with config:', this.enhancedConfig);
      const domain = this.enhancedConfig.domain || 'meet.jit.si';
      
      const container = JitsiApiLoader.createContainer();
      const options = JitsiConfigBuilder.buildOptions(this.enhancedConfig, container);

      console.log('Enhanced: Creating Jitsi API instance with options:', options);
      
      if (!window.JitsiMeetExternalAPI) {
        throw new Error('JitsiMeetExternalAPI not available');
      }

      this.api = new window.JitsiMeetExternalAPI(domain, options);
      
      console.log('Enhanced: Setting up event listeners...');
      this.eventHandlers.setupEventListeners(this.api);
      
      // Simulate connection after a short delay
      setTimeout(() => {
        console.log('Enhanced: Simulating connection success');
        this.callbacks.onConnectionStatusChanged?.(true);
      }, 1000);
      
    } catch (error) {
      console.error('Enhanced: Failed to join room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
      this.callbacks.onError?.(errorMessage);
      throw error;
    }
  }

  async startRecording(): Promise<boolean> {
    if (this.api && this.enhancedConfig.enableRecording) {
      try {
        console.log('Starting recording...');
        await this.api.executeCommand('startRecording', {
          mode: 'stream'
        });
        return true;
      } catch (error) {
        console.error('Enhanced: Failed to start recording:', error);
        return false;
      }
    }
    return false;
  }

  async stopRecording(): Promise<boolean> {
    if (this.api && this.eventHandlers.isRecordingActive()) {
      try {
        console.log('Stopping recording...');
        await this.api.executeCommand('stopRecording');
        return true;
      } catch (error) {
        console.error('Enhanced: Failed to stop recording:', error);
        return false;
      }
    }
    return false;
  }

  async startScreenShare(): Promise<boolean> {
    if (this.api && this.enhancedConfig.enableScreenShare) {
      try {
        console.log('Starting screen share...');
        await this.api.executeCommand('toggleShareScreen');
        return true;
      } catch (error) {
        console.error('Enhanced: Failed to start screen share:', error);
        return false;
      }
    }
    return false;
  }

  async raiseHand(): Promise<boolean> {
    if (this.api) {
      try {
        console.log('Raising hand...');
        await this.api.executeCommand('toggleRaiseHand');
        return true;
      } catch (error) {
        console.error('Enhanced: Failed to raise hand:', error);
        return false;
      }
    }
    return false;
  }

  getParticipants(): ParticipantData[] {
    return this.eventHandlers.getParticipants();
  }

  getConnectionQuality(): string {
    return this.connectionQuality;
  }

  isRecordingActive(): boolean {
    return this.eventHandlers.isRecordingActive();
  }

  async toggleMicrophone(): Promise<boolean> {
    if (this.api) {
      try {
        console.log('Toggling microphone...');
        await this.api.executeCommand('toggleAudio');
        return true;
      } catch (error) {
        console.error('Enhanced: Failed to toggle microphone:', error);
        return false;
      }
    }
    return false;
  }

  async toggleCamera(): Promise<boolean> {
    if (this.api) {
      try {
        console.log('Toggling camera...');
        await this.api.executeCommand('toggleVideo');
        return true;
      } catch (error) {
        console.error('Enhanced: Failed to toggle camera:', error);
        return false;
      }
    }
    return false;
  }

  getLocalStream(): MediaStream | null {
    return null; // Jitsi handles streams internally
  }

  getRemoteStreams(): Map<string, MediaStream> {
    return new Map(); // Jitsi handles streams internally
  }

  isConnected(): boolean {
    return this.api !== null;
  }

  async leaveRoom(): Promise<void> {
    console.log('Enhanced: Leaving room...');
    if (this.api) {
      this.api.dispose();
      this.api = null;
      JitsiApiLoader.removeContainer();
    }
    this.eventHandlers.clearParticipants();
    this.callbacks.onConnectionStatusChanged?.(false);
  }

  dispose(): void {
    this.leaveRoom();
    this.initialized = false;
  }
}

// Re-export types for convenience
export type { EnhancedVideoConfig, ParticipantData };
