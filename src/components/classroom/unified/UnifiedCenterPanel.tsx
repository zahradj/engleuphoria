
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Gamepad2, Sparkles, Link, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
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
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      description: "Interactive drawing board"
    },
    { 
      id: "games", 
      label: "Activities", 
      icon: Gamepad2, 
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      description: "Learning games & exercises"
    },
    { 
      id: "ai", 
      label: "AI Assistant", 
      icon: Sparkles, 
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      description: "Smart learning companion",
      badge: isTeacher ? "Full Access" : "Student Mode"
    },
    { 
      id: "resources", 
      label: "Resources", 
      icon: Link, 
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      description: "Educational materials"
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
    <Card className="shadow-2xl flex flex-col h-full overflow-hidden bg-white/90 backdrop-blur-sm border-0 ring-1 ring-black/5">
      {/* Enhanced Tab Navigation Header */}
      <div className="flex-shrink-0 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 via-white/60 to-blue-50/80 backdrop-blur-sm">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Learning Center
                </h2>
                <p className="text-sm text-gray-500 font-medium">Interactive learning workspace</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-gray-200/60 backdrop-blur-sm">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-gray-100/80">
                <ChevronLeft size={14} />
              </Button>
              <span className="text-xs text-gray-600 font-medium px-2">1 of 4</span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-gray-100/80">
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
          
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
                  className={`h-auto p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-300 hover:scale-105 border ${
                    isActive 
                      ? `bg-gradient-to-br ${tab.color} text-white shadow-xl border-white/20 ring-2 ring-white/30` 
                      : `${tab.bgColor} text-gray-700 hover:bg-white/80 border-gray-200/60 shadow-sm hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/60'}`}>
                      <IconComponent size={18} className={isActive ? 'text-white' : 'text-gray-600'} />
                    </div>
                    {tab.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-0.5 h-5 font-medium ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-200'
                        }`}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-sm leading-tight">{tab.label}</span>
                    <p className={`text-xs mt-1 leading-tight ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {tab.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Scrollable Tab Content */}
      <div className="flex-1 min-h-0 bg-gradient-to-b from-white/50 to-gray-50/50">
        <ScrollArea className="h-full">
          <div className="p-6">
            {activeCenterTab === "whiteboard" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Interactive Whiteboard
                  </h3>
                  <p className="text-sm text-blue-700">Draw, write, and collaborate in real-time</p>
                </div>
                <OneOnOneWhiteboard />
              </div>
            )}
            
            {activeCenterTab === "games" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Learning Activities
                  </h3>
                  <p className="text-sm text-emerald-700">Engage with interactive learning games</p>
                </div>
                <OneOnOneGames />
              </div>
            )}
            
            {activeCenterTab === "ai" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Learning Assistant
                  </h3>
                  <p className="text-sm text-purple-700">
                    {isTeacher 
                      ? "Generate content and get teaching assistance" 
                      : "Get personalized help and practice exercises"
                    }
                  </p>
                </div>
                <EnhancedAIAssistant
                  studentProfile={studentProfile}
                  onContentGenerated={handleContentGenerated}
                  onInsertToWhiteboard={handleInsertToWhiteboard}
                />
              </div>
            )}
            
            {activeCenterTab === "resources" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Educational Resources
                  </h3>
                  <p className="text-sm text-orange-700">Access learning materials and external content</p>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Link size={32} className="text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Resource Library</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {isTeacher 
                      ? "Upload and manage educational materials, links, and resources for your students to access during lessons."
                      : "Browse educational links, materials, and resources shared by your teacher."
                    }
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    <BookOpen size={16} className="mr-2" />
                    {isTeacher ? "Manage Resources" : "Browse Library"}
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
