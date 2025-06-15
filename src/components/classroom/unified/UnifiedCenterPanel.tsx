
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { AIActivityGenerator } from "@/components/classroom/oneonone/games/AIActivityGenerator";
import { BookOpen, Users, Gamepad2, Brain } from "lucide-react";

interface UnifiedCenterPanelProps {
  activeCenterTab: string;
  onTabChange: (tab: string) => void;
  currentUser: {
    role: 'teacher' | 'student';
    name: string;
  };
}

export function UnifiedCenterPanel({ 
  activeCenterTab, 
  onTabChange, 
  currentUser 
}: UnifiedCenterPanelProps) {
  const [generatedActivities, setGeneratedActivities] = useState<any[]>([]);
  
  const isTeacher = currentUser.role === 'teacher';

  const handleAIActivityGenerated = (activity: any) => {
    setGeneratedActivities([activity, ...generatedActivities]);
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="ai-worksheet" className="flex items-center gap-2">
              <Brain size={16} />
              <span className="hidden sm:inline">AI Worksheet</span>
            </TabsTrigger>
            <TabsTrigger value="lesson" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Collaborate</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-4 pt-0 overflow-hidden">
          <TabsContent value="ai-worksheet" className="h-full mt-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">AI Worksheet & Material Generator</h3>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    AI Powered
                  </Badge>
                </div>
                {isTeacher && (
                  <Badge variant="outline" className="text-xs">
                    Teacher Mode
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <AIActivityGenerator onActivityGenerated={handleAIActivityGenerated} />
                
                {generatedActivities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Generated Materials</h4>
                    <div className="space-y-3">
                      {generatedActivities.map((activity, index) => (
                        <Card key={index} className="p-4 border border-purple-200">
                          <h5 className="font-medium text-purple-800">{activity.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {activity.type}
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lesson" className="h-full mt-0">
            <UnifiedContentViewer 
              isTeacher={isTeacher}
              studentName={currentUser.name}
            />
          </TabsContent>

          <TabsContent value="activities" className="h-full mt-0">
            <OneOnOneGames />
          </TabsContent>

          <TabsContent value="collaboration" className="h-full mt-0">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Collaboration Tools</h3>
                <p className="text-gray-600">Real-time collaboration features coming soon!</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
