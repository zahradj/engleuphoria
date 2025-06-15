
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
    { id: "whiteboard", label: "Whiteboard", icon: PenTool, gradient: "from-blue-500 to-cyan-500" },
    { id: "games", label: "Activities", icon: Gamepad2, gradient: "from-emerald-500 to-green-500" },
    { id: "ai", label: "AI Assistant", icon: Sparkles, gradient: "from-purple-500 to-violet-500", badge: isTeacher ? "Full" : "Student" },
    { id: "resources", label: "Resources", icon: Link, gradient: "from-orange-500 to-amber-500" }
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
    <Card className="shadow-xl flex flex-col h-full overflow-hidden glass-enhanced backdrop-blur-xl border-0">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 border-b border-white/30 bg-white/20 backdrop-blur-xl">
        <div className="p-4">
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
                  className={`h-auto p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg` 
                      : `bg-white/60 text-gray-700 hover:bg-white/80 shadow-sm`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent size={18} />
                    {tab.badge && (
                      <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                        {tab.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium text-sm">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            {activeCenterTab === "whiteboard" && (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-white/40 shadow-lg">
                <OneOnOneWhiteboard />
              </div>
            )}
            
            {activeCenterTab === "games" && (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-white/40 shadow-lg">
                <OneOnOneGames />
              </div>
            )}
            
            {activeCenterTab === "ai" && (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-white/40 shadow-lg">
                <EnhancedAIAssistant
                  studentProfile={studentProfile}
                  onContentGenerated={handleContentGenerated}
                  onInsertToWhiteboard={handleInsertToWhiteboard}
                />
              </div>
            )}
            
            {activeCenterTab === "resources" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen size={24} className="text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Resources</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {isTeacher ? "Manage educational materials" : "Browse learning resources"}
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl">
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
