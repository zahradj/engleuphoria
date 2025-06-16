
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, MicOff, CameraOff, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MediaTestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // New states for better validation
  const [cameraStatus, setCameraStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [microphoneStatus, setMicrophoneStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  
  // Get parameters from URL
  const roomId = searchParams.get('roomId') || 'unified-classroom-1';
  const role = searchParams.get('role') || 'student';
  const name = searchParams.get('name') || 'User';
  const userId = searchParams.get('userId') || 'user-1';

  // Audio level monitoring
  const startAudioLevelMonitoring = (mediaStream: MediaStream) => {
    try {
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) return;

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255 * 100);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Audio level monitoring error:', error);
    }
  };

  const stopAudioLevelMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // Validate media tracks
  const validateMediaTracks = (mediaStream: MediaStream) => {
    const videoTracks = mediaStream.getVideoTracks();
    const audioTracks = mediaStream.getAudioTracks();
    
    console.log('Validating tracks:', {
      video: videoTracks.length,
      audio: audioTracks.length,
      videoEnabled: videoTracks[0]?.enabled,
      audioEnabled: audioTracks[0]?.enabled,
      videoReadyState: videoTracks[0]?.readyState,
      audioReadyState: audioTracks[0]?.readyState
    });

    // Check camera status
    if (videoTracks.length > 0 && videoTracks[0].readyState === 'live') {
      setCameraStatus('working');
    } else {
      setCameraStatus('error');
    }

    // Check microphone status
    if (audioTracks.length > 0 && audioTracks[0].readyState === 'live') {
      setMicrophoneStatus('working');
      startAudioLevelMonitoring(mediaStream);
    } else {
      setMicrophoneStatus('error');
    }
  };

  const initializeMedia = async () => {
    setIsLoading(true);
    setMediaError(null);
    setCameraStatus('unknown');
    setMicrophoneStatus('unknown');
    setIsVideoPlaying(false);
    
    try {
      console.log('Requesting media access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('Media access granted, setting up stream...');
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Add event listeners for video
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          validateMediaTracks(mediaStream);
        };
        
        videoRef.current.onplaying = () => {
          console.log('Video is playing');
          setIsVideoPlaying(true);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          setCameraStatus('error');
        };
      }
      
      toast({
        title: "Media Access Granted",
        description: "Testing camera and microphone...",
      });
      
    } catch (error) {
      console.error('Media access error:', error);
      let errorMessage = "Unable to access camera/microphone";
      
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage = "Camera/microphone access denied. Please allow permissions and try again.";
        } else if (error.name === "NotFoundError") {
          errorMessage = "No camera or microphone found.";
        } else if (error.name === "NotReadableError") {
          errorMessage = "Camera/microphone is already in use by another application.";
        } else if (error.name === "OverconstrainedError") {
          errorMessage = "Camera/microphone doesn't meet the required constraints.";
        }
      }
      
      setMediaError(errorMessage);
      setCameraStatus('error');
      setMicrophoneStatus('error');
      
      toast({
        title: "Media Access Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        
        if (!audioTrack.enabled) {
          stopAudioLevelMonitoring();
          setAudioLevel(0);
        } else {
          startAudioLevelMonitoring(stream);
        }
      }
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  const completeTest = () => {
    if (cameraStatus === 'working' && microphoneStatus === 'working') {
      setTestCompleted(true);
      toast({
        title: "Media Test Complete",
        description: "You're ready to join the classroom!",
      });
    } else {
      toast({
        title: "Test Not Complete",
        description: "Please ensure both camera and microphone are working properly.",
        variant: "destructive"
      });
    }
  };

  const joinClassroom = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    stopAudioLevelMonitoring();
    navigate(`/classroom?roomId=${roomId}&role=${role}&name=${encodeURIComponent(name)}&userId=${userId}`);
  };

  const goBack = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    stopAudioLevelMonitoring();
    navigate(-1);
  };

  const retryMediaAccess = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    stopAudioLevelMonitoring();
    setStream(null);
    initializeMedia();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMedia();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stopAudioLevelMonitoring();
    };
  }, []);

  const canCompleteTest = cameraStatus === 'working' && microphoneStatus === 'working' && isVideoPlaying;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Camera & Microphone Test</h1>
          <p className="text-gray-600">
            Let's make sure your camera and microphone are working before joining as {role}
          </p>
          <Badge variant="outline" className="mt-2">
            {role === 'teacher' ? 'Teacher' : 'Student'}: {name}
          </Badge>
        </div>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {/* Video Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Test
                {cameraStatus === 'working' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {cameraStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Requesting camera access...
                    </div>
                  </div>
                ) : mediaError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                      <p className="mb-2">{mediaError}</p>
                      <Button onClick={retryMediaAccess} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Video status indicator */}
                    {stream && (
                      <div className="absolute top-4 right-4">
                        <Badge variant={isVideoPlaying ? "default" : "destructive"}>
                          {isVideoPlaying ? "Video Live" : "Video Loading"}
                        </Badge>
                      </div>
                    )}
                  </>
                )}
                
                {isCameraOff && !mediaError && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CameraOff className="h-12 w-12 mx-auto mb-2" />
                      <p>Camera is off</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={toggleCamera}
                  variant={isCameraOff ? "destructive" : "outline"}
                  disabled={!stream || !!mediaError}
                  className="flex-1"
                >
                  {isCameraOff ? <CameraOff className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                  {isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
                </Button>
                
                <Button
                  onClick={toggleMicrophone}
                  variant={isMuted ? "destructive" : "outline"}
                  disabled={!stream || !!mediaError}
                  className="flex-1"
                >
                  {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Microphone Test Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Microphone Test
                {microphoneStatus === 'working' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {microphoneStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Audio Level:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-150 ${
                        audioLevel > 50 ? 'bg-green-500' : 
                        audioLevel > 20 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(audioLevel, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {Math.round(audioLevel)}%
                  </span>
                </div>
                
                {microphoneStatus === 'working' && !isMuted && (
                  <p className="text-sm text-green-600">
                    ✓ Speak now to see the audio level indicator move
                  </p>
                )}
                
                {isMuted && (
                  <p className="text-sm text-orange-600">
                    Microphone is muted - unmute to test audio levels
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Status Card */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Camera Status</span>
                  <div className="flex items-center gap-2">
                    {cameraStatus === 'working' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Working</span>
                      </>
                    ) : cameraStatus === 'error' ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Error</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-blue-600">Testing</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Microphone Status</span>
                  <div className="flex items-center gap-2">
                    {microphoneStatus === 'working' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Working</span>
                      </>
                    ) : microphoneStatus === 'error' ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Error</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-blue-600">Testing</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Video Stream</span>
                  <div className="flex items-center gap-2">
                    {isVideoPlaying ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Live</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">Loading</span>
                      </>
                    )}
                  </div>
                </div>

                {canCompleteTest && !testCompleted && (
                  <Button onClick={completeTest} className="w-full mt-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Complete - Ready to Join
                  </Button>
                )}
                
                {!canCompleteTest && !isLoading && (
                  <div className="text-center mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please ensure both camera and microphone are working properly before proceeding
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={goBack} className="flex-1">
              Go Back
            </Button>
            
            {mediaError ? (
              <Button onClick={retryMediaAccess} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            ) : testCompleted ? (
              <Button onClick={joinClassroom} className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                Join Classroom
              </Button>
            ) : (
              <Button disabled className="flex-1">
                Complete Test First
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTestPage;
