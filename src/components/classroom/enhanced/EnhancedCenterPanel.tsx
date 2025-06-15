
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  Gamepad2, 
  FileText, 
  Video,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";

interface EnhancedCenterPanelProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  userRole: 'teacher' | 'student';
}

export function EnhancedCenterPanel({
  currentPage,
  totalPages,
  onPageChange,
  userRole
}: EnhancedCenterPanelProps) {
  const [activeTab, setActiveTab] = useState("whiteboard");

  const tabs = [
    {
      id: "whiteboard",
      label: "Whiteboard",
      icon: PenTool,
      color: "text-blue-600",
      description: "Interactive drawing board"
    },
    {
      id: "games",
      label: "Activities", 
      icon: Gamepad2,
      color: "text-green-600",
      description: "Learning games"
    },
    {
      id: "materials",
      label: "Materials",
      icon: FileText,
      color: "text-purple-600", 
      description: "Lesson content"
    },
    {
      id: "video",
      label: "Video",
      icon: Video,
      color: "text-red-600",
      description: "Video lessons"
    }
  ];

  return (
    <Card className="h-full bg-white/95 backdrop-blur-sm border-white/30 shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-slate-100 to-blue-100 p-4 border-b border-white/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">Learning Space</h2>
              <Badge className="bg-white/80 text-gray-700 border-0">
                Session Active
              </Badge>
            </div>
            
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="px-3 py-1 bg-white/80 rounded-md text-sm font-medium">
                {currentPage} / {totalPages}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <IconComponent size={16} className={activeTab === tab.id ? "text-blue-600" : tab.color} />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="whiteboard" className="h-full m-0 p-4">
              <div className="h-full rounded-xl overflow-hidden bg-white shadow-inner border border-gray-200">
                <OneOnOneWhiteboard />
              </div>
            </TabsContent>

            <TabsContent value="games" className="h-full m-0 p-4 overflow-y-auto">
              <OneOnOneGames />
            </TabsContent>

            <TabsContent value="materials" className="h-full m-0 p-4">
              <div className="text-center text-gray-500 mt-12">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Learning Materials</h3>
                <p className="text-sm mb-4">
                  {userRole === 'teacher' 
                    ? "Upload and share materials with your student."
                    : "Access materials shared by your teacher."
                  }
                </p>
                <Button variant="outline" className="mt-4">
                  {userRole === 'teacher' ? "Upload Materials" : "Browse Materials"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="video" className="h-full m-0 p-4">
              <div className="text-center text-gray-500 mt-12">
                <Video size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Video Lessons</h3>
                <p className="text-sm mb-4">
                  Watch educational videos and interactive content.
                </p>
                <Button variant="outline" className="mt-4">
                  Browse Videos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
}
