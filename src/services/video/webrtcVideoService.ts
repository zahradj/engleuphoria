import { PeerConnectionManager } from './peerConnectionManager';
import { toast } from "sonner";

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'joined' | 'user-joined' | 'user-left' | 'existing-participants';
  roomId?: string;
  userId?: string;
  fromUserId?: string;
  targetUserId?: string;
  data?: any;
  participants?: string[];
  participantCount?: number;
}

export class WebRTCVideoService {
  private ws: WebSocket | null = null;
  private peerManager: PeerConnectionManager;
  private roomId: string | null = null;
  private userId: string | null = null;
  private onParticipantsUpdate: ((participants: Map<string, MediaStream>) => void) | null = null;

  constructor() {
    this.peerManager = new PeerConnectionManager();
  }

  setOnParticipantsUpdate(callback: (participants: Map<string, MediaStream>) => void) {
    this.onParticipantsUpdate = callback;
  }

  async joinRoom(roomId: string, userId: string, localStream: MediaStream): Promise<void> {
    this.roomId = roomId;
    this.userId = userId;
    
    this.peerManager.setLocalStream(localStream);
    
    // Set up remote stream handler
    this.peerManager.setOnRemoteStream((userId, stream) => {
      console.log(`🎥 Remote stream received from ${userId}`);
      this.notifyParticipantsUpdate();
    });

    // Set up connection state handler
    this.peerManager.setOnConnectionStateChange((userId, state) => {
      console.log(`🔌 Connection state changed for ${userId}:`, state);
      if (state === 'failed' || state === 'disconnected') {
        this.notifyParticipantsUpdate();
      }
    });

    // Connect to signaling server
    await this.connectToSignalingServer(roomId, userId);
  }

  private async connectToSignalingServer(roomId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use the full WebSocket URL for the edge function
      const wsUrl = `wss://dcoxpyzoqjvmuuygvlme.supabase.co/functions/v1/webrtc-signaling`;
      
      console.log(`🔗 Connecting to signaling server: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`✅ Connected to signaling server`);
        
        // Send join message
        this.sendSignalingMessage({
          type: 'join',
          roomId,
          userId
        });
        
        resolve();
      };

      this.ws.onmessage = async (event) => {
        try {
          const message: SignalingMessage = JSON.parse(event.data);
          await this.handleSignalingMessage(message);
        } catch (error) {
          console.error('Error handling signaling message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        toast.error("Connection error");
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket connection closed');
      };
    });
  }

  private async handleSignalingMessage(message: SignalingMessage) {
    console.log('📨 Received signaling message:', message.type);

    switch (message.type) {
      case 'joined':
        console.log(`✅ Successfully joined room ${message.roomId}`);
        toast.success("Joined video room");
        break;

      case 'existing-participants':
        // Create peer connections for existing participants
        if (message.participants) {
          for (const participantId of message.participants) {
            await this.initiateConnectionToUser(participantId);
          }
        }
        break;

      case 'user-joined':
        // New user joined, we should wait for their offer
        console.log(`👤 User ${message.userId} joined the room`);
        break;

      case 'offer':
        await this.handleOffer(message.fromUserId!, message.data);
        break;

      case 'answer':
        await this.handleAnswer(message.fromUserId!, message.data);
        break;

      case 'ice-candidate':
        await this.handleIceCandidate(message.fromUserId!, message.data);
        break;

      case 'user-left':
        this.handleUserLeft(message.userId!);
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private async initiateConnectionToUser(userId: string) {
    console.log(`🤝 Initiating connection to user ${userId}`);

    // Create peer connection
    const pc = await this.peerManager.createPeerConnection(userId, (candidate) => {
      this.sendSignalingMessage({
        type: 'ice-candidate',
        roomId: this.roomId!,
        userId: this.userId!,
        targetUserId: userId,
        data: candidate.toJSON()
      });
    });

    // Create and send offer
    const offer = await this.peerManager.createOffer(userId);
    
    this.sendSignalingMessage({
      type: 'offer',
      roomId: this.roomId!,
      userId: this.userId!,
      targetUserId: userId,
      data: offer
    });
  }

  private async handleOffer(fromUserId: string, offer: RTCSessionDescriptionInit) {
    console.log(`📥 Handling offer from ${fromUserId}`);

    // Create peer connection if it doesn't exist
    if (!this.peerManager.getConnectionState(fromUserId)) {
      await this.peerManager.createPeerConnection(fromUserId, (candidate) => {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          roomId: this.roomId!,
          userId: this.userId!,
          targetUserId: fromUserId,
          data: candidate.toJSON()
        });
      });
    }

    // Handle offer and create answer
    const answer = await this.peerManager.handleOffer(fromUserId, offer);
    
    this.sendSignalingMessage({
      type: 'answer',
      roomId: this.roomId!,
      userId: this.userId!,
      targetUserId: fromUserId,
      data: answer
    });
  }

  private async handleAnswer(fromUserId: string, answer: RTCSessionDescriptionInit) {
    console.log(`📥 Handling answer from ${fromUserId}`);
    await this.peerManager.handleAnswer(fromUserId, answer);
  }

  private async handleIceCandidate(fromUserId: string, candidate: RTCIceCandidateInit) {
    console.log(`🧊 Handling ICE candidate from ${fromUserId}`);
    await this.peerManager.handleIceCandidate(fromUserId, candidate);
  }

  private handleUserLeft(userId: string) {
    console.log(`👋 User ${userId} left`);
    this.peerManager.closePeerConnection(userId);
    this.notifyParticipantsUpdate();
    toast.info("Participant left");
  }

  private sendSignalingMessage(message: SignalingMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  private notifyParticipantsUpdate() {
    if (this.onParticipantsUpdate) {
      const participants = this.peerManager.getAllRemoteStreams();
      this.onParticipantsUpdate(participants);
    }
  }

  leaveRoom() {
    if (this.ws && this.roomId && this.userId) {
      this.sendSignalingMessage({
        type: 'leave',
        roomId: this.roomId,
        userId: this.userId
      });
    }

    this.peerManager.closeAllConnections();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.roomId = null;
    this.userId = null;
  }

  getRemoteStreams(): Map<string, MediaStream> {
    return this.peerManager.getAllRemoteStreams();
  }
}
