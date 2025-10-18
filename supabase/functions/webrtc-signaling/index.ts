import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave';
  roomId: string;
  userId: string;
  targetUserId?: string;
  data?: any;
}

// Store active connections per room
const rooms = new Map<string, Set<WebSocket>>();
const userConnections = new Map<string, { ws: WebSocket; roomId: string; userId: string }>();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let currentRoomId: string | null = null;
  let currentUserId: string | null = null;

  socket.onopen = () => {
    console.log("📡 WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log("📨 Received message:", message.type, "from user:", message.userId);

      switch (message.type) {
        case 'join':
          handleJoin(socket, message);
          currentRoomId = message.roomId;
          currentUserId = message.userId;
          break;

        case 'offer':
        case 'answer':
        case 'ice-candidate':
          handleSignaling(message);
          break;

        case 'leave':
          handleLeave(socket, message);
          break;

        default:
          console.warn("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      socket.send(JSON.stringify({ 
        type: 'error', 
        message: error.message 
      }));
    }
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket connection closed");
    if (currentRoomId && currentUserId) {
      handleLeave(socket, { 
        type: 'leave', 
        roomId: currentRoomId, 
        userId: currentUserId 
      });
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  return response;
});

function handleJoin(socket: WebSocket, message: SignalingMessage) {
  const { roomId, userId } = message;
  
  // Create room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  const room = rooms.get(roomId)!;
  room.add(socket);
  
  userConnections.set(userId, { ws: socket, roomId, userId });

  console.log(`👤 User ${userId} joined room ${roomId}. Total participants: ${room.size}`);

  // Notify user of successful join
  socket.send(JSON.stringify({
    type: 'joined',
    roomId,
    userId,
    participantCount: room.size
  }));

  // Notify existing participants about new user
  const existingParticipants: string[] = [];
  room.forEach(ws => {
    if (ws !== socket) {
      const connection = Array.from(userConnections.values()).find(c => c.ws === ws);
      if (connection) {
        existingParticipants.push(connection.userId);
        ws.send(JSON.stringify({
          type: 'user-joined',
          userId,
          roomId
        }));
      }
    }
  });

  // Send list of existing participants to new user
  socket.send(JSON.stringify({
    type: 'existing-participants',
    participants: existingParticipants
  }));
}

function handleSignaling(message: SignalingMessage) {
  const { targetUserId, type, data } = message;
  
  if (!targetUserId) {
    console.warn("No target user specified for signaling message");
    return;
  }

  const targetConnection = userConnections.get(targetUserId);
  if (!targetConnection) {
    console.warn(`Target user ${targetUserId} not found`);
    return;
  }

  console.log(`📤 Forwarding ${type} from ${message.userId} to ${targetUserId}`);

  targetConnection.ws.send(JSON.stringify({
    type,
    fromUserId: message.userId,
    data
  }));
}

function handleLeave(socket: WebSocket, message: SignalingMessage) {
  const { roomId, userId } = message;
  
  const room = rooms.get(roomId);
  if (room) {
    room.delete(socket);
    
    // Notify other participants
    room.forEach(ws => {
      ws.send(JSON.stringify({
        type: 'user-left',
        userId,
        roomId
      }));
    });

    console.log(`👋 User ${userId} left room ${roomId}. Remaining participants: ${room.size}`);

    // Clean up empty rooms
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`🧹 Room ${roomId} deleted (empty)`);
    }
  }

  userConnections.delete(userId);
}
