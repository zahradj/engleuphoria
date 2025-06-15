
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle,
  BookOpen,
  Book,
  Star
} from "lucide-react";
import { OneOnOneChat } from "@/components/classroom/oneonone/OneOnOneChat";
import { OneOnOneHomework } from "@/components/classroom/oneonone/OneOnOneHomework";
import { EnhancedDictionary } from "@/components/classroom/oneonone/dictionary/EnhancedDictionary";

interface RemoteUser {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
  isOnline: boolean;
}

interface RightTab {
  id: string;
  label: string;
  icon: any;
}

interface EnhancedRightPanelProps {
  remoteUser: RemoteUser;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
}

export function EnhancedRightPanel({ 
  remoteUser, 
  activeRightTab, 
  onTabChange 
}: EnhancedRightPanelProps) {
  const rightTabs: RightTab[] = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "tasks", label: "Tasks", icon: BookOpen },
    { id: "dictionary", label: "Dictionary", icon: Book }
  ];

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Student Profile - Clean and Compact */}
      <Card className="p-4 bg-white shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/api/placeholder/100/100" />
              <AvatarFallback className="bg-green-500 text-white text-xl font-bold">
                E
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">{remoteUser.name}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-yellow-100 text-yellow-700">
              Level {remoteUser.level}
            </Badge>
            <Badge className="bg-green-100 text-green-700">
              Online
            </Badge>
          </div>

          {/* XP Progress - Simplified */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{remoteUser.xp}/{remoteUser.maxXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" 
                style={{ width: `${(remoteUser.xp / remoteUser.maxXp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat/Tasks/Dictionary Section */}
      <Card className="flex-1 bg-white shadow-md overflow-hidden min-h-0">
        {/* Tab Navigation - Clean */}
        <div className="p-3 border-b bg-gray-50">
          <div className="grid grid-cols-3 gap-1">
            {rightTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeRightTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 p-2 h-auto ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-sm' 
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
          {activeRightTab === "chat" && (
            <div className="h-full p-3">
              <OneOnOneChat />
            </div>
          )}
          {activeRightTab === "tasks" && (
            <div className="h-full p-3">
              <OneOnOneHomework />
            </div>
          )}
          {activeRightTab === "dictionary" && (
            <div className="h-full p-3">
              <EnhancedDictionary onAddToVocab={(word, def) => console.log('Add vocab:', word, def)} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
