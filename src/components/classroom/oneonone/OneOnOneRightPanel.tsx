
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen } from "lucide-react";
import { OneOnOneChat } from "./OneOnOneChat";
import { OneOnOneHomework } from "./OneOnOneHomework";

interface OneOnOneRightPanelProps {
  studentName: string;
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
}

export function OneOnOneRightPanel({
  studentName,
  studentXP,
  activeRightTab,
  onTabChange
}: OneOnOneRightPanelProps) {
  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Student Info Header - Fixed height */}
      <div className="p-3 border-b bg-gradient-to-r from-purple-50 to-purple-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700 text-sm">{studentName}</h3>
          <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">
            Level {Math.floor(studentXP / 100)}
          </Badge>
        </div>
        
        {/* Compact student video placeholder */}
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-md flex items-center justify-center relative max-h-24">
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mb-1">
              <span className="text-purple-700 font-semibold text-xs">E</span>
            </div>
            <span className="text-purple-700 font-medium text-xs">Student</span>
          </div>
          
          {/* Connection status indicator */}
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
        
        {/* XP Progress */}
        <div className="mt-2">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>XP Progress</span>
            <span>{studentXP % 100}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(studentXP % 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Fixed height */}
      <div className="border-b p-2 flex-shrink-0">
        <div className="flex gap-1">
          <Button
            variant={activeRightTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("chat")}
            className="text-xs px-3 py-1"
          >
            <MessageCircle size={12} className="mr-1" />
            Chat
          </Button>
          <Button
            variant={activeRightTab === "homework" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("homework")}
            className="text-xs px-3 py-1"
          >
            <BookOpen size={12} className="mr-1" />
            Tasks
          </Button>
        </div>
      </div>

      {/* Tab Content - Flexible height */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-3">
          {activeRightTab === "chat" && <OneOnOneChat />}
          {activeRightTab === "homework" && <OneOnOneHomework />}
        </div>
      </div>
    </Card>
  );
}
