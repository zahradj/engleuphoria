
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Gamepad2, Palette } from "lucide-react";
import { OneOnOneWhiteboard } from "./OneOnOneWhiteboard";
import { EnhancedOneOnOneWhiteboard } from "./EnhancedOneOnOneWhiteboard";
import { OneOnOneGames } from "./OneOnOneGames";
import { OneOnOneHomework } from "./OneOnOneHomework";

interface OneOnOneCenterPanelProps {
  activeCenterTab: string;
  onTabChange: (tab: string) => void;
  currentUser?: {
    role: 'teacher' | 'student';
    name: string;
  };
  onAwardStar?: () => void;
  onAwardTask?: (type: 'WORKSHEET' | 'VOCABULARY' | 'SPEAKING_PRACTICE') => void;
}

export function OneOnOneCenterPanel({ 
  activeCenterTab, 
  onTabChange,
  currentUser = { role: 'teacher', name: 'Teacher' },
  onAwardStar,
  onAwardTask
}: OneOnOneCenterPanelProps) {
  return (
    <Card className="h-full flex flex-col">
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none rounded-t-lg">
          <TabsTrigger value="whiteboard" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Whiteboard</span>
          </TabsTrigger>
          <TabsTrigger value="homework" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Materials</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 size={16} />
            <span className="hidden sm:inline">Games</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboard" className="flex-1 m-0 p-4">
          <EnhancedOneOnOneWhiteboard 
            currentUser={currentUser}
            onAwardStar={onAwardStar}
            onAwardTask={onAwardTask}
          />
        </TabsContent>

        <TabsContent value="homework" className="flex-1 m-0 p-4">
          <OneOnOneHomework />
        </TabsContent>

        <TabsContent value="games" className="flex-1 m-0 p-4">
          <OneOnOneGames />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
