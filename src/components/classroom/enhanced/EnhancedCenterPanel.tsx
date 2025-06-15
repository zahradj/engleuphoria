
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
  ChevronRight
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
    <div className="flex-1">
      <Card className="h-full bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
        {/* Enhanced Learning Center Header */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-white/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Learning Center</h2>
                <p className="text-sm text-gray-600 font-medium">Interactive Educational Space</p>
              </div>
            </div>
            
            {/* Enhanced Page Navigation */}
            <div className="flex items-center gap-3 bg-white/80 rounded-lg p-2 backdrop-blur-sm">
              <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                <ChevronLeft size={16} />
              </Button>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-sm font-bold">
                Page {currentPage}
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          
          {/* Enhanced Tab Navigation */}
          <div className="flex gap-3">
            {centerTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeCenterTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                      : `text-gray-600 hover:${tab.bgColor} hover:${tab.color} hover:shadow-md`
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 animate-pulse">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeCenterTab === "whiteboard" && (
            <div className="h-full p-6">
              <div className="h-full bg-white rounded-xl shadow-inner border border-gray-100 overflow-hidden">
                <OneOnOneWhiteboard />
              </div>
            </div>
          )}
          {activeCenterTab === "activities" && (
            <div className="h-full p-6 overflow-y-auto">
              <OneOnOneGames />
            </div>
          )}
          {activeCenterTab === "ai" && (
            <div className="h-full p-6 overflow-y-auto bg-gradient-to-br from-orange-50 to-yellow-50">
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
          )}
          {activeCenterTab === "resources" && (
            <div className="h-full p-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Link size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Educational Resources</h3>
                <p className="text-gray-600 mb-6">Access curated learning materials and educational links.</p>
                <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg">
                  Browse Resources
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
