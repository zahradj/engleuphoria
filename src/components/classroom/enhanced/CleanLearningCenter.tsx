
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Gamepad2, 
  Sparkles, 
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { EnhancedAIAssistant } from "@/components/classroom/oneonone/ai/EnhancedAIAssistant";

interface CleanLearningCenterProps {
  activeCenterTab: string;
  currentPage: number;
  onTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
}

export function CleanLearningCenter({ 
  activeCenterTab, 
  currentPage, 
  onTabChange,
  onPageChange 
}: CleanLearningCenterProps) {
  const tabs = [
    { id: "whiteboard", label: "Whiteboard", icon: PenTool },
    { id: "activities", label: "Activities", icon: Gamepad2 },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: "New" },
    { id: "resources", label: "Resources", icon: BookOpen }
  ];

  const studentProfile = {
    level: "Intermediate",
    weaknesses: ["Past tense", "Pronunciation"],
    recentTopics: ["Animals", "Daily routine"],
    interests: ["Sports", "Music"]
  };

  return (
    <Card className="h-full bg-white shadow-sm border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Learning Center</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Badge variant="outline" className="text-sm">
              Page {currentPage}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeCenterTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 p-3 h-auto ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <IconComponent size={16} />
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeCenterTab === "whiteboard" && (
          <div className="h-full p-4">
            <div className="h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <OneOnOneWhiteboard />
            </div>
          </div>
        )}
        {activeCenterTab === "activities" && (
          <div className="h-full p-4 overflow-y-auto">
            <OneOnOneGames />
          </div>
        )}
        {activeCenterTab === "ai" && (
          <div className="h-full p-4 overflow-y-auto">
            <EnhancedAIAssistant
              studentProfile={studentProfile}
              onContentGenerated={(content, type) => console.log('Generated:', content, type)}
              onInsertToWhiteboard={(content) => console.log('Insert:', content)}
            />
          </div>
        )}
        {activeCenterTab === "resources" && (
          <div className="h-full p-4 flex items-center justify-center">
            <div className="text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Resources</h3>
              <p className="text-gray-600 mb-4">Educational materials and links</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Browse Resources
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
