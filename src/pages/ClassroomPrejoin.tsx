import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Settings, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const ClassroomPrejoin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [micPermission, setMicPermission] = useState<'checking' | 'granted' | 'denied'>('checking');
  const [cameraPermission, setCameraPermission] = useState<'checking' | 'granted' | 'denied'>('checking');
  const [selectedMic, setSelectedMic] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [devices, setDevices] = useState<{ microphones: MediaDeviceInfo[]; cameras: MediaDeviceInfo[] }>({
    microphones: [],
    cameras: []
  });
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  
  const roomId = searchParams.get('roomId') || 'test-room';
  const role = searchParams.get('role') || 'student';
  const userName = searchParams.get('name') || user?.user_metadata?.full_name || 'User';

  useEffect(() => {
    checkPermissionsAndDevices();
    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkPermissionsAndDevices = async () => {
    try {
      // Request permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPreviewStream(stream);
      setMicPermission('granted');
      setCameraPermission('granted');

      // Get available devices
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const microphones = deviceList.filter(device => device.kind === 'audioinput');
      const cameras = deviceList.filter(device => device.kind === 'videoinput');
      
      setDevices({ microphones, cameras });
      
      if (microphones.length > 0) setSelectedMic(microphones[0].deviceId);
      if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
      
    } catch (error) {
      console.error('Permission denied or no devices:', error);
      setMicPermission('denied');
      setCameraPermission('denied');
    }
  };

  const joinClassroom = () => {
    const params = new URLSearchParams({
      roomId,
      role,
      name: userName,
      userId: user?.id || 'guest',
      micDevice: selectedMic,
      cameraDevice: selectedCamera
    });
    
    navigate(`/classroom?${params.toString()}`);
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Settings className="h-5 w-5 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Classroom
          </h1>
          <p className="text-gray-600">
            Check your devices before entering the classroom
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Device Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Device Check
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Camera Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Camera</span>
                  {getPermissionIcon(cameraPermission)}
                </div>
                
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {previewStream ? (
                    <video
                      ref={(video) => {
                        if (video && previewStream) {
                          video.srcObject = previewStream;
                          video.play();
                        }
                      }}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <VideoOff className="h-12 w-12" />
                    </div>
                  )}
                </div>
                
                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.cameras.map((camera) => (
                      <SelectItem key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || 'Camera'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Microphone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Microphone</span>
                  {getPermissionIcon(micPermission)}
                </div>
                
                <Select value={selectedMic} onValueChange={setSelectedMic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.microphones.map((mic) => (
                      <SelectItem key={mic.deviceId} value={mic.deviceId}>
                        {mic.label || 'Microphone'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Session Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Room ID</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {roomId}
                  </code>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your Role</span>
                  <Badge variant={role === 'teacher' ? 'default' : 'secondary'}>
                    {role === 'teacher' ? 'Teacher' : 'Student'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your Name</span>
                  <span className="font-medium">{userName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="font-medium">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Ready Check */}
              <div className="space-y-3">
                <h3 className="font-medium">Ready to join?</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {micPermission === 'granted' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Microphone ready
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {cameraPermission === 'granted' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Camera ready
                  </div>
                </div>
              </div>

              <Button 
                onClick={joinClassroom}
                className="w-full"
                size="lg"
                disabled={micPermission === 'checking' || cameraPermission === 'checking'}
              >
                {micPermission === 'checking' || cameraPermission === 'checking' ? (
                  'Checking devices...'
                ) : (
                  'Join Classroom'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPrejoin;