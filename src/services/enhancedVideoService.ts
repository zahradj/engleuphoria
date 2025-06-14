
import { VideoService, VideoServiceConfig, VideoServiceCallbacks } from './videoService';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export interface EnhancedVideoConfig extends VideoServiceConfig {
  enableRecording?: boolean;
  enableScreenShare?: boolean;
  maxParticipants?: number;
  moderatorPassword?: string;
}

export interface ParticipantData {
  id: string;
  displayName: string;
  role: 'teacher' | 'student';
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  joinTime: Date;
}

export class EnhancedVideoService extends VideoService {
  private api: any = null;
  private participants: Map<string, ParticipantData> = new Map();
  private isRecording = false;
  private isScreenSharing = false;
  private connectionQuality = 'good';

  constructor(config: EnhancedVideoConfig, callbacks: VideoServiceCallbacks = {}) {
    super(config, callbacks);
  }

  private get enhancedConfig(): EnhancedVideoConfig {
    return this.config as EnhancedVideoConfig;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  async joinRoom(): Promise<void> {
    try {
      const domain = this.config.domain || 'meet.jit.si';
      
      // Create a container div for Jitsi
      let container = document.getElementById('jitsi-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'jitsi-container';
        container.style.display = 'none'; // Hide the actual Jitsi interface
        document.body.appendChild(container);
      }

      const options = {
        roomName: this.config.roomName,
        width: '100%',
        height: '100%',
        parentNode: container,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          enableUserRolesBasedOnToken: true,
          maxParticipants: this.enhancedConfig.maxParticipants || 10,
          recording: {
            enabled: this.enhancedConfig.enableRecording || false
          }
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'recording', 'livestreaming',
            'etherpad', 'sharedvideo', 'settings', 'raisehand', 'videoquality',
            'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ],
          SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar']
        },
        userInfo: {
          displayName: this.config.displayName
        }
      };

      this.api = new window.JitsiMeetExternalAPI(domain, options);
      this.setupEventListeners();
      
      // Simulate connection after a short delay
      setTimeout(() => {
        this.callbacks.onConnectionStatusChanged?.(true);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to join room:', error);
      this.callbacks.onError?.('Failed to join room');
      throw error;
    }
  }

  private setupEventListeners() {
    if (!this.api) return;

    this.api.addEventListener('participantJoined', (event: any) => {
      console.log('Participant joined:', event);
      const participant: ParticipantData = {
        id: event.id,
        displayName: event.displayName || 'Unknown',
        role: event.role || 'student',
        isMuted: false,
        isVideoOff: false,
        isHandRaised: false,
        joinTime: new Date()
      };
      
      this.participants.set(event.id, participant);
      this.callbacks.onParticipantJoined?.(event.id, event.displayName);
    });

    this.api.addEventListener('participantLeft', (event: any) => {
      console.log('Participant left:', event);
      this.participants.delete(event.id);
      this.callbacks.onParticipantLeft?.(event.id);
    });

    this.api.addEventListener('audioMuteStatusChanged', (event: any) => {
      const participant = this.participants.get(event.id);
      if (participant) {
        participant.isMuted = event.muted;
        this.participants.set(event.id, participant);
      }
    });

    this.api.addEventListener('videoMuteStatusChanged', (event: any) => {
      const participant = this.participants.get(event.id);
      if (participant) {
        participant.isVideoOff = event.muted;
        this.participants.set(event.id, participant);
      }
    });

    this.api.addEventListener('raiseHandUpdated', (event: any) => {
      const participant = this.participants.get(event.id);
      if (participant) {
        participant.isHandRaised = event.handRaised;
        this.participants.set(event.id, participant);
      }
    });

    this.api.addEventListener('recordingStatusChanged', (event: any) => {
      this.isRecording = event.on;
    });

    this.api.addEventListener('screenSharingStatusChanged', (event: any) => {
      this.isScreenSharing = event.on;
    });

    // Add ready event listener
    this.api.addEventListener('videoConferenceJoined', () => {
      console.log('Video conference joined successfully');
      this.callbacks.onConnectionStatusChanged?.(true);
    });
  }

  async startRecording(): Promise<boolean> {
    if (this.api && this.enhancedConfig.enableRecording) {
      try {
        await this.api.executeCommand('startRecording', {
          mode: 'stream'
        });
        return true;
      } catch (error) {
        console.error('Failed to start recording:', error);
        return false;
      }
    }
    return false;
  }

  async stopRecording(): Promise<boolean> {
    if (this.api && this.isRecording) {
      try {
        await this.api.executeCommand('stopRecording');
        return true;
      } catch (error) {
        console.error('Failed to stop recording:', error);
        return false;
      }
    }
    return false;
  }

  async startScreenShare(): Promise<boolean> {
    if (this.api && this.enhancedConfig.enableScreenShare) {
      try {
        await this.api.executeCommand('toggleShareScreen');
        return true;
      } catch (error) {
        console.error('Failed to start screen share:', error);
        return false;
      }
    }
    return false;
  }

  async raiseHand(): Promise<boolean> {
    if (this.api) {
      try {
        await this.api.executeCommand('toggleRaiseHand');
        return true;
      } catch (error) {
        console.error('Failed to raise hand:', error);
        return false;
      }
    }
    return false;
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

  async toggleMicrophone(): Promise<boolean> {
    if (this.api) {
      try {
        await this.api.executeCommand('toggleAudio');
        return true;
      } catch (error) {
        console.error('Failed to toggle microphone:', error);
        return false;
      }
    }
    return false;
  }

  async toggleCamera(): Promise<boolean> {
    if (this.api) {
      try {
        await this.api.executeCommand('toggleVideo');
        return true;
      } catch (error) {
        console.error('Failed to toggle camera:', error);
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
    if (this.api) {
      this.api.dispose();
      this.api = null;
      
      // Clean up container
      const container = document.getElementById('jitsi-container');
      if (container) {
        container.remove();
      }
    }
    this.participants.clear();
    this.callbacks.onConnectionStatusChanged?.(false);
  }

  dispose(): void {
    this.leaveRoom();
  }
}
