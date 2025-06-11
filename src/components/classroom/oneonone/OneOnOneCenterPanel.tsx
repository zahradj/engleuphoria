
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Gamepad2, Sparkles, Link, Target } from "lucide-react";
import { OneOnOneWhiteboard } from "./OneOnOneWhiteboard";
import { OneOnOneGames } from "./OneOnOneGames";
import { OneOnOneAIAssistant } from "./OneOnOneAIAssistant";
import { EnhancedAIAssistant } from "./ai/EnhancedAIAssistant";

interface OneOnOneCenterPanelProps {
  activeCenterTab: string;
  onTabChange: (tab: string) => void;
}

export function OneOnOneCenterPanel({ activeCenterTab, onTabChange }: OneOnOneCenterPanelProps) {
  const tabs = [
    { 
      id: "whiteboard", 
      label: "Whiteboard", 
      icon: PenTool, 
      color: "text-blue-600",
      description: "Draw and write together"
    },
    { 
      id: "games", 
      label: "Activities", 
      icon: Gamepad2, 
      color: "text-green-600",
      description: "Interactive learning games"
    },
    { 
      id: "ai", 
      label: "AI Assistant", 
      icon: Sparkles, 
      color: "text-purple-600",
      description: "Generate content & get help",
      badge: "Enhanced"
    },
    { 
      id: "links", 
      label: "Resources", 
      icon: Link, 
      color: "text-orange-600",
      description: "Educational links & materials"
    }
  ];

  // Mock student profile for AI Assistant
  const studentProfile = {
    level: "Intermediate",
    weaknesses: ["Past tense", "Pronunciation"],
    recentTopics: ["Animals", "Daily routine", "Food"],
    interests: ["Sports", "Music", "Travel"]
  };

  const handleContentGenerated = (content: string, type: string) => {
    console.log('Generated content:', { content, type });
    // This would integrate with the whiteboard or other components
  };

  const handleInsertToWhiteboard = (content: string) => {
    console.log('Inserting to whiteboard:', content);
    // This would add the content to the whiteboard
  };

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Enhanced Tab Navigation */}
      <div className="border-b p-3 flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {tabs.map((tab) => {
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
                      className="text-xs px-1 py-0 h-4 bg-yellow-100 text-yellow-700"
                    >
                      {tab.badge}
                    </Badge>
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

      {/* Tab Content */}
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
        
        {activeCenterTab === "links" && (
          <div className="h-full p-4">
            <div className="text-center text-gray-500 mt-8">
              <Link size={32} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Educational Resources</h3>
              <p className="text-sm">
                Access curated educational links and materials for your lessons.
              </p>
              <Button variant="outline" className="mt-4">
                <Target size={16} className="mr-2" />
                Browse Resources
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
