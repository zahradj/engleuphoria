import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Send } from 'lucide-react';
import { InteractionToolsGrid } from './InteractionToolsGrid';

interface CommunicationZoneProps {
  studentName: string;
  teacherName: string;
  onGiveStar: () => void;
  onOpenTimer: () => void;
  onRollDice: () => void;
  onSendSticker: () => void;
  studentCanDraw?: boolean;
  onToggleStudentDrawing?: () => void;
  onShareScreen?: () => void;
  onEmbedLink?: () => void;
  isScreenSharing?: boolean;
  onStopScreenShare?: () => void;
  screenShareStream?: MediaStream | null;
  localStream?: MediaStream | null;
  isVideoConnected?: boolean;
  isLocalCameraOff?: boolean;
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
  isVideoConnected = false,
  isLocalCameraOff = false
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'system', text: 'Class session started' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);

  // Attach screen share stream to video element
  useEffect(() => {
    if (screenShareVideoRef.current && screenShareStream) {
      screenShareVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  // Attach local media stream to teacher video element
  useEffect(() => {
    if (teacherVideoRef.current && localStream) {
      teacherVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { sender: 'teacher', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      {/* Video Containers */}
      <div className="p-3 space-y-3">
        {/* Screen Share Preview (if active) */}
        {isScreenSharing && screenShareStream && (
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-indigo-500/50">
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
        <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden border-2 border-primary/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
            {studentName}
          </div>
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        {/* Teacher Video Container (smaller) */}
        <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden border border-gray-700 w-2/3">
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
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          )}
          <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white">
            You
          </div>
        </div>
      </div>

      {/* Interaction Tools Grid */}
      <div className="px-3 py-2">
        <InteractionToolsGrid
          onGiveStar={onGiveStar}
          onOpenTimer={onOpenTimer}
          onRollDice={onRollDice}
          onSendSticker={onSendSticker}
          studentCanDraw={studentCanDraw}
          onToggleStudentDrawing={onToggleStudentDrawing}
          onShareScreen={onShareScreen}
          onEmbedLink={onEmbedLink}
          isScreenSharing={isScreenSharing}
          onStopScreenShare={onStopScreenShare}
        />
      </div>

      {/* Mini Chat Box */}
      <div className="flex-1 flex flex-col border-t border-gray-800 mt-2">
        <div className="px-3 py-2 border-b border-gray-800">
          <span className="text-xs font-medium text-gray-400 uppercase">Chat</span>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-2">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`text-xs rounded px-2 py-1 ${
                  msg.sender === 'teacher' 
                    ? 'bg-primary/20 text-primary-foreground ml-4' 
                    : msg.sender === 'system'
                    ? 'bg-gray-800 text-gray-500 text-center italic'
                    : 'bg-gray-800 text-gray-300 mr-4'
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
        <div className="p-2 border-t border-gray-800">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="text-xs bg-gray-800 border-gray-700 h-8"
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
