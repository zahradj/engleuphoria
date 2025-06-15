
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Gamepad2, Sparkles, Link, BookOpen, Upload } from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { EnhancedAIAssistant } from "@/components/classroom/oneonone/ai/EnhancedAIAssistant";
import { EnhancedWhiteboard } from "../enhanced/EnhancedWhiteboard";

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
    { id: "whiteboard", label: "Whiteboard", icon: PenTool, description: "Collaborative drawing board" },
    { id: "games", label: "Activities", icon: Gamepad2, description: "Interactive learning games" },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: isTeacher ? "Full" : "Student", description: "AI-powered learning help" },
    { id: "materials", label: "Materials", icon: Upload, description: "Upload and view content" },
    { id: "resources", label: "Resources", icon: Link, description: "Educational links & tools" }
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

  const handleContentSave = (content: string) => {
    console.log('Saving whiteboard content:', content);
  };

  return (
    <Card className="shadow-lg border-gray-200 h-full flex flex-col">
      {/* Enhanced Tab Navigation */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
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
                    ? 'bg-white text-blue-700 shadow-md scale-105' 
                    : 'bg-white/40 text-gray-600 hover:bg-white/70 hover:scale-102'
                }`}
                title={tab.description}
              >
                <div className="flex items-center gap-2">
                  <IconComponent size={16} />
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs px-2 py-0 h-4">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="font-medium text-xs text-center leading-tight">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 h-full">
            {activeCenterTab === "whiteboard" && (
              <div className="h-full">
                <EnhancedWhiteboard
                  isCollaborative={true}
                  currentUser={currentUser}
                  onContentSave={handleContentSave}
                />
              </div>
            )}
            
            {activeCenterTab === "games" && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm h-full">
                <OneOnOneGames />
              </div>
            )}
            
            {activeCenterTab === "ai" && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm h-full">
                <EnhancedAIAssistant
                  studentProfile={studentProfile}
                  onContentGenerated={handleContentGenerated}
                  onInsertToWhiteboard={handleInsertToWhiteboard}
                />
              </div>
            )}

            {activeCenterTab === "materials" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Upload size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Materials</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {isTeacher ? "Upload lesson materials for students" : "View shared lesson materials"}
                </p>
                <div className="space-y-3">
                  <Button className="bg-blue-500 text-white shadow-sm hover:bg-blue-600 px-6 py-2 rounded-lg">
                    <Upload size={16} className="mr-2" />
                    {isTeacher ? "Upload File" : "Browse Materials"}
                  </Button>
                  <div className="text-xs text-gray-500">
                    Supports: PDF, Images, Videos, Audio
                  </div>
                </div>
              </div>
            )}
            
            {activeCenterTab === "resources" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BookOpen size={24} className="text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Educational Resources</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {isTeacher ? "Manage educational materials and links" : "Access learning resources and tools"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <BookOpen size={20} className="mb-2 text-orange-600" />
                    <span className="text-sm">Dictionary</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Link size={20} className="mb-2 text-blue-600" />
                    <span className="text-sm">Web Links</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
