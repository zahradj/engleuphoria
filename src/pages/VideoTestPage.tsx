import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { realTimeVideoService } from '@/services/video/realTimeVideoService';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConnectionQualityIndicator } from '@/components/classroom/video/ConnectionQualityIndicator';
import { ConnectionQualityMetrics } from '@/services/video/connectionQualityMonitor';

export default function VideoTestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  const roomId = searchParams.get('roomId') || 'test-room-' + Date.now();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQualityMetrics | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  // Initialize local media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        
        // Display local stream
        const videoElement = document.getElementById('local-video') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to access media devices';
        setError(message);
        toast({
          title: "Media Error",
          description: message,
          variant: "destructive"
        });
      }
    };

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Set up participants listener
  useEffect(() => {
    realTimeVideoService.onParticipantsChange((newParticipants) => {
      console.log('Participants updated:', newParticipants);
      setParticipants(newParticipants);
      
      // Update video elements for remote participants
      newParticipants.forEach((participant) => {
        const videoElement = document.getElementById(`remote-video-${participant.id}`) as HTMLVideoElement;
        if (videoElement && participant.stream) {
          videoElement.srcObject = participant.stream;
        }
      });
    });
  }, []);

  const handleJoinRoom = async () => {
    if (!localStream || !user) return;

    try {
      realTimeVideoService.setRoomConfig(roomId, user.id, localStream);
      await realTimeVideoService.joinRoom();
      setIsConnected(true);
      
      // Start quality monitoring
      realTimeVideoService.startQualityMonitoring((metrics) => {
        setConnectionQuality(metrics);
      });
      
      toast({
        title: "Connected",
        description: "Successfully joined the video room"
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join room';
      setError(message);
      toast({
        title: "Connection Error",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleLeaveRoom = async () => {
    realTimeVideoService.stopQualityMonitoring();
    await realTimeVideoService.leaveRoom();
    setIsConnected(false);
    setParticipants([]);
    setConnectionQuality(null);
    toast({
      title: "Disconnected",
      description: "Left the video room"
    });
  };

  const toggleMicrophone = async () => {
    const muted = await realTimeVideoService.toggleMicrophone();
    setIsMuted(!localStream?.getAudioTracks()[0]?.enabled || false);
  };

  const toggleCamera = async () => {
    const cameraOff = await realTimeVideoService.toggleCamera();
    setIsCameraOff(!localStream?.getVideoTracks()[0]?.enabled || false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please log in to test the video feature.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>WebRTC Video Test</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Room ID: {roomId}</p>
              </div>
              <div className="flex items-center gap-2">
                {isConnected && connectionQuality && (
                  <ConnectionQualityIndicator quality={connectionQuality} />
                )}
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {!isConnected ? (
                <Button onClick={handleJoinRoom} disabled={!localStream}>
                  <Phone className="mr-2 h-4 w-4" />
                  Join Room
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleLeaveRoom}>
                  <PhoneOff className="mr-2 h-4 w-4" />
                  Leave Room
                </Button>
              )}
              
              {isConnected && (
                <>
                  <Button
                    variant={isMuted ? "destructive" : "outline"}
                    onClick={toggleMicrophone}
                  >
                    {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                  
                  <Button
                    variant={isCameraOff ? "destructive" : "outline"}
                    onClick={toggleCamera}
                  >
                    {isCameraOff ? <VideoOff className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                    {isCameraOff ? "Start Video" : "Stop Video"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Video */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">You (Local)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  id="local-video"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {isCameraOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <VideoOff className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remote Videos */}
          {participants.map((participant) => (
            <Card key={participant.id}>
              <CardHeader>
                <CardTitle className="text-sm">{participant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    id={`remote-video-${participant.id}`}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty state */}
          {isConnected && participants.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Waiting for others to join...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
              <p>Room ID: {roomId}</p>
              <p>User ID: {user.id}</p>
              <p>Local Stream: {localStream ? '✓ Active' : '✗ Not available'}</p>
              <p>Connection Status: {isConnected ? '✓ Connected' : '✗ Disconnected'}</p>
              <p>Participants: {participants.length}</p>
              <p>Microphone: {isMuted ? '✗ Muted' : '✓ Active'}</p>
              <p>Camera: {isCameraOff ? '✗ Off' : '✓ Active'}</p>
              {connectionQuality && (
                <>
                  <hr className="my-2" />
                  <p className="font-bold">Connection Quality:</p>
                  <p>Overall: {connectionQuality.quality}</p>
                  <p>Latency: {connectionQuality.latency}ms</p>
                  <p>Packet Loss: {connectionQuality.packetLoss.toFixed(2)}%</p>
                  <p>Jitter: {connectionQuality.jitter}ms</p>
                  <p>Bandwidth: {connectionQuality.bandwidth} KB/s</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
