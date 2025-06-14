
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Gamepad2, Sparkles, Link, Target, Shield } from "lucide-react";
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
  
  // Define tabs based on role
  const tabs = [
    { 
      id: "whiteboard", 
      label: "Whiteboard", 
      icon: PenTool, 
      color: "text-blue-600",
      description: "Draw and write together",
      teacherOnly: false
    },
    { 
      id: "games", 
      label: "Activities", 
      icon: Gamepad2, 
      color: "text-green-600",
      description: "Interactive learning games",
      teacherOnly: false
    },
    { 
      id: "ai", 
      label: "AI Assistant", 
      icon: Sparkles, 
      color: "text-purple-600",
      description: "Generate content & get help",
      badge: isTeacher ? "Full Access" : "Limited",
      teacherOnly: false
    },
    { 
      id: "resources", 
      label: "Resources", 
      icon: Link, 
      color: "text-orange-600",
      description: "Educational materials",
      teacherOnly: false
    }
  ];

  // Filter tabs based on role if needed
  const availableTabs = tabs.filter(tab => !tab.teacherOnly || isTeacher);

  // Mock student profile for AI Assistant
  const studentProfile = {
    level: "Intermediate",
    weaknesses: ["Past tense", "Pronunciation"],
    recentTopics: ["Animals", "Daily routine", "Food"],
    interests: ["Sports", "Music", "Travel"]
  };

  const handleContentGenerated = (content: string, type: string) => {
    console.log('Generated content:', { content, type, userRole: currentUser.role });
    // This would integrate with the whiteboard or other components
  };

  const handleInsertToWhiteboard = (content: string) => {
    console.log('Inserting to whiteboard:', content);
    // This would add the content to the whiteboard
  };

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Enhanced Tab Navigation with Role Indicators */}
      <div className="border-b p-3 flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {availableTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeCenterTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`h-auto p-2 flex flex-col items-center justify-center text-xs transition-all duration-200 ${
                  isActive 
                    ? 'bg-white shadow-md scale-105' 
                    : 'hover:bg-white/50 hover:scale-102'
                }`}
                title={tab.description}
              >
                <div className="flex items-center gap-1 mb-1">
                  <IconComponent 
                    size={16} 
                    className={isActive ? 'text-white' : tab.color} 
                  />
                  {tab.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-1 py-0 h-4 ${
                        isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                  {isTeacher && (
                    <Shield size={10} className="text-purple-600" title="Teacher privileges" />
                  )}
                </div>
                <span className="font-medium leading-tight">{tab.label}</span>
                {!isActive && (
                  <span className="text-xs text-gray-500 mt-1 text-center leading-tight">
                    {tab.description}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content with Role-Based Features */}
      <div className="flex-1 overflow-hidden">
        {activeCenterTab === "whiteboard" && (
          <div className="h-full p-4">
            <OneOnOneWhiteboard />
          </div>
        )}
        
        {activeCenterTab === "games" && (
          <div className="h-full p-4">
            <OneOnOneGames />
          </div>
        )}
        
        {activeCenterTab === "ai" && (
          <div className="h-full p-4">
            <EnhancedAIAssistant
              studentProfile={studentProfile}
              onContentGenerated={handleContentGenerated}
              onInsertToWhiteboard={handleInsertToWhiteboard}
            />
          </div>
        )}
        
        {activeCenterTab === "resources" && (
          <div className="h-full p-4">
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
                <Target size={16} className="mr-2" />
                {isTeacher ? "Upload Resources" : "Browse Resources"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
