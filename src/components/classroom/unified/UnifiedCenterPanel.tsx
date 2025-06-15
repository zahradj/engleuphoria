
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Gamepad2, Sparkles, Link, BookOpen } from "lucide-react";
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
    { id: "whiteboard", label: "Whiteboard", icon: PenTool },
    { id: "games", label: "Activities", icon: Gamepad2 },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: isTeacher ? "Full" : "Student" },
    { id: "resources", label: "Resources", icon: Link }
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
    <Card className="shadow-lg border-gray-200 min-h-[600px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50/50 p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeCenterTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`h-auto p-3 flex flex-col items-center gap-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent size={16} />
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs px-2 py-0 h-4">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="font-medium text-xs">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="p-4">
            {activeCenterTab === "whiteboard" && (
              <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                <OneOnOneWhiteboard />
              </div>
            )}
            
            {activeCenterTab === "games" && (
              <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                <OneOnOneGames />
              </div>
            )}
            
            {activeCenterTab === "ai" && (
              <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                <EnhancedAIAssistant
                  studentProfile={studentProfile}
                  onContentGenerated={handleContentGenerated}
                  onInsertToWhiteboard={handleInsertToWhiteboard}
                />
              </div>
            )}
            
            {activeCenterTab === "resources" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BookOpen size={24} className="text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Resources</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {isTeacher ? "Manage educational materials" : "Browse learning resources"}
                </p>
                <Button className="bg-orange-500 text-white shadow-sm hover:bg-orange-600 px-6 py-2 rounded-lg">
                  {isTeacher ? "Manage" : "Browse"}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
