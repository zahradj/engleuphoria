
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Users, 
  FileText, 
  Download,
  BarChart3,
  Trophy,
  Target
} from 'lucide-react';

interface SessionData {
  id: string;
  startTime: Date;
  duration: number;
  participants: string[];
  activities: string[];
  goals: string[];
  achievements: number;
}

interface EnhancedSessionManagerProps {
  currentUser: any;
  enhancedClassroom: any;
  onSessionEnd?: (sessionData: SessionData) => void;
}

export function EnhancedSessionManager({
  currentUser,
  enhancedClassroom,
  onSessionEnd
}: EnhancedSessionManagerProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionGoals, setSessionGoals] = useState<string[]>([
    'Practice pronunciation',
    'Learn 5 new vocabulary words',
    'Complete grammar exercise'
  ]);
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');

  const isTeacher = currentUser.role === 'teacher';

  useEffect(() => {
    if (enhancedClassroom.isConnected && !sessionActive) {
      startSession();
    }
  }, [enhancedClassroom.isConnected]);

  const startSession = () => {
    const newSession: SessionData = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      participants: [currentUser.name],
      activities: [],
      goals: sessionGoals,
      achievements: 0
    };

    setSessionData(newSession);
    setSessionActive(true);
  };

  const endSession = () => {
    if (sessionData && onSessionEnd) {
      const finalSession = {
        ...sessionData,
        duration: Date.now() - sessionData.startTime.getTime(),
        achievements: completedGoals.length
      };
      onSessionEnd(finalSession);
    }

    setSessionActive(false);
    setSessionData(null);
    setCompletedGoals([]);
  };

  const toggleGoalCompletion = (goal: string) => {
    setCompletedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const addActivity = (activity: string) => {
    if (sessionData) {
      setSessionData(prev => prev ? {
        ...prev,
        activities: [...prev.activities, activity]
      } : null);
    }
  };

  const getSessionDuration = () => {
    if (!sessionData) return 0;
    return Math.floor((Date.now() - sessionData.startTime.getTime()) / 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (completedGoals.length / sessionGoals.length) * 100;

  return (
    <Card className="p-4 space-y-4">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${sessionActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          <h3 className="font-semibold">
            {sessionActive ? 'Session Active' : 'Session Inactive'}
          </h3>
          {sessionActive && (
            <Badge variant="secondary">
              <Clock size={12} className="mr-1" />
              {formatDuration(getSessionDuration())}
            </Badge>
          )}
        </div>

        {isTeacher && (
          <div className="flex gap-2">
            {!sessionActive ? (
              <Button onClick={startSession} size="sm">
                <Play size={14} className="mr-1" />
                Start
              </Button>
            ) : (
              <Button onClick={endSession} variant="destructive" size="sm">
                <Square size={14} className="mr-1" />
                End
              </Button>
            )}
          </div>
        )}
      </div>

      {sessionActive && sessionData && (
        <>
          {/* Session Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lesson Progress</span>
              <span className="text-sm text-gray-500">
                {completedGoals.length}/{sessionGoals.length} goals
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Session Goals */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Target size={14} />
              Today's Goals
            </h4>
            <div className="space-y-2">
              {sessionGoals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleGoalCompletion(goal)}
                    className={`w-4 h-4 p-0 ${
                      completedGoals.includes(goal) 
                        ? 'bg-green-500 text-white border-green-500' 
                        : ''
                    }`}
                  >
                    {completedGoals.includes(goal) && '✓'}
                  </Button>
                  <span className={`text-sm ${
                    completedGoals.includes(goal) 
                      ? 'line-through text-gray-500' 
                      : ''
                  }`}>
                    {goal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addActivity('Vocabulary Practice')}
              className="text-xs"
            >
              <FileText size={12} className="mr-1" />
              Log Activity
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Generate summary')}
              className="text-xs"
            >
              <BarChart3 size={12} className="mr-1" />
              Summary
            </Button>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {enhancedClassroom.participants.length + 1}
              </div>
              <div className="text-xs text-gray-500">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {sessionData.activities.length}
              </div>
              <div className="text-xs text-gray-500">Activities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {completedGoals.length}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        </>
      )}

      {/* Session History */}
      {!sessionActive && (
        <div className="text-center py-6 text-gray-500">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No active session</p>
          {isTeacher && (
            <p className="text-xs mt-1">Start a session to begin tracking progress</p>
          )}
        </div>
      )}
    </Card>
  );
}
