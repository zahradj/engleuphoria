
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, MicOff, CameraOff, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get parameters from URL
  const roomId = searchParams.get('roomId') || 'unified-classroom-1';
  const role = searchParams.get('role') || 'student';
  const name = searchParams.get('name') || 'User';
  const userId = searchParams.get('userId') || 'user-1';

  const initializeMedia = async () => {
    setIsLoading(true);
    setMediaError(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Media Access Granted",
        description: "Camera and microphone are working properly!",
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
        }
      }
      
      setMediaError(errorMessage);
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
    setTestCompleted(true);
    toast({
      title: "Media Test Complete",
      description: "You're ready to join the classroom!",
    });
  };

  const joinClassroom = () => {
    // Stop the test stream before navigating
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Navigate to classroom with all parameters
    navigate(`/classroom?roomId=${roomId}&role=${role}&name=${encodeURIComponent(name)}&userId=${userId}`);
  };

  const goBack = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate(-1);
  };

  useEffect(() => {
    initializeMedia();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white">Requesting camera access...</div>
                  </div>
                ) : mediaError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>{mediaError}</p>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
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

          {/* Test Status Card */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Camera Status</span>
                  <div className="flex items-center gap-2">
                    {stream && !mediaError ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Working</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Error</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Microphone Status</span>
                  <div className="flex items-center gap-2">
                    {stream && !mediaError ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Working</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Error</span>
                      </>
                    )}
                  </div>
                </div>

                {stream && !mediaError && !testCompleted && (
                  <Button onClick={completeTest} className="w-full mt-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Complete - Ready to Join
                  </Button>
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
              <Button onClick={initializeMedia} className="flex-1">
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
