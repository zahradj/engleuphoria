import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Send, Mic, MicOff, Video, VideoOff } from 'lucide-react';


interface CommunicationZoneProps {
  studentName: string;
  teacherName: string;
  onGiveStar: () => void;
  onOpenTimer: () => void;
  onRollDice: () => void;
  /** Send a sticker reaction emoji to the student. */
  onSendSticker: (emoji: string) => void;
  studentCanDraw?: boolean;
  onToggleStudentDrawing?: () => void;
  onShareScreen?: () => void;
  onEmbedLink?: () => void;
  isScreenSharing?: boolean;
  onStopScreenShare?: () => void;
  screenShareStream?: MediaStream | null;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  isVideoConnected?: boolean;
  isLocalCameraOff?: boolean;
  isRemoteConnected?: boolean;
  // Remote control of student media (broadcast via session context)
  studentMicMuted?: boolean;
  studentCameraOff?: boolean;
  onToggleStudentMic?: () => void;
  onToggleStudentCamera?: () => void;
}

export const CommunicationZone: React.FC<CommunicationZoneProps> = ({
  studentName,
  teacherName,
  onGiveStar,
  onOpenTimer,
  onRollDice,
  onSendSticker,
  studentCanDraw = false,
  onToggleStudentDrawing,
  onShareScreen,
  onEmbedLink,
  isScreenSharing = false,
  onStopScreenShare,
  screenShareStream,
  localStream,
  remoteStream,
  isVideoConnected = false,
  isLocalCameraOff = false,
  isRemoteConnected = false,
  studentMicMuted = false,
  studentCameraOff = false,
  onToggleStudentMic,
  onToggleStudentCamera
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'system', text: 'Class session started' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const studentVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (screenShareVideoRef.current && screenShareStream) {
      screenShareVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  useEffect(() => {
    if (teacherVideoRef.current && localStream) {
      teacherVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (studentVideoRef.current && remoteStream) {
      studentVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { sender: 'teacher', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-80 glass-panel border-r border-gray-200/50 flex flex-col shrink-0">
      {/* Video Containers */}
      <div className="p-3 space-y-3">
        {/* Screen Share Preview (if active) */}
        {isScreenSharing && screenShareStream && (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-indigo-400/50">
            <video
              ref={screenShareVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 left-2 bg-indigo-600/80 px-2 py-1 rounded text-xs text-white">
              Screen Share
            </div>
          </div>
        )}

        {/* Student Video Container */}
        <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden border-2 border-primary/30">
          {remoteStream ? (
            <video
              ref={studentVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-500">Waiting for student...</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
            {studentName}
          </div>
          <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${isRemoteConnected ? 'bg-emerald-500' : 'bg-gray-400'}`} />

          {/* Teacher remote-control over student mic & camera */}
          {(onToggleStudentMic || onToggleStudentCamera) && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {onToggleStudentMic && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleStudentMic}
                  title={studentMicMuted ? "Unmute student" : "Mute student"}
                  className={`h-7 w-7 rounded-full shadow-sm ${studentMicMuted ? 'bg-red-500/90 text-white hover:bg-red-600' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
                >
                  {studentMicMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </Button>
              )}
              {onToggleStudentCamera && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleStudentCamera}
                  title={studentCameraOff ? "Turn on student camera" : "Turn off student camera"}
                  className={`h-7 w-7 rounded-full shadow-sm ${studentCameraOff ? 'bg-red-500/90 text-white hover:bg-red-600' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
                >
                  {studentCameraOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Teacher Video Container (smaller) */}
        <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-2/3">
          {isVideoConnected && localStream && !isLocalCameraOff ? (
            <video
              ref={teacherVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          )}
          <div className="absolute bottom-1 left-1 bg-white/80 px-1.5 py-0.5 rounded text-[10px] text-gray-700 shadow-sm">
            You
          </div>
        </div>
      </div>

      {/* Tools moved to bottom Control Dock — left sidebar is now strictly Video Feeds + Chat */}

      {/* Mini Chat Box */}
      <div className="flex-1 flex flex-col border-t border-gray-200 mt-2">
        <div className="px-3 py-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase">Chat</span>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-2">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`text-xs rounded px-2 py-1 ${
                  msg.sender === 'teacher' 
                    ? 'bg-primary/10 text-gray-800 ml-4' 
                    : msg.sender === 'system'
                    ? 'bg-gray-100 text-gray-500 text-center italic'
                    : 'bg-gray-100 text-gray-700 mr-4'
                }`}
              >
                {msg.sender !== 'system' && (
                  <span className="font-medium block text-[10px] text-gray-500">
                    {msg.sender === 'teacher' ? 'You' : studentName}
                  </span>
                )}
                {msg.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="text-xs bg-gray-50 border-gray-200 h-8"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSendMessage}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};