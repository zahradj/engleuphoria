import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { InteractionToolsGrid } from './InteractionToolsGrid';
import { JitsiMeeting } from '@/components/video';

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
  roomId: string;
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
  isLocalCameraOff = false,
  roomId
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'system', text: 'Class session started' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (screenShareVideoRef.current && screenShareStream) {
      screenShareVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { sender: 'teacher', text: newMessage }]);
      setNewMessage('');
    }
  };

  // Use same room name format as student so both connect to the same Jitsi room
  const jitsiRoomName = `engleuphoria_class_${roomId}`;

  return (
    <div className="w-80 glass-panel border-r border-gray-200/50 flex flex-col shrink-0">
      {/* Video Call */}
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

        {/* Jitsi Video Call - shared room with student */}
        <JitsiMeeting
          roomName={jitsiRoomName}
          displayName={teacherName}
          userRole="teacher"
          className="rounded-lg aspect-[4/3]"
        />
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
