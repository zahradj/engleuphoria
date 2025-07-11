import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { useAITutor } from '@/hooks/useAITutor';

interface AITutorInterfaceProps {
  studentId: string;
  cefrLevel: string;
  onSessionComplete?: () => void;
}

export const AITutorInterface: React.FC<AITutorInterfaceProps> = ({
  studentId, cefrLevel, onSessionComplete
}) => {
  const [message, setMessage] = useState('');
  const { currentSession, messages, isConnected, isProcessing, startSession, sendMessage } = useAITutor();

  const handleStart = () => startSession(studentId, cefrLevel);
  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Tutor Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={handleStart}>Start AI Tutoring Session</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-lg ${
                  msg.message_type.includes('user') ? 'bg-primary text-primary-foreground ml-8' : 'bg-muted mr-8'
                }`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} disabled={isProcessing}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};