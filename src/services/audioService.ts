// Audio Service for Reward Sounds and Voice Effects

class AudioService {
  private context: AudioContext | null = null;
  private celebrationSounds: { [key: string]: HTMLAudioElement } = {};
  private elevenLabsApiKey: string | null = null;
  private clapBuffer: AudioBuffer | null = null;
  private isMuted: boolean = false;

  constructor() {
    this.initializeAudioContext();
    this.preloadSounds();
    // Load API key from localStorage if available
    this.elevenLabsApiKey = localStorage.getItem('elevenlabs_api_key');
  }

  private initializeAudioContext() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported', error);
    }
  }

  private preloadSounds() {
    // Create clapping sound programmatically
    this.generateClappingSound();
  }

  private generateClappingSound() {
    if (!this.context) return;

    // Create a realistic clapping sound using multiple noise bursts
    const createClap = () => {
      const bufferSize = this.context!.sampleRate * 0.1; // 100ms
      const buffer = this.context!.createBuffer(2, bufferSize, this.context!.sampleRate);
      
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < bufferSize; i++) {
          // Create envelope for realistic clap sound
          const envelope = Math.exp(-i / (bufferSize * 0.1)) * Math.exp(-Math.pow(i - bufferSize * 0.02, 2) / (2 * Math.pow(bufferSize * 0.01, 2)));
          channelData[i] = (Math.random() * 2 - 1) * envelope * 0.3;
        }
      }
      return buffer;
    };

    // Store clap sound buffer for later use
    this.clapBuffer = createClap();
  }

  // Generate cheerful chime sound for low points
  private generateChimeSound(): AudioBuffer | null {
    if (!this.context) return null;

    const bufferSize = this.context.sampleRate * 0.5; // 500ms
    const buffer = this.context.createBuffer(2, bufferSize, this.context.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.context.sampleRate;
        // Create a pleasant chime with harmonics
        let sample = 0;
        sample += Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-t * 3); // C5
        sample += Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-t * 3) * 0.7; // E5
        sample += Math.sin(2 * Math.PI * 783.99 * t) * Math.exp(-t * 3) * 0.5; // G5
        channelData[i] = sample * 0.3;
      }
    }
    return buffer;
  }

  // Generate success fanfare for medium points
  private generateFanfareSound(): AudioBuffer | null {
    if (!this.context) return null;

    const bufferSize = this.context.sampleRate * 1.0; // 1 second
    const buffer = this.context.createBuffer(2, bufferSize, this.context.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.context.sampleRate;
        // Create triumphant fanfare
        let sample = 0;
        if (t < 0.3) {
          sample += Math.sin(2 * Math.PI * 261.63 * t) * Math.exp(-t * 2); // C4
          sample += Math.sin(2 * Math.PI * 329.63 * t) * Math.exp(-t * 2) * 0.8; // E4
        } else if (t < 0.6) {
          sample += Math.sin(2 * Math.PI * 329.63 * t) * Math.exp(-(t-0.3) * 2); // E4
          sample += Math.sin(2 * Math.PI * 392.00 * t) * Math.exp(-(t-0.3) * 2) * 0.8; // G4
        } else {
          sample += Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-(t-0.6) * 2); // C5
          sample += Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-(t-0.6) * 2) * 0.8; // E5
        }
        channelData[i] = sample * 0.4;
      }
    }
    return buffer;
  }

  // Generate epic victory sound for high points
  private generateVictorySound(): AudioBuffer | null {
    if (!this.context) return null;

    const bufferSize = this.context.sampleRate * 1.5; // 1.5 seconds
    const buffer = this.context.createBuffer(2, bufferSize, this.context.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.context.sampleRate;
        // Create epic victory sound with ascending notes
        let sample = 0;
        const envelope = Math.exp(-t * 1.5);
        
        // Multiple harmonious tones
        sample += Math.sin(2 * Math.PI * 261.63 * t) * envelope; // C4
        sample += Math.sin(2 * Math.PI * 329.63 * t) * envelope * 0.8; // E4
        sample += Math.sin(2 * Math.PI * 392.00 * t) * envelope * 0.6; // G4
        sample += Math.sin(2 * Math.PI * 523.25 * t) * envelope * 0.4; // C5
        
        // Add sparkle effect
        if (Math.random() < 0.1) {
          sample += Math.sin(2 * Math.PI * 1046.50 * t) * envelope * 0.3; // C6
        }
        
        channelData[i] = sample * 0.3;
      }
    }
    return buffer;
  }

  private playCustomSound(buffer: AudioBuffer | null, volume: number = 0.5) {
    if (!this.context || !buffer || this.isMuted) return;

    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    gainNode.gain.value = volume;
    
    source.start();
  }

  private playClappingSound(intensity: number = 1) {
    if (!this.context || !this.clapBuffer || this.isMuted) return;

    const numClaps = Math.min(Math.max(Math.floor(intensity / 10), 1), 5);
    
    for (let i = 0; i < numClaps; i++) {
      setTimeout(() => {
        if (!this.context || !this.clapBuffer) return;

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        
        source.buffer = this.clapBuffer;
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        // Vary the volume and pitch slightly for each clap
        gainNode.gain.value = 0.4 + Math.random() * 0.3;
        source.playbackRate.value = 0.9 + Math.random() * 0.2;
        
        source.start();
      }, i * 150); // Stagger claps by 150ms
    }
  }

  // Set ElevenLabs API key
  setElevenLabsApiKey(apiKey: string) {
    this.elevenLabsApiKey = apiKey;
    localStorage.setItem('elevenlabs_api_key', apiKey);
  }

  // Get ElevenLabs API key from storage
  private getElevenLabsApiKey(): string | null {
    if (this.elevenLabsApiKey) return this.elevenLabsApiKey;
    return localStorage.getItem('elevenlabs_api_key');
  }

  // Generate exciting voice messages using ElevenLabs
  async generateVoiceMessage(text: string, points: number): Promise<void> {
    const apiKey = this.getElevenLabsApiKey();
    if (!apiKey) {
      console.log('ElevenLabs API key not set, skipping voice message');
      return;
    }

    try {
      // Use enthusiastic voice for rewards - using voice ID instead of name
      const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria voice ID
      const model = 'eleven_turbo_v2_5'; // Fast, multilingual model

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: model,
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.8,
            style: 0.8,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Play with slight delay after clapping
        setTimeout(() => {
          audio.play().catch(error => {
            console.warn('Could not play voice message:', error);
          });
        }, 500);
      }
    } catch (error) {
      console.warn('Error generating voice message:', error);
    }
  }

  // Main reward sound function with enhanced sound effects
  async playRewardSound(points: number) {
    if (this.isMuted) return;

    // Play different sound effects based on points
    if (points >= 50) {
      // Epic victory sound + intense clapping
      this.playCustomSound(this.generateVictorySound(), 0.6);
      setTimeout(() => this.playClappingSound(points), 200);
    } else if (points >= 25) {
      // Fanfare sound + moderate clapping
      this.playCustomSound(this.generateFanfareSound(), 0.5);
      setTimeout(() => this.playClappingSound(points), 300);
    } else if (points >= 10) {
      // Cheerful chime + light clapping
      this.playCustomSound(this.generateChimeSound(), 0.4);
      setTimeout(() => this.playClappingSound(points), 200);
    } else {
      // Simple clapping for small rewards
      this.playClappingSound(points);
    }
    
    // Generate appropriate voice message based on points
    let message = '';
    if (points >= 50) {
      const messages = [
        'Outstanding work! You\'re absolutely brilliant!',
        'Incredible! You\'re on fire today!',
        'Phenomenal achievement! Keep it up!',
        'Wow! That was amazing work!'
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (points >= 25) {
      const messages = [
        'Excellent work! Well done!',
        'Great job! You\'re doing fantastic!',
        'Wonderful! Keep up the great work!',
        'Superb effort! I\'m impressed!'
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (points >= 10) {
      const messages = [
        'Good work! Nice job!',
        'Well done! Keep it up!',
        'Great effort! You\'re improving!',
        'Nice! That\'s the way to do it!'
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        'Good job! Every step counts!',
        'Nice work! Keep trying!',
        'Well done! You\'re learning!',
        'Good effort! Practice makes perfect!'
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    }

    // Play voice message with delay to layer with sound effects
    setTimeout(() => {
      this.generateVoiceMessage(message, points);
    }, 600);
  }

  // Play celebration sound for milestones with enhanced effects
  async playCelebrationSound() {
    if (this.isMuted) return;
    
    // Epic celebration with multiple layered sounds
    this.playCustomSound(this.generateVictorySound(), 0.7);
    setTimeout(() => this.playClappingSound(100), 300);
    setTimeout(() => this.playCustomSound(this.generateChimeSound(), 0.4), 800);
    
    const celebrationMessages = [
      'Congratulations! You\'ve reached a new milestone!',
      'Amazing achievement! You\'ve unlocked a new level!',
      'Fantastic! This is outstanding progress!',
      'Brilliant! You\'ve earned something special!'
    ];
    
    const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    setTimeout(() => {
      this.generateVoiceMessage(message, 100);
    }, 1000);
  }

  // Check if API key is set
  hasElevenLabsKey(): boolean {
    return !!this.getElevenLabsApiKey();
  }

  // Legacy methods for backward compatibility
  get isSoundMuted(): boolean {
    return this.isMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  playButtonClick() {
    if (this.isMuted) return;
    this.playCustomSound(this.generateChimeSound(), 0.2);
  }

  playSuccessSound() {
    if (this.isMuted) return;
    this.playCustomSound(this.generateFanfareSound(), 0.3);
  }

  playErrorSound() {
    if (this.isMuted) return;
    // Play a different sound for errors (lower pitch)
    if (this.context) {
      const errorBuffer = this.context.createBuffer(2, this.context.sampleRate * 0.3, this.context.sampleRate);
      for (let channel = 0; channel < errorBuffer.numberOfChannels; channel++) {
        const channelData = errorBuffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          const t = i / this.context.sampleRate;
          channelData[i] = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 5) * 0.3; // Low A note
        }
      }
      this.playCustomSound(errorBuffer, 0.4);
    }
  }

  playPronunciation(text: string) {
    if (this.isMuted) return;
    // Use ElevenLabs to pronounce the text
    this.generateVoiceMessage(text, 5);
  }
}

export const audioService = new AudioService();