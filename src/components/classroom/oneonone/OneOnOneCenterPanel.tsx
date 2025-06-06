
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Star, Gamepad2 } from "lucide-react";
import { OneOnOneWhiteboard } from "./OneOnOneWhiteboard";
import { OneOnOneAIAssistant } from "./OneOnOneAIAssistant";
import { OneOnOneGames } from "./OneOnOneGames";

interface OneOnOneCenterPanelProps {
  activeCenterTab: string;
  onTabChange: (tab: string) => void;
}

export function OneOnOneCenterPanel({
  activeCenterTab,
  onTabChange
}: OneOnOneCenterPanelProps) {
  return (
    <Card className="h-full shadow-lg">
      <div className="border-b p-3">
        <div className="flex gap-1">
          <Button
            variant={activeCenterTab === "whiteboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("whiteboard")}
          >
            <FileText size={16} className="mr-1" />
            Whiteboard
          </Button>
          <Button
            variant={activeCenterTab === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("ai")}
          >
            <Star size={16} className="mr-1" />
            AI Assistant
          </Button>
          <Button
            variant={activeCenterTab === "games" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("games")}
          >
            <Gamepad2 size={16} className="mr-1" />
            Activities
          </Button>
        </div>
      </div>
      
      <div className="p-4 h-[calc(100%-80px)]">
        {activeCenterTab === "whiteboard" && <OneOnOneWhiteboard />}
        {activeCenterTab === "ai" && <OneOnOneAIAssistant />}
        {activeCenterTab === "games" && <OneOnOneGames />}
      </div>
    </Card>
  );
}
