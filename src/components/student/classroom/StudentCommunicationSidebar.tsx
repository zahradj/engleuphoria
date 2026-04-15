import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Send, Video, Mic, MicOff, VideoOff } from 'lucide-react';

interface StudentCommunicationSidebarProps {
  studentName: string;
  teacherName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
}

export const StudentCommunicationSidebar: React.FC<StudentCommunicationSidebarProps> = ({
  studentName,
  teacherName,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'system', text: 'Class session started' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { sender: 'student', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-72 glass-panel border-r border-gray-200/50 flex flex-col shrink-0">
      {/* Video Containers */}
      <div className="p-3 space-y-3">
        {/* Teacher Video Container */}
        <Card className="bg-gray-100 border-primary/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">👩‍🏫</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
                {teacherName}
              </div>
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        {/* Student Video Container (self) */}
        <Card className="bg-gray-100 border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
                {studentName} (You)
              </div>
              {/* Camera/Mic Controls */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleMute}
                  className={`h-6 w-6 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'}`}
                >
                  {isMuted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCamera}
                  className={`h-6 w-6 rounded-full ${isCameraOff ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'}`}
                >
                  {isCameraOff ? <VideoOff className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col border-t border-gray-200">
        <div className="px-3 py-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase">Chat</span>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-2">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`text-xs rounded px-2 py-1 ${
                  msg.sender === 'student' 
                    ? 'bg-blue-50 text-blue-800 ml-4' 
                    : msg.sender === 'teacher'
                    ? 'bg-primary/10 text-gray-800 mr-4'
                    : msg.sender === 'system'
                    ? 'bg-gray-100 text-gray-500 text-center italic'
                    : 'bg-gray-100 text-gray-700 mr-4'
                }`}
              >
                {msg.sender !== 'system' && (
                  <span className="font-medium block text-[10px] text-gray-500">
                    {msg.sender === 'student' ? 'You' : teacherName}
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