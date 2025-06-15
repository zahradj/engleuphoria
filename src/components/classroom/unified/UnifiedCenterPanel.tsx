
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Gamepad2, Sparkles, Link, ChevronLeft, ChevronRight } from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { EnhancedAIAssistant } from "@/components/classroom/oneonone/ai/EnhancedAIAssistant";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedCenterPanelProps {
  activeCenterTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
}

export function UnifiedCenterPanel({ 
  activeCenterTab, 
  onTabChange, 
  currentUser 
}: UnifiedCenterPanelProps) {
  const isTeacher = currentUser.role === 'teacher';
  
  const tabs = [
    { 
      id: "whiteboard", 
      label: "Whiteboard", 
      icon: PenTool, 
      color: "text-blue-600"
    },
    { 
      id: "games", 
      label: "Activities", 
      icon: Gamepad2, 
      color: "text-green-600"
    },
    { 
      id: "ai", 
      label: "AI Assistant", 
      icon: Sparkles, 
      color: "text-purple-600",
      badge: isTeacher ? "Full Access" : "Limited"
    },
    { 
      id: "resources", 
      label: "Resources", 
      icon: Link, 
      color: "text-orange-600"
    }
  ];

  const studentProfile = {
    level: "Intermediate",
    weaknesses: ["Past tense", "Pronunciation"],
    recentTopics: ["Animals", "Daily routine", "Food"],
    interests: ["Sports", "Music", "Travel"]
  };

  const handleContentGenerated = (content: string, type: string) => {
    console.log('Generated content:', { content, type, userRole: currentUser.role });
  };

  const handleInsertToWhiteboard = (content: string) => {
    console.log('Inserting to whiteboard:', content);
  };

  return (
    <Card className="shadow-lg flex flex-col h-full overflow-hidden bg-white">
      {/* Enhanced Tab Navigation - Fixed Header */}
      <div className="flex-shrink-0 border-b bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Learning Center</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-gray-600">Page 1</span>
              <Button variant="ghost" size="sm">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeCenterTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0 h-5 ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Tab Content - Takes remaining height */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            {activeCenterTab === "whiteboard" && (
              <OneOnOneWhiteboard />
            )}
            
            {activeCenterTab === "games" && (
              <OneOnOneGames />
            )}
            
            {activeCenterTab === "ai" && (
              <EnhancedAIAssistant
                studentProfile={studentProfile}
                onContentGenerated={handleContentGenerated}
                onInsertToWhiteboard={handleInsertToWhiteboard}
              />
            )}
            
            {activeCenterTab === "resources" && (
              <div className="text-center text-gray-500 mt-8">
                <Link size={32} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Educational Resources</h3>
                <p className="text-sm mb-4">
                  {isTeacher 
                    ? "Upload and manage educational materials for your students."
                    : "Access educational links and materials from your teacher."
                  }
                </p>
                <Button variant="outline" className="mt-4">
                  {isTeacher ? "Upload Resources" : "Browse Resources"}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
