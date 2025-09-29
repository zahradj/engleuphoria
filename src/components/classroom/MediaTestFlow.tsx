import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Camera, Mic } from 'lucide-react';
import MediaTestPage from '@/pages/MediaTestPage';

interface MediaTestFlowProps {
  roomId: string;
  role: string;
  name: string;
  userId: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function MediaTestFlow({ 
  roomId, 
  role, 
  name, 
  userId, 
  onComplete,
  onSkip 
}: MediaTestFlowProps) {
  const [showFullTest, setShowFullTest] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  if (showFullTest) {
    return (
      <div className="min-h-screen">
        <MediaTestPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Media Check Required
          </h1>
          <p className="text-gray-600">
            Before joining the classroom, let's test your camera and microphone
          </p>
          <Badge variant="outline" className="mt-3">
            {role === 'teacher' ? 'Teacher' : 'Student'}: {name}
          </Badge>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Camera className="h-5 w-5 text-blue-600" />
            <span className="text-sm">Camera Access</span>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Mic className="h-5 w-5 text-blue-600" />
            <span className="text-sm">Microphone Access</span>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => setShowFullTest(true)}
            className="w-full"
          >
            Start Media Test
          </Button>
          
          {onSkip && (
            <Button 
              variant="outline" 
              onClick={onSkip}
              className="w-full"
            >
              Skip Test (Not Recommended)
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          The media test ensures the best experience for everyone in the classroom
        </p>
      </Card>
    </div>
  );
}