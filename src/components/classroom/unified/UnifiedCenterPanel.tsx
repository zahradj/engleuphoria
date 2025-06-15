import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InfiniteWhiteboard } from "@/components/classroom/whiteboard/InfiniteWhiteboard";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { Palette, BookOpen, Users, Gamepad2 } from "lucide-react";

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
  const [whiteboardTool, setWhiteboardTool] = useState("pencil");
  const [whiteboardColor, setWhiteboardColor] = useState("#9B87F5");

  const isTeacher = currentUser.role === 'teacher';

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Handle whiteboard interactions
    console.log("Canvas clicked", e);
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="whiteboard" className="flex items-center gap-2">
              <Palette size={16} />
              <span className="hidden sm:inline">Whiteboard</span>
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
          <TabsContent value="whiteboard" className="h-full mt-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">Interactive Whiteboard</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Extended Canvas
                  </Badge>
                </div>
                {isTeacher && (
                  <Badge variant="outline" className="text-xs">
                    Teacher Mode
                  </Badge>
                )}
              </div>
              
              <div className="flex-1">
                <InfiniteWhiteboard
                  activeTool={whiteboardTool}
                  color={whiteboardColor}
                  onCanvasClick={handleCanvasClick}
                />
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
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Gamepad2 size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Interactive Activities</h3>
                <p className="text-gray-600">Educational games and activities coming soon!</p>
              </div>
            </div>
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
