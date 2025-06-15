
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle,
  BookOpen,
  Book,
  Video,
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
  color: string;
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
    { id: "chat", label: "Chat", icon: MessageCircle, color: "text-blue-600" },
    { id: "tasks", label: "Tasks", icon: BookOpen, color: "text-purple-600" },
    { id: "dictionary", label: "Dictionary", icon: Book, color: "text-orange-600" }
  ];

  return (
    <div className="w-80 flex flex-col gap-4">
      {/* Student Video Section */}
      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                <AvatarImage src="/api/placeholder/100/100" />
                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-green-600 text-white text-2xl font-bold">
                  E
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{remoteUser.name}</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                <Star size={12} className="mr-1" />
                Level {remoteUser.level}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Video Feed Placeholder */}
        <div className="p-4">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <Video size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Student Video Feed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat/Tasks/Dictionary Tabs Section */}
      <Card className="flex-1 bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {/* Tab Navigation */}
        <div className="p-4 border-b border-white/20 bg-gray-50/50">
          <div className="flex gap-1">
            {rightTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeRightTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : `text-gray-600 hover:bg-white hover:${tab.color} hover:shadow-md`
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
        <div className="flex-1 overflow-hidden">
          {activeRightTab === "chat" && (
            <div className="h-full p-4">
              <OneOnOneChat />
            </div>
          )}
          {activeRightTab === "tasks" && (
            <div className="h-full p-4">
              <OneOnOneHomework />
            </div>
          )}
          {activeRightTab === "dictionary" && (
            <div className="h-full p-4">
              <EnhancedDictionary onAddToVocab={(word, def) => console.log('Add vocab:', word, def)} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
