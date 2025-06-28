export interface ScreenShareState {
  isScreenSharing: boolean;
  screenStream: MediaStream | null;
  participantScreenShares: Map<string, MediaStream>;
}

export interface RecordingState {
  isRecording: boolean;
  recordingStartTime: Date | null;
  recordingDuration: number;
  recordingUrl: string | null;
}

export interface VideoQualitySettings {
  resolution: 'low' | 'medium' | 'high' | 'hd';
  frameRate: number;
  bitrate: number;
}

export interface AdvancedVideoControls {
  // Screen sharing
  startScreenShare(): Promise<boolean>;
  stopScreenShare(): Promise<boolean>;
  
  // Recording
  startRecording(): Promise<boolean>;
  stopRecording(): Promise<string | null>;
  
  // Video quality
  setVideoQuality(quality: VideoQualitySettings): Promise<void>;
  
  // Participant management
  spotlightParticipant(participantId: string): Promise<void>;
  pinParticipant(participantId: string): Promise<void>;
  
  // Audio/Video controls
  muteParticipant(participantId: string): Promise<void>;
  removeParticipant(participantId: string): Promise<void>;
}

export class AdvancedVideoFeatureManager {
  private screenShareState: ScreenShareState = {
    isScreenSharing: false,
    screenStream: null,
    participantScreenShares: new Map()
  };

  private recordingState: RecordingState = {
    isRecording: false,
    recordingStartTime: null,
    recordingDuration: 0,
    recordingUrl: null
  };

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  async startScreenShare(): Promise<boolean> {
    try {
      console.log('🖥️ Starting screen share...');
      
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor'
        } as DisplayMediaStreamOptions['video'],
        audio: true
      });

      this.screenShareState.isScreenSharing = true;
      this.screenShareState.screenStream = screenStream;

      // Listen for screen share end
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        this.stopScreenShare();
      });

      console.log('🖥️ Screen share started successfully');
      return true;
    } catch (error) {
      console.error('🖥️ Failed to start screen share:', error);
      return false;
    }
  }

  async stopScreenShare(): Promise<boolean> {
    try {
      if (this.screenShareState.screenStream) {
        this.screenShareState.screenStream.getTracks().forEach(track => track.stop());
      }
      
      this.screenShareState.isScreenSharing = false;
      this.screenShareState.screenStream = null;
      
      console.log('🖥️ Screen share stopped');
      return true;
    } catch (error) {
      console.error('🖥️ Failed to stop screen share:', error);
      return false;
    }
  }

  async startRecording(stream: MediaStream): Promise<boolean> {
    try {
      console.log('🎥 Starting recording...');
      
      if (!MediaRecorder.isTypeSupported('video/webm')) {
        throw new Error('WebM recording not supported');
      }

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.recordingState.recordingUrl = URL.createObjectURL(blob);
      };

      this.mediaRecorder.start(1000); // Collect data every second
      
      this.recordingState.isRecording = true;
      this.recordingState.recordingStartTime = new Date();
      
      console.log('🎥 Recording started successfully');
      return true;
    } catch (error) {
      console.error('🎥 Failed to start recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (this.mediaRecorder && this.recordingState.isRecording) {
        this.mediaRecorder.stop();
        this.recordingState.isRecording = false;
        
        // Wait a bit for the recording to finalize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('🎥 Recording stopped, URL:', this.recordingState.recordingUrl);
        return this.recordingState.recordingUrl;
      }
      return null;
    } catch (error) {
      console.error('🎥 Failed to stop recording:', error);
      return null;
    }
  }

  getScreenShareState(): ScreenShareState {
    return { ...this.screenShareState };
  }

  getRecordingState(): RecordingState {
    return { ...this.recordingState };
  }

  updateRecordingDuration() {
    if (this.recordingState.isRecording && this.recordingState.recordingStartTime) {
      this.recordingState.recordingDuration = 
        Date.now() - this.recordingState.recordingStartTime.getTime();
    }
  }
}
