import { toast } from "sonner";

interface PeerConnection {
  pc: RTCPeerConnection;
  userId: string;
  stream?: MediaStream;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

export class PeerConnectionManager {
  private connections = new Map<string, PeerConnection>();
  private localStream: MediaStream | null = null;
  private onRemoteStream: ((userId: string, stream: MediaStream) => void) | null = null;
  private onConnectionStateChange: ((userId: string, state: RTCPeerConnectionState) => void) | null = null;

  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    console.log("📹 Local stream set:", stream.getTracks().map(t => t.kind));
  }

  setOnRemoteStream(callback: (userId: string, stream: MediaStream) => void) {
    this.onRemoteStream = callback;
  }

  setOnConnectionStateChange(callback: (userId: string, state: RTCPeerConnectionState) => void) {
    this.onConnectionStateChange = callback;
  }

  async createPeerConnection(
    userId: string,
    onIceCandidate: (candidate: RTCIceCandidate) => void
  ): Promise<RTCPeerConnection> {
    console.log(`🔗 Creating peer connection for user ${userId}`);

    const pc = new RTCPeerConnection(ICE_SERVERS);
    
    this.connections.set(userId, { pc, userId });

    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          pc.addTrack(track, this.localStream);
          console.log(`➕ Added ${track.kind} track to peer connection`);
        }
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`🧊 ICE candidate for ${userId}:`, event.candidate.type);
        onIceCandidate(event.candidate);
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log(`📥 Received ${event.track.kind} track from ${userId}`);
      const [stream] = event.streams;
      
      const connection = this.connections.get(userId);
      if (connection) {
        connection.stream = stream;
      }

      if (this.onRemoteStream) {
        this.onRemoteStream(userId, stream);
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`🔌 Connection state for ${userId}:`, pc.connectionState);
      
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(userId, pc.connectionState);
      }

      if (pc.connectionState === 'failed') {
        console.error(`❌ Connection failed for ${userId}, attempting restart`);
        this.restartIce(userId);
      } else if (pc.connectionState === 'disconnected') {
        console.warn(`⚠️ Connection disconnected for ${userId}`);
      } else if (pc.connectionState === 'connected') {
        console.log(`✅ Successfully connected to ${userId}`);
        toast.success(`Connected to peer`);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`🧊 ICE connection state for ${userId}:`, pc.iceConnectionState);
    };

    return pc;
  }

  async createOffer(userId: string): Promise<RTCSessionDescriptionInit> {
    const connection = this.connections.get(userId);
    if (!connection) {
      throw new Error(`No connection found for user ${userId}`);
    }

    console.log(`📤 Creating offer for ${userId}`);
    const offer = await connection.pc.createOffer();
    await connection.pc.setLocalDescription(offer);
    return offer;
  }

  async handleOffer(
    userId: string,
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    const connection = this.connections.get(userId);
    if (!connection) {
      throw new Error(`No connection found for user ${userId}`);
    }

    console.log(`📥 Handling offer from ${userId}`);
    await connection.pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await connection.pc.createAnswer();
    await connection.pc.setLocalDescription(answer);
    
    return answer;
  }

  async handleAnswer(userId: string, answer: RTCSessionDescriptionInit) {
    const connection = this.connections.get(userId);
    if (!connection) {
      throw new Error(`No connection found for user ${userId}`);
    }

    console.log(`📥 Handling answer from ${userId}`);
    await connection.pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleIceCandidate(userId: string, candidate: RTCIceCandidateInit) {
    const connection = this.connections.get(userId);
    if (!connection) {
      console.warn(`No connection found for user ${userId} when adding ICE candidate`);
      return;
    }

    try {
      await connection.pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log(`🧊 Added ICE candidate for ${userId}`);
    } catch (error) {
      console.error(`Error adding ICE candidate for ${userId}:`, error);
    }
  }

  async restartIce(userId: string) {
    const connection = this.connections.get(userId);
    if (!connection) return;

    console.log(`🔄 Restarting ICE for ${userId}`);
    try {
      const offer = await connection.pc.createOffer({ iceRestart: true });
      await connection.pc.setLocalDescription(offer);
    } catch (error) {
      console.error(`Error restarting ICE for ${userId}:`, error);
    }
  }

  closePeerConnection(userId: string) {
    const connection = this.connections.get(userId);
    if (connection) {
      console.log(`🔌 Closing peer connection for ${userId}`);
      connection.pc.close();
      this.connections.delete(userId);
    }
  }

  closeAllConnections() {
    console.log(`🔌 Closing all peer connections`);
    this.connections.forEach((connection) => {
      connection.pc.close();
    });
    this.connections.clear();
  }

  getRemoteStream(userId: string): MediaStream | undefined {
    return this.connections.get(userId)?.stream;
  }

  getAllRemoteStreams(): Map<string, MediaStream> {
    const streams = new Map<string, MediaStream>();
    this.connections.forEach((connection, userId) => {
      if (connection.stream) {
        streams.set(userId, connection.stream);
      }
    });
    return streams;
  }

  getConnectionState(userId: string): RTCPeerConnectionState | undefined {
    return this.connections.get(userId)?.pc.connectionState;
  }
}
