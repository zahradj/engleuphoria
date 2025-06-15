
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Gamepad2, 
  Sparkles, 
  Link,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users
} from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { EnhancedAIAssistant } from "@/components/classroom/oneonone/ai/EnhancedAIAssistant";

interface CenterTab {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  badge?: string;
}

interface EnhancedCenterPanelProps {
  activeCenterTab: string;
  currentPage: number;
  onTabChange: (tab: string) => void;
}

export function EnhancedCenterPanel({ 
  activeCenterTab, 
  currentPage, 
  onTabChange 
}: EnhancedCenterPanelProps) {
  const centerTabs: CenterTab[] = [
    { id: "whiteboard", label: "Whiteboard", icon: PenTool, color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "activities", label: "Activities", icon: Gamepad2, color: "text-purple-600", bgColor: "bg-purple-50" },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: "New", color: "text-orange-600", bgColor: "bg-orange-50" },
    { id: "resources", label: "Resources", icon: Link, color: "text-green-600", bgColor: "bg-green-50" }
  ];

  return (
    <Card className="h-full bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
      {/* Enhanced Learning Center Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 border-b border-white/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-4 h-16 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full blur-sm opacity-50"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interactive Learning Hub
              </h2>
              <p className="text-sm text-gray-600 font-medium flex items-center gap-2 mt-1">
                <Users size={14} />
                Collaborative Educational Space
              </p>
            </div>
          </div>
          
          {/* Enhanced Page Navigation */}
          <div className="flex items-center gap-3 bg-white/90 rounded-xl p-3 backdrop-blur-sm shadow-lg">
            <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
              <ChevronLeft size={16} />
            </Button>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-bold shadow-md">
              Page {currentPage}
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        {/* Enhanced Tab Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {centerTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeCenterTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-2 p-4 h-auto rounded-xl transition-all duration-300 font-medium relative group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border-2 border-white' 
                    : `text-gray-600 hover:${tab.bgColor} hover:${tab.color} hover:shadow-lg hover:scale-102 bg-white/60`
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent size={20} />
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 animate-pulse px-2 py-0.5">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-center leading-tight">{tab.label}</span>
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Tab Content */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50/50 to-blue-50/30">
        {activeCenterTab === "whiteboard" && (
          <div className="h-full p-6">
            <div className="h-full bg-white rounded-2xl shadow-inner border-2 border-gray-100 overflow-hidden relative">
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-gray-600">Digital Whiteboard</span>
              </div>
              <OneOnOneWhiteboard />
            </div>
          </div>
        )}
        {activeCenterTab === "activities" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <OneOnOneGames />
            </div>
          </div>
        )}
        {activeCenterTab === "ai" && (
          <div className="h-full p-6 overflow-y-auto bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
            <div className="max-w-4xl mx-auto">
              <EnhancedAIAssistant
                studentProfile={{
                  level: "Intermediate",
                  weaknesses: ["Past tense", "Pronunciation"],
                  recentTopics: ["Animals", "Daily routine"],
                  interests: ["Sports", "Music"]
                }}
                onContentGenerated={(content, type) => console.log('Generated:', content, type)}
                onInsertToWhiteboard={(content) => console.log('Insert:', content)}
              />
            </div>
          </div>
        )}
        {activeCenterTab === "resources" && (
          <div className="h-full p-6 flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
            <div className="text-center max-w-md">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <BookOpen size={40} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-teal-400 rounded-2xl blur-xl opacity-30 scale-110"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Educational Resources Hub</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Access a comprehensive library of curated learning materials, interactive content, and educational resources tailored to enhance your learning experience.
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 px-8 py-3 rounded-xl">
                <BookOpen size={18} className="mr-2" />
                Explore Resources
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
