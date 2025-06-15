
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle,
  BookOpen,
  Book
} from "lucide-react";
import { OneOnOneChat } from "@/components/classroom/oneonone/OneOnOneChat";
import { OneOnOneHomework } from "@/components/classroom/oneonone/OneOnOneHomework";
import { EnhancedDictionary } from "@/components/classroom/oneonone/dictionary/EnhancedDictionary";

interface CleanChatInterfaceProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CleanChatInterface({ activeTab, onTabChange }: CleanChatInterfaceProps) {
  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "tasks", label: "Tasks", icon: BookOpen },
    { id: "dictionary", label: "Dictionary", icon: Book }
  ];

  return (
    <Card className="flex-1 bg-white shadow-sm border border-gray-200 overflow-hidden min-h-0">
      {/* Tab Navigation */}
      <div className="p-3 border-b bg-gray-50">
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 h-auto ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent size={14} />
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === "chat" && (
          <div className="h-full p-3">
            <OneOnOneChat />
          </div>
        )}
        {activeTab === "tasks" && (
          <div className="h-full p-3">
            <OneOnOneHomework />
          </div>
        )}
        {activeTab === "dictionary" && (
          <div className="h-full p-3">
            <EnhancedDictionary onAddToVocab={(word, def) => console.log('Add vocab:', word, def)} />
          </div>
        )}
      </div>
    </Card>
  );
}
