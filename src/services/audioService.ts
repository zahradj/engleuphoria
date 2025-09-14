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

  private async initializeAudioContext() {
    if (!this.context) {
      try {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Unlock audio context on user interaction
        const unlockAudio = () => {
          if (this.context && this.context.state === 'suspended') {
            this.context.resume();
          }
          document.removeEventListener('click', unlockAudio);
          document.removeEventListener('touchstart', unlockAudio);
        };
        
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
      } catch (error) {
        console.warn('Could not initialize audio context:', error);
      }
    }
  }

  private preloadSounds() {
    // Preload celebration sounds
    this.celebrationSounds.success = new Audio('/success.mp3');
    this.celebrationSounds.achievement = new Audio('/achievement.mp3');
    this.celebrationSounds.levelUp = new Audio('/level-up.mp3');
    
    // Set volume for preloaded sounds
    Object.values(this.celebrationSounds).forEach(sound => {
      sound.volume = 0.3;
      sound.preload = 'auto';
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  isMutedState() {
    return this.isMuted;
  }

  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.context) return null;

    const sampleRate = this.context.sampleRate;
    const samples = Math.floor(sampleRate * duration);
    const buffer = this.context.createBuffer(1, samples, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          value = 2 * ((frequency * t) % 1) - 1;
          break;
        case 'triangle':
          value = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
          break;
      }
      
      // Apply envelope for smoother sound
      const envelope = Math.exp(-t * 3);
      channelData[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  private playCustomSound(buffer: AudioBuffer | null, volume: number = 0.5) {
    if (!this.context || !buffer || this.isMuted) return;

    try {
      const source = this.context.createBufferSource();
      const gainNode = this.context.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      source.start();
    } catch (error) {
      console.warn('Could not play custom sound:', error);
    }
  }

  private generateVictorySound(): AudioBuffer | null {
    if (!this.context) return null;

    const sampleRate = this.context.sampleRate;
    const duration = 1.2;
    const samples = Math.floor(sampleRate * duration);
    const buffer = this.context.createBuffer(1, samples, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Ascending melody with harmonics
      const freq1 = 440 * (1 + progress * 0.5);
      const freq2 = 880 * (1 + progress * 0.3);
      const freq3 = 1320 * (1 + progress * 0.2);
      
      const wave1 = Math.sin(2 * Math.PI * freq1 * t) * 0.4;
      const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.3;
      const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.2;
      
      const envelope = Math.exp(-t * 1.5) * (1 - progress * 0.5);
      channelData[i] = (wave1 + wave2 + wave3) * envelope;
    }

    return buffer;
  }

  private generateSuccessChime(): AudioBuffer | null {
    if (!this.context) return null;

    const sampleRate = this.context.sampleRate;
    const duration = 0.8;
    const samples = Math.floor(sampleRate * duration);
    const buffer = this.context.createBuffer(1, samples, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Pleasant C major chord progression
    const frequencies = [261.63, 329.63, 392.00]; // C, E, G

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      frequencies.forEach((freq, index) => {
        value += Math.sin(2 * Math.PI * freq * t) * (0.3 / frequencies.length);
      });
      
      // Bell-like envelope
      const envelope = Math.exp(-t * 4);
      channelData[i] = value * envelope;
    }

    return buffer;
  }

  private async generateClappingBuffer(): Promise<AudioBuffer | null> {
    if (!this.context || this.clapBuffer) return this.clapBuffer;

    try {
      const sampleRate = this.context.sampleRate;
      const duration = 0.1;
      const samples = Math.floor(sampleRate * duration);
      const buffer = this.context.createBuffer(1, samples, sampleRate);
      const channelData = buffer.getChannelData(0);

      // Generate noise-based clap sound
      for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        const envelope = Math.exp(-t * 40);
        channelData[i] = noise * envelope * 0.5;
      }

      this.clapBuffer = buffer;
      return buffer;
    } catch (error) {
      console.warn('Could not generate clapping buffer:', error);
      return null;
    }
  }

  private async playClappingSound(intensity: number = 1) {
    if (this.isMuted) return;

    const clapBuffer = await this.generateClappingBuffer();
    if (!clapBuffer) return;

    const numberOfClaps = Math.min(Math.max(Math.floor(intensity / 10), 1), 5);
    
    for (let i = 0; i < numberOfClaps; i++) {
      setTimeout(() => {
        this.playCustomSound(clapBuffer, 0.4);
      }, i * 150);
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

  // Generate exciting voice messages using secure edge function
  async generateVoiceMessage(text: string, points: number): Promise<void> {
    if (this.isMuted) return;
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('generate-speech', {
        body: { text, voiceId: '9BWtsMINqrJLrRacOk9x' }
      });

      if (error) {
        console.error('Failed to generate voice message:', error);
        return;
      }

      // Convert response to audio buffer and play
      if (data) {
        const audioBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
        
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
      // Success chime + moderate clapping
      this.playCustomSound(this.generateSuccessChime(), 0.5);
      setTimeout(() => this.playClappingSound(points), 300);
    } else if (points >= 10) {
      // Pleasant ding + light clapping
      this.playCustomSound(this.generateTone(523.25, 0.5), 0.4); // C5 note
      setTimeout(() => this.playClappingSound(points), 200);
    } else {
      // Simple positive tone
      this.playCustomSound(this.generateTone(440, 0.3), 0.3); // A4 note
    }

    // Generate voice message for big achievements
    if (points >= 20) {
      const messages = [
        "Outstanding work!",
        "Fantastic job!",
        "You're amazing!",
        "Brilliant performance!",
        "Excellent progress!",
        "Keep up the great work!",
        "You're doing wonderfully!"
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setTimeout(() => {
        this.generateVoiceMessage(randomMessage, points);
      }, 800);
    }
  }

  playCorrectAnswerSound() {
    if (this.isMuted) return;
    this.playCustomSound(this.generateTone(659.25, 0.2), 0.3); // E5 note
  }

  playIncorrectAnswerSound() {
    if (this.isMuted) return;
    this.playCustomSound(this.generateTone(220, 0.5, 'sawtooth'), 0.2); // A3 note, sawtooth wave
  }

  playLevelUpSound() {
    if (this.isMuted) return;
    // Ascending melody
    const notes = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playCustomSound(this.generateTone(freq, 0.3), 0.4);
      }, index * 100);
    });
  }

  playNotificationSound() {
    if (this.isMuted) return;
    this.playCustomSound(this.generateTone(800, 0.1), 0.2);
    setTimeout(() => {
      this.playCustomSound(this.generateTone(1000, 0.1), 0.2);
    }, 100);
  }

  // Check if API key is set
  hasElevenLabsKey(): boolean {
    return !!this.getElevenLabsApiKey();
  }

  // Play generic celebration sound
  playCelebration() {
    if (this.isMuted) return;
    
    if (this.celebrationSounds.success) {
      this.celebrationSounds.success.currentTime = 0;
      this.celebrationSounds.success.play().catch(console.warn);
    } else {
      // Fallback to generated sound
      this.playCustomSound(this.generateVictorySound(), 0.5);
    }
  }

  // Play achievement unlock sound
  playAchievementUnlock() {
    if (this.isMuted) return;
    
    if (this.celebrationSounds.achievement) {
      this.celebrationSounds.achievement.currentTime = 0;
      this.celebrationSounds.achievement.play().catch(console.warn);
    } else {
      // Fallback to generated sound
      this.playLevelUpSound();
    }
  }

  // Background ambient sound for focus
  async playFocusAmbient() {
    if (this.isMuted || !this.context) return;

    // Generate subtle brown noise for concentration
    const duration = 30; // 30 seconds
    const sampleRate = this.context.sampleRate;
    const samples = Math.floor(sampleRate * duration);
    const buffer = this.context.createBuffer(1, samples, sampleRate);
    const channelData = buffer.getChannelData(0);

    let brownNoise = 0;
    for (let i = 0; i < samples; i++) {
      const white = Math.random() * 2 - 1;
      brownNoise = (brownNoise + (0.02 * white)) / 1.02;
      channelData[i] = brownNoise * 0.1; // Very quiet
    }

    this.playCustomSound(buffer, 0.05);
  }

  // Text-to-speech for pronunciation help
  playPronunciation(text: string) {
    if (this.isMuted) return;
    // Use the secure edge function for pronunciation
    this.generateVoiceMessage(text, 5);
  }

  // Compatibility methods for existing code
  playCelebrationSound() {
    this.playCelebration();
  }

  playSuccessSound() {
    this.playCorrectAnswerSound();
  }

  playErrorSound() {
    this.playIncorrectAnswerSound();
  }

  playButtonClick() {
    if (this.isMuted) return;
    this.playCustomSound(this.generateTone(800, 0.05), 0.1);
  }

  isSoundMuted() {
    return this.isMutedState();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }
}

export const audioService = new AudioService();