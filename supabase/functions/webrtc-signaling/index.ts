const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave';
  roomId?: string;
  userId?: string;
  targetUserId?: string;
  data?: any;
}

// Store active connections per room
const rooms = new Map<string, Map<string, WebSocket>>();

function broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);
  room.forEach((ws, userId) => {
    if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    let currentUserId: string | null = null;
    let currentRoomId: string | null = null;

    socket.onopen = () => {
      console.log('🔗 WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      try {
        const message: SignalingMessage = JSON.parse(event.data);
        console.log('📨 Received message:', message.type, 'from:', message.userId);

        switch (message.type) {
          case 'join': {
            const { roomId, userId } = message;
            if (!roomId || !userId) break;

            currentUserId = userId;
            currentRoomId = roomId;

            // Create room if it doesn't exist
            if (!rooms.has(roomId)) {
              rooms.set(roomId, new Map());
            }

            const room = rooms.get(roomId)!;
            
            // Get existing participants before adding new user
            const existingParticipants = Array.from(room.keys());

            // Add user to room
            room.set(userId, socket);

            console.log(`✅ User ${userId} joined room ${roomId}. Total participants: ${room.size}`);

            // Send confirmation to the joining user
            socket.send(JSON.stringify({
              type: 'joined',
              roomId,
              userId,
              participantCount: room.size
            }));

            // Send existing participants list to the new user
            if (existingParticipants.length > 0) {
              socket.send(JSON.stringify({
                type: 'existing-participants',
                participants: existingParticipants
              }));
            }

            // Notify other participants about the new user
            broadcastToRoom(roomId, {
              type: 'user-joined',
              userId,
              participantCount: room.size
            }, userId);

            break;
          }

          case 'offer':
          case 'answer':
          case 'ice-candidate': {
            const { roomId, userId, targetUserId, data } = message;
            if (!roomId || !userId || !targetUserId) break;

            const room = rooms.get(roomId);
            if (!room) break;

            const targetSocket = room.get(targetUserId);
            if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
              targetSocket.send(JSON.stringify({
                type: message.type,
                fromUserId: userId,
                data
              }));
              console.log(`📤 Forwarded ${message.type} from ${userId} to ${targetUserId}`);
            }
            break;
          }

          case 'leave': {
            const { roomId, userId } = message;
            if (!roomId || !userId) break;

            const room = rooms.get(roomId);
            if (room) {
              room.delete(userId);
              console.log(`👋 User ${userId} left room ${roomId}`);

              // Notify other participants
              broadcastToRoom(roomId, {
                type: 'user-left',
                userId
              });

              // Clean up empty rooms
              if (room.size === 0) {
                rooms.delete(roomId);
                console.log(`🧹 Removed empty room ${roomId}`);
              }
            }
            break;
          }
        }
      } catch (error) {
        console.error('❌ Error handling message:', error);
      }
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket connection closed');
      
      // Clean up user from room
      if (currentRoomId && currentUserId) {
        const room = rooms.get(currentRoomId);
        if (room) {
          room.delete(currentUserId);
          
          // Notify other participants
          broadcastToRoom(currentRoomId, {
            type: 'user-left',
            userId: currentUserId
          });

          // Clean up empty rooms
          if (room.size === 0) {
            rooms.delete(currentRoomId);
            console.log(`🧹 Removed empty room ${currentRoomId}`);
          }
        }
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    return response;
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
