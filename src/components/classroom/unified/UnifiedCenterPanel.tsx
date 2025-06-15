
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Gamepad2, Sparkles, Link, ChevronLeft, ChevronRight, BookOpen, Star, Zap } from "lucide-react";
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
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      bgGradient: "from-blue-50 via-sky-50 to-cyan-50",
      description: "Interactive drawing & collaboration",
      accent: "border-blue-200 shadow-blue-100/50"
    },
    { 
      id: "games", 
      label: "Activities", 
      icon: Gamepad2, 
      gradient: "from-emerald-500 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50 via-green-50 to-teal-50",
      description: "Engaging learning games",
      accent: "border-emerald-200 shadow-emerald-100/50"
    },
    { 
      id: "ai", 
      label: "AI Assistant", 
      icon: Sparkles, 
      gradient: "from-purple-500 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50 via-violet-50 to-indigo-50",
      description: "Smart learning companion",
      badge: isTeacher ? "Full Access" : "Student Mode",
      accent: "border-purple-200 shadow-purple-100/50"
    },
    { 
      id: "resources", 
      label: "Resources", 
      icon: Link, 
      gradient: "from-orange-500 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
      description: "Educational materials & links",
      accent: "border-orange-200 shadow-orange-100/50"
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
    <Card className="shadow-2xl flex flex-col h-full overflow-hidden glass-enhanced backdrop-blur-xl border-0 ring-1 ring-white/20 relative">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/20 pointer-events-none"></div>
      
      {/* Enhanced Tab Navigation Header */}
      <div className="flex-shrink-0 border-b border-white/30 bg-gradient-to-r from-white/40 via-white/20 to-blue-50/40 backdrop-blur-xl relative z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/50">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                {/* Animated ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-60 animate-pulse-gentle"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                  Learning Center
                </h2>
                <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  Interactive workspace for enhanced learning
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 glass rounded-2xl border border-white/40">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-white/50 transition-all">
                <ChevronLeft size={16} className="text-gray-600" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-semibold">1</span>
                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-500">of 4</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-white/50 transition-all">
                <ChevronRight size={16} className="text-gray-600" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeCenterTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`h-auto p-5 flex flex-col items-center gap-3 rounded-2xl transition-all duration-500 hover:scale-105 transform border-2 relative overflow-hidden group ${
                    isActive 
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-2xl ${tab.accent} ring-2 ring-white/40` 
                      : `bg-gradient-to-br ${tab.bgGradient} text-gray-700 hover:bg-white/80 ${tab.accent} shadow-lg hover:shadow-xl`
                  }`}
                >
                  {/* Animated background for inactive tabs */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-white/25 shadow-lg' : 'bg-white/70 group-hover:bg-white'
                    }`}>
                      <IconComponent size={20} className={`${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'} transition-colors`} />
                    </div>
                    {tab.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-3 py-1 h-6 font-semibold transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/25 text-white border-white/40 shadow-lg' 
                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-200 shadow-sm'
                        }`}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {tab.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-center relative z-10">
                    <span className="font-bold text-sm leading-tight block mb-1">{tab.label}</span>
                    <p className={`text-xs leading-tight transition-colors ${
                      isActive ? 'text-white/90' : 'text-gray-500 group-hover:text-gray-600'
                    }`}>
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
      <div className="flex-1 min-h-0 bg-gradient-to-b from-white/20 to-gray-50/30 relative z-10">
        <ScrollArea className="h-full">
          <div className="p-6">
            {activeCenterTab === "whiteboard" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="glass-strong p-5 rounded-2xl border border-blue-200/60 shadow-xl">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <PenTool className="h-5 w-5 text-blue-600" />
                    </div>
                    Interactive Whiteboard
                  </h3>
                  <p className="text-sm text-blue-700/80 leading-relaxed">
                    Collaborate in real-time with advanced drawing tools, shapes, and text annotations
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-white/60 shadow-xl">
                  <OneOnOneWhiteboard />
                </div>
              </div>
            )}
            
            {activeCenterTab === "games" && (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="glass-strong p-5 rounded-2xl border border-emerald-200/60 shadow-xl">
                  <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Gamepad2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    Learning Activities
                  </h3>
                  <p className="text-sm text-emerald-700/80 leading-relaxed">
                    Engage with interactive games designed to reinforce learning concepts
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-white/60 shadow-xl">
                  <OneOnOneGames />
                </div>
              </div>
            )}
            
            {activeCenterTab === "ai" && (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="glass-strong p-5 rounded-2xl border border-purple-200/60 shadow-xl">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    AI Learning Assistant
                  </h3>
                  <p className="text-sm text-purple-700/80 leading-relaxed">
                    {isTeacher 
                      ? "Generate personalized content and get intelligent teaching assistance" 
                      : "Receive personalized help, practice exercises, and learning recommendations"
                    }
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-white/60 shadow-xl">
                  <EnhancedAIAssistant
                    studentProfile={studentProfile}
                    onContentGenerated={handleContentGenerated}
                    onInsertToWhiteboard={handleInsertToWhiteboard}
                  />
                </div>
              </div>
            )}
            
            {activeCenterTab === "resources" && (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="glass-strong p-5 rounded-2xl border border-orange-200/60 shadow-xl">
                  <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Link className="h-5 w-5 text-orange-600" />
                    </div>
                    Educational Resources
                  </h3>
                  <p className="text-sm text-orange-700/80 leading-relaxed">
                    Access curated educational materials, external links, and multimedia content
                  </p>
                </div>
                
                <div className="text-center py-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl ring-4 ring-white/50">
                      <Link size={40} className="text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Resource Library</h3>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                      {isTeacher 
                        ? "Upload and organize educational materials, interactive links, and multimedia resources for your students to access during lessons."
                        : "Explore educational links, downloadable materials, and interactive resources curated by your teacher."
                      }
                    </p>
                    <Button className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-3 rounded-2xl font-semibold">
                      <BookOpen size={18} className="mr-3" />
                      {isTeacher ? "Manage Resources" : "Browse Library"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
