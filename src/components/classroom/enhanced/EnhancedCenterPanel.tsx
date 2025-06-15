
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Gamepad2, 
  Sparkles, 
  Link,
  BookOpen
} from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { EnhancedAIAssistant } from "@/components/classroom/oneonone/ai/EnhancedAIAssistant";

interface CenterTab {
  id: string;
  label: string;
  icon: any;
  color: string;
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
    { id: "whiteboard", label: "Whiteboard", icon: PenTool, color: "text-blue-600" },
    { id: "activities", label: "Activities", icon: Gamepad2, color: "text-purple-600" },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: "New", color: "text-orange-600" },
    { id: "resources", label: "Resources", icon: Link, color: "text-green-600" }
  ];

  return (
    <Card className="h-full bg-white shadow-md flex flex-col">
      {/* Simplified Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Learning Center</h2>
          <Badge variant="outline" className="text-sm">
            Page {currentPage}
          </Badge>
        </div>
        
        {/* Clean Tab Navigation */}
        <div className="grid grid-cols-4 gap-2">
          {centerTabs.map((tab) => {
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
                    ? 'bg-blue-500 text-white shadow-md' 
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

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeCenterTab === "whiteboard" && (
          <div className="h-full p-4">
            <div className="h-full bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
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
          <div className="h-full p-4 flex items-center justify-center">
            <div className="text-center max-w-md">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Educational Resources</h3>
              <p className="text-gray-600 mb-6">
                Access learning materials and educational content.
              </p>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Browse Resources
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
