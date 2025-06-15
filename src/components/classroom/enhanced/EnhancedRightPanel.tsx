
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle,
  BookOpen,
  Book,
  Star,
  Sparkles,
  Trophy
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
    <div className="h-full flex flex-col gap-6 max-h-[calc(100vh-8rem)]">
      {/* Enhanced Student Profile Section */}
      <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-fade-in flex-shrink-0" style={{ animationDelay: '0.5s' }}>
        <div className="p-6 bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-200/30 to-green-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl"></div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 ring-4 ring-white shadow-2xl">
                <AvatarImage src="/api/placeholder/100/100" />
                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-green-600 text-white text-3xl font-bold">
                  E
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <Star size={12} className="text-white" />
              </div>
            </div>
            
            <h3 className="font-bold text-gray-900 text-xl mb-3">{remoteUser.name}</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg px-3 py-1">
                <Trophy size={12} className="mr-1" />
                Level {remoteUser.level}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg px-3 py-1">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                Online
              </Badge>
            </div>

            {/* XP Progress */}
            <div className="w-full bg-white/60 rounded-full p-1 shadow-inner">
              <div className="flex justify-between items-center text-xs text-gray-600 mb-1 px-2">
                <span className="font-medium">Progress</span>
                <span className="font-bold">{remoteUser.xp}/{remoteUser.maxXp} XP</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 shadow-sm" 
                  style={{ width: `${(remoteUser.xp / remoteUser.maxXp) * 100}%` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Chat/Tasks/Dictionary Section */}
      <Card className="flex-1 bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden animate-fade-in min-h-0" style={{ animationDelay: '0.6s' }}>
        {/* Enhanced Tab Navigation */}
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-gray-50/80 to-blue-50/80 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {rightTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeRightTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 p-3 h-auto rounded-xl transition-all duration-200 relative group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-105' 
                      : `text-gray-600 hover:bg-white hover:${tab.color} hover:shadow-md hover:scale-102`
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="text-xs font-medium leading-tight">{tab.label}</span>
                  {tab.id === 'chat' && !isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Tab Content */}
        <div className="flex-1 overflow-hidden min-h-0">
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
