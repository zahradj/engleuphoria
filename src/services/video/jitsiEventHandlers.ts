
import { ParticipantData } from './types';
import { VideoServiceCallbacks } from '../videoService';

export class JitsiEventHandlers {
  private participants: Map<string, ParticipantData> = new Map();
  private callbacks: VideoServiceCallbacks;
  private isRecording = false;
  private isScreenSharing = false;

  constructor(callbacks: VideoServiceCallbacks) {
    this.callbacks = callbacks;
  }

  setupEventListeners(api: any): void {
    if (!api) return;

    api.addEventListener('participantJoined', (event: any) => {
      console.log('Enhanced: Participant joined:', event);
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

    api.addEventListener('participantLeft', (event: any) => {
      console.log('Enhanced: Participant left:', event);
      this.participants.delete(event.id);
      this.callbacks.onParticipantLeft?.(event.id);
    });

    api.addEventListener('audioMuteStatusChanged', (event: any) => {
      const participant = this.participants.get(event.id);
      if (participant) {
        participant.isMuted = event.muted;
        this.participants.set(event.id, participant);
      }
    });

    api.addEventListener('videoMuteStatusChanged', (event: any) => {
      const participant = this.participants.get(event.id);
      if (participant) {
        participant.isVideoOff = event.muted;
        this.participants.set(event.id, participant);
      }
    });

    api.addEventListener('raiseHandUpdated', (event: any) => {
      const participant = this.participants.get(event.id);
      if (participant) {
        participant.isHandRaised = event.handRaised;
        this.participants.set(event.id, participant);
      }
    });

    api.addEventListener('recordingStatusChanged', (event: any) => {
      this.isRecording = event.on;
    });

    api.addEventListener('screenSharingStatusChanged', (event: any) => {
      this.isScreenSharing = event.on;
    });

    api.addEventListener('videoConferenceJoined', () => {
      console.log('Enhanced: Video conference joined successfully');
      this.callbacks.onConnectionStatusChanged?.(true);
    });
  }

  getParticipants(): ParticipantData[] {
    return Array.from(this.participants.values());
  }

  isRecordingActive(): boolean {
    return this.isRecording;
  }

  clearParticipants(): void {
    this.participants.clear();
  }
}
