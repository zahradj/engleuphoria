
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MediaTestPageProps {
  onTestComplete?: () => void;
  onGoBack?: () => void;
}
import { useMediaAccess } from "@/hooks/useMediaAccess";
import { useAudioMonitoring } from "@/hooks/useAudioMonitoring";
import { VideoPreviewCard } from "@/components/media-test/VideoPreviewCard";
import { MicrophoneTestCard } from "@/components/media-test/MicrophoneTestCard";
import { TestStatusCard } from "@/components/media-test/TestStatusCard";
import { NavigationButtons } from "@/components/media-test/NavigationButtons";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import { DeviceSelector } from "@/components/media-test/DeviceSelector";


const MediaTestPage = ({ onTestComplete, onGoBack }: MediaTestPageProps = {}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [testCompleted, setTestCompleted] = useState(false);
  const { cameras, microphones, selectedCameraId, selectedMicId, setSelectedCameraId, setSelectedMicId, refreshDevices } = useMediaDevices();
  
  const {
    stream,
    isMuted,
    setIsMuted,
    isCameraOff,
    setIsCameraOff,
    mediaError,
    isLoading,
    needsUserInteraction,
    setNeedsUserInteraction,
    cameraStatus,
    setCameraStatus,
    microphoneStatus,
    setMicrophoneStatus,
    isVideoPlaying,
    setIsVideoPlaying,
    videoLoadTimeout,
    setVideoLoadTimeout,
    initializeMedia,
    retryMediaAccess,
    cleanup
  } = useMediaAccess({ cameraId: selectedCameraId || undefined, micId: selectedMicId || undefined });


  const {
    audioLevel,
    startAudioLevelMonitoring,
    stopAudioLevelMonitoring
  } = useAudioMonitoring();
  
  // Get parameters from URL
  const roomId = searchParams.get('roomId') || 'unified-classroom-1';
  const role = searchParams.get('role') || 'student';
  const name = searchParams.get('name') || 'User';
  const userId = searchParams.get('userId') || 'user-1';

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        
        if (!audioTrack.enabled) {
          stopAudioLevelMonitoring();
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
        
        if (!videoTrack.enabled) {
          setIsVideoPlaying(false);
          setCameraStatus('unknown');
        }
      }
    }
  };

  const completeTest = () => {
    if (cameraStatus === 'working' && microphoneStatus === 'working' && isVideoPlaying) {
      setTestCompleted(true);
      toast({
        title: "Media Test Complete",
        description: "You're ready to join the classroom!",
      });
    } else {
      toast({
        title: "Test Not Complete",
        description: "Please ensure both camera and microphone are working properly and video is playing.",
        variant: "destructive"
      });
    }
  };

  const joinClassroom = () => {
    cleanup();
    stopAudioLevelMonitoring();
    
    if (onTestComplete) {
      // Called from MediaTestFlow - use callback instead of navigation
      onTestComplete();
    } else {
      // Direct access to MediaTestPage - navigate normally
      navigate(`/classroom?roomId=${roomId}&role=${role}&name=${encodeURIComponent(name)}&userId=${userId}`);
    }
  };

  const goBack = () => {
    cleanup();
    stopAudioLevelMonitoring();
    
    if (onGoBack) {
      // Called from MediaTestFlow - use callback
      onGoBack();
    } else {
      // Direct access to MediaTestPage - navigate back
      navigate(-1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMedia();
    }, 500);

    return () => {
      clearTimeout(timer);
      cleanup();
      stopAudioLevelMonitoring();
    };
  }, []);

  const handleChangeCamera = (id: string) => {
    setSelectedCameraId(id);
    retryMediaAccess();
    initializeMedia();
  };

  const handleChangeMic = (id: string) => {
    setSelectedMicId(id);
    retryMediaAccess();
    initializeMedia();
  };

  useEffect(() => {
    // After permissions granted, refresh to get device labels
    if (stream) {
      refreshDevices();
    }
  }, [stream, refreshDevices]);


  const canCompleteTest = cameraStatus === 'working' && microphoneStatus === 'working' && isVideoPlaying && !isCameraOff;

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
          <DeviceSelector
            cameras={cameras}
            microphones={microphones}
            selectedCameraId={selectedCameraId}
            selectedMicId={selectedMicId}
            onChangeCamera={handleChangeCamera}
            onChangeMic={handleChangeMic}
            onRefresh={refreshDevices}
          />

          <VideoPreviewCard
            stream={stream}
            isLoading={isLoading}
            mediaError={mediaError}
            cameraStatus={cameraStatus}
            setCameraStatus={setCameraStatus}
            microphoneStatus={microphoneStatus}
            setMicrophoneStatus={setMicrophoneStatus}
            isVideoPlaying={isVideoPlaying}
            setIsVideoPlaying={setIsVideoPlaying}
            videoLoadTimeout={videoLoadTimeout}
            setVideoLoadTimeout={setVideoLoadTimeout}
            needsUserInteraction={needsUserInteraction}
            setNeedsUserInteraction={setNeedsUserInteraction}
            isCameraOff={isCameraOff}
            isMuted={isMuted}
            toggleCamera={toggleCamera}
            toggleMicrophone={toggleMicrophone}
            retryMediaAccess={retryMediaAccess}
            startAudioLevelMonitoring={startAudioLevelMonitoring}
          />


          <MicrophoneTestCard
            microphoneStatus={microphoneStatus}
            audioLevel={audioLevel}
            isMuted={isMuted}
          />

          <TestStatusCard
            cameraStatus={cameraStatus}
            microphoneStatus={microphoneStatus}
            isVideoPlaying={isVideoPlaying}
            videoLoadTimeout={videoLoadTimeout}
            canCompleteTest={canCompleteTest}
            testCompleted={testCompleted}
            isLoading={isLoading}
            needsUserInteraction={needsUserInteraction}
            completeTest={completeTest}
          />

          <NavigationButtons
            mediaError={mediaError}
            testCompleted={testCompleted}
            goBack={goBack}
            retryMediaAccess={retryMediaAccess}
            joinClassroom={joinClassroom}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaTestPage;
