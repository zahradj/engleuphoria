
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { BookOpen, Users, Gamepad2, Link } from "lucide-react";

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
  const isTeacher = currentUser.role === 'teacher';

  return (
    <Card className="h-full shadow-lg border-0 bg-white/95 backdrop-blur-sm flex flex-col">
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="p-4 pb-0 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="lesson" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="embedded" className="flex items-center gap-2">
              <Link size={16} />
              <span className="hidden sm:inline">Embedded</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Collaborate</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="lesson" className="h-full m-0 p-4 overflow-y-auto">
            <UnifiedContentViewer 
              isTeacher={isTeacher}
              studentName={currentUser.name}
            />
          </TabsContent>

          <TabsContent value="activities" className="h-full m-0 p-4 overflow-y-auto">
            <OneOnOneGames />
          </TabsContent>

          <TabsContent value="embedded" className="h-full m-0 p-4 overflow-y-auto">
            <div className="h-full">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Embedded Content</h3>
                <p className="text-gray-600 text-sm">
                  Websites and educational content embedded directly in the classroom. 
                  {isTeacher ? " Add content using the whiteboard or embedded content tab." : " Your teacher can embed content for interactive lessons."}
                </p>
              </div>
              <UnifiedContentViewer 
                isTeacher={isTeacher}
                studentName={currentUser.name}
              />
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="h-full m-0 p-4 overflow-y-auto">
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
