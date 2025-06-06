
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
    <Card className="h-full shadow-lg flex flex-col">
      {/* Student Video - Now shows actual video feed status */}
      <div className="p-4 border-b">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">{studentName}</h3>
          <Badge className="bg-yellow-100 text-yellow-700">
            {Math.floor(studentXP / 100)} Level
          </Badge>
        </div>
        
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-2">
              <span className="text-purple-700 font-semibold">E</span>
            </div>
            <span className="text-purple-700 font-medium">Student Video</span>
            <p className="text-xs text-purple-600 mt-1">Join video call to see live feed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b p-2">
        <div className="flex gap-1">
          <Button
            variant={activeRightTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("chat")}
          >
            <MessageCircle size={14} className="mr-1" />
            Chat
          </Button>
          <Button
            variant={activeRightTab === "homework" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("homework")}
          >
            <BookOpen size={14} className="mr-1" />
            Tasks
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-3 overflow-hidden">
        {activeRightTab === "chat" && <OneOnOneChat />}
        {activeRightTab === "homework" && <OneOnOneHomework />}
      </div>
    </Card>
  );
}
