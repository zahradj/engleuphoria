
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Trophy, 
  BookOpen, 
  Star,
  Clock,
  Target,
  Award,
  TrendingUp
} from "lucide-react";

interface UnifiedRightPanelProps {
  studentName: string;
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
}

export function UnifiedRightPanel({
  studentName,
  studentXP,
  activeRightTab,
  onTabChange,
  currentUser
}: UnifiedRightPanelProps) {
  const isTeacher = currentUser.role === 'teacher';
  const currentLevel = Math.floor(studentXP / 500) + 1;
  const xpInCurrentLevel = studentXP % 500;
  const progressPercentage = (xpInCurrentLevel / 500) * 100;

  return (
    <Card className="h-full">
      <Tabs value={activeRightTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">
                {isTeacher ? studentName : currentUser.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                Level {currentLevel}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-blue-600">
                {studentXP} XP
              </div>
              <div className="text-xs text-gray-500">
                {500 - xpInCurrentLevel} to next level
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Level {currentLevel}</span>
              <span>Level {currentLevel + 1}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <TabsList className="grid w-full grid-cols-3 m-0 rounded-none">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-1">
            <Trophy size={14} />
            <span className="hidden sm:inline">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-1">
            <TrendingUp size={14} />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full p-4">
            <div className="h-full flex flex-col">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle size={16} />
                Class Chat
              </h4>
              <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-100 p-2 rounded">
                    <span className="font-medium">Teacher:</span> Welcome to today's lesson!
                  </div>
                  <div className="bg-green-100 p-2 rounded">
                    <span className="font-medium">Student:</span> Thank you! I'm excited to learn.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <Button size="sm">Send</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="h-full p-4">
            <div className="h-full flex flex-col">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy size={16} />
                Recent Rewards
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Star className="text-yellow-500" size={20} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Perfect Pronunciation!</div>
                    <div className="text-xs text-gray-600">+25 XP</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">2 min ago</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="text-blue-500" size={20} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Quick Learner</div>
                    <div className="text-xs text-gray-600">+15 XP</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">5 min ago</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Target className="text-green-500" size={20} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Lesson Complete</div>
                    <div className="text-xs text-gray-600">+50 XP</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">1 hour ago</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="h-full p-4">
            <div className="h-full flex flex-col">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                Learning Progress
              </h4>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Speaking Skills</span>
                    <span className="text-xs text-gray-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Vocabulary</span>
                    <span className="text-xs text-gray-600">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Grammar</span>
                    <span className="text-xs text-gray-600">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Reading</span>
                    <span className="text-xs text-gray-600">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-600" />
                    <span className="text-sm font-medium">Study Time</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">4h 32m</div>
                  <div className="text-xs text-gray-600">This week</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
