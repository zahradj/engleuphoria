import { supabase } from '@/integrations/supabase/client';

interface WebRTCCallbacks {
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private channel: any = null;
  private roomId: string = '';
  private userId: string = '';
  private callbacks: WebRTCCallbacks = {};

  constructor(callbacks: WebRTCCallbacks = {}) {
    this.callbacks = callbacks;
  }

  async initialize(roomId: string, userId: string, localStream: MediaStream) {
    this.roomId = roomId;
    this.userId = userId;
    this.localStream = localStream;

    // Create peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local tracks
    localStream.getTracks().forEach(track => {
      this.peerConnection!.addTrack(track, localStream);
    });

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('🎥 Received remote track:', event.track.kind);
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.callbacks.onRemoteStream?.(this.remoteStream);
      }
    };

    // Handle connection state
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log('🔗 Connection state:', state);
      this.callbacks.onConnectionChange?.(state === 'connected');
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal('ice-candidate', { candidate: event.candidate });
      }
    };

    // Set up signaling channel
    await this.setupSignaling();
  }

  private async setupSignaling() {
    this.channel = supabase.channel(`webrtc-${this.roomId}`);

    this.channel
      .on('broadcast', { event: 'offer' }, async ({ payload }: any) => {
        if (payload.from === this.userId) return;
        console.log('📩 Received offer');
        await this.handleOffer(payload.offer);
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }: any) => {
        if (payload.from === this.userId) return;
        console.log('📩 Received answer');
        await this.handleAnswer(payload.answer);
      })
      .on('broadcast', { event: 'ice-candidate' }, async ({ payload }: any) => {
        if (payload.from === this.userId) return;
        await this.handleIceCandidate(payload.candidate);
      })
      .subscribe();

    console.log('✅ Signaling channel ready');
  }

  async createOffer() {
    if (!this.peerConnection) return;

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.sendSignal('offer', { offer });
    console.log('📤 Sent offer');
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.sendSignal('answer', { answer });
    console.log('📤 Sent answer');
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return;
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  private sendSignal(event: string, payload: any) {
    if (!this.channel) return;
    this.channel.send({
      type: 'broadcast',
      event,
      payload: { ...payload, from: this.userId }
    });
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  dispose() {
    this.channel?.unsubscribe();
    this.peerConnection?.close();
    this.peerConnection = null;
    this.remoteStream = null;
  }
}
